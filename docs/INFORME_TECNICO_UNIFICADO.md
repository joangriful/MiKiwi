# Informe Tecnico Unificado - MiKiwi (Version Auditada)

## 1) Resumen ejecutivo

MiKiwi es una aplicacion web basada en un monolito modular con Laravel 12 en servidor y React 18 + Inertia en cliente. La arquitectura actual combina correctamente renderizado server-driven (Inertia) con endpoints JSON para casos concretos (checkout, autenticacion API, puntos de recogida, operaciones de gestion).

A nivel de base tecnica, el repositorio incorpora patrones empresariales utiles: separacion por capas (Controllers, Services, Repositories), modelos Eloquent, Policies, FormRequests, integraciones Stripe y Cloudinary, y un volumen relevante de pruebas automatizadas en `tests/Feature` y `tests/Unit`.

Sin embargo, el estado real tambien presenta deuda tecnica y riesgos importantes que deben documentarse sin ambiguedad:

- Hay inconsistencia de patrones: conviven FormRequests con validacion inline en controladores.
- Existen zonas con refactor incompleto y defectos de implementacion en `OrderController`, `OrderService`, `UserAddressController` y `CartController`.
- La documentacion incluye credenciales en texto plano (`README.md`, `docs/GUIA_INSTALACION.md`), considerado hallazgo critico de seguridad documental.
- No se detectan `app/Http/Resources`, pipeline CI en `.github/workflows`, ni configuracion Lighthouse (`lighthouserc.js` o scripts npm asociados).
- En frontend no existe capa `resources/js/Services` ni `resources/js/Utils/axios.js`; la app usa `resources/js/bootstrap.js` y consumo directo con `axios`.

Este informe prioriza veracidad documental sobre aspiraciones de arquitectura: describe lo que existe, sus trade-offs y los riesgos operativos actuales.

---

## 2) Alcance, fuentes y criterio de veracidad documental

### 2.1 Alcance

Este documento cubre:

- Arquitectura logica y de capas del repositorio.
- Estado del servidor Laravel, cliente React/Inertia y operacion local.
- Calidad, testing, riesgos, deuda tecnica y plan de mejora 30/60/90 dias.
- Hallazgos tecnicos y de seguridad basados en evidencia directa del codigo.

### 2.2 Fuentes primarias revisadas

- Dependencias y scripts: `composer.json`, `package.json`.
- Entry points y middleware: `bootstrap/app.php`, `app/Http/Middleware/HandleInertiaRequests.php`.
- Rutas: `routes/web.php`, `routes/api.php`, `routes/console.php`.
- Capas backend: `app/Http/Controllers/*`, `app/Services/*`, `app/Repositories/*`, `app/Models/*`, `app/Policies/*`, `app/Http/Requests/*`.
- Integraciones: `app/Services/StripeService.php`, `app/Services/CloudinaryService.php`, `config/services.php`.
- Asincronia y eventos: `app/Events/*`, `app/Listeners/*`, `app/Jobs/*`, `app/Console/Commands/*`.
- Persistencia: migraciones en `database/migrations/*`.
- Frontend: `resources/js/app.jsx`, `resources/js/bootstrap.js`, `resources/js/Hooks/usePartOptimization.js`, `resources/js/Contexts/LanguageContext.jsx` y paginas/componentes relevantes.
- Testing: `tests/Feature/*`, `tests/Unit/*`, `phpunit.xml`.
- Seguridad documental: `README.md`, `docs/GUIA_INSTALACION.md`.

### 2.3 Criterio de veracidad

- Toda afirmacion tecnica de este informe se fundamenta en archivos del repo.
- No se incluyen claims de cumplimiento (WCAG total, SEO garantizado, CI activo, performance certificada) sin evidencia verificable en el repositorio.
- Este informe es de naturaleza documental-estatica: no presupone ejecucion completa en runtime ni exito de todos los tests en el entorno actual.

---

## 3) Arquitectura de referencia (vista logica, capas, flujo y decisiones)

### 3.1 Vista logica general

MiKiwi implementa un **monolito modular** con dos canales HTTP principales:

1. **Canal web + Inertia**: paginas React renderizadas con props desde Laravel.
2. **Canal API JSON**: endpoints REST en `routes/api.php` y endpoints con prefijo `/api/*` definidos en `routes/web.php` para checkout/pickup.

