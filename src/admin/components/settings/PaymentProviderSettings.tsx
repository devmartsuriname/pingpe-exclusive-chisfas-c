import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import WiseConfigForm from "./WiseConfigForm";
import PayPalConfigForm from "./PayPalConfigForm";
import PaymentProviderSelector from "./PaymentProviderSelector";

export default function PaymentProviderSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payment Configuration</h2>
        <p className="text-muted-foreground">Configure payment methods for bookings and transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Provider Selection</CardTitle>
          <CardDescription>
            Choose your primary payment provider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentProviderSelector />
        </CardContent>
      </Card>

      <Tabs defaultValue="wise" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wise">Wise</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
          <TabsTrigger value="stripe">Stripe (Coming Soon)</TabsTrigger>
        </TabsList>

        <TabsContent value="wise" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wise Bank Transfer</CardTitle>
              <CardDescription>
                Configure Wise for manual bank transfers (recommended for Suriname)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WiseConfigForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paypal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>PayPal Integration</CardTitle>
              <CardDescription>
                Configure PayPal for instant online payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PayPalConfigForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stripe" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stripe Integration</CardTitle>
              <CardDescription>
                Stripe integration coming soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Stripe payment integration is planned for a future release. For now, please use Wise or PayPal.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
