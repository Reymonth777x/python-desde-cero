import { describe, expect, it } from 'vitest';
import { courseModules } from './course';

function getExercise(lessonId: string) {
  const lesson = courseModules
    .flatMap((courseModule) => courseModule.lessons)
    .find((item) => item.id === lessonId);

  if (!lesson?.exercise) {
    throw new Error(`No existe un ejercicio para ${lessonId}`);
  }

  return { lesson, exercise: lesson.exercise };
}

describe('course practice alignment', () => {
  it('practices and verifies both bit-shift directions in b3-l2', () => {
    const { lesson, exercise } = getExercise('b3-l2');

    expect(lesson.objectives.join(' ')).toContain('desplazamientos de bits');
    expect(exercise.statement).toContain('izquierda');
    expect(exercise.statement).toContain('derecha');
    expect(exercise.solution).toContain('print(permisos << 1)');
    expect(exercise.solution).toContain('print(permisos >> 1)');
    expect(exercise.tests).toEqual([
      {
        input: [],
        expected: 'True\n1\n7\n6\n10\n2',
      },
    ]);
  });

  it('covers valid, missing and non-numeric ages plus else/finally in b4-l7', () => {
    const { lesson, exercise } = getExercise('b4-l7');

    expect(lesson.objectives.join(' ')).toContain('else y finally');
    expect(exercise.solution).toContain('except KeyError:');
    expect(exercise.solution).toContain('except ValueError:');
    expect(exercise.solution).toContain('else:');
    expect(exercise.solution).toContain('finally:');
    expect(exercise.tests).toEqual([
      {
        input: ['Ana', '20'],
        expected: 'Edad: 20\nValidación finalizada',
      },
      {
        input: ['Ana', 'veinte'],
        expected: 'La edad debe ser numérica\nValidación finalizada',
      },
      {
        input: ['Ana', ''],
        expected: 'Falta el campo edad\nValidación finalizada',
      },
    ]);
  });

  it('cubre los límites de las ramas if/elif/else en b3-l3', () => {
    const { exercise } = getExercise('b3-l3');

    expect(exercise.starterCode).toContain('peso = float(input())');
    expect(exercise.solution).toContain('if peso <= 1:');
    expect(exercise.solution).toContain('elif peso <= 5:');
    expect(exercise.solution).toContain('else:');
    expect(exercise.tests).toEqual([
      { input: ['0.5'], expected: 'Ligero' },
      { input: ['1'], expected: 'Ligero' },
      { input: ['1.1'], expected: 'Mediano' },
      { input: ['5'], expected: 'Mediano' },
      { input: ['5.1'], expected: 'Pesado' },
    ]);
  });

  it('comprueba los límites del bucle while, incluso si debe ejecutar cero veces', () => {
    const { exercise } = getExercise('b3-l4');

    expect(exercise.starterCode).toContain('limite = int(input())');
    expect(exercise.solution).toContain('while contador <= limite:');
    expect(exercise.solution).toContain('contador += 1');
    expect(exercise.tests).toEqual([
      { input: ['1'], expected: '1' },
      { input: ['-2'], expected: '' },
      { input: ['0'], expected: '' },
      { input: ['5'], expected: ['1', '2', '3', '4', '5'].join(String.fromCharCode(10)) },
    ]);
  });

});
