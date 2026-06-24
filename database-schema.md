# Arquitectura de Base de Datos — Aurora (Producción)

Esquema en Supabase (PostgreSQL) diseñado para producción. Corrige todos los problemas del esquema MVP y añade las tablas, constraints, índices, políticas RLS y triggers necesarios para que la app funcione de forma correcta y escalable.

---

## Principios de diseño

- **No JSONB para arrays de IDs** — se consultan en tablas relacionales normalizadas.
- **Streak con fecha, no contador ciego** — `last_streak_date` es la fuente de verdad.
- **XP con libro contable** — `xp_transactions` es inmutable; `profiles.total_xp` es el agregado.
- **Contenido publicable** — todo el contenido tiene `is_published` para poder preparar lecciones sin exponerlas.
- **Timestamps en todo** — `created_at` y `updated_at` en cada tabla (actualizado via trigger).
- **RLS por defecto** — los usuarios solo ven y modifican sus propios datos.

---

## 1. Usuarios y Configuración

### `profiles`

Vinculada a `auth.users`. Se crea automáticamente con un trigger al registrar un usuario.

| Columna | Tipo | Restricciones | Descripción |
|:---|:---|:---|:---|
| `id` | `UUID` | PK, ref `auth.users.id` | Mismo ID que Supabase Auth. |
| `first_name` | `Text` | NOT NULL | Nombre. |
| `last_name` | `Text` | | Apellido. |
| `avatar_url` | `Text` | | URL en Supabase Storage. |
| `streak_days` | `Integer` | NOT NULL, default `0` | Racha actual en días. |
| `longest_streak` | `Integer` | NOT NULL, default `0` | Racha más larga histórica. |
| `last_streak_date` | `Date` | | Fecha de la última actividad. Fuente de verdad del streak. |
| `total_xp` | `Integer` | NOT NULL, default `0` | Agregado de `xp_transactions`. |
| `created_at` | `Timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `Timestamptz` | NOT NULL, default `now()` | Actualizado via trigger. |

> **Lógica del streak:** Al registrar actividad diaria, si `last_streak_date = CURRENT_DATE - 1`, se incrementa `streak_days`. Si `last_streak_date < CURRENT_DATE - 1`, se resetea a `1`. Si `last_streak_date = CURRENT_DATE`, no cambia. Se gestiona en la función `record_daily_activity()`.

---

### `user_settings`

Preferencias por usuario. Se crea automáticamente junto con el perfil.

| Columna | Tipo | Restricciones | Descripción |
|:---|:---|:---|:---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | |
| `user_id` | `UUID` | NOT NULL, UNIQUE, ref `profiles.id` | |
| `daily_goal_minutes` | `Integer` | NOT NULL, default `10` | Meta diaria de estudio. |
| `notifications_enabled` | `Boolean` | NOT NULL, default `true` | |
| `reminder_time` | `Time` | | Hora del recordatorio diario (ej. `20:00`). |
| `ui_language` | `Text` | NOT NULL, default `'es'` | Idioma de la interfaz. |
| `created_at` | `Timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `Timestamptz` | NOT NULL, default `now()` | |

---

### `user_daily_activity`

Registro de actividad por día. Es la fuente para calcular el streak y mostrar el calendario de progreso. Una fila por usuario por día.

| Columna | Tipo | Restricciones | Descripción |
|:---|:---|:---|:---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | |
| `user_id` | `UUID` | NOT NULL, ref `profiles.id` | |
| `activity_date` | `Date` | NOT NULL | Fecha de la actividad. |
| `minutes_studied` | `Integer` | NOT NULL, default `0` | Tiempo total del día. |
| `xp_earned` | `Integer` | NOT NULL, default `0` | XP ganado ese día. |
| `exercises_completed` | `Integer` | NOT NULL, default `0` | Ejercicios completados ese día. |
| `created_at` | `Timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `Timestamptz` | NOT NULL, default `now()` | |

**Constraints:** `UNIQUE(user_id, activity_date)`

---

## 2. Estructura de Contenido

### `modules`

Bloques temáticos principales. Un módulo agrupa lecciones bajo un mismo nivel y enfoque.

| Columna | Tipo | Restricciones | Descripción |
|:---|:---|:---|:---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | |
| `title` | `Text` | NOT NULL | Ej. "Primeros Pasos". |
| `description` | `Text` | | Descripción del enfoque del módulo. |
| `level` | `Text` | NOT NULL, CHECK `IN ('A1','A2','B1','B2','C1','C2')` | Nivel CEFR. |
| `order` | `Integer` | NOT NULL | Orden global de aparición. |
| `thumbnail_url` | `Text` | | Imagen de portada. |
| `estimated_minutes` | `Integer` | | Duración total estimada. |
| `is_published` | `Boolean` | NOT NULL, default `false` | Controla visibilidad en la app. |
| `created_at` | `Timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `Timestamptz` | NOT NULL, default `now()` | |

