'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { GameAction, GameState, KitchenLevel } from '@/lib/game/api';

type GameCanvasProps = {
  level: KitchenLevel;
  onAction: (action: GameAction) => void;
};

export default function GameCanvas({ level, onAction }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const state = useMemo<GameState>(() => ({
    step: 0,
    max_steps: level.max_steps,
    chef: {
      x: level.chef_start_x,
      y: level.chef_start_y,
      facing: 'right',
      holding: null,
    },
    ingredients: level.ingredients,
    stoves: level.stoves,
    plates: level.plates,
    orders: level.orders.map((order, index) => ({
      id: index,
      items: order.items,
      completed: false,
    })),
    current_order_index: 0,
    game_over: false,
    won: false,
  }), [level]);

  const doAction = useCallback((action: GameAction) => {
    onAction(action);
  }, [onAction]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const bg = getComputedStyle(document.documentElement).getPropertyValue('--theme-bg').trim() || '#fff';
    const border = getComputedStyle(document.documentElement).getPropertyValue('--theme-border').trim() || '#ccc';
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--theme-accent').trim() || '#000';

    context.fillStyle = bg;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = border;
    context.lineWidth = 1;
    for (let index = 0; index <= 10; index++) {
      context.beginPath();
      context.moveTo(index * 60, 0);
      context.lineTo(index * 60, 600);
      context.stroke();
      context.beginPath();
      context.moveTo(0, index * 60);
      context.lineTo(600, index * 60);
      context.stroke();
    }

    context.fillStyle = accent;
    context.font = 'bold 14px monospace';
    context.textAlign = 'center';
    state.orders.forEach((order, index) => {
      context.fillStyle = order.completed ? '#4ade80' : '#fbbf24';
      context.fillText('P' + (index + 1) + ': ' + order.items.join(','), 50, 20 + index * 25);
    });

    Object.entries(state.ingredients).forEach(([id, ingredient]) => {
      if (ingredient.available) {
        context.fillStyle = '#f97316';
        context.beginPath();
        context.arc(ingredient.x * 60 + 30, ingredient.y * 60 + 30, 12, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = '#fff';
        context.font = 'bold 10px monospace';
        context.fillText(id[0] ?? '', ingredient.x * 60 + 26, ingredient.y * 60 + 34);
      }
    });

    context.fillStyle = '#fff';
    context.font = 'bold 12px monospace';
    context.textAlign = 'center';
    context.fillText(state.chef.holding ? state.chef.holding[0] : 'C', state.chef.x * 60 + 30, state.chef.y * 60 + 35);
  }, [state]);

  useEffect(() => {
    draw();
  }, [draw]);

  const firstIngredient = Object.keys(state.ingredients)[0] ?? '';
  const firstStove = Object.keys(state.stoves)[0] ?? '';
  const firstPlate = Object.keys(state.plates)[0] ?? '';

  return (
    <div className="bg-[#theme-code-bg] border border-[#theme-code-border] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[#theme-ink] font-semibold">
          Paso {state.step} / {state.max_steps}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => doAction({ type: 'mover', direccion: 'arriba' })} className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse]">⬆️</button>
          <div className="flex flex-col gap-1">
            <button onClick={() => doAction({ type: 'mover', direccion: 'izquierda' })} className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse]">⬅️</button>
            <button onClick={() => doAction({ type: 'mover', direccion: 'derecha' })} className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse]">➡️</button>
          </div>
          <button onClick={() => doAction({ type: 'mover', direccion: 'abajo' })} className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse]">⬇️</button>
        </div>
      </div>
      <canvas ref={canvasRef} width={600} height={600} className="border border-[#theme-border] bg-[#theme-surface] rounded" />
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => doAction({ type: 'tomar', ingrediente: firstIngredient })}
          className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse] disabled:opacity-50"
          disabled={!firstIngredient}
        >
          Tomar
        </button>
        <button onClick={() => doAction({ type: 'cortar' })} className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse]">Cortar</button>
        <button
          onClick={() => doAction({ type: 'cocinar', estufa: firstStove })}
          className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse] disabled:opacity-50"
          disabled={!firstStove}
        >
          Cocinar
        </button>
        <button
          onClick={() => doAction({ type: 'emplatar', plato: firstPlate })}
          className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse] disabled:opacity-50"
          disabled={!firstPlate}
        >
          Emplatar
        </button>
        <button onClick={() => doAction({ type: 'servir', mesa: 'mesa-1' })} className="px-3 py-1 text-xs border border-[#theme-accent] text-[#theme-accent] hover:bg-[#theme-accent] hover:text-[#theme-ink-inverse]">Servir</button>
      </div>
    </div>
  );
}
