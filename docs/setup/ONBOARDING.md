<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver" /></a>

# <img src="../assets/icons/instalacion.svg" width="32" height="32" /> Guía de Onboarding (Day 1)

Bienvenido al equipo de MiKiwi. Esta guía está diseñada para que cualquier desarrollador pueda integrarse al flujo de trabajo y realizar su primera contribución en menos de una hora.

---

## 🚀 Paso 1: Configuración del Entorno
Antes de empezar, asegúrate de tener instalado:
- **PHP 8.2+** y **Composer**
- **Node.js 18+** y **NPM**
- **PostgreSQL** (Local para tests)

### Comandos de Inicialización
```bash
git clone https://github.com/joangriful/MiKiwi.git
composer install
npm install
cp .env.example .env
php artisan key:generate
```

---

## 🛠️ Paso 2: Base de Datos y Datos de Prueba
Para trabajar con datos reales en local:
1. Crea una base de datos local llamada `mikiwi`.
2. Ejecuta las migraciones y los seeders:
```bash
php artisan migrate:fresh --seed
```
*Nota: Los seeders generarán productos, categorías y configuraciones de prueba.*

---

## 💻 Paso 3: Flujo de Trabajo (Git)
En MiKiwi nunca trabajamos directamente sobre `main` o `dev`. Seguimos este flujo:
1. Crea una rama desde `dev`: `git checkout -b feature/mi-nueva-funcionalidad`
2. Realiza tus cambios siguiendo las reglas de [AGENTS.md](../../AGENTS.md).
3. Sube tus cambios: `git push origin feature/mi-nueva-funcionalidad`
4. Abre un Pull Request contra la rama `dev`.

---

## 📏 Paso 4: Estándares de Código
Antes de cada commit, asegúrate de pasar los validadores:
- **Backend**: `./vendor/bin/pint` (Corrección automática de estilo)
- **Frontend**: `npm run build` (Para verificar que no hay errores de Vite)
- **Tests**: `php artisan test`

---

## 🎯 Tu Primera Tarea
Para verificar que todo funciona, intenta lo siguiente:
1. Cambia el color de un botón en `resources/js/Components/Header/Header.module.css`.
2. Verifica el cambio en el navegador (`npm run dev`).
3. Revierte el cambio y ejecuta los tests para asegurar que no has roto nada.

---

### ¿Dónde pedir ayuda?
- Consulta el **[Índice de Documentación](../index.md)**.
- Revisa los ejemplos de componentes en `resources/js/Components/`.

---
*Última actualización: Mayo 2026*

![Footer](../assets/img/footer.png)
