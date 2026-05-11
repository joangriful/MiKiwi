<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver a la carpeta" /></a>

# Guía de Estados en Factories

Esta guía documenta todos los states (métodos de estado) disponibles en los factories del proyecto MiKiwi.

Los **states** permiten crear variaciones de modelos de forma fácil, legible y reutilizable.

---

## 🎯 ¿Qué son los States?

Los states son métodos en los factories que modifican el estado por defecto de un modelo.

### Ejemplo sin states (❌ menos legible):
```php
User::factory()->create([
    'role' => 'admin',
    'email_verified_at' => now(),
]);
```

### Ejemplo con states (✅ más legible):
```php
User::factory()->admin()->create();
```

---

## 👤 UserFactory States

### `admin()`
Crea un usuario administrador con email verificado.
```php
User::factory()->admin()->create();
```

### `customer()`
Crea un usuario cliente (es el estado por defecto).
```php
User::factory()->customer()->create();
```

### `verified()`
Marca el email como verificado.
```php
User::factory()->verified()->create();
```

### `unverified()`
Marca el email como no verificado.
```php
User::factory()->unverified()->create();
```

### `inactive()`
Marca el usuario como inactivo.
```php
User::factory()->inactive()->create();
```

### Ejemplos Combinados:
```php
// Admin verificado
User::factory()->admin()->verified()->create();

// Cliente inactivo
User::factory()->customer()->inactive()->create();

// Cliente sin verificar
User::factory()->customer()->unverified()->create();
```

---

## 📦 ProductFactory States

### `simple()`
Crea un producto simple (no configurable).
```php
Product::factory()->simple()->create();
```

### `configurable()`
Crea un producto configurable (ej: muñecas personalizables).  
**Precio automático**: 500€ - 3000€
```php
Product::factory()->configurable()->create();
```

### `component()`
Crea un componente (ej: ojos, pelucas).  
**Precio automático**: 20€ - 200€
```php
Product::factory()->component()->create();
```

### `outOfStock()`
Marca el producto sin stock (`stock_quantity = 0`).
```php
Product::factory()->outOfStock()->create();
```

### `inStock()`
Marca el producto con alto stock (50-200 unidades).
```php
Product::factory()->inStock()->create();
```

### `inactive()`
Marca el producto como inactivo.
```php
Product::factory()->inactive()->create();
```

### `onSale()`
Reduce el precio entre 10-50% (simula oferta).
```php
Product::factory()->onSale()->create();
```

### `adultOnly()`
Marca el producto solo para adultos.
```php
Product::factory()->adultOnly()->create();
```

### Ejemplos Combinados:
```php
// Muñeca configurable sin stock
Product::factory()->configurable()->outOfStock()->create();

// Componente en oferta
Product::factory()->component()->onSale()->create();

// Producto simple inactivo
Product::factory()->simple()->inactive()->create();
```

---

## 📂 CategoryFactory States

### `root()`
Crea una categoría raíz (sin padre).
```php
Category::factory()->root()->create();
```

### `child()`
Crea una subcategoría (con padre automático).
```php
Category::factory()->child()->create();
```

### `inactive()`
Marca la categoría como inactiva.
```php
Category::factory()->inactive()->create();
```

### Ejemplos Combinados:
```php
// Categoría raíz activa (default)
Category::factory()->root()->create();

// Subcategoría inactiva
Category::factory()->child()->inactive()->create();
```

---

## ⭐ ReviewFactory States

### `approved()`
Marca la review como aprobada.
```php
Review::factory()->approved()->create();
```

### `pending()`
Marca la review como pendiente de aprobación.
```php
Review::factory()->pending()->create();
```

### `fiveStars()`
Asigna calificación de 5 estrellas.
```php
Review::factory()->fiveStars()->create();
```

### `oneStar()`
Asigna calificación de 1 estrella.
```php
Review::factory()->oneStar()->create();
```

### `withRating(int $rating)`
Asigna una calificación específica (1-5).
```php
Review::factory()->withRating(3)->create();
```

