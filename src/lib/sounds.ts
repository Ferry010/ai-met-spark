/**
 * Lightweight WebAudio-based sound effects. No assets, no network.
 * Browsers require a user gesture before audio can play; we lazily create
 * the AudioContext and silently no-op if it's still suspended.
 */

let ctx: AudioContext | null = null;
let unlocked = false;

const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    return ctx;
  } catch {
    return null;
  }
};

/** Call from any user-gesture handler (click/tap/keydown) to enable audio. */
export const unlockAudio = () => {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume().catch(() => {});
  unlocked = true;
};

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

interface PopOptions {
  /** Starting frequency in Hz */
  freq?: number;
  /** End frequency for a quick pitch sweep */
  endFreq?: number;
  /** Duration in seconds */
  duration?: number;
  /** Peak gain (0-1) */
  volume?: number;
  /** Oscillator type */
  type?: OscillatorType;
}

/** Play a short synthesized "pop" tone. Silent until unlockAudio() is called. */
export const playPop = (opts: PopOptions = {}) => {
  if (!unlocked) return;
  if (reduceMotion()) return;
  const c = getCtx();
  if (!c || c.state !== "running") return;

  const {
    freq = 520,
    endFreq = 280,
    duration = 0.18,
    volume = 0.18,
    type = "sine",
  } = opts;

  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + duration);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain).connect(c.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
};

/** Whoosh + thump for Spark's jet entry. */
export const playSparkEntry = () => {
  if (!unlocked) return;
  if (reduceMotion()) return;
  const c = getCtx();
  if (!c || c.state !== "running") return;

  const now = c.currentTime;

  // Whoosh (filtered noise)
  const bufferSize = Math.floor(c.sampleRate * 0.45);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const noise = c.createBufferSource();
  noise.buffer = buffer;

  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(900, now);
  filter.frequency.exponentialRampToValueAtTime(2400, now + 0.35);
  filter.Q.value = 0.9;

  const noiseGain = c.createGain();
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.08);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

  noise.connect(filter).connect(noiseGain).connect(c.destination);
  noise.start(now);
  noise.stop(now + 0.45);

  // Landing thump (pitched pop just after the brake)
  setTimeout(() => playPop({ freq: 220, endFreq: 90, duration: 0.22, volume: 0.22, type: "triangle" }), 380);
};

/** Soft pop for the speech bubble appearing. */
export const playBubblePop = () => {
  playPop({ freq: 720, endFreq: 380, duration: 0.14, volume: 0.14, type: "sine" });
};

/** Cheerful two-note ding for a correct quiz answer. */
export const playCorrect = () => {
  playPop({ freq: 660, endFreq: 880, duration: 0.12, volume: 0.16, type: "triangle" });
  setTimeout(() => playPop({ freq: 990, endFreq: 1320, duration: 0.18, volume: 0.16, type: "triangle" }), 110);
};

/** Soft descending tone for a wrong answer. */
export const playWrong = () => {
  playPop({ freq: 320, endFreq: 180, duration: 0.22, volume: 0.14, type: "sine" });
};

/** Rising arpeggio for level up. */
export const playLevelUp = () => {
  if (!unlocked) return;
  if (reduceMotion()) return;
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) =>
    setTimeout(() => playPop({ freq: f, endFreq: f * 1.05, duration: 0.18, volume: 0.18, type: "triangle" }), i * 90),
  );
};

/** Combo step — short rising blip. */
export const playCombo = (step: number) => {
  const base = 440 + Math.min(step, 6) * 60;
  playPop({ freq: base, endFreq: base * 1.4, duration: 0.1, volume: 0.14, type: "square" });
};
