import { format, subDays, addDays, getDaysInMonth, getDay, startOfMonth } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateForApi(date: Date): string {
  return format(date, 'dd-MM-yyyy');
}

export function getToday(): string {
  return formatDate(new Date());
}

export function getYesterday(): string {
  return formatDate(subDays(new Date(), 1));
}

export function getTomorrow(): string {
  return formatDate(addDays(new Date(), 1));
}

export function getDayOfWeek(date: Date): number {
  return getDay(date);
}

export function isFriday(date: Date): boolean {
  return getDayOfWeek(date) === 5;
}

export function parseTimeString(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  now.setHours(hours, minutes, 0, 0);
  return now;
}

export function formatTime(timeStr: string): string {
  return `${timeStr} Uhr`;
}

export function minutesToDisplay(minutes: number): string {
  if (minutes < 1) return 'Jetzt';
  if (minutes < 60) return `${minutes} Min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getCalendarData(year: number, month: number) {
  const firstDay = startOfMonth(new Date(year, month - 1));
  const daysInMonth = getDaysInMonth(firstDay);
  let startDayOfWeek = getDay(firstDay);
  // Convert Sunday=0 to Monday-based (Mon=0, Sun=6)
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  return { daysInMonth, startDayOfWeek };
}

export function daysSince(dateStr: string): number {
  const then = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - then.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