### 3.2 Capas y responsabilidades

| Capa | Implementacion observada | Responsabilidad |
|---|---|---|
| Presentacion HTTP | Controllers + routes + middleware | Entrada/salida HTTP, autorizacion, orquestacion |
| Aplicacion | Services + Actions | Logica de negocio reutilizable |
| Persistencia | Repositories (interfaces + eloquent) + Models | Acceso a datos y reglas de agregados |
| Seguridad | Policies + middleware `admin` + auth guards | Control de acceso por rol/propiedad |
| Integracion externa | StripeService, CloudinaryService, CorreosService | Pago, media y puntos de recogida |

### 3.3 Flujo de peticion de referencia

```text
Browser
  -> Route (web/api)
    -> Middleware (auth, admin, inertia share, throttle)
      -> Controller
        -> (opcional) FormRequest o validate inline
          -> Service / Action / Repository / Eloquent
            -> DB / Integracion externa (Stripe, Cloudinary, Correos)
      <- Response Inertia o JSON
```

### 3.4 Decisiones arquitectonicas y trade-offs actuales

| Decision actual | Beneficio | Coste / limite |
|---|---|---|
| Inertia + React sobre Laravel | Menos friccion full-stack y sesion unificada | Acoplamiento frontend-backend mas alto que SPA/API desacoplada |
| Services + Repositories | Mejor testabilidad y separacion | Inconsistencia cuando controladores bypassan servicios |
| Eventos/listeners/jobs | Base para procesos asincronos | Parte de handlers son placeholders (solo log), madurez parcial |
| API + web coexistentes | Flexibilidad para checkout y operaciones async | Riesgo de duplicidad de contratos y errores de consistencia |

---

## 4) Entorno servidor (Laravel)

### 4.1 Stack y bootstrap

- Laravel `^12.0`, PHP `^8.2`, Sanctum `^4.0`, Inertia Laravel `^2.0` (`composer.json`).
- Bootstrap de rutas web/api/console en `bootstrap/app.php`.
- Middleware web extendido con `HandleInertiaRequests` y alias `admin` (`EnsureUserIsAdmin`).

### 4.2 Rutas y exposicion funcional

#### Web (`routes/web.php`)

- Catalogo/producto/categoria, carrito, checkout, perfil, direcciones, gestor admin, contenido legal y configurador.
- Dentro de grupo `auth`, existen endpoints `/api/pickup-points` y `/api/payment-intent` definidos en web, no en `routes/api.php`.

#### API (`routes/api.php`)

- Productos (`GET /api/products`, `GET /api/products/{slug}`).
- Auth API (`POST /api/register`, `POST /api/login`, `POST /api/logout`, `GET /api/user`), con throttle en login/register.

### 4.3 Dominio y persistencia

#### Modelos principales confirmados

`User`, `Product`, `Category`, `Order`, `OrderItem`, `UserAddress`, `Coupon`, `PickupPoint`, `HeroImage`, mas soporte `ChatSession`, `ChatMessage`, `Review`, `NewsletterSubscriber`.

#### Esquema y relaciones (migraciones)

- Claves UUID en entidades core (users, products, categories, orders, order_items, user_addresses, reviews, chat_*).
- Tablas relacionales con FK: productos-categorias, pedidos-usuarios/items, direcciones-usuarios, reviews usuario-producto.
- Snapshot JSON en pedidos (`shipping_address_snapshot`, `billing_address_snapshot`).
- Extras de negocio: cupones, hero images, newsletter, pickup points, configurador (`doll_settings`, `doll_part_positions`).

### 4.4 Seguridad y control de acceso

- Auth web con middleware `auth`; vistas protegidas adicionales con `verified`/`admin`.
- Auth API con `auth:sanctum` en rutas protegidas.
- Policies de `Order`, `UserAddress`, `User`.
- Rate limiting en auth API (`throttle:5,1`).

**Limites observados:**

- Respuestas de error JSON no estandarizadas de forma global.
- Mezcla de validacion por FormRequest e inline en controladores.
- No se detecta capa central de sanitizacion/normalizacion transversal.

### 4.5 Integraciones externas

#### Stripe

- SDK backend: `stripe/stripe-php`.
- Frontend: `@stripe/react-stripe-js`, `@stripe/stripe-js`.
- Servicio dedicado `StripeService` para `PaymentIntent`.

#### Cloudinary

