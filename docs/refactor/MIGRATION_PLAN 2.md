<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver a la carpeta" /></a>

# Plan Detallado de Migracion (Laravel + Inertia + React + Tailwind)

> Objetivo: refactor gradual sin cambiar la UI, priorizando rendimiento y mantenibilidad.
> Restricciones: JavaScript (no TypeScript), Tailwind puro con minimo CSS, Inertia se mantiene.

## 0) Principios y reglas del refactor (no negociables)

- No cambiar apariencia ni comportamiento visible.
- Cambios pequenos y verificables.
- Cada movimiento debe dejar el proyecto funcionando.
- Los imports se actualizan en el mismo paso del movimiento.
- Evitar mover dos features en el mismo dia si no hay tiempo para validar.
- Estrategia inicial: mover rapido "a lo bruto" y solo si hay caos, pasar a la forma profesional (mapa de dependencias previo).
    - Umbral para cambiar: si mover a mano consume demasiado tiempo (criterio humano del equipo), se pasa al modo profesional.

## 1) Estructura objetivo (solo carpetas)

### Frontend (resources/js)

- `resources/js/app.jsx` (bootstrap minimo)
- `resources/js/Features/`
- `resources/js/Shared/`
- `resources/js/Layouts/`
- `resources/js/translations/` (o `Shared/I18n/`)

### Aliases (import)

- Usar alias `@/` para `resources/js/` desde el inicio de la migracion.
    - Decision: cambiar TODO el ecosistema de imports a `@/` (no solo nuevos/movidos).

#### Como activar el alias `@/` (Vite + jsconfig)

1. Editar `vite.config.js`
    - Importar `path` de Node.
    - Agregar `resolve.alias` con `@` apuntando a `resources/js`.
2. Editar `jsconfig.json`
    - Definir `baseUrl` y `paths` para que el IDE reconozca `@/`.
3. Cambiar imports movidos
    - Regla: TODO import del proyecto debe usar `@/`.
    - Ejemplo: `import Foo from '@/Features/Marketing/Pages/about-us.jsx'`.
4. Validar
    - Ejecutar build local y abrir una pagina para confirmar.

### Dentro de cada feature

- `Features/<Feature>/Pages/`
- `Features/<Feature>/Components/`
- `Features/<Feature>/Hooks/`
- `Features/<Feature>/Api/`
- `Features/<Feature>/State/` (si aplica)
- `Features/<Feature>/Utils/` (si aplica)

### Shared (reutilizable)

- `Shared/Ui/`
- `Shared/Hooks/`
- `Shared/Utils/`
- `Shared/Providers/`
- `Shared/I18n/`

### Backend (app) - estructura deseada

- `app/Models/` (Eloquent se queda aqui)
- `app/Domain/Orders/Services/`
- `app/Domain/Orders/Actions/`
- `app/Domain/Orders/DTOs/`
- `app/Domain/Users/Services/`
- `app/Http/Controllers/` (delgados)
- `app/Http/Requests/` (validacion)

## 2) Convenciones de nombres

- Carpetas: `PascalCase`
- Archivos: `kebab-case`
- Componentes React exportados en `PascalCase`
- Hooks: `use-xxxx.js`

## 3) Orden de migracion (de menor riesgo a mayor)

1. Shared: traducciones, utils, hooks (sin dependencias fuertes)
2. Paginas estaticas (Marketing)
3. Auth / Profile
4. Catalogo / Productos
5. Checkout
6. Configurador 3D
7. Admin / Manager

### Indice de fases (orden oficial para ramas/commits)

1. Fase 1 - Preparacion
2. Fase 2 - Shared
3. Fase 3 - Marketing
4. Fase 4 - Auth y Profile
5. Fase 5 - Catalogo / Productos
6. Fase 6 - Checkout
7. Fase 7 - Configurador 3D
8. Fase 8 - Admin / Manager
9. Fase 9 - CSS y Tailwind (paralelo por fases)
10. Fase 10 - app.jsx minimo (rendimiento)
11. Fase 11 - Backend DDD-light
12. Fase 12 - Tests y CI
13. Fase 13 - Criterios de finalizacion + Riesgos

### Regla de dependencias (orden real)

- Siempre empezar por el modulo con menos dependencias.
- Si un modulo depende de otro, se mueve primero el que es dependencia.
- Si dos modulos son dependencias entre si, escoger el mas pequeno primero.

## 4) Checklist general por cada movimiento

