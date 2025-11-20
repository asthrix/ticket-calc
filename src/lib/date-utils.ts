import { addDays, format, subDays } from "date-fns";

// IRCTC General Booking opens 60 days in advance (excluding journey date)
// Effectively, if you want to travel on Day X, booking opens on Day X - 60.
export const calculateBookingDate = (journeyDate: Date): Date => {
  return subDays(journeyDate, 60);
};

export const getGoogleCalendarUrl = (
  title: string,
  details: string,
  location: string,
  startDate: Date,
  endDate?: Date
) => {
  const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : formatDate(addDays(startDate, 1)); // Default to 1 day event if no end date

  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.append("action", "TEMPLATE");
  url.searchParams.append("text", title);
  url.searchParams.append("details", details);
  url.searchParams.append("location", location);
  url.searchParams.append("dates", `${start}/${end}`);

  return url.toString();
};
