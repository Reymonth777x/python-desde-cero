import { describe, expect, it } from 'vitest';
import { courseModules, gradeQuiz } from './course';

describe('ruta de aprendizaje Python desde cero', () => {
  it('incluye cuatro módulos principales y una extensión opcional', () => {
    expect(courseModules.map((courseModule) => courseModule.id)).toEqual([
      'module-1',
      'module-2',
      'module-3',
      'module-4',
      'module-5',
    ]);
    expect(courseModules.slice(0, 4).map((courseModule) => courseModule.title)).toEqual([
      'Introducción a Python y a la programación',
      'Tipos de datos, variables, operadores y entrada/salida',
      'Valores booleanos, control de flujo, ciclos y listas',
      'Funciones, tuplas, diccionarios y excepciones',
    ]);
    expect(courseModules[4].optional).toBe(true);
    expect(courseModules[4].title).toContain('extensión práctica');
    expect(courseModules.slice(0, 4).map((courseModule) => courseModule.lessons.length)).toEqual([
      4, 8, 9, 9,
    ]);
    expect(courseModules[4].lessons).toHaveLength(4);
    expect(courseModules[1].lessons.at(-1)?.id).toBe('b2-l8');
    expect(courseModules[2].lessons.at(-1)?.id).toBe('b3-l9');
    expect(courseModules[3].lessons.at(-1)?.id).toBe('b4-l9');
  });

  it('asigna preguntas y ejemplos a cada actividad y mantiene ids únicos por módulo', () => {
    for (const courseModule of courseModules) {
      const ids = courseModule.lessons.map((lesson) => lesson.id);
      expect(new Set(ids).size).toBe(ids.length);

      for (const lesson of courseModule.lessons) {
        expect(lesson.objectives.length).toBeGreaterThan(0);
        expect(lesson.explanation.length).toBeGreaterThan(0);
        expect(lesson.example.length).toBeGreaterThan(0);
        expect(lesson.exercise.title.length).toBeGreaterThan(0);
        expect(lesson.exercise.statement.length).toBeGreaterThan(0);
        expect(lesson.exercise.tests.length).toBeGreaterThan(0);
        expect(lesson.questions.length).toBeGreaterThan(0);

        for (const question of lesson.questions) {
          expect(question.options.length).toBeGreaterThan(1);
          expect(question.answer).toBeGreaterThanOrEqual(0);
          expect(question.answer).toBeLessThan(question.options.length);
        }
      }
    }
  });

  it('mantiene contenido progresivo, ejercicios únicos y preguntas sin repetir', () => {
    const lessons = courseModules.flatMap((courseModule) => courseModule.lessons);
    const prompts = lessons.flatMap((lesson) => lesson.questions.map((question) => question.prompt));
    const exerciseIds = lessons.map((lesson) => lesson.exercise.id);

    expect(lessons).toHaveLength(34);
    expect(courseModules.filter((courseModule) => !courseModule.optional).flatMap((courseModule) => courseModule.lessons)).toHaveLength(30);
    expect(new Set(exerciseIds).size).toBe(lessons.length);
    expect(new Set(prompts).size).toBe(prompts.length);

    for (const lesson of lessons) {
      expect(lesson.explanation.length).toBeGreaterThanOrEqual(3);
      expect(lesson.explanation.every((paragraph) => paragraph.length >= 120)).toBe(true);
      expect(lesson.exampleOutput.length).toBeGreaterThan(0);
      expect(lesson.walkthrough.length).toBeGreaterThanOrEqual(2);
      expect(lesson.commonMistakes.length).toBeGreaterThanOrEqual(2);
      expect(lesson.exercise.tests.length).toBeGreaterThan(0);
    }
  });

  it('mantiene correctas las respuestas de los conceptos base y rangos', () => {
    const findQuestion = (moduleId: string, lessonId: string, prompt: string) =>
      courseModules
        .find((courseModule) => courseModule.id === moduleId)!
        .lessons.find((lesson) => lesson.id === lessonId)!
        .questions.find((question) => question.prompt === prompt)!;

    const modulo = findQuestion('module-2', 'b2-l3', '¿Qué devuelve 17 % 5?');
    expect(modulo.options[modulo.answer]).toBe('2');

    const rango = findQuestion('module-3', 'b3-l5', '¿Qué valores genera range(1, 4)?');
    expect(rango.options[rango.answer]).toBe('1, 2, 3');

    const algoritmo = findQuestion('module-1', 'b1-l1', '¿Qué describe mejor un algoritmo?');
    expect(algoritmo.options[algoritmo.answer]).toBe('Una secuencia finita y ordenada de pasos para resolver un problema');
  });

  it('incluye estructuras y herramientas necesarias para resolver problemas reales', () => {
    const lesson = (moduleId: string, lessonId: string) =>
      courseModules.find((courseModule) => courseModule.id === moduleId)!
        .lessons.find((item) => item.id === lessonId)!;

    expect(lesson('module-3', 'b3-l6').example).toContain('notas[0][1]');
    expect(lesson('module-3', 'b3-l6').explanation.join(' ')).toContain('lista anidada');
    expect(lesson('module-4', 'b4-l2').example).toContain('cantidad=1');
    expect(lesson('module-4', 'b4-l6').example).toContain('for producto in productos');
    expect(lesson('module-4', 'b4-l7').explanation.join(' ')).toContain('IndexError');
    expect(lesson('module-2', 'b2-l5').example).toContain('strip().title()');
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

  it('trata respuestas faltantes como incorrectas', () => {
    const questions = [
      { prompt: '1', options: ['a', 'b'], answer: 0, explanation: '' },
      { prompt: '2', options: ['a', 'b'], answer: 1, explanation: '' },
    ];

    const result = gradeQuiz(questions, [0]);
    expect(result.correct).toBe(1);
    expect(result.total).toBe(2);
    expect(result.score).toBe(50);
    expect(result.passed).toBe(false);
  });

  it('califica correctamente cuando todas las respuestas son correctas', () => {
    const questions = [
      { prompt: '1', options: ['a', 'b'], answer: 0, explanation: '' },
      { prompt: '2', options: ['a', 'b'], answer: 1, explanation: '' },
    ];

    const result = gradeQuiz(questions, [0, 1]);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });
});
