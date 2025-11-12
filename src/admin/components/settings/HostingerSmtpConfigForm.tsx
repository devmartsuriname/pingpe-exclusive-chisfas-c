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

const schema = z.object({
  enabled: z.boolean(),
  smtp_host: z.string().min(1, "SMTP host is required"),
  smtp_port: z.string().regex(/^\d+$/, "Port must be a number"),
  smtp_username: z.string().min(1, "Username is required"),
  smtp_password: z.string().min(1, "Password is required"),
  smtp_secure: z.boolean(),
  from_name: z.string().min(1, "From name is required"),
  from_email: z.string().email("Must be a valid email"),
  reply_to: z.string().email("Must be a valid email").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export default function HostingerSmtpConfigForm() {
  const { settings, getSetting, updateSetting, updateSettingAsync, isUpdating } = useSettings();
  const [isTesting, setIsTesting] = useState(false);
  const [isTogglingEnabled, setIsTogglingEnabled] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      enabled: false,
      smtp_host: "smtp.hostinger.com",
      smtp_port: "465",
      smtp_username: "",
      smtp_password: "",
      smtp_secure: true,
      from_name: "Jungle Resort PingPe",
      from_email: "",
      reply_to: "",
    },
  });

  const isEnabled = form.watch("enabled");

  useEffect(() => {
    if (!settings) return;

    const enabled = getSetting("email_hostinger_enabled");
    const host = getSetting("email_hostinger_smtp_host");
    const port = getSetting("email_hostinger_smtp_port");
    const username = getSetting("email_hostinger_smtp_username");
    const password = getSetting("email_hostinger_smtp_password");
    const secure = getSetting("email_hostinger_smtp_secure");
    const fromName = getSetting("email_hostinger_from_name");
    const fromEmail = getSetting("email_hostinger_from_email");
    const replyTo = getSetting("email_hostinger_reply_to");

    if (enabled !== undefined) form.setValue("enabled", enabled.value);
    if (host) form.setValue("smtp_host", host.value);
    if (port) form.setValue("smtp_port", String(port.value));
    if (username) form.setValue("smtp_username", username.value);
    if (password) form.setValue("smtp_password", password.value);
    if (secure !== undefined) form.setValue("smtp_secure", secure.value);
    if (fromName) form.setValue("from_name", fromName.value);
    if (fromEmail) form.setValue("from_email", fromEmail.value);
    if (replyTo) form.setValue("reply_to", replyTo.value || "");
  }, [settings, getSetting, form]);

  const onSubmit = (data: FormData) => {
    updateSetting({ key: "email_hostinger_enabled", value: data.enabled, description: "Hostinger SMTP Enabled" });
    updateSetting({ key: "email_hostinger_smtp_host", value: data.smtp_host, description: "Hostinger SMTP Host" });
    updateSetting({ key: "email_hostinger_smtp_port", value: parseInt(data.smtp_port), description: "Hostinger SMTP Port" });
    updateSetting({ key: "email_hostinger_smtp_username", value: data.smtp_username, description: "Hostinger SMTP Username (Encrypted)" });
    updateSetting({ key: "email_hostinger_smtp_password", value: data.smtp_password, description: "Hostinger SMTP Password (Encrypted)" });
    updateSetting({ key: "email_hostinger_smtp_secure", value: data.smtp_secure, description: "Hostinger SMTP Use SSL/TLS" });
    updateSetting({ key: "email_hostinger_from_name", value: data.from_name, description: "Hostinger From Name" });
    updateSetting({ key: "email_hostinger_from_email", value: data.from_email, description: "Hostinger From Email" });
    updateSetting({ key: "email_hostinger_reply_to", value: data.reply_to || null, description: "Hostinger Reply-To Email" });
  };

  const handleToggleChange = async (checked: boolean) => {
    const previousValue = form.getValues("enabled");
    setIsTogglingEnabled(true);
    
    try {
      // Update form state immediately for responsive UI
      form.setValue("enabled", checked, { shouldDirty: false });
      
      // Persist to database (toast handled by useSettings hook)
      await updateSettingAsync({ 
        key: "email_hostinger_enabled", 
        value: checked, 
        description: "Hostinger SMTP Enabled" 
      });
    } catch (error: any) {
      // Revert on failure (error toast already shown by useSettings hook)
      form.setValue("enabled", previousValue);
    } finally {
      setIsTogglingEnabled(false);
    }
  };

  const handleTestEmail = async () => {
    setIsTesting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) {
        throw new Error("No user email found");
      }

      const { data, error } = await supabase.functions.invoke('test-email-v2', {
        body: {
          to: user.email,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({
        title: "Test Email Sent!",
        description: `Hostinger SMTP test email sent to ${user.email}`,
      });
    } catch (error: any) {
      console.error('Test email error:', error);
      toast({
        title: "Test Email Failed",
        description: error.message || "Failed to send test email",
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
                <FormLabel className="text-base">Enable Hostinger SMTP</FormLabel>
                <FormDescription>
                  Use Hostinger SMTP server for sending emails
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={handleToggleChange}
                  disabled={isTogglingEnabled}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Get your SMTP credentials from your Hostinger hosting panel under Email → Email Accounts.
            Default host is <code className="font-mono">smtp.hostinger.com</code> with port 465 (SSL).
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="smtp_host"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SMTP Host *</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEnabled} placeholder="smtp.hostinger.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="smtp_port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEnabled} placeholder="465" />
                  </FormControl>
                  <FormDescription>465 (SSL) or 587 (TLS)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="smtp_secure"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Use SSL/TLS</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isEnabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="smtp_username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SMTP Username *</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEnabled} placeholder="noreply@yourdomain.com" />
                </FormControl>
                <FormDescription>Usually your full email address</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="smtp_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SMTP Password *</FormLabel>
                <FormControl>
                  <Input {...field} type="password" disabled={!isEnabled} autoComplete="off" />
                </FormControl>
                <FormDescription>Your email account password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="from_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Name *</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEnabled} placeholder="Jungle Resort PingPe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="from_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Email *</FormLabel>
                <FormControl>
                  <Input {...field} type="email" disabled={!isEnabled} placeholder="noreply@yourdomain.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reply_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reply-To Email (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} type="email" disabled={!isEnabled} placeholder="support@yourdomain.com" />
                </FormControl>
                <FormDescription>Email address for customer replies</FormDescription>
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
