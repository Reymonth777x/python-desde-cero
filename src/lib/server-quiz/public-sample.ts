import 'server-only';

import type { CourseLesson } from '@/lib/course-types';

/**
 * Public data contract for the anonymous first-lesson preview.
 * This is deliberately an allow-list: never include quiz questions, answer keys,
 * explanations, exercise solutions, expected test output or XP/grading metadata.
 */
export type PublicSampleLesson = Pick<
  CourseLesson,
  | 'id'
  | 'section'
  | 'title'
  | 'objectives'
  | 'explanation'
  | 'example'
  | 'exampleOutput'
  | 'walkthrough'
  | 'commonMistakes'
  | 'estimatedMinutes'
> & {
  exercise: Pick<CourseLesson['exercise'], 'title' | 'statement' | 'starterCode' | 'hints'>;
};

export function toPublicSampleLesson(lesson: CourseLesson): PublicSampleLesson {
  return {
    id: lesson.id,
    section: lesson.section,
    title: lesson.title,
    objectives: [...lesson.objectives],
    explanation: [...lesson.explanation],
    example: lesson.example,
    exampleOutput: lesson.exampleOutput,
    walkthrough: [...lesson.walkthrough],
    commonMistakes: [...lesson.commonMistakes],
    estimatedMinutes: lesson.estimatedMinutes,
    exercise: {
      title: lesson.exercise.title,
      statement: lesson.exercise.statement,
      starterCode: lesson.exercise.starterCode,
      hints: [...lesson.exercise.hints],
    },
  };
}
