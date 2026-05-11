<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver a la carpeta" /></a>

# Arquitectura del Sistema

MiKiwi sigue una arquitectura de capas limpia, facilitando el mantenimiento y la escalabilidad del dominio de negocio.

## Flujo de Información (4 Capas)

El sistema está diseñado siguiendo una arquitectura de capas que separa las responsabilidades de transporte, lógica de negocio y persistencia.

```mermaid
graph TD
    A[Usuario / Navegador] --- B[Frontend - React/Inertia]
    B -->|Request HTTP| C[Controlador - app/Http]
    
    subgraph "Capa de Dominio"
        C -->|Orquesta| D[Service / Action - app/Domain]
        D -->|Consulta / Guarda| E[Repository - app/Domain]
    end
    
    subgraph "Capa de Datos"
        E -->|Eloquent| F[Modelo - app/Models]
        F <-->|Query| G[(PostgreSQL)]
    end
    
    D -.->|Retorna Datos| C
    C -.->|Inertia::render| B
    B -.->|React Render| A

    style A fill:#f9f,stroke:#333,stroke-width:2px,color:#000,rx:10,ry:10
    style B fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:10,ry:10
    style C fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:10,ry:10
    style D fill:#fff4dd,stroke:#d4a017,stroke-width:2px,color:#000,rx:10,ry:10
    style E fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:10,ry:10
    style F fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:10,ry:10
    style G fill:#00d2ff,stroke:#333,stroke-width:2px,color:#000,rx:10,ry:10
```

1.  **Controladores**: Finos, encargados solo de recibir el request y devolver la respuesta (Inertia o JSON).
2.  **Servicios/Actions**: Contienen la lógica de negocio pura y reglas de dominio.
3.  **Repositorios**: Abstraen el acceso a datos para que el dominio no dependa de Eloquent directamente.
4.  **Modelos**: Definen el esquema, relaciones, casts y scopes de la base de datos.

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
*Última actualización: Mayo 2026*

![Footer](../assets/img/footer.png)