---

### `lessons`

Clases dentro de cada módulo. Tienen nivel y categoría propios para filtrar y mostrar en la UI.

| Columna | Tipo | Restricciones | Descripción |
|:---|:---|:---|:---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | |
| `module_id` | `UUID` | NOT NULL, ref `modules.id` | |
| `title` | `Text` | NOT NULL | Ej. "Saludos y Presentaciones". |
| `description` | `Text` | | Subtítulo de la lección. |
| `level` | `Text` | NOT NULL, CHECK `IN ('A1','A2','B1','B2','C1','C2')` | Hereda del módulo por defecto, pero puede diferir. |
| `category` | `Text` | NOT NULL, CHECK `IN ('vocabulary','grammar','listening','speaking','writing')` | Tipo de habilidad. |
| `order` | `Integer` | NOT NULL | Orden dentro del módulo. |
| `xp_reward` | `Integer` | NOT NULL, default `20` | XP al completar la lección por primera vez. |
| `estimated_minutes` | `Integer` | | Duración estimada. |
| `is_published` | `Boolean` | NOT NULL, default `false` | |
| `created_at` | `Timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `Timestamptz` | NOT NULL, default `now()` | |

---

### `exercises`

Unidad atómica de contenido. El campo `content` varía según el `type`, por eso usa JSONB — pero en este nivel es correcto porque el objeto es el contenido, no una relación.

| Columna | Tipo | Restricciones | Descripción |
|:---|:---|:---|:---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | |
| `lesson_id` | `UUID` | NOT NULL, ref `lessons.id` | |
| `type` | `Text` | NOT NULL, CHECK `IN ('voice','dictation','writing','multiple_choice','fill_blank')` | Tipo de ejercicio. |
| `order` | `Integer` | NOT NULL | **Orden dentro de la lección.** |
| `content` | `JSONB` | NOT NULL | Payload específico del tipo. Ver esquemas abajo. |
| `xp_reward` | `Integer` | NOT NULL, default `5` | XP al completarlo. |
| `difficulty` | `Integer` | NOT NULL, default `1`, CHECK `BETWEEN 1 AND 3` | 1=fácil, 3=difícil. |
| `is_published` | `Boolean` | NOT NULL, default `true` | |
| `created_at` | `Timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `Timestamptz` | NOT NULL, default `now()` | |

**Esquemas de `content` por tipo:**

```jsonc
// voice
{ "phrase_en": "How are you?", "phrase_es": "¿Cómo estás?", "audio_url": "storage/..." }

// dictation
{ "audio_url": "storage/...", "correct_text": "Nice to meet you." }

// writing
{ "prompt_es": "Escribe una oración presentándote.", "example_answer": "My name is..." }

// multiple_choice
{ "question": "What does 'happy' mean?", "options": ["feliz","triste","cansada","nerviosa"], "correct_index": 0 }

// fill_blank
{ "sentence": "My name ___ Maria.", "options": ["is","am","are","be"], "correct_index": 0 }
```

---

## 3. Progreso

### `user_module_progress`

Estado del usuario por módulo. Se usa para mostrar el bloqueo/desbloqueo de módulos en la pantalla de lecciones.

| Columna | Tipo | Restricciones | Descripción |
|:---|:---|:---|:---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | |
| `user_id` | `UUID` | NOT NULL, ref `profiles.id` | |
| `module_id` | `UUID` | NOT NULL, ref `modules.id` | |
| `status` | `Text` | NOT NULL, default `'locked'`, CHECK `IN ('locked','available','in_progress','completed')` | |
| `completed_at` | `Timestamptz` | | Fecha de finalización. |
| `created_at` | `Timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `Timestamptz` | NOT NULL, default `now()` | |

**Constraints:** `UNIQUE(user_id, module_id)`

---

### `user_lesson_progress`

Estado del usuario por lección. `last_exercise_id` permite retomar exactamente donde se dejó.

| Columna | Tipo | Restricciones | Descripción |
|:---|:---|:---|:---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | |
| `user_id` | `UUID` | NOT NULL, ref `profiles.id` | |
| `lesson_id` | `UUID` | NOT NULL, ref `lessons.id` | |
| `status` | `Text` | NOT NULL, default `'locked'`, CHECK `IN ('locked','available','in_progress','completed')` | |
| `last_exercise_id` | `UUID` | ref `exercises.id` | Último ejercicio visto. Para la función "Continuar". |
| `score` | `Integer` | CHECK `BETWEEN 0 AND 100` | Porcentaje de acierto al completar. |
| `attempts` | `Integer` | NOT NULL, default `0` | Veces que se ha intentado la lección. |
| `completed_at` | `Timestamptz` | | |
| `last_accessed_at` | `Timestamptz` | | |
| `created_at` | `Timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `Timestamptz` | NOT NULL, default `now()` | |

