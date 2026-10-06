# Adaptable foundations

Compass Components defines semantic roles, not a mandatory visual identity or palette. Map these roles to the host project's tokens. Examples may use CSS custom properties with fallbacks so snippets remain inspectable without a theme.

Do not require every project to define the names below. In a real integration, translate them into the existing design system. Preserve its typography, density, directionality, contrast and theming. Do not add a foundation layer unless multiple consumers or a real consistency need justify it.

## Color

| Role | Purpose |
| --- | --- |
| `--cc-color-canvas`, `--cc-color-surface`, `--cc-color-surface-muted` | Page, contained and subtly grouped surfaces |
| `--cc-color-text`, `--cc-color-muted` | Primary and supporting text |
| `--cc-color-border` | Boundaries that need to be perceived |
| `--cc-color-action`, `--cc-color-on-action` | Primary action and readable content on it |
| `--cc-color-focus` | Visible keyboard focus |
| `--cc-color-danger`, `--cc-color-success`, `--cc-color-warning` | Semantic feedback, always paired with text/icon/shape |
| `--cc-color-scrim` | Overlay backdrop when separating a modal layer is useful |

Map contrast pairs and states together. These names are examples of roles, not required Compass colors.

## Typography

Use `--cc-font-body` for reading and controls and `--cc-font-mono` only where fixed-width characters improve scanning, such as code or identifiers. Establish hierarchy from content roles and preserve the host project's language coverage, density, legibility and typography tokens. Do not add a font solely to imitate a reference.

## Spacing

`--cc-space-*` represents context-specific gaps: within controls, between related field elements and between distinct groups. Preserve an existing spacing scale. Use spacing to clarify relationships rather than to make necessary information look sparse.

## Radius

`--cc-radius-control` and `--cc-radius-surface` can distinguish control geometry from larger containing surfaces. Match the established product language; components do not require rounded corners or a universal radius scale.

## Motion

`--cc-duration-*` may describe short transitions when they explain a state change or preserve spatial continuity. Motion should communicate cause or progress, never delay access to content or an action. Respect `prefers-reduced-motion` and retain a complete static state.

## Layout

When useful, define roles for reading measure, navigation region, work area and overlay bounds from the product's content and tasks rather than a preset grid. Responsive rules express priority: preserve critical navigation, comparison evidence and primary actions; reflow or defer secondary content deliberately; keep zoom and long content usable. A smaller viewport can require a different order or interaction, not a scaled desktop layout.
