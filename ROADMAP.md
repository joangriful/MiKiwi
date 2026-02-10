# 🗺️ MiKiwi Backend Roadmap

**Fecha:** Febrero 2026  
**Proyecto:** MiKiwi E-Commerce Platform  
**Versión:** 1.0.0

---

## 📋 RESUMEN EJECUTIVO

**Estado Actual:** Aplicación Laravel con arquitectura mixta. Patrones implementados en Product/Category pero inconsistencias críticas en Order/UserAddress.

**Archivos Existentes:** 44  
**Archivos Faltantes:** ~57  
**Vulnerabilidades Críticas:** 6  
**Issues de Código:** 30+

**Estimación Total:** 4-5 semanas (2 desarrolladores)

---

## 🚨 PROBLEMAS CRÍTICOS ENCONTRADOS

### 1. Vulnerabilidades de Seguridad (6 críticas)

| # | Problema | Archivo | Línea | Riesgo |
|---|----------|---------|-------|--------|
| 1 | **Privilege Escalation** - Cualquiera puede toggle admin | UserController.php | 17-24 | 🔴 CRÍTICO |
| 2 | **Missing Rate Limiting** - API auth sin throttling | routes/api.php | 21-22 | 🔴 CRÍTICO |
| 3 | **Mass Assignment** - Campo 'role' en $fillable | User.php | 14-23 | 🔴 CRÍTICO |
| 4 | **No CSRF Protection** - Cart operations | routes/web.php | 56-61 | 🔴 CRÍTICO |
| 5 | **Exception Leakage** - Mensajes de error expuestos | Múltiples | - | 🔴 CRÍTICO |
| 6 | **Data Breach** - UserController::index sin auth | UserController.php | 11-15 | 🔴 CRÍTICO |

### 2. Problemas de Arquitectura (8 críticos)

| # | Problema | Archivo | Impacto |
|---|----------|---------|---------|
| 1 | **Business Logic in Controller** - OrderController tiene 69 líneas de lógica | OrderController.php | 42-111 | 🔴 CRÍTICO |
| 2 | **OrderService Not Used** - Método existe pero no se usa | OrderController.php | - | 🔴 CRÍTICO |
| 3 | **No Policies** - Autorización inline en vez de Policies | Múltiples | - | 🔴 CRÍTICO |
| 4 | **Inline Validation** - Validación en controllers | Múltiples | - | 🔴 CRÍTICO |
| 5 | **Direct Model Access** - Eloquent directo en controllers | UserAddressController, etc. | - | 🔴 CRÍTICO |
| 6 | **Mixed Return Types** - JSON + Redirect en CartController | CartController.php | 44-77 | 🔴 CRÍTICO |
| 7 | **No API Resources** - Retorna modelos crudos | Api/Controllers | - | 🔴 CRÍTICO |
| 8 | **No Form Requests** - Solo 2 existen, faltan 6+ | Requests/ | - | 🔴 CRÍTICO |

### 3. Inconsistencias

- **Nomenclatura repositorios:** `ProductRepository` vs `EloquentCategoryRepository` vs `EloquentOrderRepository`
- **Autorización:** Unos usan middleware, otros método privado, otros ninguno
- **Manejo de errores:** Cada controller maneja errores diferente
- **Type hints:** Algunos métodos los tienen, otros no

---

## 📁 ESTRUCTURA OBJETIVO (Target)

