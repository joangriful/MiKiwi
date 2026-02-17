# MiKiwi - E-Commerce Platform

## 📋 Resumen Ejecutivo

**MiKiwi** es una plataforma de e-commerce desarrollada con tecnologías modernas, enfocada en la venta de productos personalizables (muñecas) con un sistema de configuración visual interactivo. El proyecto sigue arquitecturas empresariales y patrones de diseño de nivel profesional.

**Estado Actual:** En desarrollo activo  
**Versión:** 1.0.0  
**Última Actualización:** Febrero 2026

---

## 🎯 Objetivo del Proyecto

Desarrollar una plataforma e-commerce completa que permite:
- Configuración visual de productos personalizables
- Gestión de inventario y pedidos
- Sistema de pagos integrado (Stripe)
- Panel de administración robusto
- Experiencia de usuario moderna y fluida

---

## 🛠️ Stack Tecnológico

### Backend
- **Framework:** Laravel 12
- **Lenguaje:** PHP 8.2+
- **Base de Datos:** MySQL
- **Autenticación:** Laravel Sanctum
- **API:** RESTful con Inertia.js
- **Queue System:** Laravel Queues
- **Pasarela de Pago:** Stripe

### Frontend
- **Framework UI:** React 18.2
- **Routing:** Inertia.js 2.0
- **Estilos:** Tailwind CSS 3.2+
- **Build Tool:** Vite 7.0
- **3D Rendering:** React Three Fiber (@react-three/fiber, @react-three/drei)
- **Gestión de Estado:** React Context API + Hooks personalizados
- **Formularios:** React Easy Crop, React Phone Input 2

### Infraestructura
- **CDN de Imágenes:** Cloudinary
- **Gestión de Rutas:** Ziggy (route helpers Laravel → JS)
- **Dev Environment:** Concurrent (Laravel server + Vite + Queue + Logs)

---

## 🔗 Inertia.js - El Puente Frontend-Backend

### ¿Qué es Inertia.js?

**Inertia.js** es un framework moderno que permite construir **Single Page Applications (SPAs)** clásicas usando el enfoque tradicional de **server-side routing** pero con toda la experiencia de usuario de una aplicación de una sola página.

**En términos simples:** Inertia.js es el pegamento que conecta Laravel (backend) con React (frontend), eliminando la necesidad de construir una API REST completa.

### Filosofía

En lugar de:
1. ❌ Crear endpoints API en Laravel (`/api/products`)
2. ❌ Hacer fetch desde React
3. ❌ Manejar estados de carga, errores, autenticación en ambos lados

Inertia permite:
1. ✅ Definir rutas web normales en Laravel (`/products`)
2. ✅ Retornar componentes React directamente desde controllers
3. ✅ Compartir datos del servidor a React sin serialización manual

### Cómo lo Usamos en MiKiwi

#### 1. **Rutas Web (no API)**
```php
// routes/web.php
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/configurador', [DollConfigController::class, 'show'])->name('configurador');
```

#### 2. **Controllers Retornan Componentes React**
```php
// app/Http/Controllers/ProductController.php
public function index()
{
    return Inertia::render('Products/Index', [
        'products' => Product::with('category')->paginate(12),
        'categories' => Category::all(),
    ]);
}
```

#### 3. **Componentes React Reciben Props**
```jsx
// resources/js/Pages/Products/Index.jsx
export default function Index({ products, categories }) {
    return (
        <div>
            <h1>Products</h1>
            {products.data.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
```

### Ventajas en Nuestro Proyecto

1. **No Duplicación de Validación** - Una sola fuente de verdad en Laravel
2. **Autenticación Simplificada** - Sanctum + middleware, sin tokens manuales
3. **SEO Friendly** - Server-side rendering inicial
4. **Navegación Instantánea** - Sin recargas de página
5. **Código Más Limpio** - Sin boilerplate de API REST
6. **Shared Data** - Variables globales (user, flash messages) disponibles en todas las páginas

