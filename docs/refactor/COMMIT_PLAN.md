# Commit Plan de Refactor

## Objetivo

Este documento define el orden exacto del refactor pendiente del proyecto. Cada bloque está pensado para convertirse en **un commit independiente**, pequeño, verificable y defendible técnicamente.

La prioridad no es “mover archivos por mover”, sino:

- alinear el proyecto con la estructura objetivo definida en `docs/AGENTS.md`;
- reducir acoplamiento entre páginas, componentes, rutas y lógica de negocio;
- evitar regresiones visuales y funcionales;
- dejar cada commit en un estado ejecutable.

## Reglas globales del plan

- No introducir `resources/js/Features` como destino nuevo.
- Toda página Inertia debe acabar en `resources/js/Pages/<Area>/<PageName>/`.
- Toda página debe tener `PageName.jsx` y `PageName.module.css`.
- Todo componente reutilizable debe acabar en `resources/js/Components/<ComponentName>/`.
- No usar `resources/js/Components/Common`.
- Dentro de `resources/js/Components` se permiten carpetas `hooks` y `utils` cuando tengan sentido de área, pero no carpetas semánticas intermedias como `sections`.
- Los hooks globales viven en `resources/js/Hooks`.
- Las utilidades globales viven en `resources/js/Utils`.
- `resources/css/global.css` solo debe contener estilos globales reales.
- Todo estilo nuevo o migrado de página/componente debe ir a `*.module.css`.
- `routes/web.php` debe quedarse enrutando y delegando, no resolviendo reglas de negocio.
- Los controladores deben ser finos y delegar en `app/Domain`.

## Estrategia de validación por commit

En cada commit se debe validar, como mínimo:

1. que `npm run build` siga resolviendo imports;
2. que las rutas afectadas rendericen;
3. que no haya regresiones visuales obvias en la pantalla tocada;
4. que no aparezcan errores de consola o de servidor derivados del movimiento;
5. que el commit no deje imports legacy apuntando a la ubicación vieja.

## Estado actual

- Commit 1: completado
- Commit 2: completado
- Commit 3: completado
- Commit 4: completado
- Commit 5: completado
- Commit 6: completado
- Commit 7: completado
- Commit 8: completado
- Commit 9: completado
- Commit 10: completado
- Commit 11: completado
- Commit 12: completado
- Commit 13: completado
- Commit 14: completado
- Commit 15: completado
- Commit 16: completado
- Commit 17: completado
- Commit 18: completado
- Commit 19: completado
- Commit 20: completado
- Commit 21: completado
- Commit 22: completado
- Commit 23: completado
- Commit 24: completado
- Commit 25: completado

## Orden oficial de commits

### Commit 1. Documentación maestra y contrato de estructura

**Objetivo**

Actualizar la documentación para que deje de empujar una arquitectura distinta a la que realmente queremos consolidar.

**Incluye**

- alinear `docs/AGENTS.md` con la estructura `Pages / Components / Hooks / Utils`;
- dejar por escrito que `Features` es deuda existente, no destino nuevo;
- dejar clara la convención de `*.module.css`;
- dejar explícito que `Tailwind` pasa a ser apoyo puntual, no base para nuevo código;
- referenciar este plan de commits desde la documentación de refactor si hace falta.

**Por qué este commit va primero**

Porque ahora mismo parte de la documentación histórica contradice las reglas activas del proyecto. Si no se corrige antes, cualquier refactor posterior puede seguir una dirección equivocada.

**Resultado esperado**

El repo tendrá una única fuente de verdad sobre estructura objetivo y reglas de refactor.

### Commit 2. Inventario técnico y mapa de migración

**Objetivo**

Dejar identificado todo lo que hay que mover antes de tocar código estructural.

**Incluye**

- inventario de páginas Inertia actuales;
- inventario de componentes globales y componentes de área;
- inventario de hooks y utils hoy metidos en `Features`;
- inventario de `.css` planos que deben pasar a `.module.css`;
- lista de rutas `Inertia::render(...)` y su correspondencia con la página física actual;
- identificación de naming inconsistente o en español que debe normalizarse.

**Por qué este commit es necesario**

