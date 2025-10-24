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
  mode: z.enum(['instructions', 'link']),
  // Instructions mode fields
  bank_name: z.string().optional(),
  account_name: z.string().optional(),
  iban: z.string().optional(),
  swift: z.string().optional(),
  // Link mode field
  link_template: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function WiseConfigForm() {
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      enabled: false,
      mode: 'instructions',
      bank_name: 'Wise',
      account_name: '',
      iban: '',
      swift: '',
      link_template: '',
    },
  });

  const isEnabled = form.watch("enabled");
  const mode = form.watch("mode");

  useEffect(() => {
    const enabled = getSetting("payment_wise_enabled");
    const wiseMode = getSetting("payment_wise_mode");
    const bankName = getSetting("payment_wise_bank_name");
    const accountName = getSetting("payment_wise_account_name");
    const iban = getSetting("payment_wise_iban");
    const swift = getSetting("payment_wise_swift");
    const linkTemplate = getSetting("payment_wise_link_template");

    if (enabled) form.setValue("enabled", enabled.value);
    if (wiseMode) form.setValue("mode", wiseMode.value);
    if (bankName) form.setValue("bank_name", bankName.value);
    if (accountName) form.setValue("account_name", accountName.value);
    if (iban) form.setValue("iban", iban.value);
    if (swift) form.setValue("swift", swift.value);
    if (linkTemplate) form.setValue("link_template", linkTemplate.value);
  }, [getSetting, form]);

  const onSubmit = (data: FormData) => {
    updateSetting({ key: "payment_wise_enabled", value: data.enabled, description: "Wise Payments Enabled" });
    updateSetting({ key: "payment_wise_mode", value: data.mode, description: "Wise Payment Mode" });
    
    if (data.mode === 'instructions') {
      updateSetting({ key: "payment_wise_bank_name", value: data.bank_name || '', description: "Wise Bank Name" });
      updateSetting({ key: "payment_wise_account_name", value: data.account_name || '', description: "Wise Account Name" });
      updateSetting({ key: "payment_wise_iban", value: data.iban || '', description: "Wise IBAN" });
      updateSetting({ key: "payment_wise_swift", value: data.swift || '', description: "Wise SWIFT/BIC Code" });
    } else {
      updateSetting({ key: "payment_wise_link_template", value: data.link_template || '', description: "Wise Payment Link Template" });
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
            Wise offers low-fee international bank transfers. Choose between showing bank transfer instructions
            or redirecting to a Wise payment link.
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Mode</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                  disabled={!isEnabled}
                >
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="instructions" id="instructions" />
                    <label
                      htmlFor="instructions"
                      className="font-normal cursor-pointer"
                    >
                      Instructions Mode - Show bank details, require proof upload
                    </label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="link" id="link" />
                    <label
                      htmlFor="link"
                      className="font-normal cursor-pointer"
                    >
                      Link Mode - Redirect to Wise payment link
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === 'instructions' && (
          <div className="space-y-4 rounded-lg border p-4">
            <h4 className="font-medium">Bank Transfer Instructions</h4>
            <p className="text-sm text-muted-foreground">
              These details will be shown to guests after booking confirmation
            </p>

            <FormField
              control={form.control}
              name="bank_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEnabled} placeholder="Wise" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="account_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account/Beneficiary Name *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEnabled} placeholder="Jungle Resort PingPe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iban"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IBAN / Account Number *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEnabled} placeholder="SR12 3456 7890 1234 5678" />
                  </FormControl>
                  <FormDescription>
                    International Bank Account Number or local account number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="swift"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SWIFT/BIC Code</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEnabled} placeholder="ABCDSRPA" />
                  </FormControl>
                  <FormDescription>
                    Required for international transfers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {mode === 'link' && (
          <div className="space-y-4 rounded-lg border p-4">
            <h4 className="font-medium">Wise Payment Link</h4>
            <p className="text-sm text-muted-foreground">
              Guests will be redirected to this link to complete payment
            </p>

            <FormField
              control={form.control}
              name="link_template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Link Template</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      disabled={!isEnabled} 
                      placeholder="https://wise.com/pay/..." 
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Your Wise payment link URL (can include placeholders for amount, reference, etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <Button type="submit" disabled={isUpdating || !isEnabled}>
          {isUpdating ? "Saving..." : "Save Configuration"}
        </Button>
      </form>
    </Form>
  );
}
