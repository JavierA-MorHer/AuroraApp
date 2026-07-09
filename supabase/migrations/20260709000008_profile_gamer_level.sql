-- ============================================================
-- Aurora — Columna de nivel de usuario calculada en servidor
-- ============================================================

-- Agregar la columna level generada a partir de total_xp
ALTER TABLE profiles 
  ADD COLUMN level INTEGER GENERATED ALWAYS AS (total_xp / 1000 + 1) STORED;
