# Audit and review protocol

Use before redesigning or editing an existing interface. Diagnose first; do not redraw from taste.

## Evidence pass

Inspect the live or supplied screen, relevant code/routes, shared components, tokens, styles, responsive rules, content, business logic, analytics and documentation. Trace the primary flow and identify what the current implementation actually does. Separate observed facts from inferences and proposed changes.

## Audit output

Create a compact brief, then list findings with:

- severity: P0 blocks the main task; P1 harms comprehension/conversion; P2 creates meaningful friction; P3 inconsistency; P4 cosmetic;
- evidence and affected user/task;
- likely cause;
- recommendation and expected product effect;
- implementation scope/risk and validation method.

Fix P0/P1 before P3/P4. A visually cleaner redesign is a regression if it hides required information, weakens trust, adds decisions, breaks semantics, or makes the main action less discoverable.

## UX lint taxonomy

Use precise labels where useful: `UX-ATTENTION` wrong visual weight; `UX-CTA` competing primary actions; `UX-FRICTION` unjustified step/field/click; `UX-DENSITY` necessary information hidden; `UX-NOISE` nonfunctional decoration; `UX-NAV` too many premature options; `UX-TRUST` insufficient decision evidence; `UX-CONTEXT` unexplained prerequisite knowledge; `UX-HIERARCHY` unclear first observation; `UX-COPY` nonfunctional text; `UX-DECORATION` styling competes with function; `UX-PATTERN` trend-driven component choice.

## Post-change review

Re-run the primary task from a clean state and as a returning user. Check all relevant states, keyboard/focus order, semantics, responsive reordering, touch targets, reduced motion, loading/layout stability, errors and analytics. Compare the result against the product brief and report regressions or unresolved decisions. Do not claim success from visual similarity alone.
