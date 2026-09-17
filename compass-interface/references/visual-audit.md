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
