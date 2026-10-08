import Ajv2020 from 'ajv/dist/2020.js';
import schema from '../schemas/compass-orchestration.schema.json' with { type: 'json' };

const ajv = new Ajv2020({ allErrors: true, strict: true });
const validateSchema = ajv.compile(schema);

const contextOwners = {
  product: 'core',
  experience: 'interface',
  interface: 'interface',
};

export function validateContract(contract) {
  const errors = [];
  const warnings = [];

  if (!validateSchema(contract)) {
    for (const error of validateSchema.errors ?? []) {
      errors.push(`${error.instancePath || '/'} ${error.message}`);
    }
    return { errors, warnings, affectedDecisions: [] };
  }

  const decisions = contract.decisions ?? [];
  const byId = new Map();
  for (const decision of decisions) {
    if (byId.has(decision.id)) {
      errors.push(`duplicate decision ID: ${decision.id}`);
    } else {
      byId.set(decision.id, decision);
    }
  }

  const successors = new Map();
  const dependents = new Map(decisions.map(({ id }) => [id, []]));
  for (const decision of decisions) {
    for (const dependencyId of decision.dependsOn) {
      if (!byId.has(dependencyId)) {
        errors.push(`${decision.id} depends on missing decision ${dependencyId}`);
      } else {
        dependents.get(dependencyId).push(decision.id);
      }
    }

    if (decision.supersedes) {
      const previous = byId.get(decision.supersedes);
      if (!previous) {
        errors.push(`${decision.id} supersedes missing decision ${decision.supersedes}`);
        continue;
      }
      if (decision.status !== 'accepted' || previous.status !== 'superseded') {
        errors.push(`${decision.id} must be accepted and ${previous.id} must be superseded`);
      }
      if (decision.owner !== previous.owner || decision.type !== previous.type) {
        errors.push(`${decision.id} must preserve the owner and type of ${previous.id}`);
      }
      successors.set(previous.id, [...(successors.get(previous.id) ?? []), decision.id]);
    }
  }

  for (const decision of decisions) {
    if (decision.status === 'superseded' && !successors.has(decision.id)) {
      errors.push(`${decision.id} is superseded without a replacement decision`);
    }
    if (successors.get(decision.id)?.length > 1) {
      errors.push(`${decision.id} has more than one direct replacement`);
    }
  }

  detectDependencyCycles(decisions, byId, errors);
  validateContextReferences(contract, byId, errors);

  for (const [index, selection] of (contract.components ?? []).entries()) {
    const decision = byId.get(selection.decisionId);
    if (!decision) {
      errors.push(`/components/${index} references missing decision ${selection.decisionId}`);
    } else if (decision.owner !== 'components') {
      errors.push(`/components/${index} decision ${decision.id} must be owned by components`);
    } else if (decision.status !== 'accepted') {
      errors.push(`/components/${index} must reference an accepted decision, got ${decision.status} ${decision.id}`);
    }
    if (selection.patternStatus === 'planned' && ['use', 'adapt'].includes(selection.selection)) {
      errors.push(`/components/${index} cannot use or adapt planned pattern ${selection.patternId}`);
    }
  }

  for (const [index, conflict] of (contract.conflicts ?? []).entries()) {
    if (!byId.has(conflict.decisionId)) {
      errors.push(`/conflicts/${index} references missing decision ${conflict.decisionId}`);
    }
  }

  for (const [index, deviation] of (contract.validation?.deviations ?? []).entries()) {
    if (!byId.has(deviation.decisionId)) {
      errors.push(`/validation/deviations/${index} references missing decision ${deviation.decisionId}`);
    }
  }

  const affectedDecisions = findAcceptedDescendants(decisions, byId, dependents);
  for (const { supersededDecision, affected } of affectedDecisions) {
    warnings.push(`superseding ${supersededDecision} may affect accepted decisions: ${affected.join(', ')}`);
  }

  return { errors, warnings, affectedDecisions };
}

