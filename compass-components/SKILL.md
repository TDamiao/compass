---
name: compass-components
description: "Select and adapt accessible, responsive, production-oriented interface patterns to an existing product and codebase. Use after the product need is understood, before implementing reusable interface components."
---

# Compass Components

Use the catalog as implementation knowledge for humans and AI coding agents. It is not a source of templates to copy mechanically, and its presence does not prove a pattern belongs in a product.

## Relationship with Compass

- `compass` decides what the experience should contain and prioritize.
- `compass-interface` decides how that experience should communicate visually and behave.
- `compass-components` helps implement an appropriate reusable pattern in the project's stack.

The sequence is **Need → Pattern → Adaptation → Implementation → Validation**. Resolve product intent before selecting a component. If the decision is already clear, do not repeat discovery.

## Procedure

1. **Understand the request.** Name the user task, object, action, context, information density, risk and required states. Clarify only material unknowns.
2. **Validate the pattern.** Check that it fits navigation, decision architecture, content relationships, frequency, permissions and responsive context. State when a catalog pattern is not appropriate and offer a smaller fit.
3. **Inspect the project.** Read its routes, framework, existing design system, components, tokens, accessibility primitives, styling conventions, state/data contracts and checks before editing.
4. **Prefer healthy existing components.** Reuse and extend a sound local component. Replace one only for a demonstrated functional, accessibility, maintenance or product reason; preserve its consumers and explain the change.
5. **Adapt, do not transplant.** Treat Compass examples as reference implementations. Preserve the project's stack, architecture, brand, semantic tokens, naming, localization, routing, data contracts and conventions. Map component roles to existing tokens; never impose a Compass palette.
6. **Implement real behavior and states.** Connect controls to real actions and data. Include only applicable states such as default, hover, focus, active, selected, disabled, pending/loading, empty, error, permission-restricted, collapsed and mobile. Never present a simulated action as working.
7. **Treat responsive design as reprioritization.** Reconsider order, navigation, density, comparison, reach and available actions at each width; do not merely shrink desktop dimensions.
8. **Preserve accessibility.** Use semantic HTML and native behavior first. Cover names, labels, descriptions, errors, keyboard/focus, announcements, contrast, zoom, target size and reduced motion as relevant. ARIA never substitutes for behavior.
9. **Control dependencies.** Reuse project primitives and platform capabilities. Add a dependency only when a concrete requirement justifies its cost and it fits the repository.
10. **Validate proportionally.** Run existing requested checks; inspect changed paths, states, keyboard use and narrow/wide layouts when tools allow. Distinguish source review from rendered verification and report gaps honestly.

## Catalog use

Read only the relevant component guide and metadata. Each guide describes fit, anatomy, variants, states, responsive behavior, accessibility, tokens, dependencies, examples, agent advice and tradeoffs. A status of `planned` means guidance is not yet implemented. A `reference` implementation is not a universal API or framework requirement.

Registry entries use stable IDs and paths relative to this bundle. The registry contract is in [references/registry.md](references/registry.md); authoring is in [references/authoring.md](references/authoring.md); semantic token adaptation is in [references/foundations.md](references/foundations.md). AI interaction safety is in [references/ai-patterns.md](references/ai-patterns.md).

## Handoff

Report why the pattern fits, what was adapted to the project, important behavior/accessibility choices, validation performed, and remaining tradeoffs. Do not report only that a component was added.
