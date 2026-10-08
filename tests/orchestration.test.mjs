import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { DEFAULT_REGISTRY_REF } from '../cli/src/registry.js';
import { validateContract, validateContractAgainstRegistry } from '../scripts/orchestration-validator.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const fixturePath = path.join(root, 'examples/orchestration/data-load-monitoring-dashboard/compass.json');
const contract = JSON.parse(await readFile(fixturePath, 'utf8'));
const registry = JSON.parse(await readFile(path.join(root, 'compass-components/registry/registry.json'), 'utf8'));
const registryById = new Map(registry.components.map((component) => [component.id, component]));

function cloneFixture() {
  return structuredClone(contract);
}

test('minimal contract is valid for incremental adoption', () => {
  assert.deepEqual(validateContract({ schemaVersion: '1.0.0' }), {
    errors: [],
    warnings: [],
    affectedDecisions: [],
  });
});

test('complete dashboard contract validates against the current registry', () => {
  const result = validateContractAgainstRegistry(contract, registry, DEFAULT_REGISTRY_REF);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.affectedDecisions, [{
    supersededDecision: 'DEC-001',
    affected: [
      'DEC-002', 'DEC-003', 'DEC-004', 'DEC-005', 'DEC-006', 'DEC-007', 'DEC-008',
      'DEC-009', 'DEC-010', 'DEC-011', 'DEC-012', 'DEC-013', 'DEC-014', 'DEC-015', 'DEC-016',
    ],
  }]);
  assert.match(result.warnings[0], /DEC-002.*DEC-016/);

  for (const selection of contract.components) {
    const registered = registryById.get(selection.patternId);
    assert.ok(registered, `missing registry pattern ${selection.patternId}`);
    assert.equal(registered.status, selection.patternStatus, `${selection.patternId} status drifted from ${DEFAULT_REGISTRY_REF}`);
  }
});

test('registry validation rejects a pattern ID absent from the registry', () => {
  const candidate = cloneFixture();
  candidate.components[0].patternId = 'nonexistent-pattern';
  const result = validateContractAgainstRegistry(candidate, registry, DEFAULT_REGISTRY_REF);
  assert.ok(result.errors.includes('/components/0 references unknown registry pattern nonexistent-pattern'));
});

test('registry validation rejects a falsified status and enforces the real planned status', () => {
  const candidate = cloneFixture();
  const filters = candidate.components.find(({ patternId }) => patternId === 'filters');
  filters.patternStatus = 'stable';
  filters.selection = 'use';

  const result = validateContractAgainstRegistry(candidate, registry, DEFAULT_REGISTRY_REF);
  assert.ok(result.errors.includes('/components/2 status stable does not match registry status planned for filters'));
  assert.ok(result.errors.includes('/components/2 cannot use or adapt planned registry pattern filters'));
});

test('filters remains valid as planned and deferred; stable patterns remain usable', () => {
  const result = validateContractAgainstRegistry(contract, registry, DEFAULT_REGISTRY_REF);
  assert.deepEqual(result.errors, []);
  assert.equal(contract.components.find(({ patternId }) => patternId === 'filters').patternStatus, 'planned');
  assert.equal(contract.components.find(({ patternId }) => patternId === 'filters').selection, 'defer');
  assert.equal(contract.components.find(({ patternId }) => patternId === 'data-table').patternStatus, 'stable');
  assert.equal(contract.components.find(({ patternId }) => patternId === 'empty-state').patternStatus, 'stable');
});

test('registry validation rejects a contract ref different from the validated local ref', () => {
  const candidate = cloneFixture();
  candidate.components[0].registryRef = 'v9.9.9';
  const result = validateContractAgainstRegistry(candidate, registry, DEFAULT_REGISTRY_REF);
  assert.ok(result.errors.includes(`/components/0 registryRef v9.9.9 does not match validated registry ref ${DEFAULT_REGISTRY_REF}`));
});

test('registry validation requires an explicit ref and a valid registry object', () => {
  assert.match(validateContractAgainstRegistry(contract, registry).errors.join('\n'), /registryRef is required/);
  assert.match(validateContractAgainstRegistry(contract, { name: 'other', components: [] }, DEFAULT_REGISTRY_REF).errors.join('\n'), /must be a Compass Components registry/);
});

