<?php

use Illuminate\Support\Facades\Http;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$clientId = config('services.correos.client_id');
$clientSecret = config('services.correos.client_secret');
$baseUrl = config('services.correos.base_url', 'https://api.correos.es');

echo "Base URL: $baseUrl\n";

$endpoints = [
    $baseUrl.'/token/v1/accessToken',
    $baseUrl.'/token',
];

foreach ($endpoints as $url) {
    echo "\n--- Testing with Basic Auth: $url ---\n";
    try {
        $res = Http::withBasicAuth($clientId, $clientSecret)
            ->asForm()
            ->post($url, [
                'grant_type' => 'client_credentials',
            ]);

        echo 'Status: '.$res->status()."\n";
        echo 'Body: '.$res->body()."\n";
    } catch (\Exception $e) {
        echo 'Error: '.$e->getMessage()."\n";
    }

    echo "\n--- Testing with Body Params: $url ---\n";
    try {
        $res = Http::asForm()
            ->post($url, [
                'grant_type' => 'client_credentials',
                'client_id' => $clientId,
                'client_secret' => $clientSecret,
            ]);

        echo 'Status: '.$res->status()."\n";
        echo 'Body: '.$res->body()."\n";
    } catch (\Exception $e) {
        echo 'Error: '.$e->getMessage()."\n";
    }
}
