<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver a la carpeta" /></a>

# Seguridad y Gestión de Riesgos

## Mitigación de Riesgos Técnicos

*   **Autorización Estricta**: Uso de **Laravel Policies** para prevenir escalada de privilegios en el panel administrativo.
*   **Blindaje de Datos**: Validación en backend mediante **Form Requests** y prevención de **Mass Assignment** en modelos Eloquent.
*   **Rate Limiting**: Aplicado a endpoints sensibles (Login, Checkout, Formularios de contacto).
*   **Gestión de Secretos**: Nunca commitear archivos `.env` o credenciales. Uso exclusivo de variables de entorno.
*   **Excepciones**: Configuración para no filtrar mensajes de error internos al usuario final en entornos de producción.

## Buenas Prácticas de Seguridad

1.  **Validación Doble**: Siempre validar en backend, independientemente de la validación en el frontend.
2.  **Modelos Seguros**: No exponer modelos crudos directamente; usar API Resources o transformaciones Inertia para ocultar campos sensibles.
3.  **Aislamiento**: Separación total entre la base de datos remota de producción/dev y la base local de testing.

---
*Documentación modularizada - Mayo 2026*
