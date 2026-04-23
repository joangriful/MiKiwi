<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductCatalogController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| RUTAS API (Backend - JSON)
|--------------------------------------------------------------------------
| Laravel añade automáticamente el prefijo "/api" a todo lo que pongas aquí.
*/

// 1. RUTAS PÚBLICAS
// Catálogo de Productos (Usa tu nueva arquitectura: Controller -> Service -> Repo)
Route::get('/products', [ProductCatalogController::class, 'index']);
Route::get('/products/{slug}', [ProductCatalogController::class, 'show']);

// Autenticación con Rate Limiting
Route::middleware('throttle:auth-sensitive')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// 2. RUTAS PROTEGIDAS (Requieren Token)
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
