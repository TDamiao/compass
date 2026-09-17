# Visual system

Use this reference when creating or extending a visual language, design system or component family.

## Start from roles, not decoration

Define semantic roles before choosing exact values:

- surfaces: page, raised, inverse, muted and interactive;
- content: primary, secondary, muted, inverse and disabled;
- actions: primary, secondary, quiet, destructive and link;
- status: info, success, warning, danger, selected, focus and progress;
- structure: border, divider, overlay, scrim and focus ring.

Every role needs a contrast and state plan. Never use a color only because it looks attractive in a screenshot. A color should communicate hierarchy, action, state, brand or grouping.

## Type and spacing

Create a limited type scale with explicit roles for display, heading, body, label, metadata and code. Specify weight, size, line height, letter spacing and measure. Text hierarchy should remain understandable when color and decorative styling are removed.

Use a spacing scale that supports grouping and rhythm. Smaller gaps belong within a component; larger gaps separate concepts or sections. Do not use whitespace to hide missing structure, and do not remove necessary evidence merely to create a sparse composition.

## Components

Define a component by purpose, anatomy, variants, states, content constraints, responsive behavior and accessibility contract. A button is not only a rounded rectangle; it has action semantics, disabled and pending behavior, focus treatment, target size and a label policy.

Prefer variants that express real product states over arbitrary visual options. Create a new component when the interaction, accessibility contract or content model differs—not merely because spacing differs.

## Reference extraction

When learning from mature products, record the observation, the functional principle, the transfer decision and the risk. Study density, defaults, focus behavior, empty/error handling, content hierarchy and consistency across states. Never copy brand colors, proprietary silhouettes or layout without a product reason.

## Responsive composition

Decide what is preserved, reordered, collapsed, summarized or removed at each breakpoint. A mobile layout may need a different action order, sticky control, disclosure pattern or content grouping. Test the layout with long translations, large text, absent images and real content before declaring the system coherent.
