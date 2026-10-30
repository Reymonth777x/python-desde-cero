import { describe, expect, it } from 'vitest';
import { courseCatalog } from './course-catalog';

describe('catálogo público del curso', () => {
  it('conserva los cuatro módulos principales y la extensión opcional', () => {
    const core = courseCatalog.filter((courseModule) => !courseModule.optional);
    const extensions = courseCatalog.filter((courseModule) => courseModule.optional);

    expect(core).toHaveLength(4);
    expect(core.reduce((total, courseModule) => total + courseModule.lessons.length, 0)).toBe(33);
    expect(extensions).toHaveLength(1);
    expect(extensions[0].lessons).toHaveLength(4);
  });

  it('solo publica metadatos de navegación, nunca respuestas ni soluciones', () => {
    const allowedModuleKeys = new Set(['id', 'number', 'title', 'summary', 'lessons', 'optional']);
    const allowedLessonKeys = new Set(['id', 'section', 'title', 'assessment', 'finalProject', 'finalAssessment']);

    for (const courseModule of courseCatalog) {
      for (const key of Object.keys(courseModule)) {
        expect(allowedModuleKeys.has(key), 'campo público de módulo no permitido: ' + key).toBe(true);
      }
      for (const lesson of courseModule.lessons) {
        for (const key of Object.keys(lesson)) {
          expect(allowedLessonKeys.has(key), 'campo público de lección no permitido: ' + key).toBe(true);
        }
      }
    }

    const serialized = JSON.stringify(courseCatalog);
    expect(serialized).not.toMatch(/"answer"|"explanation"|"solution"|"starterCode"|"correct_option_v2"/);
  });

  it('muestra M2 en el orden didáctico del contenido y no omite Hello, World!', () => {
    const module2 = courseCatalog.find((courseModule) => courseModule.id === 'module-2');
    expect(module2?.lessons.map(({ id, section }) => [id, section])).toEqual([
      ['b2-l9', '2.1'],
      ['b2-l1', '2.2'],
      ['b2-l3', '2.3'],
      ['b2-l4', '2.3.1'],
      ['b2-l2', '2.4'],
      ['b2-l5', '2.5'],
      ['b2-l6', '2.6'],
      ['b2-l8', '2.6 práctica'],
      ['b2-l7', '2.7'],
    ]);
  });

});