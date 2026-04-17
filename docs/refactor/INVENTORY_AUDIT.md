# Inventory Audit

## Objetivo

Este documento cierra el `Commit 2` del plan de refactor: dejar un inventario técnico real del estado actual del proyecto antes de seguir moviendo estructura.

No define todavía cambios. Define el punto de partida real para que los siguientes commits no se hagan a ciegas.

## Resumen ejecutivo

- El frontend sigue dominado por `resources/js/Features`.
- Hay `209` archivos dentro de `resources/js/Features`.
- Hay `107` archivos `.css` dentro de `resources/js`.
- Hay `0` archivos `.module.css` dentro de `resources/js`.
- Siguen existiendo componentes globales dentro de `resources/js/Components/Common`.
- `resources/js/Components/index.js` reexporta componentes internos de áreas.
- `routes/web.php` sigue renderizando páginas Inertia con rutas legacy y contiene closures largas.

## Estructura actual del frontend

### Ramas activas

- `resources/js/Components`
- `resources/js/Features`
- `resources/js/Layouts`
- `resources/js/Utils`
- `resources/js/app.jsx`

### Deuda estructural principal

#### 1. `Features` sigue siendo la raíz dominante

Áreas detectadas dentro de `resources/js/Features`:

- `Admin`
- `Auth`
- `Catalog`
- `Checkout`
- `Claims`
- `Configurator`
- `Home`
- `Marketing`
- `Profile`

Esto contradice la estructura objetivo definida en `docs/AGENTS.md`, donde las páginas deben acabar en `resources/js/Pages` y los componentes reutilizables en `resources/js/Components`.

#### 2. No existe todavía la estructura objetivo en uso

No se han detectado páginas bajo una convención final tipo:

```text
resources/js/Pages/<Area>/<PageName>/<PageName>.jsx
resources/js/Pages/<Area>/<PageName>/<PageName>.module.css
```

Tampoco existen todavía `*.module.css` dentro de `resources/js`.

#### 3. `Components/Common` sigue vivo

Se detectan al menos estas piezas globales mal ubicadas:

- `resources/js/Components/Common/Header/Header.jsx`
- `resources/js/Components/Common/Footer/Footer.jsx`
- `resources/js/Components/Common/Toast/Toast.jsx`
- `resources/js/Components/Common/FooterSections/...`

#### 4. Barrel export con acoplamiento incorrecto

`resources/js/Components/index.js` reexporta:

- componentes globales reales;
- y también componentes internos de catálogo ubicados en `resources/js/Features/Catalog/Components/...`.

Eso rompe la frontera entre “global” y “específico de área”.

## Inventario de páginas Inertia activas

Estas son las páginas detectadas por `Inertia::render(...)` en `routes/web.php`:

| Render actual | Ubicación física actual | Observación |
| --- | --- | --- |
| `Home/Home` | `resources/js/Features/Home/Pages/Home.jsx` | Legacy path lógico distinto del físico final deseado |
| `Profile/Dashboard` | `resources/js/Features/Profile/Pages/Dashboard.jsx` | Debe pasar a `Pages/Profile/Dashboard/...` |
| `Profile/perfil` | `resources/js/Features/Profile/Pages/perfil.jsx` | Naming en español y minúsculas |
| `Admin/ComponentsManager` | `resources/js/Features/Admin/Pages/ComponentsManager.jsx` | Página admin principal |
| `Claims/ClaimsForm` | `resources/js/Features/Claims/Pages/ClaimsForm.jsx` | Página aislada |
| `Marketing/PrivacyPolicy` | `resources/js/Features/Marketing/Pages/PrivacyPolicy.jsx` | Marketing estático |
| `Marketing/LegalNotice` | `resources/js/Features/Marketing/Pages/LegalNotice.jsx` | Marketing estático |
| `Marketing/Sitemap` | `resources/js/Features/Marketing/Pages/Sitemap.jsx` | Marketing estático |
| `Marketing/Sustainability` | `resources/js/Features/Marketing/Pages/Sustainability.jsx` | Marketing estático con datos |
| `Marketing/NuestrosKiwis` | `resources/js/Features/Marketing/Pages/NuestrosKiwis.jsx` | Naming no inglés |
| `Marketing/GiftPacks` | `resources/js/Features/Marketing/Pages/GiftPacks.jsx` | Marketing estático |
| `Marketing/Subscriptions` | `resources/js/Features/Marketing/Pages/Subscriptions.jsx` | Marketing estático |
| `Marketing/Offers` | `resources/js/Features/Marketing/Pages/Offers.jsx` | Marketing estático |
| `Marketing/Company` | `resources/js/Features/Marketing/Pages/Company.jsx` | Marketing estático |
| `Marketing/FAQ` | `resources/js/Features/Marketing/Pages/FAQ.jsx` | Marketing estático |
| `Marketing/Contact` | `resources/js/Features/Marketing/Pages/Contact.jsx` | Marketing estático |
| `Marketing/AboutUs` | `resources/js/Features/Marketing/Pages/AboutUs.jsx` | Marketing estático |
| `Marketing/CookiePolicy` | `resources/js/Features/Marketing/Pages/CookiePolicy.jsx` | Marketing estático |
| `Marketing/TermsOfContract` | `resources/js/Features/Marketing/Pages/TermsOfContract.jsx` | Marketing estático |
| `Marketing/TermsOfUse` | `resources/js/Features/Marketing/Pages/TermsOfUse.jsx` | Marketing estático |
| `Configurator/Configurador/Index` | `resources/js/Features/Configurator/Pages/Configurador/Index.jsx` | Naming legacy en español |
| `Configurator/Configurador/Collections` | `resources/js/Features/Configurator/Pages/Configurador/Collections.jsx` | Naming legacy |
| `Configurator/Configurador/Quiz` | `resources/js/Features/Configurator/Pages/Configurador/Quiz.jsx` | Naming legacy |
| `Configurator/DollConfigurator` | `resources/js/Features/Configurator/Pages/DollConfigurator.jsx` | Convive con `Configurador/*` |
| `Checkout/Cart` | `resources/js/Features/Checkout/Pages/Cart.jsx` | Checkout legacy |
| `Configurator/DollConfigTest` | `resources/js/Features/Configurator/Pages/DollConfigTest.jsx` | Página técnica de test |

