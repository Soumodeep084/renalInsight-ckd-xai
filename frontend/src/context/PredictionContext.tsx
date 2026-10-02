import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PatientInput, PredictionResult } from '../types/ckd';
import { DEFAULT_PATIENT_INPUT } from '../data/formOptions';
import { PATIENT_PRESETS } from '../data/patientPresets';
import { analyzeCKDRisk } from '../services/predictionService';

interface PredictionContextType {
  formData: PatientInput;
  result: PredictionResult | null;
  isAnalyzing: boolean;
  errorMsg: string | null;
  errors: Record<string, string>;
  activePreset: string | null;
  handleFieldChange: (field: keyof PatientInput, value: any) => void;
  loadPreset: (presetId: string) => void;
  resetForm: () => void;
  submitPrediction: () => Promise<boolean>;
  setResult: (res: PredictionResult | null) => void;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const PredictionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<PatientInput>(DEFAULT_PATIENT_INPUT);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const handleFieldChange = (field: keyof PatientInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setActivePreset(null);
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
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

  const resetForm = () => {
    setFormData(DEFAULT_PATIENT_INPUT);
    setErrors({});
    setErrorMsg(null);
    setActivePreset(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.age === undefined || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Age must be between 1 and 120 years';
    }

    if (formData.bp === undefined || formData.bp < 40 || formData.bp > 250) {
      newErrors.bp = 'Blood pressure must be between 40 and 250 mm Hg';
    }

    if (formData.bgr === undefined || formData.bgr < 30 || formData.bgr > 600) {
      newErrors.bgr = 'Blood glucose must be between 30 and 600 mg/dL';
    }

    if (formData.bu === undefined || formData.bu < 1 || formData.bu > 500) {
      newErrors.bu = 'Blood urea must be between 1 and 500 mg/dL';
    }

    if (formData.sc === undefined || formData.sc < 0.1 || formData.sc > 50) {
      newErrors.sc = 'Serum creatinine must be between 0.1 and 50 mg/dL';
    }

    if (formData.hemo === undefined || formData.hemo < 2 || formData.hemo > 25) {
      newErrors.hemo = 'Hemoglobin must be between 2 and 25 g/dL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitPrediction = async (): Promise<boolean> => {
    setErrorMsg(null);

    if (!validateForm()) {
      return false;
    }

    setIsAnalyzing(true);
    try {
      const res = await analyzeCKDRisk(formData);
      setResult(res);
      return true;
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unable to execute prediction. Please review the input parameters.');
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <PredictionContext.Provider
      value={{
        formData,
        result,
        isAnalyzing,
        errorMsg,
        errors,
        activePreset,
        handleFieldChange,
        loadPreset,
        resetForm,
        submitPrediction,
        setResult,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
};

export function usePrediction(): PredictionContextType {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
}
