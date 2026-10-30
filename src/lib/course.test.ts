import { describe, expect, it } from 'vitest';
import { courseModules, gradeQuiz } from './course';

describe('ruta de aprendizaje Python Essentials 1', () => {
  it('mantiene cuatro módulos y el número previsto de lecciones', () => {
    expect(courseModules.map((item) => item.id)).toEqual(['module-1', 'module-2', 'module-3', 'module-4']);
    expect(courseModules.map((item) => item.lessons.length)).toEqual([4, 7, 8, 8]);
  });
  it('termina cada módulo con una evaluación y mantiene identificadores únicos', () => {
    for (const courseModule of courseModules) {
      const ids = courseModule.lessons.map((lesson) => lesson.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(courseModule.lessons[courseModule.lessons.length - 1]?.assessment).toBe(true);
      expect(courseModule.lessons.slice(0, -1).every((lesson) => !lesson.assessment)).toBe(true);
    }
  });
  it('incluye objetivos, explicación, ejemplo, ejercicio y preguntas válidas', () => {
    for (const courseModule of courseModules) for (const lesson of courseModule.lessons) {
      expect(lesson.objectives.length).toBeGreaterThan(0);
      expect(lesson.explanation.length).toBeGreaterThan(0);
      expect(lesson.example.length).toBeGreaterThan(0);
      expect(lesson.exercise.statement.length).toBeGreaterThan(0);
      expect(lesson.exercise.solution.length).toBeGreaterThan(0);
      expect(lesson.exercise.tests.length).toBeGreaterThan(0);
      expect(lesson.questions.length).toBeGreaterThan(0);
      for (const question of lesson.questions) {
        expect(question.options.length).toBeGreaterThan(1);
        expect(question.answer).toBeGreaterThanOrEqual(0);
        expect(question.answer).toBeLessThan(question.options.length);
      }
    }
  });
  it('califica correctamente y exige al menos 75 por ciento', () => {
    const questions = [
      { prompt: '1', options: ['a', 'b'], answer: 0, explanation: '' },
      { prompt: '2', options: ['a', 'b'], answer: 1, explanation: '' },
      { prompt: '3', options: ['a', 'b'], answer: 0, explanation: '' },
      { prompt: '4', options: ['a', 'b'], answer: 1, explanation: '' },
    ];
    expect(gradeQuiz(questions, [0, 1, 0, 0])).toEqual({ correct: 3, total: 4, score: 75, passed: true });
    expect(gradeQuiz(questions, [0, 0, 1, 0]).passed).toBe(false);
    expect(gradeQuiz([], []).passed).toBe(false);
    expect(gradeQuiz(questions, [0]).score).toBe(25);
  });
});
