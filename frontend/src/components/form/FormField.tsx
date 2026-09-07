import React from 'react';
import { Tooltip } from '../common/Tooltip';

interface FormFieldProps {
  id: string;
  label: string;
  unit?: string;
  tooltip?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  unit,
  tooltip,
  required = false,
  error,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 select-none"
        >
          <span>{label}</span>
          {unit && <span className="text-slate-400 font-normal">({unit})</span>}
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>

        {tooltip && <Tooltip content={tooltip} />}
      </div>

      <div>{children}</div>

      {error && (
        <p className="text-[11px] text-rose-600 font-medium animate-fade-in flex items-center gap-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
