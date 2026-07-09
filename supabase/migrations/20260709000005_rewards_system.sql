-- ============================================================
-- Aurora — Sistema de Recompensas con Rarezas Dinámicas
-- ============================================================

-- ─────────────────────────────────────────
-- 1. Actualizar el esquema de la tabla rewards
-- ─────────────────────────────────────────
ALTER TABLE rewards 
ADD COLUMN IF NOT EXISTS rarity TEXT NOT NULL DEFAULT 'common' 
CHECK (rarity IN ('common', 'rare', 'special', 'unique'));

-- Limpiar catálogo de recompensas previo
DELETE FROM rewards;

-- ─────────────────────────────────────────
-- 2. Sembrar el catálogo de recompensas A1
-- ─────────────────────────────────────────
DO $$
DECLARE
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
  v_mod5_id UUID;
BEGIN
  -- Obtener dinámicamente los IDs del temario A1 basados en su orden
  SELECT id INTO v_mod1_id FROM modules WHERE level = 'A1' AND "order" = 1 LIMIT 1;
  SELECT id INTO v_mod2_id FROM modules WHERE level = 'A1' AND "order" = 2 LIMIT 1;
  SELECT id INTO v_mod3_id FROM modules WHERE level = 'A1' AND "order" = 3 LIMIT 1;
  SELECT id INTO v_mod4_id FROM modules WHERE level = 'A1' AND "order" = 4 LIMIT 1;
  SELECT id INTO v_mod5_id FROM modules WHERE level = 'A1' AND "order" = 5 LIMIT 1;

  -- 1. Recompensa Módulo 1 (Sorpresa) - Rarity: common
  IF v_mod1_id IS NOT NULL THEN
    INSERT INTO rewards (title, description, unlock_hint, category, code, rarity, condition_type, condition_value, is_active, display_order)
    VALUES (
      'Mensaje Sorpresa',
      'Vale por un mensaje bonito o una carta escrita a mano y escondida.',
      'Completa el módulo "Primeros Pasos"',
      'surprise',
      'AURORA-HELLO',
      'common',
      'module_completed',
      jsonb_build_object('module_id', v_mod1_id),
      true, 1
    );
  END IF;

  -- 2. Recompensa Módulo 2 (Maquillaje) - Rarity: rare
  IF v_mod2_id IS NOT NULL THEN
    INSERT INTO rewards (title, description, unlock_hint, category, code, rarity, condition_type, condition_value, is_active, display_order)
    VALUES (
      'Maquillaje o Skincare',
      'Vale por un momento especial de maquillaje, rutina de skincare o detalle de belleza.',
      'Completa el módulo "Mi Mundo y mi Entorno"',
      'makeup',
      'AURORA-SHINE',
      'rare',
      'module_completed',
      jsonb_build_object('module_id', v_mod2_id),
      true, 2
    );
  END IF;

  -- 3. Recompensa Módulo 3 (Cena) - Rarity: special
  IF v_mod3_id IS NOT NULL THEN
    INSERT INTO rewards (title, description, unlock_hint, category, code, rarity, condition_type, condition_value, is_active, display_order)
    VALUES (
      'Cena a la Carta',
      'Vale por una cena deliciosa preparada o pedida a domicilio especialmente para ti.',
      'Completa el módulo "Vida Cotidiana y Preferencias"',
      'dinner',
      'AURORA-FEAST',
      'special',
      'module_completed',
      jsonb_build_object('module_id', v_mod3_id),
      true, 3
    );
  END IF;

  -- 4. Recompensa Módulo 4 (Plan juntos) - Rarity: unique
  IF v_mod4_id IS NOT NULL THEN
    INSERT INTO rewards (title, description, unlock_hint, category, code, rarity, condition_type, condition_value, is_active, display_order)
    VALUES (
      'Plan Juntos',
      'Vale por un picnic, paseo en parque o aventura sorpresa explorando la ciudad.',
      'Completa el módulo "Explorando la Ciudad"',
      'date',
      'AURORA-ROUTE',
      'unique',
      'module_completed',
      jsonb_build_object('module_id', v_mod4_id),
      true, 4
    );
  END IF;

  -- 5. Recompensa Módulo 5 (Masaje) - Rarity: special
  IF v_mod5_id IS NOT NULL THEN
    INSERT INTO rewards (title, description, unlock_hint, category, code, rarity, condition_type, condition_value, is_active, display_order)
    VALUES (
      'Masaje Relajante',
      'Vale por un masaje prolongado y relajante para desconectar.',
      'Completa el módulo "Habilidades y Descripciones"',
      'massage',
      'AURORA-RELAX',
      'special',
      'module_completed',
      jsonb_build_object('module_id', v_mod5_id),
      true, 5
    );
  END IF;

  -- 6. Racha de 7 días (Sorpresa) - Rarity: common
  INSERT INTO rewards (title, description, unlock_hint, category, code, rarity, condition_type, condition_value, is_active, display_order)
  VALUES (
    'Detalle Dulce',
    'Vale por tu dulce, chocolate o helado favorito para disfrutar hoy.',
    'Mantén una racha de 7 días',
    'surprise',
    'AURORA-SWEET',
    'common',
    'streak_reached',
    '{"days": 7}'::jsonb,
    true, 6
  );

  -- 7. 15 Lecciones completadas (Cita de Cine) - Rarity: unique
  INSERT INTO rewards (title, description, unlock_hint, category, code, rarity, condition_type, condition_value, is_active, display_order)
  VALUES (
    'Cita de Cine',
    'Vale por una tarde/noche de cine con palomitas para ver la película que elijas.',
    'Completa 15 lecciones en total',
    'date',
    'AURORA-CINEMA',
    'unique',
    'lessons_count',
    '{"count": 15}'::jsonb,
    true, 7
  );

