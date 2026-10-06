# Field

**Category:** Forms · **Status:** Stable · **Reference:** native HTML/CSS/JS

## Problem and fit

A field connects one user input to its label, requirements, help and actionable error. Use it for data collection where the input contributes to the task. Do not add fields without a product/data need or replace native control semantics with a styled text container.

## Anatomy and variants

The example contains a persistent label, required marker, hint, native email input and inline error. A field may be text, numeric, choice or another suitable native control; only include help/error when meaningful. Requiredness is also represented semantically, not only by color or punctuation.

## States and responsive behavior

Default, focus, invalid, disabled and submitted-valid are relevant. The example validates on submit and preserves the user's value; it does not interrupt while typing. Pending and permission-restricted states belong to the enclosing form/data operation. Labels, hints and errors wrap at narrow widths; keep error text adjacent and do not rely on fixed heights.

## Accessibility and keyboard

Uses an explicit `<label>`, `required`, `aria-describedby` links to help/error and `aria-invalid` only after validation. Native input supports keyboard and browser autofill. On invalid submission focus moves to the field; for long forms use an error summary in addition to inline feedback. Associate each error with the affected control.

## Tokens, dependencies and example

Map text/muted/border/focus/danger and spacing roles to project tokens. No dependencies. See [reference/example.html](reference/example.html). Replace the sample validation and submission outcome with server/domain validation; never display success before confirmation.

## AI agent guidance and tradeoffs

Inspect form conventions, field schema, validation timing, autocomplete, localization and error recovery first. Prefer existing form primitives. Keep entered values on validation/network errors and distinguish client validation from server response. Inline errors consume space but reduce correction cost; validate timing against task risk and user expectations.
