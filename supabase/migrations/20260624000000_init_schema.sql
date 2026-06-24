-- ============================================================
-- Aurora — Migración inicial
-- ============================================================

-- ─────────────────────────────────────────
-- FUNCIÓN: updated_at automático
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────
-- 1. PROFILES
-- ─────────────────────────────────────────
CREATE TABLE profiles (
  id                UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name        TEXT        NOT NULL,
  last_name         TEXT,
  avatar_url        TEXT,
  streak_days       INTEGER     NOT NULL DEFAULT 0,
  longest_streak    INTEGER     NOT NULL DEFAULT 0,
  last_streak_date  DATE,
  total_xp          INTEGER     NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles: own read/update"
  ON profiles FOR ALL
  USING (auth.uid() = id);

-- ─────────────────────────────────────────
-- 2. USER_SETTINGS
-- ─────────────────────────────────────────
CREATE TABLE user_settings (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID        NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  daily_goal_minutes      INTEGER     NOT NULL DEFAULT 10,
  notifications_enabled   BOOLEAN     NOT NULL DEFAULT true,
  reminder_time           TIME,
  ui_language             TEXT        NOT NULL DEFAULT 'es',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings: own read/update"
  ON user_settings FOR ALL
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 3. USER_DAILY_ACTIVITY
-- ─────────────────────────────────────────
CREATE TABLE user_daily_activity (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_date        DATE        NOT NULL,
  minutes_studied      INTEGER     NOT NULL DEFAULT 0,
  xp_earned            INTEGER     NOT NULL DEFAULT 0,
  exercises_completed  INTEGER     NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

CREATE INDEX idx_user_daily_activity_user_date ON user_daily_activity(user_id, activity_date DESC);

CREATE TRIGGER trg_user_daily_activity_updated_at
  BEFORE UPDATE ON user_daily_activity
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE user_daily_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity: own read/write"
  ON user_daily_activity FOR ALL
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 4. MODULES
-- ─────────────────────────────────────────
CREATE TABLE modules (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title              TEXT        NOT NULL,
  description        TEXT,
  level              TEXT        NOT NULL CHECK (level IN ('A1','A2','B1','B2','C1','C2')),
  "order"            INTEGER     NOT NULL,
  thumbnail_url      TEXT,
  estimated_minutes  INTEGER,
  is_published       BOOLEAN     NOT NULL DEFAULT false,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_modules_updated_at
  BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modules: authenticated read"
  ON modules FOR SELECT
  TO authenticated
  USING (is_published = true);

-- ─────────────────────────────────────────
-- 5. LESSONS
-- ─────────────────────────────────────────
CREATE TABLE lessons (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id          UUID        NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title              TEXT        NOT NULL,
  description        TEXT,
  level              TEXT        NOT NULL CHECK (level IN ('A1','A2','B1','B2','C1','C2')),
  category           TEXT        NOT NULL CHECK (category IN ('vocabulary','grammar','listening','speaking','writing')),
  "order"            INTEGER     NOT NULL,
  xp_reward          INTEGER     NOT NULL DEFAULT 20,
  estimated_minutes  INTEGER,
  is_published       BOOLEAN     NOT NULL DEFAULT false,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lessons_module   ON lessons(module_id);
CREATE INDEX idx_lessons_level    ON lessons(level);
CREATE INDEX idx_lessons_category ON lessons(category);

CREATE TRIGGER trg_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lessons: authenticated read"
  ON lessons FOR SELECT
  TO authenticated
  USING (is_published = true);

-- ─────────────────────────────────────────
-- 6. EXERCISES
-- ─────────────────────────────────────────
CREATE TABLE exercises (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id    UUID        NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  type         TEXT        NOT NULL CHECK (type IN ('voice','dictation','writing','multiple_choice','fill_blank')),
  "order"      INTEGER     NOT NULL,
  content      JSONB       NOT NULL,
  xp_reward    INTEGER     NOT NULL DEFAULT 5,
  difficulty   INTEGER     NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 3),
  is_published BOOLEAN     NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_exercises_lesson ON exercises(lesson_id, "order");

CREATE TRIGGER trg_exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exercises: authenticated read"
  ON exercises FOR SELECT
  TO authenticated
  USING (is_published = true);

-- ─────────────────────────────────────────
-- 7. USER_MODULE_PROGRESS
-- ─────────────────────────────────────────
CREATE TABLE user_module_progress (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id    UUID        NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  status       TEXT        NOT NULL DEFAULT 'locked' CHECK (status IN ('locked','available','in_progress','completed')),
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

CREATE INDEX idx_user_module_progress_user ON user_module_progress(user_id);

CREATE TRIGGER trg_user_module_progress_updated_at
  BEFORE UPDATE ON user_module_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE user_module_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "module_progress: own read/write"
  ON user_module_progress FOR ALL
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 8. USER_LESSON_PROGRESS
-- ─────────────────────────────────────────
CREATE TABLE user_lesson_progress (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id        UUID        NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status           TEXT        NOT NULL DEFAULT 'locked' CHECK (status IN ('locked','available','in_progress','completed')),
  last_exercise_id UUID        REFERENCES exercises(id) ON DELETE SET NULL,
  score            INTEGER     CHECK (score BETWEEN 0 AND 100),
  attempts         INTEGER     NOT NULL DEFAULT 0,
  completed_at     TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_user_lesson_progress_user   ON user_lesson_progress(user_id);
CREATE INDEX idx_user_lesson_progress_lesson ON user_lesson_progress(lesson_id);

CREATE TRIGGER trg_user_lesson_progress_updated_at
  BEFORE UPDATE ON user_lesson_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_progress: own read/write"
  ON user_lesson_progress FOR ALL
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 9. USER_EXERCISE_PROGRESS
-- ─────────────────────────────────────────
CREATE TABLE user_exercise_progress (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id         UUID        NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  lesson_progress_id  UUID        NOT NULL REFERENCES user_lesson_progress(id) ON DELETE CASCADE,
  status              TEXT        NOT NULL CHECK (status IN ('completed','skipped','failed')),
  score               INTEGER     CHECK (score BETWEEN 0 AND 100),
  response            JSONB,
  time_spent_seconds  INTEGER,
  completed_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_exercise_progress_user   ON user_exercise_progress(user_id);
CREATE INDEX idx_user_exercise_progress_lesson ON user_exercise_progress(lesson_progress_id);

ALTER TABLE user_exercise_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exercise_progress: own read/write"
  ON user_exercise_progress FOR ALL
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 10. XP_TRANSACTIONS
-- ─────────────────────────────────────────
CREATE TABLE xp_transactions (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount         INTEGER     NOT NULL,
  source         TEXT        NOT NULL CHECK (source IN ('exercise_completed','lesson_completed','streak_bonus','reward_bonus','manual_adjustment')),
  reference_id   UUID,
  reference_type TEXT        CHECK (reference_type IN ('exercise','lesson','streak','reward')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_xp_transactions_user ON xp_transactions(user_id);

ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "xp: own read"
  ON xp_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 11. REWARDS
-- ─────────────────────────────────────────
CREATE TABLE rewards (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT        NOT NULL,
  description     TEXT,
  unlock_hint     TEXT,
  category        TEXT        NOT NULL CHECK (category IN ('surprise','dinner','date','massage','makeup')),
  code            TEXT        UNIQUE,
  icon            TEXT,
  condition_type  TEXT        NOT NULL CHECK (condition_type IN ('module_completed','lesson_completed','streak_reached','xp_reached','exercises_completed','lessons_count')),
  condition_value JSONB       NOT NULL,
  is_active       BOOLEAN     NOT NULL DEFAULT true,
  display_order   INTEGER     NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_rewards_updated_at
  BEFORE UPDATE ON rewards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rewards: authenticated read"
  ON rewards FOR SELECT
  TO authenticated
  USING (is_active = true);

-- ─────────────────────────────────────────
-- 12. USER_REWARDS
-- ─────────────────────────────────────────
CREATE TABLE user_rewards (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reward_id    UUID        NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  unlocked_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_redeemed  BOOLEAN     NOT NULL DEFAULT false,
  redeemed_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, reward_id)
);

CREATE INDEX idx_user_rewards_user ON user_rewards(user_id);

ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_rewards: own read"
  ON user_rewards FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "user_rewards: own update"
  ON user_rewards FOR UPDATE
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- TRIGGER: Crear perfil y settings al registrarse
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, first_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'first_name', 'Usuario')
    );

  INSERT INTO user_settings (user_id)
    VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─────────────────────────────────────────
-- FUNCIÓN: Registrar actividad y actualizar streak
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION record_daily_activity(
  p_user_id         UUID,
  p_xp_earned       INTEGER,
  p_minutes_studied INTEGER DEFAULT 0
)
RETURNS VOID AS $$
DECLARE
  v_last_date  DATE;
  v_new_streak INTEGER;
BEGIN
  INSERT INTO user_daily_activity (user_id, activity_date, xp_earned, minutes_studied, exercises_completed)
    VALUES (p_user_id, CURRENT_DATE, p_xp_earned, p_minutes_studied, 1)
  ON CONFLICT (user_id, activity_date) DO UPDATE SET
    xp_earned           = user_daily_activity.xp_earned + EXCLUDED.xp_earned,
    minutes_studied     = user_daily_activity.minutes_studied + EXCLUDED.minutes_studied,
    exercises_completed = user_daily_activity.exercises_completed + 1;

  SELECT last_streak_date INTO v_last_date
    FROM profiles WHERE id = p_user_id;

  IF v_last_date = CURRENT_DATE THEN
    v_new_streak := (SELECT streak_days FROM profiles WHERE id = p_user_id);
  ELSIF v_last_date = CURRENT_DATE - INTERVAL '1 day' THEN
    v_new_streak := (SELECT streak_days FROM profiles WHERE id = p_user_id) + 1;
  ELSE
    v_new_streak := 1;
  END IF;

  UPDATE profiles SET
    last_streak_date = CURRENT_DATE,
    streak_days      = v_new_streak,
    longest_streak   = GREATEST(longest_streak, v_new_streak),
    total_xp         = total_xp + p_xp_earned
  WHERE id = p_user_id;

  IF p_xp_earned > 0 THEN
    INSERT INTO xp_transactions (user_id, amount, source)
      VALUES (p_user_id, p_xp_earned, 'exercise_completed');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
