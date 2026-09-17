# Hermes Agent

Compass covers product/UX decisions; Compass Interface covers visual design and CSS. Install them as separate sibling skills. The repository keeps Compass at the root and its companion under `compass-interface/`.

## Supported workflow

Reviewed against the [official Hermes skills documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills) on 2026-09-17. Hermes documents slash invocation, reference loading through `skill_view(name, path)`, explicit GitHub skill paths and URL installs with referenced support files. These are documented capabilities; installation and model behavior have not been executed in Hermes in this checkout.

No Hermes-specific toolset is mandatory for discovery. Terminal/file access enables implementation; a browser enables visual verification. The skills can still review supplied content without either.

## Install from GitHub

For the companion's explicit directory:

```bash
hermes skills install TDamiao/compass/compass-interface
```

For Compass at the repository root, the documented URL form avoids guessing a root-directory GitHub identifier:

```bash
hermes skills install https://raw.githubusercontent.com/TDamiao/compass/main/SKILL.md
```

These commands fetch published `main`, not unpublished local edits. Current documentation says URL installs include exact referenced support files. Verify the installed references; older Hermes releases may behave differently. The local method below also works for testing an unpublished checkout.

## Local checkout method

Use the skills directory for your active Hermes profile. The default is `~/.hermes/skills/`. From this repository, copy the following two bundles, preserving each reference tree:

| Source | Destination under the active skills directory |
| --- | --- |
| Root `SKILL.md` and root `references/` | `compass/SKILL.md` and `compass/references/` |
| `compass-interface/SKILL.md` and `compass-interface/references/` | `compass-interface/SKILL.md` and `compass-interface/references/` |

Keep locally edited versions before replacing them. The sibling layout gives each skill a clear root; avoid copying the entire repository inside the Compass skill and then installing a second companion copy. `agents/openai.yaml` is optional for this Hermes workflow; the instructions live in each `SKILL.md`.

## Verify and use

```bash
hermes skills list
```

Confirm that both names appear. In a fresh session, use:

```text
/compass-interface Melhore o design desta página seguindo a marca atual. Inspecione o CSS e valide o resultado com as ferramentas disponíveis.
```

For a task spanning both responsibilities, recent Hermes supports leading slash commands together:

```text
/compass /compass-interface Reorganize esta página de produto e implemente a interface. Preserve preço, condição, vendedor e frete.
```

Natural-language fallback:

```text
Use compass para definir intenção e prioridades. Depois use compass-interface para implementar o visual, CSS e estados. Leia apenas as referências necessárias.
```

Ask Hermes to open `references/css-implementation.md` and `references/product-lessons.md` from `compass-interface` to confirm the bundle was preserved. Run relevant scenarios from [the smoke tests](../tests/SMOKE_TEST.md); distinguish an installed name from a successful behavioral test.

## Updates and troubleshooting

Hub installs track their source: use `hermes skills check`, then `hermes skills update compass` or `hermes skills update compass-interface`. For local copies, refresh each bundle from the reviewed checkout while preserving local changes.

If missing or stale, inspect the active profile, installed paths and enabled state. Check for duplicate names in project, local and external skill roots. Missing references require repairing the bundle. If the skill can edit code but cannot render it, expect useful implementation plus an explicit visual-verification gap.

Repository checks establish package integrity, not Hermes execution. Record the Hermes version, source revision, reference-loading result and observed response when testing in your installation.
