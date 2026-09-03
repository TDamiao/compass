# OpenClaw

OpenClaw treats a skill as a folder rooted by `SKILL.md` and supports the optional supporting files used by Compass. This is Native compatibility.

## Install from Git

After publication:

```bash
openclaw skills install git:TDamiao/compass@v1.0.0
```

The `@ref` is optional when installing the default Git ref; pin a release when reproducibility matters. Git/local installs require `SKILL.md` at the source root, which is why this package keeps it there.

## Workspace, global and local development

By default, installation targets the active workspace `skills/` directory and is available to that workspace/agent. For all local agents, use:

```bash
openclaw skills install git:TDamiao/compass@v1.0.0 --global
```

From a checkout:

```bash
openclaw skills install ./path/to/compass --as compass
```

When the current directory is the root of the Compass checkout, use `openclaw skills install . --as compass`.

For one configured agent, target the agent workspace explicitly:

```bash
openclaw skills install git:TDamiao/compass@v1.0.0 --agent <id>
```

Use workspace installation for project-specific behavior; use `--global` only when the same version should be shared across local agents. Agent allowlists can still narrow visibility.

## Verify, update and remove

```bash
openclaw skills list
openclaw skills info compass
openclaw skills check
```

For ClawHub-installed skills, inspect and verify the registry entry before use:

```bash
openclaw skills verify @TDamiao/compass
openclaw skills verify @TDamiao/compass --card
```

`openclaw skills update --all` updates workspace ClawHub installs; `openclaw skills update @TDamiao/compass --global` updates a shared ClawHub install. OpenClaw does not update Git or local installs through this mechanism. Refresh a Git install by reinstalling the source, using `--force` when the existing workspace slug must be replaced:

```bash
openclaw skills install git:TDamiao/compass@v1.0.0 --force
```

For a local checkout, rerun `openclaw skills install ./path/to/compass --as compass --force`. For ClawHub installs, the official removal command is provided by the standalone CLI:

```bash
npm i -g clawhub
clawhub uninstall @TDamiao/compass
```

For Git/local installs, remove the copied skill directory from the target workspace or managed directory. Do not delete a global copy when only a workspace copy should be removed.

To target one configured agent during supported workspace operations, add `--agent <id>`; this cannot be combined with `--global`.

## ClawHub publication

Compass is not published automatically. After authorization, from the package root:

```bash
npm i -g clawhub
clawhub login
clawhub skill publish ./compass --slug compass --name "Compass" --version 1.0.0 --dry-run
```

Review the dry run, then publish without `--dry-run`. ClawHub performs validation and automated security checks. Future users can install `@TDamiao/compass` through OpenClaw. The ClawHub CLI and native OpenClaw commands are separate surfaces: use `clawhub` for auth/publishing and `openclaw skills` for runtime installation.
