# Codex

Compass uses the open Agent Skills layout and is compatible with Codex skills. `agents/openai.yaml` supplies Codex UI metadata; it is optional to the portable Core and must not be required by other runtimes.

## Install

For a project-scoped install, copy each desired skill folder to its own name under:

```text
<project-root>/.agents/skills/<skill-name>/
```

For a user-scoped install, copy it to:

```text
~/.agents/skills/<skill-name>/
```

The current Codex guidance also supports installing a skill from a GitHub directory through the built-in skill installer after publication. The exact command is runtime/UI dependent; use the current Codex installer flow rather than treating a Git clone as a Codex CLI command.

## Activate and verify

Start a new session or restart Codex after installing. Explicit invocation uses:

```text
$compass Audit this page before changing the code. Identify the primary intent, dominant action and highest-priority UX problems.
```

For this repository, the names are `compass`, `compass-interface` and `compass-components`; each is a separate folder with its own `SKILL.md` and support files. If a skill is not listed, check the exact filename, valid frontmatter, trusted project and supported `.agents/skills` root.

## Update and remove

For a copied checkout, pull or replace the complete directory and restart Codex. For an installer-managed distribution, use that installer’s current update/removal flow. Remove the `compass` directory from the project or user skill root to uninstall it.

## Distribution note

OpenAI documents plugins as the distribution surface for reusable skills and connectors. Compass is currently a portable skill package; a future Codex plugin may wrap this folder without changing Compass Core.
