<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver a la carpeta" /></a>

# Arquitectura del Sistema

MiKiwi sigue una arquitectura de capas limpia, facilitando el mantenimiento y la escalabilidad del dominio de negocio.

## Flujo de Información (4 Capas)

El flujo estándar para cualquier petición en el backend es:
`Ruta HTTP -> Controller -> Domain Service/Action -> Repository -> Model -> Inertia Page`

1.  **Controladores**: Finos, encargados solo de recibir el request y devolver la respuesta.
2.  **Servicios/Actions**: Contienen la lógica de negocio pura.
3.  **Repositorios**: Abstraen el acceso a datos (Eloquent).
4.  **Modelos**: Definen esquemas, relaciones y casts.

## Estructura de Directorios

### Frontend (`resources/js/`)
*   `Pages/`: Componentes de página renderizados por Inertia.
*   `Components/`: Componentes React reutilizables (globales o por área).
*   `Hooks/`: Lógica de estado compartida.
*   `Utils/`: Funciones de utilidad pura.
*   `Layouts/`: Contenedores de composición de interfaz.

### Backend (`app/`)
*   `Domain/`: El corazón del negocio (Services, Actions, Repositories).
*   `Http/`: Controladores, Requests y Middlewares.
*   `Models/`: Modelos Eloquent.
*   `Providers/`: Registro de servicios e inyección de dependencias.

---
*Documentación modularizada - Mayo 2026*
