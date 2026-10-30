import { describe, expect, it } from 'vitest';
import { courseModules } from '@/lib/course';
import { toPublicSampleLesson } from './public-sample';

describe('toPublicSampleLesson', () => {
  it('returns only the approved first-lesson teaching fields', () => {
    const lesson = courseModules[0].lessons[0];
    const sample = toPublicSampleLesson(lesson);

    expect(sample.id).toBe('b1-l1');
    expect(sample.section).toBe('1.1');
    expect(sample.title).toBe('Resolver problemas mediante algoritmos');
    expect(Object.keys(sample).sort()).toEqual([
      'commonMistakes',
      'estimatedMinutes',
      'example',
      'exampleOutput',
      'exercise',
      'explanation',
      'id',
      'objectives',
      'section',
      'title',
      'walkthrough',
    ]);
    expect(Object.keys(sample.exercise).sort()).toEqual([
      'hints',
      'starterCode',
      'statement',
      'title',
    ]);
  });

  it('never includes quizzes, keys, solutions or hidden expected outputs', () => {
    const lesson = courseModules[0].lessons[0];
    const sample = toPublicSampleLesson(lesson);
    const serialized = JSON.stringify(sample);

    expect(sample).not.toHaveProperty('questions');
    expect(sample.exercise).not.toHaveProperty('solution');
    expect(sample.exercise).not.toHaveProperty('tests');
    expect(serialized).not.toContain('"answer"');
    expect(serialized).not.toContain('"explanation"');
    expect(serialized).not.toContain('"solution"');
    expect(serialized).not.toContain('"tests"');
    expect(serialized).not.toContain('"expected"');
    for (const question of lesson.questions) {
      expect(serialized).not.toContain(question.prompt);
      expect(serialized).not.toContain(question.explanation);
    }
  });

  it('keeps the exercise editable without exposing persistence or grading data', () => {
    const sample = toPublicSampleLesson(courseModules[0].lessons[0]);

    expect(sample.exercise.starterCode).toContain('precio = 3200');
    expect(sample.exercise.statement).toContain('calcula el cambio');
    expect(sample.exercise.hints.length).toBeGreaterThan(0);
  });
});
