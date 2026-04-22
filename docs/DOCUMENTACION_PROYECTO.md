# DOCUMENTACION_PROYECTO.md - MiKiwi

Este documento centraliza la documentación funcional y técnica del proyecto MiKiwi. La guía para IAs y convenciones de programación vive en `docs/AGENTS.md`.

Si hay conflicto entre este documento y `docs/AGENTS.md` sobre estructura de código, prevalece `docs/AGENTS.md`.

## 1. Resumen Del Proyecto

MiKiwi es una plataforma e-commerce desarrollada con Laravel, React e Inertia. Su propuesta principal es vender productos personalizables mediante una experiencia visual interactiva, incluyendo configurador 2D/3D, catálogo, carrito, checkout, perfiles de usuario y panel de administración.

Objetivos principales:

- catálogo de productos y categorías;
- configurador visual de productos personalizables;
- carrito y checkout;
- integración con Stripe;
- gestión de contenidos y productos desde administración;
- integración con Cloudinary para assets;
- base preparada para crecimiento, testing y mantenimiento.

## 2. Stack Vigente

### Backend

- Laravel 12
- PHP 8.2+
- Inertia Laravel
- Laravel Sanctum
- Stripe PHP
- Cloudinary PHP SDK
- Ziggy para exponer rutas Laravel en JavaScript

### Frontend

- React 18
- Inertia React
- Vite
- CSS Modules
- Tailwind como apoyo puntual o legacy
- React Toastify
- Framer Motion / Lenis donde ya existan interacciones

### 3D y Multimedia

- Three.js
- React Three Fiber
- Drei
- React Easy Crop
- Cloudinary para media y assets remotos

### Base De Datos

- PostgreSQL como base vigente.
- Supabase remoto para desarrollo normal.
- PostgreSQL local separado para tests automatizados.

Decisiones de compatibilidad:

- las búsquedas de texto sin distinguir mayúsculas/minúsculas deben usar una abstracción común basada en `ILIKE`;
- los enums SQL se migrarán progresivamente a columnas `string` con validación en backend y constantes/enums PHP;
- los campos JSON deben gestionarse preferentemente con casts Eloquent a `array`;
- los UUIDs deben mantenerse extremo a extremo como UUID, sin tratarlos como enteros;
- los seeders deben poder ejecutarse varias veces sin duplicar datos;
- los puntos de recogida mock de Correos solo deben usarse automáticamente en `local` y `testing`; en producción requieren fallback explícito.

Plan de auditoría: `docs/db/POSTGRES_COMPATIBILITY_PLAN.md`.

## 3. Arquitectura Actual

El proyecto sigue esta separación:

```text
Ruta HTTP -> Controller -> Domain Service/Action -> Repository -> Model -> Inertia Page
```

Frontend:

```text
resources/js/
├── Pages/
├── Components/
├── Hooks/
├── Utils/
├── Layouts/
└── app.jsx
```

Backend:

```text
app/
├── Domain/
├── Http/
├── Models/
└── Providers/
```

La estructura vigente está alineada con `docs/AGENTS.md` y `docs/PROJECT_STRUCTURE.md`. Documentos antiguos que hablen de `Features` como destino principal son históricos.

## 4. Módulos Principales

### Home

Pantalla principal de la aplicación. Presenta hero, productos destacados, colecciones y bloques de contenido dinámico.

### Catálogo

Incluye:

- listados de productos;
- detalle de producto;
- categorías;
- filtros;
- productos relacionados;
- imágenes optimizadas.

### Configurador

Área más compleja del frontend. Permite configurar productos visualmente con:

- vista 2D;
- previsualización de partes;
- selección de piezas;
- flujo de quiz/colecciones si aplica;
- componentes 3D cargados bajo demanda;
- assets remotos desde Cloudinary.

### Carrito y Checkout

Incluye:

- carrito persistente;
- pasos de información, envío y pago;
- cálculo de totales;
- integración con Stripe;
- pantalla de éxito;
- validación backend.

### Perfil

Incluye:

