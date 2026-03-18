/**
 * ColorPicker — combines preset swatches with a full HTML5 color wheel.
 * 
 * HCI Rationale: Preset swatches support recognition (Nielsen H6), while
 * the color wheel enables power users to input any colour — flexibility
 * and efficiency of use (Nielsen H7).
 */

import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presets?: { name: string; value: string }[];
  label?: string;
  className?: string;
}

const ColorPicker = ({ value, onChange, presets, label, className }: ColorPickerProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
      )}
      <div className="flex gap-1.5 flex-wrap items-center">
        {presets?.map(c => (
          <button
            key={c.value}
            onClick={() => onChange(c.value)}
            className={cn(
              'h-6 w-6 rounded-full border-2 transition-all',
              value === c.value ? 'border-primary scale-110' : 'border-border hover:scale-105'
            )}
            style={{ backgroundColor: c.value }}
            title={c.name}
            aria-label={`Colour: ${c.name}`}
          />
        ))}
        {/* Full colour wheel — native HTML5 color input */}
        <label
          className={cn(
            'h-6 w-6 rounded-full border-2 border-border cursor-pointer overflow-hidden relative',
            'hover:border-primary transition-all flex items-center justify-center'
          )}
          title="Custom colour"
          aria-label="Pick a custom colour"
        >
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <span className="text-[8px] pointer-events-none">🎨</span>
        </label>
        {/* Show current hex */}
        <input
          type="text"
          value={value}
          onChange={e => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v);
          }}
          onBlur={e => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v);
          }}
          className="h-6 w-16 text-[10px] font-mono border rounded px-1 bg-background text-foreground"
          maxLength={7}
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

export default ColorPicker;