- SDK backend: `cloudinary/cloudinary_php`.
- `CloudinaryService` implementa listado, upload y delete de media.
- Uso en gestion de hero images y activos del configurador.

#### Correos (pickup, opcional)

- Config en `config/services.php`.
- `CorreosService` con OAuth y fallback a datos mock si API no disponible.

### 4.6 Eventos, listeners, jobs y comandos

- Eventos: `OrderCreated`, `OrderStatusUpdated`, `ProductLowStock`, `UserRegistered`.
- Listeners asociados en `EventServiceProvider`.
- Jobs en cola (`ShouldQueue`): `ProcessPayment`, `SendOrderConfirmationEmail`, `CleanupOldCarts`.
- Comandos: `stock:check`, `carts:cleanup`, `products:sync-images`, entre otros.
- Programacion en `routes/console.php` para limpieza y control de stock.

**Nota tecnica:** parte de jobs/listeners contienen logica placeholder (principalmente logging), util como base pero no como proceso productivo completo.

### 4.7 Observabilidad y operacion backend

- Logging via `Log` en varios puntos de negocio.
- Script `composer dev` levanta server, queue listener, pail y vite en paralelo.
- No se observan integraciones explicitas con APM/tracing distribuido (Sentry, OpenTelemetry, Datadog, etc.) en el repo.

---

## 5) Entorno cliente (React + Inertia)

### 5.1 Inicializacion

- Entrypoint en `resources/js/app.jsx` con `createInertiaApp`.
- Proveedor global `LanguageProvider` y `ToastContainer`.
- Bootstrap HTTP global en `resources/js/bootstrap.js` (`window.axios` + header `X-Requested-With`).

### 5.2 Comunicacion cliente-servidor

- Navegacion/formularios: Inertia (`@inertiajs/react`).
- Operaciones asincronas: `axios` directo desde componentes/paginas (ej. checkout, profile uploads, manager).
- Alias de import definido en `jsconfig.json` (`@/* -> resources/js/*`).

### 5.3 Estado y composicion

- Predominio de estado local con hooks React.
- No se identifica store global tipo Redux/Zustand.
- Contexto confirmado: `resources/js/Contexts/LanguageContext.jsx`.
- Hook custom confirmado en alcance solicitado: `resources/js/Hooks/usePartOptimization.js`.

### 5.4 Performance y experiencia

- Carga perezosa de Stripe y promesa memoizada en checkout.
- Uso de React Three Fiber en configurador 3D.
- Tailwind 3 para UI utilitaria; Vite 7 para build/dev.

### 5.5 Accesibilidad y compatibilidad

- Hay patrones basicos (labels, alt, jerarquia semantica en multiples vistas), pero no evidencia de auditoria formal WCAG automatizada en el repo.
- No existe evidencia de estrategia de compatibilidad documentada por navegador/dispositivo dentro del repositorio.

### 5.6 Limitaciones estructurales del frontend observadas

- No existe `resources/js/Services`.
- No existe `resources/js/Utils/axios.js`.
- Existen pantallas/tablas de perfil con estado mock local (ej. `AddressesTab`) que pueden divergir de la API real.

---

## 6) Calidad y operacion

### 6.1 Testing automatizado

- Configuracion PHPUnit en `phpunit.xml` con suites `Feature` y `Unit`.
- Inventario observado: ~39 archivos de test (`38 Feature`, `1 Unit`) distribuidos en servicios, repositorios, policies, listeners, jobs, requests, eventos y auth.
- Esto indica buena intencion de cobertura en backend, aunque el informe no asume resultados de ejecucion en este corte.

### 6.2 Build y release

- Frontend: `npm run dev`, `npm run build`.
- Desarrollo rapido: `npm start` (Laravel + Vite concurrentes).
- Desarrollo extendido: `composer dev` (server + queue + logs + vite).
- No hay evidencia de pipeline CI en `.github/workflows`.
- No hay scripts Lighthouse ni archivo `lighthouserc.js`.

### 6.3 Operacion local

Flujo tipico reproducible desde repo:

1. `composer install`
2. `npm install`
3. Copiar `.env.example` a `.env`
4. `php artisan key:generate`
5. `php artisan migrate`
6. `composer dev` o `npm start`

---

## 7) Hallazgos tecnicos y de seguridad (clasificados por severidad)

### 7.1 Hallazgos criticos

