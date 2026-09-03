"""Dependency-free structural checks for the portable Compass package."""

from pathlib import Path
import re
import sys


ROOT = Path(__file__).resolve().parents[1]
CORE = [ROOT / "SKILL.md", *sorted((ROOT / "references").glob("*.md"))]
REQUIRED = [
    ROOT / "SKILL.md",
    ROOT / "README.md",
    ROOT / "LICENSE",
    ROOT / "VERSION",
    ROOT / "CHANGELOG.md",
    ROOT / "agents" / "openai.yaml",
    ROOT / "references" / "audit-and-review.md",
    ROOT / "references" / "critical-scenarios.md",
    ROOT / "references" / "product-design-framework.md",
]


def fail(message):
    print(f"FAIL: {message}")
    return 1


def main():
    legacy_slug = "-".join(("product", "experience", "owner"))
    for path in REQUIRED:
        if not path.is_file():
            return fail(f"missing {path.relative_to(ROOT)}")

    skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---\n", skill, re.S)
    if not match:
        return fail("invalid SKILL.md frontmatter delimiters")
    frontmatter = match.group(1)
    if not re.search(r"^name:\s*compass\s*$", frontmatter, re.M):
        return fail("SKILL.md name is not compass")
    if not re.search(r"^description:\s*.+$", frontmatter, re.M):
        return fail("SKILL.md description is missing")
    if len(skill.split("\n", 500)) > 500:
        return fail("SKILL.md exceeds the recommended 500-line limit")

    for path in CORE:
        text = path.read_text(encoding="utf-8")
        if legacy_slug in text:
            return fail(f"legacy slug found in {path.relative_to(ROOT)}")
        if re.search(r"[A-Za-z]:\\|/Users/|/home/|/root/", text):
            return fail(f"absolute path found in {path.relative_to(ROOT)}")
        for ref in re.findall(r"\]\((references/[^)]+)\)", text):
            if not (ROOT / ref).is_file():
                return fail(f"broken reference {ref} in {path.relative_to(ROOT)}")

    print("PASS: Compass package structure, Core portability and relative references are valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
