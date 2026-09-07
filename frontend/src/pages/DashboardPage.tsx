import React, { useState, useRef } from 'react';
import { PatientInput, PredictionResult } from '../types/ckd';
import { DEFAULT_PATIENT_INPUT } from '../data/formOptions';
import { PATIENT_PRESETS } from '../data/patientPresets';
import { analyzeCKDRisk } from '../services/predictionService';

import { PatientInfoSection } from '../components/form/PatientInfoSection';
import { KidneyUrineSection } from '../components/form/KidneyUrineSection';
import { BloodTestSection } from '../components/form/BloodTestSection';
import { SymptomsSection } from '../components/form/SymptomsSection';
import { StageSection } from '../components/form/StageSection';

import { PredictionCard } from '../components/result/PredictionCard';
import { ProbabilityChart } from '../components/result/ProbabilityChart';
import { ShapExplanation } from '../components/result/ShapExplanation';
import { FeatureImportanceChart } from '../components/result/FeatureImportanceChart';
import { PatientSummary } from '../components/result/PatientSummary';
import { RiskSummary } from '../components/result/RiskSummary';

import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Disclaimer } from '../components/common/Disclaimer';

import { Brain, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [formData, setFormData] = useState<PatientInput>(DEFAULT_PATIENT_INPUT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFieldChange = (field: keyof PatientInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setActivePreset(null);
    if (errors[field]) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[field];
        return newErr;
      });
    }
  };

  const loadPreset = (presetId: string) => {
    const preset = PATIENT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setFormData(preset.data);
      setActivePreset(presetId);
      setErrors({});
      setErrorMsg(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.bp_diastolic || formData.bp_diastolic < 40 || formData.bp_diastolic > 200) {
      newErrors.bp_diastolic = 'Diastolic blood pressure must be between 40 and 200 mmHg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setErrorMsg(null);

    if (!validateForm()) {
      return;
    }

    setIsAnalyzing(true);

    try {
      const res = await analyzeCKDRisk(formData);
      setResult(res);

      // Smooth scroll to results
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unable to generate prediction. Please review the entered information and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFormData(DEFAULT_PATIENT_INPUT);
    setErrors({});
    setResult(null);
    setErrorMsg(null);
    setActivePreset(null);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold border border-teal-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Healthcare AI Prototype</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            CKD Risk Assessment
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Enter patient clinical parameters to estimate chronic kidney disease risk and understand the factors influencing the model prediction.
          </p>

          {/* Quick Demo Presets */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-1">Demo Quick Presets:</span>
            {PATIENT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => loadPreset(preset.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                  activePreset === preset.id
                    ? 'bg-teal-500 text-white border-teal-400 shadow-md'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {activePreset === preset.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Assessment Form */}
      <div id="prediction-form" ref={formRef} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Clinical Parameter Assessment
            </h3>
            <p className="text-xs text-slate-500">
              Complete the structured parameters below to execute model inference
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Form</span>
          </button>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-6">
          {/* Section 1: Patient Info */}
          <PatientInfoSection formData={formData} onChange={handleFieldChange} errors={errors} />

          {/* Section 2: Kidney & Urine */}
          <KidneyUrineSection formData={formData} onChange={handleFieldChange} errors={errors} />

          {/* Section 3: Blood Test */}
          <BloodTestSection formData={formData} onChange={handleFieldChange} errors={errors} />

          {/* Section 4: Symptoms */}
          <SymptomsSection formData={formData} onChange={handleFieldChange} errors={errors} />

          {/* Section 5: Stage */}
          <StageSection formData={formData} onChange={handleFieldChange} errors={errors} />

          {/* Action Buttons */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">27 Input Parameters</span> configured for inference.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                disabled={isAnalyzing}
                className="flex-1 sm:flex-none px-5 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                Reset Form
              </button>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                <Brain className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Analyzing...' : 'Analyze CKD Risk'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Message if Any */}
      {errorMsg && <ErrorState message={errorMsg} onRetry={() => handleAnalyze()} />}

      {/* Results Section Container */}
      <div ref={resultRef} className="space-y-8 pt-4">
        {isAnalyzing ? (
          <LoadingState />
        ) : result ? (
          <div className="space-y-8 animate-fade-in">
            {/* Top Main Result Card */}
            <PredictionCard result={result} />

            {/* Probability Breakdown & Risk Summary Side-by-Side */}
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

            {/* Explainable AI SHAP Section */}
            <ShapExplanation
              increasingFactors={result.increasingFactors}
              decreasingFactors={result.decreasingFactors}
              allFactors={result.allFactors}
            />

            {/* Global Feature Importance Chart */}
            <FeatureImportanceChart data={result.globalFeatureImportance} />

            {/* Submitted Patient Summary */}
            <PatientSummary inputData={formData} onEditInputs={scrollToForm} />
          </div>
        ) : (
          <EmptyState onScrollToForm={scrollToForm} />
        )}
      </div>

      {/* Footer Disclaimer Card */}
      <Disclaimer />
    </div>
  );
};
