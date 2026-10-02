import React from 'react';
import { AlertTriangle, GraduationCap } from 'lucide-react';

interface DisclaimerProps {
  className?: string;
  variant?: 'banner' | 'card';
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ className = '', variant = 'card' }) => {
  if (variant === 'banner') {
    return (
      <div className={`bg-amber-50/80 border-l-4 border-l-amber-500 border-y border-r border-amber-200/80 p-4 rounded-r-2xl ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            <strong className="font-bold">Academic Project Notice:</strong> RenalInsight is an academic research and algorithmic explainability prototype developed for educational demonstration. It is NOT a certified medical diagnostic device and does not provide clinical diagnosis, disease staging, or medical decision support. Predictions should never replace evaluation by a qualified healthcare professional.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-linear-to-br from-slate-50 to-amber-50/30 border border-slate-200/90 rounded-2xl p-5 sm:p-6 text-slate-600 shadow-2xs ${className}`}>
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl shrink-0 border border-amber-200/70">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Academic Mini-Project & Research Disclaimer
            </h4>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">
              Educational Prototype
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>RenalInsight</strong> is developed strictly as an <strong>academic Data Science / Machine Learning mini-project</strong> to demonstrate machine learning explainability using game-theoretic SHAP attributions on the benchmark <strong>UCI Chronic Kidney Disease dataset (Repository ID: 336)</strong>.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            It is <strong>not</strong> a certified medical device, clinical diagnostic tool, or medical decision support system. Model predictions and explanations are for research, educational, and algorithmic transparency purposes only and must not be used as a substitute for professional medical advice, clinical diagnosis, or patient management.
          </p>
        </div>
      </div>
    </div>
  );
};