### Características Clave Usadas

#### **Shared Data (Datos Compartidos)**
```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request)
{
    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user(),
        ],
        'flash' => [
            'message' => fn () => $request->session()->get('message'),
        ],
    ]);
}
```

Estos datos están disponibles en **todos** los componentes React automáticamente.

#### **Form Helper (Ziggy Routes)**
```jsx
import { router } from '@inertiajs/react';

// Navegación programática
router.visit(route('products.show', product.id));

// Formularios con manejo de errores automático
router.post(route('cart.add'), { product_id: 5 });
```

#### **Lazy Loading / Partial Reloads**
```jsx
// Solo recargar ciertos datos sin refrescar toda la página
router.reload({ only: ['products'] });
```

#### **Persistent Layouts**
```jsx
// resources/js/Layouts/AppLayout.jsx
export default function AppLayout({ children }) {
    return (
        <div>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
}

// En las páginas
Index.layout = page => <AppLayout>{page}</AppLayout>;
```

El layout se mantiene entre navegaciones, solo cambia el contenido.

### Flujo Completo de una Request

1. **Usuario hace clic** en "Ver Productos"
2. **Inertia intercepta** el clic (previene recarga)
3. **AJAX Request** a `/products` con header `X-Inertia`
4. **Laravel responde** con JSON:
   ```json
   {
     "component": "Products/Index",
     "props": {
       "products": [...],
       "categories": [...]
     }
   }
   ```
5. **React renderiza** el componente `Products/Index.jsx` con esas props
6. **URL actualizada** en el navegador sin recarga
7. **Historial preserved** (botón atrás funciona)

### Archivos Clave en el Proyecto

- `resources/js/app.jsx` - Setup de Inertia
- `app/Http/Middleware/HandleInertiaRequests.php` - Shared data
- `resources/js/Pages/` - Todas las páginas Inertia
- `routes/web.php` - Rutas que retornan componentes Inertia

### En Resumen

**Inertia.js** nos permite escribir código como si fuera una aplicación tradicional de Laravel con Blade, pero obtenemos toda la interactividad y experiencia de usuario de React. Es lo mejor de ambos mundos:
- 🚀 **SPA moderna** sin complejidad de configurar API REST
- 🔧 **Laravel tradicional** sin sacrificar experiencia de usuario
- 💡 **Un solo lenguaje** de routing (Laravel), sin duplicación

### Herramientas de Desarrollo
- **Linting PHP:** Laravel Pint
- **Testing:** PHPUnit
- **Version Control:** Git (GitHub)
- **Package Managers:** Composer (PHP), NPM (JS)

---

## 🏗️ Arquitectura del Proyecto

### Patrones de Diseño Implementados

#### Backend (Laravel)
1. **Repository Pattern** - Abstracción de acceso a datos
   - `ProductRepository`, `CategoryRepository`, `OrderRepository`
   - Interfaces + Implementaciones Eloquent
   
2. **Service Layer Pattern** - Lógica de negocio centralizada
   - `ProductService`, `OrderService`, `CartService`, `CategoryService`, `CloudinaryService`
   - Controllers delgados que delegan a servicios

3. **Policy Pattern** - Autorización granular
   - `UserPolicy`, `OrderPolicy`, `ProductPolicy`, etc.

4. **Event-Driven Architecture** - Desacoplamiento de acciones
   - Eventos: `OrderCreated`, `OrderStatusUpdated`, `ProductLowStock`
   - Listeners: `SendOrderConfirmation`, `UpdateInventory`, `NotifyAdmin`

5. **Factory Pattern** - Generación de datos de prueba
   - Seeders y Factories para testing

#### Frontend (React)
1. **Container/Presentational Pattern** - Separación de lógica y UI
   - Componentes de presentación puros
   - Containers con lógica de estado

