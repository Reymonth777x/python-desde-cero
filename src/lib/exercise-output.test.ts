import { describe, expect, it } from 'vitest';
import { matchesExerciseOutput, normalizeExerciseOutput } from './exercise-output';

describe('comparación de salidas de prácticas', () => {
  it('normaliza saltos Windows y saltos finales', () => {
    expect(normalizeExerciseOutput('uno\r\ndos\r\n')).toBe('uno\ndos');
  });

  it('acepta la misma salida con o sin salto final', () => {
    expect(matchesExerciseOutput('Total: 3\n', 'Total: 3')).toBe(true);
  });

  it('no ignora espacios internos o diferencias en los datos', () => {
    expect(matchesExerciseOutput('Total:  3', 'Total: 3')).toBe(false);
    expect(matchesExerciseOutput('Total: 4', 'Total: 3')).toBe(false);
  });

  it('falla si la ejecución produjo un error', () => {
    expect(matchesExerciseOutput('Total: 3', 'Total: 3', 'ValueError')).toBe(false);
  });
});
