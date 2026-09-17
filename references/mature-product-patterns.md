# Mature product patterns

Use this reference when the request asks the agent to learn from established internet products, explain why a simple interface works, benchmark a flow, or transfer product intelligence into a new interface.

## The benchmark method

Do not begin by collecting screenshots or naming components. Start with the user's job, the product's object, the business model and the consequence of a wrong decision. Then compare the current product with one or two relevant archetypes. More references are not automatically better; unrelated products create cargo-cult patterns.

For each reference, produce a short pattern record:

| Field | Question |
| --- | --- |
| Context | What user, moment, device and entry point does this serve? |
| Job | What does the user need to accomplish or decide? |
| Object | What is the primary thing being searched, compared, created or managed? |
| Mechanism | What does the interface/system actually do? |
| Signal | What evidence suggests it improves comprehension, speed, trust or quality? |
| Constraint | What business, technical, policy or scale constraint may explain it? |
| Transfer | Which principle applies here, and what must change? |
| Risk | What could be lost, misused or overgeneralized? |
| Test | What observable behavior or metric would confirm the transfer? |

Keep three layers separate:

1. Observation: what is visibly or behaviorally present.
2. Interpretation: the likely user or system problem it solves.
3. Transfer hypothesis: how the lesson might apply to the current product.

Never present layer 2 or 3 as proven causality without research, experiment, analytics or a clearly cited product source.

## Archetypes and what to study

These are lenses, not a ranking of the internet or a claim that one company owns a pattern.

- Search and discovery: query intent, autocomplete, result relevance, spelling tolerance, ranking explanations, zero-results recovery, filters and the cost of scanning.
- Marketplace and commerce: comparison density, price/condition/seller/delivery evidence, reputation, supply quality, protections, negotiation, inventory state and purchase confidence.
- Knowledge and reference: information scent, source provenance, internal linking, progressive depth, scanning, ambiguity handling and contribution quality.
- Developer and productivity tools: orientation for first use, power-user speed, command discoverability, reversible actions, system status and error recovery.
- Payments and transactional flows: identity, authorization, sensitive data, fee transparency, confirmation, idempotency, receipt and recovery after interruption.
- Booking and high-consequence choice: availability, constraints, total cost, cancellation rules, comparison, commitment timing and trust under uncertainty.
- Social and communication products: composition, audience control, notification economics, moderation, privacy, feedback loops and return frequency.
- Platform/device ecosystems: defaults, continuity, conventions, accessibility, cross-device state and the relationship between system and app patterns.

## Questions that reveal the hidden intelligence

Use questions such as:

- What does this product choose to rank, and what does ranking optimize: relevance, quality, revenue, freshness, likelihood, safety or a mixture?
- Which default reduces decision effort, and when could it silently bias or harm the user?
- Which information is shown early because it changes the decision, and which is deferred because it supports only exploration?
- Where does the product expose uncertainty, provenance, policy or consequences instead of promising certainty?
- What happens when the system knows little, has no result, is slow, is wrong or loses connectivity?
- Which apparent "extra click" prevents an expensive mistake, and which click exists only because the architecture is weak?
- What incentives might make a pattern effective there but harmful in this product?
- How would the pattern behave with new users, expert users, assistive technology, long content and small screens?

## Transfer rules

Borrow principles, not branded artifacts. A search box, card grid, rating, tab bar, infinite scroll, one-click action or sparse landing page is not automatically good. Rebuild the interaction around the current product's object, vocabulary, trust burden, supply/demand dynamics and primary intent.

Do not infer that minimal visual output means low complexity. Before removing content, determine whether it is required to perceive, decide, trust, confirm or recover. Before adding content, determine whether it reduces uncertainty or merely competes for attention.

When implementing a transferred principle, record:

- the original archetype and the abstract principle;
- why it fits this user's job and product constraint;
- what was deliberately not copied;
- the tradeoff and failure mode;
- how the result will be observed or tested.

The output should be a decision, not a gallery: keep, adapt, test or reject the pattern, with a reason.
