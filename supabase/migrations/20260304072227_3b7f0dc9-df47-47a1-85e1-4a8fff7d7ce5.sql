
-- ============================================
-- 1. RESTRICT PUBLIC SELECT ON SENSITIVE TABLES
-- ============================================

DROP POLICY IF EXISTS "Labor profiles are viewable by everyone" ON labor_profiles;
CREATE POLICY "Labor profiles viewable by authenticated users"
ON labor_profiles FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Job profiles are viewable by everyone" ON job_profiles;
CREATE POLICY "Job profiles viewable by authenticated users"
ON job_profiles FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- 2. DROP GUEST INSERT POLICIES (require auth)
-- ============================================

DROP POLICY IF EXISTS "Guests can create job profiles" ON job_profiles;
DROP POLICY IF EXISTS "Guests can create job requirements" ON job_requirements;
DROP POLICY IF EXISTS "Guests can create machinery listings" ON machinery_listings;
DROP POLICY IF EXISTS "Guests can create machinery requirements" ON machinery_requirements;

-- ============================================
-- 3. RESTRICT SYSTEM INSERT/UPDATE POLICIES
-- ============================================

DROP POLICY IF EXISTS "System can create notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert market prices" ON market_prices;
DROP POLICY IF EXISTS "System can update market prices" ON market_prices;
DROP POLICY IF EXISTS "System can insert weather alerts" ON weather_alerts;
DROP POLICY IF EXISTS "System can update weather alerts" ON weather_alerts;

-- ============================================
-- 4. ADD CHECK CONSTRAINTS FOR INPUT VALIDATION
-- ============================================

ALTER TABLE labor_bookings ADD CONSTRAINT valid_offered_wage
  CHECK (offered_wage > 0 AND offered_wage < 500000);

ALTER TABLE labor_bookings ADD CONSTRAINT valid_booking_dates
  CHECK (end_date >= start_date);

ALTER TABLE machinery_bookings ADD CONSTRAINT valid_machinery_rate
  CHECK (rate_per_unit > 0 AND rate_per_unit < 500000);

ALTER TABLE machinery_bookings ADD CONSTRAINT valid_machinery_booking_dates
  CHECK (end_date >= start_date);

ALTER TABLE machinery_bookings ADD CONSTRAINT valid_machinery_total
  CHECK (total_amount > 0);

ALTER TABLE job_profiles ADD CONSTRAINT valid_experience
  CHECK (experience_years IS NULL OR (experience_years >= 0 AND experience_years <= 70));

ALTER TABLE labor_profiles ADD CONSTRAINT valid_labor_experience
  CHECK (experience_years IS NULL OR (experience_years >= 0 AND experience_years <= 70));

ALTER TABLE labor_profiles ADD CONSTRAINT valid_labor_rating
  CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5));

ALTER TABLE machinery_profiles ADD CONSTRAINT valid_machinery_rating
  CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5));

ALTER TABLE reviews ADD CONSTRAINT valid_review_rating
  CHECK (rating >= 1 AND rating <= 5);

-- Relaxed forum constraints (allow existing short data)
ALTER TABLE forum_posts ADD CONSTRAINT valid_forum_title_length
  CHECK (char_length(title) >= 1 AND char_length(title) <= 500);

ALTER TABLE forum_posts ADD CONSTRAINT valid_forum_content_length
  CHECK (char_length(content) >= 1 AND char_length(content) <= 10000);
