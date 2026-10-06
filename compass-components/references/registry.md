# Registry contract

`registry/registry.json` is a versioned, readable index intended for docs and future installers. It is not yet a published endpoint or CLI contract.

Each record has a stable `id` equal to its directory slug, a display `name`, `category`, lifecycle `status`, short `description`, `version`, framework `implementation`, `dependencies`, and `files` relative to the bundle root. Status is `stable` only for a documented and implemented entry; use `planned` for a roadmap entry and `draft` for work in progress. A planned entry has an empty `files` list and `implementation: "none"`.

File paths must stay inside `compass-components/`; paths are exact and case-sensitive for portability. `dependencies` names actual external runtime packages; keep it empty for native platform examples. IDs are distribution identifiers and should not be renamed casually. Future breaking file/API changes should increment that component's version.

The JSON Schema is [schema.json](../registry/schema.json). Package validation also checks uniqueness, metadata agreement, file existence, path traversal and planned/implemented file rules.
