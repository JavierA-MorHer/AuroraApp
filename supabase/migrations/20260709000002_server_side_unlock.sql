-- ============================================================
-- Aurora — Unlock server-side de lecciones
-- ============================================================

-- ─────────────────────────────────────────
-- 1. Inicializar primera lección para un usuario
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION initialize_first_lesson(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_first_lesson_id UUID;
BEGIN
  SELECT l.id INTO v_first_lesson_id
  FROM lessons l
  JOIN modules m ON m.id = l.module_id
  WHERE l.is_published = true
    AND m.is_published = true
  ORDER BY m."order" ASC, l."order" ASC
  LIMIT 1;

  IF v_first_lesson_id IS NOT NULL THEN
    INSERT INTO user_lesson_progress (user_id, lesson_id, status)
    VALUES (p_user_id, v_first_lesson_id, 'available')
    ON CONFLICT (user_id, lesson_id) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─────────────────────────────────────────
-- 2. Desbloquear la siguiente lección al completar una
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION unlock_next_lesson()
RETURNS TRIGGER AS $$
DECLARE
  v_module_order  INT;
  v_lesson_order  INT;
  v_next_id       UUID;
BEGIN
  -- Solo actuar cuando status llega a 'completed' por primera vez
  IF NEW.status <> 'completed' THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'completed' THEN
    RETURN NEW;
  END IF;

  -- Obtener la posición en la secuencia global
  SELECT m."order", l."order"
  INTO v_module_order, v_lesson_order
  FROM lessons l
  JOIN modules m ON m.id = l.module_id
  WHERE l.id = NEW.lesson_id;

  -- Buscar la siguiente lección publicada en orden global
  -- El JOIN con modules.order hace que cruce niveles automáticamente
  SELECT l.id INTO v_next_id
  FROM lessons l
  JOIN modules m ON m.id = l.module_id
  WHERE l.is_published  = true
    AND m.is_published  = true
    AND (
      m."order" > v_module_order
      OR (m."order" = v_module_order AND l."order" > v_lesson_order)
    )
  ORDER BY m."order" ASC, l."order" ASC
  LIMIT 1;

  IF v_next_id IS NOT NULL THEN
    INSERT INTO user_lesson_progress (user_id, lesson_id, status)
    VALUES (NEW.user_id, v_next_id, 'available')
    ON CONFLICT (user_id, lesson_id) DO UPDATE
      SET status = CASE
        WHEN user_lesson_progress.status = 'locked' THEN 'available'
        ELSE user_lesson_progress.status  -- no downgrade si ya está in_progress/completed
      END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_unlock_next_lesson
  AFTER INSERT OR UPDATE OF status ON user_lesson_progress
  FOR EACH ROW EXECUTE FUNCTION unlock_next_lesson();

-- ─────────────────────────────────────────
-- 3. Actualizar handle_new_user para inicializar primera lección
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, first_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'first_name', 'Usuario')
    );
  INSERT INTO user_settings (user_id) VALUES (NEW.id);
  PERFORM initialize_first_lesson(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─────────────────────────────────────────
-- 4. Inicializar usuarios ya registrados sin progreso
-- ─────────────────────────────────────────
DO $$
DECLARE
  v_uid UUID;
BEGIN
  FOR v_uid IN SELECT id FROM profiles LOOP
    IF NOT EXISTS (
      SELECT 1 FROM user_lesson_progress WHERE user_id = v_uid
    ) THEN
      PERFORM initialize_first_lesson(v_uid);
    END IF;
  END LOOP;
END;
$$;
