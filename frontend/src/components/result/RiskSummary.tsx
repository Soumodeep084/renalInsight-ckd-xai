import React from 'react';
import { PredictionResult } from '../../types/ckd';
import { formatPercentage, getRiskBadgeStyle } from '../../utils/formatters';
import { ShieldCheck, Cpu, Key, FileSpreadsheet } from 'lucide-react';

interface RiskSummaryProps {
  result: PredictionResult;
}

export const RiskSummary: React.FC<RiskSummaryProps> = ({ result }) => {
  const badgeStyle = getRiskBadgeStyle(result.riskLevel);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-teal-600" />
          <span>Risk Summary Overview</span>
        </h4>
        <span className="text-[11px] font-mono text-slate-400">Model Meta</span>
      </div>

      <div className="space-y-3.5 text-xs">
        <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Prediction:</span>
          <span
            className={`font-bold px-2.5 py-0.5 rounded-md ${
              result.prediction === 'CKD'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-teal-100 text-teal-900'
            }`}
          >
            {result.prediction}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
          <span className="text-slate-500 font-medium">CKD Probability:</span>
          <span className="font-bold text-slate-900 font-mono">
            {formatPercentage(result.probability)}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Assessed Risk:</span>
          <span
            className={`font-bold px-2.5 py-0.5 rounded-md border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
          >
            {result.riskLevel}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span>ML Model:</span>
          </span>
          <span className="font-semibold text-slate-800">{result.modelName}</span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Key className="w-3.5 h-3.5 text-slate-400" />
            <span>Explainability:</span>
          </span>
          <span className="font-semibold text-slate-800">{result.explainabilityMethod}</span>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-slate-400 leading-tight bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          This algorithm is an unvalidated academic prototype. Performance metrics are restricted to research dataset parameters.
        </span>
      </div>
    </div>
  );
};
