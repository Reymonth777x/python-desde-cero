'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type TurtleCommand = {
  type: 'line' | 'fill' | 'dot' | 'write' | 'bgcolor';
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  color?: string;
  size?: number;
  points?: Array<[number, number]>;
  text?: string;
};

type TurtleCanvasProps = {
  commands: TurtleCommand[];
  width?: number;
  height?: number;
};

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 500;
const VIEW_SIZE = 500;

export default function TurtleCanvas({
  commands,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}: TurtleCanvasProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showTurtle, setShowTurtle] = useState(true);

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const commandsRef = useRef(commands);
  commandsRef.current = commands;

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [commands.length]);

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const stepDuration = useCallback(() => {
    return Math.max(30, 100 / speed);
  }, [speed]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const restart = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const stepForward = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, commandsRef.current.length));
  }, []);

  const stepBackward = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const setSpeedValue = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimeRef.current;
      const interval = stepDuration();

      if (elapsed >= interval) {
        lastTimeRef.current = timestamp;
        setCurrentStep((prev) => {
          if (prev >= commandsRef.current.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, stepDuration]);

  const visibleCommands = commandsRef.current.slice(0, currentStep);
  const turtleStateRef = useRef<{ x: number; y: number; heading: number }>({
    x: 0,
    y: 0,
    heading: 0,
  });

  const bgColorCmd = [...visibleCommands].reverse().find((c) => c.type === 'bgcolor');
  const bgColor = bgColorCmd?.color || 'var(--theme-bg)';

  return (
    <div
      className="relative w-full max-w-[600px] aspect-video rounded-lg overflow-hidden"
      style={{
        backgroundColor: 'var(--theme-code-bg)',
        borderColor: 'var(--theme-code-border)',
      }}
    >
      <div className="relative w-full h-full border border-[#theme-code-border]">
        <svg
          width="100%"
          height="100%"
          viewBox={'-' + (VIEW_SIZE / 2) + ' -' + (VIEW_SIZE / 2) + ' ' + VIEW_SIZE + ' ' + VIEW_SIZE}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          style={{ backgroundColor: bgColor }}
        >
          {showGrid && (
            <g stroke="var(--theme-border)" strokeOpacity="0.3" strokeWidth="1">
              {[...Array(11)].map((_, i) => {
                const pos = -250 + i * 50;
                return (
                  <g key={"grid-" + i}>
                    <line x1={pos} y1={-250} x2={pos} y2={250} />
                    <line x1={-250} y1={pos} x2={250} y2={pos} />
                  </g>
                );
              })}
            </g>
          )}
          {visibleCommands.map((cmd, idx) => {
            if (cmd.type === 'line') {
              return (
                <line
                  key={"turtle-line-" + idx}
                  x1={cmd.x1!}
                  y1={-cmd.y1!}
                  x2={cmd.x2!}
                  y2={-cmd.y2!}
                  stroke={cmd.color || 'var(--theme-ink)'}
                  strokeWidth={cmd.size || 1}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            }
            if (cmd.type === 'dot') {
              return (
                <circle
                  key={"turtle-dot-" + idx}
                  cx={cmd.x!}
                  cy={-cmd.y!}
                  r={(cmd.size || 2) / 2}
                  fill={cmd.color || 'var(--theme-ink)'}
                />
              );
            }
            if (cmd.type === 'fill') {
              return (
                <polygon
                  key={"turtle-fill-" + idx}
                  points={cmd.points?.map(([x, y]) => x + ',' + -y).join(' ') ?? ''}
                  fill={cmd.color || 'var(--theme-ink)'}
                  fillOpacity="0.6"
                />
              );
            }
            if (cmd.type === 'write') {
              return (
                <text
                  key={"turtle-write-" + idx}
                  x={cmd.x!}
                  y={-cmd.y!}
                  fill={cmd.color || 'var(--theme-ink)'}
                  fontSize={12}
                  fontFamily="monospace"
                  textAnchor="start"
                  dominantBaseline="middle"
                >
                  {cmd.text}
                </text>
              );
            }
            return null;
          })}
          {showTurtle && visibleCommands.length > 0 && (
            <g transform={"translate(" + turtleStateRef.current.x + "," + -turtleStateRef.current.y + ") rotate(" + turtleStateRef.current.heading + ")"}>
              <path
                d="M-8,8 L8,8 L0,-12 Z"
                fill="var(--theme-accent)"
                stroke="var(--theme-accent-dark)"
                strokeWidth="1"
              />
              <circle cx="0" cy="0" r="3" fill="var(--theme-ink-inverse)" />
            </g>
          )}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-[#theme-surface] border border-[#theme-border] rounded-md">
        <div className="flex items-center gap-2 text-xs text-[#theme-muted]">
          <span>Velocidad:</span>
          <button
            type="button"
            onClick={() => setSpeedValue(0.5)}
            className={"px-2 py-0.5 rounded text-xs transition-colors " + (speed === 0.5 ? "bg-[#theme-accent] text-[#theme-ink-inverse]" : "hover:bg-[#theme-bg-secondary]")}
          >
            Lento
          </button>
          <button
            type="button"
            onClick={() => setSpeedValue(1)}
            className={"px-2 py-0.5 rounded text-xs transition-colors " + (speed === 1 ? "bg-[#theme-accent] text-[#theme-ink-inverse]" : "hover:bg-[#theme-bg-secondary]")}
          >
            Normal
          </button>
          <button
            type="button"
            onClick={() => setSpeedValue(2)}
            className={"px-2 py-0.5 rounded text-xs transition-colors " + (speed === 2 ? "bg-[#theme-accent] text-[#theme-ink-inverse]" : "hover:bg-[#theme-bg-secondary]")}
          >
            R\u00e1pido
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={stepBackward}
            disabled={currentStep === 0 || isPlaying}
            className="min-h-9 px-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            \u25C0 Paso atr\u00e1s
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="min-h-9 px-3 text-xs font-semibold transition-colors"
            style={{
              backgroundColor: 'var(--theme-accent)',
              color: 'var(--theme-ink-inverse)',
            }}
          >
            {isPlaying ? 'Pausa' : 'Reproducir'}
          </button>
          <button
            type="button"
            onClick={stepForward}
            disabled={currentStep >= commands.length || isPlaying}
            className="min-h-9 px-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Paso adelante \u25B6
          </button>
          <button
            type="button"
            onClick={restart}
            className="min-h-9 px-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentStep === 0 && !isPlaying}
          >
            Reiniciar
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#theme-muted]">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="accent-[#theme-accent]"
            />
            Cuadr\u00edcula
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showTurtle}
              onChange={(e) => setShowTurtle(e.target.checked)}
              className="accent-[#theme-accent]"
            />
            Tortuga
          </label>
        </div>

        <div className="text-xs text-[#theme-muted]">
          Paso {currentStep} de {commands.length}
        </div>
      </div>
    </div>
  );
}


