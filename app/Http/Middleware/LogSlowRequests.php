<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogSlowRequests
{
    public function handle(Request $request, Closure $next)
    {
        if (! config('app.debug') || ! env('PERF_LOG_SLOW_REQUESTS', true)) {
            return $next($request);
        }

        $startedAt = microtime(true);
        $response = $next($request);
        $elapsedMs = (int) round((microtime(true) - $startedAt) * 1000);
        $threshold = (int) env('PERF_SLOW_REQUEST_MS', 800);

        if ($elapsedMs >= $threshold) {
            Log::warning('Slow request detected', [
                'method' => $request->method(),
                'path' => $request->path(),
                'elapsed_ms' => $elapsedMs,
                'status' => method_exists($response, 'getStatusCode') ? $response->getStatusCode() : null,
            ]);
        }

        return $response;
    }
}
