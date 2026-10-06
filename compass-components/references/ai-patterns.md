# AI interaction patterns

The `ai` category is reserved in the registry taxonomy. Conversation, agent status/activity, progress steps, tool calls, task progress, file diffs, artifacts, citations, approvals, permission requests and human-in-the-loop patterns are planned, not implemented components yet.

Represent observable product events and user-relevant outcomes: progress, activity, steps, status, tools used, actions performed, outputs, citations, summarized rationale, approval and permission. Do not expose or encourage disclosure of private chain-of-thought, hidden prompts, credentials, internal traces or sensitive model content. A concise rationale is a user-facing explanation, not a transcript of private reasoning.

For each future pattern, define what is known versus estimated, event ordering, cancellation/retry, permission boundaries, stale/partial/error states, accessible announcements and what data may be shown. Request approval at the consequential action and make scope and effects clear. Never imply a tool call or task succeeded until the product confirms it.

| Observation | Principle | Fit for Compass | Tradeoff |
| --- | --- | --- | --- |
| The referenced catalog organizes entries by category and exposes preview/source/install surfaces. | A catalog page can combine discovery, runnable demonstration and implementation information. | Keep category and component metadata in a machine-readable registry so future docs can be generated without coupling product guidance to a website. | Registry is useful now, but previews and install commands require a future host/runtime contract. |
| Established design systems distinguish semantic roles and document interaction/accessibility constraints. | Transfer roles and behavior contracts, not a source's surface styling. | Keep Compass metadata independent from stack and visual identity; adapt to host tokens/primitives. | A reference implementation cannot guarantee correct integration in every host. |

Reference model studied: [Kobra sidebar catalog page](https://kobra.systems/components/sidebar), inspected 2026-10-06 for category navigation, component preview, source/install cues and composition documentation. No source code, copy, API, styling or proprietary component is used here.
