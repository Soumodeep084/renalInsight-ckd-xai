import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  children: React.ReactNode;
  badge?: string;
  className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  children,
  badge,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all hover:shadow-md ${className}`}>
      <div className="px-6 py-4.5 bg-slate-50/80 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 border border-teal-200/60 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{title}</span>
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 font-normal mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {badge && (
          <span className="px-2.5 py-1 bg-slate-200/70 text-slate-700 text-[11px] font-semibold rounded-md uppercase tracking-wider self-start sm:self-auto shrink-0">
            {badge}
          </span>
        )}
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
};
