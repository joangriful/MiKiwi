# 🛠️ Guía de Conexión a Base de Datos Compartida (Railway)

Para que todo el equipo trabaje con los mismos datos realistas del catálogo **MiKiwi**, hemos movido la base de datos a la nube. Sigue estos pasos para sincronizarte.

---

### 1. Configuración del Entorno (`.env`)
Abre tu archivo `.env` en la raíz del proyecto y sustituye las variables de base de datos por las siguientes:

```env
DB_CONNECTION=mysql
DB_HOST=hopper.proxy.rlwy.net
DB_PORT=32366
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=gyyvyBGhQyVLuUapkkDjpSaHaAGhRuPI
```

> **Nota:** No es necesario que tengas MySQL activo en tu XAMPP local, ya que nos estamos conectando al servidor externo de Railway.

---

### 2. Sincronización de Laravel

Para que Laravel olvide la configuración anterior y lea los nuevos datos del servidor, ejecuta en tu terminal:

```bash
php artisan config:clear
php artisan cache:clear
```

---

### 3. Reglas de Supervivencia (IMPORTANTE) ⚠️

Al ser una **Base de Datos Única**, lo que tú hagas afecta a todos. Por favor, sigue estas normas:

* **🚫 PROHIBIDO `php artisan migrate:fresh` sin avisar:** Este comando borra TODAS las tablas de la nube. Si lo ejecutas, eliminarás el trabajo de tus compañeros y los datos de prueba que ya están cargados.
* **✅ Usa solo `php artisan migrate`:** Si creas una tabla nueva, este comando la subirá a la nube sin borrar las existentes.
* **🌱 Seeders:** Si necesitas resetear los datos a su estado original (catálogo de muñecas, lubricantes, etc.), avisa al equipo y usa:
  `php artisan migrate:fresh --seed`

---

### 4. Diagrama de Conexión

Cada vez que guardas un registro desde tu `localhost:8000`, el dato viaja a Railway. Si otro compañero refresca su página, verá el cambio que tú hiciste.

---

### 5. Solución de Problemas Comunes

* **Error de conexión (Timeout):** Revisa que tu internet sea estable y que el puerto sea el `32366`.
* **Warnings de PHP:** Si al ejecutar comandos te salen avisos amarillos de "Module already loaded", ignóralos; es un tema estético de tu configuración de XAMPP y no afecta a la base de datos.
