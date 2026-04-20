
-- Lesson overrides table: admins edit, everyone reads
CREATE TABLE public.lesson_overrides (
  lesson_id TEXT PRIMARY KEY,
  title TEXT,
  fact TEXT,
  emoji TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);

ALTER TABLE public.lesson_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read overrides"
  ON public.lesson_overrides
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins manage overrides"
  ON public.lesson_overrides
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_lesson_overrides_updated_at
  BEFORE UPDATE ON public.lesson_overrides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Promote ferry.hoes@gmail.com to admin (if the account exists)
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
WHERE u.email = 'ferry.hoes@gmail.com'
ON CONFLICT DO NOTHING;
