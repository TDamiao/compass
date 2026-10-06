# Compass Components CLI

The v0.1 CLI lists registry patterns, shows their product metadata and installs stable reference files:

```sh
node cli/bin/compass.js list
node cli/bin/compass.js info sidebar
node cli/bin/compass.js add sidebar
```

After linking or publishing the package, the same commands use the `compass` binary. `add` writes to `compass/<id>/`, including the original guide, metadata, reference example and a `compass-source.json` provenance manifest. Existing destinations are never overwritten. Planned patterns can be inspected but cannot be installed.

`add` installs a framework-neutral reference pattern for adaptation. It does not automatically integrate the component into your application, detect a framework, add dependencies or run downloaded files.

## Registry source

The default source is the versioned repository content at `https://raw.githubusercontent.com/TDamiao/compass/main/compass-components/registry/registry.json`; pattern files use the same repository ref. The ref and URL are centralized in `src/registry.js`. For local development or a future registry host, set `COMPASS_REGISTRY_REF`, or provide both `COMPASS_REGISTRY_URL` and `COMPASS_COMPONENTS_BASE_URL`. The registry source remains replaceable without changing command or installer code.

The project registry is validated against its existing v1 contract before use. Tests inject a fetch implementation, so they do not depend on GitHub availability.

## Product and AI agent guidance

Use `compass info <component>` to inspect status, intent, dependencies and reference files after deciding the pattern fits the product. Use `compass add <component>` only when that pattern is appropriate, then adapt the example to the host design system, stack, accessibility needs and conventions. Agents should not install patterns mechanically.

## Future npm package name

The `compass` and `compass-components` package names are already occupied. On 2026-10-06, npm returned no published package for `@tdamiao/compass` or `@tdamiao/compass-components`. The recommended name is `@tdamiao/compass-components`, with the `compass` command. Availability and scope ownership must be checked again immediately before publication. This package is currently marked private and has not been published.
