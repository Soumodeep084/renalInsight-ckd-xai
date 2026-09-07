import React from 'react';

interface SegmentOption {
  value: string;
  label: string;
}

interface SegmentedToggleProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SegmentOption[];
  disabled?: boolean;
}

export const SegmentedToggle: React.FC<SegmentedToggleProps> = ({
  id,
  value,
  onChange,
  options,
  disabled = false,
}) => {
  return (
    <div
      id={id}
      className="flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 gap-1"
      role="radiogroup"
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              isSelected
                ? 'bg-white text-teal-800 shadow-xs ring-1 ring-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            } disabled:opacity-50 cursor-pointer`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
