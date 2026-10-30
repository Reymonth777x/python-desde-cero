'use client';

import { useState } from 'react';

export default function InvitationCodeCopy({ code }: { code: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  }

  return (
    <div className='flex min-w-0 flex-wrap items-center gap-2'>
      <code className='break-all font-mono text-sm'>{code}</code>
      <button
        type='button'
        onClick={copyCode}
        className='inline-flex min-h-9 items-center border border-[var(--theme-border)] px-2 text-xs font-semibold text-[var(--theme-accent)] hover:bg-[var(--theme-bg-secondary)]'
        aria-label={`Copiar código ${code}`}
      >
        {status === 'copied' ? 'Copiado' : 'Copiar'}
      </button>
      <span aria-live='polite' className='sr-only'>
        {status === 'copied' ? 'Código copiado' : status === 'failed' ? 'No se pudo copiar. Selecciona el código manualmente.' : ''}
      </span>
    </div>
  );
}