**Constraints:** `UNIQUE(user_id, lesson_id)`

---

### `user_exercise_progress`

**Reemplaza el array JSONB del MVP.** Una fila por ejercicio completado. Permite consultas reales sobre el progreso granular.

| Columna | Tipo | Restricciones | Descripción |
|:---|:---|:---|:---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | |
| `user_id` | `UUID` | NOT NULL, ref `profiles.id` | |
| `exercise_id` | `UUID` | NOT NULL, ref `exercises.id` | |
| `lesson_progress_id` | `UUID` | NOT NULL, ref `user_lesson_progress.id` | Agrupa los ejercicios de un intento de lección. |
| `status` | `Text` | NOT NULL, CHECK `IN ('completed','skipped','failed')` | |
| `score` | `Integer` | CHECK `BETWEEN 0 AND 100` | Acierto del ejercicio (100 = perfecto). |
| `response` | `JSONB` | | Respuesta del usuario. Ej: `{"text": "Hello"}` o `{"selected_index": 2}`. |
| `time_spent_seconds` | `Integer` | | Tiempo dedicado al ejercicio. |
| `completed_at` | `Timestamptz` | NOT NULL, default `now()` | |

> No tiene `UNIQUE(user_id, exercise_id)` intencional: se pueden registrar múltiples intentos a lo largo de distintos intentos de la lección (`lesson_progress_id` los diferencia).

---

## 4. XP y Gamificación

### `xp_transactions`

Libro contable inmutable de todo el XP. **Nunca se borra.** `profiles.total_xp` es el `SUM()` de esta tabla (mantenido via trigger).

| Columna | Tipo | Restricciones | Descripción |
|:---|:---|:---|:---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | |
| `user_id` | `UUID` | NOT NULL, ref `profiles.id` | |
| `amount` | `Integer` | NOT NULL | Positivo (ganado) o negativo (ajuste). |
| `source` | `Text` | NOT NULL, CHECK `IN ('exercise_completed','lesson_completed','streak_bonus','reward_bonus','manual_adjustment')` | Origen del XP. |
| `reference_id` | `UUID` | | ID del ejercicio o lección que originó el XP. |
| `reference_type` | `Text` | CHECK `IN ('exercise','lesson','streak','reward')` | Tipo de la referencia. |
| `created_at` | `Timestamptz` | NOT NULL, default `now()` | |

---

## 5. Recompensas

### `rewards`

Catálogo de premios configurables. `condition_value` ahora es JSONB estructurado para evitar parsear strings.

| Columna | Tipo | Restricciones | Descripción |
|:---|:---|:---|:---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | |
| `title` | `Text` | NOT NULL | Ej. "Cena especial". |
| `description` | `Text` | | Texto de contexto del premio. |
| `unlock_hint` | `Text` | | Pista que se muestra cuando está bloqueado. Ej. "Completa el módulo de Saludos". |
| `category` | `Text` | NOT NULL, CHECK `IN ('surprise','dinner','date','massage','makeup')` | Determina la ilustración a mostrar. |
| `code` | `Text` | UNIQUE | Código de canje. Ej. `'AURORA-001'`. |
| `icon` | `Text` | | Emoji o URL alternativa. |
| `condition_type` | `Text` | NOT NULL, CHECK `IN ('module_completed','lesson_completed','streak_reached','xp_reached','exercises_completed','lessons_count')` | Tipo de condición. |
| `condition_value` | `JSONB` | NOT NULL | Valor estructurado. Ver ejemplos abajo. |
| `is_active` | `Boolean` | NOT NULL, default `true` | Permite desactivar sin borrar. |
| `display_order` | `Integer` | NOT NULL, default `0` | Orden en la bóveda de recompensas. |
| `created_at` | `Timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `Timestamptz` | NOT NULL, default `now()` | |

**Esquemas de `condition_value` por tipo:**

```jsonc
// module_completed → el módulo con este ID debe estar completado
{ "module_id": "uuid-del-modulo" }

