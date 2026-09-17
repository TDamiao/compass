# Visual audit

Use before changing an existing interface or after implementing a visual redesign.

## Audit order

1. Confirm the primary task and compare visual prominence with product importance.
2. Inspect typography, spacing, color roles, density, alignment, grouping and responsive composition.
3. Exercise states and interactions: focus, hover where relevant, pressed, disabled, loading, validation, empty, error and success.
4. Check semantic order, keyboard flow, target size, contrast, zoom, reduced motion and screen-reader labels.
5. Check implementation quality: tokens, duplication, selectors, breakpoints, layout shift, assets and maintainability.

## Finding format

Report each issue with severity, location, evidence, affected task, likely cause, recommendation, expected effect and validation method. Prioritize hierarchy, comprehension, accessibility and broken behavior before cosmetic polish.

Useful labels include `VISUAL-HIERARCHY`, `VISUAL-TYPE`, `VISUAL-DENSITY`, `VISUAL-COLOR`, `VISUAL-STATE`, `VISUAL-RESPONSIVE`, `CSS-FRAGILITY`, `A11Y-CONTRAST`, `A11Y-FOCUS` and `PERF-LAYOUT-SHIFT`.

Do not call a visual change successful because it is more modern, attractive or similar to a reference. It is successful when the intended task becomes clearer, safer, faster or more trustworthy without introducing regressions.

## Evidence and severity

Use P0 for a blocked primary task, P1 for serious comprehension/accessibility or decision problems, P2 for meaningful friction and P3 for cosmetic inconsistency. Distinguish observed behavior, source-code evidence and a visual inference. Report the page/component, width, state and concrete symptom; a generic checklist is not an audit.

Capture comparable before/after views when helpful and possible. Navigate the main path, deliberately trigger a meaningful failure, inspect the rendered result, correct the issue and repeat only affected checks. Reuse a running preview and the repository's test commands; avoid installing a test framework just for a small CSS change.

## Practical accessibility checks

For a Web experience targeting WCAG 2.2 AA, check normal text at 4.5:1 contrast, large text at 3:1 (at least 18pt regular or 14pt bold), and applicable UI boundaries/meaningful graphics at 3:1. Evaluate actual foreground/background combinations, including overlays and states. Color alone must not communicate essential information.

The minimum pointer target criterion is 24 by 24 CSS pixels with defined exceptions, including spacing; 44 by 44 belongs to the enhanced AAA criterion. Larger touch targets can be a good product choice without mislabeling the standard. Verify visible keyboard focus and that sticky content does not entirely obscure the focused component. See the [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/).

Check text resizing at 200% and reflow at an effective width of 320 CSS pixels (commonly a 1280px-wide viewport at 400% zoom). Look for clipped content, controls or two-dimensional scrolling. Content requiring a two-dimensional layout, such as some data tables, has specific exceptions; the surrounding page should still reflow. See [W3C reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

Keyboard tests need actual interaction, not inference from markup. Screen-reader support needs appropriate manual testing when available; automated checks do not establish it. Report missing coverage rather than claiming conformance.

## Responsive and state sampling

Choose widths from the actual failure points and supported devices. As an exploratory sample, inspect a narrow phone width, an intermediate panel/tablet width and a wide working layout, plus widths immediately around a changed breakpoint. These are samples, not proof of all-device support.

Stress the highest-risk region with long Portuguese labels or translations, unusually large values, no image, multiple validation errors and a slow response. Confirm that order, evidence and actions remain usable. For sticky actions and overlays, also test short viewport height and the software keyboard where possible.

## Performance and reporting

Inspect initial rendering and async changes for layout jumps, late-loading fonts and oversized imagery. A local trace or Lighthouse result is laboratory evidence; report measured context and do not present it as field Core Web Vitals. In a code-only session, identify risks as unmeasured.

Finish with the consequential decisions, changes and actual checks. For example: "Verified the purchase flow at two widths and by keyboard; shipping errors preserve the form. Screen-reader and real-device keyboard checks remain pending." Include artifacts only if they were generated and inspected. A task with no browser can still produce a useful implementation with a clearly stated visual verification gap.
