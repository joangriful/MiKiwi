<?php

namespace App\Exceptions;

use Exception;

class InsufficientStockException extends Exception
{
    public function render($request)
    {
        return response()->json([
            'error' => 'No hay suficiente stock para completar este pedido.'
        ], 422); // 422 Unprocessable Entity
    }
}
