-- ============================================================
-- Aurora — Seed Nivel A1
-- 5 módulos · 15 lecciones · 60 ejercicios (con explicaciones)
-- Ejecutar en Supabase → SQL Editor
-- NOTA: elimina datos A1 previos antes de insertar
-- ============================================================

-- Limpiar datos anteriores del nivel A1 (cascada a lessons y exercises)
DELETE FROM modules WHERE level = 'A1';

DO $$
DECLARE
  -- Módulos
  mod1 UUID := gen_random_uuid();
  mod2 UUID := gen_random_uuid();
  mod3 UUID := gen_random_uuid();
  mod4 UUID := gen_random_uuid();
  mod5 UUID := gen_random_uuid();

  -- Lecciones módulo 1
  les11 UUID := gen_random_uuid();
  les12 UUID := gen_random_uuid();
  les13 UUID := gen_random_uuid();

  -- Lecciones módulo 2
  les21 UUID := gen_random_uuid();
  les22 UUID := gen_random_uuid();
  les23 UUID := gen_random_uuid();

  -- Lecciones módulo 3
  les31 UUID := gen_random_uuid();
  les32 UUID := gen_random_uuid();
  les33 UUID := gen_random_uuid();

  -- Lecciones módulo 4
  les41 UUID := gen_random_uuid();
  les42 UUID := gen_random_uuid();
  les43 UUID := gen_random_uuid();

  -- Lecciones módulo 5
  les51 UUID := gen_random_uuid();
  les52 UUID := gen_random_uuid();
  les53 UUID := gen_random_uuid();

BEGIN

-- ─────────────────────────────────────────────────────────────
-- MÓDULOS
-- ─────────────────────────────────────────────────────────────
INSERT INTO modules (id, title, description, level, "order", estimated_minutes, is_published)
VALUES
  (mod1, 'Primeros Pasos',
   'Saludos, presentaciones y los primeros pasos en inglés.',
   'A1', 1, 30, true),

  (mod2, 'Mi Mundo y mi Entorno',
   'Tu familia, tu casa y los objetos que te rodean.',
   'A1', 2, 30, true),

  (mod3, 'Vida Cotidiana y Preferencias',
   'Tu rutina diaria, lo que te gusta y lo que haces cada semana.',
   'A1', 3, 30, true),

  (mod4, 'Explorando la Ciudad',
   'Pregunta por lugares, di dónde están las cosas y explora tu entorno.',
   'A1', 4, 30, true),

  (mod5, 'Habilidades y Descripciones',
   'Di lo que puedes y no puedes hacer, y describe el mundo físico.',
   'A1', 5, 30, true);


-- ─────────────────────────────────────────────────────────────
-- LECCIONES
-- ─────────────────────────────────────────────────────────────
INSERT INTO lessons (id, module_id, title, description, level, category, "order", xp_reward, estimated_minutes, is_published)
VALUES
  (les11, mod1, 'Gramática: Pronombres y To Be',
   'Aprende I, you, he, she, it y el verbo To Be en presente afirmativo.',
   'A1', 'grammar', 1, 40, 10, true),

  (les12, mod1, 'Vocabulario: Saludos y Números 1-20',
   'Saludos formales e informales, despedidas y números del 1 al 20.',
   'A1', 'vocabulary', 2, 35, 8, true),

  (les13, mod1, 'Práctica: Preséntate en Inglés',
   'Di tu nombre y cómo estás. ¡Usa tu voz!',
   'A1', 'speaking', 3, 50, 12, true),

  (les21, mod2, 'Gramática: Posesivos y To Be negativo',
   'Adjetivos posesivos (my, your, his, her) y la forma negativa del To Be.',
   'A1', 'grammar', 1, 40, 10, true),

  (les22, mod2, 'Vocabulario: Familia y Colores',
   'Miembros de la familia, colores y objetos del día a día.',
   'A1', 'vocabulary', 2, 35, 8, true),

  (les23, mod2, 'Práctica: Habla de tu Familia',
   'Describe a tu familia y los objetos que te rodean.',
   'A1', 'speaking', 3, 50, 12, true),

  (les31, mod3, 'Gramática: Presente Simple',
   'Verbos like, love, eat, go, listen en afirmativo y negativo.',
   'A1', 'grammar', 1, 40, 10, true),

  (les32, mod3, 'Vocabulario: Comida, Hobbies y Días',
   'Alimentos, pasatiempos, géneros musicales y días de la semana.',
   'A1', 'vocabulary', 2, 35, 8, true),

  (les33, mod3, 'Práctica: Tu Vida en Inglés',
   'Cuéntanos lo que amas hacer. ¡En inglés!',
   'A1', 'speaking', 3, 50, 12, true),

  (les41, mod4, 'Gramática: Wh- Questions y There is / are',
   'Palabras interrogativas y cómo describir qué hay en un lugar.',
   'A1', 'grammar', 1, 40, 10, true),

  (les42, mod4, 'Vocabulario: Lugares y Números 20-100',
   'Lugares de la ciudad y cómo decir los números del 20 al 100.',
   'A1', 'vocabulary', 2, 35, 8, true),

  (les43, mod4, 'Práctica: Pregunta y Explica',
   'Pide indicaciones y describe tu ciudad en inglés.',
   'A1', 'speaking', 3, 50, 12, true),

  (les51, mod5, 'Gramática: Can / Can''t',
   'El verbo modal can para hablar de habilidades y posibilidades.',
   'A1', 'grammar', 1, 40, 10, true),

  (les52, mod5, 'Vocabulario: Verbos de Acción y Ropa',
   'Verbos para hablar de lo que haces y ropa que usas.',
   'A1', 'vocabulary', 2, 35, 8, true),

  (les53, mod5, 'Práctica: ¿Qué puedes hacer?',
   'Di tus habilidades en inglés. ¡Tú puedes!',
   'A1', 'speaking', 3, 50, 12, true);