2. **Custom Hooks Pattern** - Lógica reutilizable
   - `usePartOptimization` (optimización de imágenes)
   - Hooks personalizados para gestión de estado

3. **Compound Components** - Componentes complejos modulares
   - `DollManager` con múltiples configuradores
   - Sistema de componentes del doll configurator

4. **Service Integration Pattern** - Llamadas API centralizadas
   - Axios con route helpers de Ziggy

### Estructura de Directorios

```
mikiwi/
├── app/                          # Backend Laravel
│   ├── Actions/                  # Single-responsibility actions
│   ├── Console/Commands/         # Artisan commands
│   ├── Enums/                    # Enumeraciones tipadas
│   ├── Events/                   # Eventos del sistema
│   ├── Exceptions/               # Excepciones personalizadas
│   ├── Http/
│   │   ├── Controllers/          # Controllers MVC
│   │   ├── Middleware/           # Middleware custom
│   │   ├── Requests/             # Form Request validation
│   │   └── Resources/            # API Resources (transformers)
│   ├── Jobs/                     # Queue jobs
│   ├── Listeners/                # Event listeners
│   ├── Models/                   # Eloquent models
│   ├── Policies/                 # Authorization policies
│   ├── Repositories/             # Data access layer
│   │   ├── Eloquent/             # Implementaciones
│   │   └── Interfaces/           # Contratos
│   └── Services/                 # Business logic layer
│
├── resources/                    # Frontend
│   ├── js/
│   │   ├── Components/           # Componentes React
│   │   │   ├── DollConfigurator/ # Configurador de muñecas
│   │   │   ├── DollManager/      # Gestión de configuración
│   │   │   ├── Footer/           # Componentes del footer
│   │   │   ├── Header/           # Componentes del header
│   │   │   └── Home/             # Componentes de la home
│   │   ├── Contexts/             # React contexts
│   │   ├── Hooks/                # Custom hooks
│   │   ├── Pages/                # Páginas Inertia
│   │   └── Utils/                # Utilidades
│   └── css/                      # Estilos Tailwind
│
├── database/                     # Base de datos
│   ├── factories/                # Model factories
│   ├── migrations/               # Migraciones
│   └── seeders/                  # Seeders
│
├── routes/                       # Rutas de la aplicación
│   ├── web.php                   # Rutas web (Inertia)
│   ├── api.php                   # Rutas API
│   └── console.php               # Comandos Artisan
│
├── tests/                        # Tests automatizados
│   ├── Feature/                  # Feature tests
│   └── Unit/                     # Unit tests
│
└── public/                       # Assets públicos
    └── images/                   # Imágenes estáticas
```

---

## 🔑 Funcionalidades Principales

### 1. **Configurador de Muñecas (Doll Configurator)**
Sistema complejo de configuración visual de productos personalizables:

#### Componentes Principales:
- **DollManager** - Gestor central de configuración
  - Default Doll: Configuración de partes por defecto
  - Preview Doll Parts: Previsualización y edición de posiciones
  - Default Zoom: Configuración de zoom inicial
  - Section Order: Orden de secciones en la interfaz

- **DollConfigurator** - Visualización y selección de partes
  - Sistema multi-vista (front/back)
  - PreviewArea: Vista previa compuesta
  - PartSelector: Selector de partes con imágenes
  - PartCarousel: Carrusel de opciones

- **PartPositionEditor** - Editor de posiciones avanzado
  - Drag & drop para reposicionar
  - Zoom con rueda del ratón
  - Transformaciones en tiempo real
  - Guardado de configuración

#### Optimizaciones:
- **Smart Image Cropping** - Optimización de ancho de banda
- **Cloudinary Integration** - Transformaciones de imagen en CDN
- **Optimistic UI Updates** - Actualización instantánea de UI
- **Lazy Loading** - Carga diferida de imágenes

#### Persistencia:
- Base de datos para configuraciones de usuario
- Tablas: `doll_settings`, `doll_part_positions`
- API endpoints para guardar/cargar configuraciones

