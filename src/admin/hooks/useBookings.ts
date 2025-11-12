import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useBookings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles!guest_id(full_name, avatar_url),
          properties(title, images)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform the data to match expected structure with proper typing
      const transformedData = data?.map((booking: any) => ({
        ...booking,
        guest: booking.profiles,
        property: booking.properties
      }));
      
      return transformedData || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "pending" | "confirmed" | "cancelled" | "completed" }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast({ title: "Booking updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update booking", variant: "destructive" });
    },
  });

  const createRefund = useMutation({
    mutationFn: async (refundData: {
      booking_id: string;
      amount: number;
      reason: string;
      refund_method: string;
      notes?: string;
    }) => {
      const { error } = await supabase
        .from("refunds")
        .insert({
          ...refundData,
          requested_by: (await supabase.auth.getUser()).data.user?.id,
          status: "approved",
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast({ title: "Refund processed successfully" });
    },
    onError: () => {
      toast({ title: "Failed to process refund", variant: "destructive" });
    },
  });

  return {
    bookings: bookings || [],
    isLoading,
    updateStatus: updateStatus.mutate,
    createRefund: createRefund.mutate,
  };
}
