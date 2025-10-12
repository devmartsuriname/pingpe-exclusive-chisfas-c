import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Mail, MessageSquare, BarChart } from "lucide-react";

export default function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Integration Settings</h2>
        <p className="text-muted-foreground">View third-party integration status</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <CardTitle>Payment Gateways</CardTitle>
              </div>
              <Badge variant="outline">Configuration Required</Badge>
            </div>
            <CardDescription>
              Payment processing integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Stripe</h4>
                <p className="text-sm text-muted-foreground">Credit card and payment processing</p>
              </div>
              <Badge variant="secondary">Not Configured</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">PayPal</h4>
                <p className="text-sm text-muted-foreground">Alternative payment method</p>
              </div>
              <Badge variant="secondary">Not Configured</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Payment gateway configuration is managed via Supabase Edge Functions and environment variables.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <CardTitle>Email Service</CardTitle>
              </div>
              <Badge variant="outline">Configuration Required</Badge>
            </div>
            <CardDescription>
              Email notification delivery
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">SMTP Configuration</h4>
                <p className="text-sm text-muted-foreground">Email server for notifications</p>
              </div>
              <Badge variant="secondary">Not Configured</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure SMTP settings via Supabase Edge Functions environment variables:
              <code className="block mt-2 p-2 bg-muted rounded text-xs">
                SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
              </code>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <CardTitle>SMS Provider</CardTitle>
              </div>
              <Badge variant="outline">Optional</Badge>
            </div>
            <CardDescription>
              SMS notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">SMS Service</h4>
                <p className="text-sm text-muted-foreground">Text message notifications</p>
              </div>
              <Badge variant="secondary">Not Configured</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              SMS functionality can be added via Twilio or similar providers through Edge Functions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                <CardTitle>Analytics</CardTitle>
              </div>
              <Badge variant="outline">Optional</Badge>
            </div>
            <CardDescription>
              Usage tracking and analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Google Analytics</h4>
                <p className="text-sm text-muted-foreground">Track user behavior and conversions</p>
              </div>
              <Badge variant="secondary">Not Configured</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Add Google Analytics tracking ID to environment variables.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
