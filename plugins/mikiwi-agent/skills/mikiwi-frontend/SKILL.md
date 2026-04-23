---
name: mikiwi-frontend
description: Use when changing MiKiwi React, Inertia pages, components, hooks, utils, layouts, CSS Modules, configurator UI, or 3D frontend behavior.
---

# MiKiwi Frontend

Use this skill for React/Inertia/frontend work in MiKiwi.

## Required Context

1. Read `AGENTS.md` before editing.
2. If touching styles, read `resources/css/global.css` first.
3. Inspect the existing page/component pattern before adding files.

## Folder Rules

- Inertia pages live in `resources/js/Pages/<Area>/<PageName>/`.
- Reusable components live in `resources/js/Components/<ComponentName>/`.
- Area-specific components live in `resources/js/Components/<Area>/<ComponentName>/`.
- Global hooks live in `resources/js/Hooks`.
- Global utils live in `resources/js/Utils`.
- Do not create new pages/components in `resources/js/Features`, `Shared`, `Common`, generic `partials`, or generic `sections`.

## Code Rules

- Use `@/` imports for internal `resources/js` modules.
- Use CSS Modules for local styles.
- Reuse existing global CSS tokens before adding new values.
- Keep React components focused: separate data preparation, interaction logic, layout, and styling when complexity grows.
- Add accessible labels, keyboard support, focus states, disabled states, and loading states where applicable.
- Avoid loading Three.js or 3D assets on routes that do not need them.

## Validation

- Run `npm run build` for frontend changes.
- For configurator or 3D changes, validate 2D view, 3D transition, Cloudinary assets, console errors, and build.
