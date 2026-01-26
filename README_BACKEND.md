# MiKiwi - Documentación del Backend (Estado Actual)

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

### Credenciales de Acceso (Local)
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