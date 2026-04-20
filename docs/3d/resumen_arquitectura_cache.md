# Reporte Técnico: Arquitectura de Caché Activa (Pre-warming)

Este documento resume la optimización del backend para eliminar los cuellos de botella en la carga de recursos externos (Cloudinary), mejorando la experiencia del usuario final.

## 🔴 Situación Inicial (El Problema)
Se detectó un retraso de **~2.1 segundos** (TTFB) al cargar el configurador.
- **Causa**: El servidor realizaba llamadas síncronas a la API de Búsqueda de Cloudinary en tiempo de ejecución.
- **Debilidad**: Si la caché expiraba, el primer usuario en entrar asumía todo el tiempo de espera de la red externa.

## 🚀 La Solución: Caché Activa
Hemos pasado de un modelo de "Caché bajo demanda" a uno de **Pre-warming**. Ahora, los datos están siempre listos en el servidor antes de que el usuario los solicite.

### 1. Componentes Implementados
- **Artisan Command (`RefreshCloudinaryAssets`)**: Un comando específico que se encarga de hablar con Cloudinary y guardar los resultados de forma permanente en la caché local.
- **Task Scheduler**: Configurado para refrescar esta información automáticamente en segundo plano **cada hora**.
- **Controlador Desacoplado**: El controlador ya no tiene lógica de red; simplemente lee de la caché inmediata.

### 2. Archivos Modificados
- `app/Console/Commands/RefreshCloudinaryAssets.php`: Nueva lógica de proceso y guardado.
- `bootstrap/app.php`: Registro de la tarea programada.
- `app/Http/Controllers/ConfiguratorPageController.php`: Refactorizado para ser agnóstico a la red.

## 📈 Beneficios para el Equipo
- **Velocidad Constante**: El tiempo de respuesta ha bajado de **2100ms a <100ms** invariablemente.
- **Robustez**: Si la API de Cloudinary cae temporalmente, la web sigue funcionando con los últimos datos en caché en lugar de dar error.
- **Mantenimiento**: Para forzar una actualización tras subir nuevas piezas, basta con ejecutar:
  ```bash
  php artisan app:refresh-cloudinary-assets
  ```

---
*Documento preparado para el equipo de desarrollo de MiKiwi - Abril 2026*
