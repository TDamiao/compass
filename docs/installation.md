# Installation

This repository contains three independent skill bundles: `compass` at the root, `compass-interface/`, and `compass-components/`. Preserve each skill's `SKILL.md` and complete supporting files. Install each skill separately; do not merge their reference trees. When installing several in Hermes, use sibling skill directories as described in [the Hermes guide](hermes.md).

| Runtime | Support | Recommended install |
| --- | --- | --- |
| Codex | Compatible | Copy to `.agents/skills/compass/` for a project or `~/.agents/skills/compass/` for a user |
| Hermes Agent | Documented multi-file support; runtime test pending | Install each skill's explicit GitHub path or copy sibling bundles; root Compass URL details are in [Hermes](hermes.md) |
| OpenClaw | Native | `openclaw skills install git:TDamiao/compass@v1.0.0` |

The OpenClaw Git command installs the root `compass` skill. Install `compass-interface` and `compass-components` separately from their folders in a local checkout; see [OpenClaw](openclaw.md).

`compass-components` contains a registry and framework-neutral guidance plus dependency-free HTML/CSS/JavaScript reference examples. It has no CLI yet; copy or adapt the documented implementation files into the target project. Registry entries describe both available and planned patterns.

The public-facing Components Catalog is a separate static app in [`catalog/`](../catalog/README.md). Run `npm install` and `npm run dev` from the repository root to work on it; its build output is `dist/`.

Canonical repository: [github.com/TDamiao/compass](https://github.com/TDamiao/compass). See the runtime pages for exact scope, updates and removal.

- [Codex](codex.md)
- [Hermes Agent](hermes.md)
- [OpenClaw](openclaw.md)

## Verify the package locally

From the package root, confirm that the three skill entrypoints/support trees and their UI metadata exist, as do `README.md`, `LICENSE`, `VERSION`, `CHANGELOG.md`, and `compass-components/registry/registry.json`. Run the standard validator when available:

```bash
skills-ref validate .
```

Also run `python tests/validate_package.py` to check all skill names, portable reference trees, local links, component metadata and registry paths/schema contract. These are development checks; the skills introduce no runtime dependency.
