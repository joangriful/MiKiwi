<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver" /></a>

# <img src="../assets/icons/project_structure.svg" width="32" height="32" /> Infraestructura y Despliegue

Este documento describe el ecosistema de servicios y el flujo de integración continua (CI/CD) que permite que MiKiwi funcione en producción.

---

## 🏗️ Stack de Infraestructura

MiKiwi utiliza una arquitectura híbrida basada en servicios en la nube:

| Servicio | Propósito |
| --- | --- |
| **Render** | Hosting del monolito Laravel + React + Inertia sobre contenedor Docker. |
| **Supabase** | Base de datos PostgreSQL gestionada y autenticación secundaria. |
| **Cloudinary** | CDN para gestión y optimización de imágenes, videos y assets 3D. |
| **Stripe** | Pasarela de pagos segura y gestión de clientes. |
| **GitHub Actions** | Automatización de tests y despliegues. |

---

## 🔄 Flujo de CI/CD (Pipeline)

Nuestra integración continua está configurada en `.github/workflows/`:

1.  **Validación Técnica**: Ante cada *Pull Request*, GitHub Actions ejecuta:
    - Instalación de dependencias.
    - Chequeo de estilo (PHP Pint).
    - Tests de backend y base de datos (usando MySQL en CI).
2.  **Deploy a Dev**: Al fusionar con `dev`, se realiza un despliegue automático al entorno de staging.
3.  **Deploy a Producción**: Solo tras la aprobación final y fusión con `main`, se despliega la versión estable en el dominio principal.

---

## 🔒 Variables de Entorno y Secretos

El acceso a los servicios externos se gestiona mediante variables de entorno. Nunca se deben subir claves privadas al repositorio.

En Render, la referencia actual es [`render.yaml`](/c:/Users/Angel%20J%20Ragel/Desktop/MiKiwi/render.yaml). La aplicacion se configura con variables separadas de Laravel y no con una unica `DATABASE_URL`.

**Variables criticas de despliegue**:
- `APP_KEY`: Clave de encriptación de Laravel.
- `APP_URL`: URL publica del servicio.
- `DB_CONNECTION=pgsql`
- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_SSLMODE=require`
- `CLOUDINARY_URL`: Credenciales del CDN.
- `STRIPE_SECRET`: Clave de integración de pagos.

### Supabase en Render

Si se usa el pooler de Supabase:

- `DB_HOST`: `aws-1-eu-central-2.pooler.supabase.com`
- `DB_PORT`: `6543`
- `DB_DATABASE`: `postgres`
- `DB_USERNAME`: formato `postgres.<project-ref>`
- `DB_SSLMODE`: `require`

Si se usa la conexion directa de Supabase:

- `DB_HOST`: host directo del proyecto
- `DB_PORT`: `5432`
- `DB_DATABASE`: `postgres`
- `DB_USERNAME`: usuario directo entregado por Supabase
- `DB_SSLMODE`: `require`

No mezclar host directo con credenciales del pooler ni host del pooler con puerto `5432`. Esa combinacion provoca errores de autenticacion o resolucion de tenant en el arranque del contenedor.

*Para solicitar acceso a las variables de producción, contacta con el administrador del proyecto.*

---

## 📡 Monitorización y Logs

En producción, utilizamos los logs nativos de Laravel combinados con las herramientas de monitorización de Render y Supabase para detectar errores en tiempo real y asegurar un uptime del 99.9%.

---
*Última actualización: Mayo 2026*

![Footer](../assets/img/footer.png)
