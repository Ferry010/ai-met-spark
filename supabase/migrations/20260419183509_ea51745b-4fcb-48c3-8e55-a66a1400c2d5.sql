
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