1. Identificar que archivos se moveran.
2. Crear carpeta destino si no existe.
3. Mover archivo(s).
4. Actualizar imports relativos en el mismo paso.
5. Ejecutar build local (si es posible).
6. Probar rutas afectadas manualmente.

### Fase 1 - Preparacion (1 sesion)

### 5.1 Crear estructura destino (sin mover codigo aun)

- [x] Crear `resources/js/Features/`
- [x] Crear `resources/js/Shared/`
- [x] Crear `resources/js/Layouts/` (si no existe)

### 5.2 Reglas de import

- Activar alias `@/` para `resources/js/`.
- Usar `@/` en todos los imports nuevos o movidos.

### 5.4 Checklist de validacion minima por feature

- Navegar a la ruta principal del feature.
- Verificar que no hay errores en consola.
- Probar un flujo critico del feature (ej. login, checkout, etc.).
- Confirmar que no hay CSS roto visible.
- Confirmar que las traducciones siguen funcionando si el feature usa i18n.

### 5.3 Definir ownership

- Asignar features por persona para evitar conflictos.

### Fase 2 - Shared (segura y rapida)

### 6.1 translations

- [x] Mover `resources/js/translations/` a `resources/js/Shared/I18n/`
- [x] Actualizar imports en el `LanguageProvider` y donde se usen JSON.
- [ ] (Pospuesto) Verificar que el selector de idioma sigue funcionando.

### 6.2 Utils

- [x] Mover `resources/js/Utils/` a `resources/js/Shared/Utils/`
- [x] Ejemplo: `cloudinary.js`, `managerUtils.js`
- [x] Verificar si algun util es solo de un feature y moverlo alli.
- [x] Actualizar imports con `@/Shared/Utils/...` o moverlos al feature si son especificos.

### 6.3 Hooks

- [x] Mover `resources/js/Hooks/` a `resources/js/Shared/Hooks/`
- [x] Si algun hook es especifico (ej. configurador), moverlo al feature correcto.
- [x] Actualizar imports con `@/Shared/Hooks/...` o al feature correspondiente.

## 6.5) i18n Global (Opcion B) - Plan de implementacion

> Estado actual: i18n pospuesto por decision del equipo. Se mantiene estructura `Shared/I18n/` vacia para futura implementacion.

### Nota sobre warnings (editor/autoload)

- Los warnings del editor (subrayados rojos) no bloquean ejecucion.
- Warnings de `composer dump-autoload` por clases duplicadas se limpian con `exclude-files-from-classmap`.

### 6.5.1 Estandarizar claves (prevencion de incoherencias)

- Definir convencion de claves: `page.section.item`.
- Usar `es.json` como plantilla base.
- Replicar las mismas claves en `en.json`, `fr.json`, `de.json`.
- Si falta una clave, el sistema debe usar fallback (`key`) para no romper la UI.

### 6.5.2 Crear helper global `t(key, vars?)`

- Archivo: `resources/js/Shared/I18n/index.js`.
- Exportar `translations` por idioma.
- Exportar `t(key, vars)` con:
    - lookup seguro por clave.
    - fallback a la clave si no existe.
    - soporte de placeholders simples `{name}`.

### 6.5.3 Actualizar `LanguageContext`

- Importar `translations` desde `Shared/I18n`.
- Exponer `t(key, vars)` en el contexto.
- Mantener `currentLanguage`, `changeLanguage`, `languages`.

### 6.5.4 Migracion gradual por bloques

- Empezar por `Marketing` (AboutUs, FAQ, Legal, etc.).
- Reemplazar textos hardcodeados por `t('page.section.item')`.
- Eliminar imports directos de JSON en cada pagina.

### 6.5.5 Validacion de claves (ataque a typos)

- Opcion rapida: comparar claves entre idiomas a ojo en cada feature.
- Opcion profesional: script simple que compare claves y avise de faltantes.

### 6.5.6 Rendimiento (bundle)

- Si los JSON crecen mucho, pasar a carga dinamica por idioma.
- Por ahora, cargar todos si el tamaño es pequeno.

### 6.5.7 Textos dinamicos

- Usar placeholders en JSON: `"hello": "Hola, {name}"`.
- `t('hello', { name: 'Ana' })`.

### 6.5.8 Regla de equipo (evitar mezcla)

- Todo texto visible nuevo debe salir de `t()`.
- Checklist por pagina: “no hay textos hardcodeados”.

### Fase 3 - Features pequenas (Marketing)

### 7.1 Crear feature Marketing

