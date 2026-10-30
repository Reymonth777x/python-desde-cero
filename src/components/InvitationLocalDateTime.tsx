'use client';

import { useEffect, useState } from 'react';

export default function InvitationLocalDateTime({ value }: { value: string }) {
  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    const date = new Date(value);
    setFormatted(
      Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(date),
    );
  }, [value]);

  return (
    <time dateTime={value}>
      {formatted || `${value.slice(0, 16).replace('T', ' ')} UTC`}
    </time>
  );
}
