import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Check, X, MapPin, DollarSign, Clock, User, Calendar,
  Loader2, Navigation, CreditCard, Star
} from "lucide-react";

interface BookingFlowProps {
  bookingId: string;
  bookingType: "machinery" | "labor";
  userRole: "farmer" | "provider";
  onClose: () => void;
}

export const BookingFlow = ({ bookingId, bookingType, userRole, onClose }: BookingFlowProps) => {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash">("online");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const table = bookingType === "machinery" ? "machinery_bookings" : "labor_bookings";
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", bookingId)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (error) {
      console.error("Error fetching booking:", error);
      toast({
        title: "Error",
        description: "Failed to load booking details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setProcessing(true);
    try {
      const table = bookingType === "machinery" ? "machinery_bookings" : "labor_bookings";
      const { error } = await supabase
        .from(table)
        .update({ 
          status: "confirmed",
          [`${userRole === "provider" ? "owner" : "farmer"}_notes`]: notes
        })
        .eq("id", bookingId);

      if (error) throw error;

      // Create notification for farmer
      await supabase.from("notifications").insert({
        user_id: booking.farmer_id,
        type: "booking_confirmed",
        title: "Booking Confirmed",
        message: `Your ${bookingType} booking has been confirmed`,
        data: { booking_id: bookingId }
      });

      toast({
        title: "Booking Confirmed",
        description: "The booking has been accepted successfully"
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept booking",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      const table = bookingType === "machinery" ? "machinery_bookings" : "labor_bookings";
      const { error } = await supabase
        .from(table)
        .update({ 
          status: "cancelled",
          [`${userRole === "provider" ? "owner" : "farmer"}_notes`]: notes
        })
        .eq("id", bookingId);

      if (error) throw error;

      // Create notification for farmer
      await supabase.from("notifications").insert({
        user_id: booking.farmer_id,
        type: "booking_cancelled",
        title: "Booking Cancelled",
        message: `Your ${bookingType} booking has been cancelled`,
        data: { booking_id: bookingId }
      });

      toast({
        title: "Booking Rejected",
        description: "The booking has been rejected"
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject booking",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Failed to get current location",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleStartWork = async () => {
    setProcessing(true);
    getCurrentLocation();
    
    try {
      const table = bookingType === "machinery" ? "machinery_bookings" : "labor_bookings";
      const { error } = await supabase
        .from(table)
        .update({ 
          status: "in_progress",
          work_started_at: new Date().toISOString(),
          work_location_lat: location?.lat,
          work_location_lng: location?.lng
        })
        .eq("id", bookingId);

      if (error) throw error;

      // Create notification
      await supabase.from("notifications").insert({
        user_id: booking.farmer_id,
        type: "work_started",
        title: "Work Started",
        message: `Work has started for your ${bookingType} booking`,
        data: { booking_id: bookingId }
      });

      toast({
        title: "Work Started",
        description: "Work tracking has been initiated"
      });
      
      fetchBooking();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start work",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCompleteWork = async () => {
    setProcessing(true);
    
    try {
      const table = bookingType === "machinery" ? "machinery_bookings" : "labor_bookings";
      
      // Calculate final amount with commission
      const totalAmount = booking.total_amount || booking.offered_wage;
      const commissionAmount = totalAmount * (booking.commission_percentage / 100);
      const finalAmount = totalAmount - commissionAmount;

      const { error } = await supabase
        .from(table)
        .update({ 
          status: "completed",
          work_completed_at: new Date().toISOString(),
          commission_amount: commissionAmount,
          final_amount: finalAmount,
          payment_status: "pending"
        })
        .eq("id", bookingId);

      if (error) throw error;

      // Create notification
      await supabase.from("notifications").insert({
        user_id: booking.farmer_id,
        type: "work_completed",
        title: "Work Completed",
        message: `Work completed. Please proceed with payment of ₹${totalAmount}`,
        data: { booking_id: bookingId }
      });

      toast({
        title: "Work Completed",
        description: "Please proceed with payment"
      });
      
      fetchBooking();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete work",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      const totalAmount = booking.total_amount || booking.offered_wage;
      const table = bookingType === "machinery" ? "machinery_bookings" : "labor_bookings";

      // Update booking payment status
      const { error: bookingError } = await supabase
        .from(table)
        .update({ 
          payment_status: paymentMethod === "online" ? "paid" : "cash_collected",
          status: "completed"
        })
        .eq("id", bookingId);

      if (bookingError) throw bookingError;

      // Resolve provider user id
      let providerUserId: string | null = null;
      if (bookingType === "machinery") {
        const { data: mp, error: mpError } = await supabase
          .from("machinery_profiles")
          .select("owner_id")
          .eq("id", booking.machinery_id)
          .maybeSingle();
        if (mpError) throw mpError;
        providerUserId = mp?.owner_id ?? null;
      } else {
        const { data: lp, error: lpError } = await supabase
          .from("labor_profiles")
          .select("user_id")
          .eq("id", booking.labor_id)
          .maybeSingle();
        if (lpError) throw lpError;
        providerUserId = lp?.user_id ?? null;
      }
      if (!providerUserId) {
        throw new Error("Provider user not found");
      }

      // Create transaction record
      const { error: txError } = await supabase
        .from("transactions")
        .insert({
          booking_id: bookingId,
          payer_id: booking.farmer_id,
          receiver_id: providerUserId,
          amount: totalAmount,
          commission: booking.commission_amount,
          booking_type: bookingType,
          payment_method: paymentMethod,
          status: paymentMethod === "online" ? "completed" : "pending_settlement",
          completed_at: paymentMethod === "online" ? new Date().toISOString() : null
        });

      if (txError) throw txError;

      // Create notification for provider
      await supabase.from("notifications").insert({
        user_id: providerUserId,
        type: "payment_received",
        title: "Payment Received",
        message: `Payment of ₹${booking.final_amount} received for booking`,
        data: { booking_id: bookingId }
      });

      toast({
        title: "Payment Successful",
        description: paymentMethod === "online" 
          ? "Payment has been processed successfully"
          : "Cash payment marked. Commission will be deducted from next booking"
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge variant={
              booking.status === "pending" ? "secondary" :
              booking.status === "confirmed" ? "default" :
              booking.status === "in_progress" ? "secondary" :
              booking.status === "completed" ? "default" :
              "destructive"
            } className={
              booking.status === "completed" ? "bg-green-500 text-white" :
              booking.status === "in_progress" ? "bg-yellow-500 text-white" :
              ""
            }>
              {booking.status.replace("_", " ").toUpperCase()}
            </Badge>
            
            {booking.payment_status && (
              <Badge 
                variant={booking.payment_status === "paid" ? "default" : "secondary"}
                className={booking.payment_status === "paid" ? "bg-green-500 text-white" : ""}
              >
                Payment: {booking.payment_status}
              </Badge>
            )}
          </div>

          {/* Booking Info */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date(booking.start_date).toLocaleDateString()} - {booking.end_date && new Date(booking.end_date).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{booking.location}, {booking.district}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold">
                  Total: ₹{booking.total_amount || booking.offered_wage}
                  {booking.commission_amount && ` (Commission: ₹${booking.commission_amount})`}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Provider Actions - Pending Status */}
          {userRole === "provider" && booking.status === "pending" && (
            <div className="space-y-3">
              <Textarea
                placeholder="Add notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={handleAccept}
                  disabled={processing}
                  className="flex-1"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Accept Booking
                </Button>
                
                <Button
                  onClick={handleReject}
                  disabled={processing}
                  variant="destructive"
                  className="flex-1"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                  Reject
                </Button>
              </div>
            </div>
          )}

          {/* Provider Actions - Confirmed Status */}
          {userRole === "provider" && booking.status === "confirmed" && (
            <Button onClick={handleStartWork} disabled={processing} className="w-full">
              {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Navigation className="w-4 h-4 mr-2" />}
              Start Work
            </Button>
          )}

          {/* Provider Actions - In Progress Status */}
          {userRole === "provider" && booking.status === "in_progress" && (
            <Button onClick={handleCompleteWork} disabled={processing} className="w-full">
              {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
              Complete Work
            </Button>
          )}

          {/* Farmer Actions - Completed Status (Payment) */}
          {userRole === "farmer" && booking.status === "completed" && booking.payment_status === "pending" && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant={paymentMethod === "online" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("online")}
                  className="flex-1"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Online Payment
                </Button>
                
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("cash")}
                  className="flex-1"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Cash Payment
                </Button>
              </div>

              <Button onClick={handlePayment} disabled={processing} className="w-full">
                {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Confirm Payment (₹{booking.total_amount || booking.offered_wage})
              </Button>
            </div>
          )}

          {/* Work Tracking Info */}
          {booking.work_started_at && (
            <Card className="bg-muted">
              <CardHeader>
                <CardTitle className="text-sm">Work Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>Started: {new Date(booking.work_started_at).toLocaleString()}</div>
                {booking.work_completed_at && (
                  <div>Completed: {new Date(booking.work_completed_at).toLocaleString()}</div>
                )}
                {booking.work_location_lat && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Location: {booking.work_location_lat.toFixed(4)}, {booking.work_location_lng.toFixed(4)}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
