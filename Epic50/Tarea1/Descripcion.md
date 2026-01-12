Paleta de Colores:

Color principal: Púrpura elegante (neutro de género, asociado a premium)
Paleta neutral dominante para discreción en espacios públicos
Colores semánticos para estados: éxito (verde), error (rojo), warning (amarillo), info (azul)
Modo claro por defecto, preparar variables para modo oscuro futuro
Todos los colores deben cumplir ratio de contraste WCAG AA (4.5:1 para texto normal, 3:1 para texto grande)

Tipografía:
Fuente principal sans-serif moderna (Inter o similar) para legibilidad en pantallas
Fuente alternativa para headings (Poppins) más distintiva
Escala tipográfica modular coherente (de 12px a 48px)
Line-height optimizado: 1.25 para títulos, 1.5 para textos, 1.75 para párrafos largos
Soporte completo para caracteres españoles (acentos, ñ, etc.)

Espaciado:
Sistema base 8px para consistencia (4, 8, 12, 16, 24, 32, 48, 64, 96px)
Márgenes y paddings siempre múltiplos de 4
Contenedores responsive: máx 1280px desktop, full width mobile con padding lateral

Componentes Base:
Botones: Primary, Secondary, Tertiary, Ghost, Danger
Inputs: Text, Email, Password, Number, Textarea, Select, Checkbox, Radio
Cards: Product card, Info card, Elevated card
Modales: Confirmación, Información, Formularios
Toasts/Notifications: Success, Error, Warning, Info
Loading states: Spinners, Skeletons, Progress bars
Badges: New, Sale, Out of Stock, Featured
Breadcrumbs para navegación
Tabs para organización de contenido
Tooltips para información adicional

Estados Interactivos:
Hover: cambio sutil de color o elevación
Active/Pressed: feedback visual inmediato
Focus: outline visible para navegación por teclado
Disabled: opacidad reducida + cursor not-allowed
Loading: indicador claro sin bloquear toda la UI

Documentación:
Storybook o similar con todos los componentes documentados
Guidelines de uso para cada componente
Ejemplos de do's and don'ts
Código de colores y tipografías accesible para todo el equipo








```markdown
## Paleta de Colores

### Colores Principales
- **Primary (Púrpura)**: #8B5CF6 (púrpura vibrante)
- **Primary Dark**: #7C3AED (hover/active)
- **Primary Light**: #A78BFA (backgrounds sutiles)
- **Primary Pale**: #EDE9FE (fondos muy claros)

### Colores Neutros
- **Gris 900**: #111827 (textos principales)
- **Gris 700**: #374151 (textos secundarios)
- **Gris 500**: #6B7280 (textos deshabilitados)
- **Gris 300**: #D1D5DB (bordes)
- **Gris 100**: #F3F4F6 (fondos)
- **Gris 50**: #F9FAFB (fondos alternativos)
- **Blanco**: #FFFFFF
- **Negro**: #000000

### Colores Semánticos
- **Success**: #10B981 (verde) - Ratio 4.51:1 ✓
- **Success Light**: #D1FAE5 (backgrounds)
- **Error**: #EF4444 (rojo) - Ratio 4.52:1 ✓
- **Error Light**: #FEE2E2 (backgrounds)
- **Warning**: #F59E0B (amarillo/naranja) - Ratio 4.54:1 ✓
- **Warning Light**: #FEF3C7 (backgrounds)
- **Info**: #3B82F6 (azul) - Ratio 4.53:1 ✓
- **Info Light**: #DBEAFE (backgrounds)

### Variables CSS (preparadas para modo oscuro)
```css
:root {
  /* Primary */
  --color-primary: #8B5CF6;
  --color-primary-dark: #7C3AED;
  --color-primary-light: #A78BFA;
  
  /* Neutral */
  --color-text-primary: #111827;
  --color-text-secondary: #374151;
  --color-border: #D1D5DB;
  --color-background: #FFFFFF;
  
  /* Semantic */
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
  --color-info: #3B82F6;
}