Sin mapa de dependencias se corre el riesgo de mover componentes reutilizables como si fueran páginas, o viceversa. Este commit reduce improvisación y te da trazabilidad para el resto.

**Resultado esperado**

Sabremos exactamente qué se mueve, qué se renombra, qué se elimina y qué se deja temporalmente intacto.

### Commit 3. Base técnica del frontend objetivo

**Objetivo**

Preparar la estructura destino sin hacer todavía la migración de áreas grandes.

**Incluye**

- crear, si falta, la estructura estable:
  - `resources/js/Pages`
  - `resources/js/Components`
  - `resources/js/Hooks`
  - `resources/js/Utils`
- revisar `resources/js/app.jsx` para confirmar cómo resuelve páginas Inertia;
- preparar el resolver para que pueda convivir temporalmente con la migración sin romper rutas;
- definir criterio de imports durante la transición.

**Por qué este commit va antes del resto**

Primero se fija el destino. Si el destino no está definido, cada refactor posterior acaba rehaciendo imports y resolvers varias veces.

**Resultado esperado**

La app podrá empezar a recibir páginas y componentes en la estructura final sin bloquear el desarrollo.

### Commit 4. Hooks y utils globales

**Objetivo**

Separar utilidades y hooks transversales de las áreas funcionales donde están mal ubicados.

**Incluye**

- mover hooks realmente globales a `resources/js/Hooks`;
- mover utilidades realmente globales a `resources/js/Utils`;
- dejar dentro de cada área solo hooks y utils que sean estrictamente locales a esa área;
- actualizar imports en toda la app.

**Por qué este commit debe ser temprano**

Hooks y utils son dependencias base. Si se migran tarde, obligan a reescribir imports en casi todos los commits siguientes.

**Resultado esperado**

La frontera entre dependencia global y dependencia específica quedará limpia antes de mover páginas y componentes.

### Commit 5. Componentes globales compartidos

**Objetivo**

Eliminar `resources/js/Components/Common` y normalizar los componentes reutilizables globales.

**Incluye**

- mover `Header`, `Footer`, `Toast` y equivalentes a:
  - `resources/js/Components/Header/Header.jsx`
  - `resources/js/Components/Footer/Footer.jsx`
  - `resources/js/Components/Toast/Toast.jsx`
- crear sus respectivos `*.module.css`;
- ajustar imports en layouts y páginas;
- aplanar subcomponentes de footer dentro de `resources/js/Components/Footer/`, sin carpetas tipo `sections`.

**Por qué este commit va antes que las páginas**

Porque muchas páginas dependen de header/footer. Si estos globales no están limpios, cada migración de página arrastra deuda estructural.

**Resultado esperado**

La capa de composición global quedará estabilizada y sin `Common`.

### Commit 6. Componentes base de formulario y UI atómica

**Objetivo**

Normalizar componentes reutilizables pequeños que se usan en Auth, Profile y formularios.

**Incluye**

- migrar `TextInput`, `InputLabel`, `InputError`, `Checkbox`, `Dropdown`, `Modal`, `NavLink`, `ResponsiveNavLink`, `PrimaryButton`, `SecondaryButton`, `DangerButton`, `ApplicationLogo`, `MikiwiLogo`, `Welcome`;
- dar a cada uno su carpeta con `jsx + module.css`;
- revisar si alguno mezcla lógica de layout o de dominio y separarla;
- actualizar imports.

**Por qué este commit va separado**

Estos componentes son base para varias áreas. Migrarlos por separado evita repetir el mismo trabajo en los commits de Auth, Profile y Checkout.

**Resultado esperado**

Las piezas reutilizables más atómicas quedarán estabilizadas y listas para ser consumidas desde la estructura final.

### Commit 7. Limpieza de barrel exports y fronteras públicas

**Objetivo**

Eliminar exportaciones que rompen la separación entre componentes globales, páginas y componentes internos de área.

**Incluye**

- limpiar `resources/js/Components/index.js`;
- dejar de reexportar componentes internos de áreas o páginas;
- decidir si ese barrel sigue existiendo o se elimina por completo;
- documentar la frontera pública real de `Components`.

**Por qué este commit es importante**

Ahora mismo ese archivo oculta dependencias cruzadas y mete componentes internos de catálogo dentro de una capa supuestamente global. Mientras eso siga así, el proyecto seguirá acoplado aunque cambien las carpetas.

