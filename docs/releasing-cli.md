# Compass CLI release procedure

Compass `1.1.0` is available at the immutable tag `v1.1.0`. The CLI is a separate npm package, `components-compass`, with the executable `compass`; its version has an independent SemVer track. CLI tags use `cli-vX.Y.Z` and must never move or retag the Compass ecosystem release.

The CLI supports registry schema `1.0.0` and defaults to the immutable `v1.1.0` ref in `cli/src/registry.js`. Registry and component URLs are derived centrally from that ref.

## Current release state

`components-compass@0.1.0` is the first public CLI release. It was bootstrapped manually; do not publish this version again. GitHub Actions Trusted Publishing/OIDC is configured for subsequent CLI releases, using the `publish.yml` workflow and the `npm-publish` environment. The environment requires review by `TDamiao`.

The repository variable `NPM_PUBLISH_ENABLED` is intentionally absent while no new CLI release is approved. There is no permanent npm token in the repository. The first future OIDC validation must happen as part of a real new CLI release; do not republish `0.1.0` just to test OIDC.

## Future CLI release

1. Make a real CLI change and update `cli/package.json` to the new SemVer version. Do not change the Compass `VERSION` or the `v1.1.0` tag unless making a separate Compass ecosystem release.
2. Keep the CLI default registry ref pinned to `v1.1.0` unless a documented CLI change intentionally supports another immutable registry release.
3. Run `npm ci`, `npm test`, `npm run build`, `python tests/validate_package.py`, and `node scripts/test-cli-package.mjs` from the repository root. Confirm the Ubuntu, macOS and Windows package matrix passes.
4. Confirm the new package version is not already present on npm. Treat registry errors other than a clear missing version as a blocker.
5. Create and push an annotated `cli-vX.Y.Z` tag at the commit whose `cli/package.json` name and version match that tag. The publish workflow validates this correspondence.
6. For an approved release only, set `NPM_PUBLISH_ENABLED=true` and dispatch `publish.yml` from `main` after the matching tag exists, or publish a GitHub release for that `cli-vX.Y.Z` tag. The workflow runs validation before the publish job and fails closed for an existing or unverifiable npm version.
7. The publish job uses Node.js 24, the `npm-publish` environment, and npm Trusted Publishing/OIDC for direct `npm publish`. Approve the pending environment deployment as `TDamiao` when GitHub requests it. Do not add npm tokens or OTPs to repository configuration.
8. Verify the public npm version, `latest` dist-tag and `compass` bin. Smoke test `--version`, `--help`, `list`, `info sidebar` and `add sidebar` outside the repository. Confirm `compass-source.json` records the CLI version and registry ref.
9. After the release is verified, set `NPM_PUBLISH_ENABLED=false` until another release is approved. Record the release in documentation only after npm confirms it.

For `components-compass@0.1.0`, the bootstrap publication is already complete; do not dispatch the publish workflow or run another publish for that version. A future version such as `0.1.1` should be created only when a real change justifies it.

Never publish or deprecate the earlier scoped package as part of CLI releases. Never store a permanent npm token in this repository.
