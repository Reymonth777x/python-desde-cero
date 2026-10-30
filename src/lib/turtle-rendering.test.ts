import { describe, expect, it } from 'vitest';
import { getTurtlePose, getTurtleViewBox } from './turtle-rendering';

describe('Turtle rendering helpers', () => {
  it('centra y amplía un cuadrado pequeño para aprovechar el lienzo', () => {
    const view = getTurtleViewBox([
      { type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, color: 'blue' },
      { type: 'line', x1: 100, y1: 0, x2: 100, y2: -100, color: 'blue' },
      { type: 'line', x1: 100, y1: -100, x2: 0, y2: -100, color: 'blue' },
      { type: 'line', x1: 0, y1: -100, x2: 0, y2: 0, color: 'blue' },
    ]);

    expect(view.width / view.height).toBeCloseTo(600 / 338, 5);
    expect(view.left).toBeLessThan(0);
    expect(view.top).toBeLessThan(0);
    expect(view.width).toBeGreaterThan(100);
    expect(view.height).toBeGreaterThan(100);
  });

  it('usa la posición, orientación, color y forma reales de la tortuga', () => {
    const pose = getTurtlePose([
      { type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, color: 'blue' },
      { type: 'cursor', x: 100, y: 0, heading: 90, color: 'blue', shape: 'turtle' },
    ]);

    expect(pose).toEqual({
      x: 100,
      y: 0,
      heading: -90,
      color: 'blue',
      shape: 'turtle',
    });
  });

  it('no inventa un cursor si el programa no ha producido movimiento ni estado visible', () => {
    expect(getTurtlePose([{ type: 'bgcolor', color: 'white' }])).toBeNull();
  });
});
