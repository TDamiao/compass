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

## Diagnose before overriding

Reproduce the width and state first. Inspect the winning declaration, inherited values, box model, containing block and ancestors. Determine whether the cause is content, intrinsic minimum size, cascade, overflow or stacking before changing selectors. In a utility-based project, inspect composed classes and variants; do not introduce a second styling system to solve one component.

| Symptom | Inspect first | Targeted response |
| --- | --- | --- |
| Flex/grid child pushes page wider | Intrinsic minimum, long strings, fixed widths | Consider `min-inline-size: 0`, `minmax(0, 1fr)` or wrapping on the affected child |
| Overlay clips or appears behind content | Ancestor overflow, transforms, stacking contexts | Correct the containing/stacking context or use the project's overlay primitive |
| Sticky panel fails or covers controls | Scroll ancestor, inset, panel height | Correct overflow/inset and constrain the panel; verify short viewports and zoom |
| Text spills from cards/buttons | Fixed height, nowrap, absolute content | Allow intrinsic height and wrapping while preserving action/evidence |
| Rule changes unrelated pages | Global selectors, specificity and import order | Scope the affected component and check shared consumers |
| Mobile full-height screen clips | Browser chrome, keyboard and viewport units | Prefer scrollable content and suitable `min-block-size`; test the actual viewport behavior |

Do not mask page overflow with a global `overflow-x: hidden`. It can conceal inaccessible content and clipped focus. Horizontal scrolling may be intentional for a genuine data table; identify and label that region rather than allowing the entire page to drift.

## Small CSS recipes

Adapt these isolated examples to existing tokens and class conventions; they are not a stylesheet to paste wholesale.

```css
/* Intrinsic columns that also survive a narrower container. */
.results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: var(--space-group);
}

/* A reading region should be able to shrink inside grid/flex. */
.result-summary {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

/* Scope motion and preserve a static state for reduced motion. */
.action:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: no-preference) {
  .action {
    transition: background-color 120ms ease-out;
  }
}
```

Apply aggressive wrapping only to content that benefits from it, such as unbroken URLs. Keep prices and short numeric values comprehensible. Example dimensions and timings are starting points, not requirements.

Use viewport queries for page composition and size container queries for reusable regions whose available space varies. Establish an ancestor query container; a size query does not restyle its own container based on itself. Provide a usable base layout and check the target browsers. See [MDN container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries).

## Cascade and states

Follow the project's CSS Modules, utility, component or plain CSS convention. Use low-specificity selectors and documented modifier/state attributes. Cascade layers can make ordering explicit in a compatible project, but introducing them changes precedence relative to unlayered styles; inspect before adopting. Use `!important` only for an understood constraint and document the reason.

Use application state as the source of truth. Pair styling with behavior: `aria-expanded` must match visibility, invalid styling must accompany a useful error, and disabled styling must match actual interaction. A CSS class cannot substitute for a button's semantics or event handling.

## Interaction and motion

Give every interactive element a visible focus state and a target size appropriate to the context. Hover may enhance but must not carry essential information. Use motion to explain state, preserve spatial continuity or indicate progress. Respect `prefers-reduced-motion` and avoid animations that delay reading or action.

Animate only the property that needs to change. Prefer transform/opacity for suitable movement and fading, while checking actual paint/layout cost. Avoid `transition: all`, permanent `will-change` and global animation overrides that break progress indicators or event-dependent behavior. Reduced motion should preserve understandable feedback.

## Assets, loading and frameworks

Reserve media dimensions with accurate width/height or aspect ratio. Match skeleton geometry to the eventual content. Avoid lazy-loading the likely first-screen primary image; defer offscreen media appropriately. Use responsive image sources and the project's font-loading strategy; do not add external fonts for a minor styling fix. Layout stability depends on dynamic content and fonts as well as images: [web.dev CLS guidance](https://web.dev/articles/optimize-cls).

In a component framework, reuse its established state and rendering conventions. Check stale search responses, duplicate submissions and focus after async updates. Treat hydration warnings and duplicate interactive markup as behavior defects. Do not change routing, server/client boundaries or add a component library unless the requested interaction requires it.

## Verification

Check at least one wide, medium and narrow viewport; keyboard-only navigation; zoom or large text; long and missing content; loading and error states; and the project's lint, typecheck or build command. Review for overflow, layout shift, contrast, broken focus, hidden content, specificity regressions and unnecessary asset weight.
