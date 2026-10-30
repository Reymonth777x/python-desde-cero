import { courseModules } from '../src/lib/course';

function sqlString(value: string): string {
  return value.replace(/'/g, "''");
}

function generateQuizKeysSql(): string {
  const rows: string[] = [];
  for (const courseModule of courseModules) {
    for (const lesson of courseModule.lessons) {
      lesson.questions.forEach((question, questionIndex) => {
        rows.push(
          `  ('${sqlString(courseModule.id)}', '${sqlString(lesson.id)}', ${questionIndex}, ${question.answer}, ${question.options.length}, ${question.answer})`,
        );
      });
    }
  }

  return [
    '-- Generated from src/lib/course.ts; review before applying.',
    "DELETE FROM private.quiz_answer_key WHERE module_id IN ('module-1', 'module-2', 'module-3', 'module-4');",
    '',
    'INSERT INTO private.quiz_answer_key (module_id, lesson_id, question_index, correct_option, option_count, correct_option_v2)',
    'VALUES',
    rows.join(',\n'),
    ';',
    '',
  ].join('\n');
}

console.log(generateQuizKeysSql());
