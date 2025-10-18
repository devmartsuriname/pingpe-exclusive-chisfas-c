import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResendConfigForm from "@/admin/components/settings/ResendConfigForm";

export default function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Integration Settings</h2>
        <p className="text-muted-foreground">Configure third-party services and integrations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications (Resend)</CardTitle>
          <CardDescription>
            Configure email delivery for booking confirmations, payment receipts, and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResendConfigForm />
        </CardContent>
      </Card>
    </div>
  );
}
