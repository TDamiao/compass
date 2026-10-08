# Compass CLI release procedure

The ecosystem release is Compass `1.1.0` (`VERSION` and tag `v1.1.0`). The npm package is `@tdamiao/compass-components@0.1.0`; `cli/package.json` has `"private": true`, and the package has not been published. The CLI follows its own SemVer lifecycle, while each component keeps its version in registry metadata.

The CLI currently supports registry schema `1.0.0`. Its default ref remains the development fallback `main` in this ecosystem release snapshot. The next CLI-specific release must pin `DEFAULT_REGISTRY_REF` in `cli/src/registry.js` to the existing immutable tag `v1.1.0`, then rerun the package matrix. The registry and component URLs are derived centrally from that ref. Do not publish the CLI while its default ref points to mutable `main`.

## First npm publication

1. Confirm `v1.1.0` exists and contains the registry, schema and all registered component files.
2. Set `DEFAULT_REGISTRY_REF` to `v1.1.0` in a CLI-specific change. Do not alter the ecosystem release tag.
3. Validate with `npm ci`, `npm test`, `npm run build`, and `python tests/validate_package.py`.
4. Wait for `Test Compass CLI package` to pass on Ubuntu, Windows and macOS.
5. Recheck that `@tdamiao/compass-components` is available and the publishing account can publish under `@tdamiao`.
6. Remove the exact `"private": true` property from `cli/package.json` in the CLI publication commit. Keep it private until this step.
7. Run `npm pack ./cli`, inspect the archive contents and size, then install the tarball in a clean external project and run the packed-package smoke test.
8. Publish with `npm publish --access public` from `cli/`.
9. Verify with `npx @tdamiao/compass-components --version` and run `list` against the pinned registry.

Do not create a package reservation or publish during ecosystem release preparation. An npm `E404` lookup does not establish scope ownership or account permissions; repeat both checks immediately before publication.
