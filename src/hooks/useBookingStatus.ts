
import { useState, useEffect } from "react";
import { differenceInDays, subDays, isBefore, startOfDay } from "date-fns";
import { STATUS_STYLES, BookingStatusType } from "@/lib/booking-constants";

export function useBookingStatus(date: Date | undefined, isTatkal: boolean) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 60); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const advanceDays = isTatkal ? 1 : 60;
  const bookingOpenDate = date ? subDays(date, advanceDays) : undefined;
  const today = startOfDay(new Date());
  
  const isBookingOpen = bookingOpenDate 
    ? isBefore(bookingOpenDate, today) || bookingOpenDate.getTime() === today.getTime() 
    : false;
    
  const daysRemaining = bookingOpenDate ? differenceInDays(bookingOpenDate, today) : 0;
  
  // Determine base status
  const status: BookingStatusType = daysRemaining < 0 ? 'past' : daysRemaining === 0 ? 'present' : 'future';

  // Calculate booking time
  const bookingTime = bookingOpenDate ? new Date(bookingOpenDate) : undefined;
  if (bookingTime) {
    bookingTime.setHours(12, 0, 0, 0); 
    if (isTatkal) bookingTime.setUTCHours(4, 30, 0, 0); // 10:00 AM IST
    else bookingTime.setUTCHours(2, 30, 0, 0); // 8:00 AM IST
  }

  const isTimeOpen = bookingTime ? now >= bookingTime : false;

  // Calculate Tatkal closing status
  const tatkalClosingTime = bookingTime ? new Date(bookingTime) : undefined;
  if (tatkalClosingTime) tatkalClosingTime.setHours(11, 15, 0, 0);
  
  const isTatkalClosed = isTatkal && status === 'present' && tatkalClosingTime ? now > tatkalClosingTime : false;
  const isClosed = isTatkalClosed || (isTatkal && status === 'past');

  // Determine final style
  const currentStyle = isClosed ? STATUS_STYLES.past : STATUS_STYLES[status];

  return {
    status,
    isBookingOpen,
    daysRemaining,
    bookingOpenDate,
    bookingTime,
    isTimeOpen,
    isClosed,
    isTatkalClosed,
    currentStyle,
    now
  };
}
