export type SonidoOrilla = 'motor' | 'victoria' | 'error';

let contexto: AudioContext | null = null;

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

/** Efectos cortos sintetizados con Web Audio; no descargan archivos ni dependen de autoplay. */
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
