"use client";

import { useState, useEffect } from "react";
import { addDays, format, differenceInDays, subDays, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, Train, Bell, Smartphone, Wallet, ChevronRight, Sparkles, Lock, CheckCircle } from "lucide-react";
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 60); // Update every minute
    return () => clearInterval(timer);
  }, []);

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
  
  // Determine status for styling
  const status = daysRemaining < 0 ? 'past' : daysRemaining === 0 ? 'present' : 'future';

  // Centralized color configuration for easy updates
  const statusStyles = {
    past: {
      glow: "bg-rose-500",
      icon: "bg-rose-100 text-rose-600",
      text: "bg-linear-to-br from-rose-500 via-primary to-rose-500 bg-clip-text text-transparent",
      button: "bg-linear-to-r from-rose-500 to-primary  opacity-90 hover:opacity-100 shadow-lg text-background",
    },
    present: {
      glow: "bg-linear-to-r from-emerald-500 to-teal-500",
      icon: "bg-emerald-100 text-emerald-600",
      text: "bg-linear-to-br from-emerald-500 via-primary to-emerald-500 bg-clip-text text-transparent",
      button: "bg-linear-to-r from-emerald-500 to-primary  opacity-90 hover:opacity-100 shadow-lg text-background",
    },
    future: {
      glow: "bg-violet-500",
      icon: "bg-violet-100 text-violet-600",
      text: "bg-linear-to-br from-violet-500 via-primary to-violet-500 bg-clip-text text-transparent",
      button: "bg-linear-to-r from-violet-500 to-primary  opacity-90 hover:opacity-100 shadow-lg text-background",
    }
  };

  // Calculate booking time for display and reminders
  const bookingTime = bookingOpenDate ? new Date(bookingOpenDate) : undefined;
  if (bookingTime) {
    bookingTime.setHours(12, 0, 0, 0); 
    if (isTatkal) bookingTime.setUTCHours(4, 30, 0, 0);
    else bookingTime.setUTCHours(2, 30, 0, 0);
  }

  const isTimeOpen = bookingTime ? now >= bookingTime : false;

  // Calculate Tatkal closing status
  const tatkalClosingTime = bookingTime ? new Date(bookingTime) : undefined;
  if (tatkalClosingTime) tatkalClosingTime.setHours(11, 15, 0, 0);
  
  const isTatkalClosed = isTatkal && status === 'present' && tatkalClosingTime ? now > tatkalClosingTime : false;
  const isClosed = isTatkalClosed || (isTatkal && status === 'past');

  // Override style if closed
  const currentStyle = isClosed ? statusStyles.past : statusStyles[status];

  const handleBookNow = () => {
    if (!isBookingOpen) return;
    
    const webUrl = 'https://www.irctc.co.in/nget/train-search';
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Simple OS detection
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;

    if (isMobile) {
      toast.info("Opening IRCTC App...");
      
      const appScheme = 'irctcconnect://';
      const playStoreUrl = 'https://play.google.com/store/apps/details?id=cris.org.in.prs.ima';
      const appStoreUrl = 'https://apps.apple.com/in/app/irctc-rail-connect/id1164063471';

      if (isAndroid) {
        // Try opening via custom scheme
        window.location.href = appScheme;
        
        // Fallback to Play Store if app doesn't open
        setTimeout(() => {
          window.location.href = playStoreUrl;
        }, 2500);
      } else if (isIOS) {
        // Try custom scheme for iOS
        window.location.href = appScheme;
        
        // Fallback to App Store if app doesn't open
        setTimeout(() => {
           window.location.href = appStoreUrl;
        }, 2500);
      } else {
        // Other mobile devices
        window.open(webUrl, '_blank');
      }
    } else {
      // Desktop
      window.open(webUrl, '_blank');
      toast.success("Opening IRCTC Website...");
    }
  };

  const handleAddSpecificReminder = (type: 'prep' | 'book') => {
    if (!date || !bookingOpenDate || !bookingTime) return;

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

    // Unified behavior: Always open Google Calendar
    window.open(getGoogleCalendarUrl(title, description, "IRCTC", eventStartTime, eventEndTime), "_blank");
    toast.success("Opening Google Calendar...");
  };

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
              <div className="hidden md:block ">
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
                (() => {
                  const showActionBtn = status === 'past' || (status === 'present' && isTimeOpen);

                  // Determine Icon and Color
                  let StatusIcon = CalendarIcon;
                  let iconColor = "text-violet-500";
                  let glowColor = "bg-violet-500/20";

                  if (isClosed) {
                    StatusIcon = Lock;
                    iconColor = "text-rose-500";
                    glowColor = "bg-rose-500/20";
                  } else if (status === 'present') {
                    if (isTimeOpen) {
                      StatusIcon = CheckCircle;
                      iconColor = "text-emerald-500";
                      glowColor = "bg-emerald-500/20";
                    } else {
                      StatusIcon = Clock;
                      iconColor = "text-amber-500";
                      glowColor = "bg-amber-500/20";
                    }
                  } else if (status === 'past') {
                    StatusIcon = Lock;
                    iconColor = "text-rose-500";
                    glowColor = "bg-rose-500/20";
                  }

                  return (
                    <div className="w-full space-y-8">
                      {/* Status Icon & Text */}
                      <div className="space-y-6">
                        <div className="relative group inline-block">
                          <div className={cn("absolute inset-0 blur-3xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-700", glowColor.replace('/20', '/60'))} />
                          <StatusIcon className={cn("relative h-20 w-20 sm:h-24 sm:w-24 transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl", iconColor)} strokeWidth={1.5} />
                        </div>

                        <div className="space-y-2">
                          <div className={cn(
                            "text-3xl sm:text-5xl font-bold tracking-tighter bg-clip-text text-transparent",
                            currentStyle.text
                          )}>
                            {isClosed 
                              ? "CLOSED"
                              : status === 'present' 
                                ? (isTimeOpen ? "OPEN NOW" : "OPENS SOON") 
                                : status === 'past' 
                                  ? "YOU ARE LATE" 
                                  : `${daysRemaining} ${Math.abs(daysRemaining) === 1 ? "DAY" : "DAYS"} LEFT`
                            }
                          </div>
                          <p className="text-base sm:text-lg text-muted-foreground font-medium">
                            {isTatkalClosed 
                              ? "Tatkal quota usually fills within minutes."
                              : isTatkal && status === 'past'
                                ? "Opened yesterday at 10/11 AM."
                                : status === 'present' 
                                  ? (isTimeOpen ? "Booking is live! Hurry up!" : `Opens at ${bookingTime ? format(bookingTime, "h:mm a") : "soon"}`)
                                  : status === 'past' 
                                    ? `Opened ${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? "day" : "days"} ago` 
                                    : "Until booking opens"
                            }
                          </p>
                        </div>
                      </div>

                      {/* Info Grid */}
                      {bookingOpenDate && (
                        <div className="w-full max-w-md mx-auto">
                          <div className="bg-background/50 border rounded-2xl flex divide-x divide-border/50 relative overflow-hidden group hover:bg-background/60 transition-colors">
                            {/* Date Section */}
                            <div className="flex-1 p-3 sm:p-4 flex flex-col items-center justify-center gap-1">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                                {status === 'past' ? "Opened On" : "Opens On"}
                              </span>
                              <span className="text-lg sm:text-xl font-bold text-foreground text-center leading-tight">
                                {format(bookingOpenDate, "d MMM yyyy")}
                              </span>
                            </div>

                            {/* Time Section */}
                            <div className="flex-1 p-3 sm:p-4 flex flex-col items-center justify-center gap-1">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Time</span>
                              {isTatkal ? (
                                <div className="flex flex-col items-center gap-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-foreground">10:00 AM</span>
                                    <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">AC</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-foreground">11:00 AM</span>
                                    <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">Non-AC</span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-lg sm:text-xl font-bold text-foreground">08:00 AM</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="pt-4 w-full max-w-sm mx-auto">
                        {showActionBtn ? (
                          <Button 
                            size="lg" 
                            className={cn(
                              "w-full h-14 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]",
                              currentStyle.button
                            )}
                            onClick={handleBookNow}
                          >
                            <Sparkles className="mr-2 h-5 w-5" />
                            {isClosed ? "Check Status" : (status === 'present' ? "Book Now" : "Check Availability")}
                          </Button>
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="lg" 
                                className={cn(
                                  "w-full h-14 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] text-white",
                                  currentStyle.button
                                )}
                              >
                                <Bell className="mr-2 h-5 w-5" />
                                {status === 'present' ? "Set Reminder" : "Set Reminder"}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[90%] sm:max-w-md rounded-4xl p-6">
                              <DialogHeader className="space-y-3">
                                <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                                  <Bell className="h-6 w-6 text-primary" />
                                </div>
                                <DialogTitle className="text-2xl text-center">Set Reminders</DialogTitle>
                                <DialogDescription className="text-center text-base">Never miss your booking window.</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-3 py-6">
                                <Button variant="outline" className="h-auto p-4 justify-start rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-950/30 border hover:border-blue-200 transition-all group" onClick={() => handleAddSpecificReminder('prep')}>
                                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                                    <Wallet className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div className="text-left">
                                    <div className="font-bold text-base">1 Day Before</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                      {bookingTime ? format(subDays(bookingTime, 1), "EEE, d MMM 'at' h:mm a") : "Prepare wallet & passenger list"}
                                    </div>
                                  </div>
                                </Button>
                                <Button variant="outline" className="h-auto p-4 justify-start rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-950/30 border hover:border-orange-200 transition-all group" onClick={() => handleAddSpecificReminder('book')}>
                                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                                    <Clock className="h-5 w-5 text-orange-600" />
                                  </div>
                                  <div className="text-left">
                                    <div className="font-bold text-base">10 Minutes Before</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                      {bookingTime ? format(new Date(bookingTime.getTime() - 10 * 60000), "EEE, d MMM 'at' h:mm a") : "Get ready to book immediately"}
                                    </div>
                                  </div>
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  );
                })()
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