**Resultado esperado**

Las importaciones reflejarán dependencias reales y no habrá falsa sensación de “globalidad”.

### Commit 8. Layouts: saneado sin expandir complejidad

**Objetivo**

Revisar `Layouts` para que se limiten a composición y no asuman responsabilidades de negocio.

**Incluye**

- revisar `AppLayout`, `AuthenticatedLayout`, `GuestLayout`, `ConfiguradorLayout`;
- detectar y extraer lógica que no pertenezca al layout;
- normalizar imports hacia los nuevos componentes globales;
- confirmar si todos siguen siendo necesarios o si alguno es redundante.

**Por qué este commit va aquí**

Antes de mover páginas masivamente, la capa que las envuelve debe estar ordenada. Si los layouts siguen mezclando composición, navegación y lógica, el resto del refactor se contamina.

**Resultado esperado**

Los layouts quedarán como composición estructural y punto.

### Commit 9. Páginas estáticas y marketing

**Objetivo**

Migrar primero las páginas de menor riesgo y menor dependencia para estabilizar la convención de páginas Inertia.

**Incluye**

- mover a `resources/js/Pages/Marketing/<PageName>/`:
  - `AboutUs`
  - `Company`
  - `Contact`
  - `CookiePolicy`
  - `FAQ`
  - `GiftPacks`
  - `LegalNotice`
  - `NuestrosKiwis` con renombre estructural en inglés si aplica
  - `Offers`
  - `PrivacyPolicy`
  - `Sitemap`
  - `Subscriptions`
  - `Sustainability`
  - `TermsOfContract`
  - `TermsOfUse`
  - `colecciones` si realmente es página de marketing y no de catálogo
- crear `PageName.module.css` para cada una;
- actualizar `Inertia::render(...)` para apuntar a la nueva convención;
- mantener comportamiento idéntico.

**Por qué este commit va primero en páginas**

Porque son vistas con menor riesgo funcional. Sirven para probar la convención final sin tocar checkout, auth o admin.

**Resultado esperado**

Quedará validado el patrón de migración de páginas Inertia.

### Commit 10. Auth

**Objetivo**

Separar correctamente páginas Inertia de componentes reutilizables del área Auth.

**Incluye**

- mover páginas a `resources/js/Pages/Auth/<PageName>/`;
- mover formularios y componentes reutilizables del área a `resources/js/Components/Auth/<ComponentName>/` o a `resources/js/Components/<ComponentName>/` si son realmente globales;
- migrar `auth.css` y el CSS local asociado a `*.module.css`;
- revisar naming de páginas y componentes;
- validar login, registro, forgot password, reset, confirm password y verify email.

**Por qué este commit es individual**

Auth tiene componentes reutilizables, formularios, validación y layouts propios. Mezclarlo con otras áreas complica mucho el rollback si algo falla.

**Resultado esperado**

Auth quedará estructuralmente limpio y reutilizable.

### Commit 11. Profile

**Objetivo**

Migrar Profile siguiendo la misma disciplina que Auth, pero prestando atención a su mayor complejidad visual y de estado.

**Incluye**

- mover páginas a `resources/js/Pages/Profile/<PageName>/`;
- renombrar `perfil.jsx` a un nombre estructural en inglés;
- reubicar componentes de tabs, sidebars, modales e inputs en `resources/js/Components/Profile/...` cuando sean propios del área;
- pasar todos sus estilos a `*.module.css`;
- revisar responsabilidades para que la página no absorba lógica de componentes internos;
- validar edición de perfil, pestañas, direcciones, tarjetas, histórico y formularios parciales.

**Por qué este commit va después de Auth**

Profile reutiliza parte de la base de formularios y layouts ya saneados en commits anteriores. Hacerlo antes generaría más incertidumbre.

**Resultado esperado**

Profile dejará de depender de naming y estructura legacy.

### Commit 12. Home

**Objetivo**

Migrar la página principal y su ecosistema de secciones, hooks y utilidades.

**Incluye**

