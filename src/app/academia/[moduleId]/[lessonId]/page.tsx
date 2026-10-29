import { notFound, redirect } from 'next/navigation';
import LessonStudy from '@/components/LessonStudy';
import {
  courseModules,
  findCourseLesson,
  findCourseModule,
  type CourseExercise,
  type CourseLesson,
  type QuizQuestion,
} from '@/lib/course';
import { createClient } from '@/lib/supabase/server';

type ClientSafeQuizQuestion = Omit<QuizQuestion, 'answer' | 'explanation'>;
type ClientSafeExercise = Omit<CourseExercise, 'solution'>;
type ClientSafeLesson = Omit<CourseLesson, 'questions' | 'exercise'> & {
  questions: ClientSafeQuizQuestion[];
  exercise: ClientSafeExercise;
};

function toClientLesson(lesson: CourseLesson): ClientSafeLesson {
  const { solution: _solution, ...exercise } = lesson.exercise;
  void _solution;
  return {
    ...lesson,
    exercise,
    questions: lesson.questions.map(({ prompt, options }) => ({ prompt, options })),
  };
}

type Props = {
  params: Promise<{ moduleId: string; lessonId: string }>;
};

export default async function LessonPage({ params }: Props) {
  const { moduleId, lessonId } = await params;
  const courseModule = findCourseModule(moduleId);
  const lesson = findCourseLesson(moduleId, lessonId);

  if (!courseModule || !lesson) notFound();

  const moduleIndex = courseModules.findIndex((item) => item.id === courseModule.id);
  const lessonIndex = courseModule.lessons.findIndex((item) => item.id === lesson.id);
  const previousLesson = courseModule.lessons[lessonIndex - 1];
  const nextLesson = courseModule.lessons[lessonIndex + 1];
  const nextModule = courseModules[moduleIndex + 1];
  const nextHref = nextLesson
    ? `/academia/${courseModule.id}/${nextLesson.id}`
    : nextModule
      ? `/academia/${nextModule.id}/${nextModule.lessons[0].id}`
      : null;

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect(`/login?next=${encodeURIComponent(`/academia/${moduleId}/${lessonId}`)}`);
  }

  if (moduleIndex > 0) {
    const prevModule = courseModules[moduleIndex - 1];
    const assessmentLesson = prevModule.lessons.find((item) => item.assessment);

    if (assessmentLesson) {
      const { data: gate, error: gateError } = await supabase
        .from('progress')
        .select('is_completed')
        .eq('user_id', user.id)
        .eq('module_id', prevModule.id)
        .eq('lesson_id', assessmentLesson.id)
        .maybeSingle();

      if (!gateError && gate?.is_completed !== true) redirect('/academia');
    }
  }

  const { data: progress, error: progressError } = await supabase
    .from('progress')
    .select('is_completed, best_score')
    .eq('user_id', user.id)
    .eq('module_id', courseModule.id)
    .eq('lesson_id', lesson.id)
    .maybeSingle();

  return (
    <LessonStudy
      key={`${courseModule.id}:${lesson.id}:${user.id}`}
      lesson={toClientLesson(lesson)}
      moduleId={courseModule.id}
      moduleNumber={courseModule.number}
      moduleTitle={courseModule.title}
      initialCompleted={progress?.is_completed === true}
      initialScore={Number(progress?.best_score ?? 0)}
      progressUnavailable={Boolean(progressError)}
      expectedUserId={user.id}
      previousHref={previousLesson ? `/academia/${courseModule.id}/${previousLesson.id}` : null}
      nextHref={nextHref}
    />
  );
}
