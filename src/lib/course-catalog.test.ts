import { describe, expect, it } from 'vitest';
import { courseCatalog } from './course-catalog';

describe('catálogo público del curso', () => {
  it('conserva los cuatro módulos principales y la extensión opcional', () => {
    const core = courseCatalog.filter((module) => !module.optional);
    const extensions = courseCatalog.filter((module) => module.optional);

    expect(core).toHaveLength(4);
    expect(core.reduce((total, module) => total + module.lessons.length, 0)).toBe(30);
    expect(extensions).toHaveLength(1);
    expect(extensions[0].lessons).toHaveLength(4);
  });

  it('solo publica metadatos de navegación, nunca respuestas ni soluciones', () => {
    const allowedModuleKeys = new Set(['id', 'number', 'title', 'summary', 'lessons', 'optional']);
    const allowedLessonKeys = new Set(['id', 'section', 'title', 'assessment']);

    for (const module of courseCatalog) {
      for (const key of Object.keys(module)) {
        expect(allowedModuleKeys.has(key), 'campo público de módulo no permitido: ' + key).toBe(true);
      }
      for (const lesson of module.lessons) {
        for (const key of Object.keys(lesson)) {
          expect(allowedLessonKeys.has(key), 'campo público de lección no permitido: ' + key).toBe(true);
        }
      }
    }

    const serialized = JSON.stringify(courseCatalog);
    expect(serialized).not.toMatch(/"answer"|"explanation"|"solution"|"starterCode"|"correct_option_v2"/);
  });
});
