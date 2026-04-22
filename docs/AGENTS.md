# AGENTS.md - Guía Operativa para IAs en MiKiwi

Este archivo es la fuente principal para cualquier IA o agente que programe en este repositorio. Si otro documento, resumen o instrucción antigua contradice este archivo, prevalece este archivo.

## Propósito

MiKiwi es una aplicación Laravel + React + Inertia para e-commerce con productos personalizables y configurador visual/3D. El objetivo técnico es mantener una base de código escalable, clara, testeable y alineada con SOLID.

La IA debe actuar como apoyo técnico senior y tutor: resolver la tarea, explicar decisiones relevantes, señalar riesgos y mantener la arquitectura del proyecto.

## Reglas De Prioridad

1. Seguir este archivo antes que cualquier documentación antigua.
2. Si una regla histórica habla de `resources/js/Features`, `resources/js/Components/Common`, CSS plano local o MySQL/Railway como setup principal, tratarla como obsoleta salvo que el usuario pida revisar historia.
3. Mantener compatibilidad con el código real del repo. Antes de refactorizar, leer los archivos afectados.
4. No revertir cambios ajenos. Si el árbol está sucio, trabajar con los cambios existentes.
5. No introducir soluciones rápidas que aumenten deuda estructural cuando existe una convención clara.

## Stack Vigente

- Backend: Laravel 12, PHP 8.2+, Inertia Laravel, Sanctum, Stripe PHP, Cloudinary PHP.
- Frontend: React 18, Inertia React, Vite, Ziggy, CSS Modules.
- 3D: Three.js, React Three Fiber, Drei.
- Estilos: CSS Modules como convención principal; Tailwind solo como apoyo puntual o legacy.
- Tests: PHPUnit/Laravel test runner.
- Base de datos: PostgreSQL. `.env` apunta a Supabase remoto; `.env.testing` debe apuntar a PostgreSQL local de testing.

## Estructura Del Proyecto

```text
app/
├── Domain/                 # Servicios, acciones y repositorios por módulo
├── Http/
│   ├── Controllers/        # Controladores finos
│   ├── Requests/           # Validación HTTP
│   ├── Resources/          # Transformación de respuestas
│   └── Middleware/
├── Models/                 # Modelos Eloquent
└── Providers/

resources/js/
├── Pages/                  # Páginas Inertia
├── Components/             # Componentes reutilizables globales o de área
├── Hooks/                  # Hooks globales
├── Utils/                  # Utilidades globales
├── Layouts/                # Layouts de composición
├── Shared/                 # Residuo transitorio; no usar como destino nuevo
└── app.jsx

resources/css/
├── app.css                 # Entrada global mínima
└── global.css              # Variables, reset/base y utilidades globales justificadas

database/
├── factories/
├── migrations/
└── seeders/

tests/
├── Feature/
└── Unit/
```

## Frontend

### Páginas Inertia

Todas las páginas Inertia nuevas o migradas deben vivir en:

```text
resources/js/Pages/<Area>/<PageName>/
├── <PageName>.jsx
└── <PageName>.module.css
```

Ejemplos de áreas válidas:

- `Admin`
- `Auth`
- `Catalog`
- `Checkout`
- `Claims`
- `Configurator`
- `Home`
- `Marketing`
- `Profile`

Laravel debe renderizar páginas con la ruta lógica:

```php
return Inertia::render('<Area>/<PageName>', $props);
```

No crear páginas nuevas en `resources/js/Features`.

### Componentes

Los componentes reutilizables deben vivir en:

```text
resources/js/Components/<ComponentName>/
├── <ComponentName>.jsx
└── <ComponentName>.module.css
```

Para componentes específicos de un área:

```text
resources/js/Components/<Area>/<ComponentName>/
├── <ComponentName>.jsx
└── <ComponentName>.module.css
```

No usar:

- `resources/js/Components/Common`
- carpetas genéricas tipo `common`, `partials`, `sections` como destino estructural
- barrels que reexporten componentes internos de áreas como si fueran globales

Se permiten `hooks` y `utils` dentro de un área solo si son dependencias internas de esa área.

### Hooks y Utils

- Hook global: `resources/js/Hooks`.
- Utilidad global: `resources/js/Utils`.
- Hook o utilidad específica de área: dentro del área correspondiente en `Components/<Area>/hooks` o `Components/<Area>/utils`.

Antes de mover algo a global, verificar que lo usan varias áreas reales.

### Imports

Usar el alias `@/` para imports internos de `resources/js`.

Correcto:

```js
import Header from '@/Components/Header/Header';
```

Incorrecto:

```js
import Header from '../../../Components/Header/Header';
import Header from '@/Components/Common/Header/Header';
import ProductCard from '@/Features/Catalog/Components/ProductCard';
```

