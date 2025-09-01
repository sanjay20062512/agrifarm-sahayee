-- Add market prices table for real-time market data
CREATE TABLE public.market_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_name TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  market_name TEXT NOT NULL,
  price_per_kg NUMERIC NOT NULL,
  price_per_quintal NUMERIC NOT NULL,
  quality_grade TEXT,
  price_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT DEFAULT 'api',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add triggers for market prices table
CREATE TRIGGER update_market_prices_updated_at
BEFORE UPDATE ON public.market_prices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS for market prices
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;

-- RLS policies for market prices
CREATE POLICY "Market prices are viewable by everyone" 
ON public.market_prices FOR SELECT USING (true);

CREATE POLICY "System can insert market prices" 
ON public.market_prices FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update market prices" 
ON public.market_prices FOR UPDATE USING (true);

-- Insert sample market data
INSERT INTO public.market_prices (crop_name, location, state, district, market_name, price_per_kg, price_per_quintal, quality_grade) VALUES
('Tomato', 'Erode, Tamil Nadu', 'Tamil Nadu', 'Erode', 'Erode APMC', 28.50, 2850, 'Grade A'),
('Onion', 'Delhi, Delhi', 'Delhi', 'Delhi', 'Azadpur Mandi', 45.00, 4500, 'Grade A'),
('Potato', 'Agra, Uttar Pradesh', 'Uttar Pradesh', 'Agra', 'Agra Sabzi Mandi', 22.00, 2200, 'Grade B'),
('Rice', 'Ludhiana, Punjab', 'Punjab', 'Ludhiana', 'Ludhiana Grain Market', 35.00, 3500, 'Grade A'),
('Wheat', 'Indore, Madhya Pradesh', 'Madhya Pradesh', 'Indore', 'Indore Krishi Upaj Mandi', 28.00, 2800, 'Grade A'),
('Cotton', 'Nagpur, Maharashtra', 'Maharashtra', 'Nagpur', 'Nagpur Cotton Market', 52.00, 5200, 'Grade B'),
('Sugarcane', 'Kolhapur, Maharashtra', 'Maharashtra', 'Kolhapur', 'Kolhapur Sugar Factory', 4.50, 450, 'Grade A'),
('Chili', 'Guntur, Andhra Pradesh', 'Andhra Pradesh', 'Guntur', 'Guntur Spice Market', 120.00, 12000, 'Grade A'),
('Turmeric', 'Erode, Tamil Nadu', 'Tamil Nadu', 'Erode', 'Erode Turmeric Market', 85.00, 8500, 'Grade A'),
('Groundnut', 'Rajkot, Gujarat', 'Gujarat', 'Rajkot', 'Rajkot Oil Seeds Market', 65.00, 6500, 'Grade B');

-- Add AI analysis and post deletion functionality to forum
ALTER TABLE public.forum_posts ADD COLUMN ai_analysis TEXT;
ALTER TABLE public.forum_posts ADD COLUMN ai_suggestions TEXT[];

-- Create forum replies table if not exists
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.forum_posts(id),
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_guest_reply BOOLEAN DEFAULT false,
  guest_session_id TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for forum replies
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- RLS policies for forum replies
CREATE POLICY "Forum replies are viewable by everyone" 
ON public.forum_replies FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create replies" 
ON public.forum_replies FOR INSERT 
WITH CHECK (auth.uid() = author_id OR is_guest_reply = true);

-- Allow post deletion
DROP POLICY IF EXISTS "Forum posts are viewable by everyone" ON public.forum_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Authors can update their posts" ON public.forum_posts;

CREATE POLICY "Forum posts are viewable by everyone" 
ON public.forum_posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" 
ON public.forum_posts FOR INSERT 
WITH CHECK (auth.uid() = author_id OR is_guest_post = true);

CREATE POLICY "Authors can update their posts" 
ON public.forum_posts FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their posts" 
ON public.forum_posts FOR DELETE 
USING (auth.uid() = author_id OR is_guest_post = true);