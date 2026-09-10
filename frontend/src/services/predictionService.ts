import { PatientInput, PredictionResult, ShapFactor, FeatureImportance, RiskLevel, PredictionTarget } from '../types/ckd';
import { MOCK_GLOBAL_FEATURE_IMPORTANCE } from '../data/mockPrediction';
import { getDualExplanation } from '../data/featureGuideData';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

/**
 * Normalizes raw feature keys/labels to clean, clinical presentation titles.
 */
export function formatDisplayFeatureName(rawName: string, observedValue?: string | number): string {
  if (!rawName) return 'Clinical Factor';

  let clean = rawName;
  // Remove technical prefixes
  if (clean.startsWith('cat__')) {
    clean = clean.replace('cat__', '');
  } else if (clean.startsWith('num__')) {
    clean = clean.replace('num__', '');
  }

  // Feature name translations
  const featureMap: Record<string, string> = {
    'bp (Diastolic)': 'Diastolic Blood Pressure',
    'bp_diastolic': 'Diastolic Blood Pressure',
    'bp limit': 'Blood Pressure Limit',
    'bp_limit': 'Blood Pressure Limit',
    'sg': 'Specific Gravity',
    'al': 'Albuminuria (Protein)',
    'su': 'Urinary Glucose (Sugar)',
    'rbc': 'Red Blood Cells (Urine)',
    'pc': 'Pus Cells (Pyuria)',
    'pcc': 'Pus Cell Clumps',
    'ba': 'Bacteria (Urine)',
    'bgr': 'Random Blood Glucose',
    'bu': 'Blood Urea',
    'sod': 'Serum Sodium',
    'sc': 'Serum Creatinine',
    'pot': 'Serum Potassium',
    'hemo': 'Hemoglobin',
    'pcv': 'Packed Cell Volume (Hematocrit)',
    'rbcc': 'Red Blood Cell Count',
    'wbcc': 'White Blood Cell Count',
    'htn': 'Hypertension',
    'dm': 'Diabetes Mellitus',
    'cad': 'Coronary Artery Disease',
    'appet': 'Appetite Status',
    'pe': 'Pedal Edema',
    'ane': 'Clinical Anemia',
    'age': 'Patient Age',
  };

  // Check if it's a composite key like `hemo_11.3 - 12.6`
  const underscoreIdx = clean.indexOf('_');
  if (underscoreIdx > 0) {
    const baseKey = clean.substring(0, underscoreIdx);
    const suffix = clean.substring(underscoreIdx + 1);
    if (featureMap[baseKey]) {
      return `${featureMap[baseKey]} (${suffix})`;
    }
  }

  const baseTitle = featureMap[clean] || clean;
  if (observedValue !== undefined && observedValue !== '' && !baseTitle.includes(`(${observedValue})`)) {
    return `${baseTitle} (${observedValue})`;
  }

  return baseTitle;
}

/**
 * Normalizes backend response factors into standard frontend ShapFactor objects.
 */
function normalizeShapFactor(raw: any): ShapFactor {
  const featureKey = raw.feature || '';
  const shapVal = typeof raw.shap_value === 'number' ? raw.shap_value : (typeof raw.shapValue === 'number' ? raw.shapValue : 0);
  const observedVal = raw.value !== undefined ? raw.value : '';
  const direction: 'increasing' | 'decreasing' = raw.direction === 'increasing' || shapVal > 0 ? 'increasing' : 'decreasing';
  
  const displayFeature = raw.display_feature || raw.displayFeature || formatDisplayFeatureName(featureKey, observedVal);
  const dual = getDualExplanation(featureKey, direction, observedVal, shapVal);

  return {
    feature: featureKey,
    displayFeature,
    value: observedVal,
    shapValue: Number(shapVal.toFixed(4)),
    direction,
    category: raw.category || 'Kidney',
    generalExplanation: dual.generalExplanation,
    medicalExplanation: dual.medicalExplanation,
    influenceStrength: dual.influenceStrength,
    description: raw.description || undefined,
  };
}

