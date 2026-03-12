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
1) Editar `vite.config.js`
   - Importar `path` de Node.
   - Agregar `resolve.alias` con `@` apuntando a `resources/js`.
2) Editar `jsconfig.json`
   - Definir `baseUrl` y `paths` para que el IDE reconozca `@/`.
3) Cambiar imports movidos
   - Regla: TODO import del proyecto debe usar `@/`.
   - Ejemplo: `import Foo from '@/Features/Marketing/Pages/about-us.jsx'`.
4) Validar
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

## 5) Fase 1 - Preparacion (1 sesion)

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

## 6) Fase 2 - Shared (segura y rapida)

### 6.1 translations
- [x] Mover `resources/js/translations/` a `resources/js/Shared/I18n/`
- [x] Actualizar imports en el `LanguageProvider` y donde se usen JSON.
- [ ] Verificar que el selector de idioma sigue funcionando.

### 6.2 Utils
- [x] Mover `resources/js/Utils/` a `resources/js/Shared/Utils/`
- [x] Ejemplo: `cloudinary.js`, `managerUtils.js`
- [ ] Verificar si algun util es solo de un feature y moverlo alli.
- [x] Actualizar imports con `@/Shared/Utils/...`.

### 6.3 Hooks
- [x] Mover `resources/js/Hooks/` a `resources/js/Shared/Hooks/`
- [ ] Si algun hook es especifico (ej. configurador), moverlo al feature correcto.
- [x] Actualizar imports con `@/Shared/Hooks/...`.

## 6.5) i18n Global (Opcion B) - Plan de implementacion
> Estado actual: i18n eliminado por decision del equipo. Se mantiene estructura `Shared/I18n/` para futura implementacion.

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

## 7) Fase 3 - Features pequenas (Marketing)

### 7.1 Crear feature Marketing
- `resources/js/Features/Marketing/Pages/`
- `resources/js/Features/Marketing/Components/` (si hace falta)

### 7.2 Mover paginas estaticas
- AboutUs -> `Features/Marketing/Pages/about-us.jsx`
- FAQ -> `Features/Marketing/Pages/faq.jsx`
- LegalNotice -> `Features/Marketing/Pages/legal-notice.jsx`
- PrivacyPolicy -> `Features/Marketing/Pages/privacy-policy.jsx`
- TermsOfUse -> `Features/Marketing/Pages/terms-of-use.jsx`
- TermsOfContract -> `Features/Marketing/Pages/terms-of-contract.jsx`
- CookiePolicy -> `Features/Marketing/Pages/cookie-policy.jsx`
- Sitemap -> `Features/Marketing/Pages/sitemap.jsx`
- Sustainability -> `Features/Marketing/Pages/sustainability.jsx`
- Contact -> `Features/Marketing/Pages/contact.jsx`
- Company -> `Features/Marketing/Pages/company.jsx`
- Offers -> `Features/Marketing/Pages/offers.jsx`
- Subscriptions -> `Features/Marketing/Pages/subscriptions.jsx`
- GiftPacks -> `Features/Marketing/Pages/gift-packs.jsx`
- NuestrosKiwis -> `Features/Marketing/Pages/nuestros-kiwis.jsx`
- colecciones -> `Features/Marketing/Pages/colecciones.jsx`

#### Pasos exactos para mover cada pagina estatica
1) Crear archivo destino con nombre en `kebab-case`.
2) Mover el contenido del archivo original.
3) Actualizar imports internos a `@/Shared/...` o `@/Features/...`.
4) Eliminar el archivo original (solo si ya no se usa).
5) Validar la ruta en el navegador.

### 7.3 Ajustar resolve de Inertia
- Usar la opcion mas sencilla: doble glob temporal para `Pages/` y `Features/`.
- Evitar nombres duplicados de paginas durante la transicion.
  - Nota: se permiten renombres de paginas caso por caso si hay colisiones.

#### Ejemplo de estrategia (conceptual)
- `Pages/**/*.jsx` y `Features/**/Pages/**/*.jsx`
- Si existe una pagina duplicada con el mismo nombre, solo debe existir en un lugar.

## 8) Fase 4 - Auth y Profile

### 8.1 Feature Auth
- `Features/Auth/Pages/`
- `Features/Auth/Components/`
- Mover `Pages/Auth` y `Components/Auth`

#### Pasos exactos Auth
1) Mover componentes de `Components/Auth` a `Features/Auth/Components`.
2) Mover paginas de `Pages/Auth` a `Features/Auth/Pages`.
3) Actualizar imports de paginas a componentes.
4) Validar login, registro, reset.

### 8.2 Feature Profile
- `Features/Profile/Pages/`
- `Features/Profile/Components/`
- Mover `Pages/Profile` y `Components/Profile`

#### Pasos exactos Profile
1) Mover componentes a `Features/Profile/Components`.
2) Mover paginas a `Features/Profile/Pages`.
3) Actualizar imports.
4) Validar editar perfil y cambios basicos.

## 9) Fase 5 - Catalogo / Productos

### 9.1 Feature Catalog
- `Features/Catalog/Pages/`
- `Features/Catalog/Components/`
- Mover `ProductPage` y `Products` relacionados

#### Pasos exactos Catalog
1) Identificar componentes de producto en `Components/ProductPage`.
2) Moverlos a `Features/Catalog/Components`.
3) Mover paginas `ProductPage.jsx` y `Products.jsx` a `Features/Catalog/Pages`.
4) Actualizar imports.
5) Validar listados y detalle de producto.

### 9.2 Revisar imagenes y carousels
- Verificar import paths a assets y css

## 10) Fase 6 - Checkout