- dashboard de usuario;
- datos personales;
- direcciones;
- pedidos;
- preferencias;
- posibles recomendaciones según quiz o comportamiento.

### Administración

Incluye herramientas para:

- gestión de contenidos;
- imágenes hero;
- productos destacados;
- usuarios;
- productos y categorías;
- configuraciones del configurador.

### Marketing y Legales

Páginas informativas:

- About/Company;
- contacto;
- FAQ;
- políticas legales;
- privacidad;
- cookies;
- términos;
- sitemap;
- sostenibilidad;
- ofertas y suscripciones.

## 5. Base De Datos y Entornos

### Entorno Normal

El `.env` normal debe apuntar a la base remota de Supabase.

Uso:

```bash
php artisan serve
npm run dev
php artisan migrate:status
```

### Entorno De Testing

`.env.testing` debe apuntar a PostgreSQL local, por ejemplo a una base `mikiwi_testing`.

Uso:

```bash
php artisan migrate:status --env=testing
php artisan test
```

Regla importante:

- los tests automatizados no deben tocar Supabase remoto;
- `php artisan migrate:fresh` no debe ejecutarse contra una base compartida salvo intención explícita y controlada.

Más detalle: `docs/db/DATABASE_CONNECTIONS_GUIDE.md`.

## 6. Cloudinary

Cloudinary se usa para servir y organizar assets del configurador y medios del proyecto.

Variables esperadas en `.env`:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_URL=
```

Estructura esperada para piezas del configurador:

```text
doll_parts_ps/
├── front/
│   └── <category>/
└── back/
    └── <category>/
```

La aplicación debe usar caché para evitar llamadas síncronas a Cloudinary en tiempo de usuario. Si se suben nuevas piezas y no aparecen, limpiar caché o ejecutar el comando de refresco si está disponible.

Referencias:

- `docs/setup/CLOUDINARY_SETUP.md`
- `docs/3d/resumen_arquitectura_cache.md`

## 7. Configurador 3D y Rendimiento

El configurador debe proteger la experiencia 2D:

- Three.js no debe cargarse en Home, catálogo ni rutas que no necesitan 3D.
- Los chunks 3D deben cargarse bajo demanda.
- El sistema puede precalentar assets en segundo plano para cambio instantáneo.
- Los modelos pesados no deben bloquear la primera interacción del usuario.

Optimizaciones documentadas:

- lazy loading de escenas 3D;
- pre-warming de Three.js y modelos;
- caché activa de Cloudinary;
- aislamiento del bundle 3D;
- reducción de TTFB en configurador mediante caché.

Referencias:

- `docs/3d/analisis_carga_3d.md`
- `docs/3d/auditoria_optimizacion_3d_abril.md`
- `docs/3d/resumen_mejoras_implementadas.md`

## 8. Herramienta De Segmentación De Muñecas

Existe una herramienta para segmentar imágenes de muñecas en partes:

```bash
node tools/segmentDoll.js --input <archivo_entrada> --output <directorio_salida> --name "Nombre"
```

Genera partes como:

- `head.png`
- `torso.png`
- `arm_left.png`
- `arm_right.png`
- `leg_left.png`
- `leg_right.png`

También puede actualizar `public/data/partLibrary.json`.

Referencia: `tools/README_SEGMENTATION.md`.

## 9. Comandos Del Proyecto

Instalación:

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Desarrollo:

```bash
composer dev
npm start
php artisan serve
npm run dev
```

Build:

```bash
npm run build
```

Testing:

```bash
composer test
php artisan test
```

Calidad PHP:

```bash
./vendor/bin/pint
```

Caché y rutas:

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:list
```

## 10. Diseño y UI

El sistema visual debe mantener:

- interfaz elegante y discreta;
- buena legibilidad;
- contraste suficiente;
- responsive design;
- estados interactivos claros;
- accesibilidad por teclado;
- uso de iconografía consistente cuando aplique.

Convención vigente:

- CSS Modules para estilos locales;
- `resources/css/global.css` para tokens y estilos globales reales;
- Tailwind solo como apoyo puntual o legacy.

