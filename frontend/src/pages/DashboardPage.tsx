import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Brain,
  Stethoscope,
  Activity,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';
import { checkApiHealth, fetchModelInfo } from '../services/predictionService';
import { formatPercentage, getPredictionBadgeStyle } from '../utils/formatters';
import { Disclaimer } from '../components/common/Disclaimer';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { result } = usePrediction();
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    checkApiHealth().then((res) => setIsBackendHealthy(res.healthy));
    fetchModelInfo().then((info) => setModelInfo(info)).catch(() => { });
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-5 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold border border-teal-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explainable Clinical AI Platform</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Chronic Kidney Disease Risk Prediction & Explainability
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            RenalInsight combines Scikit-Learn machine learning with SHAP (SHapley Additive exPlanations) to evaluate patient CKD risk across 25 validated clinical parameters, providing transparent, quantitative biomarker attributions.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-xl text-sm shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Launch CKD Prediction</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {result && (
              <Link
                to="/results"
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm border border-slate-700 transition-all"
              >
                <Activity className="w-4 h-4 text-teal-400" />
                <span>View Latest Assessment</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Latest Assessment Quick Banner if Available */}
      {result && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${result.prediction === 'CKD'
                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-teal-100 text-teal-700 border border-teal-200'
                }`}
            >
              {result.prediction === 'CKD' ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <CheckCircle2 className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Latest Assessment Outcome
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 mt-0.5">
                <span>Predicted: {result.prediction}</span>
                <span className="text-sm font-normal text-slate-500">
                  ({formatPercentage(result.probability)} CKD Probability • {result.riskLevel} Risk)
                </span>
              </h4>
            </div>
          </div>

          <Link
            to="/results"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shrink-0"
          >
            <span>Open Detailed XAI Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Model & System Specifications Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Model Architecture */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-sky-50 text-sky-700 rounded-xl">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
              Scikit-Learn
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Machine Learning Core</h3>
            <p className="text-xs text-slate-500 mt-0.5">Trained Classification Pipeline</p>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Model:</span>
              <span className="font-semibold text-slate-800">
                {modelInfo?.model_type || 'Logistic Regression'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Features:</span>
              <span className="font-semibold text-slate-800">
                25 Validated Clinical Variables
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Classification:</span>
              <span className="font-semibold text-slate-800">Binary (CKD / NOT CKD)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Explainability Engine */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-md">
              SHAP Enabled
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Explainable AI (XAI)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Game-Theoretic Feature Attribution</p>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Algorithm:</span>
              <span className="font-semibold text-slate-800">Linear / Tree SHAP Explainer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Attributions:</span>
              <span className="font-semibold text-slate-800">Increasing vs Decreasing</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transparency:</span>
              <span className="font-semibold text-emerald-700">100% Quantified Scores</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Step Clinical Decision Flow */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            How RenalInsight Works
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Structured workflow from patient clinical observations to explainable machine learning risk stratification
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              Input 25 Clinical Parameters
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter patient demographics, resting blood pressure, urinalysis markers (protein, glucose, pus cells), serum biochemistry (creatinine, urea, electrolytes), and medical history.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              Execute Real-Time Inference
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The FastAPI backend transforms categorical and numeric variables through standardized scikit-learn transformers and computes calibrated CKD probability scores.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              Review SHAP Explanations
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inspect exactly which biomarkers increased the patient's predicted risk score (+ SHAP) and which protective factors decreased risk (- SHAP) on side-by-side visual charts.
            </p>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Link
            to="/predict"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm shadow-md transition-all hover:scale-[1.01]"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Go to CKD Prediction Form</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Medical Research Disclaimer */}
      <Disclaimer />
    </div>
  );
};