### `withoutComment()`
Crea review solo con rating (sin comentario).
```php
Review::factory()->withoutComment()->create();
```

### Ejemplos Combinados:
```php
// Review aprobada de 5 estrellas
Review::factory()->fiveStars()->approved()->create();

// Review pendiente de 1 estrella sin comentario
Review::factory()->oneStar()->pending()->withoutComment()->create();

// Review de 4 estrellas aprobada
Review::factory()->withRating(4)->approved()->create();
```

---

## 📦 OrderFactory States

### `processing()`
Marca la orden como "en proceso".
```php
Order::factory()->processing()->create();
```

### `shipped()`
Marca la orden como "enviada".
```php
Order::factory()->shipped()->create();
```

### `delivered()`
Marca la orden como "entregada".
```php
Order::factory()->delivered()->create();
```

### `cancelled()`
Marca la orden como "cancelada".
```php
Order::factory()->cancelled()->create();
```

### `paid()`
Marca el pago como completado.
```php
Order::factory()->paid()->create();
```

### `paymentFailed()`
Marca el pago como fallido.
```php
Order::factory()->paymentFailed()->create();
```

### `completed()`
Orden completada (entregada + pagada).
```php
Order::factory()->completed()->create();
```

### Ejemplos Combinados:
```php
// Orden enviada y pagada
Order::factory()->shipped()->paid()->create();

// Orden cancelada con pago fallido
Order::factory()->cancelled()->paymentFailed()->create();

// Orden completada (estado final)
Order::factory()->completed()->create();
```

---

## 📦 OrderItemFactory States

### `forProduct(Product $product)`
Asocia el item a un producto específico.
```php
$product = Product::first();
OrderItem::factory()->forProduct($product)->create();
```

### `forOrder(Order $order)`
Asocia el item a una orden específica.
```php
$order = Order::first();
OrderItem::factory()->forOrder($order)->create();
```

### `withQuantity(int $quantity)`
Define la cantidad del item.
```php
OrderItem::factory()->withQuantity(10)->create();
```

### `deletedProduct()`
Simula item de un producto eliminado (product_id = null).
```php
OrderItem::factory()->deletedProduct()->create();
```

### Ejemplos Combinados:
```php
// Item de 5 unidades de un producto específico
$product = Product::first();
OrderItem::factory()->forProduct($product)->withQuantity(5)->create();

// Item de producto eliminado
OrderItem::factory()->deletedProduct()->withQuantity(2)->create();
```

---

## 💬 ChatSessionFactory States

### `active()`
Sesión de chat activa.
```php
ChatSession::factory()->active()->create();
```

### `closed()`
Sesión de chat cerrada.
```php
ChatSession::factory()->closed()->create();
```

### `guest()`
Sesión de invitado (sin user_id).
```php
ChatSession::factory()->guest()->create();
```

### `forUser(User $user)`
Asocia la sesión a un usuario específico.
```php
$user = User::first();
ChatSession::factory()->forUser($user)->create();
```

### Ejemplos Combinados:
```php
// Sesión activa de un usuario específico
$user = User::first();
ChatSession::factory()->active()->forUser($user)->create();

// Sesión cerrada de invitado
ChatSession::factory()->closed()->guest()->create();
```

---

## 💬 ChatMessageFactory States

### `fromCustomer()`
Mensaje enviado por el cliente.
```php
ChatMessage::factory()->fromCustomer()->create();
```

### `fromAgent()`
Mensaje enviado por el agente de soporte.
```php
ChatMessage::factory()->fromAgent()->create();
```

### `read()`
Marca el mensaje como leído.
```php
ChatMessage::factory()->read()->create();
```

### `unread()`
Marca el mensaje como no leído.
```php
ChatMessage::factory()->unread()->create();
```

### `forSession(ChatSession $session)`
Asocia el mensaje a una sesión específica.
```php
$session = ChatSession::first();
ChatMessage::factory()->forSession($session)->create();
```