export function validateContractAgainstRegistry(contract, registry, registryRef) {
  const result = validateContract(contract);
  if (result.errors.length) return result;

  if (typeof registryRef !== 'string' || !registryRef.trim()) {
    result.errors.push('registryRef is required when validating against a registry');
    return result;
  }
  if (!isRecord(registry) || registry.name !== 'compass-components' || !Array.isArray(registry.components)) {
    result.errors.push('validated registry must be a Compass Components registry with a components array');
    return result;
  }

  const registryById = new Map();
  for (const [index, pattern] of registry.components.entries()) {
    if (!isRecord(pattern) || typeof pattern.id !== 'string' || !pattern.id.trim()) {
      result.errors.push(`validated registry component at index ${index} has no valid id`);
      continue;
    }
    if (!['stable', 'draft', 'planned'].includes(pattern.status)) {
      result.errors.push(`validated registry pattern ${pattern.id} has invalid status ${pattern.status}`);
      continue;
    }
    if (registryById.has(pattern.id)) {
      result.errors.push(`validated registry contains duplicate pattern ${pattern.id}`);
      continue;
    }
    registryById.set(pattern.id, pattern);
  }

  if (result.errors.length) return result;

  for (const [index, selection] of (contract.components ?? []).entries()) {
    const path = `/components/${index}`;
    const pattern = registryById.get(selection.patternId);
    if (!pattern) {
      result.errors.push(`${path} references unknown registry pattern ${selection.patternId}`);
      continue;
    }
    if (selection.registryRef !== registryRef) {
      result.errors.push(`${path} registryRef ${selection.registryRef} does not match validated registry ref ${registryRef}`);
    }
    if (selection.patternStatus !== pattern.status) {
      result.errors.push(`${path} status ${selection.patternStatus} does not match registry status ${pattern.status} for ${selection.patternId}`);
    }
    if (pattern.status === 'planned' && ['use', 'adapt'].includes(selection.selection)) {
      result.errors.push(`${path} cannot use or adapt planned registry pattern ${selection.patternId}`);
    }
  }

  return result;
}

function validateContextReferences(contract, byId, errors) {
  for (const [section, expectedOwner] of Object.entries(contextOwners)) {
    visitContextValues(contract[section], (contextValue, path) => {
      const decision = byId.get(contextValue.decisionId);
      if (!decision) {
        errors.push(`${path} references missing decision ${contextValue.decisionId}`);
      } else if (decision.status !== 'accepted') {
        errors.push(`${path} must reference an accepted decision, got ${decision.status} ${decision.id}`);
      } else if (decision.owner !== expectedOwner) {
        errors.push(`${path} must reference a ${expectedOwner}-owned decision, got ${decision.owner} ${decision.id}`);
      }
    }, `/${section}`);
  }
}

function visitContextValues(value, visit, path) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => visitContextValues(item, visit, `${path}/${index}`));
  } else if (value && typeof value === 'object') {
    if (Object.hasOwn(value, 'value') && Object.hasOwn(value, 'decisionId')) {
      visit(value, path);
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      visitContextValues(child, visit, `${path}/${key}`);
    }
  }
}

function detectDependencyCycles(decisions, byId, errors) {
  const visited = new Set();
  const active = new Set();

  function visit(id, path) {
    if (active.has(id)) {
      const start = path.indexOf(id);
      errors.push(`circular dependency: ${[...path.slice(start), id].join(' -> ')}`);
      return;
    }
    if (visited.has(id)) return;
    active.add(id);
    for (const dependencyId of byId.get(id)?.dependsOn ?? []) {
      if (byId.has(dependencyId)) visit(dependencyId, [...path, id]);
    }
    active.delete(id);
    visited.add(id);
  }

  for (const { id } of decisions) visit(id, []);
}

function findAcceptedDescendants(decisions, byId, dependents) {
  const impacts = [];
  for (const decision of decisions.filter(({ status }) => status === 'superseded')) {
    const visited = new Set();
    const pending = [...(dependents.get(decision.id) ?? [])];
    const affected = new Set();
    while (pending.length) {
      const currentId = pending.shift();
      if (visited.has(currentId)) continue;
      visited.add(currentId);
      if (byId.get(currentId)?.status === 'accepted') affected.add(currentId);
      pending.push(...(dependents.get(currentId) ?? []));
    }
    if (affected.size) {
      impacts.push({ supersededDecision: decision.id, affected: [...affected].sort() });
    }
  }
  return impacts;
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
