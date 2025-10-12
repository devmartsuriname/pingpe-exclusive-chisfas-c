import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const partnerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contact_name: z.string().min(2, "Contact name is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().optional(),
  commission_rate: z.coerce.number().min(0, "Commission must be 0 or greater").max(100, "Commission cannot exceed 100%"),
  address: z.string().optional(),
  payment_terms: z.string().optional(),
});

type PartnerFormData = z.infer<typeof partnerSchema>;

interface PartnerFormProps {
  defaultValues?: Partial<PartnerFormData>;
  onSubmit: (data: PartnerFormData) => void;
  isLoading?: boolean;
  submitText?: string;
}

export function PartnerForm({ defaultValues, onSubmit, isLoading, submitText = "Save Partner" }: PartnerFormProps) {
  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: "",
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      commission_rate: 10,
      address: "",
      payment_terms: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Partner Name</FormLabel>
              <FormControl>
                <Input placeholder="Travel Agency Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Person</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="contact@agency.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="+265 999 123 456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="commission_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commission Rate (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Full address..." rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_terms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Terms (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Net 30 days" rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
