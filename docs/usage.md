# Usage

Ask the runtime to use Compass explicitly when you want a reliable product-first pass. Automatic loading may be available when the runtime matches the request to the skill description.

## Prompts

```text
Use Compass to audit this product page before changing the code.
```

```text
Use Compass to redesign this dashboard around the decisions users need to make.
```

```text
Use Compass to review this checkout for unnecessary friction.
```

```text
Use Compass to inspect this repository and improve the landing page without introducing a new visual language.
```

```text
Use o Compass para analisar esta página e identificar a intenção primária, a ação dominante e os três maiores problemas de UX.
```

## Interface work

For visual implementation, use `compass-interface`. In Hermes:

```text
/compass-interface Corrija o overflow desta tela mantendo a marca e o sistema de componentes atual.
```

```text
/compass /compass-interface Use as prioridades desta página de marketplace para definir e implementar hierarquia visual, CSS responsivo e estados de interação.
```

For benchmarking, ask for source, interpretation, adaptation and validation. The agent should distinguish documented behavior from an unverified explanation for a company's success. For terminal-only work, expect code-level checks plus a clear statement that rendered appearance was not verified.

## Expected behavior

The agent should establish product intent before proposing components. It should inspect an existing repository before editing, preserve necessary information in dense experiences, expose a ready buyer's natural action, and use evidence-based UX findings rather than generic “modern” patterns.

## Small examples

**Before:** “Add cards and modernize the hero.”

**Compass:** “Primary intent: purchase. The hero introduces a second CTA with more visual weight than the purchase action. Remove the competing action and expose price plus purchase immediately.”

**Dashboard:** “The screen has twelve metrics but only four map to decisions. Keep situation and exceptions visible, demote diagnostic detail, and remove metrics with no action or interpretation.”

**Marketplace:** “The promotion banner outranks product price, delivery and seller trust. Demote the banner and restore the decision evidence hierarchy.”

**Search:** “Search is the only meaningful job. Remove unrelated promotional competition and make query state, results and the next refinement predictable.”

These examples express reasoning, not fixed layouts.