-- ─────────────────────────────────────────────────────────────
-- EJERCICIOS (con campo "explanation" en el content JSONB)
-- xp_reward: multiple_choice/fill_blank = 10, dictation = 12, voice = 15
-- ─────────────────────────────────────────────────────────────

-- ── Lección 1.1 Gramática: Pronombres y To Be ──────────────
INSERT INTO exercises (id, lesson_id, type, "order", content, xp_reward, difficulty, is_published)
VALUES
  (gen_random_uuid(), les11, 'multiple_choice', 1,
   '{"question": "___ is my brother. (él)", "options": ["I", "She", "He", "We"], "answer": "He", "translation": "¿Cuál significa ''él''?", "explanation": "''He'' es el pronombre para referirse a un hombre. ''She'' es para mujeres, ''I'' para uno mismo y ''We'' para un grupo. El pronombre determina qué forma del To Be usar."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les11, 'fill_blank', 2,
   '{"sentence": "___ am a student.", "answer": "I", "hint": "Primera persona singular", "translation": "___ soy estudiante.", "explanation": "Solo ''I'' (yo) se combina con ''am''. La regla completa del To Be: I am, You are, He/She/It is, We/They are. Esta combinación es fija y no tiene excepciones."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les11, 'multiple_choice', 3,
   '{"question": "Complete: She ___ my teacher.", "options": ["is", "am", "are", "be"], "answer": "is", "translation": "Completa: Ella ___ mi maestra.", "explanation": "Con ''she'' (ella) siempre usamos ''is''. La regla: I→am, You→are, He/She/It→IS. ''Am'' es solo para ''I'', y ''are'' para You/We/They. ''Be'' es la forma del diccionario — en una oración real siempre se conjuga: am / is / are. Nunca ''She be my teacher''."}'::jsonb,
   10, 2, true),

  (gen_random_uuid(), les11, 'fill_blank', 4,
   '{"sentence": "He ___ from Mexico.", "answer": "is", "hint": "To Be con he / she / it", "translation": "Él ___ de México.", "explanation": "Con ''he'', ''she'' e ''it'' el To Be siempre es ''is''. Nunca ''am'' (eso es solo para ''I'') ni ''are'' (eso es para you/we/they). Memoriza: He IS, She IS, It IS."}'::jsonb,
   10, 2, true);

-- ── Lección 1.2 Vocabulario: Saludos y Números ─────────────
INSERT INTO exercises (id, lesson_id, type, "order", content, xp_reward, difficulty, is_published)
VALUES
  (gen_random_uuid(), les12, 'multiple_choice', 1,
   '{"question": "Which is a formal greeting?", "options": ["Hello", "Hi", "Good morning", "Goodbye"], "answer": "Hello", "translation": "¿Cuál es un saludo formal?", "explanation": "''Hello'' es el saludo más versátil: funciona en cualquier situación y a cualquier hora. ''Hi'' es más informal, solo con amigos. ''Good morning'' es específico para la mañana y suena más formal que ''Hello''. ''Goodbye'' no es saludo — es despedida."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les12, 'multiple_choice', 2,
   '{"question": "How do you say ''por favor'' in English?", "options": ["please", "sorry", "excuse me", "thank you"], "answer": "please", "translation": "¿Cómo se dice ''por favor'' en inglés?", "explanation": "''Please'' es la traducción de ''por favor'' y se usa para pedir algo amablemente. ''Sorry'' = disculpa, ''Excuse me'' = permiso o para llamar la atención, ''Thank you'' = gracias. Cada uno tiene un contexto diferente."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les12, 'multiple_choice', 3,
   '{"question": "What is the number 15 in English?", "options": ["fifteen", "fifty", "fourteen", "sixteen"], "answer": "fifteen", "translation": "¿Cuál es el número 15 en inglés?", "explanation": "''Fifteen'' = 15. Los números del 13 al 19 terminan en ''-teen''. Cuidado: ''fifty'' = 50 (suena parecido pero es muy diferente). ''Fourteen'' = 14 y ''sixteen'' = 16. La diferencia entre -teen (decenas) y -ty (múltiplos de 10) es crucial."}'::jsonb,
   10, 2, true),

  (gen_random_uuid(), les12, 'multiple_choice', 4,
   '{"question": "Nice to ___ you! (al conocer a alguien)", "options": ["meet", "see", "know", "find"], "answer": "meet", "translation": "¡Mucho ___ conocerte!", "explanation": "''Nice to meet you'' es el equivalente a ''mucho gusto'' en inglés. ''Meet'' significa conocer a alguien por primera vez en persona. Las otras opciones no funcionan en esta frase: ''see'' es ver, ''know'' es saber/conocer algo ya familiar, ''find'' es encontrar un objeto."}'::jsonb,
   10, 2, true);

