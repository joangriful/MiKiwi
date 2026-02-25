# Guías y Estándares de Diseño

Este documento describe los principios de diseño, librerías y estrategias de gestión de recursos (assets) para el proyecto MiKiwi.

---

## 1. Sistema de Iconografía

Utilizamos **Google Material Symbols** para toda la iconografía dentro de la aplicación con el fin de garantizar consistencia y escalabilidad.

- **Librería**: Material Symbols (se prefieren las variantes Rounded/Outlined).
- **Implementación**: Usar la versión SVG o la versión como fuente.
  - **Instalación**: Incluir el enlace de la fuente en el layout principal (`app.blade.php` o `index.html`) o instalar vía npm si se requiere carga dinámica.
  - **Enlace**:
    ```html
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    ```
- **Uso**: Los íconos deben utilizarse para mejorar la navegación y las señales visuales sin sobrecargar la interfaz.

---

## 2. Paleta de Colores y Tipografía

### Colores

Utilizar los colores predefinidos de Tailwind CSS.

- **Fondos principales**: Verdes claros (`bg-green-50`) como se observa en el visualizador de productos.
- **Colores de acción**: Colores distintivos para los CTAs para asegurar que destaquen.
- **Feedback**: Colores semánticos estándar (rojo para errores, verde para éxito).

### Tipografía

- **Familia tipográfica**: Stack Sans-Serif estándar proporcionado por Tailwind (o definir una fuente personalizada de Google como "Inter" si es necesario).
- **Legibilidad**: Asegurar alto contraste del texto sobre fondos claros.

---

## 3. Gestión de Recursos (Assets)

Los recursos se organizan dentro del directorio `public/assets` para separarlos del código lógico.

### Estructura

- `public/assets/img/`: Imágenes de uso general, fotos de productos, banners.
- `public/assets/icons/`: SVGs personalizados no disponibles en Material Symbols.

### Buenas Prácticas

- **Convención de nombres**: Usar kebab-case para los nombres de archivos (ej.: `product-hero-bg.jpg`, `icon-check.svg`).
- **Optimización**: Asegurar que las imágenes estén comprimidas (preferiblemente en WebP) para tiempos de carga óptimos.

---

## 4. Principios de UI/UX

- **Arquitectura limpia**: Los componentes de UI son estrictamente presentacionales. La lógica reside en contenedores o hooks.
- **Jerarquía visual**: Utilizar el espaciado (`gap`, `margin`, `padding` en Tailwind) de manera efectiva. Agrupar visualmente los elementos relacionados (como el bloque unificado del Visualizador de Producto).

### Interacción

- Los botones y elementos interactivos deben tener estados `hover` y `active`.
- El comportamiento del cursor debe reflejar la interactividad:
  - `cursor-pointer` para enlaces/botones.
  - `cursor-default` para contenido estático.
- Evitar el resaltado de selección de texto (`select-none`) en elementos estructurales de la UI para mantener una sensación tipo app.

---

## 5. Estructura de Componentes

- **Atomic Design**:
  - Componentes pequeños y reutilizables (Botones, Inputs)
  - → Moléculas (Formularios, Cards)
  - → Organismos (Secciones como `ProductInfo`)
- **Identificación**: Durante el desarrollo, los componentes pueden tener bordes visuales temporales para depurar layouts. Estos deben eliminarse en producción.