
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
