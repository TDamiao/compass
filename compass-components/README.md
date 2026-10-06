# Compass Components

Production-oriented interface patterns with product and agent guidance. Each entry explains when a pattern helps, when it adds friction, and how to implement its real behavior, responsive priorities and accessibility.

The catalog is a separate companion to Compass Core and Compass Interface. Use **Need → Pattern → Adaptation → Implementation → Validation**; do not copy a catalog example before understanding the product.

## Structure

- `SKILL.md`: agent workflow and relationship to the other Compass layers.
- `registry/registry.json`: machine-readable catalog index, including planned entries.
- `registry/schema.json`: JSON Schema for registry validation.
- `components/<id>/README.md`: product and implementation guidance.
- `components/<id>/component.json`: stable metadata for distribution tooling.
- `components/<id>/reference/`: dependency-free HTML/CSS/JavaScript reference implementation and example.
- `references/`: authoring, foundations, registry and AI interaction guidance.

The HTML/CSS/JavaScript examples are framework-neutral reference implementations, not a prescribed stack or polished hosted catalog. They use semantic tokens with local fallbacks and have no runtime dependencies.

## Add a component

Follow [the authoring guide](references/authoring.md), create a stable lowercase ID directory, complete its guide and metadata, add working reference files only when implemented, and update `registry/registry.json`. Planned patterns must not claim downloadable files. Run `python tests/validate_package.py` from the repository root.

## CLI

The experimental, unpublished v0.1 distribution tool is documented in the [Compass Components CLI guide](../cli/README.md). It installs framework-neutral reference files into a project-local `compass/<id>/` directory; it does not integrate them into an application.

## Catalog

The static [catalog](../catalog/README.md) consumes `registry.json` for category indexes and per-component pages with interactive previews, source, responsive behavior, accessibility and agent guidance. The registry remains its data source; catalog code is not duplicated here.
