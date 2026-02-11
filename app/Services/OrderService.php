<?php

namespace App\Services;

use App\Actions\Orders\CreateOrder;
use App\Models\User;

class OrderService
{
    protected $createOrderAction;

    // Inyección de dependencia de la Acción
    public function __construct(CreateOrder $createOrderAction)
    {
        $this->createOrderAction = $createOrderAction;
    }

    public function createOrder(User $user, array $validatedData)
    {
        // Aquí podrías agregar lógica previa, como aplicar cupones de descuento
        
        // Delegamos la tarea pesada a la Acción
        return $this->createOrderAction->handle($user, $validatedData);
    }
}
