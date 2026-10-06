# Component authoring

## Required component files

```text
components/<id>/
├── README.md
├── component.json
└── reference/          # only for implemented entries
    ├── example.html
    ├── component.css
    └── component.js    # omit when native HTML fully covers behavior
```

Keep `README.md` as the human and agent product contract. Metadata is concise, machine-readable distribution information. Reference code demonstrates one valid implementation in a clearly named stack; it does not define a required Compass framework.

## Required guide sections

Document name, description, problem, when to use / not use, anatomy, meaningful variants, applicable states, responsive behavior, accessibility and keyboard behavior, semantic token roles, dependencies, runnable/useful examples, AI-agent advice and tradeoffs. Describe API details only for the reference implementation and mark them as such.

## Quality bar

- Preserve user's task and required evidence; no decorative functionality.
- Use native elements and existing project primitives where suitable.
- State transitions and displayed state must agree; no inert controls.
- Keep narrow-screen reading/order/action usable, not just smaller.
- Provide names/labels, visible focus, keyboard paths and non-color state cues.
- Keep data, network, auth and persistence assumptions explicit; examples must not fabricate them.
- Minimize dependencies; list every true runtime dependency in metadata.
- Include only states that apply to the pattern.
- Avoid duplicated token systems and project-specific product rules in generic primitives.

Planned patterns should still have useful product guidance but must not contain empty source files or imply they can be installed. Set registry `status` to `planned` and `files` to `[]` until implementation is real.
