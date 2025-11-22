
import { format, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Sparkles, Bell, Wallet, Clock } from "lucide-react";
import { toast } from "sonner";
import { getGoogleCalendarUrl } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { IRCTC_WEB_URL, APP_SCHEME, PLAY_STORE_URL, APP_STORE_URL, BookingStatusType } from "@/lib/booking-constants";

interface BookingActionsProps {
  status: BookingStatusType;
  isClosed: boolean;
  isTimeOpen: boolean;
  currentStyle: any;
  date: Date | undefined;
  bookingTime: Date | undefined;
  isTatkal: boolean;
  isMobile: boolean;
}

export function BookingActions({
  status,
  isClosed,
  isTimeOpen,
  currentStyle,
  date,
  bookingTime,
  isTatkal,
  isMobile
}: BookingActionsProps) {
  
  const showActionBtn = status === 'past' || (status === 'present' && isTimeOpen);

  const handleBookNow = () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Simple OS detection
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;

    if (isMobile) {
      toast.info("Opening IRCTC App...");
      
      if (isAndroid) {
        window.location.href = APP_SCHEME;
        setTimeout(() => { window.location.href = PLAY_STORE_URL; }, 2500);
      } else if (isIOS) {
        window.location.href = APP_SCHEME;
        setTimeout(() => { window.location.href = APP_STORE_URL; }, 2500);
      } else {
        window.open(IRCTC_WEB_URL, '_blank');
      }
    } else {
      window.open(IRCTC_WEB_URL, '_blank');
      toast.success("Opening IRCTC Website...");
    }
  };

  const handleAddSpecificReminder = (type: 'prep' | 'book') => {
    if (!date || !bookingTime) return;

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

    window.open(getGoogleCalendarUrl(title, description, "IRCTC", eventStartTime, eventEndTime), "_blank");
    toast.success("Opening Google Calendar...");
  };

  return (
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
  );
}
