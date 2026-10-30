-- Add server-side answer keys for the three new core integration labs.
-- Existing answer keys and user progress remain unchanged.

INSERT INTO private.quiz_answer_key (
  module_id,
  lesson_id,
  question_index,
  correct_option,
  option_count,
  correct_option_v2
)
VALUES
  ('module-2', 'b2-l8', 0, 2, 4, 2),
  ('module-3', 'b3-l9', 0, 1, 4, 1),
  ('module-4', 'b4-l9', 0, 0, 4, 0)
ON CONFLICT (module_id, lesson_id, question_index)
DO UPDATE SET
  correct_option = EXCLUDED.correct_option,
  option_count = EXCLUDED.option_count,
  correct_option_v2 = EXCLUDED.correct_option_v2;

DO $$
DECLARE
  v_configured integer;
BEGIN
  SELECT count(*)::integer
    INTO v_configured
    FROM private.quiz_answer_key
   WHERE (module_id, lesson_id, question_index, option_count, correct_option_v2) IN (
     ('module-2', 'b2-l8', 0, 4, 2),
     ('module-3', 'b3-l9', 0, 4, 1),
     ('module-4', 'b4-l9', 0, 4, 0)
   );

  IF v_configured <> 3 THEN
    RAISE EXCEPTION 'Expected three core integration answer keys, found %', v_configured;
  END IF;
END;
$$;
