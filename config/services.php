<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

    'correos' => [
        'base_url' => env('CORREOS_BASE_URL', 'https://api.correos.es'),
        'client_id' => env('CORREOS_CLIENT_ID'),
        'client_secret' => env('CORREOS_CLIENT_SECRET'),
        'connect_timeout' => (int) env('CORREOS_CONNECT_TIMEOUT', 2),
        'timeout' => (int) env('CORREOS_TIMEOUT', 4),
        'retry_times' => (int) env('CORREOS_RETRY_TIMES', 1),
        'retry_sleep_ms' => (int) env('CORREOS_RETRY_SLEEP_MS', 150),
        'pickup_cache_ttl' => (int) env('CORREOS_PICKUP_CACHE_TTL', 300),
    ],

];
