<?php

use App\Models\Coupon;
use Carbon\Carbon;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$coupon = Coupon::where('code', 'PROMO100')->first();

if ($coupon) {
    echo "Coupon found:\n";
    echo "Code: " . $coupon->code . "\n";
    echo "Active: " . ($coupon->is_active ? 'Yes' : 'No') . "\n";
    echo "Expires: " . $coupon->expires_at . "\n";
    echo "Current Time: " . Carbon::now() . "\n";
    echo "Is Valid: " . ($coupon->isValid() ? 'Yes' : 'No') . "\n";
} else {
    echo "Coupon PROMO100 NOT found.\n";
}
