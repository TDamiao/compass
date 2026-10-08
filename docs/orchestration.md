# Compass Orchestration

Compass Orchestration is a shared handoff protocol for Compass Core, Compass Interface and Compass Components. It is **not a fourth skill or a supervisor agent**. Each existing skill keeps its own responsibility and can still be used by itself.

## Why a contract exists

The skills already pass compact product, interface and component needs through their instructions and the conversation. A project can persist those decisions when work spans several stages, so the next skill can consume settled context instead of rediscovering it. The contract also gives implementers and reviewers a way to see ownership, dependencies, conflicts, changes and validation in one place.

The contract is optional. A small audit, a bounded CSS fix, an analysis-only request or a runtime without project file access can keep using the existing conversational handoff. For substantial work across layers, Core creates the contract in the project when it can write there.

## File and schema

The project stores one file:

```text
.compass/compass.json
```

It is validated against [`schemas/compass-orchestration.schema.json`](../schemas/compass-orchestration.schema.json), with `schemaVersion: "1.0.0"`. Context, decisions, component selections, conflicts and validation stay together so they cannot drift across synchronized files. The schema keeps fields optional for incremental adoption and rejects unknown fields. Additive contract changes should be introduced through a deliberate schema version update.

Run the repository validator on the example or another contract:

```bash
npm run validate:orchestration
node scripts/validate-orchestration.mjs path/to/.compass/compass.json
```

The JSON Schema validates contract shape; the semantic validator checks decision relationships, ownership references, IDs, cycles and supersession. When run with the repository's local Components registry, it also verifies that each selected pattern exists, its status matches the registry, planned patterns are not marked for use/adaptation, and each selection's `registryRef` matches the ref being validated. The local ref is the canonical `DEFAULT_REGISTRY_REF` in `cli/src/registry.js`; no network lookup is performed. Compass Components' registry remains the source of truth for pattern IDs and status. The validator reports accepted descendants of superseded decisions as potentially affected; it does not rewrite decisions or decide whether they remain valid.

## Ownership

| Owner | Owns | Does not silently change |
| --- | --- | --- |
| `core` | Primary user, product goal/action, priority, workflow, trust/risk and success criteria | Interface and component choices |
| `interface` | Information architecture, layout, hierarchy, density, interaction model, responsive behavior and interface states | Core product intent or registry status |
| `components` | Need-to-pattern selection, variant/adaptation choice and registry status/ref recorded for that choice | Product intent, interface hierarchy or registry metadata |
| `implementation` | Technical implementation decisions that preserve accepted product/interface/component decisions | Accepted decisions owned by other layers |
| `validation` | Conformity results, conflicts and implementation deviations | Silent resolution of another owner's decision |

If a layer discovers a material conflict with another owner's accepted decision, it records the conflict and proposed resolution and brings it to that owner. It does not update the other layer's section as if the decision had changed.

## Context and decision records

Top-level context blocks are current handoff summaries. Every context value points to an accepted decision by ID. The `decisions` array is the history and the source for lifecycle/dependency checks. Decisions record only observable outcomes, concise rationale and evidence references—not internal reasoning.

Each decision has a stable `id`, `owner`, `type`, concise `decision`, `status` and `dependsOn` array. `rationale` and `references` are optional. The statuses are:

- `proposed`: unresolved option or recommendation not yet selected as the working decision;
- `accepted`: the owner's current supported working decision; it does not claim separate human approval;
- `superseded`: preserved history replaced by a later decision;
- `rejected`: considered and not selected.

IDs are unique within a contract. `dependsOn` names decisions that materially support the current decision. It is a lightweight record, not a task scheduler or a calculated graph.

## Handoff

1. Core reads any accepted history, fills product context and records Core decisions without choosing the visual solution or component prematurely.
2. Interface consumes accepted Core context, preserves its ownership and adds interface decisions with dependencies on the product decisions they translate.
3. Components turns the interface need into a registry selection, records the exact pattern status and ref, and depends on the relevant Interface decision. A planned pattern remains `planned` and is recorded as `defer` or `unavailable`.
4. An implementer treats accepted decisions as constraints. Technical details remain open when they do not change them. An unavoidable change is proposed and recorded as a conflict or deviation for review.
5. Validation records product intent, interface hierarchy, component use, interaction states and accessibility as `not-checked`, `pass`, `warning` or `fail`, and links deviations to the decisions they affect.

When the contract is absent, the existing skills and their compact conversational handoffs continue to work.

## Dependencies and supersession

Never delete or silently overwrite an accepted decision. Add the replacement with the same owner and type, set its `supersedes` to the old ID, and mark the old decision `superseded`. Update the current context to reference the replacement. The old record and its dependents stay visible.

The validator reports accepted decisions that transitively depend on a superseded decision. This is a potential impact list, not automatic invalidation. Their owners review those decisions and then keep, revise or supersede them. Proposed and rejected records remain history but are not reported as active impacts.

## Conflicts and validation

A conflict records the affected `decisionId`, `type`, `reason`, `proposedResolution` and `open`/`resolved` status. A resolved conflict also records its resolution. Conflicts make incompatible requirements visible without introducing an approval workflow.

A validation deviation records the affected decision and the observable issue; an optional proposed resolution makes next steps clear. A warning means review is needed, not that the validator has changed the underlying decision. An unresolved disagreement remains a conflict even if implementation work continues around it.

## Privacy boundary

Never store chain-of-thought, hidden reasoning, private scratchpad, token-level intermediate work or internal traces in this file. Store only decisions, concise rationale, evidence/reference, owner, status, dependency, conflict and outcome. Known fields are explicitly defined by the schema; unknown fields are rejected.

## Example

[`examples/orchestration/data-load-monitoring-dashboard/`](../examples/orchestration/data-load-monitoring-dashboard/README.md) shows the Core → Interface → Components → Validation handoff in one evolving contract. It uses the actual `data-table` and `empty-state` stable patterns and records `filters` as planned/deferred from the current registry. It also preserves a primary-user decision supersession and reports the accepted downstream decisions that need review.

## Current limits

Orchestration does not make product decisions automatically, execute workflows, create agents, enforce approvals, render visual diffs or apply supersession. The current validator checks structure and explicit links; owners still judge evidence, implementation fit, accessibility and whether impacted decisions should change.
