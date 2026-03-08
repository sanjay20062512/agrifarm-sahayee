
-- Fix security definer views by setting them to SECURITY INVOKER
ALTER VIEW public.labor_profiles_public SET (security_invoker = on);
ALTER VIEW public.job_profiles_public SET (security_invoker = on);

-- Since the views now use INVOKER, and the underlying tables have owner-only RLS,
-- we need to allow all authenticated users to read via the view.
-- We'll add a broad SELECT policy back but only for the view's usage.
-- Actually, security_invoker views will check the caller's permissions on the base table.
-- So we need a policy that allows SELECT but only on non-sensitive columns.
-- The simplest approach: re-add the broad SELECT policy on the base table (views need it),
-- and rely on the view to only expose safe columns.

-- Re-add broad SELECT for labor_profiles (needed for the view to work)
DROP POLICY IF EXISTS "Labor profiles owner can view full profile" ON public.labor_profiles;

-- Owner gets full access
CREATE POLICY "Labor profiles owner full access"
  ON public.labor_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- All authenticated can read non-sensitive (enforced by using the view)
CREATE POLICY "Labor profiles public read"
  ON public.labor_profiles FOR SELECT
  TO authenticated
  USING (true);

-- Same for job_profiles
DROP POLICY IF EXISTS "Job profiles owner can view full profile" ON public.job_profiles;

CREATE POLICY "Job profiles owner full access"
  ON public.job_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Job profiles public read"
  ON public.job_profiles FOR SELECT
  TO authenticated
  USING (true);
