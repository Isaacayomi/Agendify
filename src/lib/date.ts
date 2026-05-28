import {
  addDays,
  differenceInMinutes,
  format,
  isSameDay,
  isTomorrow,
  parse,
  parseISO,
  set,
} from "date-fns";

export function getTodayDate(): Date {
  return new Date();
}

export function getNowIso(): string {
  return getTodayDate().toISOString();
}

export function getTodayDateString(): string {
  return format(getTodayDate(), "yyyy-MM-dd");
}

export function getTomorrowDateString(): string {
  return format(addDays(getTodayDate(), 1), "yyyy-MM-dd");
}

export function getTodayHeaderLabel(): string {
  return format(getTodayDate(), "EEEE, MMMM d").toUpperCase();
}

export function createIsoDateAtTime(
  baseDate: Date,
  hour: number,
  minute = 0,
): string {
  return set(baseDate, {
    hours: hour,
    minutes: minute,
    seconds: 0,
    milliseconds: 0,
  }).toISOString();
}

export function createIsoDateForToday(hour: number, minute = 0): string {
  return createIsoDateAtTime(getTodayDate(), hour, minute);
}

export function createIsoDateForTomorrow(hour: number, minute = 0): string {
  return createIsoDateAtTime(addDays(getTodayDate(), 1), hour, minute);
}

export function isTodayIso(dateString: string): boolean {
  return isSameDay(parseISO(dateString), getTodayDate());
}

export function isSameIsoDate(referenceIso: string, targetIso: string): boolean {
  return isSameDay(parseISO(referenceIso), parseISO(targetIso));
}

export function formatClockTime(dateString: string): string {
  return format(parseISO(dateString), "HH:mm");
}

export function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatClockTime(startIso)} - ${formatClockTime(endIso)}`;
}

export function formatDurationLabel(startIso: string, endIso: string): string {
  const totalMinutes = differenceInMinutes(parseISO(endIso), parseISO(startIso));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.abs(totalMinutes % 60);

  return `${hours}H ${minutes.toString().padStart(2, "0")}M`;
}

export function formatBlogPublishedDate(dateString: string): string {
  const date = parseISO(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return format(date, "MMM d, yyyy");
}

export function formatUpcomingDateLabel(dateString: string): string {
  const date = parseISO(dateString);
  const timeLabel = format(date, "HH:mm");

  if (isTodayIso(dateString)) {
    return `Today . ${timeLabel}`;
  }

  if (isTomorrow(date)) {
    return `Tomorrow . ${timeLabel}`;
  }

  return `${format(date, "EEE")} . ${timeLabel}`;
}

export function combineDateAndTime(dateString: string, timeString: string): string {
  return parse(`${dateString} ${timeString}`, "yyyy-MM-dd HH:mm", getTodayDate()).toISOString();
}
