"""Dependency-free checks for Compass bundles, local links and component registry."""

from pathlib import Path
import json
import re
import sys
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
SKILLS = (
    (ROOT, "compass"),
    (ROOT / "compass-interface", "compass-interface"),
    (ROOT / "compass-components", "compass-components"),
)
REQUIRED = (
    ROOT / "README.md",
    ROOT / "LICENSE",
    ROOT / "VERSION",
    ROOT / "CHANGELOG.md",
)


def fail(message):
    print(f"FAIL: {message}")
    return 1


def validate_skill(skill_root, expected_name):
    entry = skill_root / "SKILL.md"
    for path in (entry, skill_root / "agents" / "openai.yaml"):
        if not path.is_file():
            return f"missing {path.relative_to(ROOT)}"

    skill = entry.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---\n", skill, re.S)
    if not match:
        return f"invalid frontmatter in {entry.relative_to(ROOT)}"
    frontmatter = match.group(1)
    if not re.search(rf"^name:\s*{re.escape(expected_name)}\s*$", frontmatter, re.M):
        return f"wrong skill name in {entry.relative_to(ROOT)}"
    description = re.search(r"^description:[ \t]*(.+)$", frontmatter, re.M)
    if not description or not description.group(1).strip().strip("\"'"):
        return f"missing description in {entry.relative_to(ROOT)}"
    if len(description.group(1).strip().strip("\"'")) > 1024:
        return f"description too long in {entry.relative_to(ROOT)}"
    if len(skill.splitlines()) > 500:
        return f"{entry.relative_to(ROOT)} exceeds 500 lines"

    references = set((skill_root / "references").rglob("*.md"))
    if not references:
        return f"no references in {skill_root.relative_to(ROOT)}"

    # Follow actual relative links from each document. This also catches
    # missing nested references and dependencies outside the portable bundle.
    pending = [entry]
    visited = set()
    legacy_slug = "-".join(("product", "experience", "owner"))
    while pending:
        path = pending.pop().resolve()
        if path in visited:
            continue
        visited.add(path)
        content = path.read_text(encoding="utf-8")
        if legacy_slug in content:
            return f"legacy slug found in {path.relative_to(ROOT)}"
        if re.search(r"[A-Za-z]:\\|/Users/|/home/|/root/", content):
            return f"absolute path found in {path.relative_to(ROOT)}"
        for target in re.findall(r"\]\(([^)\n]+)\)", content):
            link = urlsplit(target.strip("<>"))
            if link.scheme or link.netloc or not link.path:
                continue
            resolved = (path.parent / unquote(link.path)).resolve()
            if not resolved.is_relative_to(skill_root.resolve()):
                return f"reference escapes skill bundle: {target} in {path.relative_to(ROOT)}"
            if not resolved.is_file():
                return f"broken reference {target} in {path.relative_to(ROOT)}"
            if resolved.suffix == ".md":
                pending.append(resolved)

    orphaned = sorted(path for path in references if path.resolve() not in visited)
    if orphaned:
        return f"unreachable reference {orphaned[0].relative_to(ROOT)}"
    return None


