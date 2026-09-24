-- AI met Spark — full database setup for a FRESH Supabase project.
-- (Existing project? Run only the newest migration instead.)

-- >>> 20260419183509_ea51745b-4fcb-48c3-8e55-a66a1400c2d5.sql

-- ===== ENUMS =====
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE public.app_language AS ENUM ('en', 'nl', 'es');

-- ===== TIMESTAMP HELPER =====
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ===== PROFILES =====
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  age INTEGER CHECK (age BETWEEN 5 AND 18),
  parent_email TEXT,
  language public.app_language NOT NULL DEFAULT 'en',
  paid BOOLEAN NOT NULL DEFAULT false,
  school_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== USER ROLES (SEPARATE TABLE — no privilege escalation) =====
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- ===== SCHOOLS =====
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seat_count INTEGER NOT NULL DEFAULT 0,
  contact_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER schools_updated_at BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_school_fk FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE SET NULL;

-- ===== CLASS CODES =====
CREATE TABLE public.class_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.class_codes ENABLE ROW LEVEL SECURITY;

-- ===== USER PROGRESS =====
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL, -- e.g. "1.1"
  stars INTEGER NOT NULL DEFAULT 1 CHECK (stars BETWEEN 0 AND 3),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_user_progress_user ON public.user_progress(user_id);

-- ===== FINAL TEST ATTEMPTS =====
CREATE TABLE public.final_test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 10),
  passed BOOLEAN NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.final_test_attempts ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_test_attempts_user ON public.final_test_attempts(user_id, attempted_at DESC);

-- ===== CERTIFICATES =====
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pdf_url TEXT,
  score INTEGER,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- ===== SCHOOL INQUIRIES =====
CREATE TABLE public.school_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  school TEXT NOT NULL,
  country TEXT NOT NULL,
  seats INTEGER NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.school_inquiries ENABLE ROW LEVEL SECURITY;

-- ===== PAYMENTS (for Stripe webhook tracking) =====
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'eur',
  status TEXT NOT NULL,
  env TEXT NOT NULL DEFAULT 'sandbox',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ===== STORAGE: certificates bucket =====
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- ===== AUTO-CREATE PROFILE ON SIGNUP =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_class_code TEXT;
  v_school_id UUID;
  v_role public.app_role := 'student';
BEGIN
  v_class_code := NEW.raw_user_meta_data->>'class_code';

  IF v_class_code IS NOT NULL AND length(v_class_code) > 0 THEN
    SELECT school_id INTO v_school_id
    FROM public.class_codes
    WHERE code = upper(v_class_code)
      AND (expires_at IS NULL OR expires_at > now())
    LIMIT 1;
  END IF;

  -- Teacher signup hint (used by /teacher signup)
  IF (NEW.raw_user_meta_data->>'is_teacher')::boolean IS TRUE THEN
    v_role := 'teacher';
  END IF;

  INSERT INTO public.profiles (id, first_name, age, parent_email, language, paid, school_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    NULLIF(NEW.raw_user_meta_data->>'age', '')::INTEGER,
    NEW.raw_user_meta_data->>'parent_email',
    COALESCE((NEW.raw_user_meta_data->>'language')::public.app_language, 'en'),
    -- School students are auto-paid via the school's seat purchase
    v_school_id IS NOT NULL,
    v_school_id
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, v_role);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== HELPER: is_student_in_my_school =====
CREATE OR REPLACE FUNCTION public.is_student_in_my_school(_student_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN public.schools s ON s.id = p.school_id
    WHERE p.id = _student_id
      AND s.teacher_id = auth.uid()
  );
$$;

-- ===== RLS POLICIES =====

-- profiles
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Teachers view their students" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'teacher') AND public.is_student_in_my_school(id));
CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- user_roles (READ ONLY to user; only admins can mutate)
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- schools
CREATE POLICY "Teachers view own school" ON public.schools
  FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "Teachers update own school" ON public.schools
  FOR UPDATE USING (teacher_id = auth.uid());
