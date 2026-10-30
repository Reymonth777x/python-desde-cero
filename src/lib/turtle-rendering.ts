export type TurtleCommand = {
  type: 'line' | 'fill' | 'dot' | 'write' | 'bgcolor' | 'cursor';
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  heading?: number;
  shape?: string;
  color?: string;
  size?: number;
  points?: Array<[number, number]>;
  text?: string;
};

export type TurtlePose = {
  x: number;
  y: number;
  heading: number;
  color: string;
  shape: string;
};

export type TurtleViewBox = {
  viewBox: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

export function getTurtlePose(commands: TurtleCommand[]): TurtlePose | null {
  const cursor = [...commands].reverse().find((command) => command.type === 'cursor');
  if (
    cursor &&
    typeof cursor.x === 'number' &&
    Number.isFinite(cursor.x) &&
    typeof cursor.y === 'number' &&
    Number.isFinite(cursor.y)
  ) {
    return {
      x: cursor.x,
      y: cursor.y,
      heading: -(cursor.heading ?? 0),
      color: cursor.color ?? 'var(--theme-accent)',
      shape: cursor.shape ?? 'classic',
    };
  }

  const lastLine = [...commands].reverse().find(
    (command) =>
      command.type === 'line' &&
      typeof command.x1 === 'number' &&
      typeof command.y1 === 'number' &&
      typeof command.x2 === 'number' &&
      typeof command.y2 === 'number',
  );

  if (
    !lastLine ||
    lastLine.x1 === undefined ||
    lastLine.y1 === undefined ||
    lastLine.x2 === undefined ||
    lastLine.y2 === undefined
  ) {
    return null;
  }

  return {
    x: lastLine.x2,
    y: lastLine.y2,
    heading: -Math.atan2(lastLine.y2 - lastLine.y1, lastLine.x2 - lastLine.x1) * (180 / Math.PI),
    color: lastLine.color ?? 'var(--theme-accent)',
    shape: 'classic',
  };
}

export function getTurtleViewBox(
  commands: TurtleCommand[],
  width = 600,
  height = 338,
): TurtleViewBox {
  const safeWidth = Number.isFinite(width) && width > 0 ? width : 600;
  const safeHeight = Number.isFinite(height) && height > 0 ? height : 338;
  const points: Array<{ x: number; y: number; radius: number }> = [];

  const addPoint = (x: number | undefined, y: number | undefined, radius = 0) => {
    if (typeof x === 'number' && Number.isFinite(x) && typeof y === 'number' && Number.isFinite(y)) {
      points.push({ x, y, radius: Math.max(0, radius) });
    }
  };

  for (const command of commands) {
    if (command.type === 'line') {
      addPoint(command.x1, command.y1, (command.size ?? 1) / 2);
      addPoint(command.x2, command.y2, (command.size ?? 1) / 2);
    } else if (command.type === 'dot') {
      addPoint(command.x, command.y, (command.size ?? 2) / 2);
    } else if (command.type === 'fill') {
      for (const [x, y] of command.points ?? []) addPoint(x, y);
    } else if (command.type === 'write' || command.type === 'cursor') {
      addPoint(command.x, command.y);
    }
  }

  if (points.length === 0) {
    const left = -safeWidth / 2;
    const top = -safeHeight / 2;
    return {
      viewBox: left + ' ' + top + ' ' + safeWidth + ' ' + safeHeight,
      left,
      top,
      width: safeWidth,
      height: safeHeight,
    };
  }

  const minX = Math.min(...points.map((point) => point.x - point.radius));
  const maxX = Math.max(...points.map((point) => point.x + point.radius));
  const minY = Math.min(...points.map((point) => point.y - point.radius));
  const maxY = Math.max(...points.map((point) => point.y + point.radius));
  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);
  const padding = Math.max(16, Math.max(spanX, spanY) * 0.12);
  let boxWidth = spanX + padding * 2;
  let boxHeight = spanY + padding * 2;
  const aspect = safeWidth / safeHeight;

  if (boxWidth / boxHeight < aspect) {
    boxWidth = boxHeight * aspect;
  } else {
    boxHeight = boxWidth / aspect;
  }

  const centerX = (minX + maxX) / 2;
  const centerY = -(minY + maxY) / 2;
  const left = centerX - boxWidth / 2;
  const top = centerY - boxHeight / 2;

  return {
    viewBox: left + ' ' + top + ' ' + boxWidth + ' ' + boxHeight,
    left,
    top,
    width: boxWidth,
    height: boxHeight,
  };
}
