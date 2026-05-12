<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver a la carpeta" /></a>

# 🛡️ Plan de Gestión de Riesgos y Contingencia - MiKiwi

Este documento establece los protocolos de seguridad, prevención de riesgos técnicos y planes de continuidad para la plataforma MiKiwi, cumpliendo con los estándares de calidad y seguridad requeridos.

---

## 1. Identificación de Riesgos Técnicos (RA3-e)

Basado en la auditoría técnica de Febrero 2026, se han identificado las siguientes vulnerabilidades críticas y su estrategia de mitigación:

### A. Seguridad de Acceso y Autorización

- **Riesgo:** Escalada de privilegios en `UserController::toggleAdmin`.
- **Impacto:** 🔴 Crítico. Un usuario malintencionado podría auto-asignarse permisos de administrador.
- **Mitigación:** Implementación inmediata de `UserPolicy` y protección del método mediante el middleware de Laravel.

### B. Exposición de Datos (Data Breach)

- **Riesgo:** Acceso no autenticado a la lista de usuarios.
- **Impacto:** 🔴 Crítico. Fuga de información personal.
- **Mitigación:** Aplicar middleware `auth:sanctum` a todos los endpoints de gestión de usuarios.

### C. Ataques de Fuerza Bruta / DoS

- **Riesgo:** Ausencia de Rate Limiting en la API de autenticación.
- **Impacto:** 🔴 Crítico. Bloqueo del servidor por exceso de peticiones.
- **Mitigación:** Configuración de `ThrottleRequests` en `routes/api.php`.

---

## 2. Plan de Backups y Recuperación de Datos

Para garantizar la integridad de la información ante fallos de hardware o errores humanos:

### Estrategia de Copias de Seguridad

- **Base de Datos (MySQL):** Backups diarios automáticos utilizando `spatie/laravel-backup`. Almacenamiento externo en AWS S3 (fuera del servidor principal).
- **Imágenes (Cloudinary):** Cloudinary actúa como CDN y almacenamiento persistente. Se mantiene una copia local de los assets originales en el repositorio Git.
- **Código Fuente:** Control de versiones en GitHub con ramas protegidas (`main`, `dev`).

### Protocolo de Restauración (RTO/RPO)

1.  **Tiempo de Recuperación (RTO):** < 4 horas para restaurar el servicio completo.
2.  **Punto de Recuperación (RPO):** Máximo 24 horas de pérdida de datos (tiempo desde el último backup).
3.  **Procedimiento:**
    - Despliegue de la última versión estable desde GitHub.
    - Restauración de la última captura de la base de datos desde AWS S3.
    - Re-generación de cachés de Laravel (`config:cache`, `route:cache`).

---

## 3. Plan de Contingencia (Continuidad de Negocio)

¿Qué hacer cuando algo falla críticamente?

| Escenario                        | Acción de Respuesta                                                                                                            |
| :------------------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| **Caída del Servidor (Hosting)** | Despliegue automático en servidor espejo (Mirroring) o entorno de emergencia en Vapor/Heroku.                                  |
| **Fallo en Pasarela (Stripe)**   | Notificación automática al usuario. Deshabilitar pagos temporalmente y permitir "Guardar configuración" para compra posterior. |
| **Error Crítico en Producción**  | _Rollback_ inmediato a la versión anterior estable usando el historial de GitHub.                                              |
| **Pérdida de Configuración 3D**  | Restauración de los valores por defecto definidos en `DollSettingsController`.                                                 |

---

## 4. Gestión de Incidencias (RA4-c,d)

El flujo de trabajo para resolver problemas detectados es el siguiente:

1.  **Detección:** Alerta automática vía logs (Sentry/Logtail).
2.  **Registro:** Creación de un _Issue_ en GitHub con la etiqueta `bug` o `security`.
3.  **Resolución:** Creación de una rama `fix/...`, revisión por pares (Pull Request) y tests automáticos.
4.  **Cierre:** Fusión de la rama y despliegue de la corrección.

---

_Última actualización: Febrero 2026_