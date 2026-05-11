<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver" /></a>

# <img src="../assets/icons/instalacion.svg" width="32" height="32" /> Guía de Instalación y Onboarding (Day 1)

Bienvenido al equipo de **MiKiwi**. Esta guía unificada te proporcionará todo lo necesario para configurar tu entorno local y realizar tu primera contribución siguiendo nuestros estándares profesionales.

---

## 📋 1. Requisitos Previos

Antes de empezar, asegúrate de tener instalado:
- **PHP 8.2+** y **Composer** (v2.x)
- **Node.js 18+** y **NPM**
- **PostgreSQL** (Indispensable para el entorno de testing local)
- **Git**

---

## 🛠️ 2. Configuración del Entorno (Setup)

### Clonar e Instalar Dependencias
```bash
git clone https://github.com/joangriful/MiKiwi.git
cd MiKiwi
composer install
npm install
```

### Inicialización de Laravel
```bash
cp .env.example .env
php artisan key:generate
php artisan storage:link
```

---

## 🗄️ 3. Base de Datos y Persistencia

MiKiwi utiliza **PostgreSQL** (Supabase en producción). Para el desarrollo local y testing:

1.  **Entorno Local/Testing**: Crea una base de datos local llamada `mikiwi_testing`.
2.  **Sincronización**: Para generar datos de prueba y estructuras iniciales:
    ```bash
    php artisan migrate:fresh --seed
    ```
    *Nota: Los seeders generarán productos, categorías y configuraciones de prueba automáticamente.*

---

## 🚀 4. Lanzamiento del Proyecto

Para arrancar tanto el servidor de backend como el de frontend (Vite) de forma simultánea, utiliza el comando:

```bash
npm run start
```
- **Backend**: [http://localhost:8001](http://localhost:8001)
- **Frontend**: Gestionado dinámicamente por Vite e Inertia.

---

## 💻 5. Flujo de Trabajo y Git

Nunca trabajamos directamente sobre `main` o `dev`. Seguimos un flujo estricto de ramas:
1. **Crear Rama**: `git checkout -b feature/nombre-de-la-mejora`
2. **Desarrollar**: Siguiendo las reglas de **[AGENTS.md](../../AGENTS.md)**.
3. **Validar**: Pasar tests y linting (ver siguiente punto).
4. **Push**: `git push origin feature/nombre-de-la-mejora`
5. **PR**: Abrir Pull Request contra la rama `dev`.

---

## 📏 6. Estándares de Código y Validación

Antes de cada commit, es obligatorio asegurar la calidad del código:
- **Estilo PHP**: `./vendor/bin/pint` (Corrección automática de estilo).
- **Integridad JS**: `npm run build` (Verifica que no hay errores de compilación).
- **Tests Unitarios/Feature**: `php artisan test` (Asegura que no hay regresiones).

---

## 🎯 7. Tu Primera Tarea (Smoke Test)

Para verificar que tu instalación es 100% operativa:
1. Localiza el archivo `resources/js/Components/Header/Header.module.css`.
2. Realiza un cambio visual menor (ej: color de fondo).
3. Verifica que Vite refleja el cambio instantáneamente en el navegador.
4. Revierte el cambio y ejecuta los tests: `php artisan test`.

---

### ¿Necesitas más información?
- Consulta el **[Índice de Documentación](../index.md)**.
- Revisa el **[Glosario de Dominio](../project/DOMAIN_GLOSSARY.md)** para entender los términos del negocio.

---
*Última actualización: Mayo 2026*

![Footer](../assets/img/footer.png)