```
app/
├── Actions/                          # NUEVO: Single-responsibility actions
│   ├── Orders/
│   │   ├── CreateOrder.php
│   │   └── CancelOrder.php
│   └── Addresses/
│       └── SetDefaultAddress.php
│
├── Console/Commands/                 # NUEVO: Artisan commands
│   ├── CleanupExpiredCarts.php
│   ├── CheckLowStock.php
│   └── GenerateSalesReport.php
│
├── DTOs/                             # NUEVO: Data Transfer Objects
│   ├── ShippingAddressDto.php
│   └── MoneyDto.php
│
├── Enums/                            # EXISTE (2 archivos)
│   ├── ChatSenderType.php
│   └── ChatSessionStatus.php
│
├── Events/                           # NUEVO: Event-driven architecture
│   ├── OrderCreated.php
│   ├── OrderStatusUpdated.php
│   ├── ProductLowStock.php
│   └── UserRegistered.php
│
├── Exceptions/                       # NUEVO: Custom exceptions
│   ├── InsufficientStockException.php
│   ├── CartEmptyException.php
│   ├── ProductNotFoundException.php
│   └── PaymentFailedException.php
│
├── Http/
│   ├── Controllers/
│   │   ├── Api/                      # EXISTE
│   │   │   ├── AuthController.php
│   │   │   └── ProductController.php
│   │   ├── Auth/                     # EXISTE (Breeze)
│   │   ├── CartController.php        # MODIFICAR
│   │   ├── CategoryController.php    # OK
│   │   ├── ColeccionesController.php # OK
│   │   ├── ContentController.php     # MODIFICAR
│   │   ├── Controller.php            # EXISTE
│   │   ├── DollSettingsController.php # MODIFICAR
│   │   ├── OrderController.php       # REFACTORIZAR
│   │   ├── ProductController.php     # OK
│   │   ├── ProfileController.php     # OK
│   │   ├── UserAddressController.php # REFACTORIZAR
│   │   └── UserController.php        # CRÍTICO: Agregar auth
│   │
│   ├── Middleware/                   # EXISTE (2 archivos)
│   │   ├── EnsureUserIsAdmin.php
│   │   └── HandleInertiaRequests.php
│   │
│   ├── Requests/                     # EXPANDIR (2 → 8+)
│   │   ├── Api/
│   │   │   ├── RegisterRequest.php
│   │   │   └── LoginRequest.php
│   │   ├── Auth/
│   │   │   └── LoginRequest.php      # EXISTE
│   │   ├── ProfileUpdateRequest.php  # EXISTE
│   │   ├── StoreAddressRequest.php
│   │   ├── StoreCartRequest.php
│   │   ├── StoreOrderRequest.php
│   │   └── UpdateCartRequest.php
│   │
│   └── Resources/                    # NUEVO (0 → 8)
│       ├── ProductResource.php
│       ├── ProductCollection.php
│       ├── OrderResource.php
│       ├── OrderItemResource.php
│       ├── CategoryResource.php
│       ├── UserResource.php
│       ├── AddressResource.php
│       └── CartResource.php
│
├── Jobs/                             # NUEVO: Queue jobs
│   ├── SendOrderConfirmationEmail.php
│   ├── ProcessPayment.php
│   └── CleanupOldCarts.php
│
├── Listeners/                        # NUEVO: Event listeners
│   ├── SendOrderConfirmation.php
│   ├── UpdateInventory.php
│   └── NotifyAdminOfNewOrder.php
│
├── Mail/                             # NUEVO: Mailables
│   ├── OrderConfirmationMail.php
│   ├── OrderShippedMail.php
│   └── WelcomeMail.php
│
├── Models/                           # EXISTE (10 archivos)
│   ├── Category.php
│   ├── ChatMessage.php
│   ├── ChatSession.php
│   ├── HeroImage.php
│   ├── Order.php                     # MODIFICAR: Agregar user_id a fillable
│   ├── OrderItem.php
│   ├── Product.php
│   ├── Review.php
│   ├── User.php                      # MODIFICAR: Quitar role de fillable
│   └── UserAddress.php
│
├── Notifications/                    # NUEVO
│   ├── OrderCreatedNotification.php
│   └── LowStockNotification.php
│
├── Policies/                         # NUEVO (0 → 5)
│   ├── UserPolicy.php                # CRÍTICO
│   ├── OrderPolicy.php
│   ├── UserAddressPolicy.php
│   ├── ProductPolicy.php
│   └── CategoryPolicy.php
│
├── Providers/
│   └── AppServiceProvider.php        # MODIFICAR: Agregar bindings
│
├── Repositories/
│   ├── Eloquent/
│   │   ├── EloquentCategoryRepository.php
│   │   ├── EloquentOrderRepository.php
│   │   ├── EloquentProductRepository.php    # RENOMBRAR
│   │   └── EloquentUserAddressRepository.php # NUEVO
│   │
│   └── Interfaces/
│       ├── CategoryRepositoryInterface.php
│       ├── OrderRepositoryInterface.php
│       ├── ProductRepositoryInterface.php
│       └── UserAddressRepositoryInterface.php # NUEVO
│
├── Rules/                            # NUEVO: Custom validation
│   ├── ValidProductSlug.php
│   ├── ValidPostalCode.php
│   └── ValidStockQuantity.php
│
├── Services/                         # EXISTE (5 archivos)
│   ├── CartService.php
│   ├── CategoryService.php
│   ├── CloudinaryService.php
│   ├── OrderService.php              # MODIFICAR: Usar en controller
│   └── ProductService.php
│
└── ValueObjects/                     # NUEVO (opcional)
    ├── Money.php
    └── Address.php
```