| ID | Hallazgo | Severidad | Impacto | Evidencia |
|---|---|---|---|---|
| SEC-001 | Credenciales reales en documentacion versionada | Critica | Exposicion de secretos, riesgo de acceso no autorizado y compromiso de cuentas | `README.md:3`, `README.md:5`, `docs/GUIA_INSTALACION.md:56` |
| APP-001 | `OrderController` presenta fragmentos inconsistentes/rotos (uso de variables no definidas y constructor anomalo) | Critica | Riesgo de error en runtime y bloqueo de checkout | `app/Http/Controllers/OrderController.php:30`, `app/Http/Controllers/OrderController.php:31`, `app/Http/Controllers/OrderController.php:43` |
| APP-002 | Ruta expone `OrderController@createPaymentIntent` pero ese metodo no existe en el controlador | Critica | Error 500 al invocar endpoint de pago | `routes/web.php:89`, `app/Http/Controllers/OrderController.php` (sin metodo) |
| APP-003 | API auth usa `createToken()` sin `HasApiTokens` en modelo `User` | Critica | Register/Login API pueden fallar en runtime | `app/Http/Controllers/Api/AuthController.php:31`, `app/Http/Controllers/Api/AuthController.php:57`, `app/Models/User.php:10` |

### 7.2 Hallazgos altos

| ID | Hallazgo | Severidad | Impacto | Evidencia |
|---|---|---|---|---|
| APP-004 | `UserAddressController` usa variable `$data` no definida tras `validated()` | Alta | Fallo en alta/actualizacion de direcciones | `app/Http/Controllers/UserAddressController.php:32`, `app/Http/Controllers/UserAddressController.php:39`, `app/Http/Controllers/UserAddressController.php:53`, `app/Http/Controllers/UserAddressController.php:58` |
| APP-005 | `CartController` retorna `$cart` no definido en `update()` y `destroy()` | Alta | Respuestas JSON defectuosas | `app/Http/Controllers/CartController.php:115`, `app/Http/Controllers/CartController.php:138` |
| ARC-001 | `OrderService` con dependencias/codigo incompleto (tipo `CreateOrder` sin import y propiedades no declaradas coherentes) | Alta | Inestabilidad y deuda de refactor en capa de servicio | `app/Services/OrderService.php:22`, `app/Services/OrderService.php:24` |
| ARC-002 | Desacople parcial entre modelo/migracion y payload de pedidos (`payment_id`, `pickup_point_id` usados en creacion pero no en esquema base de orders ni fillable del modelo) | Alta | Perdida silenciosa de datos o comportamiento inconsistente | `app/Actions/Orders/CreateOrder.php:55`, `app/Actions/Orders/CreateOrder.php:58`, `database/migrations/2026_01_23_193101_create_orders_tables.php:14`, `app/Models/Order.php:14` |
| DOC-001 | No existe `app/Http/Resources` pese a existir API JSON | Alta | Contratos API heterogeneos y serializacion no estandarizada | ausencia de ruta `app/Http/Resources` |

### 7.3 Hallazgos medios

| ID | Hallazgo | Severidad | Impacto | Evidencia |
|---|---|---|---|---|
| GOV-001 | Mezcla de FormRequest e inline validation | Media | Regresiones de validacion y dificultad de mantenimiento | `app/Http/Requests/StoreOrderRequest.php:10`, `app/Http/Controllers/OrderController.php:74`, `app/Http/Controllers/Api/AuthController.php:16` |
| OPS-001 | Sin CI declarativo en repo (`.github/workflows`) | Media | Calidad dependiente de ejecucion manual | ausencia `.github/workflows` |
| PERF-001 | Sin automatizacion Lighthouse ni configuracion dedicada | Media | Sin baseline reproducible de performance web | `package.json:5`, ausencia `lighthouserc*` |
| FE-001 | No existe capa frontend `Services` ni util central `Utils/axios.js` | Media | Consumo HTTP disperso, manejo de errores no uniforme | ausencia `resources/js/Services`, ausencia `resources/js/Utils/axios.js`, `resources/js/bootstrap.js:1` |
| ROUTE-001 | Duplicidad de rutas legales/claims en `web.php` | Media | Ambiguedad de mantenimiento y riesgo de sobrescritura de nombres | `routes/web.php:179`, `routes/web.php:204`, `routes/web.php:182`, `routes/web.php:208` |

