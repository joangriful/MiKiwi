<?php

declare(strict_types=1);

namespace Tests\Feature\Jobs;

use App\Jobs\CleanupOldCarts;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class CleanupOldCartsTest extends TestCase
{
    public function test_cleanup_job_logs_execution(): void
    {
        Log::shouldReceive('info')
            ->once()
            ->with('Old carts cleanup job executed');

        (new CleanupOldCarts)->handle();
    }
}
