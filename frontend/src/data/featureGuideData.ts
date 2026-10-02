export interface FeatureGuideItem {
  id: string;
  name: string;
  shortName: string;
  category: string;
  categoryKey: 'Kidney' | 'Blood' | 'Symptom' | 'Demographic';
  unit?: string;
  typicalNormal: string;
  simpleExplanation: string;
  medicalExplanation: string;
  riskContext: string;
}

export interface DualExplanation {
  generalExplanation: string;
  medicalExplanation: string;
  influenceStrength: 'Strong' | 'Moderate' | 'Mild';
}

/**
 * Complete beginner-friendly guide for all 24 features used by the UCI 336 Decision Tree model.
 * Written in clear, non-technical language with concise medical accuracy.
 */
export const FEATURE_GUIDE_DATA: FeatureGuideItem[] = [
  // ---------------------------------------------------------------------------
  // 1. Patient Demographics & Vitals (2 features)
  // ---------------------------------------------------------------------------
  {
    id: 'age',
    name: 'Patient Age',
    shortName: 'Age',
    category: 'Patient Demographics',
    categoryKey: 'Demographic',
    unit: 'years',
    typicalNormal: '18 – 80+ years',
    simpleExplanation: 'How old you are. As people age, kidney filtering capacity gradually decreases.',
    medicalExplanation: 'Age-associated nephrosclerosis and progressive functional nephron loss reduce physiological glomerular filtration reserve.',
    riskContext: 'Older age contributes a slight increase in baseline CKD prediction probability.',
  },
  {
    id: 'bp',
    name: 'Blood Pressure',
    shortName: 'Blood Pressure',
    category: 'Patient Demographics',
    categoryKey: 'Demographic',
    unit: 'mm Hg',
    typicalNormal: '70 – 80 mm Hg',
    simpleExplanation: 'The hydrostatic pressure exerted by circulating blood against the walls of blood vessels.',
    medicalExplanation: 'Sustained elevated blood pressure increases glomerular capillary hydrostatic pressure, accelerating renal arteriosclerosis.',
    riskContext: 'Elevated blood pressure strains tiny renal capillary filters, pushing the model toward higher CKD risk.',
  },

  // ---------------------------------------------------------------------------
  // 2. Urinalysis & Kidney Function (7 features)
  // ---------------------------------------------------------------------------
  {
    id: 'sg',
    name: 'Urine Specific Gravity',
    shortName: 'Specific Gravity',
    category: 'Kidney & Urinalysis',
    categoryKey: 'Kidney',
    unit: '',
    typicalNormal: '1.015 – 1.025',
    simpleExplanation: 'Shows how concentrated your urine is. Healthy kidneys concentrate urine when you drink less water and dilute it when you drink more.',
    medicalExplanation: 'Isosthenuria (fixed SG ~1.010) indicates impaired tubular urine concentration mechanisms in the renal medulla.',
    riskContext: 'Low or fixed specific gravity pushed the model toward a higher CKD prediction.',
  },
  {
    id: 'al',
    name: 'Albumin (Urine Protein)',
    shortName: 'Albumin',
    category: 'Kidney & Urinalysis',
    categoryKey: 'Kidney',
    unit: 'scale (0–5)',
    typicalNormal: '0 (Negative / None)',
    simpleExplanation: 'Albumin is a vital protein that should stay in your blood. Finding protein in urine means kidney filters are leaky.',
    medicalExplanation: 'Proteinuria reflects disruption of the glomerular filtration barrier and podocyte slit diaphragm integrity.',
    riskContext: 'Higher albumin levels (1+ to 5+) strongly push the model toward a higher CKD prediction.',
  },
  {
    id: 'su',
    name: 'Urinary Glucose (Sugar)',
    shortName: 'Sugar',
    category: 'Kidney & Urinalysis',
    categoryKey: 'Kidney',
    unit: 'scale (0–5)',
    typicalNormal: '0 (Negative / None)',
    simpleExplanation: 'Sugar spilled into the urine. Healthy kidneys reabsorb all sugar back into the blood.',
    medicalExplanation: 'Glucosuria occurs when blood sugar exceeds tubular transport maximum or when proximal tubular reabsorption is impaired.',
    riskContext: 'Elevated urinary sugar increases metabolic and vascular strain on the kidneys in the model.',
  },
  {
    id: 'rbc',
    name: 'Red Blood Cells in Urine',
    shortName: 'RBC (Urine)',
    category: 'Kidney & Urinalysis',
    categoryKey: 'Kidney',
    unit: '',
    typicalNormal: 'Normal (None / Negative)',
    simpleExplanation: 'Microscopic red blood cells leaking into urine, which should normally be held back by intact kidney filters.',
    medicalExplanation: 'Dysmorphic microscopic hematuria indicates mechanical disruption of the glomerular capillary wall.',
    riskContext: 'Abnormal red blood cells in urine push the model toward higher CKD risk.',
  },
  {
    id: 'pc',
    name: 'Pus Cells (Pyuria)',
    shortName: 'Pus Cells',
    category: 'Kidney & Urinalysis',
    categoryKey: 'Kidney',
    unit: '',
    typicalNormal: 'Normal',
    simpleExplanation: 'White blood cells in urine that signal infection or active inflammation in the urinary or kidney system.',
    medicalExplanation: 'Active pyuria indicates tubulointerstitial nephritis, urinary tract infection, or inflammatory glomerular disease.',
    riskContext: 'Abnormal pus cell counts push the model toward higher CKD risk.',
  },
  {
    id: 'pcc',
    name: 'Pus Cell Clumps',
    shortName: 'Pus Cell Clumps',
    category: 'Kidney & Urinalysis',
    categoryKey: 'Kidney',
    unit: '',
    typicalNormal: 'Not Present',
    simpleExplanation: 'Clumps of white blood cells stuck together in urine, indicating concentrated inflammation.',
    medicalExplanation: 'Leukocyte casts or aggregates indicate significant inflammatory exudate within renal tubules.',
    riskContext: 'Presence of pus cell clumps increases the predicted probability of kidney inflammation.',
  },
  {
    id: 'ba',
    name: 'Bacteria in Urine',
    shortName: 'Bacteria',
    category: 'Kidney & Urinalysis',
    categoryKey: 'Kidney',
    unit: '',
    typicalNormal: 'Not Present',
    simpleExplanation: 'Bacteria found in urine, indicating bacterial colonization or urinary tract infection.',
    medicalExplanation: 'Bacteriuria reflects microbial presence that can ascend to cause pyelonephritis and tubular stress.',
    riskContext: 'Presence of urinary bacteria pushes the model toward higher risk.',
  },

  // ---------------------------------------------------------------------------
  // 3. Blood Chemistry & Hematology (9 features)
  // ---------------------------------------------------------------------------
  {
    id: 'bgr',
    name: 'Blood Glucose (Random)',
    shortName: 'Glucose',
    category: 'Blood Chemistry & Counts',
    categoryKey: 'Blood',
    unit: 'mg/dL',
    typicalNormal: '70 – 125 mg/dL',
    simpleExplanation: 'The level of sugar in your bloodstream at any random time.',
    medicalExplanation: 'Chronic hyperglycemia promotes advanced glycation end-products, inducing mesangial expansion and hyperfiltration injury.',
    riskContext: 'High blood glucose levels contribute toward increased CKD risk in the model.',
  },
  {
    id: 'bu',
    name: 'Blood Urea',
    shortName: 'Blood Urea',
    category: 'Blood Chemistry & Counts',
    categoryKey: 'Blood',
    unit: 'mg/dL',
    typicalNormal: '15 – 45 mg/dL',
    simpleExplanation: 'A waste product from protein breakdown. Healthy kidneys filter it out, so high levels mean waste is building up.',
    medicalExplanation: 'Elevated blood urea nitrogen reflects reduced glomerular clearance of nitrogenous protein catabolites.',
    riskContext: 'Higher urea levels push the prediction toward CKD.',
  },
  {
    id: 'sc',
    name: 'Serum Creatinine',
    shortName: 'Creatinine',
    category: 'Blood Chemistry & Counts',
    categoryKey: 'Blood',
    unit: 'mg/dL',
    typicalNormal: '0.6 – 1.2 mg/dL',
    simpleExplanation: 'A key waste product from muscle activity. It is one of the most reliable indicators of how well your kidneys are filtering.',
    medicalExplanation: 'Serum creatinine is inversely related to GFR; significant elevations denote declining renal parenchymal filtration.',
    riskContext: 'Creatinine values above 1.2 mg/dL strongly push the model toward higher CKD risk.',
  },
  {
    id: 'sod',
    name: 'Serum Sodium',
    shortName: 'Sodium',
    category: 'Blood Chemistry & Counts',
    categoryKey: 'Blood',
    unit: 'mEq/L',
    typicalNormal: '135 – 145 mEq/L',
    simpleExplanation: 'An essential electrolyte that controls water balance and nerve function throughout the body.',
    medicalExplanation: 'Hyponatremia or hypernatremia reflects impaired tubular sodium handling and disrupted free-water clearance.',
    riskContext: 'Electrolyte shifts outside 135–145 mEq/L contribute to higher model risk.',
  },
  {
    id: 'pot',
    name: 'Serum Potassium',
    shortName: 'Potassium',
    category: 'Blood Chemistry & Counts',
    categoryKey: 'Blood',
    unit: 'mEq/L',
    typicalNormal: '3.5 – 5.0 mEq/L',
    simpleExplanation: 'A critical mineral for heart and muscle rhythm. Kidneys regulate potassium balance tightly.',
    medicalExplanation: 'Hyperkalemia develops when distal tubular potassium excretion decreases with declining functional nephron mass.',
    riskContext: 'Elevated potassium levels push the model toward higher CKD risk.',
  },
  {
    id: 'hemo',
    name: 'Hemoglobin',
    shortName: 'Hemoglobin',
    category: 'Blood Chemistry & Counts',
    categoryKey: 'Blood',
    unit: 'g/dL',
    typicalNormal: '13.5 – 17.5 g/dL (M) / 12.0 – 15.5 g/dL (F)',
    simpleExplanation: 'The oxygen-carrying protein in red blood cells. Kidneys produce the hormone (EPO) that tells your body to make red blood cells.',
    medicalExplanation: 'Renal anemia occurs due to deficient erythropoietin secretion by diseased peritubular interstitial cells.',
    riskContext: 'Lower hemoglobin levels are one of the strongest features pushing the model toward CKD.',
  },
  {
    id: 'pcv',
    name: 'Packed Cell Volume (Hematocrit)',
    shortName: 'Hematocrit (PCV)',
    category: 'Blood Chemistry & Counts',
    categoryKey: 'Blood',
    unit: '%',
    typicalNormal: '40 – 50% (M) / 36 – 46% (F)',
    simpleExplanation: 'The percentage of blood volume made up of red blood cells.',
    medicalExplanation: 'Decreased packed cell volume directly correlates with normocytic normochromic anemia of chronic kidney disease.',
    riskContext: 'Reduced hematocrit pushes the model toward higher CKD risk.',
  },
  {
    id: 'wbcc',
    name: 'White Blood Cell Count',
    shortName: 'WBC Count',
    category: 'Blood Chemistry & Counts',
    categoryKey: 'Blood',
    unit: 'cells/cumm',
    typicalNormal: '4,500 – 11,000 cells/cumm',
    simpleExplanation: 'Immune cells that fight infections. High numbers indicate inflammation or active infection.',
    medicalExplanation: 'Elevated leukocyte count reflects systemic microinflammation or active tubulointerstitial inflammation.',
    riskContext: 'Elevated WBC count contributes a mild increase to predicted CKD risk.',
  },
  {
    id: 'rbcc',
    name: 'Red Blood Cell Count',
    shortName: 'RBC Count',
    category: 'Blood Chemistry & Counts',
    categoryKey: 'Blood',
    unit: 'M/cmm',
    typicalNormal: '4.5 – 5.9 M/cmm (M) / 4.0 – 5.2 M/cmm (F)',
    simpleExplanation: 'The total number of oxygen-carrying red blood cells in your bloodstream.',
    medicalExplanation: 'Erythrocytopenia reflects reduced renal marrow stimulation and uremic erythrocyte lifespan shortening.',
    riskContext: 'Low RBC count pushes the model toward higher CKD prediction.',
  },

  // ---------------------------------------------------------------------------
  // 4. Medical History & Symptoms (6 features)
  // ---------------------------------------------------------------------------
  {
    id: 'htn',
    name: 'Hypertension History',
    shortName: 'Hypertension',
    category: 'Medical History & Symptoms',
    categoryKey: 'Symptom',
    unit: '',
    typicalNormal: 'No',
    simpleExplanation: 'Whether you have a diagnosed history of high blood pressure.',
    medicalExplanation: 'Chronic systemic hypertension transmits high pressure to glomerular capillaries, causing progressive glomerulosclerosis.',
    riskContext: 'Hypertension is one of the top primary risk factors in the Decision Tree model.',
  },
  {
    id: 'dm',
    name: 'Diabetes Mellitus',
    shortName: 'Diabetes',
    category: 'Medical History & Symptoms',
    categoryKey: 'Symptom',
    unit: '',
    typicalNormal: 'No',
    simpleExplanation: 'Whether you have a diagnosed history of diabetes.',
    medicalExplanation: 'Diabetic nephropathy is characterized by basement membrane thickening and progressive nodular glomerulosclerosis.',
    riskContext: 'Presence of diabetes pushes the prediction toward higher CKD risk.',
  },
  {
    id: 'cad',
    name: 'Coronary Artery Disease',
    shortName: 'Heart Disease',
    category: 'Medical History & Symptoms',
    categoryKey: 'Symptom',
    unit: '',
    typicalNormal: 'No',
    simpleExplanation: 'A history of cardiovascular or heart blood vessel disease.',
    medicalExplanation: 'Cardiovascular disease and CKD share common microvascular atherosclerosis and endothelial dysfunction pathways.',
    riskContext: 'Coronary disease correlates with vascular impairment and increases model risk.',
  },
  {
    id: 'appet',
    name: 'Appetite Status',
    shortName: 'Appetite',
    category: 'Medical History & Symptoms',
    categoryKey: 'Symptom',
    unit: '',
    typicalNormal: 'Good',
    simpleExplanation: 'Whether your appetite is normal (good) or noticeably poor.',
    medicalExplanation: 'Anorexia and taste alterations are hallmark clinical symptoms of uremic toxin retention in chronic renal disease.',
    riskContext: 'Poor appetite pushes the model toward a higher CKD prediction.',
  },
  {
    id: 'pe',
    name: 'Pedal Edema (Leg Swelling)',
    shortName: 'Pedal Edema',
    category: 'Medical History & Symptoms',
    categoryKey: 'Symptom',
    unit: '',
    typicalNormal: 'No',
    simpleExplanation: 'Visible swelling in the feet, ankles, or lower legs caused by excess fluid accumulation.',
    medicalExplanation: 'Fluid retention occurs when damaged kidneys cannot effectively excrete sodium and water, expanding extracellular fluid volume.',
    riskContext: 'Presence of pedal edema increases estimated risk.',
  },
  {
    id: 'ane',
    name: 'Clinical Anemia',
    shortName: 'Anemia',
    category: 'Medical History & Symptoms',
    categoryKey: 'Symptom',
    unit: '',
    typicalNormal: 'No',
    simpleExplanation: 'A diagnosed condition where blood does not have enough healthy red blood cells.',
    medicalExplanation: 'Renal anemia is driven by deficient erythropoietin production by failing renal parenchyma.',
    riskContext: 'Presence of anemia pushes the model toward higher CKD risk.',
  },
];

