import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Send } from "lucide-react";
import { useSettings } from "@/admin/hooks/useSettings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const resendConfigSchema = z.object({
  enabled: z.boolean(),
  resend_api_key: z.string().min(1, "API key is required").startsWith("re_", "Must be a valid Resend API key"),
  resend_sender_email: z.string().email("Must be a valid email address"),
  resend_sender_name: z.string().min(1, "Sender name is required"),
});

type ResendConfigFormData = z.infer<typeof resendConfigSchema>;

export default function ResendConfigForm() {
  const { getSetting, updateSetting, isUpdating } = useSettings();
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ResendConfigFormData>({
    resolver: zodResolver(resendConfigSchema),
    defaultValues: {
      enabled: false,
      resend_api_key: "",
      resend_sender_email: "noreply@jungleresortpingpe.com",
      resend_sender_name: "Jungle Resort PingPe",
    },
  });

  const isEnabled = form.watch("enabled");

  useEffect(() => {
    const enabled = getSetting("email_resend_enabled");
    const apiKey = getSetting("resend_api_key");
    const senderEmail = getSetting("resend_sender_email");
    const senderName = getSetting("resend_sender_name");

    if (enabled) form.setValue("enabled", enabled.value);
    if (apiKey) form.setValue("resend_api_key", apiKey.value);
    if (senderEmail) form.setValue("resend_sender_email", senderEmail.value);
    if (senderName) form.setValue("resend_sender_name", senderName.value);
  }, [getSetting, form]);

  const onSubmit = (data: ResendConfigFormData) => {
    updateSetting({ key: "email_resend_enabled", value: data.enabled, description: "Resend Enabled" });
    updateSetting({ key: "resend_api_key", value: data.resend_api_key, description: "Resend API Key (Encrypted)" });
    updateSetting({ key: "resend_sender_email", value: data.resend_sender_email, description: "Resend Sender Email" });
    updateSetting({ key: "resend_sender_name", value: data.resend_sender_name, description: "Resend Sender Name" });
  };

  const handleTestEmail = async () => {
    setIsTesting(true);
    try {
      // Get current user email
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) {
        throw new Error("No user email found");
      }

      // Call test-email function
      const { data, error } = await supabase.functions.invoke('test-email', {
        body: {
          to: user.email,
          provider: 'resend',
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
        <FormField
          control={form.control}
          name="enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable Resend</FormLabel>
                <FormDescription>
                  Use Resend API for sending emails
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

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

        <div className="space-y-4">
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
                    disabled={!isEnabled}
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
                    disabled={!isEnabled}
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
                    disabled={!isEnabled}
                  />
                </FormControl>
                <FormDescription>
                  The name that will appear as the sender (e.g., "Jungle Resort PingPe")
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isUpdating || !isEnabled}>
            {isUpdating ? "Saving..." : "Save Configuration"}
          </Button>
          
          {isEnabled && (
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
        </div>
      </form>
    </Form>
  );
}
