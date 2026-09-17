---
name: compass-interface
description: "Design visual, CSS, interfaces Web responsivas e acessíveis."
---

# Compass Interface

Translate product decisions into a distinctive, coherent, accessible and maintainable Web interface. Explain the functional reason for important choices of type, color, spacing, imagery, interaction and CSS. Work in the user's language and the project's stack; React is optional.

## When to use

Use for visual design, styling, CSS debugging, responsive layouts, component states, design systems and visual implementation reviews. Recognize requests such as "melhore o design", "arrume o CSS", "deixe responsivo" and "crie a interface". For a review or diagnosis, inspect and recommend; implement when the user requests changes. Scale the work: a wrapping bug needs a focused fix, while a new experience needs composition and state design.

For a proposal-only request, deliver the direction, composition, states and validation plan without implementing. If code or visual artifacts are unavailable, provide a conditional assessment and identify the smallest missing artifact; do not invent selectors, screenshots or completed checks.

## Relationship with Compass

Use `compass`, when installed and relevant, for unresolved product/UX decisions. Use this skill for visual expression and frontend behavior. Either skill can work independently. If Compass is unavailable, use the supplied brief and infer only the missing essentials; do not block a bounded styling task on discovery.

Carry a compact handoff into implementation: user/task, dominant object/action, information priority, trust evidence, required states, existing brand/tokens and constraints. Reuse answers already in the conversation. For a localized change, the affected task and constraints are enough. Escalate a missing decision only when it would materially change the result.

## Non-negotiable visual lens

Visual design is functional communication. Typography establishes roles and reading rhythm; spacing establishes grouping; color establishes hierarchy and state; shape and elevation establish boundaries; motion establishes cause, progress or continuity. Every visual decision must help users perceive, understand, decide, act, recover or trust.

Use mature systems as references for principles, not surfaces to copy. Study why a convention works, what density and accessibility problem it solves, what tradeoff it introduces and whether the current product needs it.

## Procedure

1. Read the product brief and identify the dominant object, action, content density, trust burden and failure states.
2. Inspect the repository before editing: framework, routes, existing components, tokens, CSS architecture, fonts, breakpoints, assets, conventions and build constraints.
3. For substantial design work, state a visual direction in a few sentences: density, type hierarchy, color roles, composition, imagery and interaction character. Derive it from the audience, content and brand. Extend the existing system where possible.
4. Resolve the highest-risk region with realistic content first: a long result, comparison table, purchase summary or error-prone form. Establish only the tokens and primitives the task needs, then compose the screen.
5. Implement usable behavior alongside appearance: real actions or explicitly identified prototypes, pending and failure feedback, focus, responsive changes and long-content handling. Avoid controls that look active but do nothing.
6. Render, inspect, correct and recheck the affected flow when tools allow. Separate visual evidence, runtime checks and source-only reasoning. Report untested conditions honestly.

Load only references needed for the current decision; complete their relevant instructions before acting:

- For visual foundations and component decisions, read [visual-system.md](references/visual-system.md).
- For CSS/frontend implementation, read [css-implementation.md](references/css-implementation.md).
- For reviewing an existing visual implementation, read [visual-audit.md](references/visual-audit.md).
- For forms, search, tables, overlays and interactive states, read [interaction-patterns.md](references/interaction-patterns.md).
- For lessons from Google, eBay, GitHub and other mature systems, read [product-lessons.md](references/product-lessons.md). It contains source-backed lessons and explicit transfer limits.

## Working in Hermes

Keep the procedure and reference paths in this file; no behavior depends on `agents/openai.yaml`. When available, use `skill_view` with `name="compass-interface"` and `path="references/css-implementation.md"` (or the chosen reference). Otherwise read relative to this skill's actual location, not the application working directory. A local copy must include all linked references.

Use the tools actually exposed by the session. With a browser, inspect the rendered local page and relevant interactions. With terminal/file access only, inspect and implement in the repository, run available checks, and mark visual verification pending. With screenshots only, assess visible composition without claiming knowledge of CSS, keyboard behavior or hidden states. Text extraction of a reference website supports content research, not visual verification. Lack of a browser should not stop useful work.

For longer tasks, preserve the brief, chosen direction, touched files, evidence and next check in the project's existing work notes when appropriate. Reuse that record after context compression. Store reusable lessons only when an authorized skill-maintenance workflow calls for it; one project's brand or an untested guess must not become a global design rule.

## CSS and frontend rules

- Reuse existing tokens and primitives when they are sound; extend the system only when the product requires a missing semantic role.
- Prefer semantic HTML, intrinsic layout, CSS custom properties, logical properties, container-aware composition and progressive enhancement.
- Keep component styles local in responsibility, but keep tokens global and named by meaning rather than appearance.
- Treat responsive design as reprioritization: change order, density, controls and interaction when needed; do not merely shrink desktop.
- Keep interaction states explicit: hover is optional, focus is mandatory, pressed/selected/expanded/loading/error states must communicate without color alone.
- Avoid magic numbers, excessive absolute positioning, arbitrary z-indexes, duplicated media queries, specificity wars and styles that depend on accidental DOM order.
- Do not add a dependency, animation, icon, font or image when a native or existing project capability is sufficient.

## Pitfalls

Do not equate polish with sparse content, fixed-height cards, faint secondary text or animation. Do not impose a palette, font, theme or layout because it is fashionable. Aesthetic expression can be quiet, editorial, dense or expressive when the product supports it. Readability, identity and useful hierarchy must survive all states.

Never infer a company's internal experiments or conversion gains from its appearance. Record reference observation/source, interpretation, context fit, tradeoff and a test; keep observations separate from hypotheses. For precise or current platform behavior, consult the official source when browsing is available. Without it, qualify the assumption.

## Verification and handoff

The implementation preserves the product brief and has a visible hierarchy, readable type, stable layout, intentional density and consistent states. It works with keyboard navigation, focus visibility, screen readers, zoom, high contrast where applicable, reduced motion, touch targets, long labels, missing imagery and narrow widths. It does not introduce avoidable layout shift, oversized assets, inaccessible contrast, fragile selectors or one-off visual exceptions.

When handing off, report the changes and key reasons, files or preview, responsive/state behavior, checks actually run and material gaps. Automated checks or a screenshot alone do not establish accessibility compliance or production performance. Keep the report proportional to the task.
