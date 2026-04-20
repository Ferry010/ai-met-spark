ALTER TABLE public.lesson_overrides
  ADD COLUMN IF NOT EXISTS interactive jsonb,
  ADD COLUMN IF NOT EXISTS quiz jsonb;