/**
 * Executes ML prediction and SHAP calculation via the FastAPI backend.
 */
export async function analyzeCKDRisk(input: PatientInput): Promise<PredictionResult> {
  const endpoint = `${API_BASE_URL}/predict`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(input),
    });
  } catch (networkError: any) {
    throw new Error(
      `Unable to connect to the RenalInsight backend at ${API_BASE_URL}. Please ensure the FastAPI server is running with 'uv run uvicorn app.main:app --reload'.`
    );
  }

  if (!response.ok) {
    let errorDetail = `Server responded with status ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson.details && Array.isArray(errorJson.details)) {
        const fields = errorJson.details.map((d: any) => `${d.field}: ${d.message}`).join('; ');
        errorDetail = `Validation failure: ${fields}`;
      } else if (errorJson.message) {
        errorDetail = errorJson.message;
      } else if (errorJson.detail) {
        errorDetail = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
      }
    } catch {
      // Use fallback errorDetail
    }
    throw new Error(errorDetail);
  }

  const data = await response.json();

  // Normalize response
  const prediction: PredictionTarget = data.prediction === 'CKD' ? 'CKD' : 'NOT CKD';
  const probability = typeof data.probability === 'number' ? Number(data.probability.toFixed(2)) : 0;
  const notCkdProbability = typeof data.not_ckd_probability === 'number'
    ? Number(data.not_ckd_probability.toFixed(2))
    : (typeof data.notCkdProbability === 'number' ? Number(data.notCkdProbability.toFixed(2)) : Number((100 - probability).toFixed(2)));

  const riskLevel: RiskLevel = data.risk_level || data.riskLevel || (probability >= 70 ? 'High' : (probability >= 30 ? 'Moderate' : 'Low'));

  const rawIncreasing = data.increasing_factors || data.increasingFactors || [];
  const rawDecreasing = data.decreasing_factors || data.decreasingFactors || [];
  const rawAll = data.all_factors || data.allFactors || [];

  const increasingFactors: ShapFactor[] = rawIncreasing.map(normalizeShapFactor);
  const decreasingFactors: ShapFactor[] = rawDecreasing.map(normalizeShapFactor);
  
  let allFactors: ShapFactor[] = rawAll.length > 0
    ? rawAll.map(normalizeShapFactor)
    : [...increasingFactors, ...decreasingFactors];

  allFactors.sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue));

  const globalImportance: FeatureImportance[] = (data.global_feature_importance || data.globalFeatureImportance || MOCK_GLOBAL_FEATURE_IMPORTANCE).map((g: any, index: number) => ({
    feature: g.feature || `feat_${index}`,
    displayFeature: g.display_feature || g.displayFeature || formatDisplayFeatureName(g.feature),
    importance: typeof g.importance === 'number' ? g.importance : 0.1,
    rank: g.rank || index + 1,
    description: g.description || 'Clinical feature importance ranking.',
  }));

  return {
    prediction,
    probability,
    notCkdProbability,
    riskLevel,
    modelName: data.model_name || data.modelName || 'Logistic Regression (XAI-Enabled)',
    explainabilityMethod: data.explainability_method || data.explainabilityMethod || 'SHAP (SHapley Additive exPlanations)',
    timestamp: data.timestamp || new Date().toISOString(),
    increasingFactors,
    decreasingFactors,
    allFactors,
    globalFeatureImportance: globalImportance,
  };
}

/**
 * Checks if the backend API service is available and healthy.
 */
export async function checkApiHealth(): Promise<{ healthy: boolean; details?: any }> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      return { healthy: data.status === 'healthy', details: data };
    }
    return { healthy: false };
  } catch {
    return { healthy: false };
  }
}

/**
 * Fetches model metadata and evaluation statistics from backend.
 */
export async function fetchModelInfo(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/model-info`, { method: 'GET' });
  if (!res.ok) {
    throw new Error('Failed to fetch model info from backend');
  }
  return await res.json();
}
