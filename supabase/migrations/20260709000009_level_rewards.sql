-- ============================================================
-- Aurora — Apoyo para Recompensas Basadas en Nivel (Gamificación)
-- ============================================================

-- 1. Eliminar de forma dinámica la restricción CHECK de condition_type en rewards
DO $$
DECLARE
  v_constraint_name TEXT;
BEGIN
  SELECT constraint_name INTO v_constraint_name
  FROM information_schema.table_constraints
  WHERE table_name = 'rewards' AND constraint_type = 'CHECK' AND constraint_name LIKE '%condition_type%';
  
  IF v_constraint_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE rewards DROP CONSTRAINT ' || quote_ident(v_constraint_name);
  END IF;
END $$;

-- 2. Registrar la nueva restricción que admite level_reached
ALTER TABLE rewards 
  ADD CONSTRAINT rewards_condition_type_check 
  CHECK (condition_type IN ('module_completed','lesson_completed','streak_reached','xp_reached','exercises_completed','lessons_count','level_reached'));

-- 3. Re-crear función de chequeo de recompensas para evaluar level_reached
CREATE OR REPLACE FUNCTION check_and_unlock_rewards_for_user(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  r_reward RECORD;
  v_condition_met BOOLEAN;
  v_module_id UUID;
  v_req_days INT;
  v_req_xp INT;
  v_req_level INT;
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

      WHEN 'level_reached' THEN
        v_req_level := (r_reward.condition_value->>'level')::INT;
        -- Comparar directamente con la columna de nivel calculada en profiles
        IF EXISTS (
          SELECT 1 FROM profiles 
          WHERE id = p_user_id AND level >= v_req_level
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

-- 4. Sembrar recompensas basadas en nivel
INSERT INTO rewards (title, description, unlock_hint, category, code, rarity, condition_type, condition_value, is_active, display_order)
VALUES 
  (
    'Café y Postre Especial',
    'Vale por tu postre y café favorito en tu cafetería preferida para celebrar tus primeras palabras en inglés.',
    'Alcanza el Nivel 2 de experiencia',
    'surprise',
    'AURORA-LEVEL2',
    'common',
    'level_reached',
    '{"level": 2}'::jsonb,
    true, 8
  ),
  (
    'Masaje de Pies Exprés',
    'Vale por 15 minutos de un relajante masaje de pies para descansar luego de estudiar.',
    'Alcanza el Nivel 3 de experiencia',
    'massage',
    'AURORA-LEVEL3',
    'rare',
    'level_reached',
    '{"level": 3}'::jsonb,
    true, 9
  ),
  (
    'Cita de Sushi Imperial',
    'Vale por una salida especial a cenar sushi a tu restaurante favorito.',
    'Alcanza el Nivel 5 de experiencia',
    'dinner',
    'AURORA-LEVEL5',
    'unique',
    'level_reached',
    '{"level": 5}'::jsonb,
    true, 10
  )
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  unlock_hint = EXCLUDED.unlock_hint,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  condition_type = EXCLUDED.condition_type,
  condition_value = EXCLUDED.condition_value,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order;
