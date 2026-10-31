import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const permissionsSql = readFileSync(
  new URL('../supabase/tests/permissions.sql', import.meta.url),
  'utf8',
);

describe('Supabase permission test artifacts', () => {
  it('uses the current protected tables and RPCs', () => {
    expect(permissionsSql).toContain('private.quiz_answer_key');
    expect(permissionsSql).toContain('private.quiz_attempts');
    expect(permissionsSql).toContain('public.submit_quiz_v2');
    expect(permissionsSql).toContain('public.record_orilla_run');
    expect(permissionsSql).toContain('public.orilla_runs');

    expect(permissionsSql).not.toContain('public.quiz_attempts');
    expect(permissionsSql).not.toContain('private.quiz_keys');
    expect(permissionsSql).not.toContain('submit_quiz(');
  });

  it('contains no unfinished fragments or psql-only fixture commands', () => {
    expect(permissionsSql).not.toMatch(/Parte\\s+\\d+\\s+escrita/i);
    expect(permissionsSql).not.toMatch(/^\\\\(?:set|gset|connect|include)\\b/m);
    expect(permissionsSql).toContain('SELECT * FROM finish();');
    expect(permissionsSql.trimEnd().endsWith('ROLLBACK;')).toBe(true);
  });

  it('keeps the pgTAP plan in sync with the assertion count', () => {
    const assertions = permissionsSql.match(/^\\s*SELECT\\s+(?:ok|is|throws_ok|lives_ok)\\(/gim) ?? [];
    expect(assertions).toHaveLength(69);
    expect(permissionsSql).toContain('SELECT plan(69);');
  });

  it('does not ship the old generator that emitted a cascading TRUNCATE', () => {
    expect(existsSync(new URL('./gen-quiz-keys.ts', import.meta.url))).toBe(false);
  });
});
