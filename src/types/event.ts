/**
 * Domain types for calendar events.
 *
 * Events are persisted in `localStorage` and rendered by FullCalendar.
 * We keep `start`/`end` as ISO strings so the shape is trivially
 * serialisable and matches what FullCalendar's event API consumes.
 */

/** Maximum allowed length for an event title. */
export const MAX_TITLE_LENGTH: number = 30;

/** A single calendar event as stored by the app. */
export interface CalendarEvent {
  /** Stable unique identifier. */
  id: string;
  /** Event title — limited to {@link MAX_TITLE_LENGTH} characters. */
  title: string;
  /** ISO 8601 start datetime, e.g. `2018-01-02T10:00:00`. */
  start: string;
  /** ISO 8601 end datetime. Optional for all-day / open-ended events. */
  end?: string;
  /** Whether the event spans the whole day (no specific time). */
  allDay: boolean;
  /** Hex colour used for the event chip background. */
  color: string;
  /** Free-form notes shown in the event modal. */
  notes?: string;
}

/**
 * The editable subset of a {@link CalendarEvent}.
 * `id` is assigned by the store on creation, so it is omitted here.
 */
export type EventDraft = Omit<CalendarEvent, 'id'>;
