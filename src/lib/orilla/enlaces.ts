import { courseCatalog } from '@/lib/course-catalog';

/** Ruta de una lección del curso, o null si el id no existe. */
export function hrefLeccion(lessonId: string): string | null {
  const modulo = courseCatalog.find((m) => m.lessons.some((l) => l.id === lessonId));
  return modulo ? `/academia/${modulo.id}/${lessonId}` : null;
}