### 10.1 Feature Checkout
- `Features/Checkout/Pages/`
- `Features/Checkout/Components/`
- Mover `Pages/Checkout` y `Components/Checkout`

#### Pasos exactos Checkout
1) Mover pasos de checkout a `Features/Checkout/Components`.
2) Mover pagina principal a `Features/Checkout/Pages`.
3) Actualizar imports.
4) Validar flujo de carrito -> envio -> pago.

### 10.2 Revisar integraciones de Stripe
- Mantener integraciones en el feature mientras no se refactorice backend

## 11) Fase 7 - Configurador 3D

### 11.1 Feature Configurator
- `Features/Configurator/Pages/`
- `Features/Configurator/Components/`
- Mover `Pages/Configurador` y `Components/Configurador` + `DollConfigurator`

#### Pasos exactos Configurator
1) Mover `Components/Configurador` y `Components/DollConfigurator` a `Features/Configurator/Components`.
2) Mover `Pages/Configurador` a `Features/Configurator/Pages`.
3) Actualizar imports.
4) Validar escena 3D y configuracion de piezas.

### 11.2 Validar dependencias 3D
- Verificar imports de `three`, `fiber`, `drei`

## 12) Fase 8 - Admin / Manager

### 12.1 Feature Admin
- `Features/Admin/Pages/`
- `Features/Admin/Components/`
- Mover `Components/ComponentsManager` y `Pages/ComponentsManager`

#### Pasos exactos Admin
1) Mover `Components/ComponentsManager` a `Features/Admin/Components`.
2) Mover `Pages/ComponentsManager` a `Features/Admin/Pages`.
3) Actualizar imports.
4) Validar pantallas de admin.

## 13) CSS y Tailwind (paralelo por fases)

### 13.1 Reducir CSS global
- Mantener `global.css` solo con variables (colores, tipografia, tokens)
- Estilos especificos pasan a Tailwind en componentes o paginas
  - TODO: unificar `colores.css` y `typography.css` dentro de `global.css` cuando toque.

#### Regla CSS
- Si un estilo es reutilizable, convertir a clase Tailwind o `@apply` en un solo lugar.
- Si es especifico de una pagina, mantenerlo local en el feature.

### 13.2 Donde usar CSS local
- Solo cuando Tailwind sea insuficiente o muy verboso
- `Component.module.css` o `feature.css` importado localmente

## 14) app.jsx minimo (rendimiento)
- Solo `createInertiaApp`, providers indispensables y CSS critico
- Mover `ToastContainer` y extras a Layouts o Pages

### Paso a paso para minimizar `app.jsx`
1) Identificar imports no criticos (toasts, animaciones, etc.).
2) Moverlos al layout que realmente los usa.
3) Dejar solo providers esenciales (ej. LanguageProvider).
4) Verificar que no hay cambio visible.

## 15) Backend DDD-light (cuando el frontend este estable)

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
1) Listar modulos reales (Auth, Profile, Catalog, Checkout, Configurator, Admin).
2) Marcar dependencias de cada uno.
3) Empezar por el que tenga menos dependencias.
4) Si hay empate, elegir el mas pequeno.

#### Tabla de dependencias reales (segun imports actuales)
| Modulo | Depende de | Notas (segun imports) |
|---|---|---|
| Shared (UI/Utils/Hooks) | - | Base comun. |
| Layouts | Shared | `AuthenticatedLayout`, `ConfiguradorLayout`, `GuestLayout`. |
| Marketing (paginas estaticas) | Shared | Todas importan `Header` y `Footer`. |
| Home | Shared, Catalog | Home usa `Components/Home/*` y `ProductCarousel` de `ProductPage`. |
| Auth | Shared | Forms usan `InputError`, `TextInput`, etc. |
| Account/Profile | Auth, Shared, Layouts | `Dashboard`, `Profile/Edit` usan `AuthenticatedLayout`. |
| Catalog | Shared | `Products` y `ProductPage` usan `Header/Footer`. |
| Checkout | Shared, Catalog?, Auth? | `Cart` usa pasos + `Header/Footer`. |
| Claims | Shared | `ClaimsForm` usa `ClaimsFormComponent` + `Header/Footer`. |
| Configurator | Shared, Layouts | Paginas usan `ConfiguradorLayout` + componentes 3D. |
| DollManager | Configurator | Componentes dependen de `DollConfigurator`. |
| Admin (ComponentsManager) | Shared, DollManager, Pages/Components glob | `useComponentsManager` hace glob de `Components` y `Pages`. |

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

## 16) Tests y CI

### 16.1 Tests antes y despues
- Tests unitarios basicos para casos de uso
- Tests de integracion para rutas criticas

### 16.2 TODO: GitHub Actions
- Pipeline con:
  - `composer install`
  - `npm ci`
  - `npm run build`
  - `php artisan test`
- Configurar base de datos de tests en CI.

#### CI con DB de tests (pasos)
1) Crear DB de tests en el workflow (SQLite o MySQL).
2) Definir `.env.testing` o variables en el workflow.
3) Ejecutar migraciones antes de tests.
4) Correr `php artisan test`.

## 17) Criterios de finalizacion
- Todas las paginas resuelven desde `Features/`
- No hay imports desde `Pages/` o `Components/` antiguos
- `app.jsx` minimo y sin dependencias pesadas
- Backend con estructura DDD-light iniciada al menos en 1 modulo
 - Done por feature:
   - paginas migradas
   - rutas validadas
   - tests OK
   - sin codigo legacy

## 18) Riesgos y mitigaciones
- Imports rotos: mover poco a poco y validar
- CSS perdido: validar cada pagina migrada
- Conflictos de equipo: asignar features por persona
