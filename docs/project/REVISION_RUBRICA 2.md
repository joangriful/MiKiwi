<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver a la carpeta" /></a>

# MiKiwi: Evaluación de Rúbrica del Proyecto

Este documento detalla el estado actual del proyecto MiKiwi frente a los criterios establecidos en la rúbrica de evaluación.

## 🟢 1. Desarrollo en Entorno Servidor

| Criterio / RA     | Requisito Rubrica                                   | Estado  | Observaciones                                                                      |
| :---------------- | :-------------------------------------------------- | :-----: | :--------------------------------------------------------------------------------- |
| **RA5 (a,b,f,g)** | Arquitectura MVC (Models, Controllers, Inertia)     | **[x]** | Uso estricto de Eloquent, Controllers y vistas React/Inertia sin lógica en vistas. |
| **RA5 (c,d,e)**   | Configuración y Formularios (.env, dinámicos)       | **[x]** | `.env` configurado. Checkout y carrito gestionados con formularios asíncronos.     |
| **RA6 (a,b,c,f)** | Persistencia y CRUD (Productos, Usuarios, Pedidos)  | **[x]** | Gestión completa implementada mediante Repositorios y Modelos.                     |
| **RA6 (d,e)**     | Integridad y Seguridad (FormRequests, Sanitización) | **[x]** | Validaciones en servidor mediante `FormRequest` y prevención de inyecciones.       |
| **RA7 (d,e,g)**   | Servicios Web (Creación y consumo de API)           | **[x]** | API REST implementada en `Api\ProductController` y otros endpoints.                |
| **RA8 (a,b,f)**   | Framework Servidor (Capacidades Laravel, Roles)     | **[x]** | Uso de Middleware `EnsureUserIsAdmin` y Policies para contenido dinámico.          |
| **RA9 (e,f,g)**   | Librerías Híbridas (Stripe, Cloudinary)             | **[/]** | Stripe y Cloudinary integrados. **Falta** generación de PDF y Mapas de entrega.    |

## 🔵 2. Desarrollo en Entorno Cliente

| Criterio / RA   | Requisito Rubrica                         | Estado  | Observaciones                                                   |
| :-------------- | :---------------------------------------- | :-----: | :-------------------------------------------------------------- |
| **RA7 (a,b,e)** | Comunicación Asíncrona (Inertia/Axios)    | **[x]** | El carrito y filtros se actualizan sin recargar la página.      |
| **RA7 (c,d,f)** | Manejo de JSONEntre React y Laravel       | **[x]** | Intercambio de objetos JSON gestionado nativamente por Inertia. |
| **RA7 (h,i)**   | Uso de Framework (React Hooks, Lifecycle) | **[x]** | Uso extensivo de `useState`, `useEffect` y Custom Hooks.        |
| **RA7 (g)**     | Compatibilidad Navegadores (Dual Browser) | **[x]** | Confirmada funcionalidad estable en múltiples navegadores.      |

## 🎨 3. Diseño de Interfaces (UI/UX)

| Criterio / RA   | Requisito Rubrica                                 | Estado  | Observaciones                                                                                     |
| :-------------- | :------------------------------------------------ | :-----: | :------------------------------------------------------------------------------------------------ |
| **RA5 (a,c,e)** | Accesibilidad (Etiquetas alt, contraste, teclado) | **[/]** | Etiquetas `alt` presentes en componentes base. Requiere auditoría profunda de navegación teclado. |
| **RA5 (f,g)**   | Verificación (Lighthouse, Responsive)             | **[x]** | Verificado con puntuación de 96 en Lighthouse. Diseño totalmente responsive.                      |
| **RA6 (a,b,c)** | Usabilidad/UX (Navegación intuitiva, buscador)    | **[x]** | Estructura clara por colecciones, carrito interactivo y flujo de compra lineal.                   |
| **RA6 (d,f)**   | Estándares (Tailwind CSS, Coherencia visual)      | **[x]** | Guía de diseño en `docs/DESIGN_GUIDELINES.md` y Tailwind configurado.                             |

## 📅 4. Proyecto Intermodular (Gestión)

| Criterio / RA  | Requisito Rubrica                               | Estado  | Observaciones                                                                              |
| :------------- | :---------------------------------------------- | :-----: | :----------------------------------------------------------------------------------------- |
| **RA3 (a, f)** | Planificación Temporal (Gantt/Cronograma)       | **[x]** | Cronograma detallado por semanas y tareas en `docs/ROADMAP.md`.                            |
| **RA3 (b, d)** | Recursos y Procedimientos (Stack, Scrum/Kanban) | **[x]** | Definido en `README.md` y `docs/PilaresProyecto.md`. Uso de GitHub Issues/Pull Requests.   |
| **RA3 (e)**    | Gestión de Riesgos (Técnicos, Seguridad)        | **[x]** | Vulnerabilidades identificadas y plan formal creado en `docs/PLAN_CONTINGENCIA.md`.        |
| **RA3 (g)**    | Valoración Económica (Coste, horas, licencias)  | **[/]** | Estimación de horas (4-5 semanas/2 devs) en Roadmap. **Falta** valoración monetaria total. |
| **RA3 (h)**    | Documentación de Ejecución (Guía Instalación)   | **[x]** | `docs/GUIA_INSTALACION.md` completa y funcional.                                           |
| **RA4 (a, b)** | Indicadores de Calidad (Métricas, Tests)        | **[x]** | Criterios de aceptación y tests unitarios definidos en `docs/ROADMAP.md`.                  |
| **RA4 (c, d)** | Gestión de Incidencias (Git/PRs)                | **[x]** | Uso de Conventional Commits y flujo de Pull Requests documentado.                          |

## 🤖 5. Uso de IA Generativa y Tutoriales

| Requisito                        | Estado  | Observaciones                                                           |
| :------------------------------- | :------ | :---------------------------------------------------------------------- |
| **Declaración de Transparencia** | **[x]** | Documentado en `docs/AGENTS.md` (uso de asistentes como tutor y apoyo). |
| **Responsabilidad Técnica**      | **[x]** | El Roadmap detalla la comprensión de cada vulnerabilidad y solución.    |
| **Aportación de Valor**          | **[x]** | Adaptación del código al patrón Service/Repository propio del proyecto. |

---

## 🚀 Resumen de Tareas Faltantes / Puntos Críticos

1.  **Librerías Híbridas (RA9):** Implementar generación de facturas en PDF y visualización de mapas para envíos.
2.  **Valoración Económica (RA3):** Traducir las horas de desarrollo y costes de APIs a un presupuesto monetario.
3.  **Plan de Contingencia (RA3):** Completado en `docs/PLAN_CONTINGENCIA.md`.
4.  **Auditoría de Navegación (RA5):** Ejecutar test de Lighthouse (Pasadocon 96) y asegurar navegación fluida solo con teclado.
5.  **Verificación de Navegadores (RA7):** Confirmada (completado).