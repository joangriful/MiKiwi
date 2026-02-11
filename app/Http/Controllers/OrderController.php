<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Requests\StoreOrderRequest; // ¡Importante!
use App\Services\OrderService; // ¡Importante!
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // Inyectamos el Servicio
    public function store(StoreOrderRequest $request, OrderService $orderService)
    {
        // 1. Validar (ocurre automáticamente antes de llegar aquí)
        // 2. Ejecutar la lógica de negocio
        
        // No necesitamos try-catch si las excepciones de la Etapa 1 tienen método render()
        $order = $orderService->createOrder(
            $request->user(), 
            $request->validated()
        );

        return response()->json($order, 201);
    }

    public function show(Order $order)
    {
        // Autorizar (Policy creada en Etapa 2)
        $this->authorize('view', $order);

        // Devuelve el pedido con sus items
        return $order->load('items.product');
    }
}
