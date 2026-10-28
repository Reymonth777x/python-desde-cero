'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type GameCanvasProps = {
  level: any;
  onAction: (action: any) => void;
};

export default function GameCanvas({ level, onAction }: GameCanvasProps) {
  const [state, setState] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setState({
      step: 0,
      max_steps: level.max_steps,
      chef: { x: level.chef_start_x, y: level.chef_start_y, facing: 'right', holding: null },
      ingredients: level.ingredients,
      stoves: level.stoves,
      plates: level.plates,
      orders: level.orders.map((o: any, i: number) => ({ id: i, items: o.items, completed: false })),
      current_order_index: 0,
      game_over: false,
      won: false,
    });
  }, [level]);

  const doAction = useCallback((type: string, data: any = {}) => {
    onAction({ type, ...data });
  }, [onAction]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !state) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bg = getComputedStyle(document.documentElement).getPropertyValue('--theme-bg').trim() || '#fff';
    const border = getComputedStyle(document.documentElement).getPropertyValue('--theme-border').trim() || '#ccc';
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--theme-accent').trim() || '#000';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 60, 0); ctx.lineTo(i * 60, 600); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * 60); ctx.lineTo(600, i * 60); ctx.stroke();
    }

    ctx.fillStyle = accent;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    state.orders.forEach((o: any, i: number) => {
      ctx.fillStyle = o.completed ? '#4ade80' : '#fbbf24';
      ctx.fillText(`P${i + 1}: ${o.items.join(',')}`, 50, 20 + i * 25);
    });

    Object.entries(state.ingredients).forEach(([id, ing]: any) => {
      if (ing.available) {
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(ing.x * 60 + 30, ing.y * 60 + 30, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(id[0], ing.x * 60 + 26, ing.y * 60 + 34);
      }
    });

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(state.chef.holding ? state.chef.holding[0] : 'C', state.chef.x * 60 + 30, state.chef.y * 60 + 35);
  }, [state]);

  useEffect(() => { draw(); }, [state, draw]);

  return (
    <div className="bg-[#theme-code-bg] border border-[#theme-code-border] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[#theme-ink] font-semibold">
          Paso {state?.step ?? 0} / {state?.max_steps ?? 0}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => doAction('mover', { direccion: 'arriba' })} className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse]">⬆️</button>
          <div className="flex flex-col gap-1">
            <button onClick={() => doAction('mover', { direccion: 'izquierda' })} className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse]">⬅️</button>
            <button onClick={() => doAction('mover', { direccion: 'derecha' })} className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse]">➡️</button>
          </div>
          <button onClick={() => doAction('mover', { direccion: 'abajo' })} className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse]">⬇️</button>
        </div>
      </div>
      <canvas ref={canvasRef} width={600} height={600} className="border border-[#theme-border] bg-[#theme-surface] rounded" />
      <div className="mt-3 flex gap-2">
        <button onClick={() => doAction('tomar', { ingrediente: Object.keys(state?.ingredients ?? {})[0] ?? '' })} className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse] disabled:opacity-50" disabled={!Object.keys(state?.ingredients ?? {}).length}>Tomar</button>
        <button onClick={() => doAction('cortar')} className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse]">Cortar</button>
        <button onClick={() => doAction('cocinar', { estufa: Object.keys(state?.stoves ?? {})[0] ?? '' })} className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse] disabled:opacity-50" disabled={!Object.keys(state?.stoves ?? {}).length}>Cocinar</button>
        <button onClick={() => doAction('emplatar', { plato: Object.keys(state?.plates ?? {})[0] ?? '' })} className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse] disabled:opacity-50" disabled={!Object.keys(state?.plates ?? {}).length}>Emplatar</button>
        <button onClick={() => doAction('servir', { mesa: 'mesa-1' })} className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse]">Servir</button>
      </div>
    </div>
  );
}