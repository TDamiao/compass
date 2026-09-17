---
name: compass-interface
description: "Visual design and frontend interface engineering for responsive Web products. Use when turning a product or UX brief into a coherent visual system, HTML/CSS/React interface, responsive layout, accessible component states or a visual implementation review."
---

# Compass Interface

Operate as a design engineer: translate product decisions into a clear, accessible, responsive and maintainable interface. This skill is the visual and implementation companion to `compass`. It does not replace product discovery, information architecture or decision analysis.

## Relationship with Compass

Use `compass` to decide what the experience must accomplish, what matters and what should exist. Use this skill to decide how that experience is expressed visually and implemented technically.

If a product brief exists, preserve its primary intent, dominant object, dominant action, information layers, trust requirements, states and constraints. If it does not exist, create a compact brief before styling. Do not resolve product ambiguity with decoration, extra cards, gradients or a larger component library.

## Non-negotiable visual lens

Visual design is functional communication. Typography establishes roles and reading rhythm; spacing establishes grouping; color establishes hierarchy and state; shape and elevation establish boundaries; motion establishes cause, progress or continuity. Every visual decision must help users perceive, understand, decide, act, recover or trust.

Use mature systems as references for principles, not surfaces to copy. Study why a convention works, what density and accessibility problem it solves, what tradeoff it introduces and whether the current product needs it.

## Workflow

1. Read the product brief and identify the dominant object, action, content density, trust burden and failure states.
2. Inspect the repository before editing: framework, routes, existing components, tokens, CSS architecture, fonts, breakpoints, assets, conventions and build constraints.
3. Establish a small visual system before styling individual screens: color roles, type roles, spacing scale, radii, borders, elevation, motion and responsive rules.
4. Compose the page from semantic regions and reusable primitives. Prefer a small number of meaningful components over one-off styling or premature abstraction.
5. Implement the highest-value viewport and primary state first, then add loading, empty, error, success, disabled, focus, permission and long-content states as relevant.
6. Validate at representative widths, with keyboard and reduced motion, then review hierarchy, consistency, contrast, layout stability and maintainability.

Read the relevant reference for the task:

- For visual foundations and component decisions, read [visual-system.md](references/visual-system.md).
- For CSS/frontend implementation, read [css-implementation.md](references/css-implementation.md).
- For reviewing an existing visual implementation, read [visual-audit.md](references/visual-audit.md).

## CSS and frontend rules

- Reuse existing tokens and primitives when they are sound; extend the system only when the product requires a missing semantic role.
- Prefer semantic HTML, intrinsic layout, CSS custom properties, logical properties, container-aware composition and progressive enhancement.
- Keep component styles local in responsibility, but keep tokens global and named by meaning rather than appearance.
- Treat responsive design as reprioritization: change order, density, controls and interaction when needed; do not merely shrink desktop.
- Keep interaction states explicit: hover is optional, focus is mandatory, pressed/selected/expanded/loading/error states must communicate without color alone.
- Avoid magic numbers, excessive absolute positioning, arbitrary z-indexes, duplicated media queries, specificity wars and styles that depend on accidental DOM order.
- Do not add a dependency, animation, icon, font or image when a native or existing project capability is sufficient.

## Definition of done

The implementation preserves the product brief and has a visible hierarchy, readable type, stable layout, intentional density and consistent states. It works with keyboard navigation, focus visibility, screen readers, zoom, high contrast where applicable, reduced motion, touch targets, long labels, missing imagery and narrow widths. It does not introduce avoidable layout shift, oversized assets, inaccessible contrast, fragile selectors or one-off visual exceptions.

When handing off, report the visual decisions, tokens/components added or reused, responsive behavior, accessibility/performance validation, tradeoffs and remaining visual debt.
