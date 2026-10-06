## What AI patterns communicate

AI patterns surface observable progress, activity, tool use, approvals and results. Give users a concise rationale; never expose private chain-of-thought, hidden prompts, credentials, internal traces or sensitive model content.

Distinguish known from estimated progress, define cancellation/retry and permission boundaries, and provide accessible partial/error states. Request approval before consequential actions and report success only after the product confirms it.

| Observation | Principle | Fit for Compass | Tradeoff |
| --- | --- | --- | --- |
| The referenced catalog organizes entries by category and exposes preview/source/install surfaces. | A catalog page can combine discovery, runnable demonstration and implementation information. | Keep category and component metadata in a machine-readable registry so future docs can be generated without coupling product guidance to a website. | Registry is useful now, but previews and install commands require a future host/runtime contract. |
| Established design systems distinguish semantic roles and document interaction/accessibility constraints. | Transfer roles and behavior contracts, not a source's surface styling. | Keep Compass metadata independent from stack and visual identity; adapt to host tokens/primitives. | A reference implementation cannot guarantee correct integration in every host. |

Reference model studied: [Kobra sidebar catalog page](https://kobra.systems/components/sidebar), inspected 2026-10-06 for category navigation, component preview, source/install cues and composition documentation. No source code, copy, API, styling or proprietary component is used here.
