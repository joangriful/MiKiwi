<?php

use App\Http\Controllers\Api\ProductCatalogController;
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
