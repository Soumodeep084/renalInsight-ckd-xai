import React from 'react';
import { OptionItem } from '../../data/formOptions';
import { ChevronDown } from 'lucide-react';

interface SelectFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: OptionItem[];
  disabled?: boolean;
  className?: string;
  hasError?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  value,
  onChange,
  options,
  disabled = false,
  className = '',
  hasError = false,
}) => {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full appearance-none bg-white border ${
          hasError
            ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500'
            : 'border-slate-300 hover:border-slate-400 focus:ring-teal-500 focus:border-teal-500'
        } text-slate-900 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 pr-10 font-medium shadow-2xs transition-all focus:outline-none focus:ring-2 focus:ring-opacity-20 disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
};
