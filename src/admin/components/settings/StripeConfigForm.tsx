import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/admin/hooks/useSettings";

const stripeConfigSchema = z.object({
  stripe_publishable_key: z.string().min(1, "Publishable key is required"),
  stripe_secret_key: z.string().min(1, "Secret key is required"),
  stripe_webhook_secret: z.string().optional(),
  stripe_currency: z.string().default("USD"),
  stripe_test_mode: z.boolean().default(true),
});

type StripeConfigFormData = z.infer<typeof stripeConfigSchema>;

export default function StripeConfigForm() {
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const form = useForm<StripeConfigFormData>({
    resolver: zodResolver(stripeConfigSchema),
    defaultValues: {
      stripe_publishable_key: "",
      stripe_secret_key: "",
      stripe_webhook_secret: "",
      stripe_currency: "USD",
      stripe_test_mode: true,
    },
  });

  useEffect(() => {
    const publishableKey = getSetting("stripe_publishable_key");
    const secretKey = getSetting("stripe_secret_key");
    const webhookSecret = getSetting("stripe_webhook_secret");
    const currency = getSetting("stripe_currency");
    const testMode = getSetting("stripe_test_mode");

    if (publishableKey) form.setValue("stripe_publishable_key", publishableKey.value);
    if (secretKey) form.setValue("stripe_secret_key", secretKey.value);
    if (webhookSecret) form.setValue("stripe_webhook_secret", webhookSecret.value);
    if (currency) form.setValue("stripe_currency", currency.value);
    if (testMode) form.setValue("stripe_test_mode", testMode.value);
  }, [getSetting, form]);

  const onSubmit = (data: StripeConfigFormData) => {
    updateSetting({ key: "stripe_publishable_key", value: data.stripe_publishable_key, description: "Stripe Publishable Key" });
    updateSetting({ key: "stripe_secret_key", value: data.stripe_secret_key, description: "Stripe Secret Key (Encrypted)" });
    if (data.stripe_webhook_secret) {
      updateSetting({ key: "stripe_webhook_secret", value: data.stripe_webhook_secret, description: "Stripe Webhook Secret" });
    }
    updateSetting({ key: "stripe_currency", value: data.stripe_currency, description: "Default Payment Currency" });
    updateSetting({ key: "stripe_test_mode", value: data.stripe_test_mode, description: "Stripe Test Mode Enabled" });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="stripe_test_mode"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Test Mode</FormLabel>
                <FormDescription>
                  Enable test mode to use Stripe test keys instead of live keys
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stripe_publishable_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publishable Key</FormLabel>
              <FormControl>
                <Input placeholder="pk_test_..." {...field} />
              </FormControl>
              <FormDescription>
                Your Stripe publishable key (starts with pk_test_ or pk_live_)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stripe_secret_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secret Key</FormLabel>
              <FormControl>
                <Input type="password" placeholder="sk_test_..." {...field} />
              </FormControl>
              <FormDescription>
                Your Stripe secret key (starts with sk_test_ or sk_live_)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stripe_webhook_secret"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Webhook Secret (Optional)</FormLabel>
              <FormControl>
                <Input type="password" placeholder="whsec_..." {...field} />
              </FormControl>
              <FormDescription>
                Your Stripe webhook signing secret for webhook verification
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stripe_currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Currency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="SRD">SRD - Surinamese Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The default currency for all transactions
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Saving..." : "Save Stripe Configuration"}
        </Button>
      </form>
    </Form>
  );
}
