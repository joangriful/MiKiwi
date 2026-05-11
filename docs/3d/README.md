<a href="../index.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver" /></a>

# <img src="../assets/icons/3d.svg" width="32" height="32" /> Ecosistema 3D MiKiwi (Three.js + React)

El ecosistema 3D de MiKiwi es un configurador de alta precisión diseñado para ofrecer una experiencia visual premium sin comprometer la velocidad de la web. Utiliza **Three.js**, **React Three Fiber** y **Drei** para renderizar modelos realistas con una integración total en el flujo de personalización.

### Resumen del Sistema
Para garantizar una carga ultra-rápida, el sistema emplea una **Estrategia de Carga Híbrida**: la interfaz 2D y el panel de control se cargan instantáneamente, mientras que el motor 3D y los modelos pesados se descargan silenciosamente en segundo plano (Pre-warming). Esto nos permite alcanzar tiempos de respuesta de **<500ms** y transiciones de **0ms** (*Instant Switch*) una vez que el usuario está listo para ver el modelo 3D. El código está estrictamente aislado para evitar que las librerías 3D afecten al resto de la tienda.

---

## 📂 Documentación Detallada

*   **[Análisis de Carga 3D](analisis_carga_3d.md)**: Estrategia de carga híbrida y pre-warming del motor.
*   **[Optimización del Configurador](auditoria_optimizacion_3d_abril.md)**: Refactorización para Tree-shaking y rendimiento.
*   **[Estrategia de Caché](resumen_arquitectura_cache.md)**: Optimización del servidor para activos multimedia.
*   **[Mejoras en el Visor](resumen_mejoras_implementadas.md)**: Modularización y experiencia de usuario.
*   **[Resumen Ejecutivo 3D](RESUMEN_EJECUTIVO_SISTEMA_3D.md)**: Hitos alcanzados en rendimiento y UX.

---

## 🚀 Conceptos Clave
- **Instant Switch**: Cambio inmediato entre vista 2D y 3D sin pantallas de carga.
- **Lazy Pre-warming**: Descarga inteligente del motor tras 3 segundos de inactividad.
- **Zero-leakage**: Aislamiento total de Three.js fuera del configurador.
- **Server Pre-warming**: Caché activa en el servidor para eliminar latencias externas.

---
*Última actualización: Mayo 2026*

![Footer](../assets/img/footer.png)