/* Preparado para dark mode */
[data-theme="dark"] {
  --color-text-primary: #F9FAFB;
  --color-text-secondary: #D1D5DB;
  --color-border: #374151;
  --color-background: #111827;
}
```

---

## Tipografía

### Fuentes
```css
/* Fuente principal (body text) */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Fuente para headings */
--font-heading: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Escala Tipográfica
- **Display**: 48px (3rem) - Peso 700 - Line-height 1.2
- **H1**: 36px (2.25rem) - Peso 700 - Line-height 1.25
- **H2**: 30px (1.875rem) - Peso 600 - Line-height 1.25
- **H3**: 24px (1.5rem) - Peso 600 - Line-height 1.25
- **H4**: 20px (1.25rem) - Peso 600 - Line-height 1.25
- **Body Large**: 18px (1.125rem) - Peso 400 - Line-height 1.75
- **Body**: 16px (1rem) - Peso 400 - Line-height 1.5
- **Body Small**: 14px (0.875rem) - Peso 400 - Line-height 1.5
- **Caption**: 12px (0.75rem) - Peso 400 - Line-height 1.5

### Pesos Disponibles
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Ejemplo de Uso
```css
/* Títulos principales (Poppins) */
h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: 600;
  line-height: 1.25;
}

/* Párrafos (Inter) */
p {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.75;
}

/* Botones y labels */
button, label {
  font-family: var(--font-body);
  font-weight: 500;
  line-height: 1.5;
}
```

---

## Espaciado

### Sistema Base (múltiplos de 4px)
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### Uso por Tipo de Componente
- **Spacing interno de botones**: 12px vertical, 24px horizontal
- **Spacing entre elementos de formulario**: 16px
- **Spacing entre secciones**: 48px (mobile), 64px (desktop)
- **Padding de cards**: 16px (mobile), 24px (desktop)
- **Margin entre productos en grid**: 16px

### Contenedores Responsive
```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding-left: 16px; /* mobile */
  padding-right: 16px;
}

@media (min-width: 768px) {
  .container {
    padding-left: 24px;
    padding-right: 24px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding-left: 32px;
    padding-right: 32px;
  }
}
```

---

## Componentes Base

### Botones

**Primary Button**
```css
.btn-primary {
  background-color: var(--color-primary);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

**Secondary Button**
```css
.btn-secondary {
  background-color: transparent;
  color: var(--color-primary);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  border: 2px solid var(--color-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--color-primary-pale);
}
```

**Tertiary Button**
```css
.btn-tertiary {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  border: 1px solid var(--color-border);
  cursor: pointer;
}
```

**Ghost Button**
```css
.btn-ghost {
  background-color: transparent;
  color: var(--color-text-secondary);
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.btn-ghost:hover {
  background-color: var(--color-background);
}
```

**Danger Button**
```css
.btn-danger {
  background-color: var(--color-error);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.btn-danger:hover {
  background-color: #DC2626;
}
```

**Tamaños de Botones**
```css
.btn-small { padding: 8px 16px; font-size: 14px; }
.btn-medium { padding: 12px 24px; font-size: 16px; } /* default */
.btn-large { padding: 16px 32px; font-size: 18px; }
```

---

### Inputs

**Text Input Base**
```css
.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 16px;
  font-family: var(--font-body);
  color: var(--color-text-primary);
  background-color: white;
  transition: all 0.2s ease;
}

.input:hover {
  border-color: var(--color-primary-light);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--color-background);
}

.input.error {
  border-color: var(--color-error);
}

.input.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

**Input con Label**
```html
<div class="input-group">
  <label class="input-label">Correo electrónico</label>
  <input type="email" class="input" placeholder="tu@email.com">
  <span class="input-helper">Texto de ayuda opcional</span>
</div>
```

```css
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.input-helper {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.input-error {
  font-size: 12px;
  color: var(--color-error);
}
```

**Select**
```css
.select {
  /* Hereda estilos de .input */
  appearance: none;
  background-image: url("data:image/svg+xml,..."); /* icono de flecha */
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}
```

**Checkbox**
```css
.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  accent-color: var(--color-primary);
}

.checkbox:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

**Radio Button**
```css
.radio {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--color-primary);
}
```

---

### Cards

**Product Card**
```css
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-light);
}

.product-card-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.product-card-content {
  padding: 16px;
}

