<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver a la carpeta" /></a>

# Guía de Desarrollo y Operaciones

## Comandos del Proyecto

### Instalación Inicial
```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

### Ejecución en Desarrollo
```bash
composer dev      # Inicia el entorno Laravel
npm run dev       # Inicia el compilador Vite
php artisan serve # Servidor PHP alternativo
```

### Calidad y Testing
```bash
composer test      # Ejecuta todos los tests
php artisan test   # Runner de tests de Laravel
./vendor/bin/pint  # Linter de estilo PHP
```

## Estrategia de Testing

*   **Feature Tests**: Para validar rutas, controladores y flujos de usuario completos.
*   **Unit Tests**: Para lógica de negocio crítica dentro de Services/Actions.
*   **Factories & States**: Uso intensivo de generadores de datos para entornos repetibles.
*   **Base de Datos Dedicada**: Los tests siempre deben ejecutarse contra PostgreSQL local (`.env.testing`).

## Mantenimiento de Documentación

*   **Convenciones**: Cualquier cambio en reglas de código debe reflejarse en `docs/AGENTS.md`.
*   **Producto/Setup**: Cambios en el stack, módulos o configuración deben actualizarse en la documentación del área correspondiente.

---
*Documentación modularizada - Mayo 2026*
