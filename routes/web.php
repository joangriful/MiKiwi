<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 👇 IMPORTAMOS LOS CONTROLADORES DE LA TIENDA
use App\Http\Controllers\ColeccionesController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;

/*
|--------------------------------------------------------------------------
| Rutas Principales
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Tienda (Catálogo, Productos, Categorías)
|--------------------------------------------------------------------------
*/

// Catálogo Principal (Sustituye a la ruta estática anterior)
Route::get('/colecciones', [ColeccionesController::class, 'index'])->name('colecciones');

// Ver Producto Individual (Dinámico usando Slug)
Route::get('/producto/{product}', [ProductController::class, 'show'])->name('products.show');

// Ver Categoría Específica
Route::get('/categoria/{category}', [CategoryController::class, 'show'])->name('categories.show');

/*
|--------------------------------------------------------------------------
| Carrito de Compras
|--------------------------------------------------------------------------
*/
Route::prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('cart.index');
    Route::post('/add', [CartController::class, 'store'])->name('cart.add');
    Route::delete('/remove/{id}', [CartController::class, 'destroy'])->name('cart.remove');
});

/*
|--------------------------------------------------------------------------
| Rutas de Usuario Autenticado
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Perfil visual (si es diferente al de edición)
    Route::get('/perfil', function () {
        return Inertia::render('perfil');
    })->name('perfil.view');
});

/*
|--------------------------------------------------------------------------
| Configurador y Herramientas
|--------------------------------------------------------------------------
*/

Route::get('/components-manager', function () {
    return Inertia::render('ComponentsManager');
})->name('components.manager');

Route::prefix('configurador')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Configurador/Home');
    })->name('configurador.home');

    Route::get('/index', function () {
        return Inertia::render('Configurador/Index');
    })->name('configurador.index');

    Route::get('/collections', function () {
        return Inertia::render('Configurador/Collections');
    })->name('configurador.collections');

    Route::get('/quiz', function () {
        return Inertia::render('Configurador/Quiz');
    })->name('configurador.quiz');

    Route::get('/munecas', function () {
        return Inertia::render('DollConfigurator');
    })->name('configurador.dolls');
});

// Ruta antigua estática (Comentada para que no interfiera, puedes borrarla si ya no usas ProductPage)
// Route::get('/product', function () {
//    return Inertia::render('ProductPage');
// })->name('product');

require __DIR__ . '/auth.php';