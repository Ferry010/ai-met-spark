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