// lesson_completed → la lección con este ID debe estar completada
{ "lesson_id": "uuid-de-la-leccion" }

// streak_reached → racha mínima de N días
{ "days": 7 }

// xp_reached → XP acumulado mínimo
{ "xp": 500 }

// lessons_count → N lecciones completadas en total
{ "count": 5 }

// exercises_completed → N ejercicios completados en total
{ "count": 20 }
```

---

### `user_rewards`

Registro de premios desbloqueados. La constraint UNIQUE impide duplicados.

| Columna | Tipo | Restricciones | Descripción |
|:---|:---|:---|:---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | |
| `user_id` | `UUID` | NOT NULL, ref `profiles.id` | |
| `reward_id` | `UUID` | NOT NULL, ref `rewards.id` | |
| `unlocked_at` | `Timestamptz` | NOT NULL, default `now()` | Cuándo se cumplió el hito. |
| `is_redeemed` | `Boolean` | NOT NULL, default `false` | |
| `redeemed_at` | `Timestamptz` | | Cuándo se canjeó físicamente. |
| `created_at` | `Timestamptz` | NOT NULL, default `now()` | |

**Constraints:** `UNIQUE(user_id, reward_id)`

---

## 6. Índices

```sql
-- Progreso (las queries más frecuentes de la app)
CREATE INDEX idx_user_lesson_progress_user     ON user_lesson_progress(user_id);
CREATE INDEX idx_user_lesson_progress_lesson   ON user_lesson_progress(lesson_id);
CREATE INDEX idx_user_exercise_progress_user   ON user_exercise_progress(user_id);
CREATE INDEX idx_user_exercise_progress_lesson ON user_exercise_progress(lesson_progress_id);

-- Actividad diaria (para calendario de rachas)
CREATE INDEX idx_user_daily_activity_user_date ON user_daily_activity(user_id, activity_date DESC);

-- Contenido (filtros por nivel y categoría)
CREATE INDEX idx_lessons_module    ON lessons(module_id);
CREATE INDEX idx_lessons_level     ON lessons(level);
CREATE INDEX idx_lessons_category  ON lessons(category);
CREATE INDEX idx_exercises_lesson  ON exercises(lesson_id, "order");

-- Recompensas
CREATE INDEX idx_user_rewards_user ON user_rewards(user_id);

-- XP (para calcular total histórico)
CREATE INDEX idx_xp_transactions_user ON xp_transactions(user_id);
```

---

## 7. Row Level Security (RLS)

Habilitar RLS en todas las tablas. Regla general: un usuario solo puede leer y modificar sus propios datos. El contenido es público para usuarios autenticados.

```sql
-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles: own read/update"
  ON profiles FOR ALL
  USING (auth.uid() = id);

-- USER_SETTINGS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings: own read/update"
  ON user_settings FOR ALL
  USING (auth.uid() = user_id);

-- USER_DAILY_ACTIVITY
ALTER TABLE user_daily_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity: own read/write"
  ON user_daily_activity FOR ALL
  USING (auth.uid() = user_id);

-- USER_MODULE_PROGRESS
ALTER TABLE user_module_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "module_progress: own read/write"
  ON user_module_progress FOR ALL
  USING (auth.uid() = user_id);

-- USER_LESSON_PROGRESS
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_progress: own read/write"
  ON user_lesson_progress FOR ALL
  USING (auth.uid() = user_id);

-- USER_EXERCISE_PROGRESS
ALTER TABLE user_exercise_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exercise_progress: own read/write"
  ON user_exercise_progress FOR ALL
  USING (auth.uid() = user_id);

-- XP_TRANSACTIONS
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "xp: own read"
  ON xp_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- USER_REWARDS
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rewards: own read"
  ON user_rewards FOR SELECT
  USING (auth.uid() = user_id);

