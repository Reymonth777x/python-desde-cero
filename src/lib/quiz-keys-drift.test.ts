import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { courseModules } from './course';

function expectedKeysFromCourse(): string[] {
  return courseModules.flatMap((courseModule) => courseModule.lessons.flatMap((lesson) =>
    lesson.questions.map((question, index) =>
      `'${courseModule.id}', '${lesson.id}', ${index}, ${question.answer}, ${question.options.length}, ${question.answer}`,
    ),
  )).sort();
}

function keysFromMigrationSql(sql: string): string[] {
  const rows: string[] = [];
  const regex = /\('([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/g;
  for (const match of sql.matchAll(regex)) rows.push(`'${match[1]}', '${match[2]}', ${match[3]}, ${match[4]}, ${match[5]}, ${match[6]}`);
  return rows.sort();
}

describe('quiz answer-key drift detection', () => {
  it('keeps the Supabase answer keys aligned with the displayed course questions', () => {
    const source = readFileSync(new URL('../../supabase/migrations/20261030050000_021_pe1_course_catalog_refresh.sql', import.meta.url), 'utf8');
    expect(keysFromMigrationSql(source)).toEqual(expectedKeysFromCourse());
  });
});
