import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentProviderSelector from "@/admin/components/settings/PaymentProviderSelector";
import WiseConfigForm from "@/admin/components/settings/WiseConfigForm";
import PayPalConfigForm from "@/admin/components/settings/PayPalConfigForm";
import StripeConfigForm from "@/admin/components/settings/StripeConfigForm";
import PaymentModeToggle from "@/admin/components/settings/PaymentModeToggle";

export default function PaymentSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payment Settings</h2>
        <p className="text-muted-foreground">Configure payment gateways and processing options</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Mode</CardTitle>
          <CardDescription>
            Configure payment processing mode and testing options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentModeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Primary Payment Provider</CardTitle>
          <CardDescription>
            Choose your preferred payment method for guest bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentProviderSelector />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wise (Bank Transfer)</CardTitle>
          <CardDescription>
            Configure Wise for low-fee international bank transfers (recommended for production)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WiseConfigForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PayPal</CardTitle>
          <CardDescription>
            Configure PayPal for credit card and PayPal balance payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PayPalConfigForm />
        </CardContent>
      </Card>

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
