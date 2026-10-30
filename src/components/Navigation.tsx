'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeSelector from './ThemeSelector';
import ThemeSelectorNav from './ThemeSelectorNav';

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/academia', label: 'Academia' },
  { href: '/practica', label: 'Laboratorio' },
  { href: '/login', label: 'Acceso' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const onMenuKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setIsOpen(false); buttonRef.current?.focus(); }
  }, []);

  const onClickOut = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) document.addEventListener('mousedown', onClickOut);
    return () => document.removeEventListener('mousedown', onClickOut);
  }, [isOpen, onClickOut]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-[var(--theme-border)] bg-[var(--theme-bg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2" aria-label="Python desde cero - Inicio">
                <span className="flex h-8 w-8 items-center justify-center rounded bg-[var(--theme-accent)] font-serif text-xl text-[var(--theme-ink-inverse)]">Py</span>
                <span className="hidden sm:block"><span className="block text-sm font-bold tracking-wide text-[var(--theme-ink)]">PYTHON</span><span className="block text-xs tracking-[0.16em] text-[var(--theme-muted)]">DESDE CERO</span></span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === l.href ? 'bg-[var(--theme-accent)] text-[var(--theme-ink-inverse)]' : 'text-[var(--theme-muted)] hover:text-[var(--theme-accent)] hover:bg-[var(--theme-surface)]'}`} aria-current={pathname === l.href ? 'page' : undefined}>{l.label}</Link>
              ))}
              <ThemeSelectorNav />
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-[var(--theme-ink)] hover:bg-[var(--theme-surface)] rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]" aria-label="Abrir menú" aria-expanded={isOpen} ref={buttonRef}><span className="sr-only">{isOpen ? 'Cerrar menú' : 'Abrir menú'}</span><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">{isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}</svg></button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div ref={menuRef} className="md:hidden border-t border-[var(--theme-border)] bg-[var(--theme-bg)]" onKeyDown={onMenuKey}>
            <div className="px-4 py-4 space-y-1">
              <p className="mx-3 mb-2 text-[10px] font-bold tracking-[0.2em] text-[var(--theme-muted)] uppercase">Navegación</p>
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base ${pathname === l.href ? 'bg-[var(--theme-accent)] text-[var(--theme-ink-inverse)]' : 'text-[var(--theme-ink)] hover:bg-[var(--theme-surface)] hover:text-[var(--theme-accent)]'}`} aria-current={pathname === l.href ? 'page' : undefined}>{l.label}</Link>
              ))}
              <div className="mt-3 border-t border-[var(--theme-border)] px-3 pt-3">
                <ThemeSelector />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}