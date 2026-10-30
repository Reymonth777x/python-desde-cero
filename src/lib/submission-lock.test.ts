import { describe, expect, it } from 'vitest';
import { acquireSubmissionLock, releaseSubmissionLock } from './submission-lock';

describe('quiz submission lock', () => {
  it('allows the first submit and blocks a second submit in the same event turn', () => {
    const lock = { current: false };

    expect(acquireSubmissionLock(lock)).toBe(true);
    expect(acquireSubmissionLock(lock)).toBe(false);
    expect(lock.current).toBe(true);
  });

  it('releases the lock after the request finishes so retry remains possible', () => {
    const lock = { current: false };

    expect(acquireSubmissionLock(lock)).toBe(true);
    releaseSubmissionLock(lock);

    expect(lock.current).toBe(false);
    expect(acquireSubmissionLock(lock)).toBe(true);
  });

  it('keeps independent lesson submissions isolated', () => {
    const firstLesson = { current: false };
    const secondLesson = { current: false };

    expect(acquireSubmissionLock(firstLesson)).toBe(true);
    expect(acquireSubmissionLock(secondLesson)).toBe(true);
    expect(acquireSubmissionLock(firstLesson)).toBe(false);
  });
});
