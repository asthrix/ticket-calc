
import { format } from "date-fns";
import { BookingStatusType } from "@/lib/booking-constants";

interface BookingInfoGridProps {
  bookingOpenDate: Date | undefined;
  status: BookingStatusType;
  isTatkal: boolean;
}

export function BookingInfoGrid({ bookingOpenDate, status, isTatkal }: BookingInfoGridProps) {
  if (!bookingOpenDate) return null;

  return (
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
  );
}