---

## 📊 ESTADÍSTICAS POR CATEGORÍA

| Categoría | Existentes | Faltantes | Prioridad |
|-----------|-----------|-----------|-----------|
| **Form Requests** | 2 | **6** | 🔴 Crítico |
| **API Resources** | 0 | **8** | 🔴 Crítico |
| **Policies** | 0 | **5** | 🔴 Crítico |
| **Exceptions** | 0 | **4** | 🟠 Alto |
| **Events** | 0 | **4** | 🟠 Alto |
| **Listeners** | 0 | **3** | 🟠 Alto |
| **Jobs** | 0 | **3** | 🟠 Alto |
| **Mail** | 0 | **3** | 🟡 Medio |
| **Notifications** | 0 | **2** | 🟡 Medio |
| **Actions** | 0 | **3** | 🟡 Medio |
| **Console Commands** | 0 | **3** | 🟢 Bajo |
| **Custom Rules** | 0 | **3** | 🟢 Bajo |
| **DTOs** | 0 | **2** | 🟢 Bajo |
| **TOTAL** | **44** | **51** | |

---

## 👥 ASIGNACIÓN DE TAREAS

### **ANGEL (50% - ~26 archivos)**

#### Fase 1: Seguridad Crítica (Semana 1) - 6 archivos
**Prioridad: INMEDIATA**

| # | Archivo | Tipo | Esfuerzo | Descripción |
|---|---------|------|----------|-------------|
| 1 | `Policies/UserPolicy.php` | Crear | 2h | Autorización para usuarios |
| 2 | `Policies/OrderPolicy.php` | Crear | 2h | Autorización para pedidos |
| 3 | `Policies/UserAddressPolicy.php` | Crear | 1.5h | Autorización para direcciones |
| 4 | `UserController.php` | Modificar | 1h | Agregar autorización toggleAdmin |
| 5 | `routes/api.php` | Modificar | 30min | Agregar rate limiting |
| 6 | `Models/User.php` | Modificar | 30min | Quitar role de fillable |

#### Fase 2: Form Requests (Semana 1-2) - 6 archivos

| # | Archivo | Tipo | Esfuerzo | Descripción |
|---|---------|------|----------|-------------|
| 7 | `Requests/StoreOrderRequest.php` | Crear | 1.5h | Validación checkout |
| 8 | `Requests/StoreAddressRequest.php` | Crear | 1h | Validación crear dirección |
| 9 | `Requests/UpdateAddressRequest.php` | Crear | 1h | Validación actualizar dirección |
| 10 | `Requests/Api/RegisterRequest.php` | Crear | 1h | Validación API registro |
| 11 | `Requests/Api/LoginRequest.php` | Crear | 45min | Validación API login |
| 12 | `OrderController.php` | Modificar | 2h | Usar StoreOrderRequest |

