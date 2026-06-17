import { Check } from 'lucide-react';

// Preset palette for event colours. The first entry (Impekable blue) matches
// the event chips in the reference design and is used as the default.
export const EVENT_COLORS = [
  '#4786ff', // blue (default — matches mockup)
  '#34c759', // green
  '#ff9500', // orange
  '#ff3b30', // red
  '#af52de', // purple
  '#00b8d9', // teal
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

// A row of colour swatches for choosing an event colour. The selected swatch
// shows a check mark.
export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Event color">
      {EVENT_COLORS.map((color) => {
        const isSelected = color === value;
        return (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`Color ${color}`}
            onClick={() => onChange(color)}
            className="grid h-6 w-6 place-items-center rounded-full ring-1 ring-black/5 transition-transform hover:scale-110"
            style={{ backgroundColor: color }}
          >
            {isSelected && <Check size={14} className="text-white" />}
          </button>
        );
      })}
    </div>
  );
}
