export type GameAction =
  | { type: 'mover'; direccion: 'arriba' | 'abajo' | 'izquierda' | 'derecha' }
  | { type: 'tomar'; ingrediente: string }
  | { type: 'cortar' }
  | { type: 'cocinar'; estufa: string }
  | { type: 'emplatar'; plato: string }
  | { type: 'servir'; mesa: string }
  | { type: 'esperar'; pasos?: number };

export type KitchenEntity = {
  x: number;
  y: number;
  available?: boolean;
  [attribute: string]: unknown;
};

export type GameResult = {
  ok: boolean;
  error?: string;
  x?: number;
  y?: number;
  holding?: string | null;
  ingrediente?: string;
  estufa?: string;
  plato?: string;
  mesa?: string;
  chopped?: boolean;
  steps?: number;
  [property: string]: unknown;
};

export type GameState = {
  step: number;
  max_steps: number;
  chef: { x: number; y: number; facing: string; holding: string | null };
  ingredients: Record<string, KitchenEntity>;
  stoves: Record<string, KitchenEntity>;
  plates: Record<string, KitchenEntity>;
  orders: Array<{ id: number; items: string[]; completed: boolean }>;
  current_order_index: number;
  game_over: boolean;
  won: boolean;
};

export type GameEvent = {
  type: string;
  step?: number;
  data?: Record<string, unknown>;
  [property: string]: unknown;
};

export type KitchenLevel = {
  id: string;
  title: string;
  concept: string;
  max_steps: number;
  chef_start_x: number;
  chef_start_y: number;
  ingredients: Record<string, KitchenEntity>;
  stoves: Record<string, KitchenEntity>;
  plates: Record<string, KitchenEntity>;
  orders: Array<{ items: string[] }>;
  hint: string;
};

type PyodideRuntime = {
  runPythonAsync(source: string): Promise<unknown>;
  toJs(
    value: unknown,
    options?: {
      dict_converter?: (entries: Map<string, unknown>) => Record<string, unknown>;
    },
  ): unknown;
  globals: {
    get(name: string): unknown;
  };
};

declare global {
  interface Window {
    pyodide?: PyodideRuntime;
  }
}

type FallbackEngine = {
  step_count: number;
  max_steps: number;
  chef_x: number;
  chef_y: number;
  chef_facing: string;
  chef_holding: string | null;
  game_over: boolean;
  won: boolean;
  events: GameEvent[];
  level: KitchenLevel;
};

type PythonEngineProxy = {
  get_state?: () => unknown;
  get_events?: () => unknown;
  reset?: () => unknown;
};

type Engine = FallbackEngine | PythonEngineProxy;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function dictToRecord(entries: Map<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(entries);
}

function normalizeGameResult(value: unknown): GameResult {
  const record = isRecord(value) ? value : null;
  if (!record || typeof record.ok !== 'boolean') {
    return { ok: false, error: 'El motor de Python devolvió una respuesta no reconocida.' };
  }

  return {
    ...record,
    ok: record.ok,
    ...(typeof record.error === 'string' ? { error: record.error } : {}),
  } as GameResult;
}

function normalizeGameState(value: unknown): GameState | null {
  if (!isRecord(value) || !isRecord(value.chef)) return null;
  if (typeof value.step !== 'number' || typeof value.max_steps !== 'number') return null;
  if (!isRecord(value.ingredients) || !isRecord(value.stoves) || !isRecord(value.plates)) return null;
  if (!Array.isArray(value.orders)) return null;
  if (typeof value.current_order_index !== 'number') return null;
  if (typeof value.game_over !== 'boolean' || typeof value.won !== 'boolean') return null;
  return value as unknown as GameState;
}

function normalizeGameEvents(value: unknown): GameEvent[] {
  if (!Array.isArray(value)) return [];
  return value.filter((event): event is Record<string, unknown> => isRecord(event) && typeof event.type === 'string')
    .map((event) => event as GameEvent);
}

export class KitchenAPI {
  private engine: Engine | null = null;
  private pyodide: PyodideRuntime | null = null;
  private initialized = false;

