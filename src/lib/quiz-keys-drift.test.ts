import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { courseModules } from './course';

function expectedKeysFromCourse(): string[] {
  const keys: string[] = [];
  for (const courseModule of courseModules) {
    for (const lesson of courseModule.lessons) {
      for (let i = 0; i < lesson.questions.length; i++) {
        const q = lesson.questions[i];
        keys.push(`'${courseModule.id}', '${lesson.id}', ${i}, ${q.answer}, ${q.options.length}`);
      }
    }
  }
  return keys.sort();
}

function keysFromBalanceMigration(sql: string): string[] {
  const keys: string[] = [];
  const rowRegex = /\('([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+),\s*(\d+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = rowRegex.exec(sql)) !== null) {
    keys.push(`'${match[1]}', '${match[2]}', ${match[3]}, ${match[4]}, 4`);
  }
  return keys.sort();
}

describe('quiz answer-key drift detection', () => {
  it('las claves finales de la migración 020 coinciden con src/lib/course.ts', () => {
    const expected = expectedKeysFromCourse();
    const sql = readFileSync(
      new URL('../../supabase/migrations/20261029050000_020_balance_quiz_answer_positions.sql', import.meta.url),
      'utf8',
    );
    const actual = keysFromBalanceMigration(sql);
    expect(actual).toHaveLength(expected.length);
    expect(actual).toEqual(expected);
  });
});