CREATE POLICY "Teachers create their school" ON public.schools
  FOR INSERT WITH CHECK (teacher_id = auth.uid() AND public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Students view their school" ON public.schools
  FOR SELECT USING (id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));

-- class_codes
CREATE POLICY "Teacher manages own class codes" ON public.class_codes
  FOR ALL
  USING (school_id IN (SELECT id FROM public.schools WHERE teacher_id = auth.uid()))
  WITH CHECK (school_id IN (SELECT id FROM public.schools WHERE teacher_id = auth.uid()));
-- Note: code lookup at signup happens inside SECURITY DEFINER trigger, no public read needed.

-- user_progress
CREATE POLICY "Users manage own progress" ON public.user_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Teachers view student progress" ON public.user_progress
  FOR SELECT USING (public.has_role(auth.uid(), 'teacher') AND public.is_student_in_my_school(user_id));

-- final_test_attempts
CREATE POLICY "Users manage own attempts" ON public.final_test_attempts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Teachers view student attempts" ON public.final_test_attempts
  FOR SELECT USING (public.has_role(auth.uid(), 'teacher') AND public.is_student_in_my_school(user_id));

-- certificates
CREATE POLICY "Users manage own certificate" ON public.certificates
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Teachers view student certificates" ON public.certificates
  FOR SELECT USING (public.has_role(auth.uid(), 'teacher') AND public.is_student_in_my_school(user_id));

-- school_inquiries — public can submit, only admins can read
CREATE POLICY "Anyone can submit inquiry" ON public.school_inquiries
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read inquiries" ON public.school_inquiries
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- payments — users see own payments only; webhook (service role) bypasses RLS
CREATE POLICY "Users read own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

-- ===== STORAGE POLICIES (certificates bucket — public read, owner write via edge functions) =====
CREATE POLICY "Certificates publicly readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'certificates');
CREATE POLICY "Owners upload certificates" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owners update certificates" ON storage.objects
  FOR UPDATE USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);


-- >>> 20260419183617_3c2ed540-f83d-473d-bdaf-364f2122d868.sql

-- 1) Replace permissive school_inquiries INSERT policy with a validating one
DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.school_inquiries;

CREATE OR REPLACE FUNCTION public.validate_school_inquiry(
  _name TEXT, _school TEXT, _country TEXT, _seats INTEGER, _email TEXT, _message TEXT
) RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    _name IS NOT NULL AND length(trim(_name)) BETWEEN 1 AND 100
    AND _school IS NOT NULL AND length(trim(_school)) BETWEEN 1 AND 150
    AND _country IS NOT NULL AND length(trim(_country)) BETWEEN 1 AND 80
    AND _seats IS NOT NULL AND _seats BETWEEN 1 AND 100000
    AND _email IS NOT NULL AND length(_email) BETWEEN 5 AND 255 AND _email LIKE '%@%.%'
    AND (_message IS NULL OR length(_message) <= 1000);
$$;

CREATE POLICY "Validated inquiry submissions" ON public.school_inquiries
  FOR INSERT
  WITH CHECK (
    public.validate_school_inquiry(name, school, country, seats, email, message)
  );

-- 2) Restrict certificates bucket: users can only read their own folder
DROP POLICY IF EXISTS "Certificates publicly readable" ON storage.objects;

CREATE POLICY "Owners read own certificates" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'certificates'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Teachers read student certificates" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'certificates'
    AND public.has_role(auth.uid(), 'teacher')
    AND public.is_student_in_my_school(((storage.foldername(name))[1])::uuid)
  );

-- Make the bucket private since access is now policy-controlled
UPDATE storage.buckets SET public = false WHERE id = 'certificates';


-- >>> 20260419183650_19a53bef-128b-43bc-8d39-f9e08aea400f.sql