  async init(level: KitchenLevel): Promise<void> {
    this.engine = null;
    this.pyodide = null;
    this.initialized = false;

    const runtime = typeof window !== 'undefined' ? window.pyodide : undefined;
    if (runtime && typeof runtime.runPythonAsync === 'function') {
      try {
        await this.initWithPyodide(level, runtime);
        this.initialized = true;
        return;
      } catch (error) {
        console.error('Error inicializando motor de cocina; se usará el modo alternativo:', error);
        this.engine = null;
        this.pyodide = null;
      }
    }

    this.initJavaScriptFallback(level);
    this.initialized = true;
  }

  private async initWithPyodide(level: KitchenLevel, runtime: PyodideRuntime): Promise<void> {
    const engineCodeResponse = await fetch('/game-engine.py');
    if (!engineCodeResponse.ok) {
      throw new Error('No se pudo descargar el motor de cocina.');
    }

    const engineCode = await engineCodeResponse.text();
    await runtime.runPythonAsync(engineCode);

    const serializedLevel = JSON.stringify(level);
    const pythonSource = [
      'from game_engine import KitchenEngine',
      'import json',
      'level_data = json.loads(' + JSON.stringify(serializedLevel) + ')',
      'engine = KitchenEngine(level_data)',
    ].join('\n');

    await runtime.runPythonAsync(pythonSource);

    const engine = runtime.globals.get('engine');
    if (typeof engine !== 'object' || engine === null) {
      throw new Error('El motor Python no se inicializó correctamente.');
    }

    this.pyodide = runtime;
    this.engine = engine as PythonEngineProxy;
  }

  private initJavaScriptFallback(level: KitchenLevel): void {
    this.engine = {
      step_count: 0,
      max_steps: level.max_steps,
      chef_x: level.chef_start_x,
      chef_y: level.chef_start_y,
      chef_facing: 'right',
      chef_holding: null,
      game_over: false,
      won: false,
      events: [],
      level,
    };
  }

  private fallbackEngine(): FallbackEngine {
    if (!this.engine || this.pyodide) {
      throw new Error('El motor alternativo no está inicializado.');
    }
    return this.engine as FallbackEngine;
  }

  private pythonEngine(): PythonEngineProxy {
    if (!this.engine || !this.pyodide) {
      throw new Error('El motor Python no está inicializado.');
    }
    return this.engine as PythonEngineProxy;
  }

