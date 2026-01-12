# Integridad y Validaciones - Arquitectura Enterprise

## Filosofía de Diseño

> **Principio fundamental de las empresas líderes (Spotify, Stripe, Shopify, etc.):**
> 
> La Base de Datos garantiza la **integridad estructural** (qué datos pueden existir).
> La Aplicación gestiona la **lógica de negocio** (cómo se comportan los datos).

### Distribución de Responsabilidades

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CAPA DE APLICACIÓN                           │
│                           (Laravel)                                 │
├─────────────────────────────────────────────────────────────────────┤
│  • Validación de entrada (Form Requests)                            │
│  • Lógica de negocio (Services)                                     │
│  • Flujos complejos (ordenar + pagar + notificar)                   │
│  • Cálculos derivados (ratings, totales)                            │
│  • Generación de IDs/números secuenciales                           │
│  • Eventos y notificaciones                                         │
│  • Auditoría y logging                                              │
│  • Timestamps (created_at, updated_at)                              │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     CAPA DE BASE DE DATOS                           │
│                        (PostgreSQL)                                 │
├─────────────────────────────────────────────────────────────────────┤
│  • Integridad referencial (Foreign Keys)                            │
│  • Unicidad (UNIQUE constraints)                                    │
│  • Campos obligatorios (NOT NULL)                                   │
│  • Reglas básicas de dominio (CHECK constraints)                    │
│  • Tipos de datos correctos                                         │
│  • Índices para rendimiento                                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Parte 1: Constraints de Base de Datos (Última Línea de Defensa)

### 1.1 Foreign Keys con Reglas ON DELETE/UPDATE

Las Foreign Keys garantizan que no existan registros huérfanos. Las reglas `ON DELETE` definen qué ocurre cuando se elimina el registro padre.

#### Módulo: Usuarios

```sql
-- Datos que dependen del usuario y deben eliminarse con él
ALTER TABLE user_preferences
    ADD CONSTRAINT fk_user_preferences_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE user_addresses
    ADD CONSTRAINT fk_user_addresses_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE user_payment_methods
    ADD CONSTRAINT fk_user_payment_methods_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE carts
    ADD CONSTRAINT fk_carts_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE wishlists
    ADD CONSTRAINT fk_wishlists_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE notifications
    ADD CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE restock_alerts
    ADD CONSTRAINT fk_restock_alerts_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE;
```

```sql
-- Datos históricos que deben preservarse (RESTRICT impide eliminar el usuario)
ALTER TABLE orders
    ADD CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE reviews
    ADD CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE support_tickets
    ADD CONSTRAINT fk_support_tickets_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE ticket_messages
    ADD CONSTRAINT fk_ticket_messages_sender
    FOREIGN KEY (sender_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Auditoría: preservar logs pero permitir que user_id sea NULL si se elimina
ALTER TABLE audit_logs
    ADD CONSTRAINT fk_audit_logs_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE;
```

> [!IMPORTANT]
> **RESTRICT** en pedidos, reviews y tickets significa que para eliminar un usuario, 
> primero debes anonimizar o reasignar estos registros. Esto es **intencional** para 
> mantener la trazabilidad histórica y cumplir con requisitos legales/contables.

---

#### Módulo: Catálogo

```sql
-- Categorías: jerarquía con SET NULL si se elimina el padre
ALTER TABLE categories
    ADD CONSTRAINT fk_categories_parent
    FOREIGN KEY (parent_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Productos: RESTRICT para evitar eliminar categorías/proveedores con productos
ALTER TABLE products
    ADD CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE products
    ADD CONSTRAINT fk_products_supplier
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Variantes: se eliminan con el producto
ALTER TABLE product_variants
    ADD CONSTRAINT fk_product_variants_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE;
```

---

#### Módulo: Carrito

```sql
ALTER TABLE cart_items
    ADD CONSTRAINT fk_cart_items_cart
    FOREIGN KEY (cart_id) REFERENCES carts(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE cart_items
    ADD CONSTRAINT fk_cart_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE cart_items
    ADD CONSTRAINT fk_cart_items_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE wishlists
    ADD CONSTRAINT fk_wishlists_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE;
```