CREATE OR REPLACE FUNCTION public.validate_school_inquiry(
  _name TEXT, _school TEXT, _country TEXT, _seats INTEGER, _email TEXT, _message TEXT
) RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT
    _name IS NOT NULL AND length(trim(_name)) BETWEEN 1 AND 100
    AND _school IS NOT NULL AND length(trim(_school)) BETWEEN 1 AND 150
    AND _country IS NOT NULL AND length(trim(_country)) BETWEEN 1 AND 80
    AND _seats IS NOT NULL AND _seats BETWEEN 1 AND 100000
    AND _email IS NOT NULL AND length(_email) BETWEEN 5 AND 255 AND _email LIKE '%@%.%'
    AND (_message IS NULL OR length(_message) <= 1000);
$$;


-- >>> 20260420113254_ebc3ac53-099b-4a7f-b6b7-ddfaae57bd86.sql

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


-- >>> 20260420114300_8b2c624c-f2fd-4033-b9e4-f3e3dc0772df.sql
ALTER TABLE public.lesson_overrides
  ADD COLUMN IF NOT EXISTS interactive jsonb,
  ADD COLUMN IF NOT EXISTS quiz jsonb;

-- >>> 20260420144145_7a1fefad-6694-4bad-ae80-e8fed56a3230.sql
ALTER TABLE public.lesson_overrides
  ADD COLUMN IF NOT EXISTS theory_intro text,
  ADD COLUMN IF NOT EXISTS theory_deep text,
  ADD COLUMN IF NOT EXISTS summary text[];

-- >>> 20260420190536_cbd210b9-059a-44fb-ae8e-752979ea1d82.sql
ALTER TABLE public.lesson_overrides ADD COLUMN IF NOT EXISTS spark_intro text;
ALTER TABLE public.lesson_overrides ADD COLUMN IF NOT EXISTS spark_middle text;
ALTER TABLE public.lesson_overrides ADD COLUMN IF NOT EXISTS reflection text;

-- >>> 20260422055253_db5eec5c-f024-4ebb-84f2-023143110b91.sql
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

-- >>> 20260422125635_38eda163-b423-48b9-9391-d07bc88afb2f.sql
-- Remove client-controlled teacher role assignment during signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_class_code TEXT;
  v_school_id UUID;
  v_role public.app_role := 'student';
BEGIN
  v_class_code := NEW.raw_user_meta_data->>'class_code';

  IF v_class_code IS NOT NULL AND length(v_class_code) > 0 THEN
    SELECT school_id INTO v_school_id
    FROM public.class_codes
    WHERE code = upper(v_class_code)
      AND (expires_at IS NULL OR expires_at > now())
    LIMIT 1;
  END IF;

  INSERT INTO public.profiles (id, first_name, age, parent_email, language, paid, school_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    NULLIF(NEW.raw_user_meta_data->>'age', '')::INTEGER,
    NEW.raw_user_meta_data->>'parent_email',
    COALESCE((NEW.raw_user_meta_data->>'language')::public.app_language, 'en'),
    v_school_id IS NOT NULL,
    v_school_id
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, v_role);

  RETURN NEW;
END;
$function$;

-- Tighten user role management to authenticated admins only
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;

CREATE POLICY "Admins view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Restrict lesson audio metadata and files to authenticated access
DROP POLICY IF EXISTS "Anyone can read lesson_audio" ON public.lesson_audio;
CREATE POLICY "Authenticated users can read lesson_audio"
ON public.lesson_audio
FOR SELECT
TO authenticated
USING (true);

UPDATE storage.buckets
SET public = false
WHERE id = 'lesson-audio';

DROP POLICY IF EXISTS "Public read lesson-audio" ON storage.objects;
CREATE POLICY "Authenticated read lesson-audio"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'lesson-audio');

-- Allow secure cleanup of stored certificate files
CREATE POLICY "Owners delete certificates"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'certificates'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Staff delete student certificates"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'certificates'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR public.is_student_in_my_school((storage.foldername(name))[1]::uuid)
  )
);

