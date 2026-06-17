import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import type { CalendarEvent } from '../types/event';
import { MAX_TITLE_LENGTH } from '../types/event';
import { useEventsStore } from '../store/eventsStore';
import {
  combineToIso,
  isPastDate,
  toDateInputValue,
  toTimeInputValue,
} from '../utils/datetime';
import { ColorPicker, EVENT_COLORS } from './ColorPicker';

// `view` shows an existing event read-only; `create` opens an empty form.
export type ModalMode = 'create' | 'view';

// Viewport coordinates of the click that opened the popover.
export interface AnchorPoint {
  x: number;
  y: number;
}

export interface ModalState {
  mode: ModalMode;
  anchor: AnchorPoint;
  event?: CalendarEvent;
  prefill?: { date: string; time: string };
}

interface FormValues {
  title: string;
  date: string;
  time: string;
  color: string;
  notes: string;
}

type FormErrors = Partial<Record<'title' | 'date' | 'time', string>>;

// Fixed popover width (320px @16px base) used for horizontal centring.
const POPOVER_WIDTH = 320;
const GAP = 12;

// Constrain a value to the [min, max] range.
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Build initial form values from an event (edit) or a prefill (create).
function buildInitialValues(state: ModalState): FormValues {
  if (!state.event) {
    return {
      title: '',
      date: state.prefill?.date ?? '',
      time: state.prefill?.time ?? '',
      color: EVENT_COLORS[0],
      notes: '',
    };
  }
  const start = new Date(state.event.start);
  return {
    title: state.event.title,
    date: toDateInputValue(start),
    time: state.event.allDay ? '' : toTimeInputValue(start),
    color: state.event.color,
    notes: state.event.notes ?? '',
  };
}

// Validate the form with custom (non-HTML5) messages. All fields are required
// and past dates are rejected.
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const title = values.title.trim();

  if (!title) errors.title = 'Event name is required.';
  else if (title.length > MAX_TITLE_LENGTH)
    errors.title = `Maximum ${MAX_TITLE_LENGTH} characters.`;

  if (!values.date) errors.date = 'Event date is required.';
  else if (isPastDate(values.date)) errors.date = 'Past dates are not allowed.';

  if (!values.time) errors.time = 'Event time is required.';

  return errors;
}

// Event popover anchored to the clicked date cell / event. The ✕ and Cancel
// close without saving; in view mode Discard deletes and Edit starts editing.
export function EventModal({
  state,
  onClose,
}: {
  state: ModalState;
  onClose: () => void;
}) {
  const [isEditing, setIsEditing] = useState(state.mode === 'create');

  // Close on Escape key.
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <Popover anchor={state.anchor} onClose={onClose}>
      {state.event && !isEditing ? (
        <EventDetails event={state.event} onEdit={() => setIsEditing(true)} onClose={onClose} />
      ) : (
        <EventForm state={state} onClose={onClose} />
      )}
    </Popover>
  );
}

// Positions its children near the anchor with an arrow pointing at it, and
// closes when the user clicks the surrounding backdrop.
function Popover({
  anchor,
  onClose,
  children,
}: {
  anchor: AnchorPoint;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ left: 0, top: -9999, arrowOnTop: true, arrowLeft: 0 });

  // Centre the popover on the click point, with the arrow pointing at the cursor.
  // Place it below the click, flipping above when it would overflow the viewport.
  useLayoutEffect(() => {
    const height = popoverRef.current?.offsetHeight ?? 0;
    const centerX = anchor.x;
    const centerY = anchor.y;

    const left = clamp(centerX - POPOVER_WIDTH / 2, GAP, window.innerWidth - POPOVER_WIDTH - GAP);
    const fitsBelow = centerY + GAP + height <= window.innerHeight;
    const top = fitsBelow ? centerY + GAP : centerY - GAP - height;
    const arrowLeft = clamp(centerX - left, 16, POPOVER_WIDTH - 16);

    setLayout({ left, top, arrowOnTop: fitsBelow, arrowLeft });
  }, [anchor]);

  return (
    <div className="fixed inset-0 z-50" onMouseDown={onClose}>
      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="true"
        style={{ left: layout.left, top: layout.top, width: POPOVER_WIDTH }}
        className="absolute rounded-xl border border-slate-300 bg-white p-6 shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Arrow pointing at the anchored date / event */}
        <span
          style={{ left: layout.arrowLeft }}
          className={`absolute h-3 w-3 -translate-x-1/2 rotate-45 border-slate-300 bg-white ${
            layout.arrowOnTop
              ? '-top-1.5 border-l border-t'
              : '-bottom-1.5 border-b border-r'
          }`}
        />
        {children}
      </div>
    </div>
  );
}