---

#### Módulo: Pedidos

```sql
-- Referencias opcionales: SET NULL si se elimina el registro referenciado
ALTER TABLE orders
    ADD CONSTRAINT fk_orders_coupon
    FOREIGN KEY (coupon_id) REFERENCES coupons(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE orders
    ADD CONSTRAINT fk_orders_payment_method
    FOREIGN KEY (payment_method_id) REFERENCES user_payment_methods(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE orders
    ADD CONSTRAINT fk_orders_shipping_address
    FOREIGN KEY (shipping_address_id) REFERENCES user_addresses(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE orders
    ADD CONSTRAINT fk_orders_billing_address
    FOREIGN KEY (billing_address_id) REFERENCES user_addresses(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Order items: CASCADE con el pedido, RESTRICT con productos
ALTER TABLE order_items
    ADD CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE order_items
    ADD CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE order_items
    ADD CONSTRAINT fk_order_items_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    ON DELETE SET NULL ON UPDATE CASCADE;
```

---

#### Módulo: Reviews y Soporte

```sql
ALTER TABLE reviews
    ADD CONSTRAINT fk_reviews_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE reviews
    ADD CONSTRAINT fk_reviews_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE support_tickets
    ADD CONSTRAINT fk_support_tickets_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE ticket_messages
    ADD CONSTRAINT fk_ticket_messages_ticket
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(id)
    ON DELETE CASCADE ON UPDATE CASCADE;
```

---

#### Módulo: Alertas

```sql
ALTER TABLE restock_alerts
    ADD CONSTRAINT fk_restock_alerts_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE restock_alerts
    ADD CONSTRAINT fk_restock_alerts_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    ON DELETE CASCADE ON UPDATE CASCADE;
```

---

### 1.2 UNIQUE Constraints

Garantizan que no existan duplicados donde no deben existir.

```sql
-- Identificadores únicos globales
ALTER TABLE users ADD CONSTRAINT uk_users_email UNIQUE (email);
ALTER TABLE categories ADD CONSTRAINT uk_categories_slug UNIQUE (slug);
ALTER TABLE suppliers ADD CONSTRAINT uk_suppliers_tax_id UNIQUE (tax_id);
ALTER TABLE products ADD CONSTRAINT uk_products_sku UNIQUE (sku);
ALTER TABLE product_variants ADD CONSTRAINT uk_product_variants_sku UNIQUE (sku);
ALTER TABLE coupons ADD CONSTRAINT uk_coupons_code UNIQUE (code);
ALTER TABLE orders ADD CONSTRAINT uk_orders_order_number UNIQUE (order_number);
ALTER TABLE support_tickets ADD CONSTRAINT uk_support_tickets_ticket_number UNIQUE (ticket_number);

-- Combinaciones únicas (reglas de negocio)
ALTER TABLE user_preferences ADD CONSTRAINT uk_user_preferences_user UNIQUE (user_id);
ALTER TABLE carts ADD CONSTRAINT uk_carts_user UNIQUE (user_id);
ALTER TABLE wishlists ADD CONSTRAINT uk_wishlists_user_product UNIQUE (user_id, product_id);
ALTER TABLE reviews ADD CONSTRAINT uk_reviews_user_product_order UNIQUE (user_id, product_id, order_id);
ALTER TABLE cart_items ADD CONSTRAINT uk_cart_items_cart_product_variant UNIQUE (cart_id, product_id, variant_id);
ALTER TABLE restock_alerts ADD CONSTRAINT uk_restock_alerts_user_product_variant UNIQUE (user_id, product_id, variant_id);
```

---

### 1.3 CHECK Constraints (Validaciones Básicas de Dominio)

Estas son reglas **simples y universales** que siempre deben cumplirse.

