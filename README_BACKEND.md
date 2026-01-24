# 🥝 MiKiwi - Documentación del Backend (Estado Actual)

**Fecha:** 23 de Enero, 2026
**Estado:** Backend Inicial Configurado (MySQL + Laravel)

---

## 1. Configuración del Entorno
Hemos migrado la configuración original de PostgreSQL a **MySQL (XAMPP)** para facilitar el desarrollo local en Windows.

* **Base de Datos:** `mikiwi_db`
* **Gestor:** phpMyAdmin / XAMPP
* **Puerto:** 3306
* **Usuario DB:** `root` (sin contraseña)
* **Archivo .env:** Configurado para `DB_CONNECTION=mysql`.

---

## 2. Estructura de Base de Datos (Migraciones)
Se han creado las tablas principales del E-commerce adaptadas a MySQL:

### Tablas Principales
* **`users`:** Usuarios (Admin, Clientes). Usa `UUID` como ID.
* **`products`:** Catálogo híbrido.
    * Soporta tipos: `simple`, `configurable` (para las muñecas), `component`.
    * Columna `images`: Almacena JSON (ej: `["url1", "url2"]`).
* **`categories`:** Categorías jerárquicas (con `parent_id`).
* **`product_accessories`:** Tabla pivote para relacionar componentes (ej: Ojos, Calefacción) con productos padre.
* **`orders` & `order_items`:** Estructura lista para pedidos (con snapshots de precios y direcciones en JSON).

> **Nota:** Se han mantenido las tablas de sistema (`jobs`, `cache`, `failed_jobs`) para uso futuro, aunque de momento no se utilizan activamente.

---

## 3. Modelos y Lógica (Eloquent)
Hemos configurado los Modelos para solucionar el error *"Field 'id' doesn't have a default value"*.

### Solución UUIDs
Como usamos IDs alfanuméricos largos (UUID) en lugar de números autoincrementales, hemos añadido el Trait `HasUuids` a todos los modelos clave:

* `User.php`
* `Product.php`
* `Category.php`
* `UserAddress.php`

### Relaciones Definidas
* **User:** Tiene relación preparada para `addresses`.
* **Product:** Pertenece a `Category`. Castea automáticamente `images` a Array y `base_price` a Decimal.

---

## 4. Datos de Prueba (Seeders)
Hemos creado scripts para poblar la base de datos automáticamente con el comando `db:seed`.

### Archivos Creados:
1.  **`CatalogSeeder`:**
    * Crea categorías: "Muñecas", "Accesorios".
    * Crea producto simple: "Lubricante 100ml" (con stock).
    * Crea producto complejo: "Muñeca Elsa" (sin stock, bajo demanda).
2.  **`UserSeeder`:**
    * Crea Admin y Cliente de prueba.
3.  **`DatabaseSeeder`:**
    * Orquesta la ejecución de los dos anteriores.

### 🔑 Credenciales de Acceso (Local)
| Rol | Email | Contraseña |
| :--- | :--- | :--- |
| **Admin** | `admin@kinky-toys.com` | `password` |
| **Cliente** | `juan@test.com` | `password` |

---

## 5. Comandos Útiles para el Desarrollador

Si la base de datos se corrompe o quieres reiniciar desde cero:

bash
# 1. Borrar todo, volver a crear tablas y rellenar datos
php artisan migrate:fresh --seed

# 2. Si Laravel da error de conexión o "Database not found"
php artisan config:clear

# 3. Si creas un archivo nuevo y VS Code no lo detecta
# (Reiniciar editor o...)
composer dump-autoload

## 6. Siguientes Pasos (Hoja de Ruta)

El Backend está listo a nivel de estructura de datos (Base de datos, Modelos y Seeders). Ahora debemos construir las "vías de comunicación" para que la web funcione.

### 6.1. API de Catálogo (Lectura)
El objetivo es que cualquier visitante pueda ver los productos sin estar logueado.
- [ ] **Controlador:** Crear `ProductController` para gestionar la lógica.
- [ ] **Rutas:** Definir endpoints `GET /api/products` y `GET /api/products/{slug}`.
- [ ] **Prueba:** Verificar que devuelve JSON correctamente en el navegador.

### 6.2. API de Usuarios (Escritura/Seguridad)
El objetivo es que los clientes puedan registrarse y entrar en su cuenta.
- [ ] **Sanctum:** Configurar Laravel Sanctum para seguridad por Tokens.
- [ ] **Auth:** Crear `AuthController` (Login, Register, Logout).
- [ ] **Rutas Protegidas:** Asegurar que solo usuarios logueados puedan ver sus pedidos.

### 6.3. Frontend (React)
Una vez la API funcione, pasaremos al diseño visual.
- [ ] **Setup:** Inicializar proyecto con Vite + React.
- [ ] **Conexión:** Configurar `Axios` para llamar a nuestra API de Laravel.
- [ ] **UI:** Maquetar la Home con la lista de productos real traída de la BBDD.
---

## 7. Informe de Estabilización: Fase 2 (Refactorización del Núcleo)
**Responsable Técnico:** Miguel Sánchez Vázquez
**Fecha:** 24 de Enero, 2026

En esta fase crítica del desarrollo, se ha llevado a cabo una auditoría profunda y posterior corrección del núcleo del backend para alinearlo con los **Pilares del Proyecto** (Enterprise Level Standards).

### 🛠️ Logros Principales

#### ✅ Integridad Referencial y Seguridad (Critical Fixes)
1.  **Sessions Table:** Se corrigió el tipo de dato de `user_id` en la tabla de sesiones (`BigInt` -> `UUID`), solucionando un fallo de diseño que habría impedido el login de cualquier usuario.
2.  **User Factory:** Reparado el generador de usuarios de prueba. Ahora genera correctamente `DNI` y `Fecha de Nacimiento`, permitiendo la ejecución de tests automatizados sin errores de integridad SQL.
3.  **UserAddress Guard:** Se blindó el modelo de direcciones eliminando `user_id` de la lista de asignación masiva (`$fillable`) para prevenir vulnerabilidades de seguridad (Mass Assignment Injection).

#### ✅ Completitud del Modelo de Dominio (Domain Driven Design)
1.  **Modelo `Product`:** Habilitada la relación "Muchos a Muchos" para accesorios, una característica vital para el "Cross-Selling" y la venta de packs configurables.
2.  **Modelo `Category`:** Habilitada la recursividad jerárquica (Padre/Hijo), permitiendo la construcción de menús de navegación multinivel dinámicos.
3.  **Modelos de Pedidos (`Order` & `OrderItem`):** Implementados desde cero. Estos modelos existían en base de datos pero no en código ("Modelos Fantasma"). Ahora incluyen configuración avanzada de Casting para manejar Snapshots de direcciones (JSON) y cálculos decimales precisos.

#### ✅ Limpieza de Código (Clean Code)
1.  **Saneamiento:** Eliminación de directorios duplicados y código muerto (`app/Models 2`, etc.) que generaba ruido técnico y riesgo de conflictos.

### 📊 Estado Final de la Fase 2
El backend ha evolucionado de un prototipo estructural a una **base sólida y consistente**. Los cimientos son ahora seguros y reflejan fielmente la lógica de negocio requerida para una plataforma de e-commerce escalable.
