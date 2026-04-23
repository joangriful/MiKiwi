<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\JsonResponse;

trait InteractsWithApiErrors
{
    protected function apiError(string $code, string $message, int $status = 500): JsonResponse
    {
        return response()->json([
            'success' => false,
            'code' => $code,
            'message' => $message,
        ], $status);
    }
}
