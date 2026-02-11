<?php

namespace App\Exceptions;

use Exception;

class ProductNotFoundException extends Exception
{
    public function render($request)
    {
        return response()->json([
            'error' => 'El producto solicitado no existe.'
        ], 404); // 404 Not Found
    }
}
