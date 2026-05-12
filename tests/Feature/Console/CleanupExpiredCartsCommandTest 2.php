<?php

declare(strict_types=1);

namespace Tests\Feature\Console;

use Tests\TestCase;

class CleanupExpiredCartsCommandTest extends TestCase
{
    public function test_command_outputs_success_message(): void
    {
        $this->artisan('carts:cleanup')
            ->expectsOutput('Limpiando carritos expirados...')
            ->expectsOutput('Carritos expirados limpiados exitosamente.')
            ->assertSuccessful();
    }
}
