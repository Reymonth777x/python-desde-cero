export type SubmissionLock = { current: boolean };

/**
 * Acquires a synchronous UI lock before awaiting a server action.
 * Unlike React state, the ref is updated in the same event turn.
 */
export function acquireSubmissionLock(lock: SubmissionLock): boolean {
  if (lock.current) return false;
  lock.current = true;
  return true;
}

export function releaseSubmissionLock(lock: SubmissionLock): void {
  lock.current = false;
}
