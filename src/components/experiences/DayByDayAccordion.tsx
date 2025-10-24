import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, Coffee, MapPin } from "lucide-react";

interface DayProgram {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
}

interface DayByDayAccordionProps {
  dayProgram: DayProgram[];
}

export function DayByDayAccordion({ dayProgram }: DayByDayAccordionProps) {
  if (!dayProgram || dayProgram.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Calendar className="h-6 w-6" />
        Day-by-Day Itinerary
      </h2>
      
      <Accordion type="single" collapsible className="w-full">
        {dayProgram.map((day, index) => (
          <AccordionItem key={index} value={`day-${day.day}`}>
            <AccordionTrigger className="text-left">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {day.day}
                </div>
                <div>
                  <div className="font-semibold">Day {day.day}</div>
                  <div className="text-sm text-muted-foreground">{day.title}</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pl-15">
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {day.description}
                </p>

                {day.activities && day.activities.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Activities
                    </h4>
                    <ul className="space-y-1 ml-6">
                      {day.activities.map((activity, i) => (
                        <li key={i} className="text-sm text-muted-foreground list-disc">
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {day.meals && day.meals.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Coffee className="h-4 w-4" />
                      Meals Included
                    </h4>
                    <p className="text-sm text-muted-foreground ml-6">
                      {day.meals.join(', ')}
                    </p>
                  </div>
                )}

                {day.accommodation && (
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      <span className="font-semibold">Accommodation:</span> {day.accommodation}
                    </p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
