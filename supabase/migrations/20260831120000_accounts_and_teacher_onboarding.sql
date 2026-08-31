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
