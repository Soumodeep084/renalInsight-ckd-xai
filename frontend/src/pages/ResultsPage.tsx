import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrediction } from '../context/PredictionContext';
import { PredictionCard } from '../components/result/PredictionCard';
import { ProbabilityChart } from '../components/result/ProbabilityChart';
import { RiskSummary } from '../components/result/RiskSummary';
import { ShapExplanation } from '../components/result/ShapExplanation';
import { FeatureImportanceChart } from '../components/result/FeatureImportanceChart';
import { PatientSummary } from '../components/result/PatientSummary';
import { EmptyState } from '../components/common/EmptyState';
import { Disclaimer } from '../components/common/Disclaimer';
import {
  Edit3,
  RotateCcw,
  FileCheck2,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { result, formData, resetForm } = usePrediction();

  if (!result) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmptyState onScrollToForm={() => navigate('/predict')} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
      {/* Top Header Navigation Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg border border-teal-200 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Assessment Completed</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Evaluated at {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Clinical Prediction & Explainable AI (XAI) Report
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate('/guide')}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition-colors cursor-pointer w-full sm:w-auto"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>24-Feature & SHAP Guide</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/predict')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex-1 sm:flex-initial"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Parameters</span>
          </button>

          <button
            type="button"
            onClick={() => {
              resetForm();
              navigate('/predict');
            }}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-600/20 cursor-pointer flex-1 sm:flex-initial"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {/* Main Outcome Card */}
      <PredictionCard result={result} />

      {/* Probability Breakdown & Model Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProbabilityChart
            ckdProbability={result.probability}
            notCkdProbability={result.notCkdProbability}
          />
        </div>
        <div>
          <RiskSummary result={result} />
        </div>
      </div>

      {/* Primary Explainable AI (SHAP) Analysis */}
      <ShapExplanation
        increasingFactors={result.increasingFactors}
        decreasingFactors={result.decreasingFactors}
        allFactors={result.allFactors}
      />

      {/* Global Feature Importance */}
      <FeatureImportanceChart data={result.globalFeatureImportance} />

      {/* Submitted Patient Summary */}
      <PatientSummary
        inputData={formData}
        onEditInputs={() => navigate('/predict')}
      />

      {/* Clean Callout Card linking to the Dedicated Guide Page */}
      <div className="bg-linear-to-r from-teal-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold border border-teal-400/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reference & Tutorial</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">
            Need help understanding these clinical biomarkers?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Visit the dedicated <strong>24-Feature & SHAP Guide</strong> to explore physiological normal ranges, KDIGO significance, and the cooperative game theory behind SHAP attributions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/guide')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all hover:scale-[1.02] shrink-0 cursor-pointer shadow-md"
        >
          <span>Open Full Guide Page</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Full Medical Disclaimer */}
      <Disclaimer />
    </div>
  );
};
