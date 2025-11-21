"use client";

import { useState, useEffect } from "react";
import { addDays, format, differenceInDays, subDays, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, Train, Bell, Smartphone, Wallet, ChevronRight, Sparkles } from "lucide-react";
import { getGoogleCalendarUrl } from "@/lib/date-utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";

export function BookingCalculator() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isTatkal, setIsTatkal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);

  const advanceDays = isTatkal ? 1 : 60;
  const bookingOpenDate = date ? subDays(date, advanceDays) : undefined;
  const today = startOfDay(new Date());
  const isBookingOpen = bookingOpenDate ? isBefore(bookingOpenDate, today) || bookingOpenDate.getTime() === today.getTime() : false;
  const daysRemaining = bookingOpenDate ? differenceInDays(bookingOpenDate, today) : 0;

  const handleBookNow = () => {
    if (!isBookingOpen) return;
    const url = isMobile ? 'irctc://' : 'https://www.irctc.co.in/nget/train-search';
    if (isMobile) {
      window.location.href = url;
      setTimeout(() => window.open('https://www.irctc.co.in/nget/train-search', '_blank'), 2000);
    } else {
      window.open(url, '_blank');
    }
    toast.success("Opening IRCTC...");
  };

  const handleAddSpecificReminder = (type: 'prep' | 'book') => {
    if (!date || !bookingOpenDate) return;
    const bookingTime = new Date(bookingOpenDate);
    bookingTime.setHours(12, 0, 0, 0); 
    if (isTatkal) bookingTime.setUTCHours(4, 30, 0, 0);
    else bookingTime.setUTCHours(2, 30, 0, 0);

    let eventStartTime, eventEndTime, title, description;
    if (type === 'prep') {
      eventStartTime = new Date(bookingTime.getTime() - 24 * 60 * 60 * 1000);
      eventEndTime = new Date(eventStartTime.getTime() + 30 * 60 * 1000);
      title = "📋 Prepare for IRCTC Booking Tomorrow";
      description = `Tomorrow at ${format(bookingTime, "h:mm a")}, booking opens for your journey on ${format(date, "PPP")}.\n\nTo Do:\n• Update IRCTC wallet\n• Update master list (add passengers)\n• Check train availability\n\nQuota: ${isTatkal ? 'Tatkal' : 'General'}`;
    } else {
      eventStartTime = new Date(bookingTime.getTime() - 10 * 60 * 1000);
      eventEndTime = new Date(bookingTime.getTime());
      title = "🚆 IRCTC Booking Opens in 10 Minutes!";
      description = `Get ready! Booking opens at ${format(bookingTime, "h:mm a")} for journey on ${format(date, "PPP")}.\n\nQuota: ${isTatkal ? 'Tatkal' : 'General'}`;
    }

    if (isMobile) {
      const start = eventStartTime.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const end = eventEndTime.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:${title}\nDESCRIPTION:${description}\nEND:VEVENT\nEND:VCALENDAR`;
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `irctc-${type}-reminder.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Reminder downloaded!");
    } else {
      window.open(getGoogleCalendarUrl(title, description, "IRCTC", eventStartTime, eventEndTime), "_blank");
      toast.success("Opening Google Calendar...");
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-0 sm:px-4">
      <div className="relative overflow-hidden rounded-none sm:rounded-3xl border-y sm:border bg-background/50 backdrop-blur-xl shadow-none sm:shadow-2xl">
        {/* Subtle Background Glow */}
        <div className={cn(
          "absolute top-0 left-0 w-full h-1 transition-colors duration-500",
          isBookingOpen ? "bg-emerald-500" : "bg-blue-500"
        )} />
        <div className={cn(
          "absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500",
          isBookingOpen ? "bg-emerald-500" : "bg-blue-500"
        )} />

        <div className="p-4 sm:p-10 flex flex-col gap-4 sm:gap-8">
          {/* Header Section */}
          <div className="flex flex-row items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight flex items-center gap-2">
                <Train className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Booking Calculator
              </h2>
              <p className="text-xs sm:text-base text-muted-foreground mt-0.5 sm:mt-1">Plan ahead. Book on time.</p>
            </div>
            
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-full border shrink-0">
              <button
                onClick={() => setIsTatkal(false)}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] sm:text-sm font-medium transition-all",
                  !isTatkal ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                General
              </button>
              <button
                onClick={() => setIsTatkal(true)}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] sm:text-sm font-medium transition-all",
                  isTatkal ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Tatkal
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-start sm:items-center">
            {/* Date Selection */}
            <div className="space-y-3 order-1 md:order-none">
              <Label className="text-[10px] sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Journey Date</Label>
              
              {/* Mobile View: Popover */}
              <div className="md:hidden">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 text-sm justify-start px-3 font-normal border hover:border-primary/50 transition-all rounded-xl bg-card/50",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {date ? format(date, "EEEE, d MMMM") : <span>Select a date</span>}
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground/50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="rounded-xl border shadow-xl"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Desktop View: Inline Calendar */}
              <div className="hidden md:block">
                <div className="rounded-2xl border bg-card/50 p-2 min-h-[365px] flex items-center">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-xl w-full flex justify-center"
                    classNames={{
                      month: "space-y-4 w-full",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex w-full justify-between",
                      row: "flex w-full mt-2 justify-between",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    }}
                  />
                </div>
              </div>

            </div>

            {/* Status & Action Column */}
            <div className="flex flex-col gap-4 order-2 md:order-none">
              {/* Booking Date Info - Moved Here */}
              {date && bookingOpenDate && (
                <div className="flex items-center gap-3 p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50">
                  <div className={cn("p-1.5 sm:p-2 rounded-lg sm:rounded-xl", isBookingOpen ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600")}>
                    <Clock className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase">Booking Opens On</p>
                    <p className="text-sm sm:text-base font-semibold">{format(bookingOpenDate, "EEEE, d MMMM yyyy")}</p>
                  </div>
                </div>
              )}

              {/* Status Card */}
              <div className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-muted/30 to-transparent border border-border/50 flex-1">
                {date ? (
                  <>
                    <div className="space-y-0.5 sm:space-y-1">
                      <p className="text-[10px] sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                      <div className={cn(
                        "text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter",
                        isBookingOpen ? "text-emerald-500" : "text-foreground"
                      )}>
                        {isBookingOpen ? "OPEN" : daysRemaining}
                      </div>
                      <p className="text-sm sm:text-lg font-medium text-muted-foreground">
                        {isBookingOpen ? "Book Now" : "Days Remaining"}
                      </p>
                    </div>

                    {isBookingOpen ? (
                      <Button 
                        size="lg" 
                        className="w-full h-10 sm:h-14 text-sm sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 transition-all hover:scale-[1.02]"
                        onClick={handleBookNow}
                      >
                        <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Book Ticket
                      </Button>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="lg" 
                            className="w-full h-10 sm:h-14 text-sm sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow-lg bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02]"
                          >
                            <Bell className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                            Set Reminder
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[90%] sm:max-w-md rounded-2xl sm:rounded-3xl">
                          <DialogHeader>
                            <DialogTitle className="text-base sm:text-xl">Set Reminders</DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm">Never miss your booking window.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-2 sm:gap-3 py-3 sm:py-4">
                            <Button variant="outline" className="h-auto p-3 sm:p-4 justify-start rounded-xl sm:rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-950/30 border hover:border-blue-200 transition-all" onClick={() => handleAddSpecificReminder('prep')}>
                              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl mr-3 sm:mr-4">
                                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                              </div>
                              <div className="text-left">
                                <div className="font-semibold text-sm sm:text-base">1 Day Before</div>
                                <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Prepare wallet & passenger list</div>
                              </div>
                            </Button>
                            <Button variant="outline" className="h-auto p-3 sm:p-4 justify-start rounded-xl sm:rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-950/30 border hover:border-orange-200 transition-all" onClick={() => handleAddSpecificReminder('book')}>
                              <div className="p-2 sm:p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg sm:rounded-xl mr-3 sm:mr-4">
                                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                              </div>
                              <div className="text-left">
                                <div className="font-semibold text-sm sm:text-base">10 Minutes Before</div>
                                <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Get ready to book immediately</div>
                              </div>
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </>
                ) : (
                  <div className="py-6 sm:py-10 text-muted-foreground">
                    <CalendarIcon className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 opacity-20" />
                    <p className="text-xs sm:text-base">Select a journey date to check availability</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
