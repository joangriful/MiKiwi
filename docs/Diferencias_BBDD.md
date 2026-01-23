# Comparativa de Arquitectura de Base de Datos
## Original (Enterprise Genérico) vs. Refactorizada (Nicho Adulto + Laravel)

Este documento detalla la evolución del esquema de base de datos desde una propuesta genérica de alto nivel hacia una solución optimizada para un E-Commerce de Juguetes Eróticos y Muñecas Personalizables construido con **Laravel 10+, React y Tailwind**.

---

### 1. Resumen de Cambios Estructurales

| Característica | BBDD Original (Enterprise) | BBDD Refactorizada (Tu Proyecto) |
| :--- | :--- | :--- |
| **Enfoque** | SQL-Heavy (Mucha lógica en triggers/funciones). | **Laravel-Native** (Lógica en código, Seguridad en BBDD). |
| **Complejidad** | Alta (Particionamiento, Vistas Materializadas). | **Media/Baja** (Estructura limpia, fácil de migrar). |
| **Usuarios** | Permitía invitados (Guest Checkout). Verificación de edad como un simple *checkbox*. | **Estricta +18**. DNI y Fecha de Nacimiento obligatorios. Sin Invitados. |
| **Catálogo** | Basado en `product_variants` (Talla/Color). Rígido. | Basado en **Componentes/Accesorios**. Flexible para personalización. |
| **Stock** | Estricto (Decrementa siempre). | **Híbrido**. (Stock físico o Bajo Demanda/NULL). |
| **Soporte** | Sistema de Tickets completo (tipo Zendesk). | **Chatbot Friendly**. Sesiones de chat simples. |

---

### 2. Diferencia Crítica: La Lógica de Producto (Muñecas)

El cambio más importante radica en cómo se modelan las muñecas personalizables para que el proveedor entienda el pedido.

#### ❌ Antes: Modelo de Variantes (Rígido)
Utilizaba una tabla `product_variants`. Esto funciona para camisetas (Rojo/XL), pero falla con muñecas porque tendrías que crear una variante para cada combinación matemática posible (millones de combinaciones).
* **Problema:** No podías asignar un SKU específico a "Ojos Verdes" para que el proveedor sepa qué pieza montar.

#### ✅ Ahora: Modelo de Componentes (Bundles)
Se trata a los extras como productos independientes (`product_type = 'component'`).

1.  **Tabla `product_accessories`:** Define qué "Ojos" (Producto B) son compatibles con qué "Muñeca" (Producto A).
2.  **Tabla `order_items` con `parent_item_id`:** En el pedido, se guarda la Muñeca y, vinculadas a ella, las filas de los componentes elegidos.
* **Ventaja:** El proveedor recibe: *"1x Muñeca Elsa (SKU: DOLL-01)"* y vinculado a ella *"1x Calefacción (SKU: HEAT-SYS)"*.

sql
-- Ejemplo del cambio en Order Items
-- Antes: Solo guardaba el ID del producto final.
-- Ahora: Estructura jerárquica en el carrito.
CREATE TABLE order_items (
    ...
    product_id UUID, 
    parent_item_id UUID REFERENCES order_items(id), -- Vincula el extra a la muñeca
    sku_snapshot VARCHAR(100), -- SKU del componente para el proveedor
    ...
)

### 3. Diferencia en Seguridad y Legalidad (+18)

Dado que es una tienda de adultos, la validación no puede ser solo "frontend".

#### ❌ Antes: Verificación Superficial
* Campo `age_verified` (BOOLEAN).
* Cualquiera podía poner `true` enviando el formulario.
* Sin DNI almacenado.

#### ✅ Ahora: Seguridad a Nivel de BBDD (Constraints)
* Se almacenan **DNI** y **Fecha de Nacimiento**.
* Se añade un **Constraint CHECK** en PostgreSQL. Incluso si un bug en Laravel intentara crear un usuario menor de edad, la base de datos rechazaría la inserción.

sql
-- Nueva regla inquebrantable
CONSTRAINT check_is_adult CHECK (birth_date <= (CURRENT_DATE - INTERVAL '18 years'))

### 4. Gestión de Stock e Inventario

#### ❌ Antes: Trigger Genérico
* Al pagar, restaba 1 unidad de `stock_quantity`.
* **Problema:** Rompía la lógica de las muñecas que se fabrican bajo pedido (stock infinito o 0 ficticio).

#### ✅ Ahora: Lógica Híbrida
* El campo `stock_quantity` acepta `NULL`.
* **NULL** = Producto bajo demanda (Muñecas, Extras). No se resta stock.
* **Número** = Producto físico (Consoladores, Lencería). Se resta stock.
* El trigger `reduce_stock_on_paid` fue reescrito para entender esta diferencia.

---

### 5. Limpieza de "Overengineering" (Sobre-ingeniería)

Para un proyecto Laravel/React que está naciendo, la BBDD original tenía elementos innecesarios que complicaban el desarrollo:

1.  **Eliminado Particionamiento (`audit_logs`):** No necesitas dividir tablas por años hasta tener millones de registros. Laravel maneja logs mejor con paquetes como Spatie Activitylog.
2.  **Eliminadas Vistas Materializadas:** Complejas de mantener. Se sustituyen por cache de Laravel o consultas directas optimizadas con índices.
3.  **Eliminada Tabla `suppliers` compleja:** Si el proveedor recibe los pedidos por email/sistema externo, no hace falta replicar su base de datos fiscal en la tuya por ahora.

---

### Conclusión

La **BBDD Refactorizada** está diseñada para ser consumida fácilmente por los modelos de **Eloquent (Laravel)**.

* Usa convenciones de nombres estándar (`user_id`, `product_id`).
* Delega la lógica de negocio compleja (validaciones de formularios, cobros) a Laravel.
* Mantiene la integridad de datos crítica (Foreign Keys y Constraints legales) en PostgreSQL.