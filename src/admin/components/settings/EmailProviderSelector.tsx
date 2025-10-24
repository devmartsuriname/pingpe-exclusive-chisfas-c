import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSettings } from "@/admin/hooks/useSettings";

const schema = z.object({
  email_provider: z.enum(['hostinger', 'resend']),
});

type FormData = z.infer<typeof schema>;

export default function EmailProviderSelector() {
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email_provider: 'hostinger',
    },
  });

  useEffect(() => {
    const provider = getSetting("email_provider");
    if (provider) {
      form.setValue("email_provider", provider.value);
    }
  }, [getSetting, form]);

  const onSubmit = (data: FormData) => {
    updateSetting({
      key: "email_provider",
      value: data.email_provider,
      description: "Primary Email Provider",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email_provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Email Provider</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="hostinger" id="hostinger" />
                    <label
                      htmlFor="hostinger"
                      className="font-normal cursor-pointer"
                    >
                      Hostinger SMTP (Default)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="resend" id="resend" />
                    <label
                      htmlFor="resend"
                      className="font-normal cursor-pointer"
                    >
                      Resend API
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
