-- Create wallet table for commission tracking
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- Users can view their own wallet
CREATE POLICY "Users can view their own wallet"
ON public.wallets FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can update their own wallet (for deposits)
CREATE POLICY "Users can update their own wallet"
ON public.wallets FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own wallet
CREATE POLICY "Users can create their own wallet"
ON public.wallets FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create transactions table for payment tracking
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('machinery', 'labor')),
  payer_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  commission DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('online', 'cash', 'wallet')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_ref TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view their own transactions"
ON public.transactions FOR SELECT
TO authenticated
USING (auth.uid() = payer_id OR auth.uid() = receiver_id);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking_request', 'booking_accepted', 'booking_rejected', 'booking_completed', 'payment_received', 'payment_pending', 'rating_received')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- System can create notifications
CREATE POLICY "System can create notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add work tracking fields to machinery_bookings
ALTER TABLE public.machinery_bookings
ADD COLUMN IF NOT EXISTS work_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS work_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS work_location_lat DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS work_location_lng DECIMAL(11,8),
ADD COLUMN IF NOT EXISTS commission_percentage DECIMAL(5,2) DEFAULT 10.00,
ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS final_amount DECIMAL(10,2);

-- Add work tracking fields to labor_bookings
ALTER TABLE public.labor_bookings
ADD COLUMN IF NOT EXISTS work_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS work_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS work_location_lat DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS work_location_lng DECIMAL(11,8),
ADD COLUMN IF NOT EXISTS commission_percentage DECIMAL(5,2) DEFAULT 10.00,
ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS final_amount DECIMAL(10,2);

-- Create trigger for updating wallets timestamp
CREATE TRIGGER update_wallets_updated_at
BEFORE UPDATE ON public.wallets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Enable realtime for machinery_bookings
ALTER TABLE public.machinery_bookings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.machinery_bookings;

-- Enable realtime for labor_bookings
ALTER TABLE public.labor_bookings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.labor_bookings;