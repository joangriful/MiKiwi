# Plan Tecnico - Compatibilidad PostgreSQL

Este plan fija las decisiones tecnicas para revisar vulnerabilidades y regresiones derivadas del cambio de MySQL a PostgreSQL/Supabase.

## Decisiones Cerradas

1. **Busquedas de texto:** usar `ILIKE` encapsulado en un helper/scope compatible con PostgreSQL.
2. **Enums SQL:** migrar progresivamente a `string + validation + constantes/enums PHP`.
3. **Fallback mock de Correos:** permitir mock solo en `local` y `testing`; en produccion usar fallback explicito, pero nunca datos falsos silenciosos.

## Objetivo

Evitar regresiones por diferencias entre MySQL y PostgreSQL en:

- sensibilidad a mayusculas/minusculas en busquedas;
- SQL especifico de MySQL;
- columnas JSON;
- enums SQL;
- UUIDs;
- seeders no idempotentes;
- rendimiento por indices insuficientes.

## Fase 1 - Congelar Reglas PostgreSQL

**Tipo Trello:** BUILD

**Archivos a tocar:**

- `docs/AGENTS.md`
- `docs/DOCUMENTACION_PROYECTO.md`

**Descripcion:**  
Documentar reglas internas para que no vuelvan a entrar patrones incompatibles o fragiles.

**Checklist:**

- [x] Documentar que el stack vigente es PostgreSQL/Supabase.
- [x] Prohibir `after()` en migraciones nuevas.
- [x] Prohibir SQL MySQL-especifico salvo bloque aislado y justificado.
- [x] Definir `ILIKE` encapsulado como norma para busquedas case-insensitive.
- [x] Marcar JSON, enums y UUID como zonas sensibles.
- [x] Anadir checklist de PR para cambios de base de datos.

## Fase 2 - Encapsular Busquedas Case-Insensitive

**Tipo Trello:** REFACTOR

**Decision:**  
Usar `ILIKE` porque el proyecto ya trabaja sobre PostgreSQL. No se usara `LOWER(campo) LIKE LOWER(?)` salvo necesidad puntual de portabilidad.

**Archivos detectados:**

- `app/Http/Controllers/ProductController.php`
- `app/Http/Controllers/PickupPointController.php`
- `database/seeders/ProductSeeder.php`

**Ejemplos actuales:**

```php
$query->where('name', 'like', '%' . $request->search . '%');
```

```php
$query->where('city', 'like', '%' . $request->city . '%');
```

**Implementacion propuesta:**

- Crear helper/scope para `ILIKE`.
- Aplicarlo a busqueda de productos.
- Aplicarlo a busqueda de ciudad en pickup points.
- Mantener busqueda por prefijo de codigo postal de forma compatible.
- Eliminar `LIKE` del seeder de productos.

**Checklist:**

- [x] Crear helper/scope de busqueda case-insensitive.
- [x] Migrar `ProductController`.
- [x] Migrar `PickupPointController`.
- [x] Migrar `ProductSeeder`.
- [x] Anadir tests con mayusculas/minusculas.
- [x] Ejecutar `php artisan test`.

## Fase 3 - Blindar JSON

**Tipo Trello:** REFACTOR

**Decision:**  
Preferir casts Eloquent a `array` y evitar `json_encode/json_decode` manual salvo casos justificados.

**Archivos detectados:**

- `app/Domain/Dolls/Services/DollSettingsService.php`
- `database/seeders/CatalogSeeder.php`
- `database/seeders/LegacyCatalogSeeder.php`
- `app/Models/Product.php`
- `app/Models/Order.php`

**Riesgos actuales:**

- `DollSettingsService` lee/escribe JSON manualmente.
- Seeders guardan `images` con `json_encode`.
- Pedidos guardan snapshots de direccion en JSON.

**Checklist:**

- [ ] Confirmar casts de `Product.images`.
- [ ] Confirmar casts de `Order.shipping_address_snapshot`.
- [ ] Confirmar casts de `Order.billing_address_snapshot`.
- [ ] Evitar `json_encode` en seeders si el modelo castea a array.
- [ ] Valorar modelo/cast dedicado para `doll_settings.value`.
- [ ] Anadir test de guardado/lectura JSON de productos.
- [ ] Anadir test de guardado/lectura JSON de pedidos.
- [ ] Anadir test de configuracion de muñecas.

## Fase 4 - Migrar Enums SQL Progresivamente

**Tipo Trello:** REFACTOR

**Decision:**  
Migrar progresivamente a columnas `string`, validacion en Requests/services y constantes/enums PHP. No hacerlo todo de golpe.

**Enums detectados:**

- `users.role`
- `products.product_type`
- `orders.status`
- `orders.payment_status`
- `coupons.type`

**Prioridad recomendada:**

1. `orders.status`
2. `orders.payment_status`
3. `products.product_type`
4. `coupons.type`
5. `users.role`

**Motivo:**  
Los estados de pedido y pago son los que mas probablemente cambian en un ecommerce: `refunded`, `partially_refunded`, `returned`, `failed`, `on_hold`, etc. En PostgreSQL, evolucionar enums SQL es mas rigido que validar strings desde PHP.

**Checklist:**

