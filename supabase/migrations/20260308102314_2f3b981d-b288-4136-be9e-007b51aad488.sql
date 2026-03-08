
-- Fix 1: Tighten forum_posts DELETE policy to not allow deleting all guest posts
-- Currently: USING (auth.uid() = author_id) — this is actually fine per the RLS shown.
-- But the INSERT allows is_guest_post = true for anyone, so we need to also 
-- ensure guest posts can only be deleted by matching guest_session_id via edge function.
-- The real fix is in the code (done above) — posts now properly set author_id for logged-in users.

-- Fix 2: Create views for labor_profiles and job_profiles that exclude sensitive PII
-- Then restrict the SELECT policies to owner-only for the full table, 
-- and create a public view without sensitive columns.

-- Create a view for labor_profiles without sensitive fields
CREATE OR REPLACE VIEW public.labor_profiles_public AS
SELECT 
  id, user_id, name, phone, location, state, district, pincode,
  skills, experience_years, daily_wage_min, daily_wage_max,
  availability, rating, total_reviews, verified,
  profile_image, description, created_at, updated_at
FROM public.labor_profiles;

-- Create a view for job_profiles without sensitive fields
CREATE OR REPLACE VIEW public.job_profiles_public AS
SELECT 
  id, user_id, name, phone, location, state, district, pincode,
  skills, specialization, experience_years, expected_wage_min, expected_wage_max,
  availability, profile_image, description, created_at, updated_at
FROM public.job_profiles;

-- Update labor_profiles SELECT policy to owner-only (for full row including sensitive data)
DROP POLICY IF EXISTS "Labor profiles viewable by authenticated users" ON public.labor_profiles;
CREATE POLICY "Labor profiles owner can view full profile"
  ON public.labor_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Update job_profiles SELECT policy to owner-only (for full row including sensitive data)
DROP POLICY IF EXISTS "Job profiles viewable by authenticated users" ON public.job_profiles;
CREATE POLICY "Job profiles owner can view full profile"
  ON public.job_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant SELECT on the public views to authenticated and anon
GRANT SELECT ON public.labor_profiles_public TO authenticated;
GRANT SELECT ON public.job_profiles_public TO authenticated;
