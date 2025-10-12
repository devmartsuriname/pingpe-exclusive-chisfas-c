import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

const packageSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration_days: z.coerce.number().min(1, "Duration must be at least 1 day"),
  price_total: z.coerce.number().min(1, "Price must be greater than 0"),
  max_participants: z.coerce.number().min(1, "Must have at least 1 participant"),
  discount_percentage: z.coerce.number().min(0).max(100).optional(),
});

type PackageFormData = z.infer<typeof packageSchema>;

interface PackageFormProps {
  defaultValues?: Partial<PackageFormData>;
  onSubmit: (data: PackageFormData) => void;
  isLoading?: boolean;
}

export function PackageForm({ defaultValues, onSubmit, isLoading }: PackageFormProps) {
  const form = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      title: "",
      description: "",
      duration_days: 3,
      price_total: 0,
      max_participants: 10,
      discount_percentage: 0,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Title</FormLabel>
              <FormControl>
                <Input placeholder="Amazon Adventure Package" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the package details..." rows={4} {...field} />
              </FormControl>
              <FormDescription>
                Include highlights, itinerary overview, and what makes this package special
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Days)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_participants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Participants</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price_total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="500.00" {...field} />
                </FormControl>
                <FormDescription>
                  Total package price per person
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount % (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="10" {...field} />
                </FormControl>
                <FormDescription>
                  Discount compared to individual bookings
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Package"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
