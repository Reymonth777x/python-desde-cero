import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { courseModules } from './course';

function expectedKeysFromCourse(): string[] {
  const keys: string[] = [];
  for (const courseModule of courseModules) {
    for (const lesson of courseModule.lessons) {
      if (!lesson.questions || lesson.questions.length === 0) continue;
      for (let i = 0; i < lesson.questions.length; i++) {
        const q = lesson.questions[i];
        keys.push(
          `'${courseModule.id}', '${lesson.id}', ${i}, ${q.answer}, ${q.options.length}`
        );
      }
    }
  }
  return keys.sort();
}

function keysFromMigrationSql(sql: string): string[] {
  const keys: string[] = [];
  const insertRegex = /INSERT INTO private\.quiz_keys \(module_id, lesson_id, question_index, correct_index, options_count\) VALUES \(([^)]+)\);/g;
  let match: RegExpExecArray | null;
  while ((match = insertRegex.exec(sql)) !== null) {
    keys.push(match[1].trim());
  }
  return keys.sort();
}

describe('quiz_keys drift detection', () => {
  it('las claves SQL en la migración coinciden con src/lib/course.ts', () => {
    const expected = expectedKeysFromCourse();
    const sql = readFileSync(
      new URL('../../supabase/migrations/20261026100000_013_quiz_keys_and_submit_quiz.sql', import.meta.url),
      'utf8',
    );
    const actual = keysFromMigrationSql(sql);
    expect(actual).toEqual(expected);
  });
});