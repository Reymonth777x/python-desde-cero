export type GameAction =
  | { type: 'mover'; direccion: 'arriba' | 'abajo' | 'izquierda' | 'derecha' }
  | { type: 'tomar'; ingrediente: string }
  | { type: 'cortar' }
  | { type: 'cocinar'; estufa: string }
  | { type: 'emplatar'; plato: string }
  | { type: 'servir'; mesa: string }
  | { type: 'esperar'; pasos?: number };

export type KitchenFixture = {
  x: number;
  y: number;
  available?: boolean;
  [key: string]: unknown;
};

export type GameResult = {
  ok: boolean;
  error?: string;
  [key: string]: unknown;
};

export type GameState = {
  step: number;
  max_steps: number;
  chef: { x: number; y: number; facing: string; holding: string | null };
  ingredients: Record<string, KitchenFixture>;
  stoves: Record<string, KitchenFixture>;
  plates: Record<string, KitchenFixture>;
  orders: Array<{ id: number; items: string[]; completed: boolean }>;
  current_order_index: number;
  game_over: boolean;
  won: boolean;
};

export type GameEvent = {
  type: string;
  step: number;
  data: Record<string, unknown>;
};

export type KitchenLevel = {
  id: string;
  title: string;
  concept: string;
  max_steps: number;
  chef_start_x: number;
  chef_start_y: number;
  ingredients: Record<string, KitchenFixture>;
  stoves: Record<string, KitchenFixture>;
  plates: Record<string, KitchenFixture>;
  orders: Array<{ items: string[] }>;
  hint: string;
};

type PythonRuntime = {
  runPythonAsync(code: string): Promise<unknown>;
  toJs(value: unknown): unknown;
  globals: { get(name: string): unknown };
};

type PythonEngine = {
  get_state?: () => unknown;
  get_events?: () => unknown;
  reset?: () => void;
};