### Ejemplos Combinados:
```php
// Mensaje de cliente no leído
ChatMessage::factory()->fromCustomer()->unread()->create();

// Mensaje de agente leído
ChatMessage::factory()->fromAgent()->read()->create();
```

---

## 🎓 Casos de Uso Comunes

### Crear usuario admin con órdenes
```php
$admin = User::factory()->admin()->create();
Order::factory()->count(5)->create(['user_id' => $admin->id]);
```

### Crear producto configurable sin stock
```php
$product = Product::factory()
    ->configurable()
    ->outOfStock()
    ->create();
```

### Crear orden completa con items
```php
$order = Order::factory()->paid()->create();
OrderItem::factory()->count(3)->create(['order_id' => $order->id]);
```

### Crear sesión de chat con mensajes
```php
$session = ChatSession::factory()->active()->create();
ChatMessage::factory()->fromCustomer()->unread()->count(2)->create(['session_id' => $session->id]);
ChatMessage::factory()->fromAgent()->read()->count(2)->create(['session_id' => $session->id]);
```

### Crear producto con reviews
```php
$product = Product::factory()->create();
Review::factory()->fiveStars()->approved()->count(3)->create(['product_id' => $product->id]);
Review::factory()->oneStar()->pending()->count(1)->create(['product_id' => $product->id]);
```

---

## 🧪 Testing con States

### Ejemplo en PHPUnit/Pest:
```php
test('admin can view dashboard', function () {
    $admin = User::factory()->admin()->create();
    
    $this->actingAs($admin)
        ->get('/admin/dashboard')
        ->assertStatus(200);
});

test('out of stock products cannot be ordered', function () {
    $product = Product::factory()->outOfStock()->create();
    
    expect($product->stock_quantity)->toBe(0);
    // ... lógica de test
});

test('approved reviews are visible', function () {
    $review = Review::factory()->fiveStars()->approved()->create();
    
    expect($review->is_approved)->toBeTrue();
    expect($review->rating)->toBe(5);
});
```

---

## 📊 Resumen de States por Factory

| Factory | States Disponibles | Total |
|---------|-------------------|-------|
| **UserFactory** | admin, customer, verified, unverified, inactive | 5 |
| **ProductFactory** | simple, configurable, component, outOfStock, inStock, inactive, onSale, adultOnly | 8 |
| **CategoryFactory** | root, child, inactive | 3 |
| **ReviewFactory** | approved, pending, fiveStars, oneStar, withoutComment, withRating | 6 |
| **OrderFactory** | processing, shipped, delivered, cancelled, paid, paymentFailed, completed | 7 |
| **OrderItemFactory** | forProduct, forOrder, withQuantity, deletedProduct | 4 |
| **ChatSessionFactory** | active, closed, guest, forUser | 4 |
| **ChatMessageFactory** | fromCustomer, fromAgent, read, unread, forSession | 5 |
| **TOTAL** | | **42 states** |

---

## 💡 Mejores Prácticas

1. **Encadena states para casos complejos**:
   ```php
   User::factory()->admin()->verified()->inactive()->create();
   ```

2. **Usa states en seeders para código más limpio**:
   ```php
   // ❌ Antes
   Product::create(['product_type' => 'configurable', 'stock_quantity' => 0]);
   
   // ✅ Después
   Product::factory()->configurable()->outOfStock()->create();
   ```

3. **Combina con `count()` para datos masivos**:
   ```php
   Product::factory()->simple()->count(10)->create();
   ```

4. **Usa states específicos en tests**:
   ```php
   Review::factory()->oneStar()->pending()->create();
   ```

---

## 🚀 Comandos Útiles

### Probar states en Tinker:
```bash
php artisan tinker
```

```php
// Crear usuario admin
User::factory()->admin()->create();

// Crear producto sin stock
Product::factory()->outOfStock()->create();

// Crear orden completa
Order::factory()->completed()->create();

// Ver todos los admins
User::where('role', 'admin')->get();
```

---

**Última actualización**: Febrero 2026  
**Proyecto**: MiKiwi - Sistema de factories y seeders