-- ── Lección 1.3 Práctica: Preséntate ──────────────────────
INSERT INTO exercises (id, lesson_id, type, "order", content, xp_reward, difficulty, is_published)
VALUES
  (gen_random_uuid(), les13, 'voice', 1,
   '{"target_phrase": "Hello, my name is Naye.", "tip": "Di tu nombre en lugar de Naye", "translation": "Hola, me llamo Naye.", "explanation": "''My name is...'' usa el posesivo ''my'' + el verbo To Be ''is''. Esta es la forma más directa de presentarte. También puedes decir ''I am Naye'' con el mismo significado."}'::jsonb,
   15, 2, true),

  (gen_random_uuid(), les13, 'voice', 2,
   '{"target_phrase": "I am fine, thank you.", "tip": "Pronuncia ''fine'' como fain", "translation": "Estoy bien, gracias.", "explanation": "''I am fine'' es la respuesta más común a ''How are you?''. ''Fine'' significa bien. Siempre añadir ''thank you'' muestra cortesía. En inglés informal: ''I''m fine, thanks.''"}'::jsonb,
   15, 2, true),

  (gen_random_uuid(), les13, 'dictation', 3,
   '{"audio_text": "Hello, my name is Ana.", "prompt": "Escribe lo que escuches", "translation": "Hola, me llamo Ana.", "explanation": "''My name is + nombre'' es la estructura básica de presentación. Nota la coma después de ''Hello'': en inglés las interjecciones van separadas con coma antes del resto de la frase."}'::jsonb,
   12, 2, true),

  (gen_random_uuid(), les13, 'dictation', 4,
   '{"audio_text": "I am fine, thank you.", "prompt": "Escribe lo que escuches", "translation": "Estoy bien, gracias.", "explanation": "Esta frase tiene dos partes: la respuesta (''I am fine'') y la cortesía (''thank you''). En inglés hablado rápido ''I am'' se contrae a ''I''m''. Escuchar y escribir entrena tu oído para distinguir estas contracciones."}'::jsonb,
   12, 2, true);

-- ── Lección 2.1 Gramática: Posesivos y To Be negativo ──────
INSERT INTO exercises (id, lesson_id, type, "order", content, xp_reward, difficulty, is_published)
VALUES
  (gen_random_uuid(), les21, 'multiple_choice', 1,
   '{"question": "Which is a possessive adjective?", "options": ["my", "I", "am", "not"], "answer": "my", "translation": "¿Cuál es un adjetivo posesivo?", "explanation": "''My'' es un adjetivo posesivo: indica que algo te pertenece. ''I'' es un pronombre sujeto, ''am'' es un verbo y ''not'' es un adverbio de negación. Los posesivos en inglés son: my, your, his, her, its, our, their."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les21, 'fill_blank', 2,
   '{"sentence": "This is ___ brother.", "answer": "my", "hint": "Posesivo de primera persona", "translation": "Este es ___ hermano.", "explanation": "''My'' = mi/mis. El posesivo siempre va antes del sustantivo: ''my brother'', nunca ''brother my''. En inglés el orden es: posesivo + sustantivo, igual que en español pero sin cambiar por género o número."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les21, 'multiple_choice', 3,
   '{"question": "I am ___ tired. (forma negativa)", "options": ["not", "no", "don''t", "isn''t"], "answer": "not", "translation": "Yo ___ estoy cansada. (forma negativa)", "explanation": "Para negar el To Be se añade ''not'' directamente después del verbo: I am NOT tired. NO usamos ''don''t'' con To Be (ese es un error muy común). ''Don''t'' se usa con otros verbos como ''I don''t eat''."}'::jsonb,
   10, 2, true),

  (gen_random_uuid(), les21, 'fill_blank', 4,
   '{"sentence": "They ___ not tired.", "answer": "are", "hint": "To Be negativo plural: they are not", "translation": "Ellos ___ están cansados.", "explanation": "Con ''they'' el To Be siempre es ''are''. La forma negativa completa es ''they are not'' o la contracción ''they aren''t''. Nunca ''they is not'' — ese es uno de los errores más comunes en A1."}'::jsonb,
   10, 2, true);

