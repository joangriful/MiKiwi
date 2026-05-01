# Guia de Base de Datos Compartida en Supabase

La base ahora vive en Supabase y el proyecto Laravel ya esta configurado para usar PostgreSQL. Esta guia deja el flujo minimo para levantar el esquema sin depender de Railway.

## 1. Variables de entorno

En `.env` debes tener algo equivalente a esto:

```env
DB_CONNECTION=pgsql
DB_HOST=aws-1-eu-central-2.pooler.supabase.com
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=tu_usuario_supabase
DB_PASSWORD=tu_password
DB_SSLMODE=require
```

Si cambias alguna variable, limpia la cache de configuracion:

```bash
php artisan config:clear
php artisan cache:clear
```

## 2. Crear el esquema en Supabase

Tienes dos caminos. Usa solo uno para evitar duplicar tablas.

### Opcion A: Laravel migrations

Es la opcion recomendada si el proyecto va a seguir evolucionando desde Laravel.

```bash
php artisan migrate
```

### Opcion B: SQL manual en Supabase

Solo como referencia historica. No es la fuente de verdad actual del proyecto.

Si quieres crear el esquema manualmente desde Supabase:

1. Abre `docs/legacy/db/BBDD.sql`
2. Copia el contenido
3. Ve a `Supabase -> SQL Editor`
4. Ejecuta el script

Este script ya esta adaptado para Supabase:
- sin `ALTER DATABASE`
- sin `CREATE ROLE`
- sin referencias a `postgresql.conf` o `pg_hba.conf`
- con `pgcrypto` y `gen_random_uuid()`
- con triggers recreables

## 3. Regla importante

No mezcles el SQL manual con `php artisan migrate:fresh` sobre una base compartida si no sabes exactamente que ya existe.

Regla practica:
- si el equipo trabaja con Laravel, usa `php artisan migrate`
- si necesitas contexto historico del SQL manual, revisa `docs/legacy/db/BBDD.sql`
- la fuente de verdad estructural actual esta en `database/database_relational_model.md` y `database/database_entity_relationship_model.md`

## 4. Problemas comunes

- Si conecta pero no ves tablas, el esquema no se ha ejecutado todavia.
- Si Laravel falla por credenciales, revisa `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` y `DB_SSLMODE=require`.
- Si la app sigue leyendo una config vieja, ejecuta `php artisan config:clear`.
- Si ya tenias tablas creadas por migraciones, no vuelvas a correr un SQL alternativo sin revisar conflictos.
