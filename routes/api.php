<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserAddressController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

// 1. RUTAS PÚBLICAS
Route::get('/products', [ProductController::class, 'index']);      
Route::get('/products/{slug}', [ProductController::class, 'show']); 

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 2. RUTAS PROTEGIDAS (Requieren Token)
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);

    // Usuarios
    Route::post('/users/{user}/toggle-admin', [UserController::class, 'toggleAdmin']);

    // Direcciones (CRUD simplificado)
    Route::apiResource('addresses', UserAddressController::class);

    // Pedidos
    // Aplicamos un límite extra estricto para crear pedidos (5 por minuto por IP)
    Route::middleware('throttle:5,1')->post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    
});