-- ── Lección 2.2 Vocabulario: Familia y Colores ─────────────
INSERT INTO exercises (id, lesson_id, type, "order", content, xp_reward, difficulty, is_published)
VALUES
  (gen_random_uuid(), les22, 'multiple_choice', 1,
   '{"question": "What color is the sky?", "options": ["blue", "red", "green", "yellow"], "answer": "blue", "translation": "¿De qué color es el cielo?", "explanation": "El cielo es ''blue'' (azul). En inglés los colores básicos son: blue, red, green, yellow, white, black, orange, purple. Esta pregunta conecta el vocabulario de colores con objetos del mundo real para que sea más fácil recordarlos."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les22, 'multiple_choice', 2,
   '{"question": "Which word means ''hermano''?", "options": ["brother", "mother", "father", "sister"], "answer": "brother", "translation": "¿Cuál palabra significa ''hermano''?", "explanation": "''Brother'' = hermano. Aprende la familia de a pares opuestos: brother (hermano) ↔ sister (hermana), mother (madre) ↔ father (padre). Así recuerdas cuatro palabras a la vez y los opuestos te ayudan a no confundirlos."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les22, 'fill_blank', 3,
   '{"sentence": "My shirt is ___. (rojo)", "answer": "red", "hint": "Color de las rosas y el amor", "translation": "Mi camisa es ___. (rojo)", "explanation": "Los adjetivos de color van después del verbo To Be: ''My shirt IS red''. Si van antes del sustantivo van sin To Be: ''a red shirt''. En inglés los colores no cambian por género ni número: ''the red shirt'', ''the red shoes'' (no ''reds'')."}'::jsonb,
   10, 2, true),

  (gen_random_uuid(), les22, 'multiple_choice', 4,
   '{"question": "Which is a common household object?", "options": ["book", "pen", "chair", "door"], "answer": "book", "translation": "¿Cuál es un objeto doméstico común?", "explanation": "Las cuatro son objetos cotidianos: book (libro), pen (bolígrafo), chair (silla), door (puerta). En este ejercicio la clave es reconocer ''book'' en inglés. Aprende las cuatro — son palabras A1 esenciales que usarás todo el tiempo."}'::jsonb,
   10, 2, true);

-- ── Lección 2.3 Práctica: Habla de tu Familia ──────────────
INSERT INTO exercises (id, lesson_id, type, "order", content, xp_reward, difficulty, is_published)
VALUES
  (gen_random_uuid(), les23, 'voice', 1,
   '{"target_phrase": "This is my brother.", "tip": "Puedes sustituir ''brother'' por otro familiar", "translation": "Este es mi hermano.", "explanation": "''This is my + familiar'' es la estructura para presentar a alguien. ''This is'' + persona equivale a ''este/esta es''. Puedes usar: sister, mother, father, friend. El posesivo ''my'' no cambia."}'::jsonb,
   15, 2, true),

  (gen_random_uuid(), les23, 'voice', 2,
   '{"target_phrase": "The car is blue.", "tip": "''blue'' suena bluu, la u es larga", "translation": "El carro es azul.", "explanation": "Estructura: artículo + sustantivo + To Be + color. ''The'' indica que hablas de un carro específico. El adjetivo de color va DESPUÉS del verbo To Be cuando describe el sujeto. Si va antes del sustantivo: ''a blue car''."}'::jsonb,
   15, 2, true),

  (gen_random_uuid(), les23, 'dictation', 3,
   '{"audio_text": "I am not tired today.", "prompt": "Escribe lo que escuches", "translation": "No estoy cansada hoy.", "explanation": "''I am not'' es la negación del To Be en primera persona. ''Today'' (hoy) es un adverbio de tiempo que normalmente va al final de la frase. En inglés informal se contrae: ''I''m not tired today''."}'::jsonb,
   12, 2, true),

  (gen_random_uuid(), les23, 'dictation', 4,
   '{"audio_text": "This is my brother.", "prompt": "Escribe lo que escuches", "translation": "Este es mi hermano.", "explanation": "''This is'' sirve para señalar y presentar: personas, objetos, ideas. El posesivo ''my'' muestra la relación. Practica esta estructura cambiando ''brother'' por otros familiares o amigos."}'::jsonb,
   12, 2, true);

