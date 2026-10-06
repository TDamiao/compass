# Sidebar

**Category:** Navigation · **Status:** Stable · **Reference:** native HTML/CSS/JS

## Problem and fit

A sidebar keeps several application destinations visible when users move between sections repeatedly and need persistent orientation. Use it for a stable, meaningful section hierarchy in a workspace. Do not use it for a short linear flow, a few destinations that fit in a top bar, content hierarchy that is not navigational, or merely because a dashboard usually has one.

## Anatomy and variants

The example has a labeled navigation landmark, a collapse control and destination links. The selected link uses `aria-current="page"` and a shape/weight cue as well as color. The reference demonstrates expanded and compact desktop variants; it does not define routing or active-link inference.

## States and responsive behavior

Relevant states: expanded, collapsed, current destination, keyboard focus and narrow layout. Disabled/loading/error states do not belong to static navigation links; permission-restricted destinations should follow the product's actual access model. At narrow widths the example reprioritizes destinations into a horizontally scrollable, labeled navigation strip so primary destinations remain reachable; it does not squeeze the desktop rail.

## Accessibility and keyboard

Uses a `<nav>` landmark and links, native Tab/Shift+Tab and Enter behavior, a named collapse button with synchronized `aria-expanded`, visible focus, and accessible names even when labels are visually compact. Do not add arrow-key behavior to ordinary site navigation. Preserve reading and focus order.

## Tokens, dependencies and example

Map surface, text, border, focus, spacing and radius roles in `component.css` to host tokens. No dependencies. See [reference/example.html](reference/example.html); active destination and URLs must be supplied by the host application.

## AI agent guidance and tradeoffs

Check destination count, frequency, hierarchy, role/permissions, viewport and whether global navigation already exists. Prefer the project's router/navigation primitive. Do not invent destinations or replace a healthy navigation system. Persistent visibility costs horizontal space and can duplicate global navigation; collapsed labels can reduce discoverability, so keep names available to assistive technology and consider explicit expansion on mobile.
