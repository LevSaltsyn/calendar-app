import { create } from 'zustand';
import type { CalendarEvent, EventDraft } from '../types/event';
import { loadEvents, saveEvents } from '../utils/localStorage';

/** Generate a reasonably-unique id without external dependencies. */
function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

interface EventsState {
  /** All events, kept in sync with `localStorage`. */
  events: CalendarEvent[];
  /** Create a new event from a draft and return its generated id. */
  addEvent: (draft: EventDraft) => string;
  /** Patch an existing event by id. */
  updateEvent: (id: string, patch: Partial<EventDraft>) => void;
  /** Remove an event by id. */
  deleteEvent: (id: string) => void;
}

/**
 * Central event store (Zustand).
 *
 * Every mutation writes the resulting list back to `localStorage` so state
 * survives reloads. The store is the single source of truth for the calendar.
 */
export const useEventsStore = create<EventsState>((set) => ({
  events: loadEvents(),

  addEvent: (draft) => {
    const event: CalendarEvent = { ...draft, id: createId() };
    set((state) => {
      const events = [...state.events, event];
      saveEvents(events);
      return { events };
    });
    return event.id;
  },

  updateEvent: (id, patch) => {
    set((state) => {
      const events = state.events.map((e) =>
        e.id === id ? { ...e, ...patch } : e,
      );
      saveEvents(events);
      return { events };
    });
  },

  deleteEvent: (id) => {
    set((state) => {
      const events = state.events.filter((e) => e.id !== id);
      saveEvents(events);
      return { events };
    });
  },
}));