```sql
-- Rangos numéricos
ALTER TABLE reviews ADD CONSTRAINT chk_reviews_rating CHECK (rating >= 1 AND rating <= 5);
ALTER TABLE products ADD CONSTRAINT chk_products_base_price_positive CHECK (base_price > 0);
ALTER TABLE products ADD CONSTRAINT chk_products_stock_non_negative CHECK (stock_quantity >= 0);
ALTER TABLE product_variants ADD CONSTRAINT chk_product_variants_stock_non_negative CHECK (stock_quantity >= 0);
ALTER TABLE order_items ADD CONSTRAINT chk_order_items_quantity_positive CHECK (quantity > 0);
ALTER TABLE order_items ADD CONSTRAINT chk_order_items_unit_price_positive CHECK (unit_price_at_purchase > 0);
ALTER TABLE cart_items ADD CONSTRAINT chk_cart_items_quantity_positive CHECK (quantity > 0);
ALTER TABLE orders ADD CONSTRAINT chk_orders_total_non_negative CHECK (total_amount >= 0);
ALTER TABLE coupons ADD CONSTRAINT chk_coupons_discount_value_positive CHECK (discount_value > 0);
ALTER TABLE coupons ADD CONSTRAINT chk_coupons_percentage_max CHECK (discount_type != 'percentage' OR discount_value <= 100);

-- ENUMs (valores permitidos)
ALTER TABLE users ADD CONSTRAINT chk_users_role CHECK (role IN ('customer', 'admin', 'support'));
ALTER TABLE user_addresses ADD CONSTRAINT chk_user_addresses_type CHECK (address_type IN ('shipping', 'billing'));
ALTER TABLE orders ADD CONSTRAINT chk_orders_status CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'));
ALTER TABLE orders ADD CONSTRAINT chk_orders_payment_status CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));
ALTER TABLE coupons ADD CONSTRAINT chk_coupons_discount_type CHECK (discount_type IN ('percentage', 'fixed'));
ALTER TABLE support_tickets ADD CONSTRAINT chk_support_tickets_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
ALTER TABLE support_tickets ADD CONSTRAINT chk_support_tickets_status CHECK (status IN ('open', 'in_progress', 'resolved', 'closed'));
ALTER TABLE support_tickets ADD CONSTRAINT chk_support_tickets_category CHECK (category IN ('product', 'shipping', 'payment', 'other'));
ALTER TABLE notifications ADD CONSTRAINT chk_notifications_type CHECK (type IN ('order_status', 'restock', 'promotion', 'review'));
ALTER TABLE audit_logs ADD CONSTRAINT chk_audit_logs_action CHECK (action IN ('create', 'update', 'delete'));

-- Coherencia de fechas
ALTER TABLE coupons ADD CONSTRAINT chk_coupons_dates CHECK (valid_from < valid_until OR valid_from IS NULL OR valid_until IS NULL);
ALTER TABLE promotions ADD CONSTRAINT chk_promotions_dates CHECK (valid_from < valid_until OR valid_from IS NULL OR valid_until IS NULL);
```

---

### 1.4 Índices para Rendimiento

```sql
-- Búsquedas frecuentes
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_category ON products(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_sku ON products(sku) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_featured ON products(is_featured, avg_rating DESC) WHERE deleted_at IS NULL AND is_featured = TRUE;
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status, created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_reviews_product ON reviews(product_id, is_approved) WHERE deleted_at IS NULL;
CREATE INDEX idx_support_tickets_user_status ON support_tickets(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_categories_parent ON categories(parent_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name, created_at DESC);
```

---

## Parte 2: Lógica de Aplicación en Laravel

> [!NOTE]
> Todo lo que sigue se implementa en Laravel, no en la base de datos.
> Esto permite mayor control, mejor testing y código más mantenible.

### 2.1 Estructura de Carpetas Recomendada

```
app/
├── Http/
│   ├── Controllers/
│   └── Requests/           # Validaciones de entrada
│       ├── Order/
│       │   ├── StoreOrderRequest.php
│       │   └── UpdateOrderRequest.php
│       ├── Product/
│       └── Review/
├── Models/                 # Eloquent Models
├── Services/               # Lógica de negocio
│   ├── Order/
│   │   ├── OrderService.php
│   │   ├── OrderNumberGenerator.php
│   │   └── StockManager.php
│   ├── Payment/
│   ├── Product/
│   │   └── RatingCalculator.php
│   └── Coupon/
│       └── CouponValidator.php
├── Observers/              # Hooks de modelo
│   ├── OrderObserver.php
│   ├── ReviewObserver.php
│   └── UserObserver.php
├── Events/                 # Eventos del dominio
│   ├── OrderPaid.php
│   ├── OrderCancelled.php
│   └── ProductReviewed.php
├── Listeners/              # Manejadores de eventos
│   ├── DecrementStock.php
│   ├── RestoreStock.php
│   ├── UpdateProductRating.php
│   └── SendOrderNotification.php
└── Exceptions/             # Excepciones personalizadas
    ├── InsufficientStockException.php
    └── InvalidCouponException.php
```

