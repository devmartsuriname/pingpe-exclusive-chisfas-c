import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import EmailProviderSelector from "@/admin/components/settings/EmailProviderSelector";
import HostingerSmtpConfigForm from "@/admin/components/settings/HostingerSmtpConfigForm";
import ResendConfigForm from "@/admin/components/settings/ResendConfigForm";
import PaymentProviderSelectorNew from "@/admin/components/settings/PaymentProviderSelectorNew";
import WiseConfigForm from "@/admin/components/settings/WiseConfigForm";
import PayPalConfigForm from "@/admin/components/settings/PayPalConfigForm";

export default function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Integration Settings</h2>
        <p className="text-muted-foreground">Configure email and payment providers</p>
      </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-6 mt-6">

      <Card>
        <CardHeader>
          <CardTitle>Email Provider Selection</CardTitle>
          <CardDescription>
            Choose your primary email provider and configure settings below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmailProviderSelector />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hostinger SMTP</CardTitle>
          <CardDescription>
            Configure Hostinger SMTP server for email delivery (recommended for production)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HostingerSmtpConfigForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resend API</CardTitle>
          <CardDescription>
            Configure Resend API as an alternative email provider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResendConfigForm />
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Provider Selection</CardTitle>
              <CardDescription>
                Choose your primary payment provider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentProviderSelectorNew />
            </CardContent>
          </Card>

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
      </Tabs>
    </div>
  );
}
