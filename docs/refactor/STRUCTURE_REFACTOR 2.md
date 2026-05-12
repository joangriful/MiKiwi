<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver a la carpeta" /></a>

# STRUCTURE_REFACTOR

Este documento queda como **referencia histórica** del refactor, pero ya no describe la arquitectura final vigente.

Durante una fase intermedia del proyecto se trabajó con estas ideas:

- frontend organizado por `Features`;
- reutilizables en `Shared`;
- CSS local plano (`Component.css`);
- resolver de Inertia orientado a `Features/**/Pages`.

Ese estado ya no es el actual.

## Arquitectura final consolidada

La estructura vigente es:

### Frontend

- `resources/js/Pages`
- `resources/js/Components`
- `resources/js/Hooks`
- `resources/js/Utils`
- `resources/js/Layouts`

### Backend

- `app/Http/Controllers` como capa fina
- `app/Domain/<Modulo>/Services|Actions|Repositories`
- `app/Models` para Eloquent y relaciones

### Convenciones activas

- No usar `resources/js/Features` como destino nuevo.
- No usar `resources/js/Components/Common`.
- Toda página Inertia debe vivir en:
  - `resources/js/Pages/<Area>/<PageName>/`
  - con `<PageName>.jsx` + `<PageName>.module.css`
- Los componentes reutilizables usan carpeta propia con `*.module.css`.
- Solo se permiten `hooks` y `utils` como subcarpetas internas justificadas en `Components`.

## Documentos que sí mandan ahora

- [docs/AGENTS.md](C:\Users\Angel J Ragel\Desktop\MiKiwi\docs\AGENTS.md)
- [docs/PROJECT_STRUCTURE.md](C:\Users\Angel J Ragel\Desktop\MiKiwi\docs\PROJECT_STRUCTURE.md)
- [docs/refactor/COMMIT_PLAN.md](C:\Users\Angel J Ragel\Desktop\MiKiwi\docs\refactor\COMMIT_PLAN.md)

## Para qué sirve todavía este archivo

Solo para entender el razonamiento histórico del refactor y su evolución. No debe usarse para crear estructura nueva ni para validar si una ubicación actual es correcta.