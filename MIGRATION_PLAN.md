# Plan Detallado de Migracion (Laravel + Inertia + React + Tailwind)

> Objetivo: refactor gradual sin cambiar la UI, priorizando rendimiento y mantenibilidad.
> Restricciones: JavaScript (no TypeScript), Tailwind puro con minimo CSS, Inertia se mantiene.

## 0) Principios y reglas del refactor (no negociables)
- No cambiar apariencia ni comportamiento visible.
- Cambios pequenos y verificables.
- Cada movimiento debe dejar el proyecto funcionando.
- Los imports se actualizan en el mismo paso del movimiento.
- Evitar mover dos features en el mismo dia si no hay tiempo para validar.

## 1) Estructura objetivo (solo carpetas)

### Frontend (resources/js)
- `resources/js/app.jsx` (bootstrap minimo)
- `resources/js/Features/`
- `resources/js/Shared/`
- `resources/js/Layouts/`
- `resources/js/translations/` (o `Shared/I18n/`)

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

### Backend (app)
- `app/Domain/`
- `app/Application/`
- `app/Infrastructure/`
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

## 4) Checklist general por cada movimiento
1. Identificar que archivos se moveran.
2. Crear carpeta destino si no existe.
3. Mover archivo(s).
4. Actualizar imports relativos en el mismo paso.
5. Ejecutar build local (si es posible).
6. Probar rutas afectadas manualmente.

## 5) Fase 1 - Preparacion (1 sesion)

### 5.1 Crear estructura destino (sin mover codigo aun)
- Crear `resources/js/Features/`
- Crear `resources/js/Shared/`
- Crear `resources/js/Layouts/` (si no existe)

### 5.2 Reglas de import
- Evitar imports largos y rotos.
- Usar rutas relativas consistentes.
- No introducir aliases nuevos en este momento.

### 5.3 Definir ownership
- Asignar features por persona para evitar conflictos.

## 6) Fase 2 - Shared (segura y rapida)

### 6.1 translations
- Mover `resources/js/translations/` a `resources/js/Shared/I18n/`
- Actualizar imports en el `LanguageProvider` y donde se usen JSON.

### 6.2 Utils
- Mover `resources/js/Utils/` a `resources/js/Shared/Utils/`
- Ejemplo: `cloudinary.js`, `managerUtils.js`
- Verificar si algun util es solo de un feature y moverlo alli.

### 6.3 Hooks
- Mover `resources/js/Hooks/` a `resources/js/Shared/Hooks/`
- Si algun hook es especifico (ej. configurador), moverlo al feature correcto.

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

### 7.3 Ajustar resolve de Inertia
- Actualizar `resolvePageComponent` para encontrar las nuevas rutas
- Mantener compatibilidad temporal si hace falta (doble glob)

## 8) Fase 4 - Auth y Profile

### 8.1 Feature Auth
- `Features/Auth/Pages/`
- `Features/Auth/Components/`
- Mover `Pages/Auth` y `Components/Auth`

### 8.2 Feature Profile
- `Features/Profile/Pages/`
- `Features/Profile/Components/`
- Mover `Pages/Profile` y `Components/Profile`

## 9) Fase 5 - Catalogo / Productos

### 9.1 Feature Catalog
- `Features/Catalog/Pages/`
- `Features/Catalog/Components/`
- Mover `ProductPage` y `Products` relacionados

### 9.2 Revisar imagenes y carousels
- Verificar import paths a assets y css

## 10) Fase 6 - Checkout

### 10.1 Feature Checkout
- `Features/Checkout/Pages/`
- `Features/Checkout/Components/`
- Mover `Pages/Checkout` y `Components/Checkout`

### 10.2 Revisar integraciones de Stripe
- Mantener integraciones en el feature mientras no se refactorice backend

## 11) Fase 7 - Configurador 3D

### 11.1 Feature Configurator
- `Features/Configurator/Pages/`
- `Features/Configurator/Components/`
- Mover `Pages/Configurador` y `Components/Configurador` + `DollConfigurator`

### 11.2 Validar dependencias 3D
- Verificar imports de `three`, `fiber`, `drei`

## 12) Fase 8 - Admin / Manager

### 12.1 Feature Admin
- `Features/Admin/Pages/`
- `Features/Admin/Components/`
- Mover `Components/ComponentsManager` y `Pages/ComponentsManager`

## 13) CSS y Tailwind (paralelo por fases)

### 13.1 Reducir CSS global
- Mantener solo variables globales y resets
- Estilos especificos pasan a Tailwind o a CSS local del feature

### 13.2 Donde usar CSS local
- Solo cuando Tailwind sea insuficiente o muy verboso
- `Component.module.css` o `feature.css` importado localmente

## 14) app.jsx minimo (rendimiento)
- Solo `createInertiaApp`, providers indispensables y CSS critico
- Mover `ToastContainer` y extras a Layouts o Pages

## 15) Backend DDD-light (cuando el frontend este estable)

### 15.1 Crear carpetas base
- `app/Domain/`
- `app/Application/`
- `app/Infrastructure/`

### 15.2 Migracion por modulos
- Seleccionar un modulo pequeno (Auth o Profile)
- Mover logica de controllers a `Application`
- Mover integraciones externas a `Infrastructure`
- Dejar controllers como orquestadores

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

## 17) Criterios de finalizacion
- Todas las paginas resuelven desde `Features/`
- No hay imports desde `Pages/` o `Components/` antiguos
- `app.jsx` minimo y sin dependencias pesadas
- Backend con estructura DDD-light iniciada al menos en 1 modulo

## 18) Riesgos y mitigaciones
- Imports rotos: mover poco a poco y validar
- CSS perdido: validar cada pagina migrada
- Conflictos de equipo: asignar features por persona

