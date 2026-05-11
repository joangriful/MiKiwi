<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver" /></a>

# <img src="../assets/icons/project_structure.svg" width="32" height="32" /> Infraestructura y Despliegue

Este documento describe el ecosistema de servicios y el flujo de integración continua (CI/CD) que permite que MiKiwi funcione en producción.

---

## 🏗️ Stack de Infraestructura

MiKiwi utiliza una arquitectura híbrida basada en servicios en la nube:

| Servicio | Propósito |
| --- | --- |
| **Vercel** | Hosting del frontend (React + Inertia) y API Laravel (Serverless). |
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

**Variables críticas**:
- `APP_KEY`: Clave de encriptación de Laravel.
- `DATABASE_URL`: Conexión directa a Supabase.
- `CLOUDINARY_URL`: Credenciales del CDN.
- `STRIPE_SECRET`: Clave de integración de pagos.

*Para solicitar acceso a las variables de producción, contacta con el administrador del proyecto.*

---

## 📡 Monitorización y Logs

En producción, utilizamos los logs nativos de Laravel combinados con las herramientas de monitorización de Vercel y Supabase para detectar errores en tiempo real y asegurar un uptime del 99.9%.

---
*Última actualización: Mayo 2026*

![Footer](../assets/img/footer.png)
