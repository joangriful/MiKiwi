# Análisis de Carga de Recursos 3D - MiKiwi (Rama Dev)

Este documento detalla la investigación realizada sobre el sistema de carga de librerías 3D en la rama de desarrollo actual, adaptado a la nueva estructura modular de carpetas.

## 🛠 Estado Actual (Rama Dev)

A diferencia de versiones anteriores, la rama `dev` utiliza una estructura mucho más granular en `resources/js/Pages/Configurator/`. Sin embargo, el problema de carga inmediata persiste:

### 1. Sistema de Bundling
- **Inertia.js + Vite**: El sistema está configurado para dividir el código por página. Por ejemplo, al visitar la Home, no se cargan las librerías 3D.
- **Punto de Fuga**: Dentro de los configuradores, las librerías `three`, `@react-three/fiber` y `@react-three/drei` están importadas de forma estática en el nivel superior de los componentes.

### 2. Componentes Identificados
- `DollConfigurator.jsx`: Carga Three.js nada más iniciarse.
- `Mannequin3DViewer.jsx`: Carga Three.js nada más entrar en su sección.

## 🚀 Optimización Implementada (Rama Dev)

Se ha aplicado una re-estructuración completa para soportar la carga perezosa ("Just-in-Time") de los componentes 3D:

### 1. Desacoplamiento de Escenas
Se han creado sub-componentes específicos en carpetas `components/` locales para cada módulo:
- **`DollScene3D.jsx`**: Encapsula el motor 3D del configurador de muñecas.
- **`MannequinScene3D.jsx`**: Encapsula el motor 3D del visor de maniquíes.

### 2. Carga Diferida (Vite-Inertia Lazy)
Se ha implementado `React.lazy()` en los componentes padres:
- **`DollConfigurator.jsx`**
- **`Mannequin3DViewer.jsx`**

## 🚀 Estrategia de Carga Híbrida (Pre-warming)

En la última actualización, hemos evolucionado de un "Lazy Loading puro" a una **Carga Híbrida Inteligente**:

1.  **Prioridad 2D**: Al cargar el configurador, el navegador prioriza las imágenes 2D y el panel de control.
2.  **Precarga en Segundo Plano**: Tras 3 segundos de inactividad, la aplicación descarga silenciosamente el motor Three.js en el fondo.
3.  **Transición Instantánea**: Cuando el usuario cambia a "Muñecas Listas", el motor ya está en la caché, permitiendo un renderizado inmediato.
4.  **Precarga de Activos (Asset Preloading)**: Además del código, el sistema descarga en segundo plano los archivos pesados (`.fbx` y `.jpeg`) del modelo por defecto ("Queen").

## 🔍 Guía de Verificación (Chrome DevTools)

1.  **Pestaña Network**: Filtra por **JS**.
2.  **Carga Inicial**: Al entrar al configurador, observa que Three.js **no** se descarga de inmediato.
3.  **Detección de Pre-load**: Espera 3 segundos sin tocar nada. Verás aparecer los chunks de Three.js descargándose de forma silenciosa.
4.  **Verificación de Caché**: Haz clic en "Muñecas Listas". La transición debe ser instantánea y no deberías ver nuevas descargas de JS grandes.

---
*Documento actualizado y optimizado para Rama Dev - 20 de Abril de 2026*
