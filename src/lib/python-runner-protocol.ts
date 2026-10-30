export type TurtleCommand = {
  type: 'line' | 'fill' | 'dot' | 'write' | 'bgcolor' | 'cursor';
  heading?: number;
  shape?: string;
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

const MAX_COMMANDS = 5000;
const MAX_POINTS_PER_COMMAND = 5000;
const MAX_COORDINATE = 1_000_000;
const SAFE_COLOR = /^(#[0-9a-f]{3,8}|[a-z]{1,32}|rgba?\([0-9.,%\s]+\)|hsla?\([0-9.,%\s]+\))$/i;

export function resolvePythonRunnerOrigin(
  configuredOrigin: string | undefined,
  appOrigin: string,
): string | null {
  if (!configuredOrigin || !appOrigin) return null;

  try {
    const url = new URL(configuredOrigin.trim());
    if (url.username || url.password || url.search || url.hash) return null;
    if (url.pathname !== '/' && url.pathname !== '') return null;
    if (url.origin === appOrigin) return null;

    const localHost = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if (localHost) {
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
      return url.origin;
    }

    if (
      url.protocol !== 'https:' ||
      !/^python-desdecero-runner\.[a-z0-9-]+\.workers\.dev$/.test(url.hostname)
    ) return null;
    return url.origin;
  } catch {
    return null;
  }
}

function finite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= MAX_COORDINATE;
}

function safeColor(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.length > 48 || !SAFE_COLOR.test(value)) return undefined;
  return value;
}

export function sanitizeTurtleCommands(value: unknown): TurtleCommand[] {
  if (!Array.isArray(value)) return [];

  const result: TurtleCommand[] = [];
  for (const item of value.slice(0, MAX_COMMANDS)) {
    if (!item || typeof item !== 'object') continue;
    const command = item as Record<string, unknown>;
    const type = command.type;
    if (
      type !== 'line' &&
      type !== 'fill' &&
      type !== 'dot' &&
      type !== 'write' &&
      type !== 'bgcolor' &&
      type !== 'cursor'
    ) continue;

    const next: TurtleCommand = { type };
    for (const key of ['heading', 'x', 'y', 'x1', 'y1', 'x2', 'y2'] as const) {
      if (finite(command[key])) next[key] = command[key];
    }
    if (typeof command.shape === 'string' && command.shape.length <= 24) {
      next.shape = command.shape;
    }
    next.color = safeColor(command.color) ?? 'black';
    if (finite(command.size)) next.size = Math.min(1000, Math.max(0, command.size));
    if (typeof command.text === 'string') next.text = command.text.slice(0, 1000);

    if (Array.isArray(command.points)) {
      const points: Array<[number, number]> = [];
      for (const point of command.points.slice(0, MAX_POINTS_PER_COMMAND)) {
        if (Array.isArray(point) && point.length >= 2 && finite(point[0]) && finite(point[1])) {
          points.push([point[0], point[1]]);
        }
      }
      next.points = points;
    }
    result.push(next);
  }

  return result;
}
