import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSettings } from "@/admin/hooks/useSettings";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const paymentModeSchema = z.object({
  test_mode: z.boolean(),
});

type PaymentModeFormData = z.infer<typeof paymentModeSchema>;

export default function PaymentModeToggle() {
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const form = useForm<PaymentModeFormData>({
    resolver: zodResolver(paymentModeSchema),
    defaultValues: {
      test_mode: false,
    },
  });

  useEffect(() => {
    const testModeSetting = getSetting("payment_test_mode");
    if (testModeSetting) {
      form.reset({
        test_mode: testModeSetting.value === true,
      });
    }
  }, [getSetting]);

  const handleToggle = (checked: boolean) => {
    updateSetting({
      key: "payment_test_mode",
      value: checked,
      description: "Enable test mode for payment processing",
    });
    form.setValue("test_mode", checked);
  };

  const testMode = form.watch("test_mode");

  return (
    <div className="space-y-4">
      <Form {...form}>
        <FormField
          control={form.control}
          name="test_mode"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Test Mode</FormLabel>
                <FormDescription>
                  Enable test mode to process payments using test API keys
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={handleToggle}
                  disabled={isUpdating}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </Form>

      {testMode && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Test mode is enabled. All payments will be processed using test API credentials.
            Remember to disable this in production!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
