import { format, isSameMonth, isSameYear, differenceInCalendarDays } from "date-fns";

export function formatDateRange(start: Date | string | null, end: Date | string | null): string {
  if (!start && !end) return "Dates TBD";
  if (start && !end) return format(new Date(start), "MMM d, yyyy");
  if (!start && end) return format(new Date(end), "MMM d, yyyy");

  const s = new Date(start!);
  const e = new Date(end!);

  if (isSameMonth(s, e) && isSameYear(s, e)) {
    return `${format(s, "MMM d")}–${format(e, "d, yyyy")}`;
  }
  if (isSameYear(s, e)) {
    return `${format(s, "MMM d")} – ${format(e, "MMM d, yyyy")}`;
  }
  return `${format(s, "MMM d, yyyy")} – ${format(e, "MMM d, yyyy")}`;
}

export function daysUntil(date: Date | string | null): number | null {
  if (!date) return null;
  return differenceInCalendarDays(new Date(date), new Date());
}

export function countdownLabel(start: Date | string | null, end: Date | string | null): string {
  const daysToStart = daysUntil(start);
  if (daysToStart === null) return "No dates set yet";
  if (end) {
    const daysToEnd = daysUntil(end);
    if (daysToEnd !== null && daysToEnd < 0) return "Trip completed";
    if (daysToStart <= 0 && daysToEnd !== null && daysToEnd >= 0) return "Happening now!";
  }
  if (daysToStart === 0) return "Starts today!";
  if (daysToStart === 1) return "1 day to go";
  if (daysToStart > 1) return `${daysToStart} days to go`;
  return "Trip completed";
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "EEE, MMM d · h:mm a");
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "EEE, MMM d, yyyy");
}

export function formatTime(date: Date | string): string {
  return format(new Date(date), "h:mm a");
}

export function formatDay(date: Date | string): string {
  return format(new Date(date), "EEEE, MMMM d");
}

export function formatDuration(start: Date | string, end: Date | string): string {
  // Flights aren't timezone-aware here, so an international arrival time can
  // read as numerically "before" departure (date-line crossing) — always
  // show a sensible positive duration rather than a confusing negative one.
  const minutes = Math.abs(Math.round((+new Date(end) - +new Date(start)) / 60_000));
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours <= 0) return `${mins}m`;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
