Frontend architecture boundaries

This project follows a layered frontend architecture.

Layers
- Pages, Components, Layouts: UI and presentation
- Features/hooks: orchestration and UI-facing feature APIs
- Features/services: data access and external I/O
- Shared: cross-cutting utilities with no app-layer coupling

Dependency direction
- UI -> Features/hooks -> Features/services
- Features/* -> Shared
- Shared -> (no app-layer dependencies)

Disallowed imports (enforced by ESLint)
- UI cannot import Axios directly
- UI cannot import from Features/*/services
- Features cannot import from Pages or Components
- Shared cannot import from Features, Pages, or Components

Why
- Prevent layer leaks and hidden coupling
- Keep business/data access testable and reusable
- Protect long-term maintainability with explicit boundaries

When adding new code
1. Put HTTP calls in Features/*/services.
2. Expose UI-safe API via Features/*/hooks.
3. Consume hooks from Pages/Components/Layouts.
4. Keep Shared dependency-light and framework-agnostic.
