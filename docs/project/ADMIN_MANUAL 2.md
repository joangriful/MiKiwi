<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver" /></a>

# <img src="../assets/icons/product.svg" width="32" height="32" /> Manual de Operaciones de Administración

Este manual está dirigido a los administradores de la plataforma MiKiwi. Describe cómo gestionar el catálogo, los contenidos y las configuraciones 3D.

---

## 🔐 Acceso al Panel
El panel de administración es accesible mediante la ruta `/admin`. Solo los usuarios con el rol `admin` asignado en la base de datos pueden acceder.

---

## 📦 Gestión de Productos
Desde el panel de productos puedes:
1.  **Crear Productos**: Definir nombre, SKU, precio y categoría.
2.  **Configurar Variantes**: Un producto puede ser "Simple" o "Configurable" (para el visor 3D).
3.  **Multimedia**: Subir imágenes principales. El sistema las optimizará automáticamente en Cloudinary.

---

## 🎨 Gestión del Configurador 3D
Esta es la parte más avanzada del panel. Para que un producto funcione en 3D:
- Debes asignar las "Piezas" (`Parts`) disponibles.
- Cada pieza debe estar vinculada a una imagen de Cloudinary o un modelo `.glb`.
- Las opciones de color y material se definen en la sección de "Atributos".

---

## 📈 Gestión de Pedidos
En la sección de pedidos, puedes:
- Consultar el estado del pago (Sincronizado con Stripe).
- Cambiar el estado del pedido (Pendiente, Procesando, Enviado).
- Descargar la factura generada para el cliente.

---

## 📧 Marketing y Newsletters
- Consulta el listado de usuarios suscritos.
- Gestiona los cupones de descuento activos y sus fechas de caducidad.

---
*Última actualización: Mayo 2026*

![Footer](../assets/img/footer.png)