## Inventario de componentes y áreas

### Componentes globales ya existentes en `resources/js/Components`

Piezas atómicas o potencialmente globales detectadas:

- `ApplicationLogo`
- `Checkbox`
- `DangerButton`
- `Dropdown`
- `InputError`
- `InputLabel`
- `MikiwiLogo`
- `Modal`
- `NavLink`
- `PrimaryButton`
- `ResponsiveNavLink`
- `SecondaryButton`
- `TextInput`
- `Welcome`

Estas piezas son candidatas a normalizar antes de migrar áreas funcionales, porque varias pantallas dependen de ellas.

### Componentes mal ubicados dentro de `Features`

Áreas con volumen importante de componentes internos:

- `Features/Admin/Components`
- `Features/Auth/Components`
- `Features/Catalog/Components`
- `Features/Checkout/Components`
- `Features/Claims/Components`
- `Features/Configurator/Components`
- `Features/Home/Components`
- `Features/Profile/Components`

Esto confirma que el refactor no es solo mover páginas: también hay que decidir qué componentes pasan a `resources/js/Components/<Area>/` y cuáles se quedan como piezas estrictamente locales a la página.

## Hooks y utils detectados

### Utils globales o semiglobales

- `resources/js/Utils/cloudinary.js`
- `resources/js/Features/Admin/Utils/managerUtils.js`
- `resources/js/Features/Home/utils/textAnimations.jsx`
- `resources/js/Features/Home/utils/ScrollReveal.jsx`

### Hooks actuales

- `resources/js/Features/Configurator/Hooks/usePartOptimization.js`
- `resources/js/Features/Home/hooks/useLenisScroll.js`
- `resources/js/Features/Home/hooks/useScrollAnimations.js`
- `resources/js/Features/Home/hooks/useStackCards.js`

Conclusión: todavía no está limpia la frontera entre hooks/utils globales y hooks/utils específicos de área.

## Estado del styling

### Hallazgos

- `resources/js` usa CSS plano, no CSS Modules.
- Hay CSS local tanto en componentes globales como en páginas y componentes de área.
- Existen archivos con naming no normalizado:
  - `resources/js/Features/Auth/Pages/auth.css`
  - `resources/js/Features/Configurator/Pages/doll-configurator.css`
  - `resources/js/Features/Configurator/Pages/Configurador/configurador.css`
- `resources/css/app.css` sigue como entrada global.
- `resources/css/global.css` existe y debe preservarse como fuente de estilos globales reales.

### Implicación

La migración a `*.module.css` debe hacerse después de estabilizar la estructura física de páginas y componentes, para evitar rehacer imports dos veces.

## Naming inconsistente detectado

### Archivos o rutas con naming conflictivo

- `resources/js/Features/Profile/Pages/perfil.jsx`
- `resources/js/Features/Marketing/Pages/colecciones.jsx`
- `resources/js/Features/Marketing/Pages/NuestrosKiwis.jsx`
- `resources/js/Features/Configurator/Pages/Configurador/...`
- `resources/js/Features/Auth/Pages/auth.css`
- `resources/js/Features/Configurator/Pages/doll-configurator.css`
- `resources/js/Features/Configurator/Pages/Configurador/configurador.css`

### Implicación

Habrá que separar en el plan dos tipos de trabajo:

- migración estructural;
- normalización de naming.

Hacer ambas cosas a la vez en todos los archivos incrementaría demasiado el riesgo de errores.

## Routing y backend: punto de partida

### Hallazgos relevantes en `routes/web.php`

- Hay múltiples closures con `Inertia::render(...)`.
- Existen closures simples de render, que son candidatas a moverse a controller por limpieza estructural.
- Existen closures complejas con queries, caché y composición de payload.
- Hay lógica auxiliar declarada dentro de rutas, como la función recursiva para categorías descendientes.

### Zonas de mayor deuda

- Home
- Perfil
- Admin Components Manager
- Sustainability
- Configurator

## Prioridades que desbloquea este inventario

Con este mapa ya se puede ejecutar el orden del plan con menos incertidumbre:

1. base técnica de estructura destino;
2. hooks y utils globales;
3. componentes globales compartidos;
4. componentes base de formulario;
5. limpieza de barrel exports;
6. layouts;
7. páginas por áreas, empezando por marketing.

## Criterio de cierre del inventario

Este paso se considera completo porque ya deja identificados:

- páginas Inertia activas;
- ramas legacy que siguen dominando;
- componentes globales mal ubicados;
- deuda de CSS;
- naming inconsistente;
- puntos críticos en rutas/backend;
- orden lógico de trabajo para los siguientes commits.
