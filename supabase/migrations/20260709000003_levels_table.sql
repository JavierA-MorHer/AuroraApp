-- ============================================================
-- Aurora — Tabla de niveles CEFR
-- ============================================================

CREATE TABLE levels (
  code        TEXT        PRIMARY KEY CHECK (code IN ('A1','A2','B1','B2','C1','C2')),
  name        TEXT        NOT NULL,
  description TEXT,
  "order"     INTEGER     NOT NULL UNIQUE,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "levels: authenticated read"
  ON levels FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Seed inicial — A2/B1/B2 activos para que aparezcan en UI como "Próximamente"
INSERT INTO levels (code, name, description, "order") VALUES
  ('A1', 'Principiante',  'Las bases del inglés: saludos, pronombres, rutina diaria', 1),
  ('A2', 'Elemental',     'Conversaciones del día a día: pasado, lugares, familia',   2),
  ('B1', 'Intermedio',    'Expresa ideas complejas: condicionales, opiniones, planes', 3),
  ('B2', 'Avanzado',      'Fluidez y precisión: matices, argumentos, escritura',      4);

-- FK opcional: garantizar que modules.level referencia un nivel válido
ALTER TABLE modules
  ADD CONSTRAINT fk_modules_level FOREIGN KEY (level) REFERENCES levels(code);