- [x] `resources/js/Features/Marketing/Pages/`
- [x] `resources/js/Features/Marketing/Components/` (si hace falta)

### 7.2 Mover paginas estaticas

- [x] AboutUs -> `Features/Marketing/Pages/about-us.jsx`
- [x] FAQ -> `Features/Marketing/Pages/faq.jsx`
- [x] LegalNotice -> `Features/Marketing/Pages/legal-notice.jsx`
- [x] PrivacyPolicy -> `Features/Marketing/Pages/privacy-policy.jsx`
- [x] TermsOfUse -> `Features/Marketing/Pages/terms-of-use.jsx`
- [x] TermsOfContract -> `Features/Marketing/Pages/terms-of-contract.jsx`
- [x] CookiePolicy -> `Features/Marketing/Pages/cookie-policy.jsx`
- [x] Sitemap -> `Features/Marketing/Pages/sitemap.jsx`
- [x] Sustainability -> `Features/Marketing/Pages/sustainability.jsx`
- [x] Contact -> `Features/Marketing/Pages/contact.jsx`
- [x] Company -> `Features/Marketing/Pages/company.jsx`
- [x] Offers -> `Features/Marketing/Pages/offers.jsx`
- [x] Subscriptions -> `Features/Marketing/Pages/subscriptions.jsx`
- [x] GiftPacks -> `Features/Marketing/Pages/gift-packs.jsx`
- [x] NuestrosKiwis -> `Features/Marketing/Pages/nuestros-kiwis.jsx`
- [x] colecciones -> `Features/Marketing/Pages/colecciones.jsx`

#### Pasos exactos para mover cada pagina estatica

1. Crear archivo destino con nombre en `kebab-case`.
2. Mover el contenido del archivo original.
3. Actualizar imports internos a `@/Shared/...` o `@/Features/...`.
4. Eliminar el archivo original (solo si ya no se usa).
5. Validar la ruta en el navegador.

### 7.3 Ajustar resolve de Inertia

- Usar la opcion mas sencilla: doble glob temporal para `Pages/` y `Features/`.
- Evitar nombres duplicados de paginas durante la transicion.
    - Nota: se permiten renombres de paginas caso por caso si hay colisiones.

#### Ejemplo de estrategia (conceptual)

- `Pages/**/*.jsx` y `Features/**/Pages/**/*.jsx`
- Si existe una pagina duplicada con el mismo nombre, solo debe existir en un lugar.

### Validacion minima (Marketing)

- [x] AboutUs
- [x] FAQ
- [x] LegalNotice

### Fase 4 - Auth y Profile

### 8.1 Feature Auth

- `Features/Auth/Pages/`
- `Features/Auth/Components/`
- Mover `Pages/Auth` y `Components/Auth`

#### Pasos exactos Auth

1. Mover componentes de `Components/Auth` a `Features/Auth/Components`.
2. Mover paginas de `Pages/Auth` a `Features/Auth/Pages`.
3. Actualizar imports de paginas a componentes.
4. Validar login, registro, reset.

### 8.2 Feature Profile

- `Features/Profile/Pages/`
- `Features/Profile/Components/`
- Mover `Pages/Profile` y `Components/Profile`

#### Pasos exactos Profile

1. Mover componentes a `Features/Profile/Components`.
2. Mover paginas a `Features/Profile/Pages`.
3. Actualizar imports.
4. Validar editar perfil y cambios basicos.

### Fase 5 - Catalogo / Productos

### 9.1 Feature Catalog

- `Features/Catalog/Pages/`
- `Features/Catalog/Components/`
- Mover `ProductPage` y `Products` relacionados

### 9.2 Feature Home (mismo paso)

- `Features/Home/Pages/`
- `Features/Home/Components/`
- `Features/Home/hooks/`
- `Features/Home/utils/`
- Mover `Home.jsx` y `Home.css` (CSS junto a la pagina)

#### Pasos exactos Catalog

1. Identificar componentes de producto en `Components/ProductPage`.
2. Moverlos a `Features/Catalog/Components`.
3. Mover paginas `ProductPage.jsx` y `Products.jsx` a `Features/Catalog/Pages`.
4. Actualizar imports.
5. Validar listados y detalle de producto.

### 9.3 Revisar imagenes y carousels

- Verificar import paths a assets y css

### Fase 6 - Checkout

### 10.1 Feature Checkout

