import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from "@/admin/hooks/useSettings";

const generalSettingsSchema = z.object({
  platform_name: z.string().min(1, "Platform name is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  date_format: z.string().min(1, "Date format is required"),
  commission_rate: z.number().min(0).max(100),
});

type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>;

export default function GeneralSettingsForm() {
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const form = useForm<GeneralSettingsFormData>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      platform_name: "PingPe",
      contact_email: "",
      contact_phone: "",
      currency: "USD",
      date_format: "MM/DD/YYYY",
      commission_rate: 10,
    },
  });

  useEffect(() => {
    const platformName = getSetting("platform_name");
    const contactEmail = getSetting("contact_email");
    const contactPhone = getSetting("contact_phone");
    const currency = getSetting("currency");
    const dateFormat = getSetting("date_format");
    const commissionRate = getSetting("commission_rate");

    if (platformName) form.setValue("platform_name", platformName.value.value);
    if (contactEmail) form.setValue("contact_email", contactEmail.value.value);
    if (contactPhone) form.setValue("contact_phone", contactPhone.value.value);
    if (currency) form.setValue("currency", currency.value.value);
    if (dateFormat) form.setValue("date_format", dateFormat.value.value);
    if (commissionRate) form.setValue("commission_rate", Number(commissionRate.value.value));
  }, [getSetting]);

  const onSubmit = (data: GeneralSettingsFormData) => {
    updateSetting({ key: "platform_name", value: { value: data.platform_name }, description: "Platform display name" });
    updateSetting({ key: "contact_email", value: { value: data.contact_email }, description: "Contact email address" });
    updateSetting({ key: "contact_phone", value: { value: data.contact_phone }, description: "Contact phone number" });
    updateSetting({ key: "currency", value: { value: data.currency }, description: "Default currency" });
    updateSetting({ key: "date_format", value: { value: data.date_format }, description: "Date format preference" });
    updateSetting({ key: "commission_rate", value: { value: data.commission_rate }, description: "Commission percentage" });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="platform_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>The name displayed across the platform</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormDescription>Main contact email for the platform</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Contact phone number (optional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
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
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                  <SelectItem value="AUD">AUD (A$)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Currency used for pricing</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date_format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Date display format</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="commission_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commission Rate (%)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  max="100" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>Platform commission percentage (0-100)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
