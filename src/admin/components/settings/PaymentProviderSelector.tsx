import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSettings } from "@/admin/hooks/useSettings";

const schema = z.object({
  payment_primary_provider: z.enum(['wise', 'paypal', 'stripe']),
});

type FormData = z.infer<typeof schema>;

export default function PaymentProviderSelector() {
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      payment_primary_provider: 'wise',
    },
  });

  useEffect(() => {
    const provider = getSetting("payment_primary_provider");
    if (provider) {
      form.setValue("payment_primary_provider", provider.value);
    }
  }, [getSetting, form]);

  const onSubmit = (data: FormData) => {
    updateSetting({
      key: "payment_primary_provider",
      value: data.payment_primary_provider,
      description: "Primary Payment Provider",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="payment_primary_provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Payment Provider</FormLabel>
              <FormDescription>
                Choose your preferred payment method for guest bookings
              </FormDescription>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="wise" id="wise" />
                    <label
                      htmlFor="wise"
                      className="font-normal cursor-pointer"
                    >
                      Wise (Bank Transfer) - Recommended
                    </label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <label
                      htmlFor="paypal"
                      className="font-normal cursor-pointer"
                    >
                      PayPal
                    </label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <label
                      htmlFor="stripe"
                      className="font-normal cursor-pointer"
                    >
                      Stripe (Coming Soon)
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Saving..." : "Save Provider Selection"}
        </Button>
      </form>
    </Form>
  );
}
