# Button

**Category:** Actions · **Status:** Stable · **Reference:** native HTML/CSS

## Problem and fit

A button invokes an action in the current context. Use it for submit, save, destructive or other state-changing actions. Use a link for navigation. Do not turn plain labels into controls or add a button where the next step is not clear.

## Anatomy and variants

The example uses native `<button>` elements with primary, secondary and danger visual roles, text labels and optional native `disabled`. A host may add icons only when the action remains clearly named. Variants communicate priority or consequence, not decoration.

## States and responsive behavior

Default, hover enhancement, focus-visible, active and disabled are shown. Loading/pending must come from actual application state, prevent unsafe duplicate submission and retain an understandable label; it is not faked by this static reference. At narrow widths allow labels to wrap or controls to take available width when reachability requires it; preserve action order and target size.

## Accessibility and keyboard

Native button supports Tab and Enter/Space. Keep visible focus, accessible text and adequate contrast/target size. Native `disabled` prevents activation and focus; if users need to discover why an action is unavailable, explain that near the control and choose an appropriate enabled/`aria-disabled` pattern with actual event prevention.

## Tokens, dependencies and example

Map action, on-action, text, border, focus, radius and spacing roles to project tokens. No dependencies. See [reference/example.html](reference/example.html). The reference contains no business action; connect it to the real operation when adapting.

## AI agent guidance and tradeoffs

Choose action hierarchy from user intent and consequences. Prefer existing project button primitives and variants; do not replace healthy controls or add arbitrary sizes. Buttons occupy attention and are not a substitute for links, menu triggers or form labels. Never ship the demo's no-op buttons as if functional.
