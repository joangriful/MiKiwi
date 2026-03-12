# Recap claro (hasta Fase 4)

## Contexto rapido
- Objetivo: refactor por features sin tocar Laravel.
- Regla: nombres de archivos deben coincidir con `Inertia::render(...)`.
- Imports: usar `@/` para evitar rutas relativas fragiles.

## Fase 2 (Shared)
**Que hicimos**
- Movimos `Utils`, `Hooks`, `translations` a `Shared/`.
- Ajustamos imports a `@/Shared/...`.
- Creamos `Shared/I18n/` y la dejamos como estructura vacia.
- Quitamos i18n global y el selector de idioma.

**Por que**
- Centralizar reutilizables y reducir acoplamientos.
- Preparar el proyecto para crecer sin romper imports.
- Evitar trabajo extra con i18n mientras migramos features.

## Fase 3 (Marketing)
**Que hicimos**
- Creamos `Features/Marketing/Pages` y `Components`.
- Movimos todas las paginas estaticas a esa carpeta.
- Renombramos a PascalCase para que Inertia las encuentre.
- Actualizamos el resolver para buscar en `Features/**/Pages`.
- Validamos AboutUs, FAQ, LegalNotice.

**Por que**
- Agrupar contenido estatico en un feature unico.
- Mantener compatibilidad con el backend sin tocar rutas.
- Asegurar que el cambio no rompa la web.

## Fase 4 (Auth + Profile)
**Que hicimos**
- Creamos `Features/Auth` y `Features/Profile`.
- Movimos Auth y Profile (Pages + Components + Tabs + Partials).
- Ajustamos imports a `@/Features/...`.
- El resolver ahora soporta rutas con subcarpetas (Auth/Auth, Profile/Edit).
- Quitamos la seccion de Direcciones (UI y rutas).

**Por que**
- Separar autenticacion y perfil como modulos claros.
- Evitar cambios en Laravel y mantener rutas actuales.
- Reducir mantenimiento quitando funciones no usadas.
