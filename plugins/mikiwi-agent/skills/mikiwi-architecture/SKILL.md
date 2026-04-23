---
name: mikiwi-architecture
description: Use when planning or implementing structural changes in MiKiwi. Applies AGENTS.md, SOLID, Laravel Domain boundaries, React/Inertia folder rules, and project validation criteria.
---

# MiKiwi Architecture

Use this skill for broad changes, refactors, feature placement, or decisions about where code should live.

## Required Context

1. Read `AGENTS.md` first. It is the authority for this repo.
2. If any older instruction conflicts with `AGENTS.md`, follow `AGENTS.md`.
3. Read the files directly affected before proposing or editing structure.

## Architecture Rules

- Backend flow: `Route -> Controller -> Domain Service/Action -> Repository -> Model -> Response/Inertia Page`.
- Keep controllers thin: validation, authorization, delegation, response.
- Put business logic in `app/Domain/<Module>`.
- Use interfaces only when they reduce real coupling.
- Keep Eloquent models focused on relations, casts, small scopes, factories, and schema configuration.
- For frontend pages, use `resources/js/Pages/<Area>/<PageName>/<PageName>.jsx`.
- For reusable components, use `resources/js/Components/<ComponentName>/<ComponentName>.jsx`.
- Use CSS Modules for new local styles.
- Do not create new code in obsolete destinations such as `resources/js/Features` or `resources/js/Components/Common`.

## SOLID Checklist

- Single Responsibility: each class/component has one main reason to change.
- Open/Closed: add focused actions/services/strategies instead of expanding fragile conditionals.
- Liskov: implementations must honor their contracts.
- Interface Segregation: prefer small interfaces tied to actual callers.
- Dependency Inversion: depend on abstractions only where there is a clear benefit.

## Before Finishing

Run the smallest useful validation for the touched area:

- Frontend: `npm run build`.
- Backend: focused `php artisan test` or `composer test`.
- PHP style: `./vendor/bin/pint` when PHP was edited.
- Routes/controllers: `php artisan route:list` when route shape changed.
