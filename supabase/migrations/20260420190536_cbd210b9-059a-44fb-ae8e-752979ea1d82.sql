ALTER TABLE public.lesson_overrides ADD COLUMN IF NOT EXISTS spark_intro text;
ALTER TABLE public.lesson_overrides ADD COLUMN IF NOT EXISTS spark_middle text;
ALTER TABLE public.lesson_overrides ADD COLUMN IF NOT EXISTS reflection text;