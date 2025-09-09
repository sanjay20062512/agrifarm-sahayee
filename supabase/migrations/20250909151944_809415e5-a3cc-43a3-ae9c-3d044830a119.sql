-- Add AI analysis functionality to forum posts
ALTER TABLE forum_posts 
ADD COLUMN ai_analysis TEXT,
ADD COLUMN ai_suggestions TEXT[];

-- Enable realtime for forum posts
ALTER TABLE forum_posts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE forum_posts;

-- Enable realtime for job profiles and requirements
ALTER TABLE job_profiles REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE job_profiles;

ALTER TABLE job_requirements REPLICA IDENTITY FULL; 
ALTER PUBLICATION supabase_realtime ADD TABLE job_requirements;

-- Enable realtime for machinery listings and requirements
ALTER TABLE machinery_listings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE machinery_listings;

ALTER TABLE machinery_requirements REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE machinery_requirements;