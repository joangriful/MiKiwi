# Análisis de Estructura del Sistema Quiz en MiKiwi

## 1. RESUMEN EJECUTIVO
El proyecto MiKiwi tiene implementado un sistema de quiz de identidad que recolecta información sobre las preferencias del usuario y recomienda productos basado en los resultados. Actualmente, el sistema almacena SOLO una columna en la tabla `users` con el resultado principal del quiz.

---

## 2. RUTAS (Routes)

### 2.1 Ruta Principal del Quiz
**Archivo:** `C:\xampp\htdocs\MiKiwi\routes\web.php`

```php
Route::get('/quiz', function () {
    return Inertia::render('Configurador/Quiz');
})->name('configurador.quiz');
```

**Propósito:** Renderiza el componente React del quiz  
**Acceso:** Público (no requiere autenticación)  
**Nombre de ruta:** `configurador.quiz`

### 2.2 Ruta para Guardar Resultado
**Archivo:** `C:\xampp\htdocs\MiKiwi\routes\web.php` (línea 131)

```php
Route::post('/profile/quiz-result', [ProfileController::class, 'saveQuizResult'])
    ->name('profile.quiz.save');
```

**Propósito:** Recibe y guarda el resultado del quiz  
**Autenticación:** Requiere usuario autenticado  
**Nombre de ruta:** `profile.quiz.save`

### 2.3 Ruta de Perfil del Usuario (Usa resultado del quiz)
**Archivo:** `C:\xampp\htdocs\MiKiwi\routes\web.php` (línea 133-190)

```php
Route::get('/perfil', function () {
    // ... lógica que mapea $user->quiz_result_category 
    // a productos recomendados
})->name('perfil.view');
```

**Propósito:** Muestra el perfil del usuario con productos recomendados según el quiz  
**Lógica:** Mapea `quiz_result_category` a categorías de productos usando `$quizCategoryMap`

---

## 3. CONTROLADORES

### 3.1 ProfileController
**Archivo:** `C:\xampp\htdocs\MiKiwi\app\Http\Controllers\ProfileController.php`

#### Método: `saveQuizResult(Request $request)`
**Líneas:** 158-181

```php
public function saveQuizResult(Request $request)
{
    $request->validate([
        'category' => ['required', 'string', 'max:255'],
    ]);

    try {
        $user = $request->user();
        $user->update([
            'quiz_result_category' => $request->category,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Resultado guardado correctamente.'
        ]);
    } catch (\Exception $e) {
        \Log::error('Quiz result save failed: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Error al guardar el resultado.'
        ], 500);
    }
}
```

**Entrada:** 
- `category` (string): El nombre de la categoría ganadora del quiz

**Salida:**
- JSON con `success` y `message`

**Validaciones:**
- `category` es requerido, debe ser string y máximo 255 caracteres

---

## 4. MODELOS DE BASE DE DATOS

### 4.1 Modelo User
**Archivo:** `C:\xampp\htdocs\MiKiwi\app\Models\User.php`

```php
protected $fillable = [
    'name',
    'username',
    'email',
    'password',
    'dni',
    'birth_date',
    'role',
    'is_active',
    'stripe_customer_id',
    'quiz_result_category',  // <-- CAMPO DEL QUIZ
];
```

**Relaciones existentes:**
- `addresses()` - HasMany UserAddress
- `orders()` - HasMany Order
- `reviews()` - HasMany Review
- `chatSessions()` - HasMany ChatSession

**No hay un modelo específico para Quiz** - Todo se almacena en la tabla `users`

---

## 5. MIGRACIONES (Schema de Base de Datos)

### 5.1 Tabla Principal: users
**Archivo:** `C:\xampp\htdocs\MiKiwi\database\migrations\0001_01_01_000000_create_users_table.php`

```sql
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    dni VARCHAR(20) UNIQUE NULLABLE,
    birth_date DATE NULLABLE,
    email_verified_at TIMESTAMP NULLABLE,
    password VARCHAR(255),
    role ENUM('customer', 'admin', 'support') DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    remember_token VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULLABLE
)
```

### 5.2 Campo del Quiz (Agregado más recientemente)
**Archivo:** `C:\xampp\htdocs\MiKiwi\database\migrations\2026_02_24_110834_add_quiz_result_category_to_users_table.php`

```php
// UP
Schema::table('users', function (Blueprint $table) {
    $table->string('quiz_result_category')->nullable()->after('role');
});

// DOWN
Schema::table('users', function (Blueprint $table) {
    $table->dropColumn('quiz_result_category');
});
```

**Campo agregado:**
- `quiz_result_category` (VARCHAR(255)) NULLABLE
- Posición: Después de la columna `role`

