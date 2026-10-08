# Compass CLI release procedure

The package is currently `@tdamiao/compass-components@0.1.0` and remains private. It has not been published. The CLI has its own SemVer lifecycle; the repository version describes the Compass ecosystem, and each component keeps the version in its registry entry. This keeps CLI fixes independent from ecosystem releases and component design changes.

The repository is at Compass `1.0.0` (`VERSION` and tag `v1.0.0`). Since that tag, the project added Compass Interface guidance, the Compass Components skill and registry, the catalog, and the CLI. These are additive capabilities, so the recommended next global version is `1.1.0`, not a patch to `1.0.0`. Keep `VERSION` at `1.0.0` until that release is actually prepared.

The CLI supports registry schema `1.0.0`. Its default registry ref is currently the development fallback `main`, because the proposed compatible release tag does not exist yet. Before a publication, create and verify the compatible Compass release tag (recommended `v1.1.0`), then change `DEFAULT_REGISTRY_REF` in `cli/src/registry.js` to that existing immutable tag. The registry URL and component base URL are derived centrally from that ref. Do not publish a CLI whose default ref points to an uncreated tag or mutable `main`.

## First publication

1. Validate the repository with `npm ci`, `npm test`, `npm run build`, and `python tests/validate_package.py`.
2. Complete the Compass `1.1.0` release notes and review the global changes since `v1.0.0`.
3. Create the Compass `v1.1.0` release ref only after the release contents are final.
4. Pin `DEFAULT_REGISTRY_REF` to `v1.1.0` and verify the tag contains `compass-components/registry/registry.json` and all registered files.
5. Wait for the `Test Compass CLI package` matrix to pass on Ubuntu, Windows, and macOS.
6. Recheck that `@tdamiao/compass-components` is available and that the publishing account can publish under `@tdamiao`.
7. Remove the exact `"private": true` property from `cli/package.json` in the release commit. The repository's root package can remain private.
8. Run `npm pack ./cli`, inspect the archive contents and size, then install that tarball in a clean external project and run the packed-package smoke test.
9. Publish with `npm publish --access public` from `cli/`.
10. Verify the published version with `npx @tdamiao/compass-components --version` and run `list` against the pinned registry. Keep the committed release metadata and registry pin consistent with the published package.

Do not create a package reservation or publish during release-candidate preparation. A registry `E404` lookup is not proof that the npm scope is owned or that the current account has publish permission; both checks must be repeated immediately before release.
