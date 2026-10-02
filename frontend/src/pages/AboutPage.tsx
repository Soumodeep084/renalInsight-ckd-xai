import React from 'react';
import { Brain, Database, Cpu, Key, ShieldCheck, FileText } from 'lucide-react';
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
              Explainable AI Academic Research Prototype for Chronic Kidney Disease Prediction
            </p>
          </div>
        </div>

        <p className="text-slate-700 text-sm sm:text-base leading-relaxed pt-2 border-t border-slate-100">
          <strong>RenalInsight</strong> is an explainable machine learning research system designed to evaluate chronic kidney disease risk using structured clinical parameters. By integrating a trained Scikit-Learn pipeline with Tree SHAP (SHapley Additive exPlanations), the platform delivers transparent, quantitative biomarker attributions and plain-language interpretations.
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
              <h3 className="text-base font-bold text-slate-900">Machine Learning Architecture</h3>
              <p className="text-xs text-slate-500">Classification pipeline & explainability</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Selected Model:</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                Decision Tree (max_depth=5, min_samples_leaf=2)
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-teal-600" />
                <span>Explainability Method:</span>
              </span>
              <span className="font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
                Tree SHAP (TreeExplainer)
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Preprocessing:</span>
              <span className="font-semibold text-slate-800">Median Impute + StandardScaler (14) / Most Frequent + OneHot (10)</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Target Classification:</span>
              <span className="font-bold text-slate-900">Binary (1 = CKD, 0 = Not CKD)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-200/80">
            The Decision Tree model learns non-linear threshold rules across clinical features, and Tree SHAP computes exact, game-theoretic attributions for each patient's test results.
          </div>
        </div>

        {/* Card 2: Research Dataset Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Dataset Specifications</h3>
              <p className="text-xs text-slate-500">UCI Machine Learning Repository</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Dataset Source:</span>
              <span className="font-semibold text-slate-900">
                UCI 336 Chronic Kidney Disease
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Sample Size:</span>
              <span className="font-mono font-bold text-slate-900">400 Patient Records (80/20 Stratified Split)</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Input Predictors:</span>
              <span className="font-mono font-bold text-slate-900">24 Clinical Features (14 Numeric, 10 Categorical)</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Transformed Space:</span>
              <span className="font-semibold text-emerald-700">34 Encoded Columns</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 leading-relaxed border border-amber-200">
            <strong className="font-semibold block mb-0.5">Academic Notice:</strong>
            High accuracy reflects definitional circularity in UCI 336 (laboratory features serve as diagnostic criteria), not real-world clinical validation.
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
          SHAP (SHapley Additive exPlanations) is a game-theoretic framework that quantifies how much each individual biomarker shifts the model output relative to baseline:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-rose-800 text-xs sm:text-sm">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
              <span>Positive SHAP (+ SHAP)</span>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed">
              Factors with positive SHAP values (e.g., low hemoglobin, elevated creatinine, hypertension) pushed the model toward a higher CKD prediction.
            </p>
          </div>

          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-teal-800 text-xs sm:text-sm">
              <span className="w-2.5 h-2.5 bg-teal-600 rounded-full"></span>
              <span>Negative SHAP (- SHAP)</span>
            </div>
            <p className="text-xs text-teal-900 leading-relaxed">
              Factors with negative SHAP values (e.g., physiological hemoglobin, normal creatinine, good appetite) pushed the model toward a lower CKD prediction.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Hygiene & Development Notes */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Model Development & Preprocessing Pipeline</span>
        </h3>
        <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
          <li>
            <strong className="text-slate-800">Automated Pipeline Imputation:</strong> Numeric variables undergo median imputation and standard scaling; categorical variables undergo most-frequent imputation and one-hot encoding.
          </li>
          <li>
            <strong className="text-slate-800">Tree SHAP Explanations:</strong> Exact tree SHAP values are computed on the preprocessed 34-feature representation, ensuring no feature leakage.
          </li>
        </ul>
      </div>

      {/* Full Medical Disclaimer */}
      <Disclaimer variant="card" />
    </div>
  );
};
