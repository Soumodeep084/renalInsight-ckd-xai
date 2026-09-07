export type RiskLevel = 'Low' | 'Moderate' | 'High';

export type PredictionTarget = 'CKD' | 'NOT CKD';

export interface PatientInput {
  // Patient Information
  age: string;
  bp_diastolic: number;
  bp_limit: string;

  // Kidney & Urine Parameters
  sg: string; // Specific Gravity
  al: string; // Albumin
  su: string; // Sugar
  rbc: string; // Red Blood Cells
  pc: string; // Pus Cell
  pcc: string; // Pus Cell Clumps
  ba: string; // Bacteria

  // Blood Test Parameters
  bgr: string; // Blood Glucose Random
  bu: string; // Blood Urea
  sod: string; // Sodium
  sc: string; // Serum Creatinine
  pot: string; // Potassium
  hemo: string; // Hemoglobin
  pcv: string; // Packed Cell Volume
  rbcc: string; // RBC Count
  wbcc: string; // WBC Count
  gfr: string; // Glomerular Filtration Rate

  // Medical Conditions & Symptoms
  htn: string; // Hypertension (Yes/No)
  dm: string; // Diabetes Mellitus (Yes/No)
  cad: string; // Coronary Artery Disease (Yes/No)
  appet: string; // Appetite (Good/Poor)
  pe: string; // Pedal Edema (Yes/No)
  ane: string; // Anemia (Yes/No)

  // CKD Stage
  stage: string; // Stage 1 to Stage 5
}

export interface ShapFactor {
  feature: string;
  displayFeature: string;
  value: string | number;
  shapValue: number;
  direction: 'increasing' | 'decreasing';
  category: 'Kidney' | 'Blood' | 'Symptom' | 'Demographic';
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

export type ActiveTab = 'dashboard' | 'about';
