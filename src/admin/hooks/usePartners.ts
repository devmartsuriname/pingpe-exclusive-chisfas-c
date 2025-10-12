import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function usePartners() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: partners, isLoading } = useQuery({
    queryKey: ["admin-partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select(`
          *,
          partner_bookings(
            commission_amount,
            commission_paid
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createPartner = useMutation({
    mutationFn: async (partner: any) => {
      const { error } = await supabase.from("partners").insert(partner);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
      toast({ title: "Partner created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create partner", variant: "destructive" });
    },
  });

  const updatePartner = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from("partners")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
      toast({ title: "Partner updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update partner", variant: "destructive" });
    },
  });

  return {
    partners: partners || [],
    isLoading,
    createPartner: createPartner.mutate,
    updatePartner: updatePartner.mutate,
  };
}
