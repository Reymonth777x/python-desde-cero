-- Migration 020: balance correct-option positions without changing the correct answer text.
-- The options and answer indices in src/lib/course.ts are reordered to match this map.
-- Original index is retained in this VALUES map as a rollback reference.
DO $$
DECLARE
  v_updated integer;
BEGIN
  UPDATE private.quiz_answer_key AS key
     SET correct_option = mapping.correct_option
    FROM (VALUES
    ('module-1', 'b1-l1', 0, 2, 1),
    ('module-1', 'b1-l1', 1, 3, 1),
    ('module-1', 'b1-l2', 0, 0, 2),
    ('module-1', 'b1-l3', 0, 2, 1),
    ('module-1', 'b1-l4', 0, 3, 0),
    ('module-2', 'b2-l1', 0, 2, 1),
    ('module-2', 'b2-l2', 0, 1, 0),
    ('module-2', 'b2-l3', 0, 0, 0),
    ('module-2', 'b2-l4', 0, 1, 0),
    ('module-2', 'b2-l5', 0, 2, 0),
    ('module-2', 'b2-l6', 0, 3, 0),
    ('module-2', 'b2-l7', 0, 1, 0),
    ('module-2', 'b2-l7', 1, 0, 0),
    ('module-2', 'b2-l7', 2, 1, 0),
    ('module-2', 'b2-l7', 3, 2, 0),
    ('module-2', 'b2-l7', 4, 3, 0),
    ('module-3', 'b3-l1', 0, 3, 1),
    ('module-3', 'b3-l2', 0, 0, 0),
    ('module-3', 'b3-l3', 0, 0, 0),
    ('module-3', 'b3-l4', 0, 3, 1),
    ('module-3', 'b3-l5', 0, 0, 0),
    ('module-3', 'b3-l6', 0, 0, 0),
    ('module-3', 'b3-l7', 0, 0, 0),
    ('module-3', 'b3-l8', 0, 3, 1),
    ('module-3', 'b3-l8', 1, 0, 0),
    ('module-3', 'b3-l8', 2, 0, 0),
    ('module-4', 'b4-l1', 0, 1, 0),
    ('module-4', 'b4-l2', 0, 1, 0),
    ('module-4', 'b4-l3', 0, 1, 0),
    ('module-4', 'b4-l4', 0, 2, 0),
    ('module-4', 'b4-l5', 0, 2, 0),
    ('module-4', 'b4-l6', 0, 3, 0),
    ('module-4', 'b4-l7', 0, 3, 0),
    ('module-4', 'b4-l8', 0, 1, 0),
    ('module-4', 'b4-l8', 1, 2, 0),
    ('module-4', 'b4-l8', 2, 3, 0),
    ('module-5', 'b5-l1', 0, 1, 0),
    ('module-5', 'b5-l2', 0, 2, 0),
    ('module-5', 'b5-l2', 1, 0, 0),
    ('module-5', 'b5-l3', 0, 1, 0),
    ('module-5', 'b5-l4', 0, 2, 0)
    ) AS mapping(module_id, lesson_id, question_index, correct_option, original_correct_option)
   WHERE key.module_id = mapping.module_id
     AND key.lesson_id = mapping.lesson_id
     AND key.question_index = mapping.question_index;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  IF v_updated <> 41 THEN
    RAISE EXCEPTION 'Expected to update 41 quiz answer keys, updated %', v_updated;
  END IF;
END;
$$;

-- To roll back, restore each original_correct_option from the VALUES mapping above
-- with the same WHERE clauses before reverting src/lib/course.ts.
