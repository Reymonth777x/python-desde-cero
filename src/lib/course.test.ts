import { describe, expect, it } from 'vitest';
import { courseModules, gradeQuiz } from './course';

describe('ruta de aprendizaje PE1', () => {
  it('incluye los cuatro módulos y las secciones oficiales principales', () => {
    expect(courseModules.map((courseModule) => courseModule.id)).toEqual([
      'module-1',
      'module-2',
      'module-3',
      'module-4',
    ]);
    expect(courseModules.map((courseModule) => courseModule.lessons.length)).toEqual([
      4, 7, 8, 8,
    ]);
  });

  it('asigna preguntas y ejemplos a cada actividad y mantiene ids únicos por módulo', () => {
    for (const courseModule of courseModules) {
      const ids = courseModule.lessons.map((lesson) => lesson.id);
      expect(new Set(ids).size).toBe(ids.length);

      for (const lesson of courseModule.lessons) {
        expect(lesson.objectives.length).toBeGreaterThan(0);
        expect(lesson.explanation.length).toBeGreaterThan(0);
        expect(lesson.example.length).toBeGreaterThan(0);
        expect(lesson.exercise.length).toBeGreaterThan(0);
        expect(lesson.questions.length).toBeGreaterThan(0);

        for (const question of lesson.questions) {
          expect(question.options.length).toBeGreaterThan(1);
          expect(question.answer).toBeGreaterThanOrEqual(0);
          expect(question.answer).toBeLessThan(question.options.length);
        }
      }
    }
  });

  it('califica todas las respuestas y exige al menos 75 por ciento', () => {
    const questions = [
      { prompt: '1', options: ['a', 'b'], answer: 0, explanation: '' },
      { prompt: '2', options: ['a', 'b'], answer: 1, explanation: '' },
      { prompt: '3', options: ['a', 'b'], answer: 0, explanation: '' },
      { prompt: '4', options: ['a', 'b'], answer: 1, explanation: '' },
    ];

    expect(gradeQuiz(questions, [0, 1, 0, 0])).toEqual({
      correct: 3,
      total: 4,
      score: 75,
      passed: true,
    });
    expect(gradeQuiz(questions, [0, 0, 1, 0]).passed).toBe(false);
    expect(gradeQuiz([], []).passed).toBe(false);
  });
});
