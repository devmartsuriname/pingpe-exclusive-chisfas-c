import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EmailProviderSelector from "@/admin/components/settings/EmailProviderSelector";
import HostingerSmtpConfigForm from "@/admin/components/settings/HostingerSmtpConfigForm";
import ResendConfigForm from "@/admin/components/settings/ResendConfigForm";

export default function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Email Configuration</h2>
        <p className="text-muted-foreground">Configure email delivery for notifications and transactional emails</p>
      </div>

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
    </div>
  );
}
