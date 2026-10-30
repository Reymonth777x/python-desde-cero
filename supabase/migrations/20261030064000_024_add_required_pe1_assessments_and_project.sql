-- 024: Cierra M1 e incorpora el proyecto obligatorio y el examen final PE1.
-- Migración aditiva: conserva claves históricas, intentos y progreso.
-- Probar en una instancia de desarrollo antes de coordinar su aplicación en producción.

INSERT INTO private.quiz_answer_key
  (module_id, lesson_id, question_index, correct_option, option_count, correct_option_v2)
VALUES
  ('module-1', 'b1-l4', 0, 1, 4, 1),
  ('module-1', 'b1-l4', 1, 2, 4, 2),
  ('module-1', 'b1-l4', 2, 0, 4, 0),
  ('module-1', 'b1-l4', 3, 3, 4, 3),
  ('module-1', 'b1-l4', 4, 1, 4, 1),
  ('module-1', 'b1-l4', 5, 2, 4, 2),
  ('module-4', 'b4-l10', 0, 3, 4, 3),
  ('module-4', 'b4-l10', 1, 1, 4, 1),
  ('module-4', 'b4-l10', 2, 2, 4, 2),
  ('module-4', 'b4-l10', 3, 0, 4, 0),
  ('module-4', 'b4-l10', 4, 1, 4, 1),
  ('module-4', 'b4-l11', 0, 0, 4, 0),
  ('module-4', 'b4-l11', 1, 2, 4, 2),
  ('module-4', 'b4-l11', 2, 1, 4, 1),
  ('module-4', 'b4-l11', 3, 0, 4, 0),
  ('module-4', 'b4-l11', 4, 3, 4, 3),
  ('module-4', 'b4-l11', 5, 2, 4, 2),
  ('module-4', 'b4-l11', 6, 1, 4, 1),
  ('module-4', 'b4-l11', 7, 0, 4, 0),
  ('module-4', 'b4-l11', 8, 3, 4, 3),
  ('module-4', 'b4-l11', 9, 2, 4, 2),
  ('module-4', 'b4-l11', 10, 1, 4, 1),
  ('module-4', 'b4-l11', 11, 0, 4, 0)
ON CONFLICT (module_id, lesson_id, question_index)
DO UPDATE SET
  correct_option = EXCLUDED.correct_option,
  option_count = EXCLUDED.option_count,
  correct_option_v2 = EXCLUDED.correct_option_v2;

-- Verificación tras aplicar: b1-l4 = 6 claves, b4-l10 = 5 y b4-l11 = 12.
-- Reversión manual, solo tras revisar intentos asociados:
-- Borrar solo claves b4-l10/b4-l11; restaurar b1-l4/q0 a correct_option=0,
-- option_count=4, correct_option_v2=3 y borrar índices 1..5.
