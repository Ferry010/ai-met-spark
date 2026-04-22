import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import orbitClassroomAudio from "@/assets/Orbit_Classroom.mp3";

const PLAYABLE_PATHS = ["/dashboard", "/world/", "/account"];
const LEARNING_PATHS = ["/lesson/", "/final-test", "/certificate"];
const DEFAULT_VOLUME = 0.24;

const matchesPath = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix));

export const BackgroundAudioController = () => {
  const location = useLocation();
  const { user, roles, loading } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resumeOnInteractionRef = useRef(false);

  const isStudentOnlySession = useMemo(
    () => !!user && !roles.includes("teacher") && !roles.includes("admin"),
    [roles, user],
  );

  const shouldPlay = useMemo(() => {
    if (!isStudentOnlySession) return false;
    if (matchesPath(location.pathname, LEARNING_PATHS)) return false;
    return matchesPath(location.pathname, PLAYABLE_PATHS);
  }, [isStudentOnlySession, location.pathname]);

  useEffect(() => {
    const audio = new Audio(orbitClassroomAudio);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = DEFAULT_VOLUME;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

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

    if (shouldPlay) {
      void attemptPlay();
      return;
    }

    resumeOnInteractionRef.current = false;
    audio.pause();
  }, [loading, shouldPlay]);

  useEffect(() => {
    if (!shouldPlay) return;

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
  }, [shouldPlay]);

  return null;
};

export default BackgroundAudioController;