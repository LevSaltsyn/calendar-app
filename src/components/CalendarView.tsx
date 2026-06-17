import { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  DayHeaderContentArg,
  EventClickArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";
import type {
  DateClickArg,
  EventResizeDoneArg,
} from "@fullcalendar/interaction";
import { useEventsStore } from "../store/eventsStore";
import { toDateInputValue, toTimeInputValue } from "../utils/datetime";
import { EventModal } from "./EventModal";
import type { AnchorPoint, ModalState } from "./EventModal";
import { ViewSwitcher } from "./ViewSwitcher";
import type { CalendarViewName } from "./ViewSwitcher";

// Map the browser click event to viewport coordinates for the popover anchor.
function toAnchorPoint(jsEvent: MouseEvent): AnchorPoint {
  return { x: jsEvent.clientX, y: jsEvent.clientY };
}

// Week / day column headers read "Sun 31/12" in the mockup; month headers stay
// as the plain weekday ("SUN", upper-cased via CSS).
function renderDayHeader(arg: DayHeaderContentArg): string {
  if (arg.view.type === "dayGridMonth") return arg.text;
  const weekday = arg.date.toLocaleDateString("en-US", { weekday: "short" });
  const day = String(arg.date.getDate()).padStart(2, "0");
  const month = String(arg.date.getMonth() + 1).padStart(2, "0");
  return `${weekday} ${day}/${month}`;
}

// Main calendar screen: FullCalendar (month / week / day / agenda) wired to the
// events store, plus the create/view event popover. FullCalendar orders same-day
// events by time and lays out overlapping events automatically.
export function CalendarView() {
  const events = useEventsStore((state) => state.events);
  const updateEvent = useEventsStore((state) => state.updateEvent);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [view, setView] = useState<CalendarViewName>("dayGridMonth");
  const calendarRef = useRef<FullCalendar>(null);

  // Map stored events into FullCalendar's input shape.
  const calendarEvents: EventInput[] = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    allDay: event.allDay,
    backgroundColor: event.color,
    borderColor: event.color,
  }));

  // Switch view from the segmented control above the calendar.
  function changeView(next: CalendarViewName) {
    calendarRef.current?.getApi().changeView(next);
    setView(next);
  }

  // Clicking a date opens the create popover anchored to that day cell.
  function openCreatePopover(arg: DateClickArg) {
    setModal({
      mode: "create",
      anchor: toAnchorPoint(arg.jsEvent),
      prefill: {
        date: toDateInputValue(arg.date),
        time: arg.allDay ? "" : toTimeInputValue(arg.date),
      },
    });
  }

  // Clicking an existing event opens the view popover anchored to that event.
  function openViewPopover(arg: EventClickArg) {
    const event = events.find((item) => item.id === arg.event.id);
    if (event)
      setModal({ mode: "view", event, anchor: toAnchorPoint(arg.jsEvent) });
  }

  // Persist a new start/end after drag-and-drop or resize.
  function saveMovedEvent(arg: EventDropArg | EventResizeDoneArg) {
    if (!arg.event.start) return;
    updateEvent(arg.event.id, {
      start: arg.event.start.toISOString(),
      end: arg.event.end?.toISOString(),
      allDay: arg.event.allDay,
    });
  }

  return (
    <div className="calendar-card">
      {/* Title row: heading on the left, view switcher on the right */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-slate-700">Calendar View</h2>
        <ViewSwitcher current={view} onChange={changeView} />
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "today,back,forward",
          center: "title",
          right: "",
        }}
        buttonText={{ today: "Today" }}
        customButtons={{
          // The mockup uses text "Back" / "Next" instead of arrow icons.
          back: {
            text: "Back",
            click: () => calendarRef.current?.getApi().prev(),
          },
          forward: {
            text: "Next",
            click: () => calendarRef.current?.getApi().next(),
          },
        }}
        // Keep our switcher in sync when navigation changes the view.
        datesSet={(arg) => setView(arg.view.type as CalendarViewName)}
        allDayText="all day"
        slotDuration="02:00:00"
        snapDuration="00:30:00"
        slotLabelInterval={{ hours: 2 }}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        dayHeaderContent={renderDayHeader}
        // Titles per view: "Dec 31 - Jan 6" (week) and "Tuesday Jan 2" (day).
        views={{
          timeGridWeek: { titleFormat: { month: "short", day: "numeric" } },
          timeGridDay: {
            titleFormat: { weekday: "long", month: "short", day: "numeric" },
          },
        }}
        editable
        dayMaxEvents
        height="auto"
        nowIndicator
        events={calendarEvents}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        dateClick={openCreatePopover}
        eventClick={openViewPopover}
        eventDrop={saveMovedEvent}
        eventResize={saveMovedEvent}
      />

      {modal && <EventModal state={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
