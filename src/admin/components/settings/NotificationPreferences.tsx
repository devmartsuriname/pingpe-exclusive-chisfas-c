import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSettings } from "@/admin/hooks/useSettings";

const notificationSchema = z.object({
  email_booking_confirmation: z.boolean(),
  email_cancellation: z.boolean(),
  email_payment_receipt: z.boolean(),
  email_refund: z.boolean(),
  alert_new_booking: z.boolean(),
  alert_low_inventory: z.boolean(),
  alert_payment_failure: z.boolean(),
  alert_suspicious_activity: z.boolean(),
  frequency: z.enum(["instant", "daily", "weekly"]),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

export default function NotificationPreferences() {
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      email_booking_confirmation: true,
      email_cancellation: true,
      email_payment_receipt: true,
      email_refund: true,
      alert_new_booking: true,
      alert_low_inventory: true,
      alert_payment_failure: true,
      alert_suspicious_activity: true,
      frequency: "instant",
    },
  });

  useEffect(() => {
    const notificationPrefs = getSetting("notification_preferences");
    if (notificationPrefs) {
      const prefs = notificationPrefs.value;
      Object.keys(prefs).forEach((key) => {
        form.setValue(key as any, prefs[key]);
      });
    }
  }, [getSetting]);

  const onSubmit = (data: NotificationFormData) => {
    updateSetting({
      key: "notification_preferences",
      value: data,
      description: "Notification preferences for email and alerts",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>
          
          <FormField
            control={form.control}
            name="email_booking_confirmation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Booking Confirmation</FormLabel>
                  <FormDescription>Send email when booking is confirmed</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email_cancellation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Cancellation Notice</FormLabel>
                  <FormDescription>Send email when booking is cancelled</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email_payment_receipt"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Payment Receipt</FormLabel>
                  <FormDescription>Send email receipt after payment</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email_refund"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Refund Notification</FormLabel>
                  <FormDescription>Send email when refund is processed</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Admin Alerts</h3>
          
          <FormField
            control={form.control}
            name="alert_new_booking"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">New Booking</FormLabel>
                  <FormDescription>Alert when new booking is created</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alert_low_inventory"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Low Inventory</FormLabel>
                  <FormDescription>Alert when inventory is running low</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alert_payment_failure"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Payment Failure</FormLabel>
                  <FormDescription>Alert when payment fails</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alert_suspicious_activity"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Suspicious Activity</FormLabel>
                  <FormDescription>Alert for suspicious activity detection</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Frequency</h3>
          
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="instant" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Instant - Receive notifications immediately
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="daily" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Daily Digest - Once per day summary
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="weekly" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Weekly Digest - Once per week summary
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Saving..." : "Save Preferences"}
        </Button>
      </form>
    </Form>
  );
}
