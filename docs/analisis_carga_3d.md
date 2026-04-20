# Análisis de Carga de Recursos 3D - MiKiwi

Este documento detalla la investigación realizada sobre cómo se cargan las librerías y activos 3D en el proyecto, confirmando si se cumple el principio de "cargar solo cuando hace falta".

## 🛠 Arquitectura de Carga Actual

El proyecto utiliza **Inertia.js** montado sobre **Vite**. Esta combinación permite una gestión eficiente de los recursos mediante los siguientes mecanismos:

### 1. Code-Splitting por Página (Cumplido)
En `resources/js/app.jsx`, se utiliza `import.meta.glob` para resolver las páginas:

```javascript
resolve: (name) =>
    resolvePageComponent(
        `./Pages/${name}.jsx`,
        import.meta.glob('./Pages/**/*.jsx'),
    ),
```

**Resultado**: Vite genera un "chunk" (paquete) independiente para cada archivo dentro de `Pages/`.
- **Ventaja**: Si un usuario visita la Home (`Welcome.jsx`), el navegador **no** descarga `three.js` ni `@react-three/fiber`, ya que estas librerías no están importadas en esa rama de dependencias.
- **Confirmación**: La carga 3D está aislada de las páginas estáticas.

### 2. Carga dentro de Configuradores (Oportunidad de Mejora)
En páginas como `DollConfigurator.jsx` y `MannequinConfigurator.jsx`, se ofrecen vistas tanto en 2D como en 3D. Actualmente:
- Las librerías 3D se importan al inicio del archivo (Top-level imports).
- Esto causa que, aunque la vista inicial sea 2D, el navegador descargue el motor 3D completo (~150KB-600KB extra) nada más entrar en la página.

---

## 🔍 Hallazgos Específicos

### Dependencias Pesadas Identificadas
- `three`: Motor principal.
- `@react-three/fiber`: Adaptador para React.
- `@react-three/drei`: Utilidades y helpers 3D.

### Fugas de Carga (Leakage)
Se ha detectado que en `MannequinConfigurator.jsx`, incluso si el usuario permanece en la pestaña "PERSONALIZAR" (que es 2D), el bundle 3D se procesa.

---

## 🚀 Optimización Implementada: Carga "Just-in-Time"

Para asegurar que el código 3D se cargue **realmente** solo cuando hace falta, se han realizado las siguientes acciones:

### 1. Refactorización a Carga Perezosa (Lazy Loading)
Se han extraído las escenas 3D de los componentes principales de las páginas y se han configurado con `React.lazy()`:
- **`DollConfigurator.jsx`**: Ahora utiliza el componente dinámico `DollScene3D`.
- **`MannequinConfigurator.jsx`**: Ahora utiliza el componente dinámico `MannequinScene3D`.

### 2. Aislamiento de Dependencias Pesadas
Las librerías `three`, `@react-three/fiber` y `@react-three/drei` han sido movidas a los componentes de escena. 
- **Efecto**: El bundle inicial de la página del configurador es ahora mucho más ligero (solo contiene la lógica de UI y el sistema 2D).
- **Activación**: Los archivos de Three.js solo se solicitan a través de la red en el momento exacto en que el usuario activa la pestaña "3D Modelo" o "Chicas".

### 3. Desacoplamiento de Metadatos
Se han movido los datos de los modelos a `modelsMetadata.js` para permitir que la UI (botones, selectores) funcione sin necesidad de cargar las librerías 3D pesadas de antemano.

## ✅ Confirmación Final
Se confirma que el código 3D cumple con el principio de **Carga Bajo Demanda**:
1. No se carga en la Home ni en otras secciones estáticas.
2. No se carga en los configuradores hasta que la funcionalidad 3D es requerida explícitamente por el usuario.

---
*Documento actualizado por Antigravity - 20 de Abril de 2026*
