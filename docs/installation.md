# Installation

Compass is a multi-file Agent Skill. Install or copy the whole `compass/` directory so `references/` remains beside `SKILL.md`.

| Runtime | Support | Recommended install |
| --- | --- | --- |
| Codex | Compatible | Copy to `.agents/skills/compass/` for a project or `~/.agents/skills/compass/` for a user |
| Hermes Agent | Compatible; root Git install to be verified | Clone/copy the complete package to `~/.hermes/skills/compass/`; use a documented skill-path install only when the repository exposes one |
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

The validator is optional for runtime operation; Compass has no runtime dependencies.
