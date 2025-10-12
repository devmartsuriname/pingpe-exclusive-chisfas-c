import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export default function PartnerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: partner, isLoading } = useQuery({
    queryKey: ["partner", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select(`
          *,
          partner_bookings(
            id,
            commission_amount,
            commission_paid,
            commission_paid_date,
            booking:bookings(
              id,
              check_in,
              total_price,
              property:properties(title)
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading partner details...</div>;
  }

  if (!partner) {
    return <div>Partner not found</div>;
  }

  const totalEarnings = partner.partner_bookings?.reduce(
    (sum: number, pb: any) => sum + Number(pb.commission_amount),
    0
  ) || 0;

  const paidEarnings = partner.partner_bookings
    ?.filter((pb: any) => pb.commission_paid)
    .reduce((sum: number, pb: any) => sum + Number(pb.commission_amount), 0) || 0;

  const unpaidEarnings = totalEarnings - paidEarnings;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/admin/partners")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{partner.name}</h1>
          <p className="text-muted-foreground">Partner Details</p>
        </div>
        <Badge className="ml-auto" variant={partner.is_active ? "default" : "secondary"}>
          {partner.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">${paidEarnings.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Unpaid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">${unpaidEarnings.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Contact Name</p>
            <p className="font-medium">{partner.contact_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{partner.contact_email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{partner.contact_phone || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Commission Rate</p>
            <p className="font-medium">{partner.commission_rate}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium">{partner.address || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {partner.partner_bookings?.map((pb: any) => (
              <div key={pb.id} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">{pb.booking?.property?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(pb.booking?.check_in), "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${pb.commission_amount}</p>
                  <Badge variant={pb.commission_paid ? "default" : "secondary"}>
                    {pb.commission_paid ? "Paid" : "Unpaid"}
                  </Badge>
                </div>
              </div>
            )) || <p className="text-muted-foreground">No commission history</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
