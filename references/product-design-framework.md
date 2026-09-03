# Product design framework

Use this reference for new interfaces, implementation planning and post-implementation review.

## Decision sequence

1. Understand product, role, context, entry point and job to be done.
2. Define primary intent, secondary intents, dominant object, dominant action and success condition.
3. Map required information, trust requirements, objections, risks, business rules and states.
4. Prioritize the sequence: perceive → understand → decide → act → confirm. Put only what is needed at each stage; reveal advanced detail progressively.
5. Reduce redundant choices, fields, CTAs, navigation options and context switches. Keep a field only if it is necessary now; infer, reuse, autofill, defer or provide a sensible default where safe.
6. Design hierarchy, information architecture, content, components and responsive behavior.
7. Implement using the existing design system and shared primitives.
8. Validate behavior, accessibility, performance, consistency and edge states.

## Hierarchy rules

The first viewport should establish where the user is, what is there, what can be done and the natural next step. It does not need to contain every trust detail or objection. Use attention as a finite budget: contrast, size, position, color, whitespace and motion all spend it. A lower-priority element must not visually outrank the task-critical object or action.

When a screen feels crowded or ambiguous, make the hierarchy explicit with a rough attention score (for example, dominant object/action 90–100, decision evidence 70–90, supporting detail 40–70, navigation and related content below that). Compare intended importance with actual visual weight and fix inversions. Do not use the score as a mathematical claim; use it to expose competing priorities.

Information layers:

1. needed to perceive;
2. needed to decide;
3. needed to confirm;
4. useful to interested users;
5. advanced/reference detail.

Whitespace communicates grouping and separation. Typography communicates function and readable density. Color communicates brand, action, state, selection or interaction. Hover communicates affordance or preview and must never be critical on touch devices. Motion confirms, explains, preserves context or indicates progress; otherwise remove it.

## Domain adaptations

- Search-first pages: make the dominant query/action predictable and suppress unrelated competition.
- Product/marketplace pages: protect item, image, price, condition, seller, delivery, trust/protection and purchase action; structure density instead of hiding necessary evidence.
- Dashboards: for every metric ask what decision or diagnosis it enables; prioritize situation → exception → diagnosis → action.
- Commercial landing pages: derive sequence from readiness and objections; a ready buyer should be able to act immediately, while proof and explanation support uncertainty.
- Forms/checkout: reduce decisions and error recovery, explain why sensitive information is needed, show progress and preserve user input.
- Complex tools/documentation: support recurrent users and deep exploration without making first-use orientation depend on prior knowledge.

## Review checklist

Ask: Can a first-time user state the page purpose? Is one action dominant? Can the user make the relevant decision with the information and trust evidence provided? Is anything louder than its importance? Are there clicks or choices that only compensate for poor architecture? Is required information hidden for aesthetic cleanliness? Does copy clarify, orient, build trust or enable action? Are states, permissions, long content and failure paths credible? Does each breakpoint re-rank rather than merely shrink? Does each tracked event answer a product question?

For implementation, inspect the actual result at representative viewport sizes and keyboard navigation. Prefer targeted corrections over cosmetic churn. Record remaining UX debt and risks.