### 7.4 Hallazgos bajos

| ID | Hallazgo | Severidad | Impacto | Evidencia |
|---|---|---|---|---|
| OBS-001 | Observabilidad centrada en logs sin trazabilidad distribuida | Baja | Dificultad en RCA avanzada | uso extensivo de `Log::...` en controllers/services/jobs |
| OPS-002 | Parte de jobs/listeners/comandos con implementacion placeholder | Baja | Cobertura funcional parcial en asincronia | `app/Jobs/ProcessPayment.php:33`, `app/Jobs/SendOrderConfirmationEmail.php:27`, `app/Console/Commands/CleanupExpiredCarts.php:20` |

---

## 8) Riesgos arquitectonicos y deuda tecnica

### 8.1 Riesgos estructurales

1. **Deriva de arquitectura por refactor incompleto**  
   El sistema muestra coexistencia de patrones correctos (acciones, repositorios, requests) con implementaciones inconsistentes en puntos criticos de checkout/direcciones.

2. **Contratos API no uniformes**  
   Ausencia de API Resources y heterogeneidad de respuestas dificulta versionado y consumo robusto por cliente.

3. **Acoplamiento funcional en checkout**  
   Flujo de pago depende de piezas distribuidas entre web routes, axios directo, controlador con deuda y servicio Stripe, incrementando superficie de fallo.

4. **Seguridad documental insuficiente**  
   Exposicion de credenciales en docs compromete controles basicos de seguridad del ciclo de vida del software.

### 8.2 Deuda tecnica prioritaria

- Reparacion de controladores con errores de variable/metodo.
- Consolidacion de validaciones en FormRequests.
- Normalizacion de DTO/serializacion JSON (sin afirmar API Resources existentes hoy).
- Unificacion de cliente HTTP frontend (interceptores, manejo de errores, trazabilidad).
- Eliminacion de secretos del historial/documentacion y rotacion inmediata de credenciales afectadas.

---

## 9) Plan de mejora priorizado (30/60/90 dias)

### 9.1 Objetivos

- Reducir riesgo operativo inmediato en checkout/auth.
- Estabilizar contratos y capas.
- Elevar seguridad y disciplina de entrega.

### 9.2 Roadmap

| Horizonte | Prioridad | Accion | Resultado esperado | KPI sugerido |
|---|---|---|---|---|
| 0-30 dias | P0 | Eliminar secretos de docs, rotar credenciales expuestas, publicar politica de secretos | Riesgo documental mitigado | 0 secretos en repo escaneado |
| 0-30 dias | P0 | Corregir `OrderController`, `UserAddressController`, `CartController`, `OrderService` (compilacion y flujo) | Checkout/direcciones estables | 0 errores runtime en flujos criticos |
| 0-30 dias | P0 | Alinear endpoint pago: crear metodo faltante o ajustar ruta/controlador | Pago invocable sin 500 por metodo ausente | 100% requests endpoint pago con respuesta valida |
| 0-30 dias | P1 | Asegurar Auth API con Sanctum completo (incluyendo trait/modelo y pruebas) | Login/register API funcionales | Tests auth API en verde |
| 31-60 dias | P1 | Migrar validacion inline a FormRequests en controladores clave | Consistencia de validacion | >=80% endpoints criticos con FormRequest |
| 31-60 dias | P1 | Estandarizar respuestas JSON (success/error, codigos, estructura) | Contrato API coherente | Guia de contrato publicada + tests de contrato |
| 31-60 dias | P2 | Introducir capa frontend de servicios HTTP y manejo centralizado de errores | Menor duplicacion en llamadas axios | Reduccion de llamadas directas ad-hoc |
| 31-60 dias | P2 | Revisar duplicidades de rutas y nomenclatura | Menor ambiguedad operativa | 0 rutas duplicadas por path/nombre |
| 61-90 dias | P1 | Instrumentar CI basica (lint/test/build) | Calidad automatizada por push/PR | pipeline estable >95% |
| 61-90 dias | P2 | Baseline de performance y accesibilidad (Lighthouse + checks minimos) | Evidencia objetiva de calidad web | score minimo acordado por entorno |
| 61-90 dias | P2 | Mejorar observabilidad (request id, trazas, alertas minimas) | Diagnostico mas rapido de incidentes | MTTR reducido y logs correlables |

---

## 10) Anexos

