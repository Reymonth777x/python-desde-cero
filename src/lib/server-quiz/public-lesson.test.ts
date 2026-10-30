import { describe, expect, it } from 'vitest';
import { courseModules } from '@/lib/course';
import { toClientLesson } from './public-lesson';

describe('toClientLesson', () => {
  it('removes quiz answers, quiz explanations, and exercise solutions before client rendering', () => {
    const source = courseModules[0].lessons[0];
    const safe = toClientLesson(source);

    expect(safe.questions).toHaveLength(source.questions.length);
    expect(safe.questions[0]).toEqual({
      prompt: source.questions[0].prompt,
      options: source.questions[0].options,
    });
    expect(safe.questions[0]).not.toHaveProperty('answer');
    expect(safe.questions[0]).not.toHaveProperty('explanation');
    expect(safe.exercise).not.toHaveProperty('solution');
    expect(safe.exercise).toHaveProperty('starterCode');
  });
});
