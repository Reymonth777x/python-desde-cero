export type LessonProgressRecord = {
  module_id: string;
  lesson_id: string;
  is_completed: boolean;
};

export type LessonReference = {
  id: string;
};

/**
 * A module is unlocked for new students only after the previous module's
 * assessment is complete. Students with persisted progress in the target
 * module keep access when a later course update adds a new module gate.
 *
 * The caller must only pass progress loaded for the authenticated user.
 */
export function canAccessModule(
  moduleIndex: number,
  hasPreviousAssessment: boolean,
  hasExistingModuleProgress: boolean,
): boolean {
  if (!Number.isInteger(moduleIndex) || moduleIndex < 0) {
    return false;
  }

  if (moduleIndex === 0) {
    return true;
  }

  return hasPreviousAssessment || hasExistingModuleProgress;
}

/**
 * A lesson can be opened when it is the first in its module or when every
 * earlier lesson in that module has been completed. If progress could not be
 * loaded, fail closed and leave only the first lesson available.
 *
 * Completed lessons remain revisitable; callers should check the current
 * lesson's completion separately before redirecting.
 */
export function findFirstIncompleteLessonIndex(
  moduleId: string,
  lessons: LessonReference[],
  progressRows: LessonProgressRecord[],
  progressUnavailable = false,
): number {
  return lessons.findIndex((lesson) =>
    progressUnavailable ||
    !progressRows.some(
      (row) =>
        row.module_id === moduleId &&
        row.lesson_id === lesson.id &&
        row.is_completed,
    ),
  );
}

export function canAccessLessonInSequence(
  moduleId: string,
  lessonIndex: number,
  lessons: LessonReference[],
  progressRows: LessonProgressRecord[],
  progressUnavailable = false,
): boolean {
  if (!Number.isInteger(lessonIndex) || lessonIndex < 0 || lessonIndex >= lessons.length) {
    return false;
  }

  if (progressUnavailable) {
    return lessonIndex === 0;
  }

  if (lessonIndex === 0) {
    return true;
  }

  return findFirstIncompleteLessonIndex(
    moduleId,
    lessons.slice(0, lessonIndex),
    progressRows,
  ) === -1;
}