### 5.3 Otros campos agregados a la tabla users
**Profiles/Images** (`2026_02_10_080000_add_profile_images_to_users_table.php`):
- `profile_photo_url` (VARCHAR(255)) NULLABLE
- `profile_photo_public_id` (VARCHAR(255)) NULLABLE
- `banner_url` (VARCHAR(255)) NULLABLE
- `banner_public_id` (VARCHAR(255)) NULLABLE

**Username** (`2026_02_09_092642_add_username_to_users_table.php`):
- `username` (VARCHAR(255)) NULLABLE UNIQUE

**Stripe** (`2026_02_23_091454_add_stripe_customer_id_to_users.php`):
- `stripe_customer_id` (VARCHAR(255)) NULLABLE

---

## 6. COMPONENTE FRONTEND (Quiz)

### 6.1 Ruta del Archivo
`C:\xampp\htdocs\MiKiwi\resources\js\Pages\Configurador\Quiz.jsx`

### 6.2 Estructura del Quiz
El quiz consta de **4 preguntas (QUIZ_STEPS)** con opciones que generan puntuaciones:

#### Pregunta 1: Personalidad
**Título:** "¿Cómo describirías tu enfoque ante nuevas experiencias?"

Opciones:
1. **Explorador/a** → Ondas de Presión (3), Sensaciones (2), BDSM y Fetiche (1)
2. **Sensual** → Lubricantes (3), Vibradores Externos (2), Cuidado del Cuerpo (2)
3. **Audaz** → Impacto (3), Restricción (2), Plugs Anales (2)
4. **Equilibrado/a** → Salud Íntima (3), Dildos (2), Higiene (1)

#### Pregunta 2: Estado de Ánimo
**Título:** "Si hoy fuera un escenario, ¿cuál elegirías?"

Opciones:
1. **Una tormenta eléctrica** → Ondas de Presión (4), Impacto (2)
2. **Un refugio de aguas termales** → Cuidado del Cuerpo (4), Salud Íntima (2)
3. **Un club clandestino** → Cuero y Textil (4), Restricción (2)
4. **Un jardín secreto al amanecer** → Sensaciones (4), Vibradores Externos (2)

#### Pregunta 3: Sentidos
**Título:** "¿Qué sentido guía tu placer con más fuerza?"

Opciones:
1. **El Tacto** → Cuero y Textil (3), Dildos (3), Masturbadores (2)
2. **La Vista** → Vibradores Externos (3), Ondas de Presión (2)
3. **El Oído** → Salud Íntima (3), Sensaciones (2)
4. **El Olfato** → Lubricantes (4), Cuidado del Cuerpo (3)

#### Pregunta 4: Deseo
**Título:** "En este momento, ¿qué es lo que más anhelas?"

Opciones:
1. **Jugar con el control** → Restricción (4), Impacto (3), Cuero y Textil (2)
2. **Un clímax explosivo** → Ondas de Presión (5), Vibradores Externos (2)
3. **Conectar con mi cuerpo** → Salud Íntima (4), Dilatadores y Kits de Inicio (3)
4. **Compartir la chispa** → Anillos Vibradores (4), Arneses y Strapless (3), Lubricantes (2)

### 6.3 Flujo del Quiz

```
1. Usuario entra a /quiz (público)
   ↓
2. Responde 4 preguntas
   - Cada respuesta suma puntos a categorías
   - Los puntos se acumulan en el estado `scores`
   ↓
3. Al terminar: calculateResult()
   - Encuentra la categoría con MAYOR puntuación
   - Define `resultCategory` con el ganador
   ↓
4. Si usuario está autenticado:
   - POST a /profile/quiz-result con la categoría
   - ProfileController::saveQuizResult() guarda en DB
   ↓
5. Muestra resultado personalizado
   - Renderiza mensaje basado en categoría
   - Botón para ver /perfil con recomendaciones
```

### 6.4 Categorías Posibles (Resultado Final)
Basado en `QUIZ_STEPS`, las categorías que pueden ser resultado son:

1. **Ondas de Presión** → "Energía Eléctrica"
2. **Sensaciones** → "Explorador/a de la Calma"
3. **Restricción** → "El Juego del Poder"
4. **Salud Íntima** → "Conexión Armónica"
5. **Lubricantes** → "Fluidez y Deseo"
6. Otras posibles (si acumulan puntos):
   - Cuidado del Cuerpo
   - Impacto
   - Plugs Anales
   - Dildos
   - Cuero y Textil
   - Masturbadores
   - Dilatadores y Kits de Inicio
   - Anillos Vibradores
   - Arneses y Strapless
   - Vibradores Externos
   - Higiene
   - Estimulación Interna/Externa/Anal
   - Pene y Testículos
   - Cuentas y Bolas Anal
