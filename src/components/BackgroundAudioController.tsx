import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import orbitClassroomAudio from "@/assets/Orbit_Classroom.mp3";
import {
  BACKGROUND_AUDIO_SETTINGS_EVENT,
  getBackgroundAudioEnabled,
  getBackgroundAudioVolume,
} from "@/lib/backgroundAudio";

const PLAYABLE_PATHS = ["/dashboard", "/world/", "/account"];
const LEARNING_PATHS = ["/lesson/", "/final-test", "/certificate"];

const matchesPath = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix));

export const BackgroundAudioController = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resumeOnInteractionRef = useRef(false);
  const [settings, setSettings] = useState({
    enabled: getBackgroundAudioEnabled(),
    volume: getBackgroundAudioVolume(),
  });

  const shouldPlay = useMemo(() => {
    if (!user) return false;
    if (matchesPath(location.pathname, LEARNING_PATHS)) return false;
    return matchesPath(location.pathname, PLAYABLE_PATHS);
  }, [location.pathname, user]);

  useEffect(() => {
    const audio = new Audio(orbitClassroomAudio);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = settings.volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const syncSettings = () => {
      setSettings({
        enabled: getBackgroundAudioEnabled(),
        volume: getBackgroundAudioVolume(),
      });
    };

    window.addEventListener(BACKGROUND_AUDIO_SETTINGS_EVENT, syncSettings);

    return () => {
      window.removeEventListener(BACKGROUND_AUDIO_SETTINGS_EVENT, syncSettings);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = settings.volume;
    if (!settings.enabled) {
      resumeOnInteractionRef.current = false;
      audioRef.current.pause();
    }
  }, [settings]);

  useEffect(() => {
    if (loading) return;

    const audio = audioRef.current;
    if (!audio) return;

    const attemptPlay = async () => {
      try {
        await audio.play();
        resumeOnInteractionRef.current = false;
      } catch {
        resumeOnInteractionRef.current = true;
      }
    };

    if (shouldPlay && settings.enabled) {
      void attemptPlay();
      return;
    }

    resumeOnInteractionRef.current = false;
    audio.pause();
  }, [loading, settings.enabled, shouldPlay]);

  useEffect(() => {
    if (!shouldPlay || !settings.enabled) return;

    const resumeOnFirstInteraction = () => {
      if (!resumeOnInteractionRef.current) return;

      const audio = audioRef.current;
      if (!audio) return;

      audio.play().then(() => {
        resumeOnInteractionRef.current = false;
      }).catch(() => {
        // keep listener active until the browser allows playback
      });
    };

    window.addEventListener("pointerdown", resumeOnFirstInteraction);
    window.addEventListener("keydown", resumeOnFirstInteraction);

    return () => {
      window.removeEventListener("pointerdown", resumeOnFirstInteraction);
      window.removeEventListener("keydown", resumeOnFirstInteraction);
    };
  }, [settings.enabled, shouldPlay]);

  return null;
};

export default BackgroundAudioController;