---

### 2.2 Generación de Números de Pedido

```php
// app/Services/Order/OrderNumberGenerator.php

namespace App\Services\Order;

use App\Models\Order;
use Illuminate\Support\Facades\DB;

class OrderNumberGenerator
{
    /**
     * Genera un número de pedido único: MK-2026-00001
     */
    public function generate(): string
    {
        $year = now()->year;
        $prefix = "MK-{$year}-";
        
        // Obtener el último número del año actual con bloqueo
        $lastOrder = Order::where('order_number', 'like', "{$prefix}%")
            ->lockForUpdate()
            ->orderByDesc('order_number')
            ->first();
        
        if ($lastOrder) {
            $lastNumber = (int) substr($lastOrder->order_number, -5);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }
        
        return $prefix . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }
}
```

```php
// app/Services/Order/TicketNumberGenerator.php

namespace App\Services\Order;

use App\Models\SupportTicket;

class TicketNumberGenerator
{
    public function generate(): string
    {
        $lastTicket = SupportTicket::orderByDesc('ticket_number')
            ->lockForUpdate()
            ->first();
        
        if ($lastTicket) {
            $lastNumber = (int) substr($lastTicket->ticket_number, 3);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }
        
        return 'TK-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }
}
```

---

### 2.3 Gestión de Stock

```php
// app/Services/Order/StockManager.php

namespace App\Services\Order;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Exceptions\InsufficientStockException;
use Illuminate\Support\Facades\DB;

class StockManager
{
    /**
     * Valida que hay stock suficiente para todos los items del pedido
     * 
     * @throws InsufficientStockException
     */
    public function validateStock(Order $order): void
    {
        foreach ($order->items as $item) {
            $available = $item->variant_id 
                ? $item->variant->stock_quantity 
                : $item->product->stock_quantity;
            
            if ($available < $item->quantity) {
                throw new InsufficientStockException(
                    "Stock insuficiente para {$item->product->name}. " .
                    "Disponible: {$available}, Solicitado: {$item->quantity}"
                );
            }
        }
    }
    
    /**
     * Decrementa el stock cuando un pedido es pagado
     */
    public function decrementForOrder(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                if ($item->variant_id) {
                    ProductVariant::where('id', $item->variant_id)
                        ->decrement('stock_quantity', $item->quantity);
                } else {
                    Product::where('id', $item->product_id)
                        ->update([
                            'stock_quantity' => DB::raw("stock_quantity - {$item->quantity}"),
                            'sales_count' => DB::raw("COALESCE(sales_count, 0) + {$item->quantity}"),
                        ]);
                }
            }
        });
    }
    
    /**
     * Restaura el stock cuando un pedido es cancelado o reembolsado
     */
    public function restoreForOrder(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                if ($item->variant_id) {
                    ProductVariant::where('id', $item->variant_id)
                        ->increment('stock_quantity', $item->quantity);
                } else {
                    Product::where('id', $item->product_id)
                        ->update([
                            'stock_quantity' => DB::raw("stock_quantity + {$item->quantity}"),
                            'sales_count' => DB::raw("GREATEST(COALESCE(sales_count, 0) - {$item->quantity}, 0)"),
                        ]);
                }
            }
        });
    }
}
```

---

### 2.4 Servicio Principal de Pedidos

