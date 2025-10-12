import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/admin/hooks/useSettings";

const bookingSettingsSchema = z.object({
  min_lead_time: z.number().min(0),
  max_advance_time: z.number().min(1),
  cancellation_policy: z.string(),
  refund_processing_days: z.number().min(1),
  auto_approve: z.boolean(),
  require_host_approval: z.boolean(),
});

type BookingSettingsFormData = z.infer<typeof bookingSettingsSchema>;

export default function BookingSettingsForm() {
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const form = useForm<BookingSettingsFormData>({
    resolver: zodResolver(bookingSettingsSchema),
    defaultValues: {
      min_lead_time: 24,
      max_advance_time: 365,
      cancellation_policy: "moderate",
      refund_processing_days: 7,
      auto_approve: false,
      require_host_approval: true,
    },
  });

  useEffect(() => {
    const minLeadTime = getSetting("min_lead_time");
    const maxAdvanceTime = getSetting("max_advance_time");
    const cancellationPolicy = getSetting("cancellation_policy");
    const refundProcessingDays = getSetting("refund_processing_days");
    const autoApprove = getSetting("auto_approve");
    const requireHostApproval = getSetting("require_host_approval");

    if (minLeadTime) form.setValue("min_lead_time", Number(minLeadTime.value.value));
    if (maxAdvanceTime) form.setValue("max_advance_time", Number(maxAdvanceTime.value.value));
    if (cancellationPolicy) form.setValue("cancellation_policy", cancellationPolicy.value.value);
    if (refundProcessingDays) form.setValue("refund_processing_days", Number(refundProcessingDays.value.value));
    if (autoApprove) form.setValue("auto_approve", autoApprove.value.value === true);
    if (requireHostApproval) form.setValue("require_host_approval", requireHostApproval.value.value === true);
  }, [getSetting]);

  const onSubmit = (data: BookingSettingsFormData) => {
    updateSetting({ key: "min_lead_time", value: { value: data.min_lead_time }, description: "Minimum booking lead time in hours" });
    updateSetting({ key: "max_advance_time", value: { value: data.max_advance_time }, description: "Maximum booking advance time in days" });
    updateSetting({ key: "cancellation_policy", value: { value: data.cancellation_policy }, description: "Default cancellation policy" });
    updateSetting({ key: "refund_processing_days", value: { value: data.refund_processing_days }, description: "Refund processing time in days" });
    updateSetting({ key: "auto_approve", value: { value: data.auto_approve }, description: "Auto-approve bookings" });
    updateSetting({ key: "require_host_approval", value: { value: data.require_host_approval }, description: "Require host approval" });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="min_lead_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Lead Time (hours)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>Minimum hours before check-in for bookings</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="max_advance_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Advance Time (days)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>Maximum days in advance bookings can be made</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cancellation_policy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Cancellation Policy</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select policy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="flexible">Flexible - Full refund 24h before</SelectItem>
                  <SelectItem value="moderate">Moderate - 50% refund 7 days before</SelectItem>
                  <SelectItem value="strict">Strict - No refund</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Default policy for cancellations</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="refund_processing_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Refund Processing Days</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>Number of days to process refunds</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="auto_approve"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Auto-Approve Bookings</FormLabel>
                <FormDescription>Automatically approve bookings without manual review</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="require_host_approval"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Require Host Approval</FormLabel>
                <FormDescription>Hosts must approve bookings before confirmation</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
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