END $$;

-- ─────────────────────────────────────────
-- 3. Función y Triggers para Desbloqueo Automático
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION check_and_unlock_rewards_for_user(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  r_reward RECORD;
  v_condition_met BOOLEAN;
  v_module_id UUID;
  v_req_days INT;
  v_req_xp INT;
  v_req_count INT;
  v_completed_lessons_count INT;
BEGIN
  -- Contar lecciones completadas totales por el usuario
  SELECT COUNT(*) INTO v_completed_lessons_count
  FROM user_lesson_progress
  WHERE user_id = p_user_id AND status = 'completed';

  -- Iterar sobre todas las recompensas activas que el usuario aún NO tenga en user_rewards
  FOR r_reward IN 
    SELECT r.* 
    FROM rewards r
    LEFT JOIN user_rewards ur ON ur.reward_id = r.id AND ur.user_id = p_user_id
    WHERE r.is_active = true AND ur.id IS NULL
  LOOP
    v_condition_met := false;

    CASE r_reward.condition_type
      WHEN 'module_completed' THEN
        v_module_id := (r_reward.condition_value->>'module_id')::UUID;
        IF v_module_id IS NOT NULL THEN
          -- El módulo se considera completo si todas las lecciones publicadas del mismo están en estado 'completed'
          IF NOT EXISTS (
            SELECT 1 
            FROM lessons l
            LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = l.id AND ulp.user_id = p_user_id
            WHERE l.module_id = v_module_id AND l.is_published = true
              AND (ulp.id IS NULL OR ulp.status <> 'completed')
          ) AND EXISTS (
            SELECT 1 FROM lessons WHERE module_id = v_module_id AND is_published = true
          ) THEN
            v_condition_met := true;
          END IF;
        END IF;

      WHEN 'streak_reached' THEN
        v_req_days := (r_reward.condition_value->>'days')::INT;
        IF EXISTS (
          SELECT 1 FROM profiles 
          WHERE id = p_user_id AND streak_days >= v_req_days
        ) THEN
          v_condition_met := true;
        END IF;

      WHEN 'xp_reached' THEN
        v_req_xp := (r_reward.condition_value->>'xp')::INT;
        IF EXISTS (
          SELECT 1 FROM profiles 
          WHERE id = p_user_id AND total_xp >= v_req_xp
        ) THEN
          v_condition_met := true;
        END IF;

      WHEN 'lessons_count' THEN
        v_req_count := (r_reward.condition_value->>'count')::INT;
        IF v_completed_lessons_count >= v_req_count THEN
          v_condition_met := true;
        END IF;

      ELSE
        NULL;
    END CASE;

    -- Registrar desbloqueo si se cumple la condición
    IF v_condition_met THEN
      INSERT INTO user_rewards (user_id, reward_id, unlocked_at)
      VALUES (p_user_id, r_reward.id, now())
      ON CONFLICT (user_id, reward_id) DO NOTHING;
    END IF;

  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para evaluar tras progreso de una lección
CREATE OR REPLACE FUNCTION trg_evaluate_rewards_helper()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM check_and_unlock_rewards_for_user(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_evaluate_rewards_on_lesson ON user_lesson_progress;
CREATE TRIGGER trg_evaluate_rewards_on_lesson
  AFTER INSERT OR UPDATE OF status ON user_lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION trg_evaluate_rewards_helper();

-- Trigger para evaluar tras cambios de Racha o XP en profiles
CREATE OR REPLACE FUNCTION trg_evaluate_rewards_profile_helper()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM check_and_unlock_rewards_for_user(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_evaluate_rewards_on_profile ON profiles;
CREATE TRIGGER trg_evaluate_rewards_on_profile
  AFTER UPDATE OF streak_days, total_xp ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trg_evaluate_rewards_profile_helper();
