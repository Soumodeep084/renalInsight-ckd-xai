export type RiskLevel = 'Low' | 'Moderate' | 'High';

export type PredictionTarget = 'CKD' | 'NOT CKD';

export interface PatientInput {
  // 1. Demographics & Vitals (2 features)
  age: number;
  bp: number;

  // 2. Urinalysis & Kidney Function (7 features)
  sg: number; // Specific Gravity (e.g. 1.020)
  al: number; // Albumin (0 to 5)
  su: number; // Sugar (0 to 5)
  rbc: string; // 'normal' | 'abnormal'
  pc: string; // 'normal' | 'abnormal'
  pcc: string; // 'notpresent' | 'present'
  ba: string; // 'notpresent' | 'present'

  // 3. Blood Chemistry & Hematology (9 features)
  bgr: number; // Blood Glucose Random (mg/dL)
  bu: number; // Blood Urea (mg/dL)
  sc: number; // Serum Creatinine (mg/dL)
  sod: number; // Sodium (mEq/L)
  pot: number; // Potassium (mEq/L)
  hemo: number; // Hemoglobin (g/dL)
  pcv: number; // Packed Cell Volume (%)
  wbcc: number; // White Blood Cell Count (cells/cumm)
  rbcc: number; // Red Blood Cell Count (M/cmm)

  // 4. Medical History & Symptoms (6 features)
  htn: string; // 'yes' | 'no'
  dm: string; // 'yes' | 'no'
  cad: string; // 'yes' | 'no'
  appet: string; // 'good' | 'poor'
  pe: string; // 'yes' | 'no'
  ane: string; // 'yes' | 'no'
}

export interface ShapFactor {
  feature: string;
  encodedFeature?: string;
  displayFeature: string;
  value: string | number;
  unit?: string;
  shapValue: number;
  direction: 'increasing' | 'decreasing';
  category: 'Kidney' | 'Blood' | 'Symptom' | 'Demographic';
  plainExplanation?: string;
  generalExplanation?: string;
  medicalExplanation?: string;
  influenceStrength?: 'Strong' | 'Moderate' | 'Mild';
  description?: string;
}

export interface FeatureImportance {
  feature: string;
  displayFeature: string;
  importance: number;
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
  globalFeatureImportance?: FeatureImportance[];
}

export interface PresetPatient {
  id: string;
  name: string;
  description: string;
  badge: string;
  data: PatientInput;
}

export interface FeatureGuideItem {
  key: keyof PatientInput;
  name: string;
  category: 'Demographic' | 'Kidney' | 'Blood' | 'Symptom';
  unit: string;
  normalRange: string;
  description: string;
  clinicalSignificance: string;
  whatItMeasures: string;
}

export type NavRoute = '/' | '/predict' | '/results' | '/guide' | '/about';
