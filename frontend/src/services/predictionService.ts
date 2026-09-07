import { PatientInput, PredictionResult, ShapFactor } from '../types/ckd';
import { MOCK_GLOBAL_FEATURE_IMPORTANCE, MOCK_INCREASING_FACTORS, MOCK_DECREASING_FACTORS } from '../data/mockPrediction';

/**
 * RenalInsight Prediction Service
 * 
 * Currently handles local mock predictions for frontend prototype demonstration.
 * Designed for seamless swap with future FastAPI backend endpoints.
 */
export async function analyzeCKDRisk(input: PatientInput): Promise<PredictionResult> {
  // TODO: Replace mock prediction with FastAPI API call.
  // Example future implementation:
  /*
  const response = await fetch("https://api.renalinsight.ai/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    throw new Error("Failed to generate CKD prediction from backend model");
  }
  return await response.json();
  */

  // Simulate network latency for realistic UX transition
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Determine if profile reflects high risk or low risk based on key clinical parameters
  const isHighRiskPreset =
    input.htn === 'Yes' ||
    input.dm === 'Yes' ||
    input.al === '3' ||
    input.al === '≥ 4' ||
    input.sc === '2.5 - 4.8' ||
    input.sc === '4.8 - 7.1' ||
    input.sc === '≥ 7.1' ||
    input.stage === 'Stage 4' ||
    input.stage === 'Stage 5';

  if (isHighRiskPreset) {
    const probability = 84.65;
    const notCkdProbability = Number((100 - probability).toFixed(2));
    
    // Custom SHAP factors for high risk demonstration
    const highRiskIncreasingFactors: ShapFactor[] = [
      {
        feature: 'htn',
        displayFeature: 'Hypertension (Yes)',
        value: 'Yes',
        shapValue: 0.4120,
        direction: 'increasing',
        category: 'Symptom',
        description: 'Vascular resistance and arterial hypertension strongly push prediction toward CKD.',
      },
      {
        feature: 'dm',
        displayFeature: 'Diabetes Mellitus (Yes)',
        value: 'Yes',
        shapValue: 0.3840,
        direction: 'increasing',
        category: 'Symptom',
        description: 'Diabetic glomerulosclerosis metabolic pressure factor.',
      },
      {
        feature: 'al',
        displayFeature: `Albumin (${input.al})`,
        value: input.al,
        shapValue: 0.3210,
        direction: 'increasing',
        category: 'Kidney',
        description: 'Glomerular filtration barrier disruption with severe protein excretion.',
      },
      {
        feature: 'sc',
        displayFeature: `Serum Creatinine (${input.sc})`,
        value: `${input.sc} mg/dL`,
        shapValue: 0.2890,
        direction: 'increasing',
        category: 'Blood',
        description: 'Impaired renal clearance indicated by elevated serum creatinine.',
      },
      {
        feature: 'hemo',
        displayFeature: `Hemoglobin (${input.hemo})`,
        value: `${input.hemo} g/dL`,
        shapValue: 0.2150,
        direction: 'increasing',
        category: 'Blood',
        description: 'Decreased renal erythropoietin production leading to anemia.',
      },
      {
        feature: 'sg',
        displayFeature: `Specific Gravity (${input.sg})`,
        value: input.sg,
        shapValue: 0.1840,
        direction: 'increasing',
        category: 'Kidney',
        description: 'Low urine specific gravity indicating urinary concentration defect.',
      },
      {
        feature: 'gfr',
        displayFeature: `GFR (${input.gfr})`,
        value: input.gfr,
        shapValue: 0.1620,
        direction: 'increasing',
        category: 'Kidney',
        description: 'Substantially reduced Glomerular Filtration Rate.',
      },
      {
        feature: 'pe',
        displayFeature: 'Pedal Edema (Yes)',
        value: 'Yes',
        shapValue: 0.1410,
        direction: 'increasing',
        category: 'Symptom',
        description: 'Systemic sodium and fluid overload swelling.',
      },
      {
        feature: 'bp_diastolic',
        displayFeature: 'Diastolic BP',
        value: `${input.bp_diastolic} mmHg`,
        shapValue: 0.0980,
        direction: 'increasing',
        category: 'Demographic',
        description: 'Elevated diastolic baseline pressure.',
      },
      {
        feature: 'appet',
        displayFeature: 'Appetite (Poor)',
        value: 'Poor',
        shapValue: 0.0850,
        direction: 'increasing',
        category: 'Symptom',
        description: 'Uremic symptom affecting nutritional intake.',
      },
    ];

    const highRiskDecreasingFactors: ShapFactor[] = [
      {
        feature: 'ba',
        displayFeature: 'Bacteria (Not Present)',
        value: 'Not Present',
        shapValue: -0.0450,
        direction: 'decreasing',
        category: 'Kidney',
        description: 'No active bacteriuria detected in urinary sample.',
      },
      {
        feature: 'pcc',
        displayFeature: 'Pus Cell Clumps (Not Present)',
        value: 'Not Present',
        shapValue: -0.0380,
        direction: 'decreasing',
        category: 'Kidney',
        description: 'Absence of inflammatory pus cell aggregations.',
      },
      {
        feature: 'pot',
        displayFeature: `Potassium (${input.pot})`,
        value: input.pot,
        shapValue: -0.0210,
        direction: 'decreasing',
        category: 'Blood',
        description: 'Potassium within manageable buffer zone.',
      },
    ];

    return {
      prediction: 'CKD',
      probability,
      notCkdProbability,
      riskLevel: 'High',
      modelName: 'Logistic Regression',
      explainabilityMethod: 'SHAP (SHapley Additive exPlanations)',
      timestamp: new Date().toISOString(),
      increasingFactors: highRiskIncreasingFactors,
      decreasingFactors: highRiskDecreasingFactors,
      allFactors: [...highRiskIncreasingFactors, ...highRiskDecreasingFactors].sort(
        (a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue)
      ),
      globalFeatureImportance: MOCK_GLOBAL_FEATURE_IMPORTANCE,
    };
  }

  // Default Low-Risk Demo Result (matches prompt default mock values)
  const probability = 10.97;
  const notCkdProbability = 89.03;

  return {
    prediction: 'NOT CKD',
    probability,
    notCkdProbability,
    riskLevel: 'Low',
    modelName: 'Logistic Regression',
    explainabilityMethod: 'SHAP (SHapley Additive exPlanations)',
    timestamp: new Date().toISOString(),
    increasingFactors: MOCK_INCREASING_FACTORS,
    decreasingFactors: MOCK_DECREASING_FACTORS,
    allFactors: [...MOCK_INCREASING_FACTORS, ...MOCK_DECREASING_FACTORS].sort(
      (a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue)
    ),
    globalFeatureImportance: MOCK_GLOBAL_FEATURE_IMPORTANCE,
  };
}