-- >>> 20260422133545_b95ae116-206c-4fb3-9601-1e7d89b7dffd.sql
-- Safely derive certificate scores from passed attempts
CREATE OR REPLACE FUNCTION public.sync_certificate_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  latest_score integer;
BEGIN
  SELECT fta.score
  INTO latest_score
  FROM public.final_test_attempts AS fta
  WHERE fta.user_id = NEW.user_id
    AND fta.passed = true
  ORDER BY fta.attempted_at DESC
  LIMIT 1;

  IF latest_score IS NULL THEN
    RAISE EXCEPTION 'Certificate can only be created after passing the final test';
  END IF;

  NEW.score := latest_score;

  IF TG_OP = 'INSERT' THEN
    NEW.issued_at := COALESCE(NEW.issued_at, now());
  ELSE
    NEW.issued_at := OLD.issued_at;
    NEW.user_id := OLD.user_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_certificate_fields_trigger ON public.certificates;
CREATE TRIGGER sync_certificate_fields_trigger
BEFORE INSERT OR UPDATE ON public.certificates
FOR EACH ROW
EXECUTE FUNCTION public.sync_certificate_fields();

-- Restrict teacher reads on full profiles and expose only a safe subset via RPC
DROP POLICY IF EXISTS "Teachers view their students" ON public.profiles;

