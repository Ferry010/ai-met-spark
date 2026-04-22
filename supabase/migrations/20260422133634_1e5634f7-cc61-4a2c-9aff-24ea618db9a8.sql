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