- mover `Home` a `resources/js/Pages/Home/Home/`;
- reubicar secciones reutilizables a `resources/js/Components/Home/...` si son piezas internas del área pero desacopladas de la página;
- decidir qué hooks del home son locales y cuáles globales;
- pasar `Home.css` y CSS de secciones a módulos;
- revisar si hay componentes que en realidad pertenecen a catálogo o a marketing;
- validar hero, colecciones, destacados, animaciones y scroll.

**Por qué este commit merece ir solo**

Home concentra mucho UI composition. Es fácil arrastrar componentes mal clasificados si no se trata como un bloque propio.

**Resultado esperado**

La home dejará de ser un agregado de piezas de `Features`.

### Commit 13. Catalog y producto

**Objetivo**

Reubicar listado, detalle y componentes de producto sin convertir la página en una bolsa de componentes internos.

**Incluye**

- mover páginas a `resources/js/Pages/Catalog/<PageName>/`;
- decidir qué piezas son reutilizables del área y llevarlas a `resources/js/Components/Catalog/...`;
- revisar `ProductCard`, `ProductCarousel`, `ProductInfo`, `FilterMenu`, `ProductFilters`, `RelatedProductsSection`, `MainProductImage`, `ProductImageCarousel`, `ProductImagePlaceholder`, `ProductGridSection`, `ProductShowcase`, `ProductCardInfo`;
- migrar todos sus estilos a módulos;
- revisar si alguna pieza debería ser global y no específica de catálogo.

**Por qué este commit va antes de Checkout**

Checkout y carrito suelen depender de producto y de algunas piezas de catálogo. Conviene estabilizar antes la capa de producto.

**Resultado esperado**

Catálogo y detalle de producto quedarán bajo una estructura clara y predecible.

### Commit 14. Checkout y Claims

**Objetivo**

Migrar el flujo de compra y las pantallas/formularios relacionados sin romper el proceso transaccional.

**Incluye**

- mover páginas de checkout a `resources/js/Pages/Checkout/<PageName>/`;
- mover componentes de steps a `resources/js/Components/Checkout/...`;
- migrar `Cart`, `Create`, `Success` y, si aplica, `ClaimsForm`;
- pasar `ShippingStep`, `InfoStep`, `PaymentStep`, `CartStep` y formularios relacionados a `*.module.css`;
- revisar separación entre página de checkout y componentes de paso;
- validar flujo carrito -> checkout -> success;
- validar formulario de reclamaciones si se mantiene dentro del mismo bloque funcional.

**Por qué este commit va aquí**

Depende de componentes base y de catálogo ya estabilizados. Hacerlo antes aumentaría el riesgo de regresiones acumuladas.

**Resultado esperado**

Checkout quedará modular y con responsabilidades separadas.

### Commit 15. Configurator

**Objetivo**

Refactorizar la parte más compleja del frontend manteniendo el configurador operativo.

**Incluye**

- mover páginas Inertia del configurador a `resources/js/Pages/Configurator/<PageName>/`;
- normalizar nombres como `Configurador`, `DollConfigurator`, `DollConfigTest`;
- reubicar componentes del área en `resources/js/Components/Configurator/...`;
- decidir si `DollManager` y `DollConfigurator` son capas distintas o nombres legacy de la misma responsabilidad;
- mover hooks del configurador a `resources/js/Hooks` si son globales o mantenerlos en área si son específicos;
- pasar todo CSS local a módulos;
- validar quiz, index, collections, muñecas, preview 3D y edición de piezas.

**Por qué este commit debe ir aislado**

Es el bloque con más riesgo técnico por la combinación de 3D, estado, preview y componentes anidados. Necesita commit propio para facilitar rollback y pruebas.

**Resultado esperado**

El configurador quedará bajo estructura coherente sin seguir expandiendo nombres legacy.

### Commit 16. Admin

**Objetivo**

Cerrar la migración del frontend con el área administrativa, que hoy es una de las más acopladas.

**Incluye**

- mover `ComponentsManager` a `resources/js/Pages/Admin/ComponentsManager/`;
- reubicar componentes internos de admin a `resources/js/Components/Admin/...`;
- revisar `useComponentsManager` y cualquier explorador que dependa de rutas físicas viejas;
- migrar CSS a módulos;
- validar gestión de usuarios, productos, contenidos, hero images, featured products, explorador y vistas de preview.

