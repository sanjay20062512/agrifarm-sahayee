
-- Remove the broad SELECT policies that expose PII
DROP POLICY IF EXISTS "Labor profiles public read" ON public.labor_profiles;
DROP POLICY IF EXISTS "Job profiles public read" ON public.job_profiles;

-- Drop the security invoker views (we'll use a different approach)
DROP VIEW IF EXISTS public.labor_profiles_public;
DROP VIEW IF EXISTS public.job_profiles_public;

-- Create SECURITY DEFINER functions to safely list profiles without PII
CREATE OR REPLACE FUNCTION public.list_labor_profiles(
  p_state text DEFAULT NULL,
  p_district text DEFAULT NULL
)
RETURNS TABLE (
  id uuid, user_id uuid, name text, phone text, location text, state text, district text,
  pincode text, skills public.skill_type[], experience_years integer,
  daily_wage_min integer, daily_wage_max integer,
  availability public.availability_status, rating numeric, total_reviews integer,
  verified boolean, profile_image text, description text,
  created_at timestamptz, updated_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT 
    lp.id, lp.user_id, lp.name, lp.phone, lp.location, lp.state, lp.district,
    lp.pincode, lp.skills, lp.experience_years,
    lp.daily_wage_min, lp.daily_wage_max,
    lp.availability, lp.rating, lp.total_reviews,
    lp.verified, lp.profile_image, lp.description,
    lp.created_at, lp.updated_at
  FROM public.labor_profiles lp
  WHERE (p_state IS NULL OR lp.state = p_state)
    AND (p_district IS NULL OR lp.district = p_district);
$$;

CREATE OR REPLACE FUNCTION public.list_job_profiles(
  p_state text DEFAULT NULL,
  p_district text DEFAULT NULL
)
RETURNS TABLE (
  id uuid, user_id uuid, name text, phone text, location text, state text, district text,
  pincode text, skills text[], specialization text, experience_years integer,
  expected_wage_min integer, expected_wage_max integer,
  availability boolean, profile_image text, description text,
  created_at timestamptz, updated_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT 
    jp.id, jp.user_id, jp.name, jp.phone, jp.location, jp.state, jp.district,
    jp.pincode, jp.skills, jp.specialization, jp.experience_years,
    jp.expected_wage_min, jp.expected_wage_max,
    jp.availability, jp.profile_image, jp.description,
    jp.created_at, jp.updated_at
  FROM public.job_profiles jp
  WHERE (p_state IS NULL OR jp.state = p_state)
    AND (p_district IS NULL OR jp.district = p_district);
$$;
