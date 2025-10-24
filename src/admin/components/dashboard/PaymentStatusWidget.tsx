import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/admin/hooks/useSettings";
import { CreditCard, CheckCircle, XCircle, AlertCircle, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentStatusWidget() {
  const { getSetting } = useSettings();
  const navigate = useNavigate();

  const paymentProvider = getSetting("payment_primary_provider")?.value || "wise";
  const wiseEnabled = getSetting("payment_wise_enabled")?.value || false;
  const paypalEnabled = getSetting("payment_paypal_enabled")?.value || false;

  // Determine overall status
  const isConfigured = 
    (paymentProvider === "wise" && wiseEnabled) ||
    (paymentProvider === "paypal" && paypalEnabled);

  const getStatusIcon = () => {
    if (isConfigured) {
      return <CheckCircle className="h-5 w-5 text-success" />;
    }
    return <XCircle className="h-5 w-5 text-destructive" />;
  };

  const getStatusBadge = () => {
    if (isConfigured) {
      return <Badge variant="default" className="bg-success">Active</Badge>;
    }
    return <Badge variant="destructive">Not Configured</Badge>;
  };

  const getProviderDisplay = () => {
    if (paymentProvider === "wise") {
      return "Wise";
    } else if (paymentProvider === "paypal") {
      return "PayPal";
    }
    return "None";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Payment Service</CardTitle>
        </div>
        {getStatusIcon()}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-2xl font-bold">{getProviderDisplay()}</p>
            <p className="text-xs text-muted-foreground">Active Provider</p>
          </div>

          <div className="flex items-center justify-between">
            {getStatusBadge()}
          </div>

          {!isConfigured && (
            <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
              <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
              <p className="text-xs text-warning">
                Payment service is not configured. Bookings will require manual payment approval.
              </p>
            </div>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => navigate("/admin/settings/integrations")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure Payments
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
