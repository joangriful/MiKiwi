<a href="../index.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver" /></a>

# <img src="../assets/icons/ux.svg" width="32" height="32" /> Diseño y Experiencia de Usuario

Esta sección define el ADN visual de MiKiwi, estableciendo los principios de UI/UX y los lineamientos estéticos que garantizan una experiencia premium y coherente.

### Resumen del Área
Nuestra filosofía de diseño se centra en la elegancia, la claridad y la interactividad. Aquí se documentan los tokens de diseño, las paletas de colores, la tipografía y las guías de interfaz que deben seguirse para mantener la integridad visual de la marca en todos los puntos de contacto del usuario.

---

## 🎨 Guías y Estándares de Diseño

Este apartado describe los principios de diseño, librerías y estrategias de gestión de recursos para el proyecto.

### 1. Sistema de Iconografía
Utilizamos **Google Material Symbols** para toda la iconografía dentro de la aplicación con el fin de garantizar consistencia y escalabilidad.

- **Librería**: Material Symbols (variantes Rounded/Outlined).
- **Implementación**: Usar la versión SVG o fuente via CDN:
  ```html
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  ```
- **Uso**: Los íconos mejoran la navegación y las señales visuales sin sobrecargar la interfaz.

### 2. Paleta de Colores y Tipografía
- **Colores**: Basados en Tailwind CSS. Fondos en `bg-green-50`, colores semánticos para feedback (error/éxito) y CTAs con alto contraste.
- **Tipografía**: Stack Sans-Serif estándar de Tailwind (interfaz limpia y legible).

### 3. Gestión de Recursos (Assets)
Los recursos se organizan en `public/assets` para separarlos de la lógica:
- `public/assets/img/`: Imágenes generales y de producto.
- `public/assets/icons/`: SVGs personalizados.
- **Optimización**: Uso de formato **WebP** y nomenclatura en **kebab-case**.

### 4. Principios de UI/UX
- **Arquitectura Limpia**: Componentes presentacionales aislados de la lógica (hooks).
- **Jerarquía Visual**: Uso efectivo de espaciados (`gap`, `margin`) para agrupar elementos relacionados.
- **Interacción**: Estados `hover` y `active` obligatorios; uso adecuado de `cursor-pointer`.

### 5. Estructura de Componentes
Seguimos los principios de **Atomic Design**:
- **Átomos**: Componentes base (Botones, Inputs).
- **Moléculas**: Combinaciones (Formularios, Cards).
- **Organismos**: Secciones complejas (Header, ProductInfo).

---
*Última actualización: Mayo 2026*

![Footer](../assets/img/footer.png)