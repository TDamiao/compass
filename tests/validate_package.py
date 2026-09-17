"""Dependency-free structural checks for both portable Compass skills."""

from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
SKILLS = (
    (ROOT, "compass"),
    (ROOT / "compass-interface", "compass-interface"),
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


def main():
    for path in REQUIRED:
        if not path.is_file():
            return fail(f"missing {path.relative_to(ROOT)}")
    for skill_root, expected_name in SKILLS:
        error = validate_skill(skill_root, expected_name)
        if error:
            return fail(error)
    print("PASS: both skill entrypoints, portable bundles and reference graphs are valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
