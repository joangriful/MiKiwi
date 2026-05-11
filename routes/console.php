<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Ejecutar limpieza todos los días a las 3 AM
Schedule::command('carts:cleanup')->dailyAt('03:00');

// Revisar el stock cada mañana a las 8 AM
Schedule::command('stock:check')->dailyAt('08:00');
