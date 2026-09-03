# Hermes Agent

Hermes skills follow the Agent Skills format and support multi-file bundles. Compass Core is compatible with Hermes. The exact single-skill repository-root install is **to be verified**: the current official examples document `owner/repo/<skill-path>`, not `owner/repo` with `SKILL.md` at repository root.

## Requirements

- Hermes Agent installed and its `hermes` command available.
- A profile with access to the skills system.
- The current Hermes release with the documented Skills Hub; the official skills documentation does not state a Compass-specific minimum version.

No Compass-specific dependency, credential, binary or environment variable is required.

## Installation

Do not publish this as a confirmed command until it has been run against the public repository:

```bash
hermes skills install TDamiao/compass
```

**Status: to be verified.** Hermes documents direct GitHub installs using an explicit skill directory, for example `owner/repo/skills/my-workflow`. It does not clearly document treating the repository root itself as a skill directory. Do not replace this with a guessed `owner/repo/SKILL.md` command.

The documented, safe alternative for this single-skill repository is to clone the repository and copy the complete checkout into Hermes' primary skills directory:

```bash
git clone https://github.com/TDamiao/compass.git compass-source
mkdir -p ~/.hermes/skills/compass
cp -R compass-source/. ~/.hermes/skills/compass/
```

The explicit destination copy keeps the contents directly under `~/.hermes/skills/compass/` even when that directory already exists; it does not create `compass/compass-source/`. On Windows PowerShell, create the destination with `New-Item -ItemType Directory -Force ~/.hermes/skills/compass` and copy the contents with `Copy-Item -Recurse -Force compass-source\* ~/.hermes/skills/compass\`. Both forms preserve `SKILL.md`, `references/`, and the rest of the package. Do not use Hermes' direct URL form for Compass: the official docs describe that form as single-file `SKILL.md`, which would lose the references.

For local development, copy the complete `compass/` directory to the official primary skills directory:

```text
~/.hermes/skills/compass/
```

Alternatively, maintain a separate Hermes tap repository whose documented path contains a `compass/` skill directory, then install its documented path. That is a distribution-layout choice, not a second Compass Core; do not duplicate `SKILL.md`.

## Verify and activate

```bash
hermes skills list
hermes skills list --source hub
```

Use a new session after installation if the current session does not recognize the skill. Test with:

```text
Audit this page using Compass. Identify the primary intent, dominant action, attention hierarchy and the three highest-priority UX problems.
```

## Update and remove

For Hub/GitHub skill-directory installs, check and update from the recorded source:

```bash
hermes skills check
hermes skills update compass
```

For the clone/copy fallback, pull a fresh checkout and replace the complete directory manually. Remove it from `~/.hermes/skills/compass/` to uninstall. Do not use the direct URL method for this multi-file package.

## Troubleshooting

If Compass is missing, run `hermes skills list`, verify the exact `name: compass`, preserve the folder, and inspect the source path. If references are missing, reinstall the bundle rather than copying only `SKILL.md`. Conflicting copies can be resolved by removing the unintended local copy or using the source/profile that should own it.