```php
// app/Services/Order/OrderService.php

namespace App\Services\Order;

use App\Models\Order;
use App\Models\User;
use App\Events\OrderPaid;
use App\Events\OrderCancelled;
use App\Exceptions\InsufficientStockException;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function __construct(
        private OrderNumberGenerator $numberGenerator,
        private StockManager $stockManager,
        private CouponValidator $couponValidator,
    ) {}
    
    /**
     * Crea un nuevo pedido desde el carrito del usuario
     */
    public function createFromCart(User $user, array $data): Order
    {
        return DB::transaction(function () use ($user, $data) {
            // Validar cupón si existe
            if (isset($data['coupon_code'])) {
                $coupon = $this->couponValidator->validate(
                    $data['coupon_code'], 
                    $data['subtotal']
                );
            }
            
            // Crear pedido
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => $this->numberGenerator->generate(),
                'status' => 'pending',
                'payment_status' => 'pending',
                'coupon_id' => $coupon->id ?? null,
                'subtotal_amount' => $data['subtotal'],
                'discount_amount' => $data['discount'] ?? 0,
                'shipping_cost' => $data['shipping_cost'] ?? 0,
                'tax_amount' => $data['tax'] ?? 0,
                'total_amount' => $data['total'],
                'shipping_address_id' => $data['shipping_address_id'],
                'billing_address_id' => $data['billing_address_id'],
                'payment_method_id' => $data['payment_method_id'],
                'discreet_packaging' => $data['discreet_packaging'] ?? false,
                // Guardar snapshots de direcciones
                'shipping_address_snapshot' => $user->addresses()->find($data['shipping_address_id'])?->toArray(),
                'billing_address_snapshot' => $user->addresses()->find($data['billing_address_id'])?->toArray(),
            ]);
            
            // Crear items desde el carrito
            foreach ($user->cart->items as $cartItem) {
                $order->items()->create([
                    'product_id' => $cartItem->product_id,
                    'variant_id' => $cartItem->variant_id,
                    'quantity' => $cartItem->quantity,
                    'unit_price_at_purchase' => $cartItem->variant?->price ?? $cartItem->product->base_price,
                    'product_name_snapshot' => $cartItem->product->name,
                    'variant_snapshot' => $cartItem->variant?->toArray(),
                ]);
            }
            
            // Validar stock
            $this->stockManager->validateStock($order);
            
            // Limpiar carrito
            $user->cart->items()->delete();
            
            return $order;
        });
    }
    
    /**
     * Marca un pedido como pagado
     */
    public function markAsPaid(Order $order): Order
    {
        return DB::transaction(function () use ($order) {
            // Validar stock antes de confirmar
            $this->stockManager->validateStock($order);
            
            // Actualizar estado
            $order->update([
                'payment_status' => 'paid',
                'paid_at' => now(),
            ]);
            
            // Decrementar stock
            $this->stockManager->decrementForOrder($order);
            
            // Incrementar uso de cupón
            if ($order->coupon_id) {
                $order->coupon()->increment('current_uses');
            }
            
            // Disparar evento (para notificaciones, emails, etc.)
            event(new OrderPaid($order));
            
            return $order->fresh();
        });
    }
    
    /**
     * Cancela un pedido
     */
    public function cancel(Order $order, string $reason = null): Order
    {
        return DB::transaction(function () use ($order, $reason) {
            $wasPaid = $order->payment_status === 'paid';
            
            $order->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);
            
            // Restaurar stock si ya estaba pagado
            if ($wasPaid) {
                $this->stockManager->restoreForOrder($order);
            }
            
            // Disparar evento
            event(new OrderCancelled($order, $reason));
            
            return $order->fresh();
        });
    }
    
    /**
     * Actualiza el estado de envío
     */
    public function ship(Order $order, string $carrier, string $trackingNumber): Order
    {
        $order->update([
            'status' => 'shipped',
            'shipped_at' => now(),
            'shipping_carrier' => $carrier,
            'tracking_number' => $trackingNumber,
        ]);
        
        // Aquí podrías disparar un evento OrderShipped
        
        return $order->fresh();
    }
    
    /**
     * Marca como entregado
     */
    public function markAsDelivered(Order $order): Order
    {
        $order->update([
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);
        
        return $order->fresh();
    }
}
```

---

### 2.5 Cálculo de Rating con Observer

