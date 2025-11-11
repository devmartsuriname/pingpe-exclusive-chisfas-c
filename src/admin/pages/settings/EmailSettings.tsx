import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HostingerSmtpConfigForm from "@/admin/components/settings/HostingerSmtpConfigForm";

export default function EmailSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
          <CardDescription>
            Configure email delivery using Hostinger SMTP. All booking confirmations, payment receipts, 
            and system notifications will be sent through this provider.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HostingerSmtpConfigForm />
        </CardContent>
      </Card>
    </div>
  );
}
