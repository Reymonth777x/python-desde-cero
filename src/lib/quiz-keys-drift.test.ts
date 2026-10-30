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

function keysFromPracticeMigration(sql: string): string[] {
  const keys: string[] = [];
  const rowRegex = /\('([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = rowRegex.exec(sql)) !== null) {
    keys.push("'" + match[1] + "', '" + match[2] + "', " + match[3] + ", " + match[6] + ", " + match[5]);
  }
  return keys.sort();
}

describe('quiz answer-key drift detection', () => {
  it('las claves finales de la migración 020 coinciden con src/lib/course.ts', () => {
    const expected = expectedKeysFromCourse();
    const sql = readFileSync(
      new URL('../../supabase/migrations/20261029051953_020_balance_quiz_answer_positions_v2.sql', import.meta.url),
      'utf8',
    );
    const additionalSql = readFileSync(
      new URL('../../supabase/migrations/20261030051205_add_three_core_integration_labs.sql', import.meta.url),
      'utf8',
    );
    const previousKeys = [...keysFromBalanceMigration(sql), ...keysFromPracticeMigration(additionalSql)]
      .filter((key) => !key.startsWith("'module-1', 'b1-l4',"));
    const finalAssessmentSql = readFileSync(
      new URL('../../supabase/migrations/20261030064000_024_add_required_pe1_assessments_and_project.sql', import.meta.url),
      'utf8',
    );
    const actual = [...previousKeys, ...keysFromPracticeMigration(finalAssessmentSql)].sort();
    expect(sql).toContain('SET correct_option_v2 = mapping.correct_option_v2');
    expect(sql).toContain('CREATE OR REPLACE FUNCTION public.submit_quiz_v2');
    expect(sql).not.toContain('SET correct_option = mapping.correct_option');
    expect(finalAssessmentSql).toMatch(/ON CONFLICT \(module_id, lesson_id, question_index\)\s+DO UPDATE SET/);
    expect(finalAssessmentSql).not.toContain('DELETE FROM private.quiz_answer_key');
    expect(actual).toHaveLength(expected.length);
    expect(actual).toEqual(expected);
  });
});
