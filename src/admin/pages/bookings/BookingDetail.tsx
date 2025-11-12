import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useBookings } from "@/admin/hooks/useBookings";
import { RefundDialog } from "@/admin/components/dialogs/RefundDialog";
import { format } from "date-fns";

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateStatus, createRefund } = useBookings();
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles!guest_id(full_name, avatar_url, user_id),
          properties(title, images, city, country, price_per_night)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      
      // Fetch guest contact info separately (admin can see it)
      const guestUserId = (data as any).profiles?.user_id;
      let guestPhone = null;
      
      if (guestUserId) {
        const { data: contactData } = await supabase
          .from("user_contact_info")
          .select("phone")
          .eq("user_id", guestUserId)
          .maybeSingle();
        
        guestPhone = contactData?.phone || null;
      }
      
      // Transform the data to match expected structure with proper typing
      const transformedData: any = {
        ...data,
        guest: {
          ...(data as any).profiles,
          phone: guestPhone,
        },
        property: (data as any).properties
      };
      
      return transformedData;
    },
  });

  if (isLoading) {
    return <div>Loading booking details...</div>;
  }

  if (!booking) {
    return <div>Booking not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/admin/bookings")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Details</h1>
          <p className="text-muted-foreground">ID: {booking.id}</p>
        </div>
        <Badge className="ml-auto">{booking.status}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Booking Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Check-in</p>
              <p className="font-medium">{format(new Date(booking.check_in), "MMMM dd, yyyy")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check-out</p>
              <p className="font-medium">{format(new Date(booking.check_out), "MMMM dd, yyyy")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Guests</p>
              <p className="font-medium">{booking.guests}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Price</p>
              <p className="font-medium text-lg">${booking.total_price}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guest Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              {booking.guest?.avatar_url && (
                <img
                  src={booking.guest.avatar_url}
                  alt={booking.guest.full_name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium">{booking.guest?.full_name || "N/A"}</p>
                <p className="text-sm text-muted-foreground">{booking.guest?.phone || "No phone"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Listing Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              {booking.property?.images?.[0] && (
                <img
                  src={booking.property.images[0]}
                  alt={booking.property.title}
                  className="h-24 w-32 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="font-medium text-lg">{booking.property?.title}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.property?.city}, {booking.property?.country}
                </p>
                <p className="text-sm mt-2">
                  ${booking.property?.price_per_night}/night
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          {booking.status === "pending" && (
            <Button onClick={() => updateStatus({ id: booking.id, status: "confirmed" })}>
              Approve Booking
            </Button>
          )}
          {booking.status === "confirmed" && (
            <Button onClick={() => updateStatus({ id: booking.id, status: "completed" })}>
              Mark as Completed
            </Button>
          )}
          {(booking.status === "pending" || booking.status === "confirmed") && (
            <>
              <Button
                variant="destructive"
                onClick={() => updateStatus({ id: booking.id, status: "cancelled" })}
              >
                Cancel Booking
              </Button>
              <Button variant="outline" onClick={() => setRefundDialogOpen(true)}>
                Process Refund
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <RefundDialog
        open={refundDialogOpen}
        onOpenChange={setRefundDialogOpen}
        maxAmount={Number(booking.total_price)}
        onSubmit={(data) => {
          createRefund({
            booking_id: booking.id,
            amount: data.amount,
            reason: data.reason,
            refund_method: data.refund_method,
            notes: data.notes,
          });
          setRefundDialogOpen(false);
        }}
      />
    </div>
  );
}