**Por qué este commit va al final del frontend**

Admin toca más piezas que nadie y depende de gran parte de la estructura existente. Conviene abordarlo cuando todo lo demás ya tiene forma estable.

**Resultado esperado**

La capa administrativa dejará de depender de convenciones legacy y rutas antiguas.

### Commit 17. Migración masiva de CSS local a CSS Modules

**Objetivo**

Cerrar la deuda de estilos una vez la estructura física de páginas y componentes ya esté estabilizada.

**Incluye**

- convertir los `.css` locales de `resources/js` en `*.module.css`;
- ajustar imports y uso de clases en JSX;
- eliminar dependencias implícitas de selectores globales;
- revisar colisiones de clase heredadas del sistema anterior;
- mantener `resources/css/global.css` únicamente para:
  - variables;
  - reset/base;
  - tipografía global;
  - utilidades globales muy justificadas;
- revisar `resources/css/app.css` para que sea una entrada mínima y no una bolsa de estilos de pantalla.

**Por qué este commit va después del movimiento estructural**

Si conviertes a CSS Modules antes de fijar carpetas y responsabilidades, haces el mismo trabajo dos veces.

**Resultado esperado**

El proyecto dejará de tener CSS local plano como convención dominante.

### Commit 18. Normalización de naming

**Objetivo**

Cerrar inconsistencias de nombres para que el árbol final sea predecible y 100% en inglés.

**Incluye**

- renombrar páginas, carpetas y componentes con naming mixto o en español;
- revisar casos como `perfil`, `colecciones`, `Configurador`, `NuestrosKiwis`, `munecas`;
- alinear nombre de archivo, nombre de componente exportado y nombre de carpeta;
- revisar nombres de rutas Inertia y de imports.

**Por qué este commit merece existir por separado**

El naming afecta imports, rutas y legibilidad, pero no debe mezclarse con cambios funcionales de estructura si queremos que cada commit sea entendible.

**Resultado esperado**

El árbol del frontend quedará consistente y predecible.

### Commit 19. Routes: limpieza de closures y delegación real

**Objetivo**

Vaciar `routes/web.php` de lógica y dejarlo como capa de routing.

**Incluye**

- extraer closures simples a controladores cuando solo rendericen páginas;
- extraer closures complejas con queries, caché o composición de payload;
- eliminar helpers definidos dentro de `routes/web.php`, como recursividad de categorías;
- reducir imports directos de modelos y servicios desde el archivo de rutas;
- dejar `web.php` con definición de rutas, middlewares y delegación.

**Por qué este commit va después del frontend**

Primero conviene estabilizar el destino de las páginas Inertia. Luego ya se limpia la capa PHP que decide qué renderizar.

**Resultado esperado**

`routes/web.php` dejará de ser un archivo con lógica embebida y pasará a ser solo la puerta de entrada HTTP.

### Commit 20. Home domain extraction

**Objetivo**

Sacar del routing la preparación de datos de la home y moverla a capas de dominio/controlador.

**Incluye**

- crear un controlador específico para home si no existe;
- extraer carga de `heroImages`, `featuredProducts` y `collectionImages`;
- delegar consultas y reglas a `app/Domain` o a servicios/repositorios ya existentes;
- dejar la acción del controlador delgada.

**Por qué este commit es independiente**

La home tiene composición de datos propia y es un caso perfecto para empezar a adelgazar rutas sin mezclarlo aún con Profile o Admin.

**Resultado esperado**

La home tendrá un flujo limpio: ruta -> controller -> dominio -> Inertia page.

### Commit 21. Profile domain extraction

**Objetivo**

Extraer la lógica pesada del perfil, especialmente la parte de recomendaciones por quiz.

**Incluye**

- mover el mapeo de categorías de quiz fuera de `routes/web.php`;
- extraer la resolución de categorías descendientes;
- mover búsqueda de productos recomendados a `app/Domain/Profile` o `app/Domain/Products`, según la responsabilidad final;
- dejar controlador fino y testeable.

**Por qué este commit es crítico**

Ahora mismo ese bloque concentra demasiada lógica de negocio, queries y decisiones de fallback. Es uno de los principales incumplimientos de SOLID en backend.