- `Features/Checkout/Pages/`
- `Features/Checkout/Components/`
- Mover `Pages/Checkout` y `Components/Checkout`
 - Mover `Cart.jsx` a `Features/Checkout/Pages/Cart.jsx`

#### Pasos exactos Checkout

1. Mover pasos de checkout a `Features/Checkout/Components`.
2. Mover pagina principal a `Features/Checkout/Pages`.
3. Actualizar imports.
4. Validar flujo de carrito -> envio -> pago.

### 10.2 Revisar integraciones de Stripe

- Mantener integraciones en el feature mientras no se refactorice backend

### Fase 7 - Configurador 3D

### 11.1 Feature Configurator

- `Features/Configurator/Pages/`
- `Features/Configurator/Components/`
- Mover `Pages/Configurador` y `Components/Configurador` + `DollConfigurator`
 - Mover `DollConfigTest.jsx` y `DollConfigurator.jsx`
 - Mover `Quiz.css` junto a `Quiz.jsx`

#### Pasos exactos Configurator

1. Mover `Components/Configurador` y `Components/DollConfigurator` a `Features/Configurator/Components`.
2. Mover `Pages/Configurador` a `Features/Configurator/Pages`.
3. Actualizar imports.
4. Validar escena 3D y configuracion de piezas.

### 11.2 Validar dependencias 3D

- Verificar imports de `three`, `fiber`, `drei`

### Fase 8 - Admin / Manager

### 12.1 Feature Admin

- `Features/Admin/Pages/`
- `Features/Admin/Components/`
- Mover `Components/ComponentsManager` y `Pages/ComponentsManager`
- Actualizar `useComponentsManager` a `Features/**`

### Nota de secuencia
- Tras completar Fase 8, siguen en orden: Fase 9, Fase 10, Fase 11, Fase 12, y luego Fase 13.

#### Pasos exactos Admin

1. Mover `Components/ComponentsManager` a `Features/Admin/Components`.
2. Mover `Pages/ComponentsManager` a `Features/Admin/Pages`.
3. Actualizar imports.
4. Validar pantallas de admin.

### Fase 9 - CSS y Tailwind (paralelo por fases)

### 13.1 Objetivo

- Mantener `global.css` solo con variables/tokens globales.
- Mover estilos de pagina/feature a su carpeta correspondiente.
- Usar Tailwind por defecto; CSS solo cuando sea realmente necesario.

### 13.2 Pasos exactos (orden recomendado)

1. **Inventario CSS actual**
    - Listar CSS activos: `app.css`, `colores.css`, `typography.css`, `auth.css`, `Home.css`, `Quiz.css`, etc.
    - Etiquetar cada bloque como **global** (tokens/variables) o **feature**.
2. **Definir `global.css` minimo**
    - Dejar solo variables/tokens y resets globales.
    - TODO: unificar `colores.css` + `typography.css` dentro de `global.css` cuando toque.
3. **Localizar CSS por feature**
    - Asociar cada CSS a su feature y pagina.
    - Moverlo a `Features/<Feature>/Pages/` o `Features/<Feature>/Components/`.
4. **Actualizar imports locales**
    - Importar el CSS desde la pagina/componente que lo necesita.
    - Evitar imports globales para estilos de una sola pagina.
5. **Reducir CSS global**
    - Eliminar del CSS global lo que ya esta importado localmente.
6. **Tailwind primero**
    - Reemplazar estilos simples por clases Tailwind.
    - Usar CSS solo cuando Tailwind sea demasiado verboso o no cubra el caso.
7. **Validacion rapida**
    - Revisar Home, ProductPage, Cart, Profile, Configurador.
    - Verificar que no hay warnings ni cambios visuales.

### 13.3 Reglas CSS (claras y faciles de seguir)

- Si un estilo es reutilizable, convertirlo en Tailwind o `@apply` en un solo lugar.
- Si es especifico de una pagina, mantenerlo local al feature.
- Estructura global recomendada para componentes: carpeta con `Component.jsx` + `Component.css`.
- El CSS local se deja creado aunque este vacio; si no se usa, se puede borrar en el futuro.
- `Component.module.css` o `feature.css` importado localmente (no global).

### 13.4 Puntos flacos y mitigaciones (implementado en el plan)

- **Riesgo:** romper estilos globales al mover CSS.
  - **Mitigacion:** mover 1 archivo por vez y validar la pagina afectada antes de seguir.
- **Riesgo:** perder variables/tokens al limpiar `app.css`.
  - **Mitigacion:** separar primero tokens en `global.css`, luego limpiar lo demas.
