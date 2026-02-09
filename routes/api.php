<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
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
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

// Autenticación
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 2. RUTAS PROTEGIDAS (Requieren Token)
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
