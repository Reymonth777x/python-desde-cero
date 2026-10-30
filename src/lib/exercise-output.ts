export type ExerciseTestResult = {
  allPassed: boolean;
  passed: number;
  total: number;
};

export function normalizeExerciseOutput(value: string): string {
  return value.replace(/\r\n/g, '\n').replace(/\n+$/g, '');
}

export function matchesExerciseOutput(actual: string, expected: string, error?: string): boolean {
  return !error && normalizeExerciseOutput(actual) === normalizeExerciseOutput(expected);
}