-- ── Lección 3.1 Gramática: Presente Simple ─────────────────
INSERT INTO exercises (id, lesson_id, type, "order", content, xp_reward, difficulty, is_published)
VALUES
  (gen_random_uuid(), les31, 'multiple_choice', 1,
   '{"question": "She ___ coffee every morning.", "options": ["drinks", "drink", "drinking", "drank"], "answer": "drinks", "translation": "Ella ___ café cada mañana.", "explanation": "En Presente Simple con he/she/it el verbo lleva ''-s'' al final: drink → drinks. Esta ''s'' es obligatoria y olvidarla es el error más común en A1. ''Drinking'' es gerundio, ''drank'' es pasado."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les31, 'fill_blank', 2,
   '{"sentence": "I ___ to music every day.", "answer": "listen", "hint": "Presente Simple, 1a persona", "translation": "Yo ___ música todos los días.", "explanation": "Con ''I'' (primera persona) el verbo va en su forma base, sin ''-s''. La regla: I/You/We/They + verbo base; He/She/It + verbo+''-s''. ''Every day'' indica hábito, por eso usamos Presente Simple."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les31, 'multiple_choice', 3,
   '{"question": "She doesn''t ___ cats.", "options": ["like", "likes", "liked", "liking"], "answer": "like", "translation": "A ella no le ___ los gatos.", "explanation": "Con ''doesn''t'' el verbo va en forma base, SIN ''-s''. ''Doesn''t'' ya contiene la marca de tercera persona. Error muy común: ''She doesn''t likes'' — incorrecto. El auxiliar ''doesn''t'' absorbe la ''-s'' del verbo principal."}'::jsonb,
   10, 2, true),

  (gen_random_uuid(), les31, 'fill_blank', 4,
   '{"sentence": "We ___ tacos on weekends.", "answer": "eat", "hint": "Presente Simple con we", "translation": "Nosotros ___ tacos los fines de semana.", "explanation": "Con ''we'' el verbo va en forma base sin ''-s''. ''On weekends'' = los fines de semana. El Presente Simple expresa hábitos y rutinas. Esta es una de las estructuras más usadas en inglés cotidiano."}'::jsonb,
   10, 2, true);

-- ── Lección 3.2 Vocabulario: Comida, Hobbies y Días ────────
INSERT INTO exercises (id, lesson_id, type, "order", content, xp_reward, difficulty, is_published)
VALUES
  (gen_random_uuid(), les32, 'multiple_choice', 1,
   '{"question": "Which is a meal?", "options": ["breakfast", "morning", "run", "happy"], "answer": "breakfast", "translation": "¿Cuál es una comida?", "explanation": "''Breakfast'' (desayuno) es la primera comida del día. Las tres comidas principales: breakfast (desayuno), lunch (comida/almuerzo), dinner (cena). ''Morning'' es la mañana (tiempo, no comida), ''run'' es correr y ''happy'' es feliz."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les32, 'multiple_choice', 2,
   '{"question": "What does ''pasatiempo'' mean in English?", "options": ["hobby", "food", "place", "color"], "answer": "hobby", "translation": "¿Cómo se dice ''pasatiempo'' en inglés?", "explanation": "''Hobby'' es la palabra en inglés para pasatiempo o actividad de entretenimiento. Ejemplos: my hobbies are reading, cooking, and dancing. ''Food'' = comida, ''place'' = lugar, ''color'' = color — son categorías de vocabulario completamente diferentes."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les32, 'multiple_choice', 3,
   '{"question": "What is ''miércoles'' in English?", "options": ["Wednesday", "Tuesday", "Thursday", "Monday"], "answer": "Wednesday", "translation": "¿Cómo se dice ''miércoles'' en inglés?", "explanation": "Los días en orden: Monday, Tuesday, WEDNESDAY, Thursday, Friday, Saturday, Sunday. ''Wednesday'' se pronuncia ''wenz-dei'' — la ''d'' del medio es completamente silenciosa. Truco: piensa en ''Wendy'' para recordar la pronunciación."}'::jsonb,
   10, 2, true),

  (gen_random_uuid(), les32, 'fill_blank', 4,
   '{"sentence": "I listen to ___ every day.", "answer": "music", "hint": "Del vocabulario de hobbies", "translation": "Escucho ___ todos los días.", "explanation": "La estructura ''listen to + sustantivo'' siempre necesita el ''to''. Nunca se dice ''listen music'' en inglés — siempre ''listen TO music''. Este es uno de los errores más frecuentes. ''Music'' es incontable en inglés, sin artículo ''a''."}'::jsonb,
   10, 2, true);

-- ── Lección 3.3 Práctica: Tu Vida en Inglés ─────────────────
INSERT INTO exercises (id, lesson_id, type, "order", content, xp_reward, difficulty, is_published)
VALUES
  (gen_random_uuid(), les33, 'voice', 1,
   '{"target_phrase": "I love live music and concerts.", "tip": "''love'' se pronuncia con la boca casi cerrada, parecido a ''lav'' con la vocal más corta que en español", "translation": "Me encanta la música en vivo y los conciertos.", "explanation": "''Love'' + sustantivo expresa un gusto intenso. ''Live music'' (música en vivo) usa ''live'' como adjetivo y se pronuncia ''laiv'', no ''liv''. La conjunción ''and'' une dos sustantivos: ''music'' y ''concerts''."}'::jsonb,
   15, 2, true),

  (gen_random_uuid(), les33, 'voice', 2,
   '{"target_phrase": "We eat delicious tacos on weekends.", "tip": "''delicious'' se pronuncia de-li-shus", "translation": "Comemos tacos deliciosos los fines de semana.", "explanation": "El adjetivo ''delicious'' va antes del sustantivo. ''On weekends'' = los fines de semana. Esta es una oración completa de Presente Simple con ''we'': sujeto + verbo base + adjetivo + sustantivo + expresión de tiempo."}'::jsonb,
   15, 2, true),

  (gen_random_uuid(), les33, 'voice', 3,
   '{"target_phrase": "I like music in the park.", "tip": "''like'' + sustantivo directo, sin gerundio", "translation": "Me gusta la música en el parque.", "explanation": "''Like'' + sustantivo directo expresa un gusto general. En A1 usamos ''like + sustantivo'': ''I like music''. ''In the park'' añade dónde ocurre. El artículo ''the'' indica un parque específico que ambas personas conocen."}'::jsonb,
   15, 2, true),

  (gen_random_uuid(), les33, 'dictation', 4,
   '{"audio_text": "I love live music and concerts.", "prompt": "Escribe lo que escuches", "translation": "Me encanta la música en vivo y los conciertos.", "explanation": "Escucha con atención la diferencia entre ''live'' (laiv, en vivo) y ''love'' (lav). La conjunción ''and'' une dos elementos del mismo tipo. Al escribir, asegúrate de incluir ambas palabras unidas con ''and''."}'::jsonb,
   12, 2, true);

