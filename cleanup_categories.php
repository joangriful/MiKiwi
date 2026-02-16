<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Category;

// Deactivate all
Category::query()->update(['is_active' => false]);

// Activate core 6
$core = ['Femenino', 'Masculino', 'Parejas', 'Cosmética', 'Sets', 'Cuidado'];
foreach ($core as $name) {
    $cat = Category::where('name', $name)->first();
    if ($cat) {
        $cat->is_active = true;
        $cat->save();
        echo "Activated root: " . $cat->name . "\n";
        
        // Activate children
        foreach ($cat->children as $child) {
            $child->is_active = true;
            $child->save();
            echo "  Activated child: " . $child->name . "\n";
        }
    } else {
        echo "Root NOT FOUND: " . $name . "\n";
    }
}
