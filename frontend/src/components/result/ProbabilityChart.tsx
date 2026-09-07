import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from 'recharts';
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
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
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
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
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

      {/* Recharts Visualization */}
      <div className="h-28 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
            <XAxis type="number" domain={[0, 100]} tickFormatter={(val) => `${val}%`} textAnchor="end" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontWeight: 600 }} width={75} />
            <RechartsTooltip
              formatter={(value: any) => [`${Number(value).toFixed(2)}%`, 'Probability']}
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
            />
            <Bar dataKey="probability" radius={[0, 6, 6, 0]} barSize={16}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
