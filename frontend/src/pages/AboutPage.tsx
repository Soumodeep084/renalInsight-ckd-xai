import React from 'react';
import { Brain, Database, Cpu, Key, AlertTriangle, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { Disclaimer } from '../components/common/Disclaimer';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Title Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200/80 flex items-center justify-center">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              About RenalInsight
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Explainable AI Research Prototype for Chronic Kidney Disease Risk Assessment
            </p>
          </div>
        </div>

        <p className="text-slate-700 text-sm sm:text-base leading-relaxed pt-2 border-t border-slate-100">
          <strong>RenalInsight</strong> is an explainable machine learning research system designed to estimate chronic kidney disease risk from structured clinical parameters. By integrating interpretable machine learning with SHAP (SHapley Additive exPlanations), the platform aims to make AI predictions transparent, clinician-auditable, and quantitative.
        </p>
      </div>

      {/* Grid: Machine Learning & Dataset Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Machine Learning Architecture */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Machine Learning Specifications</h3>
              <p className="text-xs text-slate-500">Core algorithm & explainability engine</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Selected Model:</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                Logistic Regression
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-teal-600" />
                <span>Explainability Method:</span>
              </span>
              <span className="font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
                SHAP (Tree/Kernel Explainer)
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Prediction Type:</span>
              <span className="font-semibold text-slate-800">Binary Classification</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Target Classification:</span>
              <span className="font-bold text-slate-900">CKD / NOT CKD</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-200/80">
            Logistic Regression provides a stable baseline for binary risk prediction, while SHAP computes exact Shapley value contributions for each patient parameter.
          </div>
        </div>

        {/* Card 2: Research Dataset Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Research Dataset</h3>
              <p className="text-xs text-slate-500">Benchmark dataset parameters</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Dataset Name:</span>
              <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                Risk Factor Prediction of CKD
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Sample Size:</span>
              <span className="font-mono font-bold text-slate-900">200 Clinical Records</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Final Features:</span>
              <span className="font-mono font-bold text-slate-900">25 Clinical Variables</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Data Normalization:</span>
              <span className="font-semibold text-emerald-700">Cleaned & Standardized</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 leading-relaxed border border-amber-200">
            <strong className="font-semibold block mb-0.5">Clinical Evaluation Note:</strong>
            Performance metrics are based on the research dataset and should not be interpreted as clinical validation.
          </div>
        </div>
      </div>

      {/* SHAP Methodology Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-600" />
          <span>SHAP Explainability Framework</span>
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          SHAP (SHapley Additive exPlanations) is a game-theoretic approach to explain the output of machine learning models. In RenalInsight:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-rose-800 text-xs sm:text-sm">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
              <span>Positive SHAP Values (+ SHAP)</span>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed">
              Factors with positive SHAP values push the prediction score higher toward Chronic Kidney Disease (CKD) risk.
            </p>
          </div>

          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-teal-800 text-xs sm:text-sm">
              <span className="w-2.5 h-2.5 bg-teal-600 rounded-full"></span>
              <span>Negative SHAP Values (- SHAP)</span>
            </div>
            <p className="text-xs text-teal-900 leading-relaxed">
              Factors with negative SHAP values decrease the estimated probability, protecting against CKD prediction.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Hygiene & Development Notes */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Model Development & Feature Curation</span>
        </h3>
        <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
          <li>
            <strong className="text-slate-800">Target Leakage Prevention:</strong> During model development, variables containing direct target proxy information (<code className="bg-slate-100 px-1 py-0.5 rounded text-rose-700 font-mono">grf</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-700 font-mono">stage</code>, and <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-700 font-mono">affected</code>) were excluded, resulting in the final 25 genuine clinical predictors.
          </li>
          <li>
            <strong className="text-slate-800">Standardized Categorical Encodings:</strong> Clinical lab intervals are formatted and encoded via Scikit-Learn transformers matching the trained one-hot feature space.
          </li>
        </ul>
      </div>

      {/* Full Medical Disclaimer */}
      <Disclaimer variant="card" />
    </div>
  );
};
