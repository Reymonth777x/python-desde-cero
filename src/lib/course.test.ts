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
      4, 9, 9, 11,
    ]);
    expect(courseModules[4].lessons).toHaveLength(4);
    expect(courseModules[1].lessons.at(-1)?.id).toBe('b2-l7');
    expect(courseModules[2].lessons.at(-1)?.id).toBe('b3-l8');
    expect(courseModules[3].lessons.at(-1)?.id).toBe('b4-l11');
    expect(courseModules[1].lessons.at(-1)?.assessment).toBe(true);
    expect(courseModules[2].lessons.at(-1)?.assessment).toBe(true);
    expect(courseModules[3].lessons.at(-1)?.assessment).toBe(true);
    expect(courseModules[1].lessons.at(-2)?.id).toBe('b2-l8');
    expect(courseModules[2].lessons.at(-2)?.id).toBe('b3-l9');
    expect(courseModules[3].lessons.at(-4)?.id).toBe('b4-l9');
    expect(courseModules[0].lessons.at(-1)?.assessment).toBe(true);
    expect(courseModules[0].lessons.at(-1)?.questions).toHaveLength(6);
    expect(courseModules[3].lessons.at(-2)?.finalProject).toBe(true);
    expect(courseModules[3].lessons.at(-1)?.finalAssessment).toBe(true);
    expect(courseModules[3].lessons.at(-1)?.questions).toHaveLength(12);
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

    expect(lessons).toHaveLength(37);
    expect(courseModules.filter((courseModule) => !courseModule.optional).flatMap((courseModule) => courseModule.lessons)).toHaveLength(33);
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

  it('mantiene los laboratorios integradores antes de las evaluaciones de módulo', () => {
    expect(courseModules[1].lessons.map((item) => item.id)).toEqual([
      'b2-l9',
      'b2-l1',
      'b2-l3',
      'b2-l4',
      'b2-l2',
      'b2-l5',
      'b2-l6',
      'b2-l8',
      'b2-l7',
    ]);
    expect(courseModules[1].lessons[0]).toMatchObject({
      id: 'b2-l9',
      section: '2.1',
      title: 'Primer programa: Hello, World!',
    });
    expect(courseModules[3].lessons.map((item) => item.id)).toEqual([
      'b4-l1',
      'b4-l2',
      'b4-l3',
      'b4-l4',
      'b4-l5',
      'b4-l6',
      'b4-l7',
      'b4-l9',
      'b4-l8',
      'b4-l10',
      'b4-l11',
    ]);
  });

  it('mantiene el orden progresivo del módulo 3 antes de los ejercicios integradores y la evaluación', () => {
    expect(courseModules[2].lessons.map((item) => item.id)).toEqual([
      'b3-l1',
      'b3-l3',
      'b3-l4',
      'b3-l5',
      'b3-l2',
      'b3-l6',
      'b3-l7',
      'b3-l9',
      'b3-l8',
    ]);
    expect(courseModules[0].lessons.find((item) => item.id === 'b1-l4')?.section).toBe('1.4');
  });

  it('incluye estructuras y herramientas necesarias para resolver problemas reales', () => {
    const lesson = (moduleId: string, lessonId: string) =>
      courseModules.find((courseModule) => courseModule.id === moduleId)!
        .lessons.find((item) => item.id === lessonId)!;

    expect(lesson('module-3', 'b3-l6').example).toContain('edades[0]');
    expect(lesson('module-3', 'b3-l6').example).not.toContain('notas[0][1]');
    expect(lesson('module-3', 'b3-l6').explanation.join(' ')).toContain('lista unidimensional');
    expect(lesson('module-3', 'b3-l9').questions[0].prompt).toContain('notas[1][0]');
    expect(lesson('module-3', 'b3-l9').explanation.join(' ')).toContain('lista de listas');
    expect(lesson('module-4', 'b4-l2').example).toContain('cantidad=1');
    expect(lesson('module-4', 'b4-l6').example).toContain('for producto in productos');
    expect(lesson('module-4', 'b4-l7').explanation.join(' ')).toContain('IndexError');
    expect(lesson('module-2', 'b2-l5').example).toContain('strip().title()');

    expect(lesson('module-2', 'b2-l6').exercise.tests).toHaveLength(4);
    expect(lesson('module-2', 'b2-l8').exercise.tests).toHaveLength(4);
    expect(lesson('module-2', 'b2-l8').exercise.tests[2].input).toEqual([
      '  cuaderno universitario  ',
      '349.9',
      '1',
    ]);

    const inventoryProject = lesson('module-4', 'b4-l10');
    expect(inventoryProject.exercise.statement).toContain('acumula las cantidades');
    expect(inventoryProject.exercise.starterCode).toContain(
      'try:\n        cantidad = int(input())\n    except ValueError:\n        print("Cantidad no válida")\n        continue',
    );
    expect(inventoryProject.exercise.solution).toContain('inventario.get(nombre, 0)');
    expect(inventoryProject.exercise.tests).toHaveLength(6);
    expect(inventoryProject.exercise.tests[5].input).toEqual(['1', 'Cuaderno', '-2']);
    expect(inventoryProject.exercise.tests[1].input).toEqual([
      '3',
      'Lapiz',
      '10',
      'Cuaderno',
      '3',
      'Lapiz',
      '2',
    ]);
  });

  it('separa operadores logicos y practica AND, OR y XOR bit a bit', () => {
    const lesson = courseModules
      .find((courseModule) => courseModule.id === 'module-3')!
      .lessons.find((item) => item.id === 'b3-l2')!;

    expect(lesson.objectives.join(' ')).toContain('AND (&), OR (|) y XOR (^)');
    expect(lesson.explanation.join(' ')).toContain('0101 & 0011 = 0001');
    expect(lesson.explanation.join(' ')).toContain('el resultado es 0111 (7)');
    expect(lesson.explanation.join(' ')).toContain('el resultado es 0110 (6)');
    expect(lesson.explanation.join(' ')).toContain('5 << 1');
    expect(lesson.explanation.join(' ')).toContain('5 >> 1');
    expect(lesson.exampleOutput.split(String.fromCharCode(10))).toEqual([
      'True',
      'False',
      '1',
      '7',
      '6',
      '10',
      '2',
      '-6',
    ]);
    expect(lesson.exercise.statement).toContain('permisos & solicitud');
    expect(lesson.exercise.statement).toContain('permisos | solicitud');
    expect(lesson.exercise.statement).toContain('permisos ^ solicitud');
    expect(lesson.exercise.solution).toContain('edad >= 18 and tiene_entrada');
    expect(lesson.exercise.tests).toEqual([
      { input: [], expected: ['True', '1', '7', '6'].join(String.fromCharCode(10)) },
      { input: [], expected: 'True\\n1\\n7\\n6' },
    expect(lesson.exercise.hints).toHaveLength(4);
    expect(lesson.commonMistakes.join(' ')).toContain('no son equivalentes');
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

  it('guía bubble sort con una pasada manual antes del ejercicio completo', () => {
    const lesson = courseModules
      .find((courseModule) => courseModule.id === 'module-3')!
      .lessons.find((item) => item.id === 'b3-l7')!;
    const explanation = lesson.explanation.join(' ');
    const onePass = lesson.example.split('# Una pasada de bubble sort\n')[1] ?? '';

    expect(explanation).toContain('una sola pasada');
    expect(explanation).toContain('range(len(numeros) - 1 - pasada)');
    expect(onePass).toContain('for indice in range(len(numeros) - 1):');
    expect(onePass).toContain('if numeros[indice] > numeros[indice + 1]:');
    expect(onePass).not.toContain('.sort()');
    expect(onePass).not.toContain('sorted(');
    expect(lesson.exampleOutput).toContain('[2, 4, 5]');
    expect(lesson.exercise.starterCode).toContain('for pasada in range(len(numeros) - 1):');
    expect(lesson.exercise.hints).toHaveLength(4);
  });

  it('presenta variables antes de usarlas y practica int, float y str en 2.3.1', () => {
    const lesson = courseModules
      .find((courseModule) => courseModule.id === 'module-2')!
      .lessons.find((item) => item.id === 'b2-l4')!;

    expect(lesson.explanation.join(' ')).toContain('Una variable es un nombre');
    expect(lesson.explanation.join(' ')).toContain('float()');
    expect(lesson.example).toContain('precio = int(precio_texto)');
    expect(lesson.example).toContain('factor = float("2.5")');
    expect(lesson.example).toContain('str(precio)');
    expect(lesson.exercise.solution).toContain('int(precio_texto)');
    expect(lesson.exercise.solution).toContain('float(factor_texto)');
    expect(lesson.exercise.solution).toContain('str(subtotal)');
    expect(lesson.exercise.tests[0].expected).toBe('3750.0\nSubtotal: 3750.0');
});
});
