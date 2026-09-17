# Compass smoke tests

These tests are runtime-independent prompts. Run them after installing Compass in the target runtime. The expected behavior is conceptual; wording and exact recommendations may vary.

## 1. Ecommerce product page

```text
Use Compass to audit this interface before modifying it.

The page is an ecommerce product page containing:
- product image;
- title;
- price;
- buy button;
- promotional newsletter modal shown immediately;
- large category banner above the product;
- seller information below the description;
- shipping information hidden in an accordion;
- four equally styled CTAs.

Identify:
1. primary intent;
2. dominant object;
3. dominant action;
4. attention hierarchy;
5. highest-priority UX problems;
6. what should be removed, demoted or promoted.
```

Expected: identify purchase as the primary intent, the product as dominant object, buying as dominant action, and prioritize modal/banner/CTA competition plus missing or delayed trust evidence. It should not begin with cards, gradients, rounded corners, more whitespace or a modern hero.

## 2. Search-first page

```text
A page exists only to let users search a large knowledge base.

It currently has:
- animated hero;
- three CTA buttons;
- newsletter card;
- testimonials;
- trending topics;
- search input below the fold.

Audit it using Compass.
```

Expected: recognize search as the dominant intent and recommend that the search input and search state assume clear prominence while unrelated competition is removed or demoted.

## 3. Information density

```text
A marketplace product page contains price, condition, seller reputation, shipping, returns, buyer protection, variants and product details.

The stakeholder asks: “Make it cleaner by hiding most information in accordions.”
```

Expected: challenge the blanket hiding strategy, distinguish information density from information confusion, keep decision-critical trust evidence accessible, and use progressive disclosure selectively.

## Failure condition

A result fails conceptually if it suggests cards, gradients, rounded corners, more whitespace or a modern hero before identifying intent, dominant object/action, attention hierarchy and decision-critical information.

## Compass Interface scenarios

Run with the companion installed. These are behavioral scenarios, not string-matching tests. The independent reasoning pass performed during development is not a Hermes runtime test. Record the runtime/model, source revision, capabilities, output and any observed failure when running them in Hermes.

| Request and available evidence | Observable pass criteria |
| --- | --- |
| Hermes with terminal only: fix overflow at 360px in an existing CSS Modules marketplace with long titles and a shipping table | Inspect intrinsic sizing and ancestors; preserve the brand, comparison semantics and scoped styling; mark rendered validation pending |
| Proposal only: use Google/eBay lessons for a used-parts search with price, condition, seller and shipping; no brand yet | Give a coherent visual direction with preserved decision evidence, sourced lessons, qualified hypotheses and a validation plan; no implementation |
| Restyle a form with server errors, disabled actions and a pending payment; code available | Preserve input, connect errors to fields, distinguish pending from success and prevent duplicate submission |
| Review a dense table shown in a screenshot only | Identify visible hierarchy issues while keeping hidden interaction, markup and contrast measurements unverified |
| Correct a single button's wrapping in an established brand | Focus on the affected control and relevant responsive states; avoid a new design system or unrelated research |

For installation verification in Hermes, confirm both names in the skill list and load `references/product-lessons.md` and `references/interaction-patterns.md` from `compass-interface`. Missing reference files are a packaging failure even when the skill's entrypoint loads.
