-- ============================================================
-- Aurora — Palabra del día
-- Tabla con 365 palabras indexadas por día del año
-- ============================================================

CREATE TABLE words_of_day (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_year    INTEGER     NOT NULL UNIQUE CHECK (day_of_year BETWEEN 1 AND 365),
  word           TEXT        NOT NULL,
  translation    TEXT        NOT NULL,
  part_of_speech TEXT        NOT NULL DEFAULT 'word',  -- noun, verb, adjective, adverb, phrase
  example        TEXT        NOT NULL,
  example_es     TEXT        NOT NULL,
  phonetic       TEXT,                                 -- aproximación: "ri-ZI-lient"
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE words_of_day ENABLE ROW LEVEL SECURITY;

CREATE POLICY "words_of_day: authenticated read"
  ON words_of_day FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX idx_words_of_day_day ON words_of_day (day_of_year);
