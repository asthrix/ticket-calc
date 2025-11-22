
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Train, Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface JourneyDetailsProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  isTatkal: boolean;
  setIsTatkal: (isTatkal: boolean) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (isOpen: boolean) => void;
}

export function JourneyDetails({
  date,
  setDate,
  isTatkal,
  setIsTatkal,
  isCalendarOpen,
  setIsCalendarOpen
}: JourneyDetailsProps) {
  return (
    <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 bg-muted/10">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Train className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          Journey Details
        </h2>
        <p className="text-sm text-muted-foreground ml-1">Select your travel date & quota</p>
      </div>

      {/* Quota Selector */}
      <div className="bg-muted/50 p-1.5 rounded-2xl border flex relative">
        <button
          onClick={() => setIsTatkal(false)}
          className={cn(
            "flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 relative z-10",
            !isTatkal ? "text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          General
        </button>
        <button
          onClick={() => setIsTatkal(true)}
          className={cn(
            "flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 relative z-10",
            isTatkal ? "text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Tatkal
        </button>
        
        {/* Animated Background for Active Tab */}
        <div className={cn(
          "absolute top-1.5 bottom-1.5 rounded-xl bg-background transition-all duration-300 shadow-sm",
          !isTatkal ? "left-1.5 right-1/2 mr-1" : "left-1/2 right-1.5 ml-1"
        )} />
      </div>

      {/* Calendar */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Travel Date</Label>
        
        {/* Mobile Popover */}
        <div className="md:hidden">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-14 text-base justify-start px-4 font-normal border-input hover:border-primary/50 transition-all rounded-2xl bg-background/50",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                {date ? format(date, "EEEE, d MMMM") : <span>Select a date</span>}
                <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground/50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(date) => {
                  setDate(date);
                  setIsCalendarOpen(false);
                }}
                disabled={(date) => date < new Date()}
                initialFocus
                className="rounded-xl border shadow-xl"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Desktop Embedded */}
        <div className="hidden md:block">
          <div className="rounded-3xl border bg-background/50 p-4 shadow-sm">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="rounded-xl w-full flex justify-center min-h-96"
              classNames={{
                month: "space-y-4 w-full",
                table: "w-full border-collapse space-y-1",
                head_row: "flex w-full justify-between mb-2",
                row: "flex w-full mt-2 justify-between",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-lg transition-colors",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
