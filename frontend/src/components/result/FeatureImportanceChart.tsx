import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { FeatureImportance } from '../../types/ckd';
import { Globe, Info } from 'lucide-react';
import { MOCK_GLOBAL_FEATURE_IMPORTANCE } from '../../data/mockPrediction';

interface FeatureImportanceChartProps {
  data?: FeatureImportance[];
}

export const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ data }) => {
  const chartData = data && data.length > 0 ? data : MOCK_GLOBAL_FEATURE_IMPORTANCE;
  // Sort by rank ascending
  const sortedData = [...chartData].sort((a, b) => a.rank - b.rank);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-lg uppercase tracking-wider border border-sky-200 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Global Model Explanation</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
            Global Feature Importance
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Biomarkers with the highest population-level influence across the trained model dataset.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono">
          Metric: Mean |SHAP| Value
        </div>
      </div>

      {/* Bar Chart using Recharts */}
      <div className="h-80 w-full min-w-0 overflow-hidden pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 15, left: 0, bottom: 5 }}
          >
            <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, 'dataMax + 0.05']} />
            <YAxis
              type="category"
              dataKey="displayFeature"
              tick={{ fontSize: 11, fontWeight: 600 }}
              width={105}
            />
            <RechartsTooltip
              formatter={(value: any) => [`${Number(value).toFixed(3)}`, 'Mean |SHAP| Importance']}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
                border: 'none',
              }}
            />
            <Bar dataKey="importance" radius={[0, 6, 6, 0]} barSize={16}>
              {sortedData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index < 3 ? '#0284c7' : '#0d9488'}
                  fillOpacity={1 - index * 0.06}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Scope Disclaimer */}
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-start gap-2.5 text-xs text-sky-900">
        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Population vs Patient Attribution:</strong> This global chart depicts overall baseline biomarker importance across the research cohort, complementing the patient-specific SHAP analysis above.
        </p>
      </div>
    </div>
  );
};
