# Recap claro (hasta Fase 9)

## Contexto rapido
- Objetivo: refactor por features sin tocar Laravel.
- Regla: nombres de archivos deben coincidir con `Inertia::render(...)`.
- Imports: usar `@/` para evitar rutas relativas fragiles.

## Fase 2 (Shared)
**Que hicimos**
- Movimos `Utils`, `Hooks`, `translations` a `Shared/`.
- Ajustamos imports a `@/Shared/...`.
- Creamos `Shared/I18n/` y la dejamos como estructura vacia.
- Quitamos i18n global y el selector de idioma.

**Por que**
- Centralizar reutilizables y reducir acoplamientos.
- Preparar el proyecto para crecer sin romper imports.
- Evitar trabajo extra con i18n mientras migramos features.

## Fase 3 (Marketing)
**Que hicimos**
- Creamos `Features/Marketing/Pages` y `Components`.
- Movimos todas las paginas estaticas a esa carpeta.
- Renombramos a PascalCase para que Inertia las encuentre.
- Actualizamos el resolver para buscar en `Features/**/Pages`.
- Validamos AboutUs, FAQ, LegalNotice.

**Por que**
- Agrupar contenido estatico en un feature unico.
- Mantener compatibilidad con el backend sin tocar rutas.
- Asegurar que el cambio no rompa la web.

## Fase 4 (Auth + Profile)
**Que hicimos**
- Creamos `Features/Auth` y `Features/Profile`.
- Movimos Auth y Profile (Pages + Components + Tabs + Partials).
- Ajustamos imports a `@/Features/...`.
- El resolver ahora soporta rutas con subcarpetas (Auth/Auth, Profile/Edit).
- Quitamos la seccion de Direcciones (UI y rutas).

**Por que**
- Separar autenticacion y perfil como modulos claros.
- Evitar cambios en Laravel y mantener rutas actuales.
- Reducir mantenimiento quitando funciones no usadas.

## Fase 5 (Catalogo + Home)
**Que hicimos**
- Movimos `Products` y `ProductPage` a `Features/Catalog`.
- Movimos `Home` a `Features/Home` con `Home.css` junto a la pagina.
- Actualizamos imports y reexports para mantener compatibilidad.

**Por que**
- Separar catalogo y home como features claros.
- Mantener compatibilidad con Inertia sin tocar backend.
- Reducir rutas relativas fragiles.

## Fase 6 (Checkout)
**Que hicimos**
- Movimos `Cart` y `Success` a `Features/Checkout/Pages`.
- Movimos pasos de checkout a `Features/Checkout/Components`.
- Actualizamos imports a `@/Features/Checkout/...`.

**Por que**
- Agrupar todo el checkout en un solo feature.
- Reducir acoplamientos y facilitar cambios futuros.

## Fase 7 (Configurador 3D)
**Que hicimos**
- Movimos paginas `Configurador/*`, `DollConfigurator` y `DollConfigTest` a `Features/Configurator/Pages`.
- Movimos componentes `Configurador`, `DollConfigurator` y `DollManager` a `Features/Configurator/Components`.
- Mantuvimos `Quiz.css` junto a `Quiz.jsx`.
- Actualizamos imports a `@/Features/Configurator/...`.

**Por que**
- Agrupar todo el configurador 3D en un solo feature.
- Mantener compatibilidad con rutas de Inertia sin tocar backend.
- Evitar imports cruzados entre carpetas antiguas.

## Fase 8 (Admin / ComponentsManager)
**Que hicimos**
- Movimos `ComponentsManager` a `Features/Admin` (Pages + Components).
- Actualizamos `useComponentsManager` para escanear `Features/**` y ajustar rutas.
- Ajustamos imports del Admin a `@/Features/Admin/...`.

**Por que**
- Mantener el panel admin alineado con la nueva estructura por features.
- Evitar roturas por rutas antiguas.

## Fase 9 (CSS y Tailwind)
**Que hicimos**
- Movimos `auth.css` a `Features/Auth/Pages/` y lo importamos localmente.
- Movimos `configurador.css` y `doll-configurator.css` a `Features/Configurator/Pages/` y actualizamos imports.
- Creamos `resources/css/global.css` para tokens globales.
- Simplificamos `app.css` dejando solo `global.css`, Tailwind y estilos globales (nprogress).
- Eliminamos imports globales redundantes en `app.jsx`.

