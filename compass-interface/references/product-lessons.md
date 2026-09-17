# Lessons from mature products

Use for benchmark-driven design, not every CSS correction. These are sourced starting points reviewed on 2026-09-17, not a traffic ranking, a live UI inventory or proof of conversion gains. Inspect the relevant current page when its appearance matters; record viewport, state and access limitations. Public documentation cannot reveal every internal experiment or motivation.

## Evidence to decision

Choose the reference closest to the user's task, not merely the most famous brand. Record a short chain: source/observation -> functional interpretation -> adaptation -> tradeoff -> observable test. Research one or two relevant systems deeply enough to make a decision; do not accumulate a gallery without using it.

### Google: relevance carries work that the surface cannot show

Google describes ranking using query meaning, relevance, content quality, usability and context in [How Search ranks results](https://www.google.com/search/howsearchworks/how-search-works/ranking-results/).

Transfer hypothesis: give search a clear entry point and give each result enough distinguishing evidence to judge its fit. The visible UI should support the actual retrieval capability, including ambiguity, filtering, empty results and recovery. Check whether users can find an appropriate result and understand their next refinement.

Boundary: a sparse entry screen is not evidence that results should omit context, or that another product has Google's ranking ability. Home, results and detail views support different decisions. Do not claim Google's specific colors or spacing caused adoption without direct evidence.

### eBay: make repeated design decisions explicit

[eBay Playbook tokens](https://playbook.ebay.com/design-system/tokens) distinguishes raw/core, semantic and component tokens, including theme mappings and foreground/background relationships. Its [typography tokens](https://playbook.ebay.com/design-system/tokens/typography-tokens) combine font attributes into reusable roles.

Transfer hypothesis: name styles for their job, then reuse those roles across listing, detail and transaction states. A marketplace's comparable information should remain aligned and readable as content varies. Check whether a semantic color/type change stays coherent across states and whether buyers can compare price, condition and delivery.

Boundary: use the project's palette and typography; token names do not prove contrast or usability, and a source's example values are not universal defaults.

### GitHub Primer: accessibility belongs in the initial design

[Primer's accessibility foundations](https://www.primer.style/accessibility/foundations/accessibility-fundamentals/) integrates visual and interaction considerations early in design, including contrast, non-color cues and meaningful link labels.

Transfer hypothesis: for a frequent-use interface, keep compact controls predictable, focused states visible and status understandable through text or shape. Review the component across keyboard and pointer input, not only its default screenshot.

Boundary: GitHub's professional audience does not justify tiny labels or hidden functions in every product. Compactness must be tested with the target users and content.

### IBM Carbon: comparable data needs coherent structure

[Carbon data tables](https://carbondesignsystem.com/components/data-table/usage/) documents a structured table with related toolbar, selection and row actions.

Transfer hypothesis: preserve the comparison grid, scope batch actions clearly, and place controls according to whether they affect the dataset or one object. Test finding an exception, comparing values and acting on selected rows at both large and narrow widths.

Boundary: a table is useful when fields are comparable; it is not automatically the best presentation for browsing images or reading narrative content. Do not assume every table requires every documented feature.

## Adapt to the product

| Task | Useful visual emphasis | Common transfer mistake |
| --- | --- | --- |
| Search/reference | Query, result distinction, provenance, refinement | Copying a sparse home screen into information-rich results |
| Marketplace | Object, total conditions, trust, comparison | Hiding condition/delivery to achieve a clean screenshot |
| Operations dashboard | Exceptions, aligned data, actionable state | Applying a marketing hero or giant cards to repeated work |
| Editorial/product story | Reading rhythm, imagery, evidence, identity | Treating all expressiveness as useless decoration |
| Transaction | Field comprehension, consequences, recovery | Compressing steps while increasing error cost |

These adaptations are Compass Interface recommendations to validate in the current product. They are not attributed internal company decisions. If research is unavailable, identify assumptions and proceed from known constraints without claiming a live benchmark.
