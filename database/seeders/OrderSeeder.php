<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\UserAddress;
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

        // Crear 2-4 órdenes por cliente (15-20 órdenes aprox)
        foreach ($customers->take(5) as $customer) {
            $ordersCount = rand(2, 4);

            for ($i = 0; $i < $ordersCount; $i++) {
                // Asegurar que el cliente tenga dirección
                $address = $customer->addresses()->first();
                if (! $address) {
                    $address = UserAddress::factory()->for($customer)->default()->create();
                }

                // Determinar estado de la orden con distribución realista
                $statusData = $this->getRandomStatus();

                // Crear orden
                $order = Order::create([
                    'user_id' => $customer->id,
                    'order_number' => 'ORD-'.now()->subDays(rand(1, 90))->format('Ymd').'-'.strtoupper(substr(md5(rand()), 0, 5)),
                    'status' => $statusData['status'],
                    'payment_status' => $statusData['payment_status'],
                    'total_amount' => 0, // Se calculará después
                    'shipping_address_snapshot' => [
                        'full_name' => $address->full_name,
                        'phone' => $address->phone,
                        'street_address' => $address->street_address,
                        'city' => $address->city,
                        'postal_code' => $address->postal_code,
                        'country' => $address->country,
                    ],
                    'billing_address_snapshot' => [
                        'full_name' => $address->full_name,
                        'phone' => $address->phone,
                        'street_address' => $address->street_address,
                        'city' => $address->city,
                        'postal_code' => $address->postal_code,
                        'country' => $address->country,
                    ],
                ]);

                // Agregar 1-4 items a la orden
                $itemsCount = rand(1, 4);
                $total = 0;

                for ($j = 0; $j < $itemsCount; $j++) {
                    $product = $products->random();
                    if (! $product) {
                        continue;
                    }

                    $quantity = rand(1, 3);
                    $price = $product->base_price;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name_snapshot' => $product->name,
                        'sku_snapshot' => $product->sku,
                        'quantity' => $quantity,
                        'unit_price' => $price,
                    ]);

                    $total += $price * $quantity;
                    $totalItems++;
                }

                // Actualizar total de la orden
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
    private function getRandomStatus(): array
    {
        $rand = rand(1, 100);

        // 50% - Entregadas y pagadas
        if ($rand <= 50) {
            return [
                'status' => OrderStatus::Delivered->value,
                'payment_status' => PaymentStatus::Paid->value,
            ];
        }

        // 70% acumulado - Enviadas y pagadas
        if ($rand <= 70) {
            return [
                'status' => OrderStatus::Shipped->value,
                'payment_status' => PaymentStatus::Paid->value,
            ];
        }

        // 85% acumulado - En proceso y pagadas
        if ($rand <= 85) {
            return [
                'status' => OrderStatus::Processing->value,
                'payment_status' => PaymentStatus::Paid->value,
            ];
        }

        // 95% acumulado - Canceladas
        if ($rand <= 95) {
            return [
                'status' => OrderStatus::Cancelled->value,
                'payment_status' => rand(0, 1) ? PaymentStatus::Paid->value : PaymentStatus::Failed->value,
            ];
        }

        // 5% - Pendientes
        return [
            'status' => OrderStatus::Pending->value,
            'payment_status' => PaymentStatus::Pending->value,
        ];
    }
}
