<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    // Evita transacción única para que no se aborte todo el bloque en Postgres.
    public $withinTransaction = false;
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if (! Schema::hasTable('orders')) {
            Schema::create('orders', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->foreignUuid('user_id')->constrained()->restrictOnDelete();
                $table->string('order_number')->unique()->nullable(); // Haremos esto por PHP
                $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending');
                $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
                $table->decimal('total_amount', 10, 2);
                $table->string('payment_method')->nullable();
                $table->text('notes')->nullable();

                $table->json('shipping_address_snapshot'); // CAMBIO: jsonb a json
                $table->json('billing_address_snapshot')->nullable(); // CAMBIO: jsonb a json

                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (! Schema::hasTable('order_items')) {
            Schema::create('order_items', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->foreignUuid('order_id')->constrained()->cascadeOnDelete();
                $table->foreignUuid('product_id')->nullable()->constrained()->nullOnDelete();
                $table->uuid('parent_item_id')->nullable();

                $table->string('product_name_snapshot');
                $table->string('sku_snapshot')->nullable();
                $table->integer('quantity');
                $table->decimal('unit_price', 10, 2);
                $table->timestamps();
            });

            Schema::table('order_items', function (Blueprint $table) {
                $table->foreign('parent_item_id')->references('id')->on('order_items')->cascadeOnDelete();
            });
        } elseif ($driver === 'pgsql') {
            DB::statement(<<<'SQL'
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'order_items_pkey'
    ) THEN
        ALTER TABLE order_items ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);
    END IF;
END$$;
SQL);
        }

        if (Schema::hasTable('order_items') && $driver === 'pgsql') {
            DB::statement(<<<'SQL'
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'order_items_parent_item_id_foreign'
    ) THEN
        ALTER TABLE order_items
        ADD CONSTRAINT order_items_parent_item_id_foreign
        FOREIGN KEY (parent_item_id) REFERENCES order_items(id) ON DELETE CASCADE;
    END IF;
END$$;
SQL);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