  async runAction(action: GameAction): Promise<GameResult> {
    if (!this.initialized || !this.engine) {
      return { ok: false, error: 'El motor no está inicializado.' };
    }

    try {
      return this.pyodide
        ? await this.runActionWithPyodide(action)
        : this.runActionWithJavaScript(action);
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async runActionWithPyodide(action: GameAction): Promise<GameResult> {
    const runtime = this.pyodide;
    if (!runtime) {
      return { ok: false, error: 'El motor Python no está disponible.' };
    }

    let methodName: string;
    const args: string[] = [];

    switch (action.type) {
      case 'mover':
        methodName = 'mover';
        args.push(JSON.stringify(action.direccion));
        break;
      case 'tomar':
        methodName = 'tomar';
        args.push(JSON.stringify(action.ingrediente));
        break;
      case 'cortar':
        methodName = 'cortar';
        break;
      case 'cocinar':
        methodName = 'cocinar';
        args.push(JSON.stringify(action.estufa));
        break;
      case 'emplatar':
        methodName = 'emplatar';
        args.push(JSON.stringify(action.plato));
        break;
      case 'servir':
        methodName = 'servir';
        args.push(JSON.stringify(action.mesa));
        break;
      case 'esperar':
        methodName = 'esperar';
        args.push(String(action.pasos ?? 1));
        break;
    }

    const source = 'engine.' + methodName + '(' + args.join(', ') + ')';
    const result = await runtime.runPythonAsync(source);
    return normalizeGameResult(runtime.toJs(result, { dict_converter: dictToRecord }));
  }

  private runActionWithJavaScript(action: GameAction): GameResult {
    const engine = this.fallbackEngine();

    if (engine.game_over) {
      return { ok: false, error: 'El juego ya terminó.' };
    }

    engine.step_count += 1;
    if (engine.step_count > engine.max_steps) {
      engine.game_over = true;
      return { ok: false, error: 'Límite de pasos alcanzado.' };
    }

    switch (action.type) {
      case 'mover':
        engine.chef_facing = action.direccion;
        if (action.direccion === 'arriba') engine.chef_y -= 1;
        if (action.direccion === 'abajo') engine.chef_y += 1;
        if (action.direccion === 'izquierda') engine.chef_x -= 1;
        if (action.direccion === 'derecha') engine.chef_x += 1;
        return { ok: true, x: engine.chef_x, y: engine.chef_y, holding: engine.chef_holding };

      case 'tomar':
        if (engine.chef_holding) return { ok: false, error: 'Ya estás sosteniendo algo.' };
        engine.chef_holding = action.ingrediente;
        return { ok: true, ingrediente: action.ingrediente, holding: engine.chef_holding };

      case 'cortar':
        if (!engine.chef_holding) return { ok: false, error: 'No estás sosteniendo nada.' };
        return { ok: true, ingrediente: engine.chef_holding, chopped: true };

      case 'cocinar':
        if (!engine.chef_holding) return { ok: false, error: 'No estás sosteniendo nada.' };
        engine.events.push({
          type: 'ingrediente_en_estufa',
          step: engine.step_count,
          data: { estufa: action.estufa, ingrediente: engine.chef_holding },
        });
        engine.chef_holding = null;
        return { ok: true, estufa: action.estufa };

      case 'emplatar':
        if (!engine.chef_holding) return { ok: false, error: 'No estás sosteniendo nada.' };
        engine.events.push({
          type: 'ingrediente_emplatado',
          step: engine.step_count,
          data: { plato: action.plato, ingrediente: engine.chef_holding },
        });
        engine.chef_holding = null;
        return { ok: true, plato: action.plato };

      case 'servir':
        engine.events.push({
          type: 'plato_servido',
          step: engine.step_count,
          data: { mesa: action.mesa },
        });
        return { ok: true, mesa: action.mesa };

      case 'esperar':
        return { ok: true, steps: engine.step_count };
    }
  }

  getState(): GameState | null {
    if (!this.initialized || !this.engine) return null;

    if (this.pyodide) {
      const pythonEngine = this.pythonEngine();
      if (typeof pythonEngine.get_state !== 'function') return null;
      const value = this.pyodide.toJs(pythonEngine.get_state(), { dict_converter: dictToRecord });
      return normalizeGameState(value);
    }

    const engine = this.fallbackEngine();
    return {
      step: engine.step_count,
      max_steps: engine.max_steps,
      chef: {
        x: engine.chef_x,
        y: engine.chef_y,
        facing: engine.chef_facing,
        holding: engine.chef_holding,
      },
      ingredients: engine.level.ingredients,
      stoves: engine.level.stoves,
      plates: engine.level.plates,
      orders: engine.level.orders.map((order, index) => ({
        id: index,
        items: order.items,
        completed: false,
      })),
      current_order_index: 0,
      game_over: engine.game_over,
      won: engine.won,
    };
  }

  getEvents(): GameEvent[] {
    if (!this.initialized || !this.engine) return [];

    if (this.pyodide) {
      const pythonEngine = this.pythonEngine();
      if (typeof pythonEngine.get_events !== 'function') return [];
      const value = this.pyodide.toJs(pythonEngine.get_events(), { dict_converter: dictToRecord });
      return normalizeGameEvents(value);
    }

    return this.fallbackEngine().events;
  }

  reset(): void {
    if (!this.initialized || !this.engine) return;

    if (this.pyodide) {
      const pythonEngine = this.pythonEngine();
      if (typeof pythonEngine.reset === 'function') {
        pythonEngine.reset();
      }
      return;
    }

    const engine = this.fallbackEngine();
    engine.step_count = 0;
    engine.game_over = false;
    engine.won = false;
    engine.events = [];
    engine.chef_holding = null;
    engine.chef_x = engine.level.chef_start_x;
    engine.chef_y = engine.level.chef_start_y;
    engine.chef_facing = 'right';
  }
}

export const kitchenAPI = new KitchenAPI();