export function getDualExplanation(
  featureKey: string,
  direction: 'increasing' | 'decreasing',
  observedValue?: string | number,
  shapValue?: number
): DualExplanation {
  const absShap = Math.abs(shapValue || 0);
  const influenceStrength: 'Strong' | 'Moderate' | 'Mild' =
    absShap >= 0.15 ? 'Strong' : absShap >= 0.04 ? 'Moderate' : 'Mild';

  const isIncreasing = direction === 'increasing';
  const generalExplanation = isIncreasing
    ? `This factor (${featureKey}) pushed the model toward a higher CKD prediction.`
    : `This factor (${featureKey}) pushed the model toward a lower CKD prediction.`;

  const medicalExplanation = `Observed value of ${featureKey} contributes ${(shapValue || 0) > 0 ? '+' : ''}${(shapValue || 0).toFixed(4)} to the classification margin.`;

  return {
    generalExplanation,
    medicalExplanation,
    influenceStrength,
  };
}

export const HOW_TO_READ_SHAP_GUIDE = {
  title: 'How to Read Tree SHAP Explanations',
  summary:
    'SHAP (SHapley Additive exPlanations) breaks down the Decision Tree model prediction so you can see exactly which health factors contributed to the result.',
  points: [
    {
      title: 'Pushed Toward Higher CKD Risk (Red / Rose)',
      description:
        'Factors shown in red (e.g. low hemoglobin, elevated creatinine, hypertension) pushed the model toward predicting Chronic Kidney Disease.',
    },
    {
      title: 'Pushed Toward Lower CKD Risk (Green / Emerald)',
      description:
        'Factors shown in green (e.g. normal hemoglobin, negative albuminuria, no diabetes) acted as protective factors, pushing the model toward a healthy result.',
    },
    {
      title: 'Impact Magnitude',
      description:
        'The length of the attribution bar indicates how strongly that biomarker influenced the Decision Tree splits.',
    },
  ],
};
