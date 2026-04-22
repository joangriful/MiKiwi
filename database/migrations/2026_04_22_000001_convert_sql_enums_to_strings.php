<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'pgsql') {
            return;
        }

        $this->convertColumnToString('users', 'role', 50);
        $this->convertColumnToString('products', 'product_type', 50);
        $this->convertColumnToString('orders', 'status', 50);
        $this->convertColumnToString('orders', 'payment_status', 50);
        $this->convertColumnToString('coupons', 'type', 50);
    }

    public function down(): void
    {
        // Intentionally irreversible: converting back to SQL enums in PostgreSQL
        // would recreate rigid database-level types/checks that this phase removes.
    }

    private function convertColumnToString(string $table, string $column, int $length): void
    {
        if (! Schema::hasColumn($table, $column)) {
            return;
        }

        $this->dropColumnCheckConstraints($table, $column);

        DB::statement(sprintf(
            'ALTER TABLE %s ALTER COLUMN %s TYPE varchar(%d) USING %s::varchar',
            $table,
            $column,
            $length,
            $column
        ));
    }

    private function dropColumnCheckConstraints(string $table, string $column): void
    {
        DB::statement(sprintf(<<<'SQL'
DO $$
DECLARE
    constraint_name text;
BEGIN
    FOR constraint_name IN
        SELECT con.conname
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
        WHERE con.contype = 'c'
            AND nsp.nspname = current_schema()
            AND rel.relname = %s
            AND pg_get_constraintdef(con.oid) LIKE %s
    LOOP
        EXECUTE format('ALTER TABLE %%I DROP CONSTRAINT %%I', %s, constraint_name);
    END LOOP;
END$$;
SQL,
            DB::getPdo()->quote($table),
            DB::getPdo()->quote('%'.$column.'%'),
            DB::getPdo()->quote($table)
        ));
    }
};