def validate_registry():
    bundle = ROOT / "compass-components"
    registry_path = bundle / "registry" / "registry.json"
    schema_path = bundle / "registry" / "schema.json"
    try:
        registry = json.loads(registry_path.read_text(encoding="utf-8"))
        schema = json.loads(schema_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        return f"invalid registry or schema JSON: {error}"

    if not isinstance(registry, dict) or not isinstance(schema, dict):
        return "registry and schema must be JSON objects"
    if registry.get("schemaVersion") != schema.get("properties", {}).get("schemaVersion", {}).get("const"):
        return "registry schemaVersion does not match schema.json"
    if (registry.get("name") != "compass-components"
            or not isinstance(registry.get("description"), str)
            or not isinstance(registry.get("categories"), list)
            or not isinstance(registry.get("components"), list)):
        return "invalid registry identity or components list"
    allowed_categories = {"navigation", "actions", "data", "feedback", "overlay", "forms", "ai"}
    if (not registry["categories"]
            or any(not isinstance(item, str) for item in registry["categories"])
            or len(registry["categories"]) != len(set(registry["categories"]))
            or not set(registry["categories"]) <= allowed_categories):
        return "invalid registry categories"

    ids = set()
    for component in registry["components"]:
        if not isinstance(component, dict):
            return "component entries must be JSON objects"
        component_id = component.get("id", "")
        if not isinstance(component_id, str):
            return f"invalid component id: {component_id!r}"
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", component_id):
            return f"invalid component id: {component_id!r}"
        if component_id in ids:
            return f"duplicate component id: {component_id}"
        ids.add(component_id)
        for key in ("name", "description", "version", "implementation"):
            if not isinstance(component.get(key), str) or not component[key].strip():
                return f"missing or invalid {key} for {component_id}"
        if not re.fullmatch(r"\d+\.\d+\.\d+", component["version"]):
            return f"invalid version for {component_id}"
        if component.get("category") not in registry.get("categories", []):
            return f"unknown category for {component_id}"
        if not isinstance(component.get("status"), str) or component["status"] not in {"stable", "draft", "planned"}:
            return f"invalid status for {component_id}"
        dependencies = component.get("dependencies")
        if (not isinstance(dependencies, list)
                or any(not isinstance(item, str) or not item.strip() for item in dependencies)
                or len(dependencies) != len(set(dependencies))):
            return f"invalid dependencies for {component_id}"
        files = component.get("files")
        if (not isinstance(files, list)
                or any(not isinstance(item, str) or not item.strip() for item in files)
                or len(files) != len(set(files))):
            return f"invalid file list for {component_id}"
        if component["status"] == "planned":
            if files or component.get("implementation") != "none":
                return f"planned component has implementation files: {component_id}"
            continue
        if not files or component.get("implementation") == "none":
            return f"implemented component has no files: {component_id}"
        required_files = {
            f"components/{component_id}/README.md",
            f"components/{component_id}/component.json",
            f"components/{component_id}/reference/example.html",
            f"components/{component_id}/reference/component.css",
        }
        if not required_files <= set(files):
            return f"implemented component is missing a required guide/reference file: {component_id}"
        metadata_path = bundle / "components" / component_id / "component.json"
        guide_path = bundle / "components" / component_id / "README.md"
        if not metadata_path.is_file() or not guide_path.is_file():
            return f"missing guide or metadata for {component_id}"
        try:
            metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as error:
            return f"invalid metadata for {component_id}: {error}"
        if not isinstance(metadata, dict):
            return f"metadata must be an object for {component_id}"
        for key in ("id", "name", "category", "status", "description", "version", "implementation", "dependencies", "files"):
            if metadata.get(key) != component.get(key):
                return f"registry metadata mismatch for {component_id}.{key}"
        for file_name in files:
            path = (bundle / file_name).resolve()
            if not path.is_relative_to(bundle.resolve()):
                return f"registry path escapes bundle: {file_name}"
            if not path.is_file():
                return f"registry file missing: {file_name}"
        if component["status"] == "stable":
            guide = guide_path.read_text(encoding="utf-8")
            for heading in ("## Problem", "## Anatomy", "## States", "## Accessibility", "## Tokens", "## AI agent guidance"):
                if heading not in guide:
                    return f"component guide {component_id} missing section: {heading}"

    schema_components = schema.get("$defs", {}).get("component", {})
    required = set(schema_components.get("required", []))
    if required != {"id", "name", "category", "status", "description", "version", "implementation", "dependencies", "files"}:
        return "component schema required fields drifted"
    return None


def validate_cli_package():
    package_path = ROOT / "cli" / "package.json"
    try:
        package = json.loads(package_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        return f"invalid CLI package.json: {error}"

    if package.get("name") != "components-compass" or package.get("version") != "0.1.1":
        return "CLI package identity must be components-compass@0.1.1"
    if package.get("type") != "module":
        return "CLI package must preserve ESM mode"
    engines = package.get("engines", {}).get("node", "")
    if engines != "^20.19.0 || >=22.12.0":
        return "CLI package Node.js engine range changed unexpectedly"
    bin_path = package.get("bin", {}).get("compass")
    if bin_path not in {"bin/compass.js", "./bin/compass.js"}:
        return "CLI package must map the compass executable to bin/compass.js"
    if "bin/compass.js" not in package.get("files", []):
        return "CLI package files list must include bin/compass.js"
    entrypoint = ROOT / "cli" / "bin" / "compass.js"
    if not entrypoint.is_file() or not entrypoint.read_text(encoding="utf-8").startswith("#!/usr/bin/env node"):
        return "CLI package executable must exist and start with the Node.js shebang"
    if package.get("dependencies"):
        return "CLI package must remain free of runtime dependencies"
    return None


def validate_repository_links():
    markdown_files = ROOT.rglob("*.md")
    for source in markdown_files:
        if any(part in {".git", "node_modules", "dist", "build", "__pycache__"} for part in source.parts):
            continue
        content = source.read_text(encoding="utf-8")
        for target in re.findall(r"\]\(([^)\n]+)\)", content):
            link = urlsplit(target.strip("<>"))
            if link.scheme or link.netloc or not link.path:
                continue
            resolved = (source.parent / unquote(link.path)).resolve()
            if not resolved.is_relative_to(ROOT.resolve()):
                return f"repository link escapes root: {target} in {source.relative_to(ROOT)}"
            if not resolved.is_file():
                return f"broken repository link {target} in {source.relative_to(ROOT)}"
    return None


def main():
    for path in REQUIRED:
        if not path.is_file():
            return fail(f"missing {path.relative_to(ROOT)}")
    for skill_root, expected_name in SKILLS:
        error = validate_skill(skill_root, expected_name)
        if error:
            return fail(error)
    for validator in (validate_registry, validate_cli_package, validate_repository_links):
        error = validator()
        if error:
            return fail(error)
    print("PASS: three skill bundles, local links, component metadata and registry are valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