- [ ] Crear inventario de valores usados.
- [ ] Crear constantes/enums PHP para estados de pedido.
- [ ] Migrar validaciones a `Rule::in(...)` o enum PHP.
- [ ] Preparar migracion segura de `enum` a `string`.
- [ ] Migrar `orders.status`.
- [ ] Migrar `orders.payment_status`.
- [ ] Repetir para `products.product_type`.
- [ ] Repetir para `coupons.type`.
- [ ] Evaluar `users.role` en una fase posterior.

## Fase 5 - Verificar UUID Extremo A Extremo

**Tipo Trello:** FIX

**Zonas sensibles:**

- `users`
- `products`
- `orders`
- `reviews`
- `chat_sessions`
- `user_addresses`

**Checklist:**

- [ ] Revisar validaciones `uuid`.
- [ ] Revisar `exists:...,id` en Requests y controllers.
- [ ] Revisar factories con relaciones UUID.
- [ ] Revisar seeders con relaciones UUID.
- [ ] Revisar route model binding.
- [ ] Revisar tests que puedan asumir IDs numericos.
- [ ] Anadir tests con UUID reales en flujos criticos.

## Fase 6 - Hacer Seeders Idempotentes

**Tipo Trello:** REFACTOR

**Archivos detectados:**

- `database/seeders/CatalogSeeder.php`
- `database/seeders/LegacyCatalogSeeder.php`
- `database/seeders/CategorySeeder.php`
- `database/seeders/PickupPointSeeder.php`
- `database/seeders/OrderSeeder.php`
- `database/seeders/ReviewSeeder.php`
- `database/seeders/ProductSeeder.php`

**Norma:**  
Usar `firstOrCreate`, `updateOrCreate` o `upsert` con claves unicas claras: `slug`, `sku`, `code`, `email`.

**Checklist:**

- [ ] Sustituir `create()` duplicable en catalogo/categorias.
- [ ] Sustituir `insert()` duplicable en pivots por `upsert`.
- [ ] Evitar busquedas por `LIKE` en seeders.
- [ ] Mantener productos por `slug` o `sku`.
- [ ] Mantener categorias por `slug`.
- [ ] Mantener cupones por `code`.
- [ ] Ejecutar seeders dos veces seguidas en testing.
- [ ] Anadir test de idempotencia para seeders criticos.

## Fase 7 - Limitar Mock De Correos Por Entorno

**Tipo Trello:** BUILD

**Decision:**  
Mock automatico solo en `local` y `testing`. En produccion, mock solo con flag explicito. Si no hay datos reales, devolver respuesta controlada sin inventar puntos de recogida silenciosamente.

**Archivos a tocar:**

- `app/Domain/Shipping/Services/CorreosService.php`
- `app/Http/Controllers/PickupPointController.php`
- `config/services.php`
- `.env.example`

**Implementacion propuesta:**

- Crear config `services.correos.allow_mock_fallback`.
- Leerla desde `CORREOS_ALLOW_MOCK_FALLBACK=false`.
- Permitir mock si `app()->environment(['local', 'testing'])`.
- En produccion, permitir mock solo si el flag esta activado explicitamente.

**Checklist:**

- [ ] Anadir config en `config/services.php`.
- [ ] Anadir variable a `.env.example`.
- [ ] Separar fallback real/local/mock en `PickupPointController`.
- [ ] Evitar mock silencioso en produccion.
- [ ] Anadir test para entorno local/testing.
- [ ] Anadir test para entorno production sin flag.
- [ ] Anadir test para production con flag explicito.

## Fase 8 - Revisar Indices PostgreSQL

**Tipo Trello:** BUILD

**Campos candidatos:**

- `products.slug`
- `products.category_id`
- `products.is_active`
- `products.created_at`
- `categories.slug`
- `categories.parent_id`
- `orders.user_id`
- `orders.order_number`
- `orders.created_at`
- `pickup_points.city`
- `pickup_points.postal_code`

**Checklist:**

- [ ] Auditar indices ya creados por `unique`, `foreignUuid` e `index`.
- [ ] Anadir indices simples donde falten.
- [ ] No crear indices trigram para `ILIKE` hasta medir necesidad real.
- [ ] Valorar `pg_trgm` si busqueda textual se vuelve critica.
- [ ] Validar migraciones en PostgreSQL testing.

## Fase 9 - Tests De Compatibilidad PostgreSQL

**Tipo Trello:** BUILD

**Flujos prioritarios:**

- crear pedido;
- cancelar pedido y restaurar stock;
- crear review;
- filtros de productos/categorias;
- busqueda de pickup points;
- guardado y lectura JSON;
- seeders idempotentes.

**Checklist:**

- [ ] Test crear pedido.
- [ ] Test cancelar pedido y restaurar stock.
- [ ] Test crear review.
- [ ] Test filtros de productos/categorias.
- [ ] Test busqueda de pickup points con mayusculas/minusculas.
- [ ] Test JSON de productos.
- [ ] Test JSON de pedidos.
- [ ] Test JSON de configurador.
- [ ] Test seeders idempotentes criticos.

## Validacion Final

- [ ] `php artisan test`
- [ ] `php artisan migrate:fresh --env=testing`
- [ ] `php artisan db:show --database=pgsql`
- [ ] `npm run build` si se toca algo que afecte Inertia/frontend.
- [ ] Verificar que `.env.testing` apunta a PostgreSQL local, nunca a Supabase remoto.
