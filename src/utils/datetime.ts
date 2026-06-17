/**
 * Date/time helpers for converting between ISO strings (used internally and
 * by FullCalendar) and the `<input type="date">` / `<input type="time">`
 * string formats used by the event modal form.
 */

/** Pad a number to two digits (`5` → `"05"`). */
const pad = (n: number): string => String(n).padStart(2, '0');

/** Format a `Date` as a local `YYYY-MM-DD` string (for date inputs). */
export function toDateInputValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Format a `Date` as a local `HH:mm` string (for time inputs). */
export function toTimeInputValue(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Combine a `YYYY-MM-DD` date string and an optional `HH:mm` time string into
 * a local ISO-like string consumable by FullCalendar (`2018-01-02T10:00:00`).
 * When `time` is empty the event is treated as all-day (date only).
 */
export function combineToIso(date: string, time: string): string {
  return time ? `${date}T${time}:00` : date;
}

/** `true` when the given date string is strictly before today (local). */
export function isPastDate(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${date}T00:00:00`);
  return target.getTime() < today.getTime();
}
