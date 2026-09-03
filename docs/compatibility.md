# Compatibility

Status is based on the official documentation reviewed on 2026-09-03. “Native” means the runtime documents the Agent Skills layout and the required multi-file behavior. “Compatible” means the package works with documented local skill roots but does not have a dedicated package registry flow here.

| Capability | Codex | Hermes | OpenClaw |
| --- | --- | --- | --- |
| `SKILL.md` | Native | Native | Native |
| YAML frontmatter | Native | Native | Native |
| `references/` | Native | Native | Native |
| Repository install | Compatible: copy or current installer flow | Compatible; root repository install to be verified; explicit skill-path install documented | Native: `git:` source |
| Workspace install | Native: `.agents/skills/` | Unknown / not documented as a separate workspace scope | Native: active workspace `skills/` |
| Global install | Native: user `.agents/skills/` | Native: `~/.hermes/skills/` | Native: `~/.openclaw/skills` via `--global` |
| Auto update | Unknown / not documented for this package | Native for Hub provenance | Native for ClawHub installs only |
| Slash invocation | Runtime-dependent; explicit `$compass` supported | Runtime-dependent | Runtime-dependent |
| UI metadata | `agents/openai.yaml` supported | Ignored unless runtime adds support | Ignored unless runtime adds support |

The open format itself requires `SKILL.md` at the skill root, `name` and `description` frontmatter, and supports `references/` with relative links. It does not define a universal installer, update command, slash syntax or registry.

References: [Agent Skills specification](https://agentskills.io/specification), [Codex build skills](https://developers.openai.com/codex/skills), [Hermes skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills), [OpenClaw skills](https://docs.openclaw.ai/skills).
