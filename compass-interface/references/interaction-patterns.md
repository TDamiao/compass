# Interaction patterns

Read the sections relevant to the requested component or flow. Specify trigger, visible change, data change, focus behavior, feedback and recovery together. Use native elements or the project's accessible primitives before building a custom widget.

## Controls and navigation

Use links for navigation and buttons for actions. Provide accessible names for icon controls, persistent field labels, and state indicators beyond color. Preserve native keyboard activation and browser behaviors. A row with secondary controls must not become nested interactive markup inside a single clickable wrapper.

Distinguish selected, pressed, expanded, disabled and pending. A selected navigation destination is different from a toggled setting. Explain unavailable actions near the relevant control when the reason helps the user proceed. If using `aria-disabled`, also prevent the action; the attribute alone does not disable it.

Tabs switch related panels; navigation links change destination. Implement tab semantics and arrow-key behavior when creating a tab widget. Automatic tab activation is appropriate only when panels appear without noticeable delay. Accordions disclose detail; do not hide information needed before committing. See [WAI tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) and the [APG pattern index](https://www.w3.org/WAI/ARIA/apg/patterns/).

## Forms and consequential actions

Group fields by the user's mental task. Distinguish required and optional inputs, use suitable input types/autocomplete, and explain unfamiliar formats. Preserve user input after validation or network errors. Avoid reporting errors while a user has only begun entering a value; choose validation timing by the task and existing convention.

Connect error messages to their fields, state what is wrong and how to fix it. For a long invalid form, provide a useful error summary with navigation to the affected fields. During submission, prevent accidental repeats while preserving context. Show success only after the operation is confirmed; if status is uncertain, explain that uncertainty and offer a safe way to check it.

Place price, fees, consequences and cancellation conditions at the decision point when applicable. Keep confirmations proportional to the cost of an error; use undo for reversible actions where the system can actually undo. Do not invent guarantees, ratings or operational capabilities to make a prototype persuasive.

## Search, filtering and results

Keep the submitted query, active filters and sort understandable. Distinguish no initial data, zero matches, request failure and unavailable permission; they require different recovery actions. Preserve search/filter context when opening and returning from a result when supported by the application.

Autocomplete must clarify whether users can enter arbitrary text or must select a valid option. For custom implementations, define Arrow/Enter/Escape behavior, expanded state, active option and announcements using the applicable [WAI combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/). Debounce only when it improves request behavior, and prevent an older response from replacing newer results.

Visual ranking must reflect the actual data contract. Expose provided reasons such as match, price, condition or delivery; do not fabricate a relevance score. Separate paid placement from organic results when present. A filter drawer needs understandable applied state and a way to remove constraints.

## Tables and repeated objects

Choose a table when users compare the same fields across objects; choose a list for sequential scanning or a card when imagery and object-level context lead. Keep headers and relationships semantic, align comparable numbers, and expose units and sort direction. Distinguish selecting a row from opening its detail.

For narrow views, decide whether comparison still requires columns. A labeled horizontal scroll region can preserve the task better than converting every row to a tall card. When prioritizing columns, keep essential values available through a deliberate detail view. Batch actions need a visible selection count and explicit scope, especially across pages. Large datasets may need pagination or virtualization, but verify keyboard, reading order and find/navigation implications before adding them.

## Dialogs, drawers and transient messages

A drawer's appearance does not determine whether it is modal. When modal, label it, move focus inside, contain keyboard navigation, make the background inactive, provide dismissal and restore focus to the trigger or a sensible next location. Keep content scrollable at zoom and short viewport heights. Setting `aria-modal` alone does not implement these behaviors. Follow the [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

Use inline feedback for a problem tied to a field or region; use a persistent message when the next decision depends on it. Reserve transient notifications for information users can afford to miss or retrieve. Avoid focus-stealing toasts and excessively chatty live regions. Tooltips supplement content; they should not contain the sole label, essential instructions or actions.

## State contract

| State | Required design decision |
| --- | --- |
| Initial/empty | Explain what belongs here and the next available action |
| Loading/pending | Preserve context, communicate progress and prevent unsafe duplicates |
| Partial/stale | Identify what is usable and what may be outdated or missing |
| Error | Preserve work; distinguish retry, correction and lack of access |
| Success | Confirm the result and provide the next step or undo if available |
| Permission/offline | State the actual limitation and supported recovery |

For each implemented state, choose meaningful copy, stable geometry and appropriate focus/announcement behavior. Mock data and simulated states must be identifiable in the handoff.
