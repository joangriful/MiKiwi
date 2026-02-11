<?php

namespace App\Exceptions;

use Exception;

class CartEmptyException extends Exception
{
    public function render($request)
    {
        return response()->json([
            'error' => 'Tu carrito está vacío.'
        ], 400); // 400 Bad Request
    }
}
