<a href="../index.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver" /></a>

# <img src="../assets/icons/server.svg" width="32" height="32" /> Backend MiKiwi (Laravel + Inertia)

El backend de MiKiwi es el motor que gestiona la lógica de negocio, la persistencia de datos y la orquestación del e-commerce. Construido sobre **Laravel 12**, está diseñado para ser escalable, seguro y eficiente, sirviendo tanto a la tienda tradicional como al configurador 3D avanzado.

### Resumen del Sistema
Nuestra arquitectura se basa en una separación estricta de responsabilidades mediante **4 capas** (Modelos → Repositorios → Servicios → Controladores), lo que permite que el código sea testeable y fácil de mantener. Utilizamos **PostgreSQL** (vía Supabase) como base de datos principal, **UUIDs** para una seguridad superior en los identificadores y **Laravel Sanctum** para la autenticación. La comunicación con el frontend de React se realiza de forma fluida mediante **Inertia.js**, eliminando la necesidad de una API REST tradicional para la mayoría de las interacciones.

---

## 📂 Documentación Detallada

*   **[Arquitectura de Controladores](GUIA_ARQUITECTURA_Y_CONTROLADORES.md)**: Estructura del patrón Repositorio-Servicio-Controlador.
*   **[Gestión de Datos en Factories](FACTORY_STATES_GUIDE.md)**: Cómo generar datos de prueba complejos.
*   **[Hoja de Ruta del Servidor](HOJA_DE_RUTA_TECNICA_BACKEND.md)**: Planificación por fases y objetivos técnicos.
*   **[Configuración y Evolución](REPORTE_EVOLUCION_Y_CONFIGURACION.md)**: Historial de cambios y configuración inicial.

---

## 🚀 Pilares Técnicos
- **Clean Architecture**: Lógica de negocio aislada en Servicios.
- **Seguridad Nativa**: Protección contra asignación masiva e inyección SQL.
- **Eficiencia**: Caché activa para recursos pesados (Cloudinary) y carga optimizada.
- **Consistencia**: Doble compatibilidad PostgreSQL/MySQL para entornos de testing y CI.

---
*Última actualización: Mayo 2026*

![Footer](../assets/img/footer.png)