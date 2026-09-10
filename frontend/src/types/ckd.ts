export type RiskLevel = 'Low' | 'Moderate' | 'High';

export type PredictionTarget = 'CKD' | 'NOT CKD';

export interface PatientInput {
  // 1. Patient Information & Resting Hemodynamics (3 features)
  age: string;
  bp_diastolic: number;
  bp_limit: string;

  // 2. Kidney & Urine Parameters (7 features)
  sg: string; // Specific Gravity
  al: string; // Albumin
  su: string; // Sugar
  rbc: string; // Red Blood Cells
  pc: string; // Pus Cell
  pcc: string; // Pus Cell Clumps
  ba: string; // Bacteria

  // 3. Blood Test Parameters (9 features)
  bgr: string; // Blood Glucose Random
  bu: string; // Blood Urea
  sod: string; // Sodium
  sc: string; // Serum Creatinine
  pot: string; // Potassium
  hemo: string; // Hemoglobin
  pcv: string; // Packed Cell Volume
  rbcc: string; // RBC Count
  wbcc: string; // WBC Count

  // 4. Medical Conditions & Symptoms (6 features)
  htn: string; // Hypertension (Yes/No)
  dm: string; // Diabetes Mellitus (Yes/No)
  cad: string; // Coronary Artery Disease (Yes/No)
  appet: string; // Appetite (Good/Poor)
  pe: string; // Pedal Edema (Yes/No)
  ane: string; // Anemia (Yes/No)
}

export interface ShapFactor {
  feature: string;
  displayFeature: string;
  value: string | number;
  shapValue: number;
  direction: 'increasing' | 'decreasing';
  category: 'Kidney' | 'Blood' | 'Symptom' | 'Demographic';
  generalExplanation?: string;
  medicalExplanation?: string;
  influenceStrength?: 'Strong' | 'Moderate' | 'Mild';
  description?: string;
}

export interface FeatureImportance {
  feature: string;
  displayFeature: string;
  importance: number; // Mean |SHAP| value
  rank: number;
  description: string;
}

export interface PredictionResult {
  prediction: PredictionTarget;
  probability: number; // 0 to 100
  notCkdProbability: number; // 100 - probability
  riskLevel: RiskLevel;
  modelName: string;
  explainabilityMethod: string;
  timestamp: string;
  increasingFactors: ShapFactor[];
  decreasingFactors: ShapFactor[];
  allFactors: ShapFactor[];
  globalFeatureImportance: FeatureImportance[];
}

export interface PresetPatient {
  id: string;
  name: string;
  description: string;
  badge: string;
  data: PatientInput;
}

export type NavRoute = '/' | '/predict' | '/results' | '/about';