**Por que**
- Evitar CSS global innecesario y mover estilos a su feature.
- Mantener tokens globales claros y centralizados.
- Reducir riesgos de CSS “fantasma” importado en todas las paginas.

## Fase 10 (app.jsx minimo)
**Que hicimos**
- Creamos `AppLayout` para alojar el `ToastContainer`.
- Quitamos `ToastContainer` y sus imports de `app.jsx`.
- Dejamos `app.jsx` con lo minimo (Inertia + resolver + layout).

**Por que**
- Reducir peso en el arranque global.
- Mantener extras como toasts fuera del bootstrap principal.

## Fase 11 (Backend DDD-light)
**Que hicimos**
- Creamos `app/Domain/Categories` y movimos el modulo de categorias:
  - `CategoryService` a `Domain/Categories/Services`.
  - `CategoryRepositoryInterface` y `EloquentCategoryRepository` a `Domain/Categories/Repositories`.
- Actualizamos namespaces y `use` en controllers.
- Actualizamos bindings en `AppServiceProvider`.
- Creamos `app/Domain/Orders` y movimos el modulo de pedidos:
  - `OrderService` a `Domain/Orders/Services`.
  - `CreateOrder` y `CancelOrder` a `Domain/Orders/Actions`.
  - `OrderRepositoryInterface` y `EloquentOrderRepository` a `Domain/Orders/Repositories`.
- Actualizamos namespaces, imports y bindings del repositorio de pedidos.
- Creamos `app/Domain/Products` y movimos el modulo de productos:
  - `ProductService` a `Domain/Products/Services`.
  - `ProductRepositoryInterface` y `EloquentProductRepository` a `Domain/Products/Repositories`.
- Actualizamos controllers, `CartService`, `OrderService` y bindings a los nuevos namespaces.
- Creamos `app/Domain/Addresses` y movimos el modulo de direcciones:
  - `UserAddressService` a `Domain/Addresses/Services`.
  - `SetDefaultAddress` a `Domain/Addresses/Actions`.
  - `UserAddressRepositoryInterface` y `EloquentUserAddressRepository` a `Domain/Addresses/Repositories`.
- Actualizamos namespaces y bindings en `AppServiceProvider`.
- Creamos `app/Domain/HeroImages` y movimos el modulo de hero images:
  - `HeroImageRepositoryInterface` y `EloquentHeroImageRepository` a `Domain/HeroImages/Repositories`.
- Actualizamos namespaces y bindings del repositorio de hero images.
- Creamos `app/Domain/Carts` y movimos el modulo de carrito:
  - `CartService` a `Domain/Carts/Services`.
- Actualizamos imports en controllers, acciones y comandos.
- Creamos `app/Domain/Payments` y movimos Stripe:
  - `StripeService` a `Domain/Payments/Services`.
- Actualizamos controllers a los nuevos namespaces.
- Creamos `app/Domain/Coupons` y movimos la logica de cupones:
  - `CouponService` a `Domain/Coupons/Services`.
- Creamos `app/Domain/Newsletters` y movimos la logica de newsletter:
  - `NewsletterService` a `Domain/Newsletters/Services`.
- Actualizamos controllers de cupones y newsletter a los nuevos services.
- Creamos `app/Domain/Media` y movimos Cloudinary:
  - `CloudinaryService` a `Domain/Media/Services`.
- Creamos `app/Domain/Shipping` y movimos Correos:
  - `CorreosService` a `Domain/Shipping/Services`.
- Actualizamos controllers y comandos a los nuevos namespaces.

## Fase 12 (Tests y CI)
**Que hicimos**
- Creamos `.env.testing` con SQLite en memoria para tests locales.
- Añadimos GitHub Actions con MySQL para CI (`.github/workflows/ci.yml`).
- Incluimos pasos de build frontend y `php artisan test`.

**Por que**
- Tener tests reproducibles sin tocar la DB real.
- Validar build + backend en cada push/pull request.

**Por que**
- Iniciar la separacion DDD-light con un modulo pequeño y aislado.
- Mantener controllers delgados y repositorios dentro del dominio.