#### Fase 3: Refactorización Crítica (Semana 2) - 7 archivos

| # | Archivo | Tipo | Esfuerzo | Descripción |
|---|---------|------|----------|-------------|
| 13 | `Actions/Orders/CreateOrder.php` | Crear | 3h | Extraer lógica de OrderController |
| 14 | `OrderController.php` | Refactorizar | 2h | Usar OrderService/Action |
| 15 | `UserAddressController.php` | Refactorizar | 2h | Usar Policies + Request |
| 16 | `Exceptions/InsufficientStockException.php` | Crear | 30min | Exception stock |
| 17 | `Exceptions/CartEmptyException.php` | Crear | 30min | Exception carrito |
| 18 | `Exceptions/ProductNotFoundException.php` | Crear | 30min | Exception producto |
| 19 | `Services/OrderService.php` | Modificar | 1h | Conectar con controller |

#### Fase 4: Eventos (Semana 3) - 5 archivos

| # | Archivo | Tipo | Esfuerzo | Descripción |
|---|---------|------|----------|-------------|
| 20 | `Events/OrderCreated.php` | Crear | 1h | Evento pedido creado |
| 21 | `Events/OrderStatusUpdated.php` | Crear | 1h | Evento cambio estado |
| 22 | `Listeners/SendOrderConfirmation.php` | Crear | 1.5h | Email confirmación |
| 23 | `Listeners/UpdateInventory.php` | Crear | 1h | Actualizar stock |
| 24 | `Listeners/NotifyAdminOfNewOrder.php` | Crear | 1h | Notificar admin |

#### Fase 5: Comandos (Semana 4) - 2 archivos

| # | Archivo | Tipo | Esfuerzo | Descripción |
|---|---------|------|----------|-------------|
| 25 | `Console/Commands/CleanupExpiredCarts.php` | Crear | 2h | Limpiar carritos |
| 26 | `Console/Commands/CheckLowStock.php` | Crear | 2h | Revisar stock |

**Total Angel: 26 archivos**

---

### **MIGUEL (50% - ~25 archivos)**

#### Fase 1: Infraestructura API (Semana 1) - 5 archivos

| # | Archivo | Tipo | Esfuerzo | Descripción |
|---|---------|------|----------|-------------|
| 1 | `Resources/ProductResource.php` | Crear | 2h | Transformar producto API |
| 2 | `Resources/ProductCollection.php` | Crear | 1h | Colección productos |
| 3 | `Resources/CategoryResource.php` | Crear | 1.5h | Transformar categoría |
| 4 | `Resources/OrderResource.php` | Crear | 2h | Transformar pedido |
| 5 | `Resources/OrderItemResource.php` | Crear | 1h | Transformar item pedido |

#### Fase 2: API Resources (Semana 2) - 6 archivos

| # | Archivo | Tipo | Esfuerzo | Descripción |
|---|---------|------|----------|-------------|
| 6 | `Resources/UserResource.php` | Crear | 1.5h | Transformar usuario |
| 7 | `Resources/AddressResource.php` | Crear | 1h | Transformar dirección |
| 8 | `Resources/CartResource.php` | Crear | 1h | Transformar carrito |
| 9 | `Api/ProductController.php` | Modificar | 1h | Usar Resources |
| 10 | `Api/AuthController.php` | Modificar | 1.5h | Usar Resources + Requests |
| 11 | `CartController.php` | Modificar | 2h | Separar Web/API o refactorizar |

#### Fase 3: Repositorios y Servicios (Semana 2-3) - 5 archivos

