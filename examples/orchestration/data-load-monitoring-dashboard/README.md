# Data load monitoring dashboard

This example shows one `.compass/compass.json` contract being extended through four handoffs. The JSON is the current shared snapshot; decision records preserve the history. It is an example, not a product specification or implemented dashboard.

## Step 1 — Core

Core records the audience, monitoring goal, next action, workflow priority, success criterion and freshness/completeness risks in `product`. Each summary points to an accepted Core decision. Core leaves layout and pattern choices open.

## Step 2 — Interface

Interface reads the accepted Core decisions and adds `experience` and `interface` summaries. Its decisions depend on the product decisions they translate. The example keeps a recent-load table primary, puts freshness and impact nearby, opens diagnostics from a selected row, and defines a narrow-width strategy and states.

## Step 3 — Components

Components receives the table, empty-result and filter needs, then checks the registry pinned at `v1.1.0`:

| Need | Registry pattern | Registry status | Recorded selection |
| --- | --- | --- | --- |
| Compare load runs | `data-table` | `stable` | `use` |
| Explain no matching runs | `empty-state` | `stable` | `use` |
| Narrow a long history | `filters` | `planned` | `defer` |

The planned pattern remains planned. No registry metadata or status is changed by this example.

## Step 4 — Validation

The sample validation records a warning that the primary table appears visually secondary at narrow widths. It links the deviation to `DEC-008`. The open conflict also records that the audience changed before downstream decisions were reviewed. No implementation is included, so interaction-state and accessibility results remain `not-checked`.

## Supersession and impact

The original `DEC-001` records a data engineer as primary user. It remains in the history with status `superseded`; accepted `DEC-017` replaces it with an operations director and points back to `DEC-001`. The current `product.primaryUser` points to `DEC-017`.

Run the validator:

```bash
node scripts/validate-orchestration.mjs examples/orchestration/data-load-monitoring-dashboard/compass.json
```

It reports accepted descendants of `DEC-001` as potentially affected (`DEC-002` through `DEC-016`). It does not rewrite or reject them; the owner must review and update them. The existing values remain visible so the changed assumption and its consequences are understandable.
