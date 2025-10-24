import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/admin/hooks/useSettings";
import { Mail, CheckCircle, XCircle, AlertCircle, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmailStatusWidget() {
  const { getSetting } = useSettings();
  const navigate = useNavigate();

  const emailProvider = getSetting("email_provider")?.value || "hostinger";
  const hostingerEnabled = getSetting("email_hostinger_enabled")?.value || false;
  const resendEnabled = getSetting("email_resend_enabled")?.value || false;

  // Determine overall status
  const isConfigured = 
    (emailProvider === "hostinger" && hostingerEnabled) ||
    (emailProvider === "resend" && resendEnabled);

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
    if (emailProvider === "hostinger") {
      return "Hostinger SMTP";
    } else if (emailProvider === "resend") {
      return "Resend API";
    }
    return "None";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Email Service</CardTitle>
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
                Email service is not configured. Transactional emails will not be sent.
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
            Configure Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
