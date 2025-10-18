import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, CheckCircle2, XCircle, Send } from "lucide-react";
import { useSettings } from "@/admin/hooks/useSettings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const resendConfigSchema = z.object({
  resend_api_key: z.string().min(1, "API key is required").startsWith("re_", "Must be a valid Resend API key"),
  resend_sender_email: z.string().email("Must be a valid email address"),
  resend_sender_name: z.string().min(1, "Sender name is required"),
});

type ResendConfigFormData = z.infer<typeof resendConfigSchema>;

export default function ResendConfigForm() {
  const { getSetting, updateSetting, isUpdating } = useSettings();
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ResendConfigFormData>({
    resolver: zodResolver(resendConfigSchema),
    defaultValues: {
      resend_api_key: "",
      resend_sender_email: "noreply@jungleresortpingpe.com",
      resend_sender_name: "Jungle Resort PingPe",
    },
  });

  useEffect(() => {
    const apiKey = getSetting("resend_api_key");
    const senderEmail = getSetting("resend_sender_email");
    const senderName = getSetting("resend_sender_name");

    // Check if Resend is configured
    const configured = !!(apiKey?.value);
    setIsConfigured(configured);

    if (apiKey) form.setValue("resend_api_key", apiKey.value);
    if (senderEmail) form.setValue("resend_sender_email", senderEmail.value);
    if (senderName) form.setValue("resend_sender_name", senderName.value);
  }, [getSetting, form]);

  const onSubmit = (data: ResendConfigFormData) => {
    updateSetting({ key: "resend_api_key", value: data.resend_api_key, description: "Resend API Key (Encrypted)" });
    updateSetting({ key: "resend_sender_email", value: data.resend_sender_email, description: "Default Sender Email" });
    updateSetting({ key: "resend_sender_name", value: data.resend_sender_name, description: "Default Sender Name" });
  };

  const handleTestEmail = async () => {
    setIsTesting(true);
    try {
      // Get current user email
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) {
        throw new Error("No user email found");
      }

      // Call send-email function with test template
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: user.email,
          template: 'test',
          data: {},
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Test Email Sent!",
        description: `Check ${user.email} for the test email.`,
      });
    } catch (error: any) {
      console.error('Test email error:', error);
      toast({
        title: "Test Email Failed",
        description: error.message || "Failed to send test email. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Configuration Status Alert */}
        <Alert variant={isConfigured ? "default" : "destructive"}>
          <div className="flex items-start gap-3">
            {isConfigured ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive mt-0.5" />
            )}
            <div className="flex-1">
              <AlertDescription>
                {isConfigured ? (
                  <>
                    <strong>Resend is configured and active.</strong>
                    <br />
                    Email notifications are enabled. Update settings below to modify configuration.
                  </>
                ) : (
                  <>
                    <strong>Email service is not configured.</strong>
                    <br />
                    Enter your Resend API key below to enable email notifications. Keys are stored securely in Supabase.
                  </>
                )}
              </AlertDescription>
            </div>
          </div>
        </Alert>

        {/* Help Text */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Get your Resend API key from{" "}
            <a
              href="https://resend.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              Resend Dashboard
            </a>
            . Don't forget to verify your sending domain at{" "}
            <a
              href="https://resend.com/domains"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              Resend Domains
            </a>
            .
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="resend_api_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resend API Key *</FormLabel>
              <FormControl>
                <Input 
                  type="password"
                  placeholder="re_..." 
                  {...field} 
                  className="font-mono text-sm"
                  autoComplete="off"
                />
              </FormControl>
              <FormDescription>
                Your Resend API key (starts with re_)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resend_sender_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sender Email Address *</FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  placeholder="noreply@jungleresortpingpe.com" 
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The email address that will appear as the sender (must be verified in Resend)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resend_sender_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sender Name *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Jungle Resort PingPe" 
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The name that will appear as the sender (e.g., "Jungle Resort PingPe")
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Saving..." : isConfigured ? "Update Configuration" : "Save Configuration"}
          </Button>
          
          {isConfigured && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleTestEmail}
              disabled={isTesting}
            >
              <Send className="w-4 h-4 mr-2" />
              {isTesting ? "Sending..." : "Send Test Email"}
            </Button>
          )}
          
          {isConfigured && (
            <span className="text-sm text-muted-foreground">
              ✓ Email service enabled
            </span>
          )}
        </div>
      </form>
    </Form>
  );
}