Referencias:

- `docs/design/DESIGN_GUIDELINES.md`
- `resources/css/Descripcion.md`
- `docs/AGENTS.md`

## 11. Seguridad y Riesgos

Riesgos principales documentados:

- escalada de privilegios en acciones de administración si no hay Policy;
- endpoints sensibles sin rate limiting;
- exposición de datos sin auth;
- mass assignment;
- filtrado de excepciones internas;
- operaciones destructivas sobre base compartida.

Buenas prácticas:

- validar en backend con Form Requests;
- autorizar con Policies;
- no exponer modelos crudos con datos sensibles;
- no commitear secretos;
- separar `.env` de `.env.testing`;
- usar rate limiting en endpoints sensibles;
- usar mensajes de error seguros para usuario final.

Referencia: `docs/project/PLAN_CONTINGENCIA.md` y `docs/roadmap/ROADMAP.md`.

## 12. Testing

El proyecto usa PHPUnit mediante Laravel.

Recomendaciones:

- tests Feature para rutas, controllers y flujos de usuario;
- tests Unit para services/actions de dominio;
- factories y states para datos repetibles;
- entorno PostgreSQL local para tests.

Factory states documentados:

- usuarios: admin, customer, verified, inactive;
- productos: simple, configurable, component, outOfStock, inStock, onSale;
- categorías: root, child, inactive;
- reviews, orders, order items y chat.

Referencia: `docs/backend/FACTORY_STATES_GUIDE.md`.

## 13. Estado De Documentación Histórica

Estos documentos contienen contexto útil, pero no deben mandar sobre `docs/AGENTS.md`:

- `docs/refactor/INVENTORY_AUDIT.md`: foto antigua antes del refactor.
- `docs/refactor/MIGRATION_PLAN.md`: plan antiguo orientado a `Features/Shared`; histórico.
- `docs/refactor/PHASE_RECAP.md`: recap histórico.
- `docs/refactor/STRUCTURE_REFACTOR.md`: referencia histórica que confirma la arquitectura final.
- `docs/backend/README_BACKEND.md`: estado antiguo con MySQL/XAMPP.
- `docs/setup/GUIA_INSTALACION.md`: contiene setup antiguo Railway/MySQL; no usar como setup vigente sin actualizar.
- `Documentacion.md`: consolidado antiguo con problemas de codificación y contenido masivo; no usar como fuente.
- `docs/project/PilaresProyecto.md`: contenido docente ya absorbido por `docs/AGENTS.md`.

## 14. Documentos Complementarios Vigentes

- `docs/AGENTS.md`: reglas para IAs y programación.
- `docs/PROJECT_STRUCTURE.md`: estructura vigente detallada.
- `docs/db/DATABASE_CONNECTIONS_GUIDE.md`: separación Supabase/testing local.
- `docs/db/INSTRUCCIONES_BD.md`: guía de Supabase/PostgreSQL.
- `docs/setup/CLOUDINARY_SETUP.md`: Cloudinary.
- `docs/backend/FACTORY_STATES_GUIDE.md`: factories y tests.
- `docs/refactor/COMMIT_PLAN.md`: cierre del refactor estructural.
- `docs/3d/*.md`: optimización del configurador y carga 3D.

## 15. Pendientes Documentados

Puntos que aparecen en la documentación previa y pueden convertirse en tareas:

- ampliar cobertura de tests sobre servicios/controladores extraídos;
- terminar limpieza o destino definitivo de `resources/js/Shared`;
- revisar accesibilidad profunda de teclado;
- completar generación de PDF/facturas si sigue en alcance;
- documentar presupuesto o valoración económica si se requiere para rúbrica;
- mantener actualizada la separación entre documentación histórica y vigente.

## 16. Regla De Mantenimiento

Cuando cambie una convención de programación o estructura, actualizar `docs/AGENTS.md`.

Cuando cambie el producto, el stack real, el setup, los módulos, riesgos o decisiones de proyecto, actualizar este documento.

Última actualización: Abril 2026.