### 2. **Sistema de Productos**
- Catálogo de productos con categorías
- Gestión de inventario
- Imágenes optimizadas vía Cloudinary
- Reviews y calificaciones
- Slugs SEO-friendly

### 3. **Carrito y Checkout**
- Carrito de compras persistente
- Cálculo automático de totales
- Integración con Stripe
- Gestión de direcciones de envío

### 4. **Panel de Administración**
- **Components Manager** - Gestión de contenido dinámico
  - Hero images
  - Secciones de la home
  - Media uploads
  
- **Product Management** - CRUD completo de productos
- **Order Management** - Gestión de pedidos
- **Category Management** - Organización de catálogo

### 5. **Autenticación y Perfiles**
- Registro y login de usuarios
- Perfiles de usuario editables
- Gestión de direcciones múltiples
- Sistema de roles (admin/user)
- Protección de rutas por middleware

---

## 🗄️ Modelos de Base de Datos

### Principales Modelos
- **User** - Usuarios del sistema
- **Product** - Productos del catálogo
- **Category** - Categorías de productos
- **Order** - Pedidos
- **OrderItem** - Items de pedidos
- **UserAddress** - Direcciones de envío
- **Review** - Reviews de productos
- **HeroImage** - Imágenes del hero
- **ChatSession** / **ChatMessage** - Sistema de chat (futuro)

---

## ⚙️ Gestión y Comandos

### Comandos de Desarrollo

```bash
# Setup inicial
composer install          # Instalar dependencias PHP
npm install              # Instalar dependencias JS
cp .env.example .env     # Configurar variables de entorno
php artisan key:generate # Generar app key
php artisan migrate --seed # Migrar y sembrar BD

# Desarrollo
composer dev             # Stack completo (server + queue + logs + vite)
npm start               # Server + Vite
php artisan serve       # Solo backend
npm run dev             # Solo Vite

# Build
npm run build           # Build de producción

# Testing
php artisan test        # Ejecutar tests
./vendor/bin/pint       # Formatear código PHP

# Base de datos
php artisan migrate:fresh --seed  # Reset completo
php artisan db:seed     # Solo seeders
```

### Scripts Composer Personalizados
- `composer dev` - Full dev stack con Concurrently
- `composer test` - Test suite completo
- `composer setup` - Setup automatizado del proyecto

---

## 🔐 Seguridad

### Medidas Implementadas
- **Laravel Sanctum** - API token authentication
- **CSRF Protection** - Protección contra CSRF
- **Rate Limiting** - Limitación de peticiones
- **Input Validation** - Form Requests para todas las entradas
- **SQL Injection Prevention** - Eloquent ORM
- **XSS Protection** - Blade/React escaping automático
- **Mass Assignment Protection** - `$fillable` en models

### Mejores Prácticas
- Passwords hasheados con bcrypt
- Roles y permisos con Policies
- Middleware para protección de rutas
- Validación server-side obligatoria
- Sanitización de inputs

---

## 📈 Escalabilidad

### Arquitectura Preparada Para
- **Queue System** - Jobs asíncronos para tareas pesadas
- **Event-Driven** - Desacoplamiento de funcionalidades
- **Service Layer** - Lógica de negocio reutilizable
- **Repository Pattern** - Cambio fácil de ORM/DB
- **CDN Integration** - Cloudinary para assets

### Optimizaciones
- Lazy loading de componentes React
- Code splitting con Vite
- Image optimization automática (Cloudinary)
- Database indexing en campos clave
- Caching de rutas y configs

---

## 📝 Principios de Código

### SOLID
- **S**ingle Responsibility - Una clase, un propósito
- **O**pen/Closed - Abierto a extensión, cerrado a modificación
- **L**iskov Substitution - Sustitución de interfaces
- **I**nterface Segregation - Interfaces específicas
- **D**ependency Inversion - Depender de abstracciones

