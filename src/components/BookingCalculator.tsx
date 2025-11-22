"use client";

import { useState, useEffect } from "react";
import { Sparkles, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingStatus } from "@/hooks/useBookingStatus";
import { JourneyDetails } from "@/components/booking/JourneyDetails";
import { BookingStatus } from "@/components/booking/BookingStatus";
import { BookingInfoGrid } from "@/components/booking/BookingInfoGrid";
import { BookingActions } from "@/components/booking/BookingActions";

export function BookingCalculator() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isTatkal, setIsTatkal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Use custom hook for all logic
  const {
    status,
    bookingOpenDate,
    bookingTime,
    isTimeOpen,
    isClosed,
    isTatkalClosed,
    daysRemaining,
    currentStyle
  } = useBookingStatus(date, isTatkal);

  useEffect(() => {
    setMounted(true);
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-0 sm:px-4">
      <div className="relative overflow-hidden rounded-none sm:rounded-[2.5rem] border-y sm:border bg-background/60 backdrop-blur-xl shadow-none sm:shadow-2xl ring-1 ring-white/20 dark:ring-white/5">
        {/* Subtle Background Glows */}
        <div className={cn(
          "absolute top-0 left-0 w-full h-1.5 transition-colors duration-700",
          currentStyle.glow
        )} />
        <div className={cn(
          "absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-700",
          currentStyle.glow
        )} />
        <div className={cn(
          "absolute -bottom-32 -left-32 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-700",
          currentStyle.glow
        )} />

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
          
          {/* LEFT PANEL: INPUTS */}
          <JourneyDetails 
            date={date}
            setDate={setDate}
            isTatkal={isTatkal}
            setIsTatkal={setIsTatkal}
            isCalendarOpen={isCalendarOpen}
            setIsCalendarOpen={setIsCalendarOpen}
          />

          {/* RIGHT PANEL: OUTPUTS */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between gap-8 relative">
             {/* Background Pattern */}
             <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-[0.15] dark:opacity-[0.05] pointer-events-none" />

            <div className="space-y-1 relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                Booking Status
              </h2>
              <p className="text-sm text-muted-foreground ml-1">Real-time availability & timing</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
              {date ? (
                <div className="w-full space-y-8">
                  <BookingStatus 
                    status={status}
                    isClosed={isClosed}
                    isTimeOpen={isTimeOpen}
                    isTatkalClosed={isTatkalClosed}
                    isTatkal={isTatkal}
                    daysRemaining={daysRemaining}
                    bookingTime={bookingTime}
                    currentStyle={currentStyle}
                  />

                  <BookingInfoGrid 
                    bookingOpenDate={bookingOpenDate}
                    status={status}
                    isTatkal={isTatkal}
                  />

                  <BookingActions 
                    status={status}
                    isClosed={isClosed}
                    isTimeOpen={isTimeOpen}
                    currentStyle={currentStyle}
                    date={date}
                    bookingTime={bookingTime}
                    isTatkal={isTatkal}
                    isMobile={isMobile}
                  />
                </div>
              ) : (
                <div className="py-20 text-muted-foreground flex flex-col items-center gap-6">
                  <div className="p-6 bg-muted/30 rounded-full">
                    <CalendarIcon className="h-12 w-12 opacity-20" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-semibold">No Date Selected</p>
                    <p className="text-sm">Please select a journey date to check availability</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

