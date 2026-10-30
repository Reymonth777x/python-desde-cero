import 'server-only';

import type { ClientSafeLesson, CourseLesson } from '@/lib/course-types';

/**
 * Remove grading data and model solutions before passing a lesson to a Client Component.
 */
export function toClientLesson(lesson: CourseLesson): ClientSafeLesson {
  const { solution: _solution, ...exercise } = lesson.exercise;
  void _solution;

  return {
    ...lesson,
    exercise,
    questions: lesson.questions.map(({ prompt, options }) => ({ prompt, options })),
  };
}
