import { describe, expect, it } from 'vitest';
import { localDateTimeToUtcIso } from './invitation-date';

describe('conversión de vencimientos locales a UTC', () => {
  it('convierte correctamente una hora local de Costa Rica (UTC-6)', () => {
    expect(localDateTimeToUtcIso('2026-10-31T12:00', 360))
      .toBe('2026-10-31T18:00:00.000Z');
  });

  it('convierte correctamente una hora local adelantada respecto a UTC', () => {
    expect(localDateTimeToUtcIso('2026-10-31T12:00', -540))
      .toBe('2026-10-31T03:00:00.000Z');
  });

  it('rechaza fechas imposibles y valores de zona horaria inválidos', () => {
    expect(localDateTimeToUtcIso('2026-02-30T12:00', 360)).toBeNull();
    expect(localDateTimeToUtcIso('2026-10-31T12:00', 900)).toBeNull();
    expect(localDateTimeToUtcIso('31-10-2026 12:00', 360)).toBeNull();
  });
});
