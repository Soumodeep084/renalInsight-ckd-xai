import React from 'react';
import { formatPercentage } from '../../utils/formatters';

interface ProbabilityChartProps {
  ckdProbability: number;
  notCkdProbability: number;
}

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({
  ckdProbability,
  notCkdProbability,
}) => {
  const chartData = [
    { name: 'CKD Risk', probability: ckdProbability, color: ckdProbability > 50 ? '#f43f5e' : '#e11d48' },
    { name: 'Not CKD', probability: notCkdProbability, color: '#0d9488' },
  ];

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Probability Breakdown
        </h4>
        <span className="text-xs text-slate-500 font-medium">Model Output Distribution</span>
      </div>

      {/* Horizontal Bar Breakdown */}
      <div className="space-y-3">
        {/* CKD Bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-rose-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>CKD Probability</span>
            </span>
            <span className="text-rose-900 font-bold">{formatPercentage(ckdProbability)}</span>
          </div>
          <div className="w-full bg-slate-200/70 h-3 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.max(ckdProbability, 2)}%` }}
            />
          </div>
        </div>

        {/* NOT CKD Bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-teal-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
              <span>Not CKD Probability</span>
            </span>
            <span className="text-teal-950 font-bold">{formatPercentage(notCkdProbability)}</span>
          </div>
          <div className="w-full bg-slate-200/70 h-3 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.max(notCkdProbability, 2)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
