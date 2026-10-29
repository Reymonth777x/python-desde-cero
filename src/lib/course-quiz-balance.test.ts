import { describe, expect, it } from 'vitest';
import { courseModules } from './course';

describe('quiz answer position balance', () => {
  it('does not reveal a reliable correct-answer position pattern', () => {
    const questions = courseModules.flatMap((module) => module.lessons.flatMap((lesson) => lesson.questions));
    const counts = [0, 1, 2, 3].map((index) => questions.filter((question) => question.answer === index).length);
    const total = counts.reduce((sum, count) => sum + count, 0);

    expect(total).toBeGreaterThan(0);
    expect(counts.every((count) => count > 0)).toBe(true);
    expect(Math.max(...counts) / total).toBeLessThanOrEqual(0.35);
  });
});
