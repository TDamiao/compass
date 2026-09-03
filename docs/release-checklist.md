# Release checklist

Use this checklist for each Compass release. Mark runtime items only after executing them against the target release; documentation review alone is not a smoke test.

Repository: `TDamiao/compass`  
Release candidate: `v1.0.0`

## Package

- [ ] `SKILL.md` is valid against the Agent Skills specification
- [ ] All relative references resolve
- [ ] Portable tests pass
- [ ] `VERSION` matches the release
- [ ] `CHANGELOG.md` is updated
- [ ] Package requires only `SKILL.md` plus optional references at runtime

## Git

- [ ] Working tree is clean
- [ ] Release commit exists
- [ ] Tag `v1.0.0` exists
- [ ] Tag is pushed to the canonical remote

## Codex

- [ ] Project-local installation tested at `.agents/skills/compass/`
- [ ] User installation tested at `~/.agents/skills/compass/` when applicable
- [ ] Skill is recognized in a new session
- [ ] `$compass` smoke prompt produces product-first reasoning

## Hermes Agent

- [ ] Real GitHub installation path tested; root-repository path remains explicitly marked “to be verified” until confirmed
- [ ] `SKILL.md` and `references/` are present after installation
- [ ] `hermes skills list` shows Compass
- [ ] Hermes smoke test executed in a new session

## OpenClaw

- [ ] Git installation tested with `openclaw skills install git:TDamiao/compass@v1.0.0`
- [ ] `openclaw skills list` succeeds
- [ ] `openclaw skills info compass` succeeds
- [ ] `openclaw skills check` succeeds
- [ ] Workspace and, if needed, `--global` scope tested
- [ ] Agent-specific install tested with `--agent <id>` when applicable
- [ ] OpenClaw smoke test executed
- [ ] Git/local update procedure tested by reinstalling the source; do not use ClawHub update commands for it

## Documentation

- [ ] Every installation command in Quick Start was copied literally and executed
- [ ] README Quick Start works from a clean checkout
- [ ] Relative and official documentation links work
- [ ] Unknown or unverified behavior is labeled explicitly

## Release

- [ ] GitHub release published

## Registries

- [ ] ClawHub publication completed, if applicable
- [ ] Hermes ecosystem publication/tap completed, if applicable
