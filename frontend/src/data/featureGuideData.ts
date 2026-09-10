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
 * Complete beginner-friendly guide for all 25 features used by the model.
 * Written in clear, non-technical language with concise medical accuracy.
 */
export const FEATURE_GUIDE_DATA: FeatureGuideItem[] = [
  // ---------------------------------------------------------------------------
  // 1. Patient Demographics & Resting Hemodynamics (3 features)
  // ---------------------------------------------------------------------------
  {
    id: 'age',
    name: 'Patient Age',
    shortName: 'Age',
    category: 'Patient Demographics',
    categoryKey: 'Demographic',
    unit: 'years',
    typicalNormal: 'Any age bracket',
    simpleExplanation: 'How old you are. As people get older, the kidneys naturally slow down their filtering speed over time.',
    medicalExplanation: 'Age-associated nephrosclerosis and gradual loss of functional nephron mass reduce physiological filtration reserve.',
    riskContext: 'Older age brackets naturally have a slightly higher baseline risk in the statistical model.',
  },
  {
    id: 'bp_diastolic',
    name: 'Diastolic Blood Pressure (Bottom Number)',
    shortName: 'Diastolic BP',
    category: 'Patient Demographics',
    categoryKey: 'Demographic',
    unit: 'mmHg',
    typicalNormal: '60 - 80 mmHg',
    simpleExplanation: 'The pressure inside your blood vessels when your heart is resting between beats.',
    medicalExplanation: 'Elevated resting diastolic pressure increases intraglomerular capillary pressure and accelerates microvascular thickening.',
    riskContext: 'High pressure strains the tiny blood vessels inside the kidneys, increasing estimated risk.',
  },
  {
    id: 'bp_limit',
    name: 'Blood Pressure Category',
    shortName: 'BP Category',
    category: 'Patient Demographics',
    categoryKey: 'Demographic',
    unit: 'mmHg bracket',
    typicalNormal: '70 - 80 mmHg (Normal)',
    simpleExplanation: 'A standard group showing if your resting blood pressure is low, normal, elevated, or high.',
    medicalExplanation: 'Categorical hypertension classification reflects the duration and severity of systemic vascular resistance.',
    riskContext: 'Consistently higher blood pressure brackets push the model prediction more toward CKD risk.',
  },

  // ---------------------------------------------------------------------------
  // 2. Kidney & Urine Parameters (7 features)
  // ---------------------------------------------------------------------------
  {
    id: 'sg',
    name: 'Urine Concentration (Specific Gravity)',
    shortName: 'Specific Gravity',
    category: 'Kidney & Urine Parameters',
    categoryKey: 'Kidney',
    unit: 'ratio',
    typicalNormal: '1.019 - 1.021',
    simpleExplanation: 'Shows how concentrated or watery your urine is. Healthy kidneys can concentrate urine when your body needs to save water.',
    medicalExplanation: 'Measures renal medullary tubular concentrating ability and urinary osmolality regulation.',
    riskContext: 'Very dilute urine (< 1.015) when the body is resting can indicate the kidneys are having trouble concentrating waste.',
  },
  {
    id: 'al',
    name: 'Protein in Urine (Albuminuria)',
    shortName: 'Albumin / Protein',
    category: 'Kidney & Urine Parameters',
    categoryKey: 'Kidney',
    unit: 'grade (0 to 4+)',
    typicalNormal: 'Normal / Negative (0)',
    simpleExplanation: 'Checks if important proteins that belong in your blood are accidentally leaking out into your urine.',
    medicalExplanation: 'Proteinuria reflects loss of podocyte slit diaphragm integrity and disruption of the glomerular filtration barrier.',
    riskContext: 'One of the most important early warning signs. Higher protein levels strongly increase CKD risk.',
  },
  {
    id: 'su',
    name: 'Sugar in Urine (Glucosuria)',
    shortName: 'Urinary Sugar',
    category: 'Kidney & Urine Parameters',
    categoryKey: 'Kidney',
    unit: 'grade (0 to 4+)',
    typicalNormal: 'Normal / Negative (0)',
    simpleExplanation: 'Checks if high levels of blood sugar are overflowing and spilling into your urine.',
    medicalExplanation: 'Occurs when serum glucose exceeds the proximal tubule absorptive threshold (~180 mg/dL), reflecting glycemic stress.',
    riskContext: 'Sugar in urine points to high blood sugar or tubule strain, pushing the model toward higher risk.',
  },
  {
    id: 'rbc',
    name: 'Red Blood Cells in Urine (Hematuria)',
    shortName: 'RBC in Urine',
    category: 'Kidney & Urine Parameters',
    categoryKey: 'Kidney',
    unit: 'status',
    typicalNormal: 'Normal',
    simpleExplanation: 'Checks if tiny amounts of blood cells are present in your urine sample.',
    medicalExplanation: 'Microscopic hematuria indicates potential glomerular basement membrane leakage or urinary tract irritation.',
    riskContext: 'Abnormal red blood cells suggest potential irritation or filter inflammation, raising the risk score.',
  },
  {
    id: 'pc',
    name: 'White Blood Cells in Urine (Pus Cells)',
    shortName: 'Pus Cells (WBC)',
    category: 'Kidney & Urine Parameters',
    categoryKey: 'Kidney',
    unit: 'status',
    typicalNormal: 'Normal',
    simpleExplanation: 'Checks for defense cells in urine, which usually appear when the body is fighting irritation or an infection.',
    medicalExplanation: 'Pyuria indicates active inflammatory response within the renal parenchyma, interstitium, or urinary tract.',
    riskContext: 'Higher white blood cells in urine indicate inflammation, increasing the model risk output.',
  },
  {
    id: 'pcc',
    name: 'White Blood Cell Clumps',
    shortName: 'Pus Cell Clumps',
    category: 'Kidney & Urine Parameters',
    categoryKey: 'Kidney',
    unit: 'status',
    typicalNormal: 'Not Present',
    simpleExplanation: 'Checks if white blood cells are sticking together in visible clumps under a microscope.',
    medicalExplanation: 'Aggregated leukocyte clumps indicate denser, more persistent urinary tract or kidney inflammation.',
    riskContext: 'The presence of cell clumps suggests noticeable inflammation, raising the predicted risk.',
  },
  {
    id: 'ba',
    name: 'Bacteria in Urine (Bacteriuria)',
    shortName: 'Bacteria',
    category: 'Kidney & Urine Parameters',
    categoryKey: 'Kidney',
    unit: 'status',
    typicalNormal: 'Not Present',
    simpleExplanation: 'Checks for bacteria in your urine that could cause a urinary tract infection (UTI).',
    medicalExplanation: 'Microscopic bacteriuria indicates bacterial colonization that could ascend to cause renal inflammation (pyelonephritis).',
    riskContext: 'Finding bacteria indicates possible infection, which slightly increases the model risk score.',
  },

  // ---------------------------------------------------------------------------
  // 3. Blood Biochemistry & Hematology (9 features)
  // ---------------------------------------------------------------------------
  {
    id: 'bgr',
    name: 'Blood Sugar Level (Random Glucose)',
    shortName: 'Blood Glucose',
    category: 'Blood Biochemistry & Lab',
    categoryKey: 'Blood',
    unit: 'mg/dL',
    typicalNormal: '< 112 mg/dL',
    simpleExplanation: 'Measures how much sugar is currently circulating in your bloodstream.',
    medicalExplanation: 'Chronic hyperglycemia produces advanced glycation end-products that damage small glomerular vessels.',
    riskContext: 'Consistently high blood sugar is the leading cause of kidney damage, pushing the model toward CKD.',
  },
  {
    id: 'bu',
    name: 'Blood Urea (BUN)',
    shortName: 'Blood Urea',
    category: 'Blood Biochemistry & Lab',
    categoryKey: 'Blood',
    unit: 'mg/dL',
    typicalNormal: '< 48.1 mg/dL',
    simpleExplanation: 'A natural waste product from digested proteins that healthy kidneys clear out into urine.',
    medicalExplanation: 'Blood urea increases when renal glomerular clearance of nitrogenous metabolic end-products diminishes.',
    riskContext: 'High urea levels mean waste is building up faster than the kidneys can clear it, increasing risk.',
  },
  {
    id: 'sc',
    name: 'Serum Creatinine',
    shortName: 'Creatinine',
    category: 'Blood Biochemistry & Lab',
    categoryKey: 'Blood',
    unit: 'mg/dL',
    typicalNormal: '< 3.65 mg/dL',
    simpleExplanation: 'A waste product from normal daily muscle use. It is the primary test doctors use to check how well kidneys are filtering.',
    medicalExplanation: 'Endogenous filtration marker directly inversely proportional to Glomerular Filtration Rate (GFR).',
    riskContext: 'Elevated creatinine is a strong indicator of reduced kidney filtration, significantly raising the risk score.',
  },
  {
    id: 'sod',
    name: 'Blood Sodium (Salt Level)',
    shortName: 'Sodium',
    category: 'Blood Biochemistry & Lab',
    categoryKey: 'Blood',
    unit: 'mEq/L',
    typicalNormal: '138 - 143 mEq/L',
    simpleExplanation: 'An essential mineral that helps manage your body’s fluid balance and blood pressure.',
    medicalExplanation: 'Dysregulation of serum sodium reflects impaired renal tubular sodium excretion and water handling.',
    riskContext: 'Abnormal sodium levels suggest fluid or mineral imbalance, slightly increasing the risk score.',
  },
  {
    id: 'pot',
    name: 'Blood Potassium',
    shortName: 'Potassium',
    category: 'Blood Biochemistry & Lab',
    categoryKey: 'Blood',
    unit: 'mEq/L',
    typicalNormal: '< 7.31 mEq/L',
    simpleExplanation: 'A crucial mineral needed for healthy heart rhythm and muscle movement. Kidneys remove extra potassium from food.',
    medicalExplanation: 'Hyperkalemia occurs when distal tubular potassium secretion is impaired due to reduced nephron function.',
    riskContext: 'Very high potassium indicates kidneys may be struggling to excrete minerals, raising the prediction score.',
  },
  {
    id: 'hemo',
    name: 'Hemoglobin Level',
    shortName: 'Hemoglobin',
    category: 'Blood Biochemistry & Lab',
    categoryKey: 'Blood',
    unit: 'g/dL',
    typicalNormal: '13.9 - 15.2 g/dL',
    simpleExplanation: 'The protein in red blood cells that carries oxygen throughout your body. Healthy kidneys release a hormone to help make it.',
    medicalExplanation: 'Anemia in CKD arises from reduced renal peritubular synthesis of erythropoietin (EPO).',
    riskContext: 'Low hemoglobin (anemia) is common in kidney disease and increases the model risk score.',
  },
  {
    id: 'pcv',
    name: 'Packed Cell Volume (Hematocrit)',
    shortName: 'PCV / Hematocrit',
    category: 'Blood Biochemistry & Lab',
    categoryKey: 'Blood',
    unit: '%',
    typicalNormal: '41.3 - 45.2 %',
    simpleExplanation: 'The percentage of your total blood volume that consists of oxygen-carrying red blood cells.',
    medicalExplanation: 'Correlates directly with circulating red cell mass and reflects renal erythropoietic signaling.',
    riskContext: 'Low hematocrit indicates anemia, which pushes the model prediction more toward CKD.',
  },
  {
    id: 'rbcc',
    name: 'Red Blood Cell Count',
    shortName: 'RBC Count',
    category: 'Blood Biochemistry & Lab',
    categoryKey: 'Blood',
    unit: 'M/µL',
    typicalNormal: '5.05 - 5.64 M/µL',
    simpleExplanation: 'The total number of red blood cells in a drop of blood.',
    medicalExplanation: 'Total erythrocyte density indicative of bone marrow stimulation by renal erythropoietin.',
    riskContext: 'A lower count reflects anemia from reduced kidney hormone stimulation, raising the risk score.',
  },
  {
    id: 'wbcc',
    name: 'White Blood Cell Count',
    shortName: 'WBC Count',
    category: 'Blood Biochemistry & Lab',
    categoryKey: 'Blood',
    unit: 'cells/cumm',
    typicalNormal: '4980 - 7360 cells/cumm',
    simpleExplanation: 'The total number of immune defense cells in your bloodstream.',
    medicalExplanation: 'Elevated leukocyte levels indicate systemic immune activation or inflammatory stress.',
    riskContext: 'Elevated counts can reflect underlying inflammation, which slightly increases the risk prediction.',
  },

  // ---------------------------------------------------------------------------
  // 4. Medical Conditions & Clinical Symptoms (6 features)
  // ---------------------------------------------------------------------------
  {
    id: 'htn',
    name: 'High Blood Pressure Diagnosis (Hypertension)',
    shortName: 'Hypertension',
    category: 'Medical Conditions & Symptoms',
    categoryKey: 'Symptom',
    unit: 'status (Yes/No)',
    typicalNormal: 'No',
    simpleExplanation: 'Whether you have a known history of chronic high blood pressure.',
    medicalExplanation: 'Systemic hypertension exerts chronic barotrauma on glomerular capillaries, accelerating renal sclerosis.',
    riskContext: 'High blood pressure is a leading cause of kidney strain; having it strongly increases the model risk score.',
  },
  {
    id: 'dm',
    name: 'Diabetes Mellitus Diagnosis',
    shortName: 'Diabetes',
    category: 'Medical Conditions & Symptoms',
    categoryKey: 'Symptom',
    unit: 'status (Yes/No)',
    typicalNormal: 'No',
    simpleExplanation: 'Whether you have a diagnosed history of diabetes.',
    medicalExplanation: 'Diabetic microangiopathy causes mesangial proliferation, glomerular thickening, and progressive nephropathy.',
    riskContext: 'Diabetes is the single most common cause of kidney disease, strongly pushing the prediction toward CKD.',
  },
  {
    id: 'cad',
    name: 'Coronary Artery Disease (Heart History)',
    shortName: 'Heart Disease (CAD)',
    category: 'Medical Conditions & Symptoms',
    categoryKey: 'Symptom',
    unit: 'status (Yes/No)',
    typicalNormal: 'No',
    simpleExplanation: 'Whether you have a history of heart disease or narrowed heart blood vessels.',
    medicalExplanation: 'Coronary atherosclerosis reflects generalized arterial disease that frequently coexists with renal microvascular disease.',
    riskContext: 'Heart and kidney health are closely linked; having vascular disease raises the model risk score.',
  },
  {
    id: 'appet',
    name: 'Appetite Status',
    shortName: 'Appetite',
    category: 'Medical Conditions & Symptoms',
    categoryKey: 'Symptom',
    unit: 'status (Good/Poor)',
    typicalNormal: 'Good',
    simpleExplanation: 'Whether your appetite is normal (Good) or poor (Poor / loss of appetite).',
    medicalExplanation: 'Poor appetite (anorexia) is a classic clinical manifestation of circulating uremic toxin retention and metabolic waste accumulation.',
    riskContext: 'Poor appetite often signals waste accumulation in the blood, pushing the model toward higher risk.',
  },
  {
    id: 'pe',
    name: 'Swelling in Feet / Legs (Pedal Edema)',
    shortName: 'Pedal Edema',
    category: 'Medical Conditions & Symptoms',
    categoryKey: 'Symptom',
    unit: 'status (Yes/No)',
    typicalNormal: 'No',
    simpleExplanation: 'Fluid buildup causing puffiness or swelling in your feet, ankles, or lower legs.',
    medicalExplanation: 'Peripheral edema reflects impaired renal sodium and water excretion, leading to extracellular fluid volume expansion.',
    riskContext: 'Fluid retention in the legs suggests kidneys may not be clearing extra salt and water, raising risk.',
  },
  {
    id: 'ane',
    name: 'Clinical Anemia Diagnosis',
    shortName: 'Anemia',
    category: 'Medical Conditions & Symptoms',
    categoryKey: 'Symptom',
    unit: 'status (Yes/No)',
    typicalNormal: 'No',
    simpleExplanation: 'Whether you have a medical diagnosis of low red blood cells (anemia).',
    medicalExplanation: 'Renal anemia develops when functioning kidney tissue produces less erythropoietin hormone needed for red cell creation.',
    riskContext: 'Anemia is a common secondary effect of reduced kidney function, increasing the risk score.',
  },
];

