import React from 'react';

interface InputFieldProps {
  id: string;
  type?: 'text' | 'number';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  hasError?: boolean;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
  disabled = false,
  hasError = false,
  className = '',
}) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={`w-full bg-white border ${
        hasError
          ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500'
          : 'border-slate-300 hover:border-slate-400 focus:ring-teal-500 focus:border-teal-500'
      } text-slate-900 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 font-medium shadow-2xs transition-all focus:outline-none focus:ring-2 focus:ring-opacity-20 disabled:bg-slate-100 disabled:text-slate-400 ${className}`}
    />
  );
};
