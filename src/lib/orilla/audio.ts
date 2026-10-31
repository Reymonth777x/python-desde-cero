export type SonidoOrilla = 'motor' | 'victoria' | 'error';

let contexto: AudioContext | null = null;
let ambiente: { fuente: AudioBufferSourceNode; filtroBajo: BiquadFilterNode; filtroAlto: BiquadFilterNode; volumen: GainNode; oleaje: OscillatorNode; modulacion: GainNode } | null = null;

function obtenerContexto(): AudioContext | null {
  if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') return null;
  contexto ??= new window.AudioContext();
  return contexto;
}

function tono(
  audio: AudioContext,
  frecuencia: number,
  inicio: number,
  duracion: number,
  volumen: number,
  forma: OscillatorType = 'sine',
  frecuenciaFinal = frecuencia,
) {
  const oscilador = audio.createOscillator();
  const ganancia = audio.createGain();
  oscilador.type = forma;
  oscilador.frequency.setValueAtTime(frecuencia, inicio);
  oscilador.frequency.exponentialRampToValueAtTime(Math.max(1, frecuenciaFinal), inicio + duracion);
  ganancia.gain.setValueAtTime(0.0001, inicio);
  ganancia.gain.exponentialRampToValueAtTime(Math.max(0.0002, volumen), inicio + Math.min(0.025, duracion / 4));
  ganancia.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion);
  oscilador.connect(ganancia);
  ganancia.connect(audio.destination);
  oscilador.start(inicio);
  oscilador.stop(inicio + duracion + 0.015);
}

/**
 * Ambiente suave de agua en movimiento, generado localmente con Web Audio.
 * Solo empieza tras una acción explícita del jugador; no descarga ni reproduce audio externo.
 */
export async function activarAmbienteOrilla(): Promise<boolean> {
  const audio = obtenerContexto();
  if (!audio) return false;
  try {
    await audio.resume();
    if (ambiente) return true;

    const longitud = Math.max(1, Math.floor(audio.sampleRate * 4));
    const buffer = audio.createBuffer(1, longitud, audio.sampleRate);
    const datos = buffer.getChannelData(0);
    let marron = 0;
    for (let i = 0; i < longitud; i += 1) {
      const blanco = Math.random() * 2 - 1;
      marron = (marron + 0.035 * blanco) / 1.035;
      datos[i] = marron * 5.5;
    }

    const fuente = audio.createBufferSource();
    const filtroAlto = audio.createBiquadFilter();
    const filtroBajo = audio.createBiquadFilter();
    const volumen = audio.createGain();
    const oleaje = audio.createOscillator();
    const modulacion = audio.createGain();

    fuente.buffer = buffer;
    fuente.loop = true;
    filtroAlto.type = 'highpass';
    filtroAlto.frequency.value = 150;
    filtroBajo.type = 'lowpass';
    filtroBajo.frequency.value = 1050;
    filtroBajo.Q.value = 0.45;
    volumen.gain.setValueAtTime(0.0001, audio.currentTime);
    volumen.gain.linearRampToValueAtTime(0.12, audio.currentTime + 1.2);
    oleaje.type = 'sine';
    oleaje.frequency.value = 0.09;
    modulacion.gain.value = 0.035;

    fuente.connect(filtroAlto);
    filtroAlto.connect(filtroBajo);
    filtroBajo.connect(volumen);
    volumen.connect(audio.destination);
    oleaje.connect(modulacion);
    modulacion.connect(volumen.gain);

    fuente.start();
    oleaje.start();
    ambiente = { fuente, filtroBajo, filtroAlto, volumen, oleaje, modulacion };
    return true;
  } catch {
    return false;
  }
}

/** Detiene el río con una transición corta para evitar un corte brusco. */
export function desactivarAmbienteOrilla(): void {
  const actual = ambiente;
  const audio = contexto;
  if (!actual || !audio) return;
  ambiente = null;
  const ahora = audio.currentTime;
  actual.volumen.gain.cancelScheduledValues(ahora);
  actual.volumen.gain.setTargetAtTime(0.0001, ahora, 0.12);
  window.setTimeout(() => {
    try { actual.fuente.stop(); } catch { /* ya detenido */ }
    try { actual.oleaje.stop(); } catch { /* ya detenido */ }
    actual.fuente.disconnect();
    actual.filtroAlto.disconnect();
    actual.filtroBajo.disconnect();
    actual.volumen.disconnect();
    actual.oleaje.disconnect();
    actual.modulacion.disconnect();
  }, 500);
}

/** Efectos cortos sintetizados con Web Audio; respetan el control de sonido del jugador. */
export function reproducirSonidoOrilla(sonido: SonidoOrilla): void {
  const audio = obtenerContexto();
  if (!audio) return;
  void audio.resume().catch(() => undefined);
  const ahora = audio.currentTime + 0.015;

  if (sonido === 'motor') {
    tono(audio, 92, ahora, 0.34, 0.035, 'sawtooth', 58);
    tono(audio, 46, ahora + 0.03, 0.38, 0.022, 'triangle', 70);
    return;
  }

  if (sonido === 'victoria') {
    tono(audio, 523.25, ahora, 0.24, 0.055);
    tono(audio, 659.25, ahora + 0.13, 0.26, 0.05);
    tono(audio, 783.99, ahora + 0.27, 0.34, 0.055);
    tono(audio, 1046.5, ahora + 0.43, 0.48, 0.045);
    return;
  }

  tono(audio, 230, ahora, 0.2, 0.04, 'triangle', 165);
  tono(audio, 155, ahora + 0.14, 0.3, 0.032, 'sine', 110);
}
