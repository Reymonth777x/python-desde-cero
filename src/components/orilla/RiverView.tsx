'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/app/theme-provider';
import type { EstadoRio } from '@/lib/orilla/replay';
import type { Rumbo } from '@/lib/orilla/types';

const CELDA = 40;
type Colores = { agua: string; orilla: string; tinta: string; acento: string; exito: string; aviso: string; superficie: string; fondo: string };
function leerColores(elemento: Element): Colores {
  const estilos = getComputedStyle(elemento);
  const leer = (nombre: string, respaldo: string) => estilos.getPropertyValue(nombre).trim() || respaldo;
  return { agua: leer('--theme-accent-light', '#dce5d8'), orilla: leer('--theme-border-dark', '#6b5a3a'), tinta: leer('--theme-ink', '#252b25'), acento: leer('--theme-accent', '#294936'), exito: leer('--theme-success', '#2e6b3a'), aviso: leer('--theme-warning', '#8a5a00'), superficie: leer('--theme-surface', '#ffffff'), fondo: leer('--theme-bg-secondary', '#ebe9df') };
}
function dibujarCelda(ctx: CanvasRenderingContext2D, ch: string, x: number, y: number, col: Colores) {
  const s = CELDA, cx = x + s / 2, cy = y + s / 2;
  ctx.lineWidth = 2;
  if (ch === '#') { ctx.fillStyle = col.orilla; ctx.fillRect(x, y, s, s); return; }
  if (ch === 'x') { ctx.fillStyle = col.fondo; ctx.fillRect(x, y, s, s); return; }
  ctx.fillStyle = ch === 'S' ? col.fondo : col.agua; ctx.fillRect(x, y, s, s);
  ctx.strokeStyle = col.tinta; ctx.fillStyle = col.tinta;
  switch (ch) {
    case '~': ctx.beginPath(); ctx.arc(x + 12, y + 14, 2, 0, Math.PI * 2); ctx.arc(x + 26, y + 22, 2, 0, Math.PI * 2); ctx.arc(x + 14, y + 30, 2, 0, Math.PI * 2); ctx.fill(); break;
    case 'J': ctx.strokeStyle = col.exito; for (const dx of [-8, 0, 8]) { ctx.beginPath(); ctx.moveTo(cx + dx, y + s - 6); ctx.lineTo(cx + dx + dx / 4, y + 8); ctx.stroke(); } break;
    case 'R': ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x + 6, y + s - 8); ctx.lineTo(x + s - 6, y + 8); ctx.stroke(); break;
    case 'B': ctx.fillStyle = col.acento; ctx.beginPath(); ctx.arc(cx, cy, 11, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = col.superficie; ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill(); break;
    case 'M': ctx.strokeStyle = col.orilla; ctx.strokeRect(x + 4, y + 4, s - 8, s - 8); for (const dy of [14, 24]) { ctx.beginPath(); ctx.moveTo(x + 4, y + dy); ctx.lineTo(x + s - 4, y + dy); ctx.stroke(); } break;
    case 'S': ctx.lineWidth = 1; for (let d = 6; d < s * 2; d += 10) { ctx.beginPath(); ctx.moveTo(x + Math.max(0, d - s), y + Math.min(d, s)); ctx.lineTo(x + Math.min(d, s), y + Math.max(0, d - s)); ctx.stroke(); } break;
    case '*': ctx.fillStyle = col.aviso; ctx.beginPath(); ctx.moveTo(cx, cy - 11); ctx.lineTo(cx + 9, cy); ctx.lineTo(cx, cy + 11); ctx.lineTo(cx - 9, cy); ctx.closePath(); ctx.fill(); break;
    case 'F': ctx.fillStyle = col.tinta; ctx.beginPath(); ctx.ellipse(cx - 2, cy, 11, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx + 8, cy); ctx.lineTo(cx + 15, cy - 6); ctx.lineTo(cx + 15, cy + 6); ctx.closePath(); ctx.fill(); break;
    case 'L': ctx.fillStyle = col.aviso; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = col.aviso; for (let a = 0; a < 8; a += 1) { const r = (a * Math.PI) / 4; ctx.beginPath(); ctx.moveTo(cx + Math.cos(r) * 9, cy + Math.sin(r) * 9); ctx.lineTo(cx + Math.cos(r) * 14, cy + Math.sin(r) * 14); ctx.stroke(); } break;
    default: break;
  }
}
const ANGULO: Record<Rumbo, number> = { este: 0, sur: Math.PI / 2, oeste: Math.PI, norte: -Math.PI / 2 };
function dibujarNilo(ctx: CanvasRenderingContext2D, x: number, y: number, rumbo: Rumbo, col: Colores) {
  ctx.save(); ctx.translate(x + CELDA / 2, y + CELDA / 2); ctx.rotate(ANGULO[rumbo]);
  ctx.fillStyle = col.acento; ctx.strokeStyle = col.superficie; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-10, -10); ctx.lineTo(-5, 0); ctx.lineTo(-10, 10); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
}
function dibujar(canvas: HTMLCanvasElement, estado: EstadoRio, ocultarMapa: boolean) {
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  const col = leerColores(canvas);
  if (ocultarMapa) {
    canvas.width = CELDA * 3; canvas.height = CELDA * 3; ctx.fillStyle = col.fondo; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const d: Record<Rumbo, [number, number]> = { norte: [0, -1], este: [1, 0], sur: [0, 1], oeste: [-1, 0] };
    const [dc, df] = d[estado.nilo.rumbo]; const delante = estado.mapa[estado.nilo.f + df]?.[estado.nilo.c + dc] ?? 'x';
    dibujarCelda(ctx, delante === 'M' ? '.' : delante, CELDA * (1 + dc), CELDA * (1 + df), col); dibujarNilo(ctx, CELDA, CELDA, estado.nilo.rumbo, col); return;
  }
  const filas = estado.mapa.length, columnas = estado.mapa[0]?.length ?? 0;
  canvas.width = columnas * CELDA; canvas.height = filas * CELDA;
  estado.mapa.forEach((fila, y) => Array.from(fila).forEach((ch, x) => dibujarCelda(ctx, ch, x * CELDA, y * CELDA, col)));
  dibujarNilo(ctx, estado.nilo.c * CELDA, estado.nilo.f * CELDA, estado.nilo.rumbo, col);
}
export default function RiverView({ estado, ocultarMapa = false, descripcion }: { estado: EstadoRio; ocultarMapa?: boolean; descripcion: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const cuadro = window.requestAnimationFrame(() => dibujar(canvas, estado, ocultarMapa));
    return () => window.cancelAnimationFrame(cuadro);
  }, [estado, ocultarMapa, resolvedTheme]);
  const ancho = ocultarMapa ? 'max-w-[180px]' : 'max-w-full';
  return <canvas ref={canvasRef} role="img" aria-label={descripcion} data-testid="orilla-rio" className={`mx-auto block h-auto w-full ${ancho} border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)]`} />;
}
