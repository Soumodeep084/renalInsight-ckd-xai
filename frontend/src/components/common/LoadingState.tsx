import React from 'react';
import { Loader2, Brain } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs animate-fade-in">
      <div className="max-w-md mx-auto space-y-4">
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin"></div>
          <Brain className="w-7 h-7 text-teal-600 animate-pulse" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <span>Analyzing CKD Risk</span>
            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
          </h3>
          <p className="text-xs text-slate-500">
            Evaluating 27 clinical parameters against the trained Logistic Regression model and generating SHAP feature contributions...
          </p>
        </div>

        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-sky-600 h-full w-2/3 animate-pulse rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
