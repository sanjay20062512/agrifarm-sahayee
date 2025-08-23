-- Create tables for enhanced agricultural platform

-- Create job_profiles table for laborers seeking work
CREATE TABLE public.job_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  pincode TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  specialization TEXT,
  experience_years INTEGER DEFAULT 0,
  expected_wage_min INTEGER NOT NULL,
  expected_wage_max INTEGER NOT NULL,
  availability BOOLEAN DEFAULT true,
  profile_image TEXT,
  description TEXT,
  government_id TEXT,
  bank_account TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create machinery_listings table for machinery owners
CREATE TABLE public.machinery_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  owner_name TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  machinery_type TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year_of_purchase INTEGER,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  pincode TEXT,
  hourly_rate INTEGER NOT NULL,
  daily_rate INTEGER NOT NULL,
  availability BOOLEAN DEFAULT true,
  description TEXT,
  fuel_type TEXT,
  horsepower INTEGER,
  working_width NUMERIC,
  machinery_images TEXT[],
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create machinery_requirements table for farmers needing machinery
CREATE TABLE public.machinery_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  farmer_name TEXT NOT NULL,
  farmer_phone TEXT NOT NULL,
  required_machinery_type TEXT NOT NULL,
  preferred_brand TEXT,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  required_date DATE NOT NULL,
  duration_hours INTEGER,
  duration_days INTEGER,
  max_hourly_rate INTEGER,
  max_daily_rate INTEGER,
  specific_requirements TEXT,
  urgent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_requirements table for farmers needing laborers
CREATE TABLE public.job_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  farmer_name TEXT NOT NULL,
  farmer_phone TEXT NOT NULL,
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  job_location TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  number_of_workers INTEGER DEFAULT 1,
  offered_wage INTEGER NOT NULL,
  job_description TEXT NOT NULL,
  urgent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily_schedules table for crop planning
CREATE TABLE public.daily_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  farmer_name TEXT NOT NULL,
  crop_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  schedule_data JSONB NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  soil_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weather_alerts table for real-time weather data
CREATE TABLE public.weather_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  weather_data JSONB NOT NULL,
  alert_type TEXT,
  severity TEXT,
  message TEXT,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.job_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machinery_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machinery_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_profiles
CREATE POLICY "Job profiles are viewable by everyone" 
ON public.job_profiles FOR SELECT USING (true);

CREATE POLICY "Users can create their own job profile" 
ON public.job_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job profile" 
ON public.job_profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for machinery_listings
CREATE POLICY "Machinery listings are viewable by everyone" 
ON public.machinery_listings FOR SELECT USING (true);

CREATE POLICY "Users can create their own machinery listing" 
ON public.machinery_listings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own machinery listing" 
ON public.machinery_listings FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for machinery_requirements
CREATE POLICY "Machinery requirements are viewable by everyone" 
ON public.machinery_requirements FOR SELECT USING (true);

CREATE POLICY "Users can create their own machinery requirement" 
ON public.machinery_requirements FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own machinery requirement" 
ON public.machinery_requirements FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for job_requirements
CREATE POLICY "Job requirements are viewable by everyone" 
ON public.job_requirements FOR SELECT USING (true);

CREATE POLICY "Users can create their own job requirement" 
ON public.job_requirements FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job requirement" 
ON public.job_requirements FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for daily_schedules
CREATE POLICY "Users can view their own schedules" 
ON public.daily_schedules FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own schedules" 
ON public.daily_schedules FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedules" 
ON public.daily_schedules FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for weather_alerts
CREATE POLICY "Weather alerts are viewable by everyone" 
ON public.weather_alerts FOR SELECT USING (true);

CREATE POLICY "System can insert weather alerts" 
ON public.weather_alerts FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update weather alerts" 
ON public.weather_alerts FOR UPDATE USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_job_profiles_updated_at
BEFORE UPDATE ON public.job_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_machinery_listings_updated_at
BEFORE UPDATE ON public.machinery_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_machinery_requirements_updated_at
BEFORE UPDATE ON public.machinery_requirements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_requirements_updated_at
BEFORE UPDATE ON public.job_requirements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_schedules_updated_at
BEFORE UPDATE ON public.daily_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();