-- Add delete policy for forum_posts (authors can delete their own posts)
CREATE POLICY "Authors can delete their posts"
ON public.forum_posts
FOR DELETE
USING (auth.uid() = author_id);

-- Allow guests (no auth) to create job requirements
CREATE POLICY "Guests can create job requirements"
ON public.job_requirements
FOR INSERT
WITH CHECK (user_id IS NULL);

-- Allow guests to create machinery requirements
CREATE POLICY "Guests can create machinery requirements"
ON public.machinery_requirements
FOR INSERT
WITH CHECK (user_id IS NULL);

-- Allow guests to create job profiles
CREATE POLICY "Guests can create job profiles"
ON public.job_profiles
FOR INSERT
WITH CHECK (user_id IS NULL);

-- Allow guests to create machinery listings
CREATE POLICY "Guests can create machinery listings"
ON public.machinery_listings
FOR INSERT
WITH CHECK (user_id IS NULL);
