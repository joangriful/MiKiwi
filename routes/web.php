<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use App\Services\CloudinaryService;
use Illuminate\Support\Facades\Cache;

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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/product', function () {
    return Inertia::render('ProductPage');
})->name('product');

Route::get('/perfil', function () {
    return Inertia::render('perfil');
});

Route::get('/colecciones', function () {
    return Inertia::render('colecciones');
});

Route::get('/components-manager', function () {
    // Shared Cloudinary Cache Logic
    $views = Cache::remember('doll_parts_cloudinary', 3600, function () {
        $service = new CloudinaryService();
        return $service->listDollParts();
    });

    $settingsController = new App\Http\Controllers\DollSettingsController();
    $defaultSettings = $settingsController->getSettings();

    return Inertia::render('ComponentsManager', [
        'views' => $views,
        'defaultSettings' => $defaultSettings
    ]);
})->name('components.manager');

Route::post('/doll-settings', [App\Http\Controllers\DollSettingsController::class, 'saveSettings'])->name('doll.settings.save');

Route::get('/formulario-reclamaciones', function () {
    return Inertia::render('ClaimsForm');
})->name('claims.form');

Route::get('/politica-privacidad', function () {
    return Inertia::render('PrivacyPolicy');
})->name('privacy.policy');

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

Route::get('/doll_config_test', function () {
    // Cache the Cloudinary response for 1 hour (3600 seconds)
    // to avoid hitting API limits and improve load time.
    $views = Cache::remember('doll_parts_cloudinary', 3600, function () {
        $service = new CloudinaryService();
        return $service->listDollParts();
    });

    $settingsController = new App\Http\Controllers\DollSettingsController();
    $defaultSettings = $settingsController->getSettings();

    return Inertia::render('DollConfigTest', [
        'views' => $views,
        'defaultSettings' => $defaultSettings
    ]);
})->name('doll.config.test');



require __DIR__ . '/auth.php';
