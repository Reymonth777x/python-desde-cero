import { courseModules } from '../src/lib/course';

function generateQuizKeysSql(): string {
  const lines: string[] = [
    '-- Generado por scripts/gen-quiz-keys.ts desde src/lib/course.ts',
    '-- NO EDITAR MANUALMENTE: regénere con `npx tsx scripts/gen-quiz-keys.ts`',
    '',
    'TRUNCATE TABLE private.quiz_keys RESTART IDENTITY CASCADE;',
    '',
  ];

  for (const courseModule of courseModules) {
    for (const lesson of courseModule.lessons) {
      if (!lesson.questions || lesson.questions.length === 0) continue;

      for (let qIndex = 0; qIndex < lesson.questions.length; qIndex++) {
        const q = lesson.questions[qIndex];
        lines.push(
          `INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('${courseModule.id}', '${lesson.id}', ${qIndex}, ${q.answer}, ${q.options.length});`
        );
      }
    }
  }

  lines.push('');
  return lines.join('\n');
}

console.log(generateQuizKeysSql());