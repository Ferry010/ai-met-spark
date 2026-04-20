ALTER TABLE public.lesson_overrides
  ADD COLUMN IF NOT EXISTS theory_intro text,
  ADD COLUMN IF NOT EXISTS theory_deep text,
  ADD COLUMN IF NOT EXISTS summary text[];