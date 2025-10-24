import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useSettings } from "@/admin/hooks/useSettings";

  const schema = z.object({
    enabled: z.boolean(),
    account_name: z.string().min(1, "Account name is required"),
    bank_name: z.string().optional(),
  });

type FormData = z.infer<typeof schema>;

export default function WiseConfigForm() {
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      enabled: false,
      account_name: '',
      bank_name: 'EUR',
    },
  });

  const isEnabled = form.watch("enabled");

  useEffect(() => {
    const enabled = getSetting("payment_wise_enabled");
    const accountId = getSetting("payment_wise_account_id");
    const currency = getSetting("payment_wise_currency");

    if (enabled) form.setValue("enabled", enabled.value);
    if (accountId) form.setValue("account_name", accountId.value);
    if (currency) form.setValue("bank_name", currency.value);
  }, [getSetting, form]);

  const onSubmit = (data: FormData) => {
    updateSetting({ key: "payment_wise_enabled", value: data.enabled, description: "Wise Enabled" });
    updateSetting({ key: "payment_wise_account_id", value: data.account_name || '', description: "Wise Account" });
    updateSetting({ key: "payment_wise_currency", value: data.bank_name || 'EUR', description: "Wise Currency" });
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
                <FormLabel className="text-base">Enable Wise Payments</FormLabel>
                <FormDescription>
                  Accept bank transfers via Wise (formerly TransferWise)
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
            Wise requires manual bank transfer. Guests will receive instructions and must upload payment proof.
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="account_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Account Number *</FormLabel>
              <FormControl>
                <Input {...field} disabled={!isEnabled} placeholder="Enter your Wise account number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bank_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <FormControl>
                <Input {...field} disabled={!isEnabled} placeholder="EUR" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isUpdating || !isEnabled}>
          {isUpdating ? "Saving..." : "Save Configuration"}
        </Button>
      </form>
    </Form>
  );
}
