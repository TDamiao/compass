# Compass CLI release procedure

Compass `1.1.0` is available at tag `v1.1.0`. The CLI is a separate npm package, `components-compass@0.1.0`, with the executable `compass`. CLI releases use tags `cli-vX.Y.Z`; they do not change or retag the Compass registry release.

The CLI supports registry schema `1.0.0` and defaults to the immutable `v1.1.0` ref in `cli/src/registry.js`. Registry and component URLs are derived centrally from that ref. The package name `components-compass` is independent from the Compass Components registry name and from the earlier scoped npm package. Do not publish or deprecate either package during preparation.

## CLI publication

1. Confirm `v1.1.0` still contains the registry, schema and registered component files.
2. Keep the CLI default ref pinned to `v1.1.0`; do not alter the ecosystem release tag.
3. Run root checks: `npm ci`, `npm test`, `npm run build`, `python tests/validate_package.py`, and `node scripts/test-cli-package.mjs`.
4. Require the CLI package matrix to pass on Ubuntu, macOS and Windows.
5. Confirm `components-compass@0.1.0` is available and the publisher has permission immediately before an approved release. An `E404` alone does not prove availability.
6. Configure the GitHub `npm-publish` environment with required reviewers and configure npm Trusted Publishing for `TDamiao/compass`, workflow `publish.yml`, environment `npm-publish`. The environment is not configured in this repository yet.
7. Only after those protections and the npm publisher are verified, set the repository variable `NPM_PUBLISH_ENABLED=true`; without it, the publish job is skipped. Then create a GitHub release tagged `cli-v0.1.0`, or dispatch the workflow from `main` after that matching tag exists.
8. The workflow validates the tag/version, checks that this version is not already published, packs and tests the executable on three operating systems, then publishes with npm Trusted Publishing (OIDC).
9. After an approved successful release, verify `npm view components-compass version` and run `npx --yes --package=components-compass -- compass --version` plus `list` against the pinned registry.

Never store a permanent npm token in the repository or publish the old scoped package as part of this release. Record a publication only after npm confirms version `0.1.0`.
