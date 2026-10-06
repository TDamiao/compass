# Empty State

**Category:** Feedback · **Status:** Stable · **Reference:** native HTML/CSS

## Problem and fit

An empty state explains a genuinely empty region and helps the user understand what can happen next. Use distinct copy for first-use, no matches, cleared/deleted content or unavailable data. Do not use it to disguise loading, an error, permission denial or a product with no useful recovery.

## Anatomy and variants

The example includes a concise heading, contextual explanation and one primary next action. An illustration is optional and must not compete with the task. Adapt the content for first-use or no-results conditions; those are different causes, not merely color variants.

## States and responsive behavior

The reference covers a stable empty state. Loading, error and permission-restricted states are separate contracts and should use their own truthful feedback. Content wraps naturally on narrow screens; the next action remains visible and reachable without fixed heights.

## Accessibility and keyboard

Uses a section with a heading and a semantic link to the next destination, with native keyboard behavior and visible focus. Keep the message understandable without an image or color cue. Do not announce a static empty section as a live region without a real asynchronous reason.

## Tokens, dependencies and example

Map text, muted, surface, border, focus and spacing roles to project tokens. No dependencies. See [reference/example.html](reference/example.html); replace the destination and message with a truthful product-specific action.

## AI agent guidance and tradeoffs

Find the actual empty cause, user permissions and available recovery. Prefer a simple inline explanation in the relevant region. Do not invent data, blame the user or direct them to a dead-end CTA. A prominent empty illustration can take attention away from the recovery action.
