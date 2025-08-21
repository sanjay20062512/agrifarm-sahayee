-- Create enum types for labor and machinery
CREATE TYPE public.skill_type AS ENUM (
  'harvesting', 'sowing', 'irrigation', 'pest_control', 'fertilizer_application',
  'land_preparation', 'weeding', 'transplanting', 'pruning', 'general_labor'
);

CREATE TYPE public.availability_status AS ENUM ('available', 'busy', 'inactive');

CREATE TYPE public.machinery_type AS ENUM (
  'tractor', 'harvester', 'tiller', 'irrigation_pump', 'sprayer', 
  'seed_drill', 'thresher', 'cultivator', 'plough', 'rotavator'
);

CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- Create labor profiles table
CREATE TABLE public.labor_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  pincode TEXT,
  skills skill_type[] NOT NULL DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  daily_wage_min INTEGER NOT NULL,
  daily_wage_max INTEGER NOT NULL,
  availability availability_status DEFAULT 'available',
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  profile_image TEXT,
  description TEXT,
  government_id TEXT,
  bank_account TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create machinery profiles table
CREATE TABLE public.machinery_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_name TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  machinery_type machinery_type NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year_of_purchase INTEGER,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  pincode TEXT,
  hourly_rate INTEGER NOT NULL,
  daily_rate INTEGER NOT NULL,
  availability availability_status DEFAULT 'available',
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  machinery_images TEXT[],
  description TEXT,
  fuel_type TEXT,
  horsepower INTEGER,
  working_width DECIMAL(4,2),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create labor bookings table
CREATE TABLE public.labor_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  labor_id UUID REFERENCES public.labor_profiles(id) ON DELETE CASCADE,
  task_description TEXT NOT NULL,
  required_skills skill_type[] NOT NULL DEFAULT '{}',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  number_of_workers INTEGER DEFAULT 1,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  offered_wage INTEGER NOT NULL,
  status booking_status DEFAULT 'pending',
  farmer_notes TEXT,
  labor_notes TEXT,
  total_amount INTEGER,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create machinery bookings table
CREATE TABLE public.machinery_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  machinery_id UUID REFERENCES public.machinery_profiles(id) ON DELETE CASCADE,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('hourly', 'daily')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  hours INTEGER,
  days INTEGER,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  rate_per_unit INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  status booking_status DEFAULT 'pending',
  farmer_notes TEXT,
  owner_notes TEXT,
  fuel_cost INTEGER DEFAULT 0,
  operator_required BOOLEAN DEFAULT false,
  operator_cost INTEGER DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table for both labor and machinery
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_type TEXT NOT NULL CHECK (reviewee_type IN ('labor', 'machinery')),
  labor_id UUID REFERENCES public.labor_profiles(id) ON DELETE CASCADE,
  machinery_id UUID REFERENCES public.machinery_profiles(id) ON DELETE CASCADE,
  booking_id UUID,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  work_quality INTEGER CHECK (work_quality >= 1 AND work_quality <= 5),
  punctuality INTEGER CHECK (punctuality >= 1 AND punctuality <= 5),
  communication INTEGER CHECK (communication >= 1 AND communication <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create farmer forum posts table
CREATE TABLE public.forum_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_location TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  is_guest_post BOOLEAN DEFAULT false,
  guest_session_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forum replies table
CREATE TABLE public.forum_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  is_guest_reply BOOLEAN DEFAULT false,
  guest_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create market prices table
CREATE TABLE public.market_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_name TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  market_name TEXT NOT NULL,
  price_per_kg DECIMAL(8,2) NOT NULL,
  price_per_quintal DECIMAL(10,2) NOT NULL,
  quality_grade TEXT,
  price_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT DEFAULT 'api',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.labor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machinery_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machinery_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for labor_profiles
CREATE POLICY "Labor profiles are viewable by everyone" 
ON public.labor_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own labor profile" 
ON public.labor_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own labor profile" 
ON public.labor_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for machinery_profiles
CREATE POLICY "Machinery profiles are viewable by everyone" 
ON public.machinery_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own machinery profile" 
ON public.machinery_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own machinery profile" 
ON public.machinery_profiles 
FOR UPDATE 
USING (auth.uid() = owner_id);

-- RLS Policies for labor_bookings
CREATE POLICY "Users can view their labor bookings" 
ON public.labor_bookings 
FOR SELECT 
USING (auth.uid() = farmer_id OR auth.uid() IN (
  SELECT user_id FROM labor_profiles WHERE id = labor_id
));

CREATE POLICY "Farmers can create labor bookings" 
ON public.labor_bookings 
FOR INSERT 
WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Participants can update labor bookings" 
ON public.labor_bookings 
FOR UPDATE 
USING (auth.uid() = farmer_id OR auth.uid() IN (
  SELECT user_id FROM labor_profiles WHERE id = labor_id
));

-- RLS Policies for machinery_bookings
CREATE POLICY "Users can view their machinery bookings" 
ON public.machinery_bookings 
FOR SELECT 
USING (auth.uid() = farmer_id OR auth.uid() IN (
  SELECT owner_id FROM machinery_profiles WHERE id = machinery_id
));

CREATE POLICY "Farmers can create machinery bookings" 
ON public.machinery_bookings 
FOR INSERT 
WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Participants can update machinery bookings" 
ON public.machinery_bookings 
FOR UPDATE 
USING (auth.uid() = farmer_id OR auth.uid() IN (
  SELECT owner_id FROM machinery_profiles WHERE id = machinery_id
));

-- RLS Policies for reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.uid() = reviewer_id);