**Resultado esperado**

Profile dejará de depender de lógica procedural embebida en rutas.

### Commit 22. Admin domain extraction

**Objetivo**

Sacar la preparación de datos del panel admin de las closures de rutas.

**Incluye**

- extraer la carga de Cloudinary, settings, usuarios, hero images, categorías, productos y posiciones;
- separar lectura de configuración, consultas y composición de payload;
- definir servicios/actions específicos por responsabilidad;
- dejar el controller coordinando.

**Por qué este commit va después de Home y Profile**

Admin es más grande y dependiente. Conviene aplicar primero el patrón de extracción en casos más contenidos.

**Resultado esperado**

El área administrativa tendrá backend más mantenible y escalable.

### Commit 23. Controllers finos y refuerzo Domain

**Objetivo**

Revisar controladores existentes para que no absorban lógica que debería vivir en `app/Domain`.

**Incluye**

- auditar `CartController`, `OrderController`, `ProductController`, `ProfileController`, `DollSettingsController`, `ProductManagerController`, `ContentController` y equivalentes;
- mover reglas complejas, consultas pesadas e integración externa a `Services`, `Actions` o `Repositories`;
- introducir interfaces y dependencias hacia abstracciones cuando tenga sentido real;
- revisar bindings del contenedor si hace falta.

**Por qué este commit va después de limpiar rutas**

Una vez las rutas delegan bien, el siguiente cuello de botella es asegurar que los controladores tampoco se convierten en la nueva bolsa de lógica.

**Resultado esperado**

El backend quedará mucho más cercano a la estructura `Domain` que exige el proyecto.

### Commit 24. Limpieza final de legacy frontend

**Objetivo**

Eliminar residuos una vez todo esté migrado y referenciado desde la estructura nueva.

**Incluye**

- borrar `resources/js/Features` cuando ya no tenga referencias vivas;
- borrar `resources/js/Components/Common`;
- eliminar archivos `.css` legacy ya sustituidos;
- eliminar barrels, imports y rutas viejas;
- revisar que no quede ninguna referencia a ubicaciones antiguas.

**Por qué este commit no puede ir antes**

Hasta que todo lo anterior no esté migrado, borrar legacy sería destructivo y arriesgado.

**Resultado esperado**

El proyecto quedará sin doble estructura ni ambigüedad.

### Commit 25. Testing, smoke checks y documentación final

**Objetivo**

Cerrar el refactor con validación y documentación de la nueva realidad del proyecto.

**Incluye**

- añadir o ajustar tests de las rutas y dominios refactorizados;
- ejecutar pruebas críticas de build y smoke manual;
- actualizar documentación de estructura en `docs/PROJECT_STRUCTURE.md` y refactors previos si han quedado obsoletos;
- documentar qué se considera terminado y qué deuda queda fuera de alcance.

**Por qué este commit va el último**

Solo tiene sentido documentar la foto final cuando la foto final ya existe.

**Resultado esperado**

El refactor quedará cerrado, validado y explicable para cualquiera que entre al proyecto.

## Cierre del plan

El plan se considera cerrado con estos resultados:

- la estructura final de frontend ya no depende de `resources/js/Features`;
- `resources/js/Components/Common` ya no existe;
- el resolver de Inertia apunta a `Pages`;
- el backend delega la lógica relevante a `app/Domain`;
- la documentación maestra quedó alineada con la foto final del repo.

Deuda que queda fuera de este plan:

- ampliar cobertura de tests sobre servicios y controladores extraídos;
- limpiar o reutilizar `resources/js/Shared` si se decide su destino final;
- seguir afinando documentación histórica secundaria que se conserva como contexto.

## Dependencias entre commits

- Los commits 1 a 8 preparan la base.
- Los commits 9 a 18 completan la migración estructural del frontend.
- Los commits 19 a 23 cierran la limpieza de backend y routing.
- Los commits 24 y 25 rematan el cierre de deuda y validación.

## Regla de ejecución práctica

Si un commit empieza a tocar demasiadas rutas, demasiadas pantallas o demasiado backend a la vez, está mal cortado y hay que dividirlo. La unidad buena aquí es: **un cambio con una intención clara, una validación clara y un rollback claro**.
