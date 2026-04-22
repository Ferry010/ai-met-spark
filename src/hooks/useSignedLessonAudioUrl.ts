import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSignedLessonAudioUrl = (storagePath?: string | null, cacheBuster?: string) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadSignedUrl = async () => {
      if (!storagePath) {
        if (active) setUrl(null);
        return;
      }

      const { data, error } = await supabase.storage
        .from("lesson-audio")
        .createSignedUrl(storagePath, 60 * 60);

      if (!active) return;

      if (error || !data?.signedUrl) {
        setUrl(null);
        return;
      }

      const signedUrl = cacheBuster
        ? `${data.signedUrl}${data.signedUrl.includes("?") ? "&" : "?"}v=${encodeURIComponent(cacheBuster)}`
        : data.signedUrl;

      setUrl(signedUrl);
    };

    void loadSignedUrl();

    return () => {
      active = false;
    };
  }, [storagePath, cacheBuster]);

  return url;
};
