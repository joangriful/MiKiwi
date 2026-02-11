<?php

namespace App\Actions\Orders;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Events\OrderCreated;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\ProductNotFoundException;
use Illuminate\Support\Facades\DB;

class CreateOrder
{
    public function handle(User $user, array $data)
    {
        // Usamos DB::transaction para que si algo falla (ej. stock), 
        // NO se cree el pedido a medias. Todo o nada.
        return DB::transaction(function () use ($user, $data) {
            
            $totalAmount = 0;
            $orderItems = [];

            // 1. Validar Stock y Calcular Total
            foreach ($data['items'] as $item) {
                $product = Product::find($item['product_id']);

                if (!$product) {
                    throw new ProductNotFoundException();
                }

                if ($product->stock_quantity < $item['quantity']) {
                    throw new InsufficientStockException();
                }

                // Preparamos los datos para guardar después
                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name_snapshot' => $product->name,
                    'sku_snapshot' => $product->sku,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->base_price, // Guardamos el precio al momento de la compra
                ];

                $totalAmount += $product->base_price * $item['quantity'];
            }

            // 2. Crear el Pedido
            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'total_amount' => $totalAmount,
                'shipping_address_id' => $data['shipping_address_id'],
            ]);

            // 3. Guardar los Items
            // Usamos la relación items() definida en el modelo Order
            $order->items()->createMany($orderItems);

            // 4. Disparar el Evento (Esto activa los Listeners de la Etapa 3)
            // - Restar Stock
            // - Enviar Email
            // - Notificar Admin
            OrderCreated::dispatch($order);

            return $order;
        });
    }
}