-- ── Lección 4.1 Gramática: Wh- Questions y There is/are ────
INSERT INTO exercises (id, lesson_id, type, "order", content, xp_reward, difficulty, is_published)
VALUES
  (gen_random_uuid(), les41, 'multiple_choice', 1,
   '{"question": "___ is the restaurant? (lugar)", "options": ["Where", "What", "Who", "When"], "answer": "Where", "translation": "¿___ está el restaurante? (lugar)", "explanation": "''Where'' pregunta por un LUGAR. Aprende para qué sirve cada Wh-: Where (dónde), What (qué/cuál), Who (quién), When (cuándo), Why (por qué), How (cómo). Asocia ''Where'' con ''here'' y ''there'' — todas hablan de lugar."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les41, 'fill_blank', 2,
   '{"sentence": "There ___ a park here.", "answer": "is", "hint": "There is = hay (singular)", "translation": "Aquí ___ un parque.", "explanation": "''There is'' = hay (singular o incontable). ''There are'' = hay (plural). La regla: ''a park'' es singular → ''there IS a park''. Cuando el sustantivo es plural: ''there ARE two parks''. Esta estructura no tiene equivalente directo en español."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les41, 'multiple_choice', 3,
   '{"question": "___ time is the concert?", "options": ["What", "Where", "Who", "Why"], "answer": "What", "translation": "¿A ___ hora es el concierto?", "explanation": "''What time'' pregunta la hora exacta: ¿A qué hora? ''When'' pregunta cuándo en general: ¿esta semana, en junio? Ambas son correctas, pero ''What time'' es más precisa. Para saber si son las 7 u las 8, usamos ''What time''."}'::jsonb,
   10, 2, true),

  (gen_random_uuid(), les41, 'fill_blank', 4,
   '{"sentence": "There ___ two parks nearby.", "answer": "are", "hint": "There are = hay (plural)", "translation": "Aquí cerca ___ dos parques.", "explanation": "''Two parks'' es plural → usamos ''there ARE''. La regla es simple: singular → is, plural → are. ''Nearby'' significa ''cerca de aquí''. Esta es una de las estructuras más útiles para describir lugares en inglés."}'::jsonb,
   10, 2, true);

-- ── Lección 4.2 Vocabulario: Lugares y Números 20-100 ──────
INSERT INTO exercises (id, lesson_id, type, "order", content, xp_reward, difficulty, is_published)
VALUES
  (gen_random_uuid(), les42, 'multiple_choice', 1,
   '{"question": "What is 50 in English?", "options": ["fifty", "fifteen", "five", "forty"], "answer": "fifty", "translation": "¿Cómo se dice 50 en inglés?", "explanation": "''Fifty'' = 50. Los múltiplos de 10: twenty (20), thirty (30), forty (40), FIFTY (50), sixty (60). Cuidado con ''fifteen'' (15) vs ''fifty'' (50) — suenan parecido pero son muy diferentes. La ''-ty'' al final indica múltiplo de 10."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les42, 'multiple_choice', 2,
   '{"question": "Which is a place in the city?", "options": ["park", "hospital", "library", "airport"], "answer": "park", "translation": "¿Cuál es un lugar en la ciudad?", "explanation": "Las cuatro son lugares de la ciudad: park (parque), hospital, library (biblioteca), airport (aeropuerto). En este ejercicio la clave es reconocer la palabra ''park'' en inglés. Aprende todas — las necesitarás para pedir indicaciones y moverte en una ciudad."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les42, 'fill_blank', 3,
   '{"sentence": "I go to the ___ every morning.", "answer": "park", "hint": "Lugar verde con árboles y bancas", "translation": "Voy al ___ cada mañana.", "explanation": "El contexto ''every morning'' (cada mañana) sugiere un lugar cotidiano. ''Go to the + lugar'' es la estructura para decir a dónde vas. Nota el artículo ''the'' antes del lugar — indica un parque específico que conoces."}'::jsonb,
   10, 2, true),

  (gen_random_uuid(), les42, 'multiple_choice', 4,
   '{"question": "What does ''restaurante'' mean in English?", "options": ["restaurant", "store", "school", "library"], "answer": "restaurant", "translation": "¿Cómo se dice ''restaurante'' en inglés?", "explanation": "''Restaurant'' en inglés viene del francés, igual que en español — por eso suenan tan parecido. La pronunciación inglesa es ''res-trant'' o ''res-tuh-rant''. ''Store'' = tienda, ''school'' = escuela, ''library'' = biblioteca."}'::jsonb,
   10, 2, true);

