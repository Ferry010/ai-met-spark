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