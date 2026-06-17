import type { CalendarEvent } from '../types/event';

const STORAGE_KEY = 'calendar-events';

// Load the persisted events. Returns an empty array when nothing is stored or
// the stored value can't be parsed, so callers never deal with null.
export function loadEvents(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Persist the full event list. Fails silently if storage is unavailable
// (private mode / quota) so the app keeps working with in-memory state.
export function saveEvents(events: CalendarEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Ignore storage errors.
  }
}
