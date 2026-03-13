# Resumen del refactor de estructura (qué y por qué)

## Contexto rápido
Este repositorio se ha reorganizado para escalar mejor un proyecto **Laravel + Inertia + React + Tailwind** sin cambiar la UI.  
El objetivo fue **mejorar rendimiento, mantenibilidad y escalabilidad**, manteniendo el backend casi intacto y haciendo la migración **gradual**.

---

## Qué se cambió (alto nivel)

### 1) Frontend por *features*
**Qué hicimos**
- Todo el frontend se reorganizó en `resources/js/Features/`.
- Cada feature contiene sus `Pages`, `Components`, `Hooks`, `Utils`, etc.

**Por qué**
- Evita carpetas gigantes con responsabilidades mezcladas.
- Facilita migraciones graduales por módulo.
- Reduce dependencias cruzadas entre áreas.

---

### 2) Shared para reutilizables
**Qué hicimos**
- Los elementos comunes (utils, hooks, UI compartida) viven en `resources/js/Shared/`.

**Por qué**
- Centralizar reutilizables evita duplicar lógica.
- Hace más claro qué es “global” y qué es “feature‑specific”.

---

### 3) Layouts separados
**Qué hicimos**
- Layouts globales están en `resources/js/Layouts/`.

**Por qué**
- Separar layouts evita dependencias cíclicas y acoplamientos con features.

---

### 4) Resolver de Inertia endurecido
**Qué hicimos**
- El resolver de Inertia ahora apunta a `Features/**/Pages`.

**Por qué**
- Obliga a una estructura consistente.
- Evita que la app cargue páginas “legacy” sin querer.

---

### 5) CSS local por componente
**Qué hicimos**
- Cada componente vive en una carpeta propia con su `Component.jsx` + `Component.css`.
- El CSS local se crea aunque esté vacío.

**Por qué**
- Aísla estilos y evita colisiones.
- Facilita limpiar CSS en el futuro sin romper otras pantallas.

---

### 6) CSS global reducido
**Qué hicimos**
- `global.css` solo contiene tokens/variables.
- `app.css` queda mínimo (tailwind + global).

**Por qué**
- Evita cargar CSS innecesario en todas las páginas.
- Mejora rendimiento percibido y orden del styling.

---

### 7) Backend con DDD-light (por dominios)
**Qué hicimos**
- Se creó `app/Domain/<Modulo>/` y se movieron services, actions, repositories por dominio.

**Por qué**
- Hace el backend más escalable y entendible.
- Permite crecer sin “carpetas basurero”.

---

### 8) Tests + CI
**Qué hicimos**
- `.env.testing` para tests locales.
- GitHub Actions con MySQL para CI.

**Por qué**
- Validar cambios de forma automática.
- Garantizar que la migración no rompe el proyecto.

---

## Resultados directos
- Estructura más clara y modular.
- Menos riesgo al tocar features aislados.
- Mejor base para mantener y escalar.
- Estilos y componentes más controlados.

---

## Referencias útiles
- Plan detallado: `MIGRATION_PLAN.md`
- Recap por fases: `PHASE_RECAP.md`

---

## Nota sobre warnings
Los subrayados rojos del editor **no bloquean** la ejecución de la app.  
Los warnings de `composer dump-autoload` se limpiaron con `exclude-from-classmap` en `composer.json`.
