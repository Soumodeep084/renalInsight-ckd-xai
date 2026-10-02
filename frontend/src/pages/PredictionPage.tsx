import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrediction } from '../context/PredictionContext';
import { PATIENT_PRESETS } from '../data/patientPresets';
import { PatientInfoSection } from '../components/form/PatientInfoSection';
import { KidneyUrineSection } from '../components/form/KidneyUrineSection';
import { BloodTestSection } from '../components/form/BloodTestSection';
import { SymptomsSection } from '../components/form/SymptomsSection';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { Disclaimer } from '../components/common/Disclaimer';
import {
  Brain,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ServerOff,
  RefreshCw,
} from 'lucide-react';

export const PredictionPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    isAnalyzing,
    errorMsg,
    errors,
    activePreset,
    isBackendOnline,
    isCheckingBackend,
    verifyHealth,
    handleFieldChange,
    loadPreset,
    resetForm,
    submitPrediction,
  } = usePrediction();

  const formTopRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBackendOnline === false) return;
    const success = await submitPrediction();
    if (success) {
      navigate('/results');
    } else {
      if (formTopRef.current) {
        formTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div ref={formTopRef} className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner with Presets */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold border border-teal-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>24-Feature Validated Inference Schema (UCI 336)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Patient Clinical Data Assessment
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Enter physiological and laboratory markers across the 4 structured sections below (Patient Demographics, Kidney & Urinalysis, Blood Panel, and Medical Conditions). You can also load standard clinical presets to evaluate model behavior.
          </p>

          {/* Quick Demo Presets */}
          <div className="pt-2 space-y-2">
            <span className="text-xs text-slate-400 font-semibold block">Demo Quick Presets:</span>
            <div className="flex flex-wrap items-center gap-2">
              {PATIENT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => loadPreset(preset.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${activePreset === preset.id
                    ? 'bg-teal-500 text-white border-teal-400 shadow-md'
                    : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                >
                  {activePreset === preset.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{preset.name}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition-all flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backend Offline Warning Banner */}
      {isBackendOnline === false && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-rose-950 animate-fade-in shadow-xs">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
              <ServerOff className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-sm text-rose-950">Prediction Server Offline</h4>
              <p className="text-xs text-rose-800 leading-relaxed">
                The inference backend server is currently unreachable. Form submission is disabled until the connection is re-established.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={verifyHealth}
            disabled={isCheckingBackend}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 disabled:opacity-50 self-stretch sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingBackend ? 'animate-spin' : ''}`} />
            <span>{isCheckingBackend ? 'Checking...' : 'Retry Connection'}</span>
          </button>
        </div>
      )}

      {/* Error Banner if Any */}
      {errorMsg && (
        <ErrorState
          message={errorMsg}
          onRetry={() => {
            const form = document.getElementById('clinical-assessment-form') as HTMLFormElement;
            if (form) form.requestSubmit();
          }}
        />
      )}

      {/* Prominent Academic & Research Disclaimer at Top of Assessment */}
      <Disclaimer variant="banner" />

      {/* Main Assessment Form */}
      {isAnalyzing ? (
        <LoadingState />
      ) : (
        <form id="clinical-assessment-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Demographics & Vitals (2 features) */}
          <PatientInfoSection
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
          />

          {/* Section 2: Kidney & Urinalysis (7 features) */}
          <KidneyUrineSection
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
          />

          {/* Section 3: Serum Blood Biochemistry & Hematology (9 features) */}
          <BloodTestSection
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
          />

          {/* Section 4: Clinical Symptoms & History (6 features) */}
          <SymptomsSection
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
          />

          {/* Submit Action Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={resetForm}
                disabled={isAnalyzing}
                className="w-full sm:w-auto px-5 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer text-center"
              >
                Reset Form
              </button>

              <button
                type="submit"
                disabled={isAnalyzing || isBackendOnline === false}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl text-sm font-extrabold transition-all text-center ${
                  isBackendOnline === false
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-300'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                } disabled:opacity-60`}
              >
                <Brain className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>
                  {isAnalyzing
                    ? 'Executing Inference...'
                    : isBackendOnline === false
                      ? 'Server Offline (Cannot Submit)'
                      : 'Analyze CKD Risk & Explain'}
                </span>
                {isBackendOnline !== false && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Footer Disclaimer */}
      <Disclaimer />
    </div>
  );
};