CREATE OR REPLACE FUNCTION public.list_students_in_my_school()
RETURNS TABLE (
  id uuid,
  first_name text,
  school_id uuid
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.first_name, p.school_id
  FROM public.profiles p
  JOIN public.schools s ON s.id = p.school_id
  WHERE s.teacher_id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.list_students_in_my_school() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_students_in_my_school() TO authenticated;

-- Provide secure class-code validation without exposing the whole table
CREATE OR REPLACE FUNCTION public.validate_class_code(_code text)
RETURNS TABLE (
  school_id uuid,
  school_name text,
  valid boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.school_id, s.name AS school_name, true AS valid
  FROM public.class_codes c
  JOIN public.schools s ON s.id = c.school_id
  WHERE c.code = upper(trim(_code))
    AND (c.expires_at IS NULL OR c.expires_at > now())
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.validate_class_code(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_class_code(text) TO anon, authenticated;

-- >>> 20260422133634_1e5634f7-cc61-4a2c-9aff-24ea618db9a8.sql
DROP POLICY IF EXISTS "Users manage own certificate" ON public.certificates;

CREATE POLICY "Users view own certificate"
ON public.certificates
FOR SELECT
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.create_or_refresh_certificate()
RETURNS public.certificates
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_certificate public.certificates;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.certificates (user_id)
  VALUES (v_user_id)
  ON CONFLICT (user_id)
  DO UPDATE SET user_id = EXCLUDED.user_id
  RETURNING * INTO v_certificate;

  RETURN v_certificate;
END;
$$;

CREATE OR REPLACE FUNCTION public.attach_certificate_pdf(_path text)
RETURNS public.certificates
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_certificate public.certificates;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF _path IS NULL OR btrim(_path) = '' THEN
    RAISE EXCEPTION 'Certificate file path is required';
  END IF;

  IF split_part(_path, '/', 1) <> v_user_id::text THEN
    RAISE EXCEPTION 'Certificate path must stay inside the user folder';
  END IF;

  INSERT INTO public.certificates (user_id, pdf_url)
  VALUES (v_user_id, _path)
  ON CONFLICT (user_id)
  DO UPDATE SET pdf_url = EXCLUDED.pdf_url
  RETURNING * INTO v_certificate;

  RETURN v_certificate;
END;
$$;

REVOKE ALL ON FUNCTION public.create_or_refresh_certificate() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_or_refresh_certificate() TO authenticated;

REVOKE ALL ON FUNCTION public.attach_certificate_pdf(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.attach_certificate_pdf(text) TO authenticated;

-- >>> 20260502231018_445b87f2-06e0-4839-8e33-c03ece317ab4.sql

ALTER TABLE public.profiles DROP COLUMN IF EXISTS paid;
DROP TABLE IF EXISTS public.payments;


-- >>> 20260515083118_d72322f7-b62d-4f8d-9ee1-1aae11a2910c.sql
create table public.user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0,
  level integer not null default 1,
  streak_days integer not null default 0,
  longest_combo integer not null default 0,
  last_played_date date,
  updated_at timestamptz not null default now()
);

alter table public.user_stats enable row level security;

create policy "Users view own stats" on public.user_stats
  for select using (auth.uid() = user_id);

create policy "Users insert own stats" on public.user_stats
  for insert with check (auth.uid() = user_id);

create policy "Users update own stats" on public.user_stats
  for update using (auth.uid() = user_id);

create policy "Teachers view student stats" on public.user_stats
  for select using (has_role(auth.uid(), 'teacher'::app_role) and is_student_in_my_school(user_id));

create trigger update_user_stats_updated_at
  before update on public.user_stats
  for each row execute function public.update_updated_at_column();

-- >>> 20260831120000_accounts_and_teacher_onboarding.sql
-- ============================================================
-- Accounts fixes + self-service teacher onboarding
-- ============================================================

-- Fix: a later migration dropped profiles.paid, but handle_new_user still
-- inserted into it, which breaks every signup. Redefine without `paid`.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_class_code TEXT;
  v_school_id UUID;
BEGIN
  v_class_code := NEW.raw_user_meta_data->>'class_code';

  IF v_class_code IS NOT NULL AND length(v_class_code) > 0 THEN
    SELECT school_id INTO v_school_id
    FROM public.class_codes
    WHERE code = upper(v_class_code)
      AND (expires_at IS NULL OR expires_at > now())
    LIMIT 1;
  END IF;

  INSERT INTO public.profiles (id, first_name, age, parent_email, language, school_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    NULLIF(NEW.raw_user_meta_data->>'age', '')::INTEGER,
    NEW.raw_user_meta_data->>'parent_email',
    COALESCE((NEW.raw_user_meta_data->>'language')::public.app_language, 'en'),
    v_school_id
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');

  RETURN NEW;
END;
$function$;

-- Self-service teacher onboarding: promote the current user to teacher,
-- create their class (a "school" row) and a shareable class code — all in
-- one secure call. Safe because a teacher only ever sees students who joined
-- THEIR code (enforced by existing RLS via is_student_in_my_school).
CREATE OR REPLACE FUNCTION public.create_teacher_class(_class_name text)
RETURNS TABLE (school_id uuid, class_code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_school_id uuid;
  v_code text;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF _class_name IS NULL OR length(trim(_class_name)) = 0 THEN
    RAISE EXCEPTION 'Class name is required';
  END IF;

  -- Grant teacher role (idempotent).
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user, 'teacher')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Reuse an existing class if this teacher already made one.
  SELECT id INTO v_school_id FROM public.schools WHERE teacher_id = v_user LIMIT 1;

  IF v_school_id IS NULL THEN
    INSERT INTO public.schools (name, teacher_id)
    VALUES (trim(_class_name), v_user)
    RETURNING id INTO v_school_id;
  ELSE
    UPDATE public.schools SET name = trim(_class_name) WHERE id = v_school_id;
  END IF;

  -- Ensure a class code exists (generate a short unique one if needed).
  SELECT code INTO v_code FROM public.class_codes WHERE class_codes.school_id = v_school_id LIMIT 1;
  IF v_code IS NULL THEN
    LOOP
      v_code := 'SPARK-' || upper(substr(md5(random()::text), 1, 4));
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.class_codes WHERE code = v_code);
    END LOOP;
    INSERT INTO public.class_codes (school_id, code) VALUES (v_school_id, v_code);
  END IF;

  RETURN QUERY SELECT v_school_id, v_code;
END;
$$;

REVOKE ALL ON FUNCTION public.create_teacher_class(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_teacher_class(text) TO authenticated;

-- Convenience: fetch the current teacher's class + code (or nulls).
CREATE OR REPLACE FUNCTION public.my_teacher_class()
RETURNS TABLE (school_id uuid, class_name text, class_code text, student_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    s.id,
    s.name,
    (SELECT c.code FROM public.class_codes c WHERE c.school_id = s.id ORDER BY c.created_at LIMIT 1),
    (SELECT count(*) FROM public.profiles p WHERE p.school_id = s.id)
  FROM public.schools s
  WHERE s.teacher_id = auth.uid()
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.my_teacher_class() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.my_teacher_class() TO authenticated;


-- >>> 20260923120000_v2_accounts_classes_missions.sql
-- ============================================================
-- v2: kid-friendly accounts, parental consent, classes, missions
-- Safe to run once on a project that already has the earlier migrations.
-- ============================================================

create extension if not exists pgcrypto with schema extensions;

-- ------------------------------------------------------------
-- 1) Usernames + consent on profiles
-- ------------------------------------------------------------
alter table public.profiles
  add column if not exists username text,
  add column if not exists consent_type text check (consent_type in ('school', 'parent')),
  add column if not exists consent_at timestamptz;

create unique index if not exists profiles_username_key
  on public.profiles (lower(username))
  where username is not null;

-- ------------------------------------------------------------
-- 2) Signup: store username + how consent was given
--    - joined with a class code  -> consent via the school
--    - signed up at home         -> a parent ticked consent
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_class_code text;
  v_school_id uuid;
  v_username text;
  v_consent_type text := null;
  v_consent_at timestamptz := null;
begin
  v_class_code := new.raw_user_meta_data->>'class_code';
  if v_class_code is not null and length(v_class_code) > 0 then
    select school_id into v_school_id
    from public.class_codes
    where code = upper(v_class_code)
      and (expires_at is null or expires_at > now())
    limit 1;
  end if;

  v_username := nullif(lower(trim(new.raw_user_meta_data->>'username')), '');

  if v_school_id is not null then
    v_consent_type := 'school';
    v_consent_at := now();
  elsif lower(coalesce(new.raw_user_meta_data->>'parent_consent', '')) = 'true' then
    v_consent_type := 'parent';
    v_consent_at := now();
  end if;

  insert into public.profiles (id, first_name, age, parent_email, language, school_id, username, consent_type, consent_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', split_part(new.email, '@', 1)),
    nullif(new.raw_user_meta_data->>'age', '')::integer,
    new.raw_user_meta_data->>'parent_email',
    coalesce((new.raw_user_meta_data->>'language')::public.app_language, 'nl'),
    v_school_id,
    v_username,
    v_consent_type,
    v_consent_at
  );

  insert into public.user_roles (user_id, role) values (new.id, 'student');
  return new;
end;
$function$;

-- Kids log in with a username. Under the hood that is <username>@leerling.aimetspark.nl.
create or replace function public.username_available(_username text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (select 1 from public.profiles where lower(username) = lower(trim(_username)))
     and not exists (select 1 from auth.users where email = lower(trim(_username)) || '@leerling.aimetspark.nl');
$$;
revoke all on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;

-- ------------------------------------------------------------
-- 3) Protect fields that must only change through the app's own
--    functions (class membership, username, consent).
-- ------------------------------------------------------------
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
as $$
begin
  if current_setting('app.trusted_profile_update', true) = 'on' then
    return new;
  end if;
  if new.school_id is distinct from old.school_id
     or new.username is distinct from old.username
     or new.consent_type is distinct from old.consent_type
     or new.consent_at is distinct from old.consent_at then
    raise exception 'These profile fields can only be changed through the app';
  end if;
  return new;
end;
$$;

drop trigger if exists guard_profile_update on public.profiles;
create trigger guard_profile_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

-- ------------------------------------------------------------
-- 4) Kids join (or leave) a class after signing up
-- ------------------------------------------------------------
create or replace function public.join_class(_code text)
returns table (school_id uuid, class_name text)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_school uuid;
  v_name text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  select c.school_id, s.name into v_school, v_name
  from public.class_codes c
  join public.schools s on s.id = c.school_id
  where c.code = upper(trim(_code))
    and (c.expires_at is null or c.expires_at > now())
  limit 1;
  if v_school is null then
    raise exception 'Unknown class code';
  end if;
  perform set_config('app.trusted_profile_update', 'on', true);
  update public.profiles
     set school_id = v_school,
         consent_type = coalesce(consent_type, 'school'),
         consent_at = coalesce(consent_at, now())
   where id = auth.uid();
  return query select v_school, v_name;
end;
$$;
revoke all on function public.join_class(text) from public;
grant execute on function public.join_class(text) to authenticated;

create or replace function public.leave_class()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  perform set_config('app.trusted_profile_update', 'on', true);
  update public.profiles set school_id = null where id = auth.uid();
end;
$$;
revoke all on function public.leave_class() from public;
grant execute on function public.leave_class() to authenticated;

-- ------------------------------------------------------------
-- 5) Teachers: more than one class
-- ------------------------------------------------------------
create or replace function public.create_class(_class_name text)
returns table (school_id uuid, class_code text)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_user uuid := auth.uid();
  v_school_id uuid;
  v_code text;
begin
  if v_user is null then
    raise exception 'Not authenticated';
  end if;
  if _class_name is null or length(trim(_class_name)) = 0 then
    raise exception 'Class name is required';
  end if;
  insert into public.user_roles (user_id, role) values (v_user, 'teacher')
  on conflict (user_id, role) do nothing;
  insert into public.schools (name, teacher_id) values (trim(_class_name), v_user)
  returning id into v_school_id;
  loop
    v_code := 'SPARK-' || upper(substr(md5(random()::text), 1, 4));
    exit when not exists (select 1 from public.class_codes c where c.code = v_code);
  end loop;
  insert into public.class_codes (school_id, code) values (v_school_id, v_code);
  return query select v_school_id, v_code;
end;
$$;
revoke all on function public.create_class(text) from public;
grant execute on function public.create_class(text) to authenticated;

-- First-class onboarding (reuses the teacher's first class if it exists).
-- Redefined with an explicit variable-conflict rule for robustness.
create or replace function public.create_teacher_class(_class_name text)
returns table (school_id uuid, class_code text)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_user uuid := auth.uid();
  v_school_id uuid;
  v_code text;
begin
  if v_user is null then
    raise exception 'Not authenticated';
  end if;
  if _class_name is null or length(trim(_class_name)) = 0 then
    raise exception 'Class name is required';
  end if;
  insert into public.user_roles (user_id, role) values (v_user, 'teacher')
  on conflict (user_id, role) do nothing;
  select s.id into v_school_id from public.schools s where s.teacher_id = v_user order by s.created_at limit 1;
  if v_school_id is null then
    insert into public.schools (name, teacher_id) values (trim(_class_name), v_user)
    returning id into v_school_id;
  end if;
  select c.code into v_code from public.class_codes c where c.school_id = v_school_id order by c.created_at limit 1;
  if v_code is null then
    loop
      v_code := 'SPARK-' || upper(substr(md5(random()::text), 1, 4));
      exit when not exists (select 1 from public.class_codes c where c.code = v_code);
    end loop;
    insert into public.class_codes (school_id, code) values (v_school_id, v_code);
  end if;
  return query select v_school_id, v_code;
end;
$$;
revoke all on function public.create_teacher_class(text) from public;
grant execute on function public.create_teacher_class(text) to authenticated;

create or replace function public.my_classes()
returns table (school_id uuid, class_name text, class_code text, student_count bigint, created_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.id,
    s.name,
    (select c.code from public.class_codes c where c.school_id = s.id order by c.created_at limit 1),
    (select count(*) from public.profiles p where p.school_id = s.id),
    s.created_at
  from public.schools s
  where s.teacher_id = auth.uid()
  order by s.created_at;
$$;
revoke all on function public.my_classes() from public;
grant execute on function public.my_classes() to authenticated;

-- Roster now includes the username (so a teacher can help a kid log in).
drop function if exists public.list_students_in_my_school();
create function public.list_students_in_my_school()
returns table (id uuid, first_name text, username text, school_id uuid)
language sql
stable
security definer
set search_path = public
as $$
  select p.id, p.first_name, p.username, p.school_id
  from public.profiles p
  join public.schools s on s.id = p.school_id
  where s.teacher_id = auth.uid();
$$;
revoke all on function public.list_students_in_my_school() from public;
grant execute on function public.list_students_in_my_school() to authenticated;

-- A teacher can set a new password for a student in their own class
-- (kids don't have an email address to reset it themselves).
create or replace function public.teacher_reset_student_password(_student uuid, _password text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if not public.is_student_in_my_school(_student) then
    raise exception 'This student is not in your class';
  end if;
  if _password is null or length(_password) < 6 then
    raise exception 'Password must be at least 6 characters';
  end if;
  update auth.users
     set encrypted_password = extensions.crypt(_password, extensions.gen_salt('bf')),
         updated_at = now()
   where id = _student;
end;
$$;
revoke all on function public.teacher_reset_student_password(uuid, text) from public;
grant execute on function public.teacher_reset_student_password(uuid, text) to authenticated;

create or replace function public.teacher_remove_student(_student uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if not public.is_student_in_my_school(_student) then
    raise exception 'This student is not in your class';
  end if;
  perform set_config('app.trusted_profile_update', 'on', true);
  update public.profiles set school_id = null where id = _student;
end;
$$;
revoke all on function public.teacher_remove_student(uuid) from public;
grant execute on function public.teacher_remove_student(uuid) to authenticated;

-- ------------------------------------------------------------
-- 6) Delete your own account without an edge function.
--    Everything else is removed by ON DELETE CASCADE.
-- ------------------------------------------------------------
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;
revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;

-- ------------------------------------------------------------
-- 7) Move existing progress from the 24 v1 lessons to the 18 v2 missions.
--    Runs once (guarded by a marker row).
-- ------------------------------------------------------------
create table if not exists public._migration_markers (
  name text primary key,
  applied_at timestamptz not null default now()
);
alter table public._migration_markers enable row level security;

do $$
begin
  if exists (select 1 from public._migration_markers where name = 'missions_v2_remap') then
    return;
  end if;

  create temp table _lesson_map (old_id text primary key, new_id text not null) on commit drop;
  insert into _lesson_map (old_id, new_id) values
    ('1.1', '1.1'), ('1.2', '1.2'), ('1.6', '1.2'), ('1.5', '1.3'), ('1.7', '1.3'), ('1.8', '1.6'),
    ('1.4', '2.1'), ('2.1', '2.1'), ('2.2', '2.1'), ('2.4', '2.2'), ('2.6', '2.2'),
    ('1.3', '2.3'), ('2.3', '2.3'), ('2.5', '2.3'), ('2.7', '2.5'), ('2.8', '2.6'),
    ('3.1', '3.1'), ('3.2', '3.1'), ('3.3', '3.2'), ('3.6', '3.2'), ('3.4', '3.3'),
    ('3.5', '3.4'), ('3.7', '3.5'), ('3.8', '3.6');

  create temp table _remapped on commit drop as
    select p.user_id, m.new_id as lesson_id, max(p.stars) as stars, max(p.completed_at) as completed_at
    from public.user_progress p
    join _lesson_map m on m.old_id = p.lesson_id
    group by p.user_id, m.new_id;

  delete from public.user_progress;
  insert into public.user_progress (user_id, lesson_id, stars, completed_at)
    select user_id, lesson_id, stars, completed_at from _remapped;

  insert into public._migration_markers (name) values ('missions_v2_remap');
end $$;


