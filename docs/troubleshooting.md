# Troubleshooting

## Skill does not appear

Confirm the package contains a root `SKILL.md`, exact lowercase `name: compass`, valid YAML frontmatter and the expected runtime skill root. Restart or start a new session after installation. Check that another copy is not shadowing it.

## Skill appears but does not activate

Use explicit `$compass` invocation and a request that names a Web product decision, UX audit, information architecture, friction, trust, conversion or implementation review. The description intentionally excludes native mobile-app design.

## Runtime loads an old version

Inspect the active workspace and global roots. Remove or update the stale copy using that runtime's mechanism, then start a fresh session. Git/local OpenClaw installs must be reinstalled; `openclaw skills update` is for ClawHub installs.

## References are not found

The package is multi-file. Reinstall or copy the entire `compass/` folder, preserving `references/` beside `SKILL.md`. Do not install Hermes' single-file URL form for Compass.

## Git installation does not update

Git installs are source copies, not ClawHub-managed versions. Pin a ref for reproducibility and reinstall when the ref changes. For OpenClaw, only ClawHub installs are tracked by `openclaw skills update`.

## Workspace vs global conflict

Prefer workspace scope for project-specific behavior and global scope for a shared version. Remove duplicates or follow the runtime's precedence rules; never assume two copies are merged.

## Frontmatter or slug error

The folder may be named `compass`, and `SKILL.md` must declare `name: compass`. Keep the description under the standard limit and use only lowercase letters, digits and hyphens in `name`.
