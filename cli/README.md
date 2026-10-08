# Compass Components CLI

The `components-compass` npm package provides the `compass` command for browsing the Compass Components registry and installing framework-neutral reference patterns. The current release is `0.1.1`, published through GitHub Actions Trusted Publishing/OIDC. The initial `0.1.0` release was bootstrapped manually.

## Usage

Run a command without a global install:

```sh
npx --yes --package=components-compass -- compass list
npx --yes --package=components-compass -- compass search <query>
npx --yes --package=components-compass -- compass search sidebar
npx --yes --package=components-compass -- compass info sidebar
npx --yes --package=components-compass -- compass add sidebar
```

For a project-local installation:

```sh
npm install --save-dev components-compass
npx compass list
```

After a global installation, invoke the binary directly:

```sh
compass list
compass info sidebar
compass add sidebar
```

Or install globally and use the `compass` command:

```sh
npm install -g components-compass
compass list
```

`add` writes the guide, metadata and reference files to `compass/<id>/`, together with a deterministic `compass-source.json` provenance manifest. Existing destinations are not overwritten. Planned patterns can be inspected but cannot be installed. `add` installs a framework-neutral reference pattern for adaptation. It does not automatically integrate the component into an application.

The CLI does not detect a framework, add dependencies or execute downloaded code.

## Registry source and compatibility

All default registry URLs and the default ref are centralized in `src/registry.js`. The CLI defaults to the immutable Compass `v1.1.0` registry snapshot and explicitly supports registry schema `1.0.0`; unknown schema versions fail with an error instead of being interpreted.

For local development and tests, configure `COMPASS_REGISTRY_REF`, `COMPASS_REGISTRY_URL`, and `COMPASS_COMPONENTS_BASE_URL`. If both URL variables are set, the registry and component files can be served from a local or alternate host. Tests do not require GitHub access.

Compass `1.1.0` is the current ecosystem release. The CLI has its own SemVer track, separate from Compass and from the component versions in registry metadata. See [the CLI release procedure](../docs/releasing-cli.md).