| # | Archivo | Tipo | Esfuerzo | Descripción |
|---|---------|------|----------|-------------|
| 12 | `Repositories/EloquentProductRepository.php` | Renombrar | 30min | ProductRepository → EloquentProductRepository |
| 13 | `Repositories/Interfaces/UserAddressRepositoryInterface.php` | Crear | 45min | Interfaz direcciones |
| 14 | `Repositories/EloquentUserAddressRepository.php` | Crear | 2h | Implementación direcciones |
| 15 | `Services/UserAddressService.php` | Crear | 2h | Servicio direcciones |
| 16 | `Providers/AppServiceProvider.php` | Modificar | 30min | Agregar bindings |

#### Fase 4: Policies y Validación (Semana 3) - 4 archivos

| # | Archivo | Tipo | Esfuerzo | Descripción |
|---|---------|------|----------|-------------|
| 17 | `Policies/ProductPolicy.php` | Crear | 1.5h | Autorización productos |
| 18 | `Policies/CategoryPolicy.php` | Crear | 1.5h | Autorización categorías |
| 19 | `Rules/ValidProductSlug.php` | Crear | 1h | Regla validación slug |
| 20 | `Rules/ValidPostalCode.php` | Crear | 1h | Regla validación CP |

#### Fase 5: Comunicaciones (Semana 4) - 5 archivos

| # | Archivo | Tipo | Esfuerzo | Descripción |
|---|---------|------|----------|-------------|
| 21 | `Mail/OrderConfirmationMail.php` | Crear | 2h | Email confirmación pedido |
| 22 | `Mail/OrderShippedMail.php` | Crear | 1.5h | Email pedido enviado |
| 23 | `Jobs/SendOrderConfirmationEmail.php` | Crear | 1.5h | Job async email |
| 24 | `Jobs/ProcessPayment.php` | Crear | 2h | Job procesar pago |
| 25 | `Notifications/OrderCreatedNotification.php` | Crear | 1.5h | Notificación pedido |

**Total Miguel: 25 archivos**

---

## 📅 CRONOGRAMA DETALLADO

### Semana 1: Seguridad y Fundamentos

**Lunes:**
- Angel: UserPolicy + OrderPolicy
- Miguel: ProductResource + ProductCollection

**Martes:**
- Angel: UserAddressPolicy + Modificar UserController
- Miguel: CategoryResource + OrderResource

**Miércoles:**
- Angel: Rate limiting + Quitar role de fillable
- Miguel: OrderItemResource + Api/ProductController

**Jueves:**
- Angel: StoreOrderRequest + StoreAddressRequest
- Miguel: UserResource + AddressResource

**Viernes:**
- Angel: UpdateAddressRequest + Api/RegisterRequest
- Miguel: CartResource + Api/AuthController

### Semana 2: Refactorización y Arquitectura

**Lunes:**
- Angel: CreateOrder Action
- Miguel: Renombrar ProductRepository + UserAddressRepositoryInterface

**Martes:**
- Angel: Refactorizar OrderController
- Miguel: EloquentUserAddressRepository

**Miércoles:**
- Angel: Refactorizar UserAddressController
- Miguel: UserAddressService + AppServiceProvider

**Jueves:**
- Angel: Exceptions (3 archivos)
- Miguel: CartController refactor

**Viernes:**
- Angel: Conectar OrderService
- Miguel: ProductPolicy + CategoryPolicy

### Semana 3: Eventos y Validación

**Lunes:**
- Angel: OrderCreated Event + SendOrderConfirmation Listener
- Miguel: Custom Rules (3 archivos)

**Martes:**
- Angel: OrderStatusUpdated Event + UpdateInventory Listener
- Miguel: OrderConfirmationMail

**Miércoles:**
- Angel: NotifyAdminOfNewOrder Listener
- Miguel: OrderShippedMail

**Jueves:**
- Angel: UserRegistered Event + Welcome Listener
- Miguel: Jobs (SendOrderConfirmationEmail + ProcessPayment)

**Viernes:**
- Angel: ProductLowStock Event + Listener
- Miguel: Notifications

### Semana 4: Polish y Extras

**Lunes-Viernes:**
- Angel: Console Commands
- Miguel: Testing, documentación, revisión

