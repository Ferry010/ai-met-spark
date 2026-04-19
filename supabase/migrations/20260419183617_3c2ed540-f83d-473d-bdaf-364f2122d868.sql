
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