// Read-only view of an event with Discard (delete) and Edit actions.
function EventDetails({
  event,
  onEdit,
  onClose,
}: {
  event: CalendarEvent;
  onEdit: () => void;
  onClose: () => void;
}) {
  const deleteEvent = useEventsStore((state) => state.deleteEvent);
  const start = new Date(event.start);

  function discard() {
    deleteEvent(event.id);
    onClose();
  }

  return (
    <div className="space-y-4">
      <CloseButton onClose={onClose} />

      {/* Title with colour dot */}
      <div className="flex items-center gap-2 pr-6">
        <span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: event.color }} />
        <h2 className="truncate text-lg font-semibold text-slate-800">{event.title}</h2>
      </div>

      {/* Date / time / notes */}
      <dl className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <CalendarIcon size={15} className="text-slate-400" />
          <dd>{start.toLocaleDateString()}</dd>
        </div>
        {!event.allDay && (
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-slate-400" />
            <dd>{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</dd>
          </div>
        )}
        {event.notes && <p className="whitespace-pre-wrap text-slate-600">{event.notes}</p>}
      </dl>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={discard} className="text-sm font-semibold uppercase tracking-wide text-red-500 transition hover:text-red-600">
          Discard
        </button>
        <button type="button" onClick={onEdit} className="text-sm font-semibold uppercase tracking-wide text-slate-500 transition hover:text-slate-700">
          Edit
        </button>
      </div>
    </div>
  );
}

// Editable form for creating a new event or editing an existing one.
function EventForm({ state, onClose }: { state: ModalState; onClose: () => void }) {
  const addEvent = useEventsStore((store) => store.addEvent);
  const updateEvent = useEventsStore((store) => store.updateEvent);
  const [values, setValues] = useState<FormValues>(() => buildInitialValues(state));
  const [errors, setErrors] = useState<FormErrors>({});
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  // Focus the title field on open.
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function updateField(field: keyof FormValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  // Validate, then add or update the event and close.
  function save() {
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      title: values.title.trim(),
      start: combineToIso(values.date, values.time),
      allDay: false,
      color: values.color,
      notes: values.notes.trim() || undefined,
    };

    if (state.event) updateEvent(state.event.id, payload);
    else addEvent(payload);
    onClose();
  }

  const inputClass =
    'w-full border-b border-slate-200 pb-1 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#4786ff]';

  return (
    <form className="space-y-4" noValidate onSubmit={(event) => { event.preventDefault(); save(); }}>
      <CloseButton onClose={onClose} />

      {/* Title */}
      <div>
        <input
          ref={titleRef}
          type="text"
          placeholder="event name"
          value={values.title}
          maxLength={MAX_TITLE_LENGTH}
          onChange={(event) => updateField('title', event.target.value)}
          className={`${inputClass} pr-10`}
        />
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-red-500">{errors.title}</p>
          <span className="text-xs text-slate-400">{MAX_TITLE_LENGTH - values.title.length}</span>
        </div>
      </div>

      {/* Date — Lucide button opens the native date picker */}
      <div>
        <div className="relative">
          <input ref={dateRef} type="date" placeholder="event date" value={values.date} onChange={(event) => updateField('date', event.target.value)} className={`${inputClass} pr-8`} />
          <button type="button" aria-label="Pick date" onClick={() => dateRef.current?.showPicker()} className="absolute right-0 top-0 text-slate-400 hover:text-slate-600">
            <CalendarIcon size={18} />
          </button>
        </div>
        {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
      </div>

      {/* Time — Lucide button opens the native time picker */}
      <div>
        <div className="relative">
          <input ref={timeRef} type="time" placeholder="event time" value={values.time} onChange={(event) => updateField('time', event.target.value)} className={`${inputClass} pr-8`} />
          <button type="button" aria-label="Pick time" onClick={() => timeRef.current?.showPicker()} className="absolute right-0 top-0 text-slate-400 hover:text-slate-600">
            <Clock size={18} />
          </button>
        </div>
        {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time}</p>}
      </div>

      {/* Notes */}
      <textarea
        placeholder="notes"
        rows={2}
        value={values.notes}
        onChange={(event) => updateField('notes', event.target.value)}
        className={`${inputClass} resize-none`}
      />

      {/* Colour */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-sm text-slate-400">Color</span>
        <ColorPicker value={values.color} onChange={(color) => updateField('color', color)} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onClose} className="text-sm font-medium text-red-500 transition hover:text-red-600">
          Cancel
        </button>
        <button type="submit" className="text-sm font-medium text-indigo-500 transition hover:text-indigo-600">
          Save
        </button>
      </div>
    </form>
  );
}

// Circular ✕ button shown in the popover's top-right corner.
function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClose}
      className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-slate-300 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
    >
      <X size={16} />
    </button>
  );
}