type JavaScriptEngine = {
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPythonRuntime(value: unknown): value is PythonRuntime {
  if (!isRecord(value) || !isRecord(value.globals)) return false;
  const globals = value.globals;
  return (
    typeof value.runPythonAsync === 'function' &&
    typeof value.toJs === 'function' &&
    typeof globals.get === 'function'
  );
}

function isPythonEngine(value: unknown): value is PythonEngine {
  return (
    isRecord(value) &&
    (typeof value.get_state === 'function' ||
      typeof value.get_events === 'function' ||
      typeof value.reset === 'function')
  );
}

function isJavaScriptEngine(value: unknown): value is JavaScriptEngine {
  return (
    isRecord(value) &&
    typeof value.step_count === 'number' &&
    typeof value.max_steps === 'number' &&
    typeof value.chef_x === 'number' &&
    typeof value.chef_y === 'number' &&
    typeof value.game_over === 'boolean' &&
    typeof value.won === 'boolean' &&
    Array.isArray(value.events) &&
    isRecord(value.level)
  );
}

function getPythonRuntime(): PythonRuntime | null {
  if (typeof window === 'undefined') return null;
  const runtime = (window as Window & { pyodide?: unknown }).pyodide;
  return isPythonRuntime(runtime) ? runtime : null;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export class KitchenAPI {
  private engine: PythonEngine | JavaScriptEngine | null = null;
  private pyodide: PythonRuntime | null = null;
  private level: KitchenLevel | null = null;
  private initialized = false;

  async init(level: KitchenLevel): Promise<void> {
    this.level = level;
    this.initialized = false;
    this.engine = null;
    this.pyodide = null;

    const runtime = getPythonRuntime();
    if (runtime) {
      try {
        await this._initWithPyodide(level, runtime);
        this.pyodide = runtime;
        this.initialized = true;
        return;
      } catch (error) {
        console.error('Error inicializando motor Python:', errorMessage(error));
      }
    }

    this._initJSFallback(level);
    this.initialized = true;
  }

  private async _initWithPyodide(level: KitchenLevel, pyodide: PythonRuntime): Promise<void> {
    const response = await fetch('/game-engine.py');
    if (!response.ok) {
      throw new Error('No se pudo cargar el motor Python (' + response.status + ').');
    }
    const engineCode = await response.text();
    await pyodide.runPythonAsync(engineCode);

    const levelLiteral = JSON.stringify(JSON.stringify(level));
    const pythonCode = [
      'from game_engine import KitchenEngine',
      'import json',
      'level_data = json.loads(' + levelLiteral + ')',
      'engine = KitchenEngine(level_data)',
    ].join('\n');
    await pyodide.runPythonAsync(pythonCode);

    const engine = pyodide.globals.get('engine');
    if (!isPythonEngine(engine)) {
      throw new Error('El motor Python no expone los métodos esperados.');
    }
    this.engine = engine;
  }

  private _initJSFallback(level: KitchenLevel): void {
    this.pyodide = null;
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

  async runAction(action: GameAction): Promise<GameResult> {
    if (!this.initialized || !this.engine) {
      return { ok: false, error: 'El motor no está inicializado.' };
    }
    try {
      if (this.pyodide) return await this._runActionPyodide(action);
      return this._runActionJS(action);
    } catch (error) {
      return { ok: false, error: errorMessage(error) };
    }
  }

  private async _runActionPyodide(action: GameAction): Promise<GameResult> {
    if (!this.pyodide) return { ok: false, error: 'El motor Python no está disponible.' };

    let methodName = '';
    let args = '';
    switch (action.type) {
      case 'mover': methodName = 'mover'; args = JSON.stringify(action.direccion); break;
      case 'tomar': methodName = 'tomar'; args = JSON.stringify(action.ingrediente); break;
      case 'cortar': methodName = 'cortar'; break;
      case 'cocinar': methodName = 'cocinar'; args = JSON.stringify(action.estufa); break;
      case 'emplatar': methodName = 'emplatar'; args = JSON.stringify(action.plato); break;
      case 'servir': methodName = 'servir'; args = JSON.stringify(action.mesa); break;
      case 'esperar': methodName = 'esperar'; args = String(action.pasos ?? 1); break;
      default: return { ok: false, error: 'Acción no reconocida.' };
    }

    const result = await this.pyodide.runPythonAsync('engine.' + methodName + '(' + args + ')');
    return this.pyodide.toJs(result) as GameResult;
  }

  private _runActionJS(action: GameAction): GameResult {
    if (!isJavaScriptEngine(this.engine)) {
      return { ok: false, error: 'El motor de respaldo no está disponible.' };
    }
    const engine = this.engine;
    if (engine.game_over) return { ok: false, error: 'El juego ya terminó.' };

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
        engine.events.push({ type: 'ingrediente_en_estufa', step: engine.step_count, data: { estufa: action.estufa, ingrediente: engine.chef_holding } });
        engine.chef_holding = null;
        return { ok: true, estufa: action.estufa };
      case 'emplatar':
        if (!engine.chef_holding) return { ok: false, error: 'No estás sosteniendo nada.' };
        engine.events.push({ type: 'ingrediente_emplatado', step: engine.step_count, data: { plato: action.plato } });
        engine.chef_holding = null;
        return { ok: true, plato: action.plato };
      case 'servir':
        engine.events.push({ type: 'plato_servido', step: engine.step_count, data: { mesa: action.mesa } });
        return { ok: true, mesa: action.mesa };
      case 'esperar':
        return { ok: true, steps: engine.step_count };
      default:
        return { ok: false, error: 'Acción no reconocida.' };
    }
  }

  getState(): GameState | null {
    if (!this.initialized || !this.engine) return null;
    if (this.pyodide && isPythonEngine(this.engine) && this.engine.get_state) {
      return this.pyodide.toJs(this.engine.get_state()) as GameState;
    }
    if (!isJavaScriptEngine(this.engine)) return null;
    const engine = this.engine;
    return {
      step: engine.step_count,
      max_steps: engine.max_steps,
      chef: { x: engine.chef_x, y: engine.chef_y, facing: engine.chef_facing, holding: engine.chef_holding },
      ingredients: engine.level.ingredients,
      stoves: engine.level.stoves,
      plates: engine.level.plates,
      orders: engine.level.orders.map((order, id) => ({ id, items: order.items, completed: false })),
      current_order_index: 0,
      game_over: engine.game_over,
      won: engine.won,
    };
  }

  getEvents(): GameEvent[] {
    if (!this.initialized || !this.engine) return [];
    if (this.pyodide && isPythonEngine(this.engine) && this.engine.get_events) {
      const events = this.pyodide.toJs(this.engine.get_events());
      return Array.isArray(events) ? events as GameEvent[] : [];
    }
    return isJavaScriptEngine(this.engine) ? this.engine.events : [];
  }

  reset(): void {
    if (!this.initialized || !this.engine) return;
    if (this.pyodide && isPythonEngine(this.engine) && this.engine.reset) {
      this.engine.reset();
      return;
    }
    if (!isJavaScriptEngine(this.engine) || !this.level) return;
    const engine = this.engine;
    engine.step_count = 0;
    engine.chef_x = this.level.chef_start_x;
    engine.chef_y = this.level.chef_start_y;
    engine.chef_facing = 'right';
    engine.game_over = false;
    engine.won = false;
    engine.events = [];
    engine.chef_holding = null;
  }
}

export const kitchenAPI = new KitchenAPI();
