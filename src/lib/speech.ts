/**
 * Browser-native text-to-speech (Web Speech API).
 *
 * Works offline, needs no account, no server and no stored audio files —
 * a perfect fit for the browser-only model. Used to read lesson text aloud
 * so younger / weaker readers can follow along.
 *
 * Pre-generated Supabase audio (when present) is still preferred for quality;
 * this is the always-available fallback.
 */

let keepAlive: number | null = null;

const clearKeepAlive = () => {
  if (keepAlive !== null) {
    window.clearInterval(keepAlive);
    keepAlive = null;
  }
};

export const isSpeechSupported = (): boolean =>
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  "SpeechSynthesisUtterance" in window;

const pickDutchVoice = (): SpeechSynthesisVoice | null => {
  if (!isSpeechSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // Prefer a Netherlands Dutch voice, then any Dutch voice.
  return (
    voices.find((v) => v.lang?.toLowerCase() === "nl-nl") ??
    voices.find((v) => v.lang?.toLowerCase().startsWith("nl")) ??
    null
  );
};

// Voices load asynchronously in some browsers; resolve once they're ready.
const ensureVoices = (): Promise<void> =>
  new Promise((resolve) => {
    if (!isSpeechSupported()) return resolve();
    if (window.speechSynthesis.getVoices().length) return resolve();
    const handler = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve();
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    window.setTimeout(() => resolve(), 1000); // safety net
  });

export const hasVoices = (): boolean =>
  isSpeechSupported() && window.speechSynthesis.getVoices().length > 0;

/** Subscribe to voice-list changes; returns an unsubscribe fn. */
export const onVoicesChanged = (cb: () => void): (() => void) => {
  if (!isSpeechSupported()) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", cb);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", cb);
};

export const cancelSpeech = () => {
  if (!isSpeechSupported()) return;
  clearKeepAlive();
  window.speechSynthesis.cancel();
};

export const isSpeaking = (): boolean =>
  isSpeechSupported() && window.speechSynthesis.speaking;

export interface SpeakHandlers {
  onend?: () => void;
  onerror?: () => void;
}

/**
 * Speak a piece of text in Dutch. Cancels anything currently playing.
 * Returns true if speech was started.
 */
export const speak = async (text: string, handlers?: SpeakHandlers): Promise<boolean> => {
  if (!isSpeechSupported() || !text.trim()) return false;
  await ensureVoices();

  window.speechSynthesis.cancel();
  clearKeepAlive();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "nl-NL";
  const voice = pickDutchVoice();
  if (voice) u.voice = voice;
  u.rate = 0.95; // a touch slower, easier for kids to follow
  u.pitch = 1.05;

  let settled = false;
  const finish = (cb?: () => void) => {
    if (settled) return;
    settled = true;
    clearKeepAlive();
    cb?.();
  };
  u.onend = () => finish(handlers?.onend);
  u.onerror = () => finish(handlers?.onerror);

  window.speechSynthesis.speak(u);

  // Watchdog: if speech never actually starts (e.g. no voices installed on
  // this device), don't leave the UI stuck in a "playing" state.
  window.setTimeout(() => {
    if (!settled && !window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
      finish(handlers?.onerror);
    }
  }, 500);

  // Chrome cuts off long utterances (~15s) unless nudged periodically.
  keepAlive = window.setInterval(() => {
    if (!window.speechSynthesis.speaking) {
      clearKeepAlive();
      return;
    }
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
  }, 10000);

  return true;
};
