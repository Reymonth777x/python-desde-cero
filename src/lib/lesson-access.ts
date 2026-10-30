export type LessonProgressRecord = {
  module_id: string;
  lesson_id: string;
  is_completed: boolean;
};

export type LessonReference = {
  id: string;
};

/**
 * A lesson can be opened when it is the first in its module or when the
 * immediately preceding lesson has been completed. If progress could not be
 * loaded, fail closed and leave only the first lesson available.
 *
 * Completed lessons remain revisitable; callers should check the current
 * lesson's completion separately before redirecting.
 */
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

  const previousLesson = lessons[lessonIndex - 1];
  return progressRows.some(
    (row) =>
      row.module_id === moduleId &&
      row.lesson_id === previousLesson.id &&
      row.is_completed,
  );
}
