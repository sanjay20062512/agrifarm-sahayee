-- 1. FIX: Wallet balance privilege escalation
DROP POLICY IF EXISTS "Users can update their own wallet" ON public.wallets;

CREATE OR REPLACE FUNCTION public.update_wallet_balance(
  p_user_id uuid,
  p_amount numeric,
  p_operation text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  IF p_operation = 'add' THEN
    UPDATE public.wallets SET balance = balance + p_amount, updated_at = now() WHERE user_id = p_user_id;
  ELSIF p_operation = 'subtract' THEN
    IF (SELECT balance FROM public.wallets WHERE user_id = p_user_id) < p_amount THEN
      RAISE EXCEPTION 'Insufficient balance';
    END IF;
    UPDATE public.wallets SET balance = balance - p_amount, updated_at = now() WHERE user_id = p_user_id;
  ELSE
    RAISE EXCEPTION 'Invalid operation. Use add or subtract.';
  END IF;
END;
$$;

-- 2. FIX: PII exposure on machinery_profiles
DROP POLICY IF EXISTS "Machinery profiles are viewable by everyone" ON public.machinery_profiles;
CREATE POLICY "Machinery profiles viewable by authenticated users"
  ON public.machinery_profiles FOR SELECT TO authenticated USING (true);

-- 3. FIX: PII exposure on machinery_listings
DROP POLICY IF EXISTS "Machinery listings are viewable by everyone" ON public.machinery_listings;
CREATE POLICY "Machinery listings viewable by authenticated users"
  ON public.machinery_listings FOR SELECT TO authenticated USING (true);

-- 4. FIX: PII exposure on machinery_requirements
DROP POLICY IF EXISTS "Machinery requirements are viewable by everyone" ON public.machinery_requirements;
CREATE POLICY "Machinery requirements viewable by authenticated users"
  ON public.machinery_requirements FOR SELECT TO authenticated USING (true);

-- 5. FIX: PII exposure on job_requirements
DROP POLICY IF EXISTS "Job requirements are viewable by everyone" ON public.job_requirements;
CREATE POLICY "Job requirements viewable by authenticated users"
  ON public.job_requirements FOR SELECT TO authenticated USING (true);