-- RLS Policies for forum_posts
CREATE POLICY "Forum posts are viewable by everyone" 
ON public.forum_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create posts" 
ON public.forum_posts 
FOR INSERT 
WITH CHECK (auth.uid() = author_id OR is_guest_post = true);

CREATE POLICY "Authors can update their posts" 
ON public.forum_posts 
FOR UPDATE 
USING (auth.uid() = author_id);

-- RLS Policies for forum_replies
CREATE POLICY "Forum replies are viewable by everyone" 
ON public.forum_replies 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create replies" 
ON public.forum_replies 
FOR INSERT 
WITH CHECK (auth.uid() = author_id OR is_guest_reply = true);

-- RLS Policies for market_prices
CREATE POLICY "Market prices are viewable by everyone" 
ON public.market_prices 
FOR SELECT 
USING (true);

CREATE POLICY "System can insert market prices" 
ON public.market_prices 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update market prices" 
ON public.market_prices 
FOR UPDATE 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_labor_profiles_location ON public.labor_profiles(state, district);
CREATE INDEX idx_labor_profiles_skills ON public.labor_profiles USING GIN(skills);
CREATE INDEX idx_labor_profiles_availability ON public.labor_profiles(availability);

CREATE INDEX idx_machinery_profiles_location ON public.machinery_profiles(state, district);
CREATE INDEX idx_machinery_profiles_type ON public.machinery_profiles(machinery_type);
CREATE INDEX idx_machinery_profiles_availability ON public.machinery_profiles(availability);

CREATE INDEX idx_labor_bookings_farmer ON public.labor_bookings(farmer_id);
CREATE INDEX idx_labor_bookings_labor ON public.labor_bookings(labor_id);
CREATE INDEX idx_labor_bookings_date ON public.labor_bookings(start_date, end_date);

CREATE INDEX idx_machinery_bookings_farmer ON public.machinery_bookings(farmer_id);
CREATE INDEX idx_machinery_bookings_machinery ON public.machinery_bookings(machinery_id);
CREATE INDEX idx_machinery_bookings_date ON public.machinery_bookings(start_date, end_date);

CREATE INDEX idx_forum_posts_created ON public.forum_posts(created_at DESC);
CREATE INDEX idx_forum_posts_category ON public.forum_posts(category);

CREATE INDEX idx_market_prices_crop_location ON public.market_prices(crop_name, state, district);
CREATE INDEX idx_market_prices_date ON public.market_prices(price_date DESC);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_labor_profiles_updated_at
  BEFORE UPDATE ON public.labor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_machinery_profiles_updated_at
  BEFORE UPDATE ON public.machinery_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_labor_bookings_updated_at
  BEFORE UPDATE ON public.labor_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_machinery_bookings_updated_at
  BEFORE UPDATE ON public.machinery_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_market_prices_updated_at
  BEFORE UPDATE ON public.market_prices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();