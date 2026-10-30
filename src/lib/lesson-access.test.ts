import { describe, expect, it } from 'vitest';
import { canAccessLessonInSequence, findFirstIncompleteLessonIndex, type LessonProgressRecord } from './lesson-access';

const lessons = [{ id: 'b1-l1' }, { id: 'b1-l2' }, { id: 'b1-l3' }];

describe('sequential lesson access', () => {
  it('allows the first lesson without previous progress', () => {
    expect(canAccessLessonInSequence('module-1', 0, lessons, [])).toBe(true);
  });

  it('locks later lessons when the first prerequisite is incomplete', () => {
    const progress: LessonProgressRecord[] = [
      { module_id: 'module-1', lesson_id: 'b1-l1', is_completed: false },
    ];

    expect(canAccessLessonInSequence('module-1', 1, lessons, progress)).toBe(false);
    expect(canAccessLessonInSequence('module-1', 2, lessons, progress)).toBe(false);
  });

  it('unlocks the next lesson only after every earlier lesson is completed', () => {
    const firstCompleted: LessonProgressRecord[] = [
      { module_id: 'module-1', lesson_id: 'b1-l1', is_completed: true },
    ];

    expect(canAccessLessonInSequence('module-1', 1, lessons, firstCompleted)).toBe(true);
    expect(canAccessLessonInSequence('module-1', 2, lessons, firstCompleted)).toBe(false);

    const firstTwoCompleted: LessonProgressRecord[] = [
      ...firstCompleted,
      { module_id: 'module-1', lesson_id: 'b1-l2', is_completed: true },
    ];
    expect(canAccessLessonInSequence('module-1', 2, lessons, firstTwoCompleted)).toBe(true);
  });

  it('finds the earliest missing lesson so older accounts can resume without loops', () => {
    const progress: LessonProgressRecord[] = [
      { module_id: 'module-1', lesson_id: 'b1-l2', is_completed: true },
    ];

    expect(findFirstIncompleteLessonIndex('module-1', lessons, progress)).toBe(0);

    const firstCompleted: LessonProgressRecord[] = [
      { module_id: 'module-1', lesson_id: 'b1-l1', is_completed: true },
      { module_id: 'module-1', lesson_id: 'b1-l2', is_completed: true },
    ];
    expect(findFirstIncompleteLessonIndex('module-1', lessons, firstCompleted)).toBe(2);
    expect(findFirstIncompleteLessonIndex('module-1', lessons, [
      ...firstCompleted,
      { module_id: 'module-1', lesson_id: 'b1-l3', is_completed: true },
    ])).toBe(-1);
  });

  it('does not treat completion in another module as a prerequisite', () => {
    const progress: LessonProgressRecord[] = [
      { module_id: 'module-2', lesson_id: 'b2-l1', is_completed: true },
    ];

    expect(canAccessLessonInSequence('module-1', 1, lessons, progress)).toBe(false);
  });

  it('fails closed when progress could not be loaded', () => {
    expect(canAccessLessonInSequence('module-1', 0, lessons, [], true)).toBe(true);
    expect(canAccessLessonInSequence('module-1', 1, lessons, [], true)).toBe(false);
  });

  it('rejects lesson indexes outside the module', () => {
    expect(canAccessLessonInSequence('module-1', -1, lessons, [])).toBe(false);
    expect(canAccessLessonInSequence('module-1', 3, lessons, [])).toBe(false);
  });
});
