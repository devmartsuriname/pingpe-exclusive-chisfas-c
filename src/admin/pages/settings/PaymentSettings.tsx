import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StripeConfigForm from "@/admin/components/settings/StripeConfigForm";

export default function PaymentSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payment Settings</h2>
        <p className="text-muted-foreground">Configure payment gateways and processing options</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stripe Configuration</CardTitle>
          <CardDescription>
            Configure your Stripe payment gateway. All keys are stored securely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StripeConfigForm />
        </CardContent>
      </Card>
    </div>
  );
}
