---
name: mikiwi-security-review
description: Use when reviewing MiKiwi changes for route security, product exposure, authorization, API resources, validation, sensitive fields, rate limiting, and test coverage.
---

# MiKiwi Security Review

Use this skill for security-sensitive implementation or review.

## Required Context

1. Read `AGENTS.md` before reviewing or editing.
2. Inspect affected routes, middleware, controllers, requests, policies, resources, models, and feature tests.
3. Treat public product/API exposure as sensitive by default.

## Review Checklist

- Routes have the expected middleware and rate limiting.
- Backend authorizes sensitive actions; frontend checks are not the only guard.
- Form Requests or controller validation enforce server-side input constraints.
- Policies protect resource-level access where needed.
- API Resources expose only intended fields.
- Models have safe `$fillable` or `$guarded` behavior.
- Error responses do not leak internal exception details.
- Product/public endpoints do not expose admin-only, draft, hidden, cost, supplier, or internal metadata unless explicitly intended.
- Tests cover route access, unauthorized access, and public exposure rules for sensitive endpoints.

## Validation

- Prefer focused tests first, for example:
  - `php artisan test tests/Feature/RouteSecurityTest.php`
  - `php artisan test tests/Feature/ProductPublicExposureTest.php`
- Run broader backend tests when the touched area has shared security impact.
