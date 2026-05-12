<a href="README.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver" /></a>

# <img src="../assets/icons/notas.svg" width="32" height="32" /> Glosario de Dominio (Ubiquitous Language)

Para que el equipo de diseño, negocio y desarrollo se entienda, utilizamos estos términos estandarizados para describir el ecosistema de MiKiwi.

---

## 🏗️ Conceptos de Producto
- **Dolls (Muñecas)**: El producto principal de la tienda. Son entidades altamente personalizables.
- **Configurable Product**: Producto que permite el uso del visor 3D para cambiar sus atributos.
- **Simple Product**: Producto estándar sin opciones de personalización interactiva (ej: accesorios).
- **Part (Pieza)**: Cada componente individual de una muñeca (cabeza, torso, extremidades).
- **Variant (Variante)**: La combinación específica de opciones elegidas por un usuario.

---

## 🖥️ Conceptos Técnicos
- **Inertia.js**: El puente que nos permite usar React con el routing y controladores de Laravel sin crear una API REST.
- **Configurator Engine**: El módulo de JavaScript/Three.js encargado de renderizar la previsualización 3D.
- **Pre-warming**: Técnica de precarga de recursos (Three.js o assets de Cloudinary) para eliminar tiempos de espera al usuario.
- **Clean Layers**: Nuestra arquitectura de 4 capas (Controller -> Service -> Repository -> Model).

---

## 💸 Conceptos de Negocio
- **Checkout Flow**: El proceso de 3 pasos (Envío, Pago, Éxito).
- **Success Page**: Página a la que llega el cliente tras un pago confirmado, donde se genera su factura.
- **Admin Panel**: Interfaz privada de gestión para el dueño de la tienda.

---
*Última actualización: Mayo 2026*

![Footer](../assets/img/footer.png)