-- ── Lección 4.3 Práctica: Pregunta y Explica ───────────────
INSERT INTO exercises (id, lesson_id, type, "order", content, xp_reward, difficulty, is_published)
VALUES
  (gen_random_uuid(), les43, 'voice', 1,
   '{"target_phrase": "Where is the nearest park?", "tip": "''nearest'' = el más cercano", "translation": "¿Dónde está el parque más cercano?", "explanation": "''Where is + the + sustantivo'' pregunta la ubicación de algo. ''Nearest'' es el superlativo de ''near'' (cercano): near → nearer → NEAREST. Esta es la pregunta perfecta para orientarte en una ciudad de habla inglesa."}'::jsonb,
   15, 2, true),

  (gen_random_uuid(), les43, 'voice', 2,
   '{"target_phrase": "What time is the concert tonight?", "tip": "''tonight'' = esta noche", "translation": "¿A qué hora es el concierto esta noche?", "explanation": "''What time is + the + evento'' pregunta la hora exacta. ''Tonight'' significa esta noche — igual que ''today'' (hoy) y ''tomorrow'' (mañana), es una sola palabra que nunca cambia. En preguntas con To Be el verbo se invierte: ''the concert IS'' → ''What time IS the concert''."}'::jsonb,
   15, 2, true),

  (gen_random_uuid(), les43, 'voice', 3,
   '{"target_phrase": "There is a great Mexican restaurant here.", "tip": "''great'' suena greit, ''Mexican'' suena méksican", "translation": "Hay un excelente restaurante mexicano aquí.", "explanation": "''There is a'' introduce algo nuevo en la conversación. ''Great'' = excelente, describe la calidad del lugar. ''Mexican'' describe el tipo de cocina. Practica variando el tipo: ''There is a great Italian restaurant here'', ''There is a great Korean restaurant here''."}'::jsonb,
   15, 3, true),

  (gen_random_uuid(), les43, 'dictation', 4,
   '{"audio_text": "Where is the nearest park?", "prompt": "Escribe lo que escuches", "translation": "¿Dónde está el parque más cercano?", "explanation": "En preguntas con To Be el verbo va antes del sujeto: ''Where IS the park'' (no ''Where the park is''). Al escuchar, presta atención al orden invertido — es diferente al español donde la entonación cambia pero el orden no."}'::jsonb,
   12, 2, true);

-- ── Lección 5.1 Gramática: Can / Can't ─────────────────────
INSERT INTO exercises (id, lesson_id, type, "order", content, xp_reward, difficulty, is_published)
VALUES
  (gen_random_uuid(), les51, 'multiple_choice', 1,
   '{"question": "She ___ speak English.", "options": ["can", "cans", "is", "does"], "answer": "can", "translation": "Ella ___ hablar inglés.", "explanation": "''Can'' es un verbo modal y NUNCA cambia con ningún sujeto: I can, she CAN (nunca ''cans''). Siempre va seguido del verbo en forma base. Esta invariabilidad lo hace muy fácil de usar — sin conjugaciones complicadas."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les51, 'fill_blank', 2,
   '{"sentence": "I ___ drive a truck. (negativo)", "answer": "can''t", "hint": "can + not se contrae en can''t", "translation": "Yo ___ manejar un camión. (negativo)", "explanation": "''Can''t'' es la contracción de ''cannot'' y expresa incapacidad. Se pronuncia ''kant'' sin pausa entre ''can'' y ''t''. En inglés formal se escribe ''cannot'' (una sola palabra, no ''can not'' separado). Compara: ''I CAN cook'' vs ''I CAN''T drive''."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les51, 'multiple_choice', 3,
   '{"question": "I can ___ very well. (cocinar)", "options": ["cook", "cooks", "cooking", "cooked"], "answer": "cook", "translation": "Yo puedo ___ muy bien. (cocinar)", "explanation": "Después de ''can'' el verbo SIEMPRE va en forma base (sin ''to'', sin ''-s'', sin ''-ing''): can cook, can swim, can speak. Nunca ''can cooks'' ni ''can cooking''. Fácil de recordar: si ya usas ''can'', el verbo que viene después no necesita nada extra."}'::jsonb,
   10, 2, true),

  (gen_random_uuid(), les51, 'fill_blank', 4,
   '{"sentence": "She ___ swim fast.", "answer": "can", "hint": "Modal de habilidad", "translation": "Ella ___ nadar rápido.", "explanation": "''Can'' no lleva ''-s'' con ''she/he/it'' — esta es la gran ventaja de los modales en inglés: son invariables. Compara: ''She speaks English'' (Presente Simple, con ''-s'') vs ''She CAN speak'' (modal, sin ''-s''). Los modales simplifican mucho la gramática."}'::jsonb,
   10, 2, true);

