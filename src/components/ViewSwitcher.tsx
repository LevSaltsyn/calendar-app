// FullCalendar view names used by the segmented switcher.
export type CalendarViewName =
  | 'dayGridMonth'
  | 'timeGridWeek'
  | 'timeGridDay'
  | 'listWeek';

const VIEWS: { name: CalendarViewName; label: string }[] = [
  { name: 'dayGridMonth', label: 'Month' },
  { name: 'timeGridWeek', label: 'Week' },
  { name: 'timeGridDay', label: 'Day' },
  { name: 'listWeek', label: 'Agenda' },
];

interface ViewSwitcherProps {
  current: CalendarViewName;
  onChange: (view: CalendarViewName) => void;
}

// Segmented Month / Week / Day / Agenda control shown on the title row. The
// active segment is highlighted in the brand blue, matching the mockup.
export function ViewSwitcher({ current, onChange }: ViewSwitcherProps) {
  return (
    <div className="inline-flex overflow-hidden rounded-md border border-slate-200 text-sm">
      {VIEWS.map(({ name, label }, index) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          className={`px-4 py-1.5 transition ${index > 0 ? 'border-l border-slate-200' : ''} ${
            current === name
              ? 'bg-[#4786ff]/5 font-medium text-[#4786ff]'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
