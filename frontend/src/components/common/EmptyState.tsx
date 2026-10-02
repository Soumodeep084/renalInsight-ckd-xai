import React from 'react';
import { Activity, ArrowUpCircle, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onScrollToForm?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onScrollToForm }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
      <div className="max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-teal-50/50 shadow-inner">
          <Activity className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            No prediction yet
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Complete the clinical assessment parameters above and select{' '}
            <span className="font-semibold text-teal-700">Analyze CKD Risk</span> to view the model prediction and explainable SHAP contribution breakdown.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {onScrollToForm && (
            <button
              type="button"
              onClick={onScrollToForm}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
            >
              <ArrowUpCircle className="w-4 h-4 text-teal-400" />
              <span>Go to Assessment Form</span>
            </button>
          )}

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>SHAP Explainability Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
