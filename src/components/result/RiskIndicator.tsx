import React from 'react';
import { RiskLevel } from '../../types/ckd';
import { getRiskBadgeStyle } from '../../utils/formatters';

interface RiskIndicatorProps {
  riskLevel: RiskLevel;
  probability: number;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ riskLevel, probability }) => {
  const style = getRiskBadgeStyle(riskLevel);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Risk Assessment Level
        </span>
        <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${style.bg} ${style.text} ${style.border}`}>
          <span className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`} />
          <span>{riskLevel.toUpperCase()} RISK</span>
        </div>
      </div>

      {/* Visual Risk Spectrum Bar */}
      <div className="relative pt-1">
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200">
          <div className="w-1/3 bg-emerald-400/80 rounded-l-full" title="Low Risk (0-30%)"></div>
          <div className="w-1/3 bg-amber-400/80" title="Moderate Risk (30-70%)"></div>
          <div className="w-1/3 bg-rose-400/80 rounded-r-full" title="High Risk (70-100%)"></div>
        </div>

        {/* Current Position Marker Indicator */}
        <div
          className="absolute top-0.5 transform -translate-x-1/2 transition-all duration-700 ease-out"
          style={{ left: `${Math.min(Math.max(probability, 3), 97)}%` }}
        >
          <div className="w-4 h-4 bg-slate-900 border-2 border-white rounded-full shadow-md"></div>
        </div>
      </div>

      <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-0.5">
        <span>0% (Low)</span>
        <span>30% (Moderate)</span>
        <span>70%+ (High)</span>
      </div>
    </div>
  );
};
