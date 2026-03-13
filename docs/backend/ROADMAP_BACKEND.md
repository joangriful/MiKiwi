# Roadmap Técnico Backend

Guía de implementación para la arquitectura de MiKiwi.

## Resumen de Fases
1.  **Infraestructura de Datos** (Factories, Seeders)
2.  **Capa de Persistencia** (Repositories)
3.  **Capa de Servicio** (Business Logic)
4.  **Capa de Presentación** (Controllers)

---

## Detalle de Implementación

### FASE 1: INFRAESTRUCTURA DE DATOS
*Objetivo: Generar un entorno de pruebas robusto y realista.*

#### [ ] CategoryFactory
*   **Propósito**: Generar jerarquías de categorías (padre/hijo).
*   **Requisitos**:
    *   Soportar recursividad (una categoría puede tener un `parent_id`).
    *   Generar `slugs` únicos automáticamente.

#### [ ] ProductFactory
*   **Propósito**: Crear productos base para pruebas.
*   **Requisitos**:
    *   Cubrir tipos: `simple`, `configurable`, `component`.
    *   Generar precios y stock válidos.
    *   Estructura JSON correcta para `images`.

#### [ ] CatalogSeeder
*   **Propósito**: Orquestar la población de la base de datos.
*   **Requisitos**:
    *   Crear categorías principales fijas.
    *   Asignar productos a categorías.
    *   **Crítico**: Poblar la tabla `product_accessories` para probar el configurador.

---

### FASE 2: CAPA DE PERSISTENCIA
*Objetivo: Abstraer consultas SQL/Eloquent de la lógica de negocio.*

#### [ ] ProductRepositoryInteface (Contrato)
*   **Propósito**: Definir qué operaciones de datos son posibles sin exponer cómo se hacen.
*   **Métodos Clave**: `findById`, `getActiveBySlug`, `getAccessories`.

#### [ ] EloquentProductRepository (Implementación)
*   **Propósito**: Ejecutar las consultas reales usando Eloquent.
*   **Requisitos**: Optimizar consultas usando "Eager Loading" para traer relaciones eficientemente.

---

### FASE 3: CAPA DE SERVICIO
*Objetivo: Centralizar la lógica de negocio y reglas del configurador.*

#### [ ] ProductService
*   **Propósito**: Intermediario entre el Controlador y el Repositorio.
*   **Responsabilidades**:
    *   Validar reglas de negocio (ej: "No vender si stock es 0").
    *   Combinar datos de productos con sus accesorios.

---

### FASE 4: CAPA DE PRESENTACIÓN
*Objetivo: Exponer la funcionalidad vía HTTP.*

#### [ ] ProductController
*   **Endpoint**: `GET /products/{slug}`
*   **Acción**: Delegar el slug al Servicio y devolver la respuesta (Inertia/JSON).

#### [ ] Refactorización de Rutas
*   **Acción**: Mover lógica de `routes/web.php` a controladores dedicados.