/**
 * Returns a beginner-friendly dual explanation (General + Medical) and influence strength
 * for any given SHAP factor.
 */
export function getDualExplanation(
  featureKey: string,
  direction: 'increasing' | 'decreasing',
  observedValue?: string | number,
  shapValue: number = 0
): DualExplanation {
  const absVal = Math.abs(shapValue);
  let influenceStrength: 'Strong' | 'Moderate' | 'Mild' = 'Mild';
  if (absVal >= 0.15) {
    influenceStrength = 'Strong';
  } else if (absVal >= 0.04) {
    influenceStrength = 'Moderate';
  }

  const isInc = direction === 'increasing';
  const valStr = String(observedValue || '').trim();

  // Feature specific tailored explanations
  switch (featureKey) {
    case 'htn':
      return {
        generalExplanation: isInc
          ? 'Having high blood pressure puts continuous strain on kidney filters, so this factor pushed the model toward CKD.'
          : 'Having no history of high blood pressure protects kidney blood vessels, helping lower the estimated risk.',
        medicalExplanation: isInc
          ? 'Systemic arterial hypertension increases glomerular capillary pressure and accelerates nephrosclerosis.'
          : 'Normotensive cardiovascular baseline preserves renal microvascular architecture and autoregulation.',
        influenceStrength,
      };

    case 'dm':
      return {
        generalExplanation: isInc
          ? 'Diabetes can affect kidney filters over time, so this factor strongly pushed the model toward CKD.'
          : 'Having no diabetes significantly protects kidney filters, helping lower the estimated risk score.',
        medicalExplanation: isInc
          ? 'Diabetic microangiopathy causes mesangial proliferation, podocyte loss, and progressive glomerulosclerosis.'
          : 'Absence of diabetes eliminates the primary metabolic etiology of chronic glomerular filtration disease.',
        influenceStrength,
      };

    case 'sc':
      return {
        generalExplanation: isInc
          ? `Serum creatinine (${valStr || 'elevated'}) indicates waste is accumulating in the blood, so the model increased the CKD risk.`
          : `Serum creatinine in the normal range (${valStr || 'normal'}) shows healthy waste filtering, lowering the risk score.`,
        medicalExplanation: isInc
          ? 'Elevated serum creatinine directly reflects reduced glomerular filtration rate (GFR) and diminished clearance kinetics.'
          : 'Physiological baseline serum creatinine confirms robust filtration kinetics and preserved functional nephron mass.',
        influenceStrength,
      };

    case 'al':
      return {
        generalExplanation: isInc
          ? `Protein detected in urine (${valStr || 'elevated'}) suggests the kidney filters might be leaking, increasing the risk score.`
          : 'No protein detected in urine shows tight, healthy kidney filters, lowering the estimated risk.',
        medicalExplanation: isInc
          ? 'Albuminuria indicates compromised podocyte slit diaphragm integrity and increased glomerular permeability.'
          : 'Negative albuminuria confirms intact glomerular basement membrane and preserved barrier selectivity.',
        influenceStrength,
      };

    case 'hemo':
      return {
        generalExplanation: isInc
          ? `Hemoglobin level (${valStr || 'low'}) suggests anemia, which often accompanies kidney strain and raises the risk score.`
          : `Healthy hemoglobin level (${valStr || 'normal'}) indicates good red blood cell production, helping lower risk.`,
        medicalExplanation: isInc
          ? 'Decreased hemoglobin reflects reduced renal erythropoietin (EPO) synthesis and uremic marrow suppression.'
          : 'Normal hemoglobin levels confirm adequate renal endocrine erythropoietin production.',
        influenceStrength,
      };

    case 'bu':
      return {
        generalExplanation: isInc
          ? `Blood urea (${valStr || 'elevated'}) shows protein waste is clearing more slowly than normal, raising the CKD score.`
          : `Blood urea in the normal range (${valStr || 'normal'}) shows the body is clearing protein waste properly, reducing risk.`,
        medicalExplanation: isInc
          ? 'Elevated blood urea reflects reduced renal clearance of nitrogenous metabolic end-products.'
          : 'Physiological blood urea levels signify preserved glomerular clearance of metabolic nitrogen.',
        influenceStrength,
      };

    case 'sg':
      return {
        generalExplanation: isInc
          ? `Urine concentration (${valStr || 'low'}) suggests the kidneys may have trouble concentrating waste, increasing the risk.`
          : `Optimal urine concentration (${valStr || 'normal'}) indicates well-functioning kidney tubules, reducing the risk score.`,
        medicalExplanation: isInc
          ? 'Reduced urinary specific gravity indicates impaired medullary tubular concentrating ability.'
          : 'Physiological specific gravity confirms preserved renal tubular and collecting duct function.',
        influenceStrength,
      };

    case 'bgr':
      return {
        generalExplanation: isInc
          ? `Blood sugar (${valStr || 'high'}) places metabolic stress on blood vessels, pushing the model toward higher CKD risk.`
          : `Normal blood sugar (${valStr || 'normal'}) protects blood vessels from sugar damage, keeping the risk score lower.`,
        medicalExplanation: isInc
          ? 'Hyperglycemia induces advanced glycation end-products (AGEs), promoting glomerular hyperfiltration and sclerosis.'
          : 'Euglycemic blood glucose range protects microvascular endothelium from oxidative and glycation stress.',
        influenceStrength,
      };

    case 'sod':
      return {
        generalExplanation: isInc
          ? `Blood sodium level (${valStr || 'imbalanced'}) reflects a fluid or salt imbalance, slightly increasing the risk.`
          : `Well-balanced blood sodium (${valStr || 'optimal'}) shows good fluid regulation, helping lower the risk score.`,
        medicalExplanation: isInc
          ? 'Dysnatremia reflects impaired tubular sodium handling and disrupted extracellular fluid volume homeostasis.'
          : 'Optimal serum sodium concentrations reflect intact renin-angiotensin-aldosterone balance and tubular handling.',
        influenceStrength,
      };

    case 'pot':
      return {
        generalExplanation: isInc
          ? `Potassium level (${valStr || 'high'}) indicates the kidneys may struggle to clear extra minerals, raising the risk score.`
          : `Regulated potassium level (${valStr || 'normal'}) shows normal mineral clearing by the kidneys, reducing risk.`,
        medicalExplanation: isInc
          ? 'Hyperkalemia indicates impaired distal tubular potassium excretion, common in advanced renal insufficiency.'
          : 'Normokalemia confirms adequate aldosterone-mediated potassium secretion in collecting tubules.',
        influenceStrength,
      };

    case 'pcv':
      return {
        generalExplanation: isInc
          ? `Packed cell volume (${valStr || 'low'}) indicates a lower proportion of red blood cells (anemia), increasing risk.`
          : `Healthy packed cell volume (${valStr || 'normal'}) indicates good red blood cell density, lowering the risk score.`,
        medicalExplanation: isInc
          ? 'Low hematocrit correlates with normocytic normochromic anemia of chronic kidney disease.'
          : 'Standard packed cell volume confirms preserved red cell mass and effective erythrogenesis.',
        influenceStrength,
      };

    case 'rbcc':
      return {
        generalExplanation: isInc
          ? `Red blood cell count (${valStr || 'low'}) points toward kidney-related anemia, raising the risk score.`
          : `Optimal red blood cell count (${valStr || 'normal'}) indicates healthy blood cell creation, reducing risk.`,
        medicalExplanation: isInc
          ? 'Erythrocytopenia reflects diminished circulating erythrocyte mass due to impaired renal EPO output.'
          : 'Optimal erythrocyte density confirms healthy marrow stimulation and endocrine kidney function.',
        influenceStrength,
      };

    case 'wbcc':
      return {
        generalExplanation: isInc
          ? `White blood cell count (${valStr || 'elevated'}) suggests active inflammation or infection, slightly increasing risk.`
          : `Normal white blood cell count (${valStr || 'normal'}) indicates no active systemic inflammation, keeping risk lower.`,
        medicalExplanation: isInc
          ? 'Leukocytosis reflects systemic inflammatory response or infection, which can accelerate renal functional decline.'
          : 'Baseline leukocyte count signifies absence of acute systemic inflammatory or infective stress.',
        influenceStrength,
      };

    case 'bp_limit':
    case 'bp limit':
      return {
        generalExplanation: isInc
          ? `Blood pressure category (${valStr || 'elevated'}) indicates higher vascular strain, pushing the model toward CKD.`
          : `Controlled blood pressure category (${valStr || 'normal'}) helps shield kidney filters from strain, lowering risk.`,
        medicalExplanation: isInc
          ? 'Categorical arterial hypertension correlates with progressive hypertensive nephrosclerosis.'
          : 'Optimal blood pressure categorization reflects controlled systemic vascular resistance and glomerular protection.',
        influenceStrength,
      };

    case 'appet':
      return {
        generalExplanation: isInc
          ? 'Poor appetite can be a clinical sign of waste buildup in the body, pushing the model toward higher risk.'
          : 'Good appetite is a reassuring sign that waste products are not accumulating severely, lowering risk.',
        medicalExplanation: isInc
          ? 'Anorexia and reduced oral intake are classic clinical manifestations of uremic toxicity and metabolic acidosis.'
          : 'Preserved appetite indicates low circulating uremic solute burden and preserved nutritional metabolic status.',
        influenceStrength,
      };

    case 'pe':
      return {
        generalExplanation: isInc
          ? 'Swelling in the feet or legs suggests fluid retention from reduced kidney clearing, raising the risk score.'
          : 'Absence of leg swelling indicates balanced fluid and salt handling, reducing the model risk score.',
        medicalExplanation: isInc
          ? 'Peripheral edema reflects compromised renal sodium excretion, tubular retention, and expanded extracellular volume.'
          : 'Absence of pedal edema confirms balanced sodium excretion and normal extracellular fluid volume.',
        influenceStrength,
      };

    case 'ane':
      return {
        generalExplanation: isInc
          ? 'Diagnosed anemia is a frequent secondary complication of kidney disease, increasing the estimated risk.'
          : 'No clinical anemia indicates healthy red blood cell production, helping lower the estimated risk score.',
        medicalExplanation: isInc
          ? 'Clinical anemia in renal disease reflects decreased erythropoietin secretion and shortened erythrocyte lifespan.'
          : 'Absence of clinical anemia signifies intact renal parenchymal erythropoietic endocrine capacity.',
        influenceStrength,
      };

    case 'cad':
      return {
        generalExplanation: isInc
          ? 'A history of heart disease suggests shared blood vessel stress, increasing the model risk score.'
          : 'No history of heart or artery disease indicates healthier overall blood vessels, keeping risk lower.',
        medicalExplanation: isInc
          ? 'Coronary atherosclerosis reflects systemic generalized vascular disease that frequently coexists with renal microangiopathy.'
          : 'Absence of coronary artery disease correlates with lower systemic atherosclerotic and microvascular burden.',
        influenceStrength,
      };

    case 'rbc':
      return {
        generalExplanation: isInc
          ? 'Red blood cells in urine suggest possible irritation or filter inflammation, raising the risk score.'
          : 'Normal urine with no excess red blood cells indicates healthy filter integrity, lowering risk.',
        medicalExplanation: isInc
          ? 'Microscopic hematuria may reflect glomerular inflammation, basement membrane disruption, or urological pathology.'
          : 'Normal urinary sediment without dysmorphic erythrocytes indicates intact glomerular filtration integrity.',
        influenceStrength,
      };

    case 'pc':
      return {
        generalExplanation: isInc
          ? 'Pus cells in urine point to inflammation or infection in the urinary tract, increasing the risk score.'
          : 'Normal pus cell levels show clear urine without active infection, lowering the risk score.',
        medicalExplanation: isInc
          ? 'Pyuria indicates active leukocyturia secondary to urinary tract inflammation or interstitial nephritis.'
          : 'Absence of pyuria indicates clear urinary sediment without active inflammatory cell infiltration.',
        influenceStrength,
      };

    case 'pcc':
      return {
        generalExplanation: isInc
          ? 'Pus cell clumps indicate notable urinary tract inflammation, pushing the model toward higher CKD risk.'
          : 'No pus cell clumps indicates clean urine without aggregated inflammation, reducing risk.',
        medicalExplanation: isInc
          ? 'Aggregated leukocyte clumps indicate dense inflammatory exudate within the urinary collecting system.'
          : 'Absence of leukocyte aggregates confirms absence of significant pyogenic inflammation.',
        influenceStrength,
      };

    case 'ba':
      return {
        generalExplanation: isInc
          ? 'Bacteria in urine suggests an infection that could stress the kidneys, slightly raising the risk score.'
          : 'No bacteria in urine is a healthy finding that keeps the risk score lower.',
        medicalExplanation: isInc
          ? 'Significant bacteriuria reflects bacterial colonization that may predispose to ascending pyelonephritis.'
          : 'Sterile urine sample confirms absence of significant bacterial colonization in the urinary tract.',
        influenceStrength,
      };

    case 'su':
      return {
        generalExplanation: isInc
          ? 'Sugar in urine points to high blood sugar levels or kidney tubule strain, increasing the risk score.'
          : 'No sugar in urine shows stable glucose handling, lowering the model estimated risk score.',
        medicalExplanation: isInc
          ? 'Glucosuria reflects serum glucose exceeding renal threshold (~180 mg/dL), associated with diabetic metabolic stress.'
          : 'Absence of glucosuria indicates intact proximal tubular reabsorption and euglycemic renal handling.',
        influenceStrength,
      };

    case 'age':
      return {
        generalExplanation: isInc
          ? `Age bracket (${valStr || 'older'}) reflects natural age-related changes in kidney filtering, raising baseline risk.`
          : `Age bracket (${valStr || 'younger'}) is associated with higher baseline kidney reserves, lowering the risk score.`,
        medicalExplanation: isInc
          ? 'Age-associated glomerulosclerosis and tubular atrophy result in a gradual decline in functional nephron reserve.'
          : 'Younger demographic profile correlates with robust functional nephron reserve and minimal vascular aging.',
        influenceStrength,
      };

    default:
      return {
        generalExplanation: isInc
          ? `This factor (${valStr || 'observed'}) pushed the model prediction more toward Chronic Kidney Disease (CKD).`
          : `This factor (${valStr || 'observed'}) acted as a protective influence, lowering the predicted CKD risk.`,
        medicalExplanation: isInc
          ? 'Observed clinical parameter contributed a positive attribution weight in the logistic regression decision boundary.'
          : 'Observed clinical parameter contributed a negative attribution weight toward the non-disease classification.',
        influenceStrength,
      };
  }
}