### Estilos

1. Si se toca cualquier CSS, revisar primero `resources/css/global.css`.
2. Reutilizar variables/tokens globales existentes antes de crear nuevos valores.
3. Todo estilo local nuevo debe ir en `*.module.css`.
4. `resources/css/global.css` queda reservado para:
   - variables CSS;
   - reset/base;
   - tipografía global;
   - utilidades globales muy justificadas.
5. `resources/css/app.css` debe mantenerse como entrada global mínima.
6. Tailwind puede usarse como apoyo puntual, pero no sustituye la convención de CSS Modules.
7. CSS de librerías externas puede seguir siendo no-module cuando la librería lo requiera.

## Backend

### Flujo General

```text
Route -> Controller -> Domain Service/Action -> Repository -> Model -> Response/Inertia Page
```

### Controladores

Los controladores deben ser finos:

- reciben la request;
- delegan validación en Form Requests cuando aplique;
- delegan negocio en `app/Domain`;
- devuelven Inertia, JSON o redirects;
- no contienen queries complejas ni reglas de negocio.

No dejar lógica pesada en:

- `routes/web.php`;
- `routes/api.php`;
- controllers;
- modelos Eloquent.

### Domain

La lógica de negocio vive en:

```text
app/Domain/<Module>/
├── Actions/
├── Services/
├── Repositories/
└── Interfaces/
```

Usar:

- `Service` para orquestación de casos de uso.
- `Action` para operaciones concretas y atómicas.
- `Repository` para acceso a datos y consultas.
- `Interface` cuando la abstracción reduzca acoplamiento real.

No crear abstracciones por costumbre si no reducen complejidad o acoplamiento.

### Modelos

Los modelos Eloquent deben centrarse en:

- relaciones;
- casts;
- scopes pequeños y reutilizables;
- configuración del esquema;
- factories.

Evitar modelos con reglas de negocio extensas.

### Requests, Policies y Resources

Usar:

- Form Requests para validación y autorización de entrada.
- Policies para autorización por recurso.
- API Resources para transformar respuestas API.

No exponer modelos crudos con datos sensibles.

## SOLID En Este Proyecto

Aplicar SOLID de forma práctica:

- Single Responsibility: cada clase/componente tiene un motivo principal de cambio.
- Open/Closed: extender con estrategias, services o actions antes de modificar bloques frágiles.
- Liskov Substitution: las implementaciones de interfaces deben respetar el contrato.
- Interface Segregation: interfaces pequeñas y específicas.
- Dependency Inversion: controllers/services dependen de abstracciones cuando exista un beneficio real.

Señales de incumplimiento:

- controller con lógica de negocio;
- componente React con fetching, reglas, layout y estilos mezclados sin separación;
- método largo que valida, consulta, transforma y persiste a la vez;
- imports cruzados entre áreas sin necesidad;
- utilidades globales creadas para un único uso local.

## Clean Code

- Nombres claros y en inglés para estructura, clases, componentes, hooks y utilidades.
- Funciones pequeñas y enfocadas; dividir si mezclan responsabilidades.
- Evitar números mágicos; usar constantes o configuración.
- DRY con criterio: no abstraer duplicación accidental.
- KISS: preferir la solución simple que encaja con la arquitectura.
- YAGNI: no crear capas futuras si no hay necesidad actual.
- Comentarios solo cuando expliquen una decisión no obvia.

## Diseño Frontend

- Respetar la UI existente.
- Usar componentes con responsabilidades claras.
- Los controles deben tener estados `hover`, `focus`, `active`, `disabled` y `loading` cuando aplique.
- Mantener accesibilidad: etiquetas, `aria-*` cuando sea necesario, navegación por teclado y contraste suficiente.
- No introducir paletas o estilos que rompan el sistema visual existente.
- Antes de crear tokens nuevos, revisar `global.css`.

## Configurador y 3D

- No cargar Three.js o modelos 3D en rutas que no lo necesitan.
- Mantener lazy loading/pre-warming para piezas 3D.
- El flujo 2D no debe bloquearse por la descarga de recursos 3D.
- Cloudinary debe leerse desde caché cuando exista; evitar llamadas síncronas a Cloudinary en runtime de usuario.
- Si se toca el configurador, validar:
  - vista 2D;
  - transición a 3D;
  - assets de Cloudinary;
  - consola sin errores relevantes;
  - build.

## Base De Datos y Entornos

Separación obligatoria:

- `.env`: entorno normal, base remota Supabase.
- `.env.testing`: entorno local de testing, PostgreSQL local.

Reglas:

- `php artisan test` nunca debe tocar la base remota.
- `php artisan migrate:fresh` solo es aceptable sobre entorno local/controlado o con intención explícita.
- Si se añaden variables de entorno, actualizar `.env.example`.
- No commitear secretos.

