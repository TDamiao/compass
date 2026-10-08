# Compass CLI release procedure

The ecosystem release Compass `1.1.0` is available at tag `v1.1.0`. The CLI package is `@tdamiao/compass-components@0.1.0`, and its first npm publication is being prepared. The CLI follows its own SemVer lifecycle, while each component keeps its version in registry metadata.

The CLI supports registry schema `1.0.0` and defaults to the immutable `v1.1.0` ref in `cli/src/registry.js`. Registry and component URLs are derived centrally from that ref. The first npm publication remains gated on local validation, external tarball smoke tests, npm scope authorization and the Ubuntu/macOS/Windows matrix.

## First npm publication

1. Confirm `v1.1.0` exists and contains the registry, schema and all registered component files.
2. Keep the CLI default ref pinned to `v1.1.0`; do not alter the ecosystem release tag.
3. Validate with `npm ci`, `npm test`, `npm run build`, and `python tests/validate_package.py`.
4. Wait for `Test Compass CLI package` to pass on Ubuntu, Windows and macOS.
5. Recheck that `@tdamiao/compass-components@0.1.0` is available and confirm the publishing account can publish under `@tdamiao`.
6. Remove the exact `"private": true` property from `cli/package.json` only after the registry is pinned and tests pass.
7. Run `npm pack ./cli`, inspect archive contents and size, then install the tarball in a clean external project and run the packed-package smoke test.
8. Publish once with `npm publish --access public` from `cli/`.
9. Verify npm reports version `0.1.0`, then use `npx @tdamiao/compass-components --version` and run `list` against the pinned registry.

Do not create a package reservation or publish during ecosystem release preparation. An npm `E404` lookup does not establish scope ownership or account permissions; confirm both immediately before publication. Record the actual npm publication only after `npm publish` succeeds and the package is visible at version `0.1.0`.
