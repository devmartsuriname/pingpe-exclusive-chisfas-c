import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location is required"),
  event_date: z.date({ required_error: "Event date is required" }),
  price_per_person: z.coerce.number().min(0, "Price cannot be negative"),
  max_attendees: z.coerce.number().min(1, "Must allow at least 1 attendee").optional(),
  duration_hours: z.coerce.number().min(0.5, "Duration must be at least 30 minutes").optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  defaultValues?: any; // Accept any to handle database schema
  onSubmit: (data: EventFormData) => void;
  isLoading?: boolean;
}

export function EventForm({ defaultValues, onSubmit, isLoading }: EventFormProps) {
  // Convert string date to Date object if needed
  const processedDefaults = defaultValues && {
    ...defaultValues,
    event_date: defaultValues.event_date 
      ? (defaultValues.event_date instanceof Date 
          ? defaultValues.event_date 
          : new Date(defaultValues.event_date))
      : undefined,
  };

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      event_date: undefined,
      price_per_person: 0,
      max_attendees: 50,
      duration_hours: 2,
      ...processedDefaults,
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
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Amazon Cultural Festival" {...field} />
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
                <Textarea placeholder="Describe the event..." rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Paramaribo Cultural Center" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="event_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event Date & Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price_per_person"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Person ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="25.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_attendees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Attendees (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="50" {...field} />
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
                <FormLabel>Duration (Hours)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.5" placeholder="2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="5.8520" {...field} />
                </FormControl>
                <FormDescription>GPS coordinates for map display</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="-55.2038" {...field} />
                </FormControl>
                <FormDescription>GPS coordinates for map display</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
