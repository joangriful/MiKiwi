<a href="docs/index.md"><img src="docs/assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver" /></a>

# <img src="docs/assets/icons/changelog.svg" width="32" height="32" /> Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-05-11
### Added
- **Sistema de Documentación Profesional**: Reestructuración total de la carpeta `/docs` con arquitectura modular.
- **Identidad Visual**: Integración de iconos SVG personalizados para cada área de conocimiento.
- **Navegación Intuitiva**: Sistema de navegación bidireccional (Back buttons) en todos los documentos Markdown.
- **Manuales Operativos**: Incorporación de Guía de Onboarding, Manual de Admin y Glosario de Dominio.
- **Branding**: Inclusión de Header y Footer corporativos en los READMEs.

### Changed
- **Unificación de Índice**: Simplificación del índice de documentación (`docs/index.md`) para una vista única de 360°.
- **Consolidación de Diseño**: Fusión de lineamientos de diseño directamente en el README de la carpeta.
- **Modularización**: Extracción de información del archivo único `DOCUMENTACION_PROYECTO.md` hacia archivos especializados.

### Fixed
- **Conflictos de Fusión**: Resolución de discrepancias en comandos de arranque (`--host=localhost --port=8001`) durante la integración en `dev`.

---

## [1.1.0] - 2026-05-05
### Added
- **Sistema de Facturación**: Generación automática de facturas PDF tras la compra exitosa.
- **Gestión de Usuarios**: Nueva interfaz de área privada para clientes con historial de pedidos.
- **Favoritos**: Funcionalidad de "Me gusta" en productos con persistencia en base de datos.

### Changed
- **Arquitectura de Estilos**: Migración completa de Tailwind a CSS Modules en componentes principales para evitar colisiones.
- **Optimización de Imágenes**: Implementación de carga lazy y optimización via Cloudinary para el catálogo.

---

## [1.0.0] - 2026-04-15
### Added
- **Lanzamiento MVP**: Funcionalidad core de e-commerce activa.
- **Configurador 3D**: Visor interactivo basado en Three.js con personalización de piezas.
- **Pasarela de Pago**: Integración con Stripe (Modo Test).
- **Backend Laravel**: Arquitectura de 4 capas (Controller, Service, Repository, Model).

---
*Última actualización: Mayo 2026*

![Footer](docs/assets/img/footer.png)
