-- Storage bucket for lesson audio (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('lesson-audio', 'lesson-audio', true)
ON CONFLICT (id) DO NOTHING;

-- lesson_audio table
CREATE TABLE IF NOT EXISTS public.lesson_audio (
  lesson_id text NOT NULL,
  step text NOT NULL,
  storage_path text NOT NULL,
  text_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (lesson_id, step)
);

ALTER TABLE public.lesson_audio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read lesson_audio"
  ON public.lesson_audio FOR SELECT
  USING (true);

CREATE POLICY "Admins manage lesson_audio"
  ON public.lesson_audio FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for lesson-audio bucket
CREATE POLICY "Public read lesson-audio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'lesson-audio');

CREATE POLICY "Admins upload lesson-audio"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'lesson-audio' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update lesson-audio"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'lesson-audio' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete lesson-audio"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'lesson-audio' AND public.has_role(auth.uid(), 'admin'::app_role));