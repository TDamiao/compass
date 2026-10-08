# Compass Components CLI

The `@tdamiao/compass-components` package provides the `compass` command for browsing the Compass Components registry and installing framework-neutral reference patterns. The package is private and has not been published yet.

## Usage

When published, use it without installing:

```sh
npx @tdamiao/compass-components list
npx @tdamiao/compass-components info sidebar
npx @tdamiao/compass-components add sidebar
```

After a global or project-local installation, invoke the binary directly:

```sh
compass list
compass info sidebar
compass add sidebar
```

`add` writes the guide, metadata and reference files to `compass/<id>/`, together with a deterministic `compass-source.json` provenance manifest. Existing destinations are not overwritten. Planned patterns can be inspected but cannot be installed.

The CLI installs reference files for adaptation. It does not integrate them into an application, detect a framework, add dependencies or execute downloaded code.

## Registry source and compatibility

All default registry URLs and the development ref are centralized in `src/registry.js`. The Compass `v1.1.0` tag provides an immutable registry snapshot, but this ecosystem release leaves the CLI default on the development fallback `main`. Pin `DEFAULT_REGISTRY_REF` to `v1.1.0` in a later CLI-specific release before publishing. The CLI explicitly supports registry schema `1.0.0`; unknown schema versions fail with an error instead of being interpreted.

For local development and tests, configure `COMPASS_REGISTRY_REF`, `COMPASS_REGISTRY_URL`, and `COMPASS_COMPONENTS_BASE_URL`. If both URL variables are set, the registry and component files can be served from a local or alternate host. Tests do not require GitHub access.

Compass `1.1.0` is the current ecosystem release. The CLI remains `0.1.0` on its own SemVer track, and components keep their own versions in registry metadata. See [the CLI release procedure](../docs/releasing-cli.md).

## Package name

The proposed package name is `@tdamiao/compass-components`. A current npm registry lookup returned `E404` for that package; it has not been registered by this project. Recheck package availability and scope publishing access immediately before publication. The npm lookup cannot establish the account's scope permissions.
