# Compatibility

Hermes entries were reviewed against official documentation on 2026-09-17; other runtime entries retain the 2026-09-03 review. “Native” means documented runtime support, not an executed Compass integration test. Both skills require their own reference tree.

| Capability | Codex | Hermes | OpenClaw |
| --- | --- | --- | --- |
| `SKILL.md` | Native | Native | Native |
| YAML frontmatter | Native | Native | Native |
| `references/` | Native | Native | Native |
| Repository install | Compatible: copy or current installer flow | Explicit skill paths and URLs with referenced files documented; Compass execution pending | Native: `git:` source |
| Workspace install | Native: `.agents/skills/` | Documented `.hermes/skills/` and `.agents/skills/` with project trust | Native: active workspace `skills/` |
| Global install | Native: user `.agents/skills/` | Native: `~/.hermes/skills/` | Native: `~/.openclaw/skills` via `--global` |
| Auto update | Unknown / not documented for this package | Native for Hub provenance | Native for ClawHub installs only |
| Slash invocation | Runtime-dependent; explicit `$compass` supported | Documented `/compass-interface` and leading skill combinations | Runtime-dependent |
| UI metadata | `agents/openai.yaml` supported | Ignored unless runtime adds support | Ignored unless runtime adds support |

The open format itself requires `SKILL.md` at the skill root, `name` and `description` frontmatter, and supports `references/` with relative links. It does not define a universal installer, update command, slash syntax or registry.

References: [Agent Skills specification](https://agentskills.io/specification), [Codex build skills](https://developers.openai.com/codex/skills), [Hermes skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills), [OpenClaw skills](https://docs.openclaw.ai/skills).
