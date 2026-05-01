<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * OrderSeeder - Crea órdenes históricas con distribución realista de estados
 *
 * Genera 15-20 órdenes con diferentes estados para simular histórico de ventas.
 * Distribución: 50% entregadas, 20% enviadas, 15% procesando, 10% canceladas, 5% pendientes
 */
class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener clientes (customers)
        $customers = User::where('role', UserRole::Customer->value)->get();

        if ($customers->isEmpty()) {
            $this->command->warn('⚠️  No hay clientes. Creando 5 clientes de prueba...');
            $customers = User::factory()->count(5)->create(['role' => UserRole::Customer->value]);
        }

        $totalOrders = 0;
        $totalItems = 0;

        // Cargar todos los productos una vez para evitar N+1 queries
        $products = Product::all();
        if ($products->isEmpty()) {
            $this->command->error('❌ No hay productos. Ejecuta ProductSeeder primero.');

            return;
        }

        // Crear 3 órdenes determinísticas por cliente.
        foreach ($customers->take(5)->values() as $customerIndex => $customer) {
            $ordersCount = 3;

            for ($i = 0; $i < $ordersCount; $i++) {
                // Asegurar que el cliente tenga dirección
                $address = $customer->addresses()->first();
                if (! $address) {
                    $address = Address::query()->create([
                        'user_id' => $customer->getKey(),
                        'alias' => 'shipping',
                        'full_name' => $customer->getAttribute('name'),
                        'phone' => null,
                        'street_address' => 'Calle Principal 1',
                        'city' => 'Madrid',
                        'postal_code' => '28001',
                        'country' => 'España',
                        'is_default' => true,
                    ]);
                }

                // Determinar estado de la orden con distribución realista
                $statusData = $this->getSeededStatus($customerIndex + $i);
                $orderNumber = sprintf('SEED-ORD-%s-%02d', substr(sha1((string) $customer->getKey()), 0, 10), $i + 1);

                $order = Order::updateOrCreate([
                    'order_number' => $orderNumber,
                ], [
                    'user_id' => $customer->getKey(),
                    'shipping_address_id' => $address->getKey(),
                    'billing_address_id' => $address->getKey(),
                    'status' => $statusData['status'],
                    'payment_status' => $statusData['payment_status'],
                    'total_amount' => 0,
                    'payment_method' => 'stripe',
                ]);

                $total = 0;
                $items = $products
                    ->values()
                    ->slice(($customerIndex + $i) % max(1, $products->count()), 2);

                if ($items->count() < 2) {
                    $items = $items->merge($products->values()->take(2 - $items->count()));
                }

                foreach ($items as $itemIndex => $product) {
                    $quantity = $itemIndex + 1;
                    $price = $product->getAttribute('base_price');

                    OrderItem::updateOrCreate([
                        'order_id' => $order->getKey(),
                        'product_id' => $product->getKey(),
                    ], [
                        'product_name_snapshot' => $product->getAttribute('name'),
                        'sku_snapshot' => $product->getAttribute('sku'),
                        'quantity' => $quantity,
                        'unit_price' => $price,
                    ]);

                    $total += $price * $quantity;
                    $totalItems++;
                }

                $order->update(['total_amount' => $total]);
                $totalOrders++;
            }
        }

        $this->command->info("✅ Órdenes creadas: {$totalOrders} órdenes con {$totalItems} items totales");
        $this->command->info('📊 Distribución: ~50% entregadas, ~20% enviadas, ~15% procesando, ~10% canceladas, ~5% pendientes');
    }

    /**
     * Obtener estado aleatorio con distribución realista
     *
     * @return array{status: string, payment_status: string}
     */
    private function getSeededStatus(int $index): array
    {
        return match ($index % 5) {
            0, 1 => [
                'status' => OrderStatus::Delivered->value,
                'payment_status' => PaymentStatus::Paid->value,
            ],
            2 => [
                'status' => OrderStatus::Shipped->value,
                'payment_status' => PaymentStatus::Paid->value,
            ],
            3 => [
                'status' => OrderStatus::Processing->value,
                'payment_status' => PaymentStatus::Paid->value,
            ],
            4 => [
                'status' => OrderStatus::Cancelled->value,
                'payment_status' => PaymentStatus::Failed->value,
            ],
            default => [
                'status' => OrderStatus::Pending->value,
                'payment_status' => PaymentStatus::Pending->value,
            ],
        };
    }
}