```php
// app/Services/Product/RatingCalculator.php

namespace App\Services\Product;

use App\Models\Product;

class RatingCalculator
{
    /**
     * Recalcula el rating promedio de un producto
     */
    public function recalculate(Product $product): void
    {
        $stats = $product->reviews()
            ->where('is_approved', true)
            ->whereNull('deleted_at')
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as review_count')
            ->first();
        
        $product->update([
            'avg_rating' => round($stats->avg_rating, 2),
            'review_count' => $stats->review_count,
        ]);
    }
}
```

```php
// app/Observers/ReviewObserver.php

namespace App\Observers;

use App\Models\Review;
use App\Services\Product\RatingCalculator;

class ReviewObserver
{
    public function __construct(
        private RatingCalculator $calculator
    ) {}
    
    public function created(Review $review): void
    {
        $this->recalculateIfApproved($review);
    }
    
    public function updated(Review $review): void
    {
        // Recalcular si cambió el rating o el estado de aprobación
        if ($review->wasChanged(['rating', 'is_approved', 'deleted_at'])) {
            $this->calculator->recalculate($review->product);
        }
    }
    
    public function deleted(Review $review): void
    {
        $this->calculator->recalculate($review->product);
    }
    
    private function recalculateIfApproved(Review $review): void
    {
        if ($review->is_approved) {
            $this->calculator->recalculate($review->product);
        }
    }
}
```

---

### 2.6 Validador de Cupones

```php
// app/Services/Coupon/CouponValidator.php

namespace App\Services\Coupon;

use App\Models\Coupon;
use App\Exceptions\InvalidCouponException;

class CouponValidator
{
    /**
     * Valida y retorna el cupón si es válido
     * 
     * @throws InvalidCouponException
     */
    public function validate(string $code, float $subtotal): Coupon
    {
        $coupon = Coupon::where('code', $code)->first();
        
        if (!$coupon) {
            throw new InvalidCouponException('El cupón no existe');
        }
        
        if (!$coupon->is_active) {
            throw new InvalidCouponException('El cupón no está activo');
        }
        
        if ($coupon->valid_from && $coupon->valid_from > now()) {
            throw new InvalidCouponException('El cupón aún no es válido');
        }
        
        if ($coupon->valid_until && $coupon->valid_until < now()) {
            throw new InvalidCouponException('El cupón ha expirado');
        }
        
        if ($coupon->max_uses && $coupon->current_uses >= $coupon->max_uses) {
            throw new InvalidCouponException('El cupón ha alcanzado el límite de usos');
        }
        
        if ($coupon->min_purchase_amount && $subtotal < $coupon->min_purchase_amount) {
            throw new InvalidCouponException(
                "El monto mínimo de compra es {$coupon->min_purchase_amount}€"
            );
        }
        
        return $coupon;
    }
    
    /**
     * Calcula el descuento a aplicar
     */
    public function calculateDiscount(Coupon $coupon, float $subtotal): float
    {
        if ($coupon->discount_type === 'percentage') {
            return round($subtotal * ($coupon->discount_value / 100), 2);
        }
        
        return min($coupon->discount_value, $subtotal);
    }
}
```

---

### 2.7 Form Requests (Validación de Entrada)

```php
// app/Http/Requests/Review/StoreReviewRequest.php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    
    public function rules(): array
    {
        return [
            'product_id' => ['required', 'uuid', 'exists:products,id'],
            'order_id' => ['nullable', 'uuid', 'exists:orders,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ];
    }
    
    public function messages(): array
    {
        return [
            'rating.min' => 'La valoración mínima es 1 estrella',
            'rating.max' => 'La valoración máxima es 5 estrellas',
        ];
    }
}
```

```php
// app/Http/Requests/Order/StoreOrderRequest.php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'shipping_address_id' => ['required', 'uuid', 'exists:user_addresses,id'],
            'billing_address_id' => ['required', 'uuid', 'exists:user_addresses,id'],
            'payment_method_id' => ['required', 'uuid', 'exists:user_payment_methods,id'],
            'coupon_code' => ['nullable', 'string', 'max:50'],
            'discreet_packaging' => ['nullable', 'boolean'],
        ];
    }
}
```

