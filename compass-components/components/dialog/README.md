# Dialog

**Category:** Overlay · **Status:** Stable · **Reference:** native HTML `<dialog>` + JS

## Problem and fit

A modal dialog interrupts the current task to focus a decision or bounded task whose context should remain in place. Use it when interruption prevents a meaningful error or keeps a compact task together. Do not use it for ordinary information, long forms, routine navigation or content better shown inline. A sheet/drawer is a layout choice, not automatically modal behavior.

## Anatomy and variants

The example uses a native modal `<dialog>`, heading, explanatory content, explicit close/cancel and confirm buttons. The example demonstrates a confirmation shape; replace wording and consequences with the real action. Destructive actions need an accurate consequence and a non-destructive exit.

## States and responsive behavior

Closed, open, initial focus, Escape/cancel, explicit close and focus restoration are implemented. Pending/error/success content depends on the action contract and is not simulated. The dialog is viewport-bounded and scrollable on short/narrow viewports; do not clip content or obscure controls behind a software keyboard.

## Accessibility and keyboard

Native `showModal()` supplies modal semantics, background inertness and focus containment in supported browsers. The dialog is named by its heading; focus enters on open, Escape cancels, and focus returns to the trigger. Keep Tab order meaningful and ensure the first focused control is appropriate. Validate browser support in the host project.

## Tokens, dependencies and example

Map surface/text/border/focus/radius/shadow and spacing roles to host tokens. No dependencies. See [reference/example.html](reference/example.html). Use the project's dialog primitive if already established.

## AI agent guidance and tradeoffs

Check consequence, reversibility, interruption cost, focus behavior and mobile constraints. Preserve local overlay primitives and avoid parallel dialog systems. A modal blocks background work and adds context switching; prefer inline feedback or undo for low-risk reversible actions. Never claim confirmation or completion before the underlying operation succeeds.
