# Compass

Product Experience Intelligence for AI Agents.

Compass helps AI agents reason about product intent, UX architecture, attention hierarchy, friction, trust, conversion and Web interface decisions before they write UI code. The repository also includes two complementary layers: `compass-interface` for visual/interface decisions and `compass-components` for reusable, production-oriented implementation patterns.

[Português (Brasil)](README.pt-BR.md)

## What Compass does

Compass is a portable Agent Skill for product decisions across sites, SaaS, ecommerce, marketplaces, dashboards, portals, backoffice and responsive Web. It also teaches the agent how to extract transferable principles from mature internet products—search, marketplace, knowledge, payments, collaboration and more—without copying their layouts. It helps an agent determine:

- primary and secondary intent;
- dominant object and action;
- information and trust needed for a decision;
- attention hierarchy and progressive disclosure;
- unnecessary clicks, choices, fields and visual noise;
- accessibility, responsive behavior, performance and design-system consistency;
- what to audit before changing an existing repository.

## What Compass is not

Compass Core is not a UI theme, component library, CSS framework, “make it prettier” prompt, landing-page template generator or replacement for user research. `compass-components` is a separate companion catalog; it does not turn Core into a component library.

## Companion skill

Use `compass` for product and UX decisions. Use `compass-interface` when those decisions need visual expression and frontend behavior. Use `compass-components` after the need and interface direction are clear, to select and adapt a reusable pattern. Each layer is an independent skill bundle.

```text
Compass → Product decisions
Compass Interface → Visual/interface decisions
Compass Components → Reusable implementation patterns
```

The interface skill is in [compass-interface](compass-interface/SKILL.md); the component skill, catalog guidance and machine-readable registry are in [compass-components](compass-components/SKILL.md).

The interface references cover visual direction, practical CSS diagnosis, interactive behavior and sourced lessons from mature products. The component catalog documents when patterns fit, states, accessibility, responsive behavior and implementation tradeoffs. Load only the references relevant to the task; existing stacks and design systems remain authoritative.

## Components Catalog

The separate [Compass Components Catalog](catalog/README.md) is a static web interface for browsing the registry, reading component guidance, previewing stable reference examples and inspecting their source. It consumes the `compass-components` bundle directly; the registry remains the source of truth.

## Quick Start

Choose a runtime in [docs/installation.md](docs/installation.md). Each skill is a complete folder: keep its `SKILL.md` and supporting files together.

### Codex

For a local checkout, copy the `compass/` folder into the project skill directory `.agents/skills/compass/` or the user skill directory `~/.agents/skills/compass/`, then start a new Codex session. See [docs/codex.md](docs/codex.md).

### Hermes Agent

Install `compass`, `compass-interface` and, when relevant, `compass-components` as separate sibling bundles. The [Hermes guide](docs/hermes.md) covers GitHub/URL installation, local copies, updates and reference verification. The commands are documented by Hermes; runtime execution has not been tested in this checkout.

```text
/compass-interface Improve this interface using the existing brand, real content and accessible responsive behavior.
```

### OpenClaw

From the published Git ref, use `openclaw skills install git:TDamiao/compass@v1.0.0` for the root `compass` skill; from a checkout, use `openclaw skills install . --as compass`. The companion folders are installed separately from a checkout. See [docs/openclaw.md](docs/openclaw.md).

## How it works

Compass guides the agent through:

```text
Understand → Prioritize → Structure → Design → Implement → Validate
```

## Documentation

Start with [installation](docs/installation.md), then see the [concepts](docs/concepts.md), [usage examples](docs/usage.md), [compatibility matrix](docs/compatibility.md) and [troubleshooting](docs/troubleshooting.md).

## Why Compass

AI coding agents often start with interface patterns before understanding the product. Compass reverses the sequence. Simplicity is not the absence of information. It is the absence of unnecessary competition for attention.

> Every pixel pays rent.

## Usage

```text
Use Compass to audit this product page before changing the code.
```

```text
Use Compass to redesign this dashboard around the decisions users need to make.
```

Compass Core is runtime-agnostic and introduces no telemetry, credentials, network calls or executable dependencies. Runtime-specific installation and UI metadata are documented separately.

## Versioning and publishing

Compass follows SemVer. The canonical source is [github.com/TDamiao/compass](https://github.com/TDamiao/compass). Stable release refs should use `v1`, `v1.0` and `v1.0.0` as appropriate for a runtime. Do not create or push tags from this package without repository authorization.

OpenClaw publication is prepared but not performed. See [docs/contributing.md](docs/contributing.md) and [docs/compatibility.md](docs/compatibility.md).

Suggested GitHub repository metadata is documented in [docs/repository-metadata.md](docs/repository-metadata.md).

## Security and privacy

Compass is a knowledge-and-reasoning skill. It does not need shell execution, credentials, external services, dependency installation or destructive scripts. Review any third-party runtime and its permissions independently. Compass Core does not collect telemetry or send project content anywhere.

## License

MIT. See [LICENSE](LICENSE).
