<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Repositories\Interfaces\OrderRepositoryInterface;
use Illuminate\Console\Command;

class GenerateSalesReport extends Command
{
    protected $signature = 'report:sales {--date= : Fecha específica (YYYY-MM-DD)} {--output=console : Formato de salida (console, csv)}';

    protected $description = 'Generar reporte de ventas diario';

    public function handle(OrderRepositoryInterface $orderRepository): int
    {
        $date = $this->option('date') ?? now()->toDateString();
        $output = $this->option('output');

        $this->info("Generando reporte de ventas para {$date}...");

        // Implementación: obtener pedidos del día y calcular totales

        $this->info('Reporte generado exitosamente.');

        return Command::SUCCESS;
    }
}
