import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AudioRecord {
  storage_path: string;
}

const cache: Record<string, AudioRecord | null> = {};
const signedUrlCache: Record<string, string | null> = {};

const getCacheKey = (lessonId: string, step: string) => `${lessonId}/${step}`;

const fetchAudio = async (lessonId: string, step: string): Promise<AudioRecord | null> => {
  const key = getCacheKey(lessonId, step);
  if (key in cache) return cache[key];
  const { data } = await supabase
    .from("lesson_audio")
    .select("storage_path")
    .eq("lesson_id", lessonId)
    .eq("step", step)
    .maybeSingle();
  cache[key] = data ?? null;
  return cache[key];
};

const fetchSignedAudioUrl = async (lessonId: string, step: string, storagePath: string) => {
  const key = `${getCacheKey(lessonId, step)}:${storagePath}`;
  if (key in signedUrlCache && signedUrlCache[key]) return signedUrlCache[key];

  const { data, error } = await supabase.storage.from("lesson-audio").createSignedUrl(storagePath, 60 * 60);
  if (error || !data?.signedUrl) {
    signedUrlCache[key] = null;
    return null;
  }

  signedUrlCache[key] = data.signedUrl;
  return data.signedUrl;
};

export const invalidateSparkVoiceCache = () => {
  Object.keys(cache).forEach((k) => delete cache[k]);
  Object.keys(signedUrlCache).forEach((k) => delete signedUrlCache[k]);
};

export const useHasSparkVoice = (lessonId: string, step: string) => {
  const [available, setAvailable] = useState<boolean>(false);
  useEffect(() => {
    let alive = true;
    fetchAudio(lessonId, step).then((rec) => {
      if (alive) setAvailable(!!rec);
    });
    return () => {
      alive = false;
    };
  }, [lessonId, step]);
  return available;
};

export const useSparkVoice = (lessonId: string, step: string, options?: { autoPlay?: boolean }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const attemptedAutoPlayRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchAudio(lessonId, step).then((rec) => {
      if (alive) setAvailable(!!rec);
    });
    return () => {
      alive = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setIsPlaying(false);
      }
    };
  }, [lessonId, step]);

  const play = useCallback(async () => {
    const rec = await fetchAudio(lessonId, step);
    if (!rec) return;
    if (audioRef.current) {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }
    setIsLoading(true);
    const signedUrl = await fetchSignedAudioUrl(lessonId, step, rec.storage_path);
    if (!signedUrl) {
      setIsLoading(false);
      setIsPlaying(false);
      return;
    }
    const audio = new Audio(`${signedUrl}${signedUrl.includes("?") ? "&" : "?"}t=${Date.now()}`);
    audio.onended = () => {
      setIsPlaying(false);
      audioRef.current = null;
    };
    audio.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
      audioRef.current = null;
    };
    audioRef.current = audio;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, [lessonId, step]);

  useEffect(() => {
    if (!options?.autoPlay || !available || attemptedAutoPlayRef.current) return;
    attemptedAutoPlayRef.current = true;
    void play();
  }, [available, play, options?.autoPlay]);

  useEffect(() => {
    attemptedAutoPlayRef.current = false;
  }, [lessonId, step]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  return { play, stop, isPlaying, isLoading, available };
};
