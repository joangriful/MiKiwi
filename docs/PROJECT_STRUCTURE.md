# Arquitectura y Estructura del Proyecto (MiKiwi)

Este documento describe la **estructura vigente** del proyecto tras el cierre del refactor estructural de frontend y la extracción de dominio en backend.

Si hay conflicto con documentación antigua de refactor, prevalecen:

- `docs/AGENTS.md`
- este documento

---

## 1. Resumen ejecutivo

El proyecto sigue una arquitectura con dos reglas principales:

- **Frontend**: Inertia + React organizado por `Pages`, `Components`, `Hooks`, `Utils` y `Layouts`.
- **Backend**: Laravel con controladores finos y lógica de negocio delegada en `app/Domain`.

El flujo normal es:

```text
Ruta HTTP -> Controller -> Domain Service/Action -> Repository -> Model -> Inertia Page
```

La intención es mantener:

- responsabilidades claras;
- bajo acoplamiento;
- estructura predecible;
- facilidad de refactor y testing.

---

## 2. Estructura frontend actual

El frontend vive en `resources/js/`.

### Directorios principales

- `resources/js/Pages`
  Páginas Inertia.
- `resources/js/Components`
  Componentes reutilizables globales o de área.
- `resources/js/Hooks`
  Hooks globales.
- `resources/js/Utils`
  Utilidades globales.
- `resources/js/Layouts`
  Layouts de composición.
- `resources/js/Shared`
  Residuo transitorio mínimo; no es destino para código nuevo.

### Regla de páginas

Toda página Inertia debe vivir en:

```text
resources/js/Pages/<Area>/<PageName>/
├── <PageName>.jsx
└── <PageName>.module.css
```

Ejemplos reales:

- `resources/js/Pages/Home/Home/Home.jsx`
- `resources/js/Pages/Auth/Auth/Auth.jsx`
- `resources/js/Pages/Catalog/Products/Products.jsx`
- `resources/js/Pages/Checkout/Create/Create.jsx`

Áreas activas actuales en `Pages`:

- `Admin`
- `Auth`
- `Catalog`
- `Checkout`
- `Claims`
- `Configurator`
- `Home`
- `Marketing`
- `Profile`

### Regla de componentes

Los componentes viven en:

```text
resources/js/Components/<ComponentName>/
├── <ComponentName>.jsx
└── <ComponentName>.module.css
```

Para componentes de área se usa la misma idea bajo un namespace de área:

```text
resources/js/Components/<Area>/<ComponentName>/
```

Se permiten carpetas `hooks` y `utils` dentro de `Components` cuando representan dependencias de área.

No se permiten carpetas semánticas intermedias tipo:

- `sections`
- `partials`
- `common`

### Regla de estilos

- Todo estilo local nuevo o migrado debe ir a `*.module.css`.
- `resources/css/global.css` queda reservado para estilos globales reales.
- `resources/css/app.css` debe mantenerse como entrada global mínima.
- CSS de librerías externas puede seguir siendo no-module cuando la librería lo requiera.

### Resolver de Inertia

El resolver de páginas ya **no** busca en `resources/js/Features`.

La resolución vigente se hace solo contra `resources/js/Pages` y soporta:

- `Pages/<Area>/<PageName>/<PageName>.jsx`
- fallback puntual a `Pages/<Area>/<PageName>.jsx` si existiera algún caso especial

### Imports

Usar siempre el alias `@/` apuntando a `resources/js`.

- Mal: `../../../Components/Header/Header`
- Bien: `@/Components/Header/Header`

No usar imports hacia:

- `@/Features/...`
- `@/Components/Common/...`

porque esas estructuras ya no forman parte de la arquitectura viva.

---

## 3. Estructura backend actual

El backend mantiene Laravel estándar en entrada HTTP, pero la lógica de negocio se mueve a `app/Domain`.

### Capas

- `app/Http/Controllers`
  Controladores finos. Validan, coordinan y devuelven respuesta.
- `app/Domain/<Modulo>/Services`
  Casos de uso, orquestación y lógica de negocio.
- `app/Domain/<Modulo>/Actions`
  Operaciones atómicas o procesos concretos.
- `app/Domain/<Modulo>/Repositories`
  Acceso a datos a través de abstracciones.
- `app/Models`
  Modelos Eloquent, relaciones y configuración del esquema.

### Dominios activos actuales

- `Addresses`
- `Admin`
- `Carts`
- `Categories`
- `Coupons`
- `Dolls`
- `HeroImages`
- `Home`
- `Media`
- `Newsletters`
- `Orders`
- `Payments`
- `Products`
- `Profile`
- `Shipping`

### Regla backend

Si una regla de negocio empieza a crecer, no debe quedarse en:

- una route closure;
- un controller;
- un model “fat”.

Debe vivir en `app/Domain`.

---

## 4. Qué se considera legacy hoy

### Legacy eliminado

Estas estructuras ya no existen como arquitectura viva:

- `resources/js/Features`
- `resources/js/Components/Common`

### Legacy residual tolerado

- `resources/js/Shared`
  Hoy queda como residuo transitorio mínimo y no debe recibir código nuevo salvo decisión explícita de limpieza o reutilización futura.

Documentación que hable de `Features`, `Shared` como destino principal, o `Component.css` plano debe considerarse **histórica** salvo que se haya actualizado expresamente.

---

## 5. Guía práctica para código nuevo

### Si añades una página Inertia

1. Crea la carpeta en `resources/js/Pages/<Area>/<PageName>/`
2. Añade:
   - `<PageName>.jsx`
   - `<PageName>.module.css`
3. Haz que Laravel renderice esa ruta con `Inertia::render('<Area>/<PageName>')`

### Si añades un componente reutilizable

1. Crea carpeta en `resources/js/Components/<ComponentName>/`
2. Añade:
   - `<ComponentName>.jsx`
   - `<ComponentName>.module.css`

Si es específico de un área:

```text
resources/js/Components/<Area>/<ComponentName>/
```

### Si añades lógica frontend reutilizable

- Hook global -> `resources/js/Hooks`
- Utilidad global -> `resources/js/Utils`
- Hook/utilidad de área -> `resources/js/Components/<Area>/hooks|utils`

### Si añades lógica de negocio backend

- Operación simple y concreta -> `Action`
- Orquestación o proceso de negocio -> `Service`
- Acceso a datos -> `Repository`

El controller solo coordina.

---

## 6. Validación mínima esperada tras cambios estructurales

Antes de cerrar un cambio relevante, como mínimo:

1. `npm run build`
2. `php artisan route:list`
3. smoke test de la ruta o pantalla tocada
4. tests representativos si el cambio toca backend o dominio

---

## 7. Deuda fuera de alcance del refactor cerrado

El refactor estructural se considera cerrado, pero quedan deudas que no bloquean la arquitectura nueva:

- ampliar cobertura de tests sobre servicios/controladores extraídos;
- limpiar o reutilizar definitivamente `resources/js/Shared`;
- revisar documentación histórica secundaria que se conserva como contexto;
- seguir adelgazando controladores o servicios si aparecen nuevas reglas complejas.

Estas deudas no invalidan la estructura actual; solo marcan trabajo futuro posible.

---

## 8. Regla final

Si una decisión nueva contradice esta estructura, la carga de la prueba está en justificar por qué romper la convención aporta una mejora real.

La convención por defecto del proyecto es:

- `Pages`
- `Components`
- `Hooks`
- `Utils`
- `Layouts`
- `Domain`

sin volver a `Features`, sin `Common`, y sin CSS local plano para páginas o componentes nuevos.
