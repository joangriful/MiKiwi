<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver a la carpeta" /></a>

# 🚀 Guía de Instalación - MiKiwi

Bienvenido al equipo de **MiKiwi**. Sigue estos pasos para configurar tu entorno local y empezar a trabajar.

---

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu máquina:

- **PHP** (v8.2 o superior)
- **Composer** (v2.x)
- **Node.js** (v18.x o superior) y **npm**
- **Git**

---

## 🛠️ Pasos para el Setup

### 1. Clonar el repositorio
Si acabas de clonar el repo, entra en la carpeta del proyecto:
```bash
cd MiKiwi
```

### 2. Instalar dependencias de Backend (PHP)
```bash
composer install
```

### 3. Instalar dependencias de Frontend (JS)
```bash
npm install
```

### 4. Configurar el archivo de entorno
Crea una copia del archivo `.env.example` y llámalo `.env`:
```bash
cp .env.example .env
```

### 5. Generar la App Key
```bash
php artisan key:generate
```

### 6. Configurar la Base de Datos (Railway)
Para que todos usemos los mismos datos, conectaremos con la base de datos en la nube. Abre tu archivo `.env` y busca las variables de `DB_`. Cámbialas por estas:

```env
DB_CONNECTION=mysql
DB_HOST=hopper.proxy.rlwy.net
DB_PORT=32366
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=gyyvyBGhQyVLuUapkkDjpSaHaAGhRuPI
```

> [!IMPORTANT]
> No es necesario activar MySQL en XAMPP. Nos conectamos directamente al servidor externo.

### 7. Sincronizar Laravel
Ejecuta estos comandos para limpiar la caché y que Laravel lea la nueva configuración:
```bash
php artisan config:clear
php artisan cache:clear
```

### 8. Enlazar el Storage
Para que las imágenes y archivos se vean correctamente:
```bash
php artisan storage:link
```

---

## 🚀 Lanzar el Proyecto

Para ver la página completa con el servidor de Laravel y el de Vite (para React/Tailwind) corriendo a la vez, usa:

```bash
npm run start
```

Esto ejecutará internamente:
- `php artisan serve --host=localhost --port=8001` (Backend)
- `npm run dev` (Vite / Frontend)

Podrás acceder en: [http://localhost:8001](http://localhost:8001)

---

## ⚠️ Reglas de Oro
- **NUNCA** hagas `php artisan migrate:fresh` sin avisar, ya que borrarás la base de datos de todo el equipo.
- Usa solo `php artisan migrate` si añades tablas nuevas.
- Si tienes problemas de conexión, revisa tu internet o el archivo `INSTRUCCIONES_BD.md` para más detalles.