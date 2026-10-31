-- Add the private answer key for the new Module 2 "Hello, World!" lesson.
-- This migration is additive and leaves historical attempts and progress untouched.

INSERT INTO private.quiz_answer_key (
  module_id,
  lesson_id,
  question_index,
  correct_option,
  option_count,
  correct_option_v2
)
VALUES (
  'module-2',
  'b2-l9',
  0,
  1,
  4,
  1
)
ON CONFLICT (module_id, lesson_id, question_index)
DO UPDATE SET
  correct_option = EXCLUDED.correct_option,
  option_count = EXCLUDED.option_count,
  correct_option_v2 = EXCLUDED.correct_option_v2;
