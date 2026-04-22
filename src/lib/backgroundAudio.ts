export const BACKGROUND_AUDIO_ENABLED_KEY = "aisk_background_audio_enabled";
export const BACKGROUND_AUDIO_VOLUME_KEY = "aisk_background_audio_volume";
export const BACKGROUND_AUDIO_SETTINGS_EVENT = "aisk:background-audio-settings";

export const DEFAULT_BACKGROUND_AUDIO_ENABLED = true;
export const DEFAULT_BACKGROUND_AUDIO_VOLUME = 0.24;

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

export const getBackgroundAudioEnabled = () => {
  const stored = localStorage.getItem(BACKGROUND_AUDIO_ENABLED_KEY);
  if (stored === null) return DEFAULT_BACKGROUND_AUDIO_ENABLED;
  return stored === "true";
};

export const getBackgroundAudioVolume = () => {
  const stored = localStorage.getItem(BACKGROUND_AUDIO_VOLUME_KEY);
  const parsed = stored ? Number(stored) : DEFAULT_BACKGROUND_AUDIO_VOLUME;
  return Number.isFinite(parsed) ? clampVolume(parsed) : DEFAULT_BACKGROUND_AUDIO_VOLUME;
};

export const setBackgroundAudioEnabled = (enabled: boolean) => {
  localStorage.setItem(BACKGROUND_AUDIO_ENABLED_KEY, String(enabled));
  window.dispatchEvent(new Event(BACKGROUND_AUDIO_SETTINGS_EVENT));
};

export const setBackgroundAudioVolume = (volume: number) => {
  localStorage.setItem(BACKGROUND_AUDIO_VOLUME_KEY, String(clampVolume(volume)));
  window.dispatchEvent(new Event(BACKGROUND_AUDIO_SETTINGS_EVENT));
};