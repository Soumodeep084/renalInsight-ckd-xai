import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePrediction } from '../context/PredictionContext';
import { CkdGuideSection } from '../components/guide/CkdGuideSection';
import { Disclaimer } from '../components/common/Disclaimer';
import { Activity, Stethoscope, ArrowLeft } from 'lucide-react';

export const GuidePage: React.FC = () => {
  const { result } = usePrediction();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          {result && (
            <Link
              to="/results"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
            >
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>View Latest Assessment</span>
            </Link>
          )}

          <Link
            to="/predict"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Run New Prediction</span>
          </Link>
        </div>
      </div>

      {/* Main 24-Feature & SHAP Guide */}
      <CkdGuideSection />

      {/* Medical Research Disclaimer */}
      <Disclaimer />
    </div>
  );
};