test('schema rejects an invalid decision owner', () => {
  const candidate = cloneFixture();
  candidate.decisions[1].owner = 'product-manager';
  assert.match(validateContract(candidate).errors.join('\n'), /owner/);
});

test('schema rejects an invalid decision status', () => {
  const candidate = cloneFixture();
  candidate.decisions[1].status = 'needs-review';
  assert.match(validateContract(candidate).errors.join('\n'), /status/);
});

test('semantic validation detects missing dependencies and supersession targets', () => {
  const candidate = cloneFixture();
  candidate.decisions[1].dependsOn = ['DEC-999'];
  candidate.decisions.at(-1).supersedes = 'DEC-998';
  const errors = validateContract(candidate).errors.join('\n');
  assert.match(errors, /depends on missing decision DEC-999/);
  assert.match(errors, /supersedes missing decision DEC-998/);
});

test('decision IDs must be unique', () => {
  const candidate = cloneFixture();
  candidate.decisions[1].id = candidate.decisions[0].id;
  assert.match(validateContract(candidate).errors.join('\n'), /duplicate decision ID: DEC-001/);
});

test('supersession preserves the predecessor and requires a matching accepted replacement', () => {
  const candidate = cloneFixture();
  const oldDecision = candidate.decisions[0];
  const newDecision = candidate.decisions.at(-1);
  assert.equal(oldDecision.status, 'superseded');
  assert.equal(newDecision.status, 'accepted');
  assert.equal(newDecision.supersedes, oldDecision.id);

  oldDecision.status = 'accepted';
  assert.match(validateContract(candidate).errors.join('\n'), /must be superseded/);
});

test('semantic validation rejects circular dependencies', () => {
  const candidate = cloneFixture();
  candidate.decisions[1].dependsOn = ['DEC-003'];
  assert.match(validateContract(candidate).errors.join('\n'), /circular dependency/);
});

test('context references must point to accepted decisions owned by that layer', () => {
  const candidate = cloneFixture();
  candidate.product.primaryUser.decisionId = 'DEC-007';
  assert.match(validateContract(candidate).errors.join('\n'), /must reference a core-owned decision/);

  candidate.product.primaryUser.decisionId = 'DEC-001';
  assert.match(validateContract(candidate).errors.join('\n'), /must reference an accepted decision/);
});

test('component selections cannot present planned registry patterns as usable patterns', () => {
  const candidate = cloneFixture();
  candidate.components.at(-1).selection = 'use';
  assert.match(validateContract(candidate).errors.join('\n'), /cannot use or adapt planned pattern filters/);
});

test('current component selections reference accepted Components decisions', () => {
  const candidate = cloneFixture();
  const selectionDecision = candidate.decisions.find(({ id }) => id === 'DEC-014');
  selectionDecision.status = 'proposed';
  assert.match(validateContract(candidate).errors.join('\n'), /must reference an accepted decision/);
});

test('conflicts and validation deviations must reference existing decisions', () => {
  const candidate = cloneFixture();
  candidate.conflicts[0].decisionId = 'DEC-999';
  candidate.validation.deviations[0].decisionId = 'DEC-998';
  const errors = validateContract(candidate).errors.join('\n');
  assert.match(errors, /conflicts\/0 references missing decision DEC-999/);
  assert.match(errors, /validation\/deviations\/0 references missing decision DEC-998/);
});

test('schema rejects chain-of-thought fields and keeps concise rationale distinct', () => {
  const candidate = cloneFixture();
  candidate.decisions[1].chainOfThought = 'private scratchpad';
  assert.match(validateContract(candidate).errors.join('\n'), /must NOT have additional properties/);

  const concise = cloneFixture();
  concise.decisions[1].rationale = 'The request is to monitor operational data loads.';
  assert.deepEqual(validateContract(concise).errors, []);
});

test('schema version mismatch is rejected explicitly', () => {
  const candidate = cloneFixture();
  candidate.schemaVersion = '2.0.0';
  assert.match(validateContract(candidate).errors.join('\n'), /schemaVersion/);
});