- **Riesgo:** CSS sin importar despues de moverlo.
  - **Mitigacion:** actualizar el import en la pagina/componente en el mismo paso.
- **Riesgo:** duplicar estilos entre Tailwind y CSS legacy.
  - **Mitigacion:** eliminar el bloque CSS cuando ya exista en Tailwind.

### Fase 10 - app.jsx minimo (rendimiento)

- Solo `createInertiaApp`, providers indispensables y CSS critico
- Mover `ToastContainer` y extras a Layouts o Pages

### Paso a paso para minimizar `app.jsx`

1. Identificar imports no criticos (toasts, animaciones, etc.).
2. Moverlos al layout que realmente los usa.
3. Dejar solo providers esenciales (ej. LanguageProvider).
4. Verificar que no hay cambio visible.

### Puntos flacos y mitigaciones (implementado en el plan)

- **Riesgo:** quitar providers necesarios para toda la app.
  - **Mitigacion:** identificar providers usados globalmente antes de moverlos.
- **Riesgo:** mover `ToastContainer` y perder notificaciones en algunas vistas.
  - **Mitigacion:** moverlo solo al layout que envuelve todas las rutas que usan toasts (ej. `AuthenticatedLayout`).
- **Riesgo:** CSS global duplicado o eliminado por error.
  - **Mitigacion:** mantener `app.css` como unica entrada global y no tocar imports de pages.
- **Riesgo:** cambios invisibles pero con errores en consola.
  - **Mitigacion:** validar Home, Auth y Profile y revisar consola.

### Fase 11 - Backend DDD-light (cuando el frontend este estable)

### 15.1 Crear carpetas base

- `app/Models/` (Eloquent)
- `app/Domain/`

### 15.2 Migracion por modulos

- Seleccionar el modulo con menos dependencias.
- Mantener modelos Eloquent en `app/Models/`.
- Mover servicios/acciones/DTOs a `app/Domain/<Modulo>/`.
- Reubicar `Repositories` dentro de cada `app/Domain/<Modulo>/`.
- Dejar controllers como orquestadores.

### 15.4 Orden de backend por dependencias (metodo practico)

1. Listar modulos reales (Auth, Profile, Catalog, Checkout, Configurator, Admin).
2. Marcar dependencias de cada uno.
3. Empezar por el que tenga menos dependencias.
4. Si hay empate, elegir el mas pequeno.

#### Tabla de dependencias reales (segun imports actuales)

| Modulo                        | Depende de                                 | Notas (segun imports)                                              |
| ----------------------------- | ------------------------------------------ | ------------------------------------------------------------------ |
| Shared (UI/Utils/Hooks)       | -                                          | Base comun.                                                        |
| Layouts                       | Shared                                     | `AuthenticatedLayout`, `ConfiguradorLayout`, `GuestLayout`.        |
| Marketing (paginas estaticas) | Shared                                     | Todas importan `Header` y `Footer`.                                |
| Home                          | Shared, Catalog                            | Home usa `Components/Home/*` y `ProductCarousel` de `ProductPage`. |
| Auth                          | Shared                                     | Forms usan `InputError`, `TextInput`, etc.                         |
| Account/Profile               | Auth, Shared, Layouts                      | `Dashboard`, `Profile/Edit` usan `AuthenticatedLayout`.            |
| Catalog                       | Shared                                     | `Products` y `ProductPage` usan `Header/Footer`.                   |
| Checkout                      | Shared, Catalog?, Auth?                    | `Cart` usa pasos + `Header/Footer`.                                |
| Claims                        | Shared                                     | `ClaimsForm` usa `ClaimsFormComponent` + `Header/Footer`.          |
| Configurator                  | Shared, Layouts                            | Paginas usan `ConfiguradorLayout` + componentes 3D.                |
| DollManager                   | Configurator                               | Componentes dependen de `DollConfigurator`.                        |
| Admin (ComponentsManager)     | Shared, DollManager, Pages/Components glob | `useComponentsManager` hace glob de `Components` y `Pages`.        |

#### Decisiones de migracion (anotado por el equipo)

- `Home` y `Catalog` se mueven juntos en el mismo paso.
- Extraer `ProductCarousel` a `Shared` para desacoplar `Home` de `Catalog`.
- Al migrar Admin, actualizar los `glob` de `useComponentsManager`.
- Mover `Configurator` antes que `DollManager`. Si estan muy mezclados, migrarlos como un solo feature temporal.
- Mover `Layouts` al principio de la migracion.
- Mover `Checkout` cuando `Auth` y `Catalog` esten estables.

