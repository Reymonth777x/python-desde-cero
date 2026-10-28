export type GameAction =
  | { type: 'mover'; direccion: 'arriba' | 'abajo' | 'izquierda' | 'derecha' }
  | { type: 'tomar'; ingrediente: string }
  | { type: 'cortar' }
  | { type: 'cocinar'; estufa: string }
  | { type: 'emplatar'; plato: string }
  | { type: 'servir'; mesa: string }
  | { type: 'esperar'; pasos?: number };

export type GameResult = { ok: boolean; error?: string; [key: string]: any };

export type GameState = {
  step: number;
  max_steps: number;
  chef: { x: number; y: number; facing: string; holding: string | null };
  ingredients: Record<string, any>;
  stoves: Record<string, any>;
  plates: Record<string, any>;
  orders: Array<{ id: number; items: string[]; completed: boolean }>;
  current_order_index: number;
  game_over: boolean;
  won: boolean;
};

export type GameEvent = { type: string; step: number; data: Record<string, any> };

export type KitchenLevel = {
  id: string;
  title: string;
  concept: string;
  max_steps: number;
  chef_start_x: number;
  chef_start_y: number;
  ingredients: Record<string, any>;
  stoves: Record<string, any>;
  plates: Record<string, any>;
  orders: Array<{ items: string[] }>;
  hint: string;
};

export class KitchenAPI {
  private engine: any = null;
  private level: KitchenLevel | null = null;
  private initialized = false;
  async init(level: KitchenLevel): Promise<void> {
    this.level = level;
    this.initialized = true;
    try {
      const pyodide = (window as any).pyodide;
      if (pyodide && pyodide.runPythonAsync) {
        await this._initWithPyodide(level);
      } else {
        this._initJSFallback(level);
      }
    } catch (err) {
      console.error('Error inicializando motor de cocina:', err);
      this._initJSFallback(level);
    }
  }

  private async _initWithPyodide(level: KitchenLevel): Promise<void> {
    const pyodide = (window as any).pyodide;
    const engineCode = await fetch('/game-engine.py').then((r) => r.text());
    await pyodide.runPythonAsync(engineCode);
    const levelJson = JSON.stringify(level);
    await pyodide.runPythonAsync(`
from game_engine import KitchenEngine
import json
level_data = json.loads('''${levelJson.replace(/'/g, "\\'")}''')
engine = KitchenEngine(level_data)
    `);
    this.engine = pyodide.globals.get('engine');
  }

  private _initJSFallback(level: KitchenLevel): void {
    this.engine = {
      step_count: 0,
      max_steps: level.max_steps,
      chef_x: level.chef_start_x,
      chef_y: level.chef_start_y,
      chef_holding: null,
      game_over: false,
      won: false,
      events: [],
      level,
    };
  }

  async runAction(action: GameAction): Promise<GameResult> {
    if (!this.initialized) {
      return { ok: false, error: 'El motor no estÃ¡ inicializado.' };
    }
    try {
      if (this.engine.runPythonAsync) {
        return this._runActionPyodide(action);
      } else {
        return this._runActionJS(action);
      }
    } catch (err: any) {
      return { ok: false, error: err.message || String(err) };
    }
  }

  private async _runActionPyodide(action: GameAction): Promise<GameResult> {
    const pyodide = (window as any).pyodide;
    let methodName: string;
    let args: string = '';
    switch (action.type) {
      case 'mover':
        methodName = 'mover';
        args = `"${action.direccion}"`;
        break;
      case 'tomar':
        methodName = 'tomar';
        args = `"${action.ingrediente}"`;
        break;
      case 'cortar':
        methodName = 'cortar';
        args = '';
        break;
      case 'cocinar':
        methodName = 'cocinar';
        args = `"${action.estufa}"`;
        break;
      case 'emplatar':
        methodName = 'emplatar';
        args = `"${action.plato}"`;
        break;
      case 'servir':
        methodName = 'servir';
        args = `"${action.mesa}"`;
        break;
      case 'esperar':
        methodName = 'esperar';
        args = String(action.pasos ?? 1);
        break;
      default:
        return { ok: false, error: 'AcciÃ³n no reconocida.' };
    }
    const result = await pyodide.runPythonAsync(`engine.${methodName}(${args})`);
    return pyodide.toJs(result) as GameResult;
  }
  private _runActionJS(action: GameAction): GameResult {
    const engine = this.engine as any;
    if (engine.game_over) {
      return { ok: false, error: 'El juego ya terminÃ³.' };
    }
    engine.step_count += 1;
    if (engine.step_count > engine.max_steps) {
      engine.game_over = true;
      return { ok: false, error: 'LÃ­mite de pasos alcanzado.' };
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
        if (engine.chef_holding) return { ok: false, error: 'Ya estÃ¡s sosteniendo algo.' };
        engine.chef_holding = action.ingrediente;
        return { ok: true, ingrediente: action.ingrediente, holding: engine.chef_holding };
      case 'cortar':
        if (!engine.chef_holding) return { ok: false, error: 'No estÃ¡s sosteniendo nada.' };
        return { ok: true, ingrediente: engine.chef_holding, chopped: true };
      case 'cocinar':
        if (!engine.chef_holding) return { ok: false, error: 'No estÃ¡s sosteniendo nada.' };
        engine.events.push({ type: 'ingrediente_en_estufa', estufa: action.estufa, ingrediente: engine.chef_holding });
        engine.chef_holding = null;
        return { ok: true, estufa: action.estufa };
      case 'emplatar':
        if (!engine.chef_holding) return { ok: false, error: 'No estÃ¡s sosteniendo nada.' };
        engine.events.push({ type: 'ingrediente_emplatado', plato: action.plato });
        engine.chef_holding = null;
        return { ok: true, plato: action.plato };
      case 'servir':
        engine.events.push({ type: 'plato_servido', mesa: action.mesa });
        return { ok: true, mesa: action.mesa };
      case 'esperar':
        return { ok: true, steps: engine.step_count };
      default:
        return { ok: false, error: 'AcciÃ³n no reconocida.' };
    }
  }

  getState(): GameState | null {
    if (!this.initialized) return null;
    if (this.engine.get_state) {
      const pyodide = (window as any).pyodide;
      const state = pyodide.toJs(this.engine.get_state());
      return state as GameState;
    }
    const engine = this.engine as any;
    return {
      step: engine.step_count,
      max_steps: engine.max_steps,
      chef: { x: engine.chef_x, y: engine.chef_y, facing: engine.chef_facing, holding: engine.chef_holding },
      ingredients: {}, stoves: {}, plates: {}, orders: [], current_order_index: 0,
      game_over: engine.game_over, won: engine.won,
    };
  }

  getEvents(): GameEvent[] {
    if (!this.initialized) return [];
    if (this.engine.get_events) {
      const pyodide = (window as any).pyodide;
      return pyodide.toJs(this.engine.get_events()) as GameEvent[];
    }
    return (this.engine as any).events || [];
  }

  reset(): void {
    if (this.engine.reset) {
      this.engine.reset();
    } else {
      const engine = this.engine as any;
      engine.step_count = 0;
      engine.game_over = false;
      engine.won = false;
      engine.events = [];
      engine.chef_holding = null;
    }
  }
}

export const kitchenAPI = new KitchenAPI();
