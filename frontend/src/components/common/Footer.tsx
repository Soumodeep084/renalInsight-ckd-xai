import React from 'react';
import { Brain, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <Brain className="w-4 h-4 text-teal-600" />
          <span>RenalInsight Research AI Project</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-normal">Explainable CKD Prediction Framework</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Logistic Regression + SHAP Explainability Engine</span>
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          v1.0.0 (Made using React and FASTAPI)
        </div>
      </div>
    </footer>
  );
};
