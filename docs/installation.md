# Installation

This repository contains two multi-file skills: `compass` at the root and `compass-interface` in its own directory. Preserve each skill's `SKILL.md` and complete `references/` tree. When installing both in Hermes, use sibling skill directories as described in [the Hermes guide](hermes.md).

| Runtime | Support | Recommended install |
| --- | --- | --- |
| Codex | Compatible | Copy to `.agents/skills/compass/` for a project or `~/.agents/skills/compass/` for a user |
| Hermes Agent | Documented multi-file support; runtime test pending | Install the companion's explicit GitHub path and Compass's raw `SKILL.md` URL, or copy two sibling bundles; see [Hermes](hermes.md) |
| OpenClaw | Native | `openclaw skills install git:TDamiao/compass@v1.0.0` |

Canonical repository: [github.com/TDamiao/compass](https://github.com/TDamiao/compass). See the runtime pages for exact scope, updates and removal.

- [Codex](codex.md)
- [Hermes Agent](hermes.md)
- [OpenClaw](openclaw.md)

## Verify the package locally

From the package root, confirm that `SKILL.md`, `references/`, `agents/openai.yaml`, `README.md`, `LICENSE`, `VERSION` and `CHANGELOG.md` exist. Run the standard validator when available:

```bash
skills-ref validate .
```

Also run `python tests/validate_package.py` to check both skill names, portable reference trees and local links. These are development checks; neither skill introduces a runtime dependency.
