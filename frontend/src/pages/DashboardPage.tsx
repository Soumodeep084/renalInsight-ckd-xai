import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Stethoscope,
  Activity,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Database,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';
import { checkApiHealth, fetchModelInfo } from '../services/predictionService';
import { formatPercentage } from '../utils/formatters';
import { Disclaimer } from '../components/common/Disclaimer';

export const DashboardPage: React.FC = () => {
  const { result } = usePrediction();
  const [modelInfo, setModelInfo] = useState<any>(null);

  useEffect(() => {
    checkApiHealth();
    fetchModelInfo().then((info) => setModelInfo(info)).catch(() => { });
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Streamlined Hero Welcome Banner */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold border border-teal-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explainable AI Platform</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-400/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>College Mini-Project</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
            Chronic Kidney Disease Prediction & Interpretability
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Evaluate patient CKD risk across 24 clinical parameters with quantitative, game-theoretic <strong className="text-white">Tree SHAP</strong> biomarker attributions.
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-3">
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/guide"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs sm:text-sm border border-slate-700 transition-all"
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>24-Feature & SHAP Guide</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Academic Mini-Project & Dataset Citation Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-indigo-100 bg-linear-to-br from-indigo-50/40 via-white to-sky-50/30 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-600/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200">
                  Semester Mini-Project
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Data Science & Machine Learning
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                An Explainable Machine Learning-Based System for Chronic Kidney Disease Prediction
              </h3>
            </div>
          </div>

          <a
            href="https://archive.ics.uci.edu/dataset/336/chronic_kidney_disease"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all shrink-0 self-start md:self-center"
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>UCI Repository (ID: 336)</span>
            <ExternalLink className="w-3 h-3 text-indigo-400" />
          </a>
        </div>

        <div className="pt-2 border-t border-indigo-100/70 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          <div>
            <strong className="text-slate-700">Dataset:</strong> UCI Chronic Kidney Disease (Apollo Hospitals) • <span className="font-semibold text-slate-800">400 Records (250 CKD / 150 Not CKD)</span>
          </div>
          <div>
            <strong className="text-slate-700">Scope:</strong> <span className="font-semibold text-slate-800">24 Raw Clinical Features</span> (14 Numeric Tests, 10 Categorical Indicators)
          </div>
          <div>
            <strong className="text-slate-700">Interpretability:</strong> <span className="font-semibold text-slate-800">Tree SHAP (Game-Theoretic Local & Global Attribution)</span>
          </div>
        </div>
      </div>

      {/* Latest Assessment Quick Banner if Available */}
      {result && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${result.prediction === 'CKD'
                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-teal-100 text-teal-700 border border-teal-200'
                }`}
            >
              {result.prediction === 'CKD' ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Latest Assessment
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Outcome: {result.prediction}</span>
                <span className="text-xs font-normal text-slate-500">
                  ({formatPercentage(result.probability)} Probability • {result.riskLevel} Risk)
                </span>
              </h4>
            </div>
          </div>

          <Link
            to="/results"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shrink-0"
          >
            <span>Open Detailed Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Clean 3-Step Workflow Flow */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            How RenalInsight Works
          </h3>
          <p className="text-xs text-slate-500">
            Fast, transparent workflow from patient tests to explainable risk attribution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
              Enter 24 Biomarkers
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Input patient vitals, urinalysis, blood biochemistry, and symptoms or load one of the clinical presets.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
              Machine Learning Inference
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trained Decision Tree model evaluates non-linear thresholds to predict CKD presence and continuous risk probability.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
              Tree SHAP Explanations
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Examine exact positive (risk-increasing) and negative (protective) feature contributions with dual-tier explanations.
            </p>
          </div>
        </div>
      </div>

      {/* Medical Research Disclaimer */}
      <Disclaimer />
    </div>
  );
};