### Clean Code
- Funciones pequeñas (max 20-30 líneas)
- Nombres descriptivos
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- YAGNI (You Aren't Gonna Need It)

### Estándares
- PSR-12 para PHP
- Prettier/ESLint para JavaScript
- Commits con Conventional Commits
- Code reviews obligatorios

---

## 🚀 Deployment

### Entornos
- **Development** - Local con `composer dev`
- **Staging** - Pre-producción (configurar)
- **Production** - Producción (configurar)

### Variables de Entorno Críticas
```env
APP_NAME=MiKiwi
APP_ENV=production
APP_DEBUG=false
APP_URL=https://mikiwi.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=mikiwi
DB_USERNAME=root
DB_PASSWORD=

CLOUDINARY_URL=cloudinary://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

STRIPE_KEY=pk_live_...
STRIPE_SECRET=sk_live_...
```

### Checklist Pre-Deployment
- [ ] Ejecutar `npm run build`
- [ ] Ejecutar `php artisan config:cache`
- [ ] Ejecutar `php artisan route:cache`
- [ ] Ejecutar `php artisan view:cache`
- [ ] Configurar queue workers
- [ ] Configurar cron jobs
- [ ] Verificar backups de DB
- [ ] SSL/HTTPS configurado
- [ ] Variables de entorno en servidor

---

## 👥 Equipo y Contribución

### Roles
- **Backend Developer** - Laravel, APIs, base de datos
- **Frontend Developer** - React, UI/UX, Tailwind
- **Full Stack** - Integración completa

### Flujo de Trabajo
1. Crear rama feature desde `dev`
2. Desarrollar y testear localmente
3. Commit con mensajes descriptivos
4. Push y crear Pull Request
5. Code review del equipo
6. Merge a `dev`
7. Testing en staging
8. Merge a `main` para producción

### Convenciones de Commits
```
feat: Nueva funcionalidad
fix: Corrección de bug
refactor: Refactorización de código
docs: Actualización de documentación
test: Añadir o modificar tests
style: Cambios de formato (no afectan lógica)
chore: Tareas de mantenimiento
```

---

## 📚 Documentación Adicional

### Archivos de Documentación
Los siguientes archivos contienen información detallada sobre aspectos específicos del proyecto:

- `docs/AGENTS.md` - Guías para desarrollo con IA
- `docs/ROADMAP.md` - Roadmap de desarrollo backend
- `docs/PilaresProyecto.md` - Principios fundamentales del proyecto
- `docs/README_BACKEND.md` - Guía detallada del backend
- `docs/README_CONTROLADORES.md` - Documentación de controllers
- `docs/CLOUDINARY_SETUP.md` - Configuración de Cloudinary
- `docs/DESIGN_GUIDELINES.md` - Guías de diseño UI/UX
- `docs/FACTORY_STATES_GUIDE.md` - Guía de factories y seeders
- `docs/GUIA_INSTALACION.md` - Guía de instalación
- `docs/INSTRUCCIONES_BD.md` - Instrucciones de base de datos

---

## 🐛 Issues y Mejoras Futuras

### Backlog
- [ ] Implementar sistema de chat en vivo
- [ ] Añadir notificaciones push
- [ ] Exportar configuraciones de muñecas
- [ ] Sistema de cupones y promociones
- [ ] Multi-idioma (i18n)
- [ ] Dark mode
- [ ] PWA (Progressive Web App)
- [ ] Integración con más pasarelas de pago

### Vulnerabilidades Conocidas (En resolución)
Ver `ROADMAP.md` sección "Problemas Críticos" para detalles completos.

---

## 📞 Soporte y Contacto

**Email del equipo:** mikiwi.toys@gmail.com  
**Repository:** GitHub - joangriful/MiKiwi

---

*Última actualización: Febrero 2026*
*Versión del documento: 1.0.0*
