<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach ($this->stringEnumColumns() as $definition) {
            $this->convertColumnToString(...$definition);
        }
    }

    public function down(): void
    {
        // Intentionally irreversible: the application validates these values in PHP.
    }

    private function convertColumnToString(string $table, string $column, int $length, ?string $default = null): void
    {
        if (! Schema::hasColumn($table, $column)) {
            return;
        }

        match (Schema::getConnection()->getDriverName()) {
            'pgsql' => $this->convertPostgresColumnToString($table, $column, $length),
            'mysql' => $this->convertMysqlColumnToString($table, $column, $length, $default),
            default => null,
        };
    }

    private function convertPostgresColumnToString(string $table, string $column, int $length): void
    {
        $this->dropPostgresColumnCheckConstraints($table, $column);

        DB::statement(sprintf(
            'ALTER TABLE %s ALTER COLUMN %s TYPE varchar(%d) USING %s::varchar',
            $this->quotePostgresIdentifier($table),
            $this->quotePostgresIdentifier($column),
            $length,
            $this->quotePostgresIdentifier($column)
        ));
    }

    private function convertMysqlColumnToString(string $table, string $column, int $length, ?string $default): void
    {
        $defaultSql = $default === null ? '' : ' DEFAULT '.DB::getPdo()->quote($default);

        DB::statement(sprintf(
            'ALTER TABLE `%s` MODIFY `%s` varchar(%d) NOT NULL%s',
            str_replace('`', '``', $table),
            str_replace('`', '``', $column),
            $length,
            $defaultSql
        ));
    }

    private function dropPostgresColumnCheckConstraints(string $table, string $column): void
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

    private function quotePostgresIdentifier(string $identifier): string
    {
        return '"'.str_replace('"', '""', $identifier).'"';
    }

    private function stringEnumColumns(): array
    {
        return [
            ['users', 'role', 50, 'customer'],
            ['products', 'product_type', 50, 'simple'],
            ['orders', 'status', 50, 'pending'],
            ['orders', 'payment_status', 50, 'pending'],
            ['coupons', 'type', 50, null],
        ];
    }
};
