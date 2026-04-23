---
name: mikiwi-backend
description: Use when changing MiKiwi Laravel routes, controllers, requests, resources, services, actions, repositories, models, migrations, seeders, policies, or backend tests.
---

# MiKiwi Backend

Use this skill for Laravel backend work in MiKiwi.

## Required Context

1. Read `AGENTS.md` before editing.
2. Inspect affected routes, controllers, requests, domain classes, models, resources, and tests.
3. Preserve user changes already present in the worktree.

## Backend Rules

- Keep `routes/web.php` and `routes/api.php` declarative.
- Keep controllers thin and move business behavior to `app/Domain/<Module>`.
- Use Form Requests for validation and authorization when request rules are non-trivial.
- Use Policies for resource-sensitive authorization.
- Use API Resources for API output and do not expose raw sensitive model fields.
- Do not add business logic to models beyond small reusable scopes.
- Prefer repositories for complex query access patterns.

## Database Rules

- Production and preferred local testing target PostgreSQL.
- CI uses MySQL, so migrations, seeders, queries, and tests must remain compatible with both.
- Do not use migration `after()`.
- Do not introduce raw MySQL-only or PostgreSQL-only SQL unless isolated by driver and justified.
- Do not use raw `ILIKE`; use a shared helper/scope for case-insensitive search.
- Use idempotent seeders: `firstOrCreate`, `updateOrCreate`, or `upsert`.
- Treat JSON, SQL enums, UUIDs, and route model binding as compatibility-sensitive.

## Validation

- Run focused Laravel tests for the touched behavior.
- Run `./vendor/bin/pint` when PHP formatting may be affected.
- Run `php artisan route:list` if routes/controllers changed.
