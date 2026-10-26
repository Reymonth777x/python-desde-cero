import 'server-only';

import { courseModules, findCourseLesson } from '@/lib/course';

/**
 * Devuelve los índices de las respuestas correctas para una lección dada.
 * Este módulo es server-only: nunca se importa desde el cliente y sus valores
 * nunca viajan al navegador.
 */
export function getCorrectAnswers(moduleId: string, lessonId: string): number[] {
  const lesson = findCourseLesson(moduleId, lessonId);
  if (!lesson) {
    throw new Error(`Lección no encontrada: ${moduleId}/${lessonId}`);
  }
  return lesson.questions.map((q) => q.answer);
}

/**
 * Devuelve las explicaciones de cada pregunta de una lección.
 * Solo se envían al cliente después de que el alumno envía el quiz.
 */
export function getExplanations(moduleId: string, lessonId: string): string[] {
  const lesson = findCourseLesson(moduleId, lessonId);
  if (!lesson) {
    throw new Error(`Lección no encontrada: ${moduleId}/${lessonId}`);
  }
  return lesson.questions.map((q) => q.explanation);
}

/**
 * Devuelve el número total de preguntas de una lección.
 */
export function getQuestionCount(moduleId: string, lessonId: string): number {
  const lesson = findCourseLesson(moduleId, lessonId);
  if (!lesson) {
    throw new Error(`Lección no encontrada: ${moduleId}/${lessonId}`);
  }
  return lesson.questions.length;
}

/**
 * Indica si una lección tiene quiz de evaluación.
 */
export function hasQuiz(moduleId: string, lessonId: string): boolean {
  const lesson = findCourseLesson(moduleId, lessonId);
  if (!lesson) {
    return false;
  }
  return lesson.questions.length > 0;
}

/**
 * Lista de identificadores de lección que tienen quiz, por módulo.
 * Se usa del lado del servidor para conocer qué lecciones son evaluables.
 */
export function getQuizLessonIds(moduleId: string): string[] {
  const module = courseModules.find((m) => m.id === moduleId);
  if (!module) {
    return [];
  }
  return module.lessons
    .filter((l) => l.questions.length > 0)
    .map((l) => l.id);
}
