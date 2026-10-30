'use client';

import { useSyncExternalStore } from 'react';

function subscribeToLocaleChanges() {
  return () => {};
}

function getBrowserLocaleAndTimeZone() {
  const options = new Intl.DateTimeFormat().resolvedOptions();
  return `${options.locale}__${options.timeZone}`;
}

export default function InvitationLocalDateTime({ value }: { value: string }) {
  const localeAndTimeZone = useSyncExternalStore(
    subscribeToLocaleChanges,
    getBrowserLocaleAndTimeZone,
    () => 'en-US__UTC',
  );
  const separator = localeAndTimeZone.indexOf('__');
  const locale = localeAndTimeZone.slice(0, separator);
  const timeZone = localeAndTimeZone.slice(separator + 2);
  const date = new Date(value);
  const formatted = Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone,
      }).format(date);

  return (
    <time dateTime={value}>
      {formatted}
    </time>
  );
}