---

### 2.8 Eventos y Listeners

```php
// app/Events/OrderPaid.php

namespace App\Events;

use App\Models\Order;

class OrderPaid
{
    public function __construct(
        public Order $order
    ) {}
}
```

```php
// app/Listeners/SendOrderConfirmation.php

namespace App\Listeners;

use App\Events\OrderPaid;
use App\Notifications\OrderConfirmationNotification;

class SendOrderConfirmation
{
    public function handle(OrderPaid $event): void
    {
        $order = $event->order;
        
        // Enviar email de confirmación
        $order->user->notify(new OrderConfirmationNotification($order));
        
        // Crear notificación interna
        $order->user->notifications()->create([
            'type' => 'order_status',
            'title' => 'Pedido confirmado',
            'message' => "Tu pedido {$order->order_number} ha sido confirmado.",
            'data' => ['order_id' => $order->id],
            'is_read' => false,
        ]);
    }
}
```

---

### 2.9 Auditoría con Spatie Activity Log

```bash
composer require spatie/laravel-activitylog
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider"
php artisan migrate
```

```php
// app/Models/Order.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Order extends Model
{
    use LogsActivity;
    
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'payment_status', 'total_amount'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
```

---

### 2.10 Verificación de Compra en Reviews

```php
// app/Services/Review/ReviewService.php

namespace App\Services\Review;

use App\Models\Review;
use App\Models\User;

class ReviewService
{
    public function create(User $user, array $data): Review
    {
        // Verificar si es una compra verificada
        $isVerifiedPurchase = $user->orders()
            ->where('payment_status', 'paid')
            ->whereHas('items', fn($q) => $q->where('product_id', $data['product_id']))
            ->exists();
        
        return Review::create([
            'user_id' => $user->id,
            'product_id' => $data['product_id'],
            'order_id' => $data['order_id'] ?? null,
            'rating' => $data['rating'],
            'comment' => $data['comment'] ?? null,
            'is_verified_purchase' => $isVerifiedPurchase,
            'is_approved' => false, // Requiere moderación
        ]);
    }
}
```

---

## Parte 3: Resumen de Arquitectura

### ¿Qué va en la Base de Datos?

| Tipo | Ejemplos | Razón |
|------|----------|-------|
| **Foreign Keys** | `orders.user_id → users.id` | Integridad referencial |
| **UNIQUE** | `users.email`, `products.sku` | Evitar duplicados |
| **CHECK** | `rating BETWEEN 1 AND 5` | Reglas universales simples |
| **NOT NULL** | Campos obligatorios | Completitud de datos |
| **Índices** | Búsquedas frecuentes | Rendimiento |

### ¿Qué va en Laravel?

| Tipo | Ejemplos | Razón |
|------|----------|-------|
| **Services** | OrderService, StockManager | Lógica de negocio compleja |
| **Observers** | ReviewObserver | Reacciones a cambios de modelo |
| **Events/Listeners** | OrderPaid → SendEmail | Desacoplamiento |
| **Form Requests** | StoreOrderRequest | Validación de entrada |
| **Generators** | OrderNumberGenerator | IDs secuenciales |

---

## Parte 4: Beneficios de esta Arquitectura

1. **Testeable**: Puedes mockear servicios y probar cada componente aisladamente
2. **Mantenible**: La lógica está centralizada y documentada en código PHP
3. **Segura**: La DB bloquea operaciones inválidas como última línea de defensa
4. **Escalable**: Puedes extraer servicios a microservicios fácilmente
5. **Depurable**: Los logs y stack traces son claros y en PHP
6. **Estándar**: Sigue patrones usados por empresas como Shopify, Stripe, etc.

---

## Migración Laravel Completa

```php
// database/migrations/xxxx_add_constraints_to_database.php

// Ejecutar los constraints SQL de la Parte 1 usando DB::statement()
// o usar Blueprint methods donde sea posible
```

> [!TIP]
> Puedes ejecutar los constraints SQL directamente en una migración usando 
> `DB::unprepared($sql)` para cada bloque de constraints.
