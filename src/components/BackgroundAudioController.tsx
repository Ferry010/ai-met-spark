import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { isDevAdminBypass } from "@/lib/devBypass";
import orbitClassroomAudio from "@/assets/Orbit_Classroom.mp3";
import {
  BACKGROUND_AUDIO_SETTINGS_EVENT,
  getBackgroundAudioEnabled,
  getBackgroundAudioVolume,
} from "@/lib/backgroundAudio";

const LESSON_MUSIC_URL = "/sounds/lesson-music.mp3";

const PLAYABLE_PATHS = ["/dashboard", "/world/", "/account"];
const LEARNING_PATHS = ["/lesson/", "/final-test", "/certificate"];

type Mode = "ambient" | "lesson" | "off";

const matchesPath = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix));

export const BackgroundAudioController = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const lessonRef = useRef<HTMLAudioElement | null>(null);
  const resumeOnInteractionRef = useRef(false);
  const [settings, setSettings] = useState({
    enabled: getBackgroundAudioEnabled(),
    volume: getBackgroundAudioVolume(),
  });

  const hasAccess = !!user || isDevAdminBypass();

  const mode: Mode = useMemo(() => {
    if (!hasAccess) return "off";
    if (matchesPath(location.pathname, LEARNING_PATHS)) return "lesson";
    if (matchesPath(location.pathname, PLAYABLE_PATHS)) return "ambient";
    return "off";
  }, [location.pathname, hasAccess]);

  // Create both audio elements once.
  useEffect(() => {
    const ambient = new Audio(orbitClassroomAudio);
    ambient.loop = true;
    ambient.preload = "auto";
    ambient.volume = settings.volume;
    // iOS Safari: keep inline so autoplay/resume on gesture works without fullscreen.
    (ambient as any).playsInline = true;
    ambient.setAttribute("playsinline", "");
    ambientRef.current = ambient;

    const lesson = new Audio(LESSON_MUSIC_URL);
    lesson.loop = true;
    lesson.preload = "auto";
    // Lesson music sits a touch louder than ambient since it's the focus track.
    lesson.volume = Math.min(1, settings.volume * 1.4);
    (lesson as any).playsInline = true;
    lesson.setAttribute("playsinline", "");
    lessonRef.current = lesson;

    return () => {
      ambient.pause();
      ambient.currentTime = 0;
      ambientRef.current = null;
      lesson.pause();
      lesson.currentTime = 0;
      lessonRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync settings from elsewhere in the app.
  useEffect(() => {
    const syncSettings = () => {
      setSettings({
        enabled: getBackgroundAudioEnabled(),
        volume: getBackgroundAudioVolume(),
      });
    };
    window.addEventListener(BACKGROUND_AUDIO_SETTINGS_EVENT, syncSettings);
    return () => window.removeEventListener(BACKGROUND_AUDIO_SETTINGS_EVENT, syncSettings);
  }, []);

  // Keep volumes in sync with the user setting.
  useEffect(() => {
    if (ambientRef.current) ambientRef.current.volume = settings.volume;
    if (lessonRef.current) lessonRef.current.volume = Math.min(1, settings.volume * 1.4);
    if (!settings.enabled) {
      resumeOnInteractionRef.current = false;
      ambientRef.current?.pause();
      lessonRef.current?.pause();
    }
  }, [settings]);

  // Drive playback based on mode.
  useEffect(() => {
    if (loading) return;
    const ambient = ambientRef.current;
    const lesson = lessonRef.current;
    if (!ambient || !lesson) return;

    const playTarget = (target: HTMLAudioElement) => {
      target.play().then(() => {
        resumeOnInteractionRef.current = false;
      }).catch(() => {
        resumeOnInteractionRef.current = true;
      });
    };

    if (!settings.enabled || mode === "off") {
      resumeOnInteractionRef.current = false;
      ambient.pause();
      lesson.pause();
      return;
    }

    if (mode === "lesson") {
      ambient.pause();
      playTarget(lesson);
    } else {
      lesson.pause();
      playTarget(ambient);
    }
  }, [loading, settings.enabled, mode]);

  // Resume on first user interaction if autoplay was blocked.
  useEffect(() => {
    if (!settings.enabled || mode === "off") return;

    const resumeOnFirstInteraction = () => {
      if (!resumeOnInteractionRef.current) return;
      const target = mode === "lesson" ? lessonRef.current : ambientRef.current;
      if (!target) return;
      target.play().then(() => {
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
  }, [settings.enabled, mode]);

  return null;
};

export default BackgroundAudioController;
