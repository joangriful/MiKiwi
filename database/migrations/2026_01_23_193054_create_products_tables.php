<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Evita que Postgres aborte todo el bloque si una sentencia falla;
     * cada CREATE se ejecuta fuera de transacción.
     */
    // Evita que Postgres aborte toda la migración si un create falla.
    public $withinTransaction = false;

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        // Garantiza categorías consistente: crea si falta, o añade PK/FK si existe.
        if (! Schema::hasTable('categories')) {
            Schema::create('categories', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('parent_id')->nullable();
                $table->string('name');
                $table->string('slug')->unique();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });

            Schema::table('categories', function (Blueprint $table) {
                $table->foreign('parent_id')->references('id')->on('categories')->nullOnDelete();
            });
        } elseif ($driver === 'pgsql') {
            // Asegura PK y FK sin romper datos existentes (Postgres).
            DB::statement(<<<'SQL'
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'categories_pkey'
    ) THEN
        ALTER TABLE categories ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'categories_slug_unique'
    ) THEN
        ALTER TABLE categories ADD CONSTRAINT categories_slug_unique UNIQUE (slug);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'categories_parent_id_foreign'
    ) THEN
        ALTER TABLE categories
        ADD CONSTRAINT categories_parent_id_foreign
        FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL;
    END IF;
END$$;
SQL);
        }

        if (! Schema::hasTable('products')) {
            Schema::create('products', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->foreignUuid('category_id')->nullable()->constrained('categories')->nullOnDelete();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('sku')->unique()->nullable();
                $table->text('description')->nullable();
                $table->decimal('base_price', 10, 2);
                $table->boolean('is_active')->default(true);
                $table->integer('stock_quantity')->nullable();
                $table->enum('product_type', ['simple', 'configurable', 'component'])->default('simple');
                $table->boolean('is_adult_only')->default(true);

                $table->string('image_url')->nullable();
                $table->json('images')->nullable(); // CAMBIO: de jsonb a json

                $table->timestamps();
                $table->softDeletes();
            });
        } elseif ($driver === 'pgsql') {
            DB::statement(<<<'SQL'
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_pkey'
    ) THEN
        ALTER TABLE products ADD CONSTRAINT products_pkey PRIMARY KEY (id);
    END IF;
END$$;
SQL);
        }

        if (! Schema::hasTable('product_accessories')) {
            Schema::create('product_accessories', function (Blueprint $table) {
                $table->foreignUuid('parent_product_id')->constrained('products')->cascadeOnDelete();
                $table->foreignUuid('accessory_product_id')->constrained('products')->cascadeOnDelete();
                $table->boolean('is_mandatory')->default(false);
                $table->string('group_name')->nullable();
                $table->timestamps();
                $table->unique(['parent_product_id', 'accessory_product_id'], 'prod_acc_unique'); // Nombre corto para índice
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_accessories');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
