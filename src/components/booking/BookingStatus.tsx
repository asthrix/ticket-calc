
import { format } from "date-fns";
import { Sparkles, Lock, CheckCircle, Clock, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingStatusType } from "@/lib/booking-constants";

interface BookingStatusProps {
  status: BookingStatusType;
  isClosed: boolean;
  isTimeOpen: boolean;
  isTatkalClosed: boolean;
  isTatkal: boolean;
  daysRemaining: number;
  bookingTime: Date | undefined;
  currentStyle: any;
}

export function BookingStatus({
  status,
  isClosed,
  isTimeOpen,
  isTatkalClosed,
  isTatkal,
  daysRemaining,
  bookingTime,
  currentStyle
}: BookingStatusProps) {
  
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
  );
}
