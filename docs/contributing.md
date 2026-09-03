# Contributing

Compass is a product reasoning layer for responsive Web experiences. Contributions should make agents better at choosing what exists, what matters first and what can be removed—not merely better at reproducing visual trends.

## Principles

- Keep Compass Core runtime-agnostic; runtime-specific instructions belong in `docs/` or optional adapters.
- Justify new heuristics with user behavior, decision quality, trust, accessibility, performance, implementation cost or measurable product impact.
- Do not add a rule because a pattern is fashionable or common in a reference product.
- Keep references focused and one level deep from `SKILL.md`.
- Do not add telemetry, credentials, network calls or executable dependencies to Core.

## Changes and tests

Update `VERSION` and `CHANGELOG.md` according to SemVer. Preserve the critical scenarios and add a new scenario only when it catches a meaningful failure mode. Run `python tests/validate_package.py` (or the available Python command), `skills-ref validate .` when installed, and inspect all changed relative links.

For runtime documentation, link to official current sources and mark unsupported or undocumented capabilities explicitly. Do not add commands from memory. For conceptual changes, test search-first, high-density product, dashboard, ready-to-buy landing page and existing-repository redesign behavior.
