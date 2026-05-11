<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver a la carpeta" /></a>

# Database Connections Guide

## Propósito

Este proyecto usa **dos conexiones PostgreSQL claramente separadas**:

- `MiKiWi`: base de datos **remota** en Supabase para el uso normal de la aplicación
- `MiKiWi-Testing`: base de datos **local** en PostgreSQL para tests automatizados

La idea es simple:

- usar la **base remota** para desarrollo normal y validación manual
- usar la **base local de testing** para `php artisan test`

Así evitamos que los tests toquen datos reales del proyecto.

---

## Mapa de conexiones

### 1. Remote database: `MiKiWi`

Esta conexión se usa para inspeccionar la base de datos real del proyecto en DBeaver.

Casos de uso:

- revisar datos reales en remoto
- comprobar schemas y tablas en Supabase
- validar la app con el `.env` normal
- ejecutar comandos artisan normales sobre el entorno real

Esta conexión debe apuntar al proyecto Supabase configurado en `.env`.

### 2. Local testing database: `MiKiWi-Testing`

Esta conexión se usa solo para testing local en PostgreSQL.

Casos de uso:

- ejecutar `php artisan test`
- ejecutar `php artisan migrate:status --env=testing`
- validar compatibilidad con PostgreSQL en local
- depurar tests fallando sin tocar la base remota

Esta conexión debe apuntar a la base local `mikiwi_testing`.

---

## Separación obligatoria de entornos

### `.env`

Es el entorno normal de la aplicación.

Debe apuntar a la **base remota de Supabase**.

Casos de uso:

- `php artisan serve`
- uso normal de la app
- QA manual contra el entorno real
- comandos artisan **sin** `--env=testing`

### `.env.testing`

Es el entorno de testing.

Debe apuntar a la **base local de PostgreSQL**.

Casos de uso:

- `php artisan test`
- `php artisan migrate:status --env=testing`
- `php artisan migrate:fresh --env=testing`

---

## Regla diaria

Usa esta regla para no confundirte:

- base real remota: `.env`
- base local de testing: `.env.testing`

Y a nivel de comandos:

- `php artisan test` -> base local de testing
- `php artisan migrate:status --env=testing` -> base local de testing
- `php artisan migrate:fresh --env=testing` -> base local de testing
- `php artisan serve` -> base remota real
- `php artisan migrate:status` -> base remota real

Si **no** pasas `--env=testing`, Laravel usa `.env`.

---

## Configuración en DBeaver

## Conexión 1: `MiKiWi`

Crea una conexión PostgreSQL en DBeaver con este nombre claro:

- Connection name: `MiKiWi`
- Purpose: base remota de Supabase

Usa los datos del proyecto Supabase.

Campos recomendados:

- Host: host de Supabase o host del pooler de Supabase
- Port: puerto de Supabase
- Database: `postgres`
- Username: usuario de base de datos de Supabase
- Password: contraseña de base de datos de Supabase

Notas:

- esta es la conexión remota real del proyecto
- no debe usarse para tests automatizados
- si Supabase exige SSL, usar `SSL mode = require`

## Conexión 2: `MiKiWi-Testing`

Crea una segunda conexión PostgreSQL en DBeaver:

- Connection name: `MiKiWi-Testing`
- Purpose: base local de testing

Campos recomendados:

- Host: `127.0.0.1`
- Port: `5432`
- Database: `mikiwi_testing`
- Username: `postgres`
- Password: tu contraseña local de PostgreSQL

Notas:

- esta conexión sirve para inspeccionar la base local de testing
- este es el destino seguro para tests automatizados
- no debe apuntar a Supabase

---

## Configuración en Laravel

## Ejemplo de `.env`

Este archivo debe apuntar a la base remota:

```env
DB_CONNECTION=pgsql
DB_HOST=YOUR_REMOTE_HOST
DB_PORT=YOUR_REMOTE_PORT
DB_DATABASE=postgres
DB_USERNAME=YOUR_REMOTE_USERNAME
DB_PASSWORD="YOUR_REMOTE_PASSWORD"
```

## Ejemplo de `.env.testing`

Este archivo debe apuntar a PostgreSQL local:

```env
APP_ENV=testing

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=mikiwi_testing
DB_USERNAME=postgres
DB_PASSWORD="YOUR_LOCAL_PASSWORD"

SESSION_DRIVER=array
QUEUE_CONNECTION=sync
CACHE_STORE=array
MAIL_MAILER=array
```

