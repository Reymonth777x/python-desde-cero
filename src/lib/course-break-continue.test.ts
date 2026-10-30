import { describe, expect, it } from 'vitest';
import { courseModules } from './course';

describe('práctica de for, break y continue', () => {
  const lesson = courseModules
    .find((courseModule) => courseModule.id === 'module-3')!
    .lessons.find((item) => item.id === 'b3-l5')!;

  it('explica y muestra la diferencia entre continue y break', () => {
    expect(lesson.example).toContain('if numero == 3:');
    expect(lesson.example).toContain('continue');
    expect(lesson.example).toContain('if numero == 6:');
    expect(lesson.example).toContain('break');
    expect(lesson.exampleOutput).toBe(['1', '2', '4', '5'].join(String.fromCharCode(10)));
  });

  it('practica ambos controles y verifica límites sin iteraciones, saltos y corte temprano', () => {
    const exercise = lesson.exercise;

    expect(exercise.starterCode).toContain('limite = int(input())');
    expect(exercise.solution).toContain('if numero == 7:');
    expect(exercise.solution).toContain('break');
    expect(exercise.solution).toContain('if numero % 2 == 0:');
    expect(exercise.solution).toContain('continue');
    expect(exercise.tests).toEqual([
      { input: ['1'], expected: '1' },
      { input: ['-1'], expected: '' },
      { input: ['0'], expected: '' },
      { input: ['6'], expected: ['1', '3', '5'].join(String.fromCharCode(10)) },
      { input: ['10'], expected: ['1', '3', '5'].join(String.fromCharCode(10)) },
    ]);
    expect(exercise.hints).toHaveLength(4);
  });
});
