<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OrderController extends Controller
{
    // Muestra el resumen antes de pagar
    public function create()
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('colecciones');
        }

        // Calculamos total
        $total = array_reduce($cart, fn ($carry, $item) => $carry + ($item['price'] * $item['quantity']), 0);

        return Inertia::render('Checkout/Create', [
            'cart' => $cart,
            'total' => $total,
            'user' => Auth::user(),
        ]);
    }

    // PROCESA LA COMPRA
    public function store(Request $request)
    {
        // 1. Validamos que nos envíen una dirección completa (Objeto/Array)
        $request->validate([
            'shipping_address' => 'required|array', // Ahora esperamos un array, no un string
            'shipping_address.street' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.zip' => 'required|string',
            'payment_method' => 'required|string',
        ]);

        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return back()->with('error', 'El carrito está vacío.');
        }

        try {
            DB::transaction(function () use ($request, $cart) {

                // Recalcular total por seguridad
                $totalAmount = 0;
                foreach ($cart as $item) {
                    $totalAmount += $item['price'] * $item['quantity'];
                }

                // A. Crear la Orden (Usando los campos de Miguel)
                $order = Order::create([
                    'user_id' => Auth::id(),
                    // Generamos un número de orden único
                    'order_number' => 'ORD-'.strtoupper(Str::random(10)),
                    'status' => 'pending',
                    'total_amount' => $totalAmount,
                    'payment_status' => 'pending', // O 'paid' si integras pasarela real
                    'payment_method' => $request->payment_method,
                    // Guardamos la dirección como snapshot (Laravel lo convierte a JSON solo)
                    'shipping_address_snapshot' => $request->shipping_address,
                    'billing_address_snapshot' => $request->shipping_address, // Por defecto usamos la misma
                    'notes' => $request->notes ?? null,
                ]);

                // B. Crear los Items
                foreach ($cart as $details) {
                    // Buscamos el producto real para sacar el SKU si existe
                    $product = Product::find($details['id']);

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        // Snapshots: Guardamos los datos tal cual están hoy
                        'product_name_snapshot' => $product->name,
                        'sku_snapshot' => $product->sku ?? 'SKU-GENERICO', // Asegúrate que tu modelo Product tenga sku
                        'quantity' => $details['quantity'],
                        'unit_price' => $details['price'],
                    ]);

                    // Restar Stock
                    if ($product) {
                        $product->decrement('stock_quantity', $details['quantity']);
                    }
                }

                // C. Vaciar Carrito
                session()->forget('cart');
            });

            return redirect()->route('orders.success')->with('success', '¡Pedido realizado con éxito!');

        } catch (\Exception $e) {
            return back()->with('error', 'Error al procesar: '.$e->getMessage());
        }
    }

    public function success()
    {
        return Inertia::render('Checkout/Success');
    }

    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with('items') // Cargamos los items
            ->latest()
            ->get();

        return Inertia::render('Profile/Orders', [
            'orders' => $orders,
        ]);
    }
}