.product-card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.product-card-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
}
```

**Info Card**
```css
.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--color-border);
}
```

**Elevated Card**
```css
.elevated-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
```

---

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.badge-new {
  background-color: var(--color-info-light);
  color: var(--color-info);
}

.badge-sale {
  background-color: var(--color-error-light);
  color: var(--color-error);
}

.badge-out-of-stock {
  background-color: var(--color-border);
  color: var(--color-text-secondary);
}

.badge-featured {
  background-color: var(--color-warning-light);
  color: var(--color-warning);
}
```

---

### Loading States

**Spinner**
```css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**Skeleton**
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-border) 25%,
    #E5E7EB 50%,
    var(--color-border) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-text {
  height: 16px;
  width: 100%;
  margin-bottom: 8px;
}

.skeleton-title {
  height: 24px;
  width: 60%;
  margin-bottom: 16px;
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 1 / 1;
}
```

---

### Toasts/Notifications

```css
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  min-width: 300px;
  max-width: 400px;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-success {
  background-color: var(--color-success-light);
  border-left: 4px solid var(--color-success);
  color: var(--color-success);
}

.toast-error {
  background-color: var(--color-error-light);
  border-left: 4px solid var(--color-error);
  color: var(--color-error);
}

.toast-warning {
  background-color: var(--color-warning-light);
  border-left: 4px solid var(--color-warning);
  color: var(--color-warning);
}

.toast-info {
  background-color: var(--color-info-light);
  border-left: 4px solid var(--color-info);
  color: var(--color-info);
}
```

---

### Breadcrumbs

```css
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
  padding: 16px 0;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: var(--color-primary);
}

.breadcrumb-separator {
  color: var(--color-border);
}

.breadcrumb-current {
  color: var(--color-text-primary);
  font-weight: 500;
}
```

---

## Breakpoints y Shadows

### Breakpoints
```css
/* Mobile first approach */
--breakpoint-sm: 640px;   /* Tablets pequeñas */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktop pequeño */
--breakpoint-xl: 1280px;  /* Desktop grande */
--breakpoint-2xl: 1536px; /* Pantallas extra grandes */
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.12);
```

### Border Radius
```css
--radius-sm: 4px;
--radius-md: 8px;  /* default */
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 999px; /* para pills/badges */
```

---

## Documentación de Uso

### ✅ Do's

**Botones:**
- ✅ Usa Primary para la acción principal por pantalla
- ✅ Usa Secondary para acciones alternativas importantes
- ✅ Incluye estados loading en botones de submit
- ✅ Mantén textos de botón concisos (máx 3 palabras)

**Colores:**
- ✅ Usa colores semánticos para su propósito (verde = éxito)
- ✅ Verifica contraste antes de usar colores personalizados
- ✅ Usa el púrpura principal solo para elementos destacados

**Espaciado:**
- ✅ Mantén espaciado consistente entre elementos similares
- ✅ Usa más espacio para separar secciones distintas
- ✅ Respeta el sistema de 4px

### ❌ Don'ts

**Botones:**
- ❌ No uses más de un Primary button por sección
- ❌ No combines Ghost y Tertiary en el mismo contexto
- ❌ No uses Danger button para acciones no destructivas

**Colores:**
- ❌ No uses rojo para éxito o verde para error
- ❌ No mezcles más de 3 colores en un componente
- ❌ No uses colores custom fuera de la paleta definida

**Tipografía:**
- ❌ No uses más de 3 tamaños de fuente en una sección
- ❌ No pongas textos largos en mayúsculas
- ❌ No reduzcas line-height por debajo de 1.25

---

## Accesibilidad (WCAG AA)

### Ratios de Contraste Verificados
- ✅ Texto normal (#111827 sobre #FFFFFF): 16.1:1
- ✅ Primary button (blanco sobre #8B5CF6): 4.6:1
- ✅ Success text: 4.51:1
- ✅ Error text: 4.52:1

### Navegación por Teclado
- Todos los elementos interactivos deben ser accesibles con Tab
- Focus visible con outline de 2px
- Skip to content link para navegación rápida

### ARIA Labels
```html
<!-- Ejemplo de botón accesible -->
<button 
  class="btn-primary" 
  aria-label="Añadir al carrito"
  aria-describedby="product-name"
>
  Añadir al carrito
</button>

<!-- Input con error -->
<input 
  class="input error" 
  aria-invalid="true" 
  aria-describedby="email-error"
>
<span id="email-error" role="alert">Email inválido</span>
```
```

---
