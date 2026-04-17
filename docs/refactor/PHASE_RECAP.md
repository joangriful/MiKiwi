# PHASE_RECAP

Este archivo se conserva **solo como recap histórico** de fases anteriores del refactor.

No debe usarse como fuente de verdad arquitectónica porque describe una etapa intermedia ya superada, cuando el proyecto todavía estaba orientado a:

- `resources/js/Features`
- `resources/js/Shared` como eje principal
- CSS local plano por feature
- resolver de Inertia basado en `Features/**/Pages`

## Fuente vigente

Para la estructura actual del proyecto, usar:

- [docs/AGENTS.md](C:\Users\Angel J Ragel\Desktop\MiKiwi\docs\AGENTS.md)
- [docs/PROJECT_STRUCTURE.md](C:\Users\Angel J Ragel\Desktop\MiKiwi\docs\PROJECT_STRUCTURE.md)
- [docs/refactor/COMMIT_PLAN.md](C:\Users\Angel J Ragel\Desktop\MiKiwi\docs\refactor\COMMIT_PLAN.md)

## Estado final resumido

El refactor estructural quedó cerrado con esta base:

- `resources/js/Pages/<Area>/<PageName>/<PageName>.jsx`
- `resources/js/Components/<ComponentName>/<ComponentName>.jsx`
- `resources/js/Hooks`
- `resources/js/Utils`
- `resources/js/Layouts`
- `app/Domain/<Modulo>/...`

Además:

- `resources/js/Features` fue eliminado;
- `resources/js/Components/Common` fue eliminado;
- las páginas y componentes migrados usan `*.module.css`;
- `routes/web.php` quedó delegando en controladores;
- la lógica pesada pasó a `app/Domain`.

Si necesitas revisar la foto final del proyecto, no continúes leyendo recaps antiguos: usa `PROJECT_STRUCTURE.md`.