-- ── Lección 5.2 Vocabulario: Verbos de Acción y Ropa ───────
INSERT INTO exercises (id, lesson_id, type, "order", content, xp_reward, difficulty, is_published)
VALUES
  (gen_random_uuid(), les52, 'multiple_choice', 1,
   '{"question": "Which is a clothing item?", "options": ["shirt", "pants", "shoes", "jacket"], "answer": "shirt", "translation": "¿Cuál es una prenda de ropa?", "explanation": "Todos son prendas de ropa: shirt (camisa), pants (pantalones), shoes (zapatos), jacket (chaqueta/chamarra). Esta pregunta te introduce al vocabulario de ropa esencial. Nota: ''pants'' en inglés americano = pantalón (¡no ropa interior como en algunos países!)."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les52, 'multiple_choice', 2,
   '{"question": "What does ''correr'' mean in English?", "options": ["run", "eat", "sleep", "read"], "answer": "run", "translation": "¿Cómo se dice ''correr'' en inglés?", "explanation": "''Run'' = correr. Verbos de acción A1 esenciales: run (correr), eat (comer), sleep (dormir), read (leer), walk (caminar), swim (nadar), cook (cocinar). Estos verbos describen acciones físicas y forman la base de tu vocabulario activo."}'::jsonb,
   10, 1, true),

  (gen_random_uuid(), les52, 'fill_blank', 3,
   '{"sentence": "I can ___ in the pool.", "answer": "swim", "hint": "Verbo de acción en el agua", "translation": "Yo puedo ___ en la piscina.", "explanation": "''Swim'' = nadar. El contexto ''in the pool'' (en la alberca/piscina) da la pista: solo se puede nadar en una piscina. La estructura ''can + verbo base'' expresa habilidad. ''The pool'' con artículo ''the'' indica una piscina específica."}'::jsonb,
   10, 2, true),

  (gen_random_uuid(), les52, 'multiple_choice', 4,
   '{"question": "Which word describes physical appearance?", "options": ["tall", "short", "young", "old"], "answer": "tall", "translation": "¿Cuál palabra describe la apariencia física?", "explanation": "Todos son adjetivos descriptivos: tall (alto), short (bajo), young (joven), old (viejo/mayor). Esta pregunta amplía tu vocabulario de descripciones. Los opuestos son importantes: tall↔short, young↔old. Los adjetivos en inglés no cambian por género ni número."}'::jsonb,
   10, 2, true);

-- ── Lección 5.3 Práctica: ¿Qué puedes hacer? ──────────────
INSERT INTO exercises (id, lesson_id, type, "order", content, xp_reward, difficulty, is_published)
VALUES
  (gen_random_uuid(), les53, 'voice', 1,
   '{"target_phrase": "I can speak a little English now.", "tip": "¡Es verdad! Ya puedes decir esto", "translation": "Ahora puedo hablar un poco de inglés.", "explanation": "''A little'' = un poco, se usa con sustantivos incontables como ''English''. Esta frase usa ''can'' + verbo base (speak). ''Now'' al final enfatiza que es un logro reciente. ¡Y es completamente cierto — ya puedes decirla!"}'::jsonb,
   15, 2, true),

  (gen_random_uuid(), les53, 'voice', 2,
   '{"target_phrase": "She can cook very well.", "tip": "''well'' = bien (adverbio)", "translation": "Ella puede cocinar muy bien.", "explanation": "''Very well'' es el adverbio para describir habilidades con precisión. ''Well'' es el adverbio de ''good'': She is a good cook → She can cook WELL. ''Can'' no lleva ''-s'' con ''she'' — los modales son invariables."}'::jsonb,
   15, 2, true),

  (gen_random_uuid(), les53, 'voice', 3,
   '{"target_phrase": "I can''t drive a truck.", "tip": "''can''t'' se pronuncia kant, sin pausa", "translation": "Yo no puedo manejar un camión.", "explanation": "''Can''t'' se distingue de ''can'' principalmente por el tono: ''can'' (afirmativo) se pronuncia débil y corto, ''can''t'' (negativo) es más enfático y termina con ''t''. Al hablar, la entonación es clave para no crear confusión."}'::jsonb,
   15, 3, true),

  (gen_random_uuid(), les53, 'dictation', 4,
   '{"audio_text": "I can speak a little English now.", "prompt": "Escribe lo que escuches", "translation": "Ahora puedo hablar un poco de inglés.", "explanation": "Al escuchar, distingue ''can'' (afirmativo, sonido débil ''kən'') de ''can''t'' (negativo, sonido fuerte ''kænt'' con t final audible). El contexto positivo de la frase confirma que es ''can''. Esta distinción auditiva es esencial en inglés."}'::jsonb,
   12, 2, true);

END $$;
