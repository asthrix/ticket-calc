"use client";

import { useState, useEffect } from "react";
import { addDays, format, differenceInDays, subDays, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle2, Train, Bell } from "lucide-react";
import { getGoogleCalendarUrl } from "@/lib/date-utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function BookingCalculator() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isTatkal, setIsTatkal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Booking rules:
  // General: 60 days in advance
  // Tatkal: 1 day in advance (excluding journey date)
  const advanceDays = isTatkal ? 1 : 60;
  
  // Calculate when booking opens for the selected journey date
  // If journey is on X, booking opens on X - advanceDays
  const bookingOpenDate = date ? subDays(date, advanceDays) : undefined;
  
  const today = startOfDay(new Date());
  const isBookingOpen = bookingOpenDate ? isBefore(bookingOpenDate, today) || bookingOpenDate.getTime() === today.getTime() : false;
  const daysRemaining = bookingOpenDate ? differenceInDays(bookingOpenDate, today) : 0;

  const handleAddToCalendar = () => {
    if (!date || !bookingOpenDate) return;

    const title = `IRCTC ${isTatkal ? 'Tatkal' : 'General'} Booking Opens`;
    const description = `Booking opens for journey on ${format(date, "PPP")}.\n\nQuota: ${isTatkal ? 'Tatkal (10:00 AM AC / 11:00 AM Non-AC)' : 'General (8:00 AM)'}\n\nBook at irctc.co.in`;
    
    // Set time based on quota
    const eventDate = new Date(bookingOpenDate);
    eventDate.setHours(isTatkal ? 10 : 8, 0, 0, 0);

    const url = getGoogleCalendarUrl(
      title,
      description,
      "IRCTC Website / App",
      eventDate
    );
    
    window.open(url, "_blank");
    toast.success("Reminder opened in Google Calendar");
  };

  if (!mounted) return null;

  return (
    <Card className="w-full border-none shadow-2xl bg-gradient-to-br from-background to-muted/30 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500" />
      
      <div className="grid lg:grid-cols-12 gap-0">
        {/* Left Panel: Input & Calendar */}
        <div className="lg:col-span-5 p-4 sm:p-6 md:p-8 border-b lg:border-b-0 lg:border-r bg-card/50 backdrop-blur-sm">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <Train className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Plan Your Journey
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">Select your journey date to find out when to book.</p>
            </div>

            <div className="flex items-center justify-between p-3 sm:p-4 bg-muted/50 rounded-xl border">
              <div className="space-y-0.5">
                <Label htmlFor="quota-mode" className="text-sm sm:text-base font-semibold">Tatkal Mode</Label>
                <p className="text-xs text-muted-foreground">Book 1 day in advance</p>
              </div>
              <Switch
                id="quota-mode"
                checked={isTatkal}
                onCheckedChange={setIsTatkal}
              />
            </div>

            <div className="flex justify-center bg-background rounded-xl border p-4 sm:p-6 md:p-8 shadow-sm overflow-hidden">
              <div className="transform scale-100 sm:scale-110 md:scale-125 origin-center">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md"
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Status & Actions */}
        <div className="lg:col-span-7 p-4 sm:p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-primary/5 to-blue-500/5">
          <div className="space-y-6 sm:space-y-8 max-w-lg mx-auto w-full">
            
            {/* Status Card */}
            <div className="text-center space-y-2">
              <h3 className="text-sm sm:text-base md:text-lg font-medium text-muted-foreground uppercase tracking-wide">Booking Status</h3>
              {date ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="relative inline-block">
                    <div className={cn(
                      "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter",
                      isBookingOpen ? "text-green-600" : "text-primary"
                    )}>
                      {isBookingOpen ? "OPEN NOW" : `${daysRemaining} DAYS`}
                    </div>
                    {!isBookingOpen && (
                      <div className="text-xs sm:text-sm font-medium text-muted-foreground mt-1 sm:mt-2">
                        REMAINING
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
                    <div className="p-3 sm:p-4 bg-background/80 backdrop-blur rounded-xl border shadow-sm">
                      <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Journey Date</p>
                      <p className="text-base sm:text-lg font-bold">{format(date, "EEE, dd MMM yyyy")}</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-background/80 backdrop-blur rounded-xl border shadow-sm">
                      <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Booking Opens On</p>
                      <p className={cn("text-base sm:text-lg font-bold", isBookingOpen ? "text-green-600" : "text-primary")}>
                        {bookingOpenDate ? format(bookingOpenDate, "EEE, dd MMM yyyy") : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 sm:py-12 text-muted-foreground text-sm sm:text-base">
                  Please select a journey date
                </div>
              )}
            </div>

            {/* Info & Actions */}
            {date && bookingOpenDate && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-500/10 text-blue-700 rounded-xl border border-blue-200 dark:border-blue-800 dark:text-blue-300">
                  <InfoIcon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-semibold mb-1">
                      {isTatkal ? "Tatkal Booking Timings" : "General Booking Timings"}
                    </p>
                    <p className="opacity-90">
                      {isTatkal 
                        ? "AC Class opens at 10:00 AM. Non-AC Class opens at 11:00 AM." 
                        : "Booking opens at 8:00 AM, 60 days in advance."}
                    </p>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full h-12 sm:h-14 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
                  onClick={handleAddToCalendar}
                >
                  <Bell className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Set Reminder
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