---

## ✅ CRITERIOS DE ACEPTACIÓN

### Por Archivo Creado:
- [ ] Código sigue PSR-12
- [ ] Type hints en todos los métodos
- [ ] `declare(strict_types=1);` al inicio
- [ ] Documentación PHPDoc
- [ ] Tests unitarios (cuando aplica)

### Por Controller Modificado:
- [ ] Usa Form Requests para validación
- [ ] Usa Policies para autorización
- [ ] No tiene lógica de negocio
- [ ] Manejo de errores consistente
- [ ] Type hints completos

### Seguridad:
- [ ] Ningún controller expone datos sin autorización
- [ ] Rate limiting en endpoints sensibles
- [ ] No hay mass assignment vulnerabilities
- [ ] Mensajes de error no filtran información

### Calidad:
- [ ] `./vendor/bin/pint` pasa sin errores
- [ ] `php artisan test` pasa
- [ ] No hay código duplicado
- [ ] Nombres descriptivos

---

## 🎯 METAS SEMANALES

### Semana 1 Meta:
**"La aplicación es segura"**
- ✅ No hay vulnerabilidades críticas
- ✅ Rate limiting implementado
- ✅ Autorización funcionando

### Semana 2 Meta:
**"Arquitectura consistente"**
- ✅ Todos los controllers usan Requests
- ✅ Repository pattern completo
- ✅ Servicios conectados

### Semana 3 Meta:
**"Event-driven funcionando"**
- ✅ Eventos disparándose correctamente
- ✅ Listeners procesando
- ✅ Emails enviándose

### Semana 4 Meta:
**"Production ready"**
- ✅ Tests pasando
- ✅ Documentación completa
- ✅ Código limpio y mantenible

---

## 📝 NOTAS IMPORTANTES

### Para Angel:
- Priorizar seguridad CRÍTICA primero
- UserController::toggleAdmin es la vulnerabilidad más grave
- Los Form Requests deben incluir `authorize()` method
- Al crear Actions, mantenerlos simples (Single Responsibility)

### Para Miguel:
- Los API Resources deben filtrar datos sensibles (no exponer tokens, etc.)
- Al renombrar ProductRepository, actualizar todos los imports
- Los Jobs deben implementar `ShouldQueue`
- Probar que los emails funcionan en local con Mailtrap

### Comunicación:
- Revisar código mutuamente cada 2 días
- Usar PRs pequeños (1-2 archivos por PR)
- Documentar decisiones técnicas en Notion
- Si un archivo toma más del tiempo estimado, comunicar inmediatamente

### Dependencias:
1. Angel necesita que Miguel termine Resources para poder probar Events
2. Miguel necesita que Angel termine Requests para refactorizar Controllers
3. Ambos pueden trabajar independientemente en Semana 1

---

## 🚀 COMANDOS ÚTILES

```bash
# Crear archivos Laravel
php artisan make:policy UserPolicy --model=User
php artisan make:request StoreOrderRequest
php artisan make:resource ProductResource
php artisan make:event OrderCreated
php artisan make:listener SendOrderConfirmation --event=OrderCreated
php artisan make:job SendOrderConfirmationEmail
php artisan make:mail OrderConfirmation --markdown=emails.orders.confirmation
php artisan make:command CleanupExpiredCarts

# Formatear código
./vendor/bin/pint

# Ejecutar tests
php artisan test

# Ver rutas
php artisan route:list

# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

---

## 📞 CONTACTO Y SOPORTE

**Dudas sobre arquitectura:** @architect  
**Dudas sobre backend:** @backend  
**Dudas sobre seguridad:** @audit

**Reuniones:** Daily standup 9:00 AM  
**Review:** Viernes 4:00 PM

---

**Fecha de inicio propuesta:** [Fecha]  
**Fecha de finalización estimada:** [Fecha + 4 semanas]

**Aprobado por:** _________________  
**Fecha de aprobación:** _________________