### Compatibilidad PostgreSQL y MySQL (GitHub Actions)

PostgreSQL (Supabase) es la base vigente del proyecto en producción, y PostgreSQL local es el entorno de testing preferido (`.env.testing`).
**🚨 AVISO CRÍTICO: GitHub Actions (CI) utiliza MySQL.**
Cualquier cambio en migraciones, seeders, queries o tests DEBE funcionar en ambos motores para no romper el pipeline.

Reglas obligatorias para la doble compatibilidad:

- No usar `after()` en migraciones nuevas. Es una conveniencia de MySQL y no debe condicionar el esquema.
- No introducir SQL específico de MySQL ni de PostgreSQL. Si una operación requiere SQL específico del motor, debe aislarse, justificarse y protegerse por driver (ej: `Schema::getConnection()->getDriverName() === 'pgsql'`).
- No asumir que `LIKE` es case-insensitive en todas partes, ni usar `ILIKE` crudo (romperá en MySQL). Para búsquedas sin distinguir mayúsculas/minúsculas usar un helper/scope común que detecte el driver y use `LIKE` (MySQL) o `ILIKE` (PostgreSQL).
- Tratar JSON como zona sensible: preferir casts Eloquent a `array` y helpers de Laravel como `whereJsonContains`. **Ojo en los tests:** MySQL no garantiza el orden de las claves JSON. Usa `assertEquals` en vez de `assertSame` al comparar arrays que vienen de columnas JSON.
- Tratar enums SQL como zona sensible: la dirección técnica es migrar progresivamente a columnas `string` con validación en Requests/services y constantes/enums PHP.
- Tratar UUID como zona sensible: validar como `uuid`, no asumir IDs enteros y revisar factories, seeders, relaciones y route model binding.
- Los seeders deben ser idempotentes: usar `firstOrCreate`, `updateOrCreate` o `upsert` con claves únicas claras (`slug`, `sku`, `code`, `email`).

Checklist para cualquier PR que toque base de datos:

- ¿Introduce SQL específico de MySQL o una dependencia de orden de columnas tipo `after()`?
- ¿Usa búsquedas de texto con `LIKE` donde debería ir el helper/scope de `ILIKE`?
- ¿Toca JSON, enum SQL o UUID?
- ¿Mantiene seeders y factories compatibles con PostgreSQL?
- ¿Funciona con datos ya existentes en Supabase?
- ¿Incluye o actualiza tests sobre PostgreSQL local cuando afecta a datos críticos?

## Comandos Útiles

```bash
composer install
npm install
composer dev
npm start
php artisan serve
npm run dev
npm run build
composer test
php artisan test
./vendor/bin/pint
php artisan route:list
php artisan config:clear
php artisan cache:clear
```

## Validación Antes De Cerrar Cambios

Según el alcance, ejecutar:

- frontend: `npm run build`;
- backend: `php artisan test` o tests concretos;
- PHP style: `./vendor/bin/pint` si se modificó PHP;
- rutas: `php artisan route:list` si se tocaron routes/controllers;
- smoke test manual de la pantalla o flujo tocado.

Si no se puede ejecutar algo, indicarlo claramente al usuario.

## Seguridad

- No exponer secretos, tokens, contraseñas ni credenciales reales en documentación o código.
- No confiar solo en validación frontend.
- Validar y autorizar en backend.
- Usar Policies para acciones sensibles.
- Usar rate limiting en endpoints sensibles.
- No filtrar mensajes internos de excepciones al usuario final.
- Revisar mass assignment (`$fillable`, `$guarded`) en modelos tocados.

## Documentación

La documentación de proyecto debe vivir en `docs/DOCUMENTACION_PROYECTO.md`.

Este archivo (`docs/AGENTS.md`) debe contener solo instrucciones para programar:

- arquitectura;
- estructura;
- convenciones;
- SOLID;
- flujo de trabajo;
- validación;
- seguridad.

Si se actualiza arquitectura o flujo de desarrollo, actualizar este archivo. Si se actualiza información de producto, negocio, funcionalidades o setup de proyecto, actualizar `docs/DOCUMENTACION_PROYECTO.md`.

## Criterio Final

Toda solución nueva debe poder justificarse con estas preguntas:

1. ¿Respeta `Pages`, `Components`, `Hooks`, `Utils`, `Layouts` y `Domain`?
2. ¿Mantiene responsabilidades claras?
3. ¿Reduce o mantiene el acoplamiento?
4. ¿Es testeable o verificable?
5. ¿No contradice SOLID ni las convenciones vigentes?

Si la respuesta es no, replantear antes de implementar.

Última actualización: Abril 2026.