### 10.1 Mapa de archivos clave

#### Backend core

- `bootstrap/app.php`
- `routes/web.php`
- `routes/api.php`
- `routes/console.php`
- `app/Providers/AppServiceProvider.php`
- `app/Providers/EventServiceProvider.php`
- `app/Http/Controllers/OrderController.php`
- `app/Http/Controllers/UserAddressController.php`
- `app/Http/Controllers/CartController.php`
- `app/Services/OrderService.php`
- `app/Services/StripeService.php`
- `app/Services/CloudinaryService.php`
- `app/Repositories/Interfaces/*`
- `app/Repositories/Eloquent/*`
- `app/Models/*`
- `database/migrations/*`

#### Frontend core

- `resources/js/app.jsx`
- `resources/js/bootstrap.js`
- `resources/js/Hooks/usePartOptimization.js`
- `resources/js/Contexts/LanguageContext.jsx`
- `resources/js/Pages/Cart.jsx`
- `vite.config.js`
- `tailwind.config.js`
- `jsconfig.json`

#### Calidad y operacion

- `composer.json`
- `package.json`
- `phpunit.xml`
- `tests/Feature/*`
- `tests/Unit/*`

#### Seguridad documental

- `README.md`
- `docs/GUIA_INSTALACION.md`

### 10.2 Trazabilidad (afirmacion -> evidencia)

| Afirmacion | Evidencia directa |
|---|---|
| Stack Laravel 12 + PHP 8.2+ + Inertia 2 | `composer.json:9`, `composer.json:11`, `composer.json:12` |
| React 18 + Vite 7 + Tailwind 3 | `package.json:21`, `package.json:24`, `package.json:23` |
| Integracion Stripe y Cloudinary presente | `composer.json:10`, `composer.json:15`, `package.json:29`, `package.json:30` |
| Capa Controllers/Services/Repositories implementada | `app/Http/Controllers/*`, `app/Services/*`, `app/Repositories/*`, `app/Providers/AppServiceProvider.php:27` |
| Rutas web y api separadas, con `/api/*` tambien en web | `routes/web.php:85`, `routes/web.php:89`, `routes/api.php:17` |
| Modelos principales ecommerce y soporte existen | `app/Models/User.php`, `app/Models/Product.php`, `app/Models/Order.php`, `app/Models/Review.php`, `app/Models/NewsletterSubscriber.php` |
| Existen events/listeners/jobs/commands | `app/Events/*`, `app/Listeners/*`, `app/Jobs/*`, `app/Console/Commands/*` |
| Existen tests Feature y Unit en volumen alto | `tests/Feature/*Test.php`, `tests/Unit/ExampleTest.php`, `phpunit.xml:7` |
| No existe `app/Http/Resources` | ausencia de directorio `app/Http/Resources` |
| No existe CI en `.github/workflows` | ausencia de directorio `.github/workflows` |
| No existen scripts Lighthouse ni `lighthouserc` | `package.json:5`, ausencia `lighthouserc*` |
| Frontend no tiene `resources/js/Services` ni `resources/js/Utils/axios.js` | ausencia de ambos paths; `resources/js/bootstrap.js:1` como punto actual |
| Hook/contexto especificos existen | `resources/js/Hooks/usePartOptimization.js`, `resources/js/Contexts/LanguageContext.jsx` |
| Hay deuda de refactor en `OrderController`, `OrderService`, `UserAddressController` | `app/Http/Controllers/OrderController.php:30`, `app/Services/OrderService.php:22`, `app/Http/Controllers/UserAddressController.php:32` |
| Credenciales en texto plano en docs | `README.md:3`, `README.md:5`, `docs/GUIA_INSTALACION.md:56` |

---

## Conclusiones tecnicas

MiKiwi dispone de una base arquitectonica valida para escalar como producto full-stack (Laravel + Inertia + React) y contiene piezas avanzadas ya incorporadas (repositorios, policies, eventos, jobs, tests). La principal necesidad no es cambiar stack, sino **cerrar la brecha entre arquitectura deseada y codigo efectivo** en zonas criticas.

Las prioridades inmediatas son seguridad documental, estabilidad de checkout/auth, y normalizacion de contratos/validaciones. Con un plan disciplinado de 90 dias, el proyecto puede reducir riesgo operativo de forma significativa y aumentar su mantenibilidad sin reescrituras masivas.
