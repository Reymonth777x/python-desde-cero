import { notFound, redirect } from 'next/navigation';
import LessonStudy from '@/components/LessonStudy';
import {
  courseModules,
  findCourseLesson,
  findCourseModule,
} from '@/lib/course';
import { toClientLesson } from '@/lib/server-quiz/public-lesson';
import { canAccessLessonInSequence, findFirstIncompleteLessonIndex } from '@/lib/lesson-access';
import { createClient } from '@/lib/supabase/server';

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
    const assessmentLesson = [...prevModule.lessons].reverse().find((item) => item.finalAssessment || item.assessment);

    if (assessmentLesson) {
      const { data: gate, error: gateError } = await supabase
        .from('progress')
        .select('is_completed')
        .eq('user_id', user.id)
        .eq('module_id', prevModule.id)
        .eq('lesson_id', assessmentLesson.id)
        .maybeSingle();

      if (gateError || gate?.is_completed !== true) redirect('/academia');
    }
  }

  const requiredCurrentLessonId = lesson.finalProject ? 'b4-l8' : lesson.finalAssessment ? 'b4-l10' : null;

  if (requiredCurrentLessonId) {
    const { data: prerequisite, error: prerequisiteError } = await supabase
      .from('progress')
      .select('is_completed')
      .eq('user_id', user.id)
      .eq('module_id', courseModule.id)
      .eq('lesson_id', requiredCurrentLessonId)
      .maybeSingle();

    if (prerequisiteError || prerequisite?.is_completed !== true) {
      redirect(`/academia/${courseModule.id}/${requiredCurrentLessonId}`);
    }
  }

  const { data: moduleProgress, error: progressError } = await supabase
    .from('progress')
    .select('lesson_id, is_completed, best_score')
    .eq('user_id', user.id)
    .eq('module_id', courseModule.id);

  const progressForModule = (moduleProgress ?? []).map((row) => ({
    ...row,
    module_id: courseModule.id,
  }));
  const currentProgress = moduleProgress?.find((row) => row.lesson_id === lesson.id);
  const currentLessonCompleted = currentProgress?.is_completed === true;
  const canOpenBySequence = canAccessLessonInSequence(
    courseModule.id,
    lessonIndex,
    courseModule.lessons,
    progressForModule,
    Boolean(progressError),
  );

  if (!currentLessonCompleted && !canOpenBySequence && lessonIndex > 0) {
    const firstIncompleteIndex = findFirstIncompleteLessonIndex(
      courseModule.id,
      courseModule.lessons.slice(0, lessonIndex),
      progressForModule,
      Boolean(progressError),
    );
    const fallbackIndex = firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0;
    redirect(`/academia/${courseModule.id}/${courseModule.lessons[fallbackIndex].id}`);
  }

  return (
    <LessonStudy
      key={`${courseModule.id}:${lesson.id}:${user.id}`}
      lesson={toClientLesson(lesson)}
      moduleId={courseModule.id}
      moduleNumber={courseModule.number}
      moduleTitle={courseModule.title}
      initialCompleted={currentLessonCompleted}
      initialScore={Number(currentProgress?.best_score ?? 0)}
      progressUnavailable={Boolean(progressError)}
      expectedUserId={user.id}
      previousHref={previousLesson ? `/academia/${courseModule.id}/${previousLesson.id}` : null}
      nextHref={nextHref}
    />
  );
}
