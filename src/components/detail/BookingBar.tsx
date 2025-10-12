import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingBarProps {
  price: number;
  priceUnit: string;
  inventoryType: "stay" | "experience" | "transport" | "package" | "event";
  maxCapacity?: number;
}

export const BookingBar = ({ price, priceUnit, inventoryType, maxCapacity = 10 }: BookingBarProps) => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("1");

  const calculateTotal = () => {
    if (inventoryType === "stay" && checkIn && checkOut) {
      const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return price * days;
    }
    return price * parseInt(guests);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6 lg:sticky lg:top-24">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">€{price.toLocaleString()}</span>
        <span className="text-muted-foreground">/ {priceUnit}</span>
      </div>

      <div className="space-y-4">
        {inventoryType === "stay" ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !checkIn && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkIn ? format(checkIn, "MMM dd") : "Check-in"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !checkOut && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOut ? format(checkOut, "MMM dd") : "Check-out"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    initialFocus
                    disabled={(date) => checkIn ? date < checkIn : false}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkIn && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? format(checkIn, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        )}

        <Select value={guests} onValueChange={setGuests}>
          <SelectTrigger>
            <Users className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Guests" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? "guest" : "guests"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            €{price} × {inventoryType === "stay" && checkIn && checkOut
              ? `${Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights`
              : `${guests} ${inventoryType === "stay" ? "guests" : "people"}`
            }
          </span>
          <span className="font-medium">€{calculateTotal().toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>€{calculateTotal().toLocaleString()}</span>
        </div>
      </div>

      <Button size="lg" className="w-full">
        Reserve
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        You won't be charged yet
      </p>
    </div>
  );
};
