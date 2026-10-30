'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getTurtlePose, getTurtleViewBox, type TurtleCommand } from '@/lib/turtle-rendering';

type TurtleCanvasProps = {
  commands: TurtleCommand[];
  width?: number;
  height?: number;
};

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 338;
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

  useEffect(() => {
    commandsRef.current = commands;
  }, [commands]);

  useEffect(() => {
    const resetFrame = requestAnimationFrame(() => {
      setCurrentStep(0);
      setIsPlaying(false);
    });
    return () => cancelAnimationFrame(resetFrame);
  }, [commands]);

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

  const visibleCommands = commands.slice(0, currentStep);
  const turtlePose = getTurtlePose(visibleCommands);
  const hasTurtleCursor = commands.some((command) => command.type === 'cursor');
  const viewBox = getTurtleViewBox(commands, width, height);
  const gridStep = 50;
  const firstGridX = Math.floor(viewBox.left / gridStep) * gridStep;
  const firstGridY = Math.floor(viewBox.top / gridStep) * gridStep;
  const gridColumns = Math.ceil((viewBox.left + viewBox.width - firstGridX) / gridStep) + 1;
  const gridRows = Math.ceil((viewBox.top + viewBox.height - firstGridY) / gridStep) + 1;

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
      <div className="relative w-full h-full border border-[var(--theme-code-border)]">
        <svg
          width="100%"
          height="100%"
          viewBox={viewBox.viewBox}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          style={{ backgroundColor: bgColor }}
        >
          {showGrid && (
            <g stroke="var(--theme-border)" strokeOpacity="0.3" strokeWidth="1">
              {Array.from({ length: gridColumns }, (_, i) => {
                const pos = firstGridX + i * gridStep;
                return <line key={"grid-x-" + i} x1={pos} y1={viewBox.top} x2={pos} y2={viewBox.top + viewBox.height} />;
              })}
              {Array.from({ length: gridRows }, (_, i) => {
                const pos = firstGridY + i * gridStep;
                return <line key={"grid-y-" + i} x1={viewBox.left} y1={pos} x2={viewBox.left + viewBox.width} y2={pos} />;
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
          {showTurtle && hasTurtleCursor && turtlePose && (
            <g transform={"translate(" + turtlePose.x + "," + -turtlePose.y + ") rotate(" + turtlePose.heading + ")"}>
              {turtlePose.shape === 'turtle' ? (
                <g fill={turtlePose.color} stroke="var(--theme-code-bg)" strokeWidth="1">
                  <ellipse cx="-1" cy="0" rx="9" ry="7" />
                  <circle cx="11" cy="0" r="4" />
                  <ellipse cx="-6" cy="-7" rx="3" ry="2.5" />
                  <ellipse cx="4" cy="-7" rx="3" ry="2.5" />
                  <ellipse cx="-6" cy="7" rx="3" ry="2.5" />
                  <ellipse cx="4" cy="7" rx="3" ry="2.5" />
                  <path d="M-10,0 L-15,-3 L-15,3 Z" />
                </g>
              ) : turtlePose.shape === 'square' ? (
                <rect x="-7" y="-7" width="14" height="14" fill={turtlePose.color} stroke="var(--theme-code-bg)" strokeWidth="1" />
              ) : turtlePose.shape === 'circle' ? (
                <circle cx="0" cy="0" r="7" fill={turtlePose.color} stroke="var(--theme-code-bg)" strokeWidth="1" />
              ) : (
                <path d="M-8,-7 L10,0 L-8,7 Z" fill={turtlePose.color} stroke="var(--theme-code-bg)" strokeWidth="1" />
              )}
            </g>
          )}
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-md">
        <div className="flex items-center gap-2 text-xs text-[var(--theme-muted)]">
          <span>Velocidad:</span>
          <button
            type="button"
            onClick={() => setSpeedValue(0.5)}
            className={"px-2 py-0.5 rounded text-xs transition-colors " + (speed === 0.5 ? "bg-[var(--theme-accent)] text-[var(--theme-ink-inverse)]" : "hover:bg-[var(--theme-bg-secondary)]")}
          >
            Lento
          </button>
          <button
            type="button"
            onClick={() => setSpeedValue(1)}
            className={"px-2 py-0.5 rounded text-xs transition-colors " + (speed === 1 ? "bg-[var(--theme-accent)] text-[var(--theme-ink-inverse)]" : "hover:bg-[var(--theme-bg-secondary)]")}
          >
            Normal
          </button>
          <button
            type="button"
            onClick={() => setSpeedValue(2)}
            className={"px-2 py-0.5 rounded text-xs transition-colors " + (speed === 2 ? "bg-[var(--theme-accent)] text-[var(--theme-ink-inverse)]" : "hover:bg-[var(--theme-bg-secondary)]")}
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

        <div className="flex items-center gap-2 text-xs text-[var(--theme-muted)]">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="accent-[var(--theme-accent)]"
            />
            Cuadr\u00edcula
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showTurtle}
              onChange={(e) => setShowTurtle(e.target.checked)}
              className="accent-[var(--theme-accent)]"
            />
            Tortuga
          </label>
        </div>

        <div className="text-xs text-[var(--theme-muted)]">
          Paso {currentStep} de {commands.length}
        </div>
      </div>
    </div>
  );
}
