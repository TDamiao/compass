# Data Table

**Category:** Data · **Status:** Stable · **Reference:** native HTML/CSS/JS

## Problem and fit

A table supports comparison and repeated work when records share fields users need to scan across. Do not use it for a narrative, a small set of image-led choices or objects whose relationships are not tabular. Consider a list or detail view when comparison is not the task.

## Anatomy and variants

The example has a labeled search field, result count, semantic `<table>`, column headers with sort buttons and an explicit empty result. It demonstrates client-side text filtering and sorting for a small static dataset only. It is not a server pagination, bulk-selection or virtualization API.

## States and responsive behavior

Default, sorted ascending/descending, filtered results, empty filtered result and focus are implemented. Loading/error/permission states belong to the data owner and are intentionally not fabricated. On narrow screens the table stays a labeled horizontal comparison region with sticky first column; do not convert every cell to cards unless reading and comparison remain clear. Ensure overflow is contained within the table region.

## Accessibility and keyboard

Uses caption, `th scope="col"`, native input, buttons, visible focus, `aria-sort` and a polite result count. Keyboard users tab to sorting controls and use standard table reading/navigation provided by their assistive technology. Sorting updates accessible direction. Keep numeric units and column names explicit.

## Tokens, dependencies and example

Map semantic text/surface/border/focus and spacing roles to host tokens. No dependencies. See [reference/example.html](reference/example.html). Replace the inline sample rows and client-side behavior with the product's real query/data contract.

## AI agent guidance and tradeoffs

Verify shared fields, sort semantics, data volume, access rules and narrow-screen comparison needs before selecting a table. Preserve project table primitives and server behavior. Sorting must reflect actual values and locale; do not invent ranking or data. Horizontal scrolling preserves comparison but can hide columns, so prioritize essential columns and provide a meaningful alternative when required.