-- CONTENIDO (solo lectura para autenticados)
ALTER TABLE modules   ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons   ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content: authenticated read" ON modules   FOR SELECT TO authenticated USING (is_published = true);
CREATE POLICY "content: authenticated read" ON lessons   FOR SELECT TO authenticated USING (is_published = true);
CREATE POLICY "content: authenticated read" ON exercises FOR SELECT TO authenticated USING (is_published = true);
CREATE POLICY "content: authenticated read" ON rewards   FOR SELECT TO authenticated USING (is_active = true);
```

---

## 8. Funciones y Triggers

### Trigger: `updated_at` automático

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas las tablas con updated_at
CREATE TRIGGER trg_updated_at BEFORE UPDATE ON profiles         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_updated_at BEFORE UPDATE ON user_settings    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_updated_at BEFORE UPDATE ON user_daily_activity FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_updated_at BEFORE UPDATE ON modules          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_updated_at BEFORE UPDATE ON lessons          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_updated_at BEFORE UPDATE ON exercises        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_updated_at BEFORE UPDATE ON user_lesson_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_updated_at BEFORE UPDATE ON user_module_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_updated_at BEFORE UPDATE ON rewards          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

### Trigger: Crear perfil y settings al registrarse

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, first_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'first_name', 'Usuario'));

  INSERT INTO user_settings (user_id)
    VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

### Función: Registrar actividad diaria y actualizar streak

Llamar desde la app al completar cada ejercicio.

```sql
CREATE OR REPLACE FUNCTION record_daily_activity(
  p_user_id         UUID,
  p_xp_earned       INTEGER,
  p_minutes_studied INTEGER DEFAULT 0
)
RETURNS VOID AS $$
DECLARE
  v_last_date DATE;
  v_new_streak INTEGER;
BEGIN
  -- Upsert en user_daily_activity
  INSERT INTO user_daily_activity (user_id, activity_date, xp_earned, minutes_studied, exercises_completed)
    VALUES (p_user_id, CURRENT_DATE, p_xp_earned, p_minutes_studied, 1)
  ON CONFLICT (user_id, activity_date) DO UPDATE SET
    xp_earned         = user_daily_activity.xp_earned + EXCLUDED.xp_earned,
    minutes_studied   = user_daily_activity.minutes_studied + EXCLUDED.minutes_studied,
    exercises_completed = user_daily_activity.exercises_completed + 1;

  -- Leer fecha de último streak
  SELECT last_streak_date INTO v_last_date FROM profiles WHERE id = p_user_id;

  -- Calcular nuevo streak
  IF v_last_date = CURRENT_DATE THEN
    -- Ya estudió hoy, no cambia el streak
    v_new_streak = (SELECT streak_days FROM profiles WHERE id = p_user_id);
  ELSIF v_last_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Estudió ayer: incrementar
    v_new_streak = (SELECT streak_days FROM profiles WHERE id = p_user_id) + 1;
  ELSE
    -- Se rompió la racha o primer día
    v_new_streak = 1;
  END IF;

  -- Actualizar perfil
  UPDATE profiles SET
    last_streak_date = CURRENT_DATE,
    streak_days      = v_new_streak,
    longest_streak   = GREATEST(longest_streak, v_new_streak),
    total_xp         = total_xp + p_xp_earned
  WHERE id = p_user_id;

  -- Registrar transacción de XP
  IF p_xp_earned > 0 THEN
    INSERT INTO xp_transactions (user_id, amount, source)
      VALUES (p_user_id, p_xp_earned, 'exercise_completed');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 9. Diagrama de relaciones (resumen)

```
auth.users
    │
    └── profiles ──────────── user_settings
            │
            ├── user_daily_activity
            │
            ├── user_module_progress ──── modules ──── lessons ──── exercises
            │                                │              │
            ├── user_lesson_progress ────────┘              │
            │       │                                        │
            │       └── user_exercise_progress ─────────────┘
            │
            ├── xp_transactions
            │
            └── user_rewards ──── rewards
```

---

## 10. Lo que NO está en este esquema (decisiones conscientes)

| Tema | Decisión |
|:---|:---|
| **Almacenamiento de audio** | Se guarda en Supabase Storage. La URL va en `exercises.content.audio_url` o en `user_exercise_progress.response`. |
| **Notificaciones push** | Se gestiona externamente (Expo Push Notifications). Los tokens se pueden guardar en `user_settings` cuando se implemente. |
| **Sistema de niveles (Level Up)** | El `level` de usuario se puede calcular a partir de `total_xp` con umbrales fijos en la app. No requiere tabla extra hasta que los umbrales sean dinámicos. |
| **Vocabulario / glosario** | Fuera del alcance inicial. Si se añade, sería una tabla `vocabulary` con relación a `exercises`. |
| **Multi-usuario / social** | No contemplado. Este esquema es individual. Si se añaden comparaciones entre usuarios, se necesitarían perfiles públicos y políticas RLS adicionales. |
