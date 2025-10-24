import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useSettings } from "@/admin/hooks/useSettings";

const schema = z.object({
  enabled: z.boolean(),
  client_id: z.string().min(1, "Client ID is required"),
  secret: z.string().min(1, "Secret is required"),
});

type FormData = z.infer<typeof schema>;

export default function PayPalConfigForm() {
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      enabled: false,
      client_id: '',
      secret: '',
    },
  });

  const isEnabled = form.watch("enabled");

  useEffect(() => {
    const enabled = getSetting("payment_paypal_enabled");
    const clientId = getSetting("payment_paypal_client_id");
    const secret = getSetting("payment_paypal_secret");

    if (enabled) form.setValue("enabled", enabled.value);
    if (clientId) form.setValue("client_id", clientId.value);
    if (secret) form.setValue("secret", secret.value);
  }, [getSetting, form]);

  const onSubmit = (data: FormData) => {
    updateSetting({ key: "payment_paypal_enabled", value: data.enabled, description: "PayPal Enabled" });
    updateSetting({ key: "payment_paypal_client_id", value: data.client_id, description: "PayPal Client ID" });
    updateSetting({ key: "payment_paypal_secret", value: data.secret, description: "PayPal Secret (Encrypted)" });
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
                <FormLabel className="text-base">Enable PayPal</FormLabel>
                <FormDescription>
                  Accept payments via PayPal checkout
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

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Get your PayPal API credentials from the{" "}
            <a
              href="https://developer.paypal.com/dashboard/applications/live"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              PayPal Developer Dashboard
            </a>
            . Make sure to use Live credentials for production.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="client_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PayPal Client ID *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled={!isEnabled}
                    placeholder="AXxxx..."
                    className="font-mono text-sm"
                  />
                </FormControl>
                <FormDescription>
                  Your PayPal REST API Client ID
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PayPal Secret *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="password"
                    disabled={!isEnabled}
                    placeholder="EXxxx..."
                    className="font-mono text-sm"
                    autoComplete="off"
                  />
                </FormControl>
                <FormDescription>
                  Your PayPal REST API Secret (stored securely)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isUpdating || !isEnabled}>
          {isUpdating ? "Saving..." : "Save Configuration"}
        </Button>
      </form>
    </Form>
  );
}
