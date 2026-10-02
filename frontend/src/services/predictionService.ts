import { PatientInput, PredictionResult, ShapFactor, FeatureImportance, RiskLevel, PredictionTarget } from '../types/ckd';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

/**
 * Normalizes raw feature keys/labels to clean, clinical presentation titles.
 */
export function formatDisplayFeatureName(rawName: string, observedValue?: string | number): string {
  if (!rawName) return 'Clinical Factor';

  let clean = rawName;
  if (clean.startsWith('cat__')) {
    clean = clean.replace('cat__', '');
  } else if (clean.startsWith('num__')) {
    clean = clean.replace('num__', '');
  }

  const featureMap: Record<string, string> = {
    'age': 'Age',
    'bp': 'Blood Pressure',
    'sg': 'Specific Gravity',
    'al': 'Albumin',
    'su': 'Sugar',
    'rbc': 'Red Blood Cells (Urine)',
    'pc': 'Pus Cell (Urine)',
    'pcc': 'Pus Cell Clumps',
    'ba': 'Bacteria (Urine)',
    'bgr': 'Blood Glucose (Random)',
    'bu': 'Blood Urea',
    'sc': 'Serum Creatinine',
    'sod': 'Sodium',
    'pot': 'Potassium',
    'hemo': 'Hemoglobin',
    'pcv': 'Packed Cell Volume (Hematocrit)',
    'wbcc': 'White Blood Cell Count',
    'rbcc': 'Red Blood Cell Count',
    'htn': 'Hypertension',
    'dm': 'Diabetes Mellitus',
    'cad': 'Coronary Artery Disease',
    'appet': 'Appetite',
    'pe': 'Pedal Edema',
    'ane': 'Anemia',
  };

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

  const absShap = Math.abs(shapVal);
  const influenceStrength: 'Strong' | 'Moderate' | 'Mild' = absShap >= 0.15 ? 'Strong' : (absShap >= 0.04 ? 'Moderate' : 'Mild');

  return {
    feature: featureKey,
    encodedFeature: raw.encoded_feature || raw.encodedFeature,
    displayFeature,
    value: observedVal,
    unit: raw.unit || '',
    shapValue: Number(shapVal.toFixed(4)),
    direction,
    category: raw.category || 'Kidney',
    plainExplanation: raw.plain_explanation || raw.plainExplanation || (direction === 'increasing'
      ? 'This factor pushed the model toward a higher CKD prediction.'
      : 'This factor pushed the model toward a lower CKD prediction.'),
    medicalExplanation: raw.medical_explanation || raw.medicalExplanation || raw.description || '',
    influenceStrength,
    description: raw.description || undefined,
  };
}

/**
 * Executes ML prediction and Tree SHAP calculation via the FastAPI backend.
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
  } catch {
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

  const globalImportance: FeatureImportance[] = (data.global_feature_importance || data.globalFeatureImportance || []).map((g: any, index: number) => ({
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
    modelName: data.model_name || data.modelName || 'Decision Tree (UCI 336)',
    explainabilityMethod: data.explainability_method || data.explainabilityMethod || 'Tree SHAP (TreeExplainer)',
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
