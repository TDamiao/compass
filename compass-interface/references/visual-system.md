# Visual system

Use this reference when creating or extending a visual language, design system or component family.

## Start from roles, not decoration

For a new direction, describe the intended reading behavior before choosing a palette: fast lookup, careful comparison, sustained reading, frequent operation or persuasive exploration. Choose density and composition accordingly. Express identity through a coherent combination of type, imagery, spacing, shape and copy. Keep existing brand assets and user-requested references authoritative.

When no visual language exists, choose a justified direction and proceed. Show alternatives only when the user requests exploration or the choice materially affects the product. An editorial serif, neutral system font or expressive display face can each be appropriate; none is a universal default.

Define semantic roles before choosing exact values:

- surfaces: page, raised, inverse, muted and interactive;
- content: primary, secondary, muted, inverse and disabled;
- actions: primary, secondary, quiet, destructive and link;
- status: info, success, warning, danger, selected, focus and progress;
- structure: border, divider, overlay, scrim and focus ring.

Every role needs a contrast and state plan. Never use a color only because it looks attractive in a screenshot. A color should communicate hierarchy, action, state, brand or grouping.

Use three levels only when needed: raw palette values, semantic roles and component-specific aliases. For example, a palette blue can feed `--color-action-bg`, which a primary button consumes. Pair foreground/background roles for default, hover, pressed and disabled states. Changing theme means remapping roles and checking those pairs; do not simply invert colors. Dark mode is scoped work, not an automatic extra feature.

Prefer a quiet base with deliberate emphasis when the task demands scanning. Use borders, tonal surfaces or spacing before stacking shadows everywhere. Give elevation a structural meaning (overlay, floating control) and use radius consistently with component scale. Status colors should not compete with the normal primary action.

## Type and spacing

Create a limited type scale with explicit roles for display, heading, body, label, metadata and code. Specify weight, size, line height, letter spacing and measure. Text hierarchy should remain understandable when color and decorative styling are removed.

Use a spacing scale that supports grouping and rhythm. Smaller gaps belong within a component; larger gaps separate concepts or sections. Do not use whitespace to hide missing structure, and do not remove necessary evidence merely to create a sparse composition.

Choose font roles after checking existing assets, language coverage and actual content. Verify Portuguese accents and currency when applicable. Limit weights to those used. Start prose around a comfortable reading measure (often 45-75 characters), then inspect the chosen font and content; do not force form labels or data tables into prose rules. Use tabular numerals for changing or comparable numbers when supported.

Body and control text must remain legible without pinching. Fluid headings can use bounded `clamp()` with a relative-unit floor; do not rely on viewport units alone. Let labels wrap or let controls grow before shrinking essential text. Do not truncate prices, errors or item identifiers needed to decide. A tooltip cannot be the only way to recover essential text on touch.

Spacing expresses relationships: label/help/input belong together; separate field groups more strongly. A spacing scale such as 4/8/12/16/24/32 is a candidate, not a rule to overwrite the repository. Optical alignment may justify a local adjustment; repeated exceptions signal a missing token or incorrect component anatomy.

## Composition and imagery

Start with semantic regions and clear alignment anchors. Compare the weight of the first screen with the task: title, object, action and evidence should have an intentional reading order. A hero, sidebar or card needs a content/navigation role; repeated comparable rows may be better expressed as a list or table.

Avoid using containers to solve every grouping problem. Test whether spacing and headings already communicate the relationship. Align comparable labels and numbers; keep repeated actions in predictable locations. Reserve sufficient room for real names, errors and translations before tuning decoration.

Choose images for evidence, orientation or identity. Product photos should preserve the attributes a buyer evaluates; editorial imagery may tolerate more expressive cropping. Set a suitable aspect ratio and focal point, inspect narrow layouts and missing-image states, and provide context-appropriate alternative text. Use one coherent icon family already in the project; pair unfamiliar icons with labels.

## Explain a visual choice

Tie a decision to an observable effect: "Align totals and use tabular numerals so comparison survives updates" or "Keep delivery beside price because total purchase conditions are evaluated together." Avoid unsupported claims such as "blue creates trust" or invented conversion percentages. Validate reading order and task behavior before attributing success to decoration.

## Components

Define a component by purpose, anatomy, variants, states, content constraints, responsive behavior and accessibility contract. A button is not only a rounded rectangle; it has action semantics, disabled and pending behavior, focus treatment, target size and a label policy.

Prefer variants that express real product states over arbitrary visual options. Create a new component when the interaction, accessibility contract or content model differs—not merely because spacing differs.

## Reference extraction

When learning from mature products, record the observation, the functional principle, the transfer decision and the risk. Study density, defaults, focus behavior, empty/error handling, content hierarchy and consistency across states. Never copy brand colors, proprietary silhouettes or layout without a product reason.

## Responsive composition

Decide what is preserved, reordered, collapsed, summarized or removed at each breakpoint. A mobile layout may need a different action order, sticky control, disclosure pattern or content grouping. Test the layout with long translations, large text, absent images and real content before declaring the system coherent.