Importante:

- `.env.testing` nunca debe apuntar a la base remota real
- no reutilizar credenciales de Supabase en `.env.testing`

---

## Requisito en PHPUnit

`phpunit.xml` **no** debe forzar SQLite si el proyecto quiere testear contra PostgreSQL.

Estas líneas no deben existir:

```xml
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

Si siguen ahí, `php artisan test` ignorará PostgreSQL y correrá sobre SQLite.

---

## Requisitos de PostgreSQL local

Para usar testing local con PostgreSQL, cada miembro del equipo necesita:

1. PostgreSQL instalado en local
2. el servidor local corriendo en `127.0.0.1:5432`
3. una base llamada `mikiwi_testing`
4. la contraseña correcta del usuario `postgres`

Creación recomendada de la base local:

```sql
CREATE DATABASE mikiwi_testing;
```

Para confirmar que existe:

```sql
SELECT datname
FROM pg_database
ORDER BY datname;
```

---

## Comandos de verificación

## Comprobar entorno remoto

Este comando usa `.env`:

```powershell
php artisan migrate:status
```

## Comprobar entorno de testing

Este comando usa `.env.testing`:

```powershell
php artisan migrate:status --env=testing
```

Si lista migraciones como `Ran`, Laravel está conectado correctamente a la base local de testing.

## Ejecutar tests en PostgreSQL local

```powershell
php artisan test
```

Si `.env.testing` está bien configurado y `phpunit.xml` no fuerza SQLite, este comando corre contra PostgreSQL local.

---

## Flujo recomendado para el equipo

### Para desarrollo normal de la app

Usar:

- `.env`
- conexión remota `MiKiWi`

Comandos:

```powershell
php artisan serve
npm run dev
```

### Para tests automatizados

Usar:

- `.env.testing`
- conexión local `MiKiWi-Testing`

Comandos:

```powershell
php artisan migrate:status --env=testing
php artisan test
```

### Para depurar compatibilidad con PostgreSQL

Primero usar siempre la base local de testing.

No conviene depurar incompatibilidades directamente contra la base remota real salvo que haya un motivo muy concreto.

---

## Lo que nunca debe pasar

- nunca apuntar `.env.testing` a la base remota real
- nunca ejecutar `php artisan test` contra la base remota real del proyecto
- nunca asumir que el nombre visible de la conexión en DBeaver cambia el comportamiento de Laravel
- nunca confiar en `php artisan test` si `phpunit.xml` sigue forzando SQLite

La fuente de verdad para el comportamiento de Laravel es:

- `.env`
- `.env.testing`
- `phpunit.xml`

No la interfaz de DBeaver.

---

## Troubleshooting rápido

## Problema: `php artisan test` sigue usando SQLite

Revisar `phpunit.xml` y quitar:

```xml
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

Después ejecutar:

```powershell
php artisan config:clear
```

## Problema: `password authentication failed for user "postgres"`

Eso es un problema local de credenciales de PostgreSQL.

Revisar:

- contraseña local de PostgreSQL
- `.env.testing`
- conexión local `MiKiWi-Testing` en DBeaver

También comprobar que PostgreSQL local está corriendo en:

- host `127.0.0.1`
- port `5432`

## Problema: los tests tardan demasiado

Eso suele indicar que los tests están corriendo contra una base remota en vez de PostgreSQL local o SQLite.

Para este proyecto:

- destino normal y seguro: PostgreSQL local `mikiwi_testing`
- destino lento y arriesgado: Supabase remota

## Problema: `Unknown host` o errores DNS

Eso normalmente afecta a la conexión remota de Supabase, no a la base local de testing.

Usar:

- `MiKiWi` para inspección remota
- `MiKiWi-Testing` para tests automatizados locales

---

## Resumen rápido

- `MiKiWi` = base remota de Supabase
- `MiKiWi-Testing` = base local de PostgreSQL
- `.env` = entorno real remoto
- `.env.testing` = entorno local de testing
- `php artisan test` = base local de testing
- `php artisan migrate:status` = entorno remoto
- `php artisan migrate:status --env=testing` = entorno local de testing

Si todo el equipo mantiene esta separación, los tests quedan aislados, razonablemente rápidos y seguros respecto a la base remota.