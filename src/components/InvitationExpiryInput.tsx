'use client';

import { useState, type ChangeEvent } from 'react';
import { localDateTimeToUtcIso } from '@/lib/invitation-date';

export default function InvitationExpiryInput() {
  const [localValue, setLocalValue] = useState('');
  const [utcValue, setUtcValue] = useState('');
  const [invalidLocalTime, setInvalidLocalTime] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    setLocalValue(value);

    if (!value) {
      setUtcValue('');
      setInvalidLocalTime(false);
      return;
    }

    const localDate = new Date(value);
    const matchesSelectedWallTime =
      !Number.isNaN(localDate.getTime()) &&
      localDate.getFullYear() === Number(value.slice(0, 4)) &&
      localDate.getMonth() + 1 === Number(value.slice(5, 7)) &&
      localDate.getDate() === Number(value.slice(8, 10)) &&
      localDate.getHours() === Number(value.slice(11, 13)) &&
      localDate.getMinutes() === Number(value.slice(14, 16));

    const utc = matchesSelectedWallTime
      ? localDateTimeToUtcIso(value, localDate.getTimezoneOffset())
      : null;

    setUtcValue(utc ?? '');
    setInvalidLocalTime(!utc);
  }

  return (
    <>
      <input
        id="expires_at_local"
        name="expires_at_local"
        type="datetime-local"
        value={localValue}
        onChange={handleChange}
        className="mt-1 min-h-12 w-full border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-3 text-base text-[var(--theme-ink)] outline-none focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-focus-ring)]"
      />
      <input type="hidden" name="expires_at" value={utcValue} />
      <p className="mt-2 text-xs text-[var(--theme-muted)]">
        La hora se interpreta según la zona horaria de tu dispositivo y se guarda como un instante exacto.
      </p>
      {invalidLocalTime && (
        <p role="alert" className="mt-2 text-xs text-[var(--theme-error-dark)]">
          Esa hora local no existe o no es válida. Elige otra fecha u hora.
        </p>
      )}
    </>
  );
}
