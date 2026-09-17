# CSS and frontend implementation

Use this reference when implementing or refactoring a visual interface in a repository.

## Inspect before editing

Identify the framework and rendering model, global styles, token source, component conventions, CSS modules or utility strategy, build/lint/type checks, asset pipeline, supported browsers and existing responsive breakpoints. Follow the repository's established approach unless it causes a demonstrated defect.

## Layering model

Keep the implementation understandable by separating:

1. tokens: semantic custom properties for color, type, spacing, radius, border, elevation and motion;
2. primitives: layout, text, surface, control and feedback primitives;
3. components: reusable interaction and content units;
4. composition: page-specific regions and responsive ordering;
5. state: loading, validation, permission, success, empty, error and transient feedback.

Do not bury product decisions in a generic component. Keep page composition able to express the actual information hierarchy.

## Layout guidance

Prefer grid for two-dimensional page structure, flex for one-dimensional alignment, normal flow for content and absolute positioning only for a bounded overlay or decoration. Use `minmax`, `clamp`, intrinsic sizing and container queries where supported by the project. Reserve fixed heights for cases with a real constraint; content should not be clipped because a card was designed around a screenshot.

Use logical properties when the project supports internationalized layouts. Keep focus order aligned with visual and semantic order. If a visual reorder is necessary, verify keyboard and screen-reader order explicitly.

## Interaction and motion

Give every interactive element a visible focus state and a target size appropriate to the context. Hover may enhance but must not carry essential information. Use motion to explain state, preserve spatial continuity or indicate progress. Respect `prefers-reduced-motion` and avoid animations that delay reading or action.

## Verification

Check at least one wide, medium and narrow viewport; keyboard-only navigation; zoom or large text; long and missing content; loading and error states; and the project's lint, typecheck or build command. Review for overflow, layout shift, contrast, broken focus, hidden content, specificity regressions and unnecessary asset weight.