### 15.3 Repetir por dominio

- Catalogo
- Checkout
- Configurador
- Admin

### Puntos flacos y mitigaciones (implementado en el plan)

- **Riesgo:** mover clases y romper namespaces/autoload.
  - **Mitigacion:** mover por modulo, actualizar `namespace` y `use` en el mismo paso.
- **Riesgo:** servicios sin bindings en el contenedor.
  - **Mitigacion:** revisar `AppServiceProvider` y registrar bindings tras mover.
- **Riesgo:** controllers se vuelven acoplados al dominio.
  - **Mitigacion:** mantener controllers delgados y mover la logica a services/actions.
- **Riesgo:** repositorios globales quedan fuera de su modulo.
  - **Mitigacion:** reubicar repositorios dentro de `app/Domain/<Modulo>/Repositories`.
- **Riesgo:** cambios silenciosos sin validar.
  - **Mitigacion:** probar rutas del modulo migrado y revisar logs.

### Fase 12 - Tests y CI

**Estado:** completado

### 16.1 Tests antes y despues

- [x] Tests unitarios basicos para casos de uso
- [x] Tests de integracion para rutas criticas

### 16.2 TODO: GitHub Actions

- [x] Pipeline con:
    - `composer install`
    - `npm ci`
    - `npm run build`
    - `php artisan test`
- [x] Configurar base de datos de tests en CI.

#### CI con DB de tests (pasos)

1. [x] Crear DB de tests en el workflow (SQLite o MySQL).
2. [x] Definir `.env.testing` o variables en el workflow.
3. [x] Ejecutar migraciones antes de tests.
4. [x] Correr `php artisan test`.

### Fase 13 - Criterios de finalizacion

**Estado:** completado

- Todas las paginas resuelven desde `Features/`
- No hay imports desde `Pages/` o `Components/` antiguos
- `app.jsx` minimo y sin dependencias pesadas
- Backend con estructura DDD-light iniciada al menos en 1 modulo
- Done por feature:
    - paginas migradas
    - rutas validadas
    - tests OK
    - sin codigo legacy

#### Plan de cierre (orden recomendado)

1. Cerrar legacy de frontend (`Pages/` y `Components/` antiguos).
2. Verificar rutas y resolver de Inertia (`Features/**/Pages`).
3. Auditar imports antiguos y eliminar residuos.
4. Checklist final por feature (paginas, rutas, tests, sin legacy).

### Fase 13 - Riesgos y mitigaciones

- Imports rotos: mover poco a poco y validar
- CSS perdido: validar cada pagina migrada
- Conflictos de equipo: asignar features por persona

### Puntos flacos y mitigaciones (implementado en el plan)

- **Riesgo:** legacy en `resources/js/Pages` con dependencias ocultas.
  - **Mitigacion:** buscar `Inertia::render` y mover solo lo referenciado.
- **Riesgo:** resolver de Inertia enmascara fallos por fallback.
  - **Mitigacion:** revisar `resolve()` y eliminar fallback temporal al cierre.
- **Riesgo:** imports antiguos siguen vivos.
  - **Mitigacion:** `rg "resources/js/Pages|resources/js/Components"` y corregir.
- **Riesgo:** carpetas vacias confunden al equipo.
  - **Mitigacion:** eliminar carpetas legacy vacias o dejar `.gitkeep` si se usaran.

### Fase 14 - Componentes con carpeta + CSS local (global)

**Objetivo:** unificar estructura de componentes para facilitar refactor y CSS local.

#### 14.1 Convencion global

- Cada componente vive en su propia carpeta.
- Dentro: `Component.jsx` + `Component.css`.
- El CSS local se crea aunque este vacio (se puede borrar si no se usa).

#### 14.2 Fases de migracion (orden recomendado)

1. Shared
2. Marketing
3. Auth
4. Profile
5. Catalog
6. Home
7. Checkout
8. Configurator
9. Admin
10. Layouts

#### 14.3 Pasos exactos por feature

1. Crear carpeta por componente.
2. Mover JSX dentro de la carpeta.
3. Crear `Component.css` local (aunque vacio).
4. Importar el CSS en el componente.
5. Actualizar imports en el resto del feature.
6. Validar la pagina principal del feature.

#### 14.4 Validacion rapida

- Abrir pagina principal del feature.
- Revisar consola por imports rotos.
- Confirmar que no hay cambios visuales.