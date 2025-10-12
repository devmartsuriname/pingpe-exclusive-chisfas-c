import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const transportSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  vehicle_type: z.string().min(2, "Vehicle type is required"),
  route_from: z.string().min(2, "Starting point is required"),
  route_to: z.string().min(2, "Destination is required"),
  price_per_person: z.coerce.number().min(1, "Price must be greater than 0"),
  price_per_group: z.coerce.number().optional(),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  duration_hours: z.coerce.number().optional(),
  luggage_allowance: z.string().optional(),
});

type TransportFormData = z.infer<typeof transportSchema>;

interface TransportFormProps {
  defaultValues?: Partial<TransportFormData>;
  onSubmit: (data: TransportFormData) => void;
  isLoading?: boolean;
}

export function TransportForm({ defaultValues, onSubmit, isLoading }: TransportFormProps) {
  const form = useForm<TransportFormData>({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      title: "",
      description: "",
      vehicle_type: "",
      route_from: "",
      route_to: "",
      price_per_person: 0,
      capacity: 4,
      luggage_allowance: "",
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
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Airport Shuttle Service" {...field} />
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
                <Textarea placeholder="Describe the transport service..." rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicle_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Type</FormLabel>
              <FormControl>
                <Input placeholder="SUV, Van, Bus, Car" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="route_from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Input placeholder="Lilongwe Airport" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="route_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <FormControl>
                  <Input placeholder="City Center" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price_per_person"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Person ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="25" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price_per_group"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Group (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="80" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity (Passengers)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="4" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Hours, Optional)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.5" placeholder="1.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="luggage_allowance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Luggage Allowance (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="2 large suitcases + 1 carry-on per person" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Transport"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
