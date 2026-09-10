import { PatientInput } from '../types/ckd';

export interface OptionItem {
  value: string;
  label: string;
}

export const AGE_OPTIONS: OptionItem[] = [
  { value: '< 12', label: '< 12 years' },
  { value: '12 - 20', label: '12 - 20 years' },
  { value: '20 - 27', label: '20 - 27 years' },
  { value: '27 - 35', label: '27 - 35 years' },
  { value: '35 - 43', label: '35 - 43 years' },
  { value: '43 - 51', label: '43 - 51 years' },
  { value: '51 - 59', label: '51 - 59 years' },
  { value: '59 - 66', label: '59 - 66 years' },
  { value: '66 - 74', label: '66 - 74 years' },
  { value: '≥ 74', label: '≥ 74 years' },
];

export const BP_LIMIT_OPTIONS: OptionItem[] = [
  { value: '< 70', label: '< 70 mmHg (Low)' },
  { value: '70 - 80', label: '70 - 80 mmHg (Normal)' },
  { value: '80 - 90', label: '80 - 90 mmHg (Elevated)' },
  { value: '≥ 90', label: '≥ 90 mmHg (High)' },
];

export const SG_OPTIONS: OptionItem[] = [
  { value: '< 1.007', label: '< 1.007 (Very Low / Dilute)' },
  { value: '1.009 - 1.011', label: '1.009 - 1.011 (Low)' },
  { value: '1.015 - 1.017', label: '1.015 - 1.017 (Mild Low)' },
  { value: '1.019 - 1.021', label: '1.019 - 1.021 (Normal / Optimal)' },
  { value: '≥ 1.023', label: '≥ 1.023 (High Concentrate)' },
];

export const ALBUMIN_OPTIONS: OptionItem[] = [
  { value: '< 0', label: 'Normal / Negative (0)' },
  { value: '1', label: '1+ (Trace Proteinuria)' },
  { value: '2', label: '2+ (Mild Proteinuria)' },
  { value: '3', label: '3+ (Moderate Proteinuria)' },
  { value: '≥ 4', label: '≥ 4+ (Severe Proteinuria)' },
];

export const SUGAR_OPTIONS: OptionItem[] = [
  { value: '< 0', label: 'Normal / Negative (0)' },
  { value: '2', label: '2+ (250 mg/dL Glucosuria)' },
  { value: '3', label: '3+ (500 mg/dL Glucosuria)' },
  { value: '4', label: '4+ (1000 mg/dL Glucosuria)' },
  { value: '≥ 4', label: '≥ 4+ (>1000 mg/dL Glucosuria)' },
];

export const RBC_OPTIONS: OptionItem[] = [
  { value: 'Normal', label: 'Normal' },
  { value: 'Abnormal', label: 'Abnormal' },
];

export const PC_OPTIONS: OptionItem[] = [
  { value: 'Normal', label: 'Normal' },
  { value: 'Abnormal', label: 'Abnormal' },
];

export const PCC_OPTIONS: OptionItem[] = [
  { value: 'Not Present', label: 'Not Present' },
  { value: 'Present', label: 'Present' },
];

export const BA_OPTIONS: OptionItem[] = [
  { value: 'Not Present', label: 'Not Present' },
  { value: 'Present', label: 'Present' },
];

export const BGR_OPTIONS: OptionItem[] = [
  { value: '< 112', label: '< 112 mg/dL (Normal Fasting/Random)' },
  { value: '112 - 154', label: '112 - 154 mg/dL' },
  { value: '154 - 196', label: '154 - 196 mg/dL (Elevated)' },
  { value: '196 - 238', label: '196 - 238 mg/dL (High)' },
  { value: '238 - 280', label: '238 - 280 mg/dL' },
  { value: '280 - 322', label: '280 - 322 mg/dL' },
  { value: '322 - 364', label: '322 - 364 mg/dL' },
  { value: '406 - 448', label: '406 - 448 mg/dL' },
  { value: '≥ 448', label: '≥ 448 mg/dL (Severe Hyperglycemia)' },
];

export const BU_OPTIONS: OptionItem[] = [
  { value: '< 48.1', label: '< 48.1 mg/dL (Normal Range)' },
  { value: '48.1 - 86.2', label: '48.1 - 86.2 mg/dL (Mild Elevation)' },
  { value: '86.2 - 124.3', label: '86.2 - 124.3 mg/dL (Moderate)' },
  { value: '124.3 - 162.4', label: '124.3 - 162.4 mg/dL' },
  { value: '162.4 - 200.5', label: '162.4 - 200.5 mg/dL (High Azotemia)' },
  { value: '200.5 - 238.6', label: '200.5 - 238.6 mg/dL' },
  { value: '238.6 - 276.7', label: '238.6 - 276.7 mg/dL' },
  { value: '≥ 352.9', label: '≥ 352.9 mg/dL (Critical Uremic Level)' },
];

export const SOD_OPTIONS: OptionItem[] = [
  { value: '< 118', label: '< 118 mEq/L (Severe Hyponatremia)' },
  { value: '118 - 123', label: '118 - 123 mEq/L (Moderate Hyponatremia)' },
  { value: '123 - 128', label: '123 - 128 mEq/L (Mild Hyponatremia)' },
  { value: '128 - 133', label: '128 - 133 mEq/L' },
  { value: '133 - 138', label: '133 - 138 mEq/L (Normal Low)' },
  { value: '138 - 143', label: '138 - 143 mEq/L (Optimal Electrolyte)' },
  { value: '143 - 148', label: '143 - 148 mEq/L (Normal High)' },
  { value: '148 - 153', label: '148 - 153 mEq/L' },
  { value: '≥ 158', label: '≥ 158 mEq/L (Hypernatremia)' },
];

export const SC_OPTIONS: OptionItem[] = [
  { value: '< 3.65', label: '< 3.65 mg/dL (Normal / Baseline)' },
  { value: '3.65 - 6.8', label: '3.65 - 6.8 mg/dL (Elevated)' },
  { value: '6.8 - 9.95', label: '6.8 - 9.95 mg/dL (High Impairment)' },
  { value: '9.95 - 13.1', label: '9.95 - 13.1 mg/dL (Severe Impairment)' },
  { value: '13.1 - 16.25', label: '13.1 - 16.25 mg/dL (Very High)' },
  { value: '≥ 28.85', label: '≥ 28.85 mg/dL (Critical Renal Retention)' },
];

export const POT_OPTIONS: OptionItem[] = [
  { value: '< 7.31', label: '< 7.31 mEq/L (Normal / Regulated)' },
  { value: '38.18 - 42.59', label: '38.18 - 42.59 mEq/L (Extreme Hyperkalemia)' },
];

export const HEMO_OPTIONS: OptionItem[] = [
  { value: '< 6.1', label: '< 6.1 g/dL (Severe Critical Anemia)' },
  { value: '6.1 - 7.4', label: '6.1 - 7.4 g/dL' },
  { value: '7.4 - 8.7', label: '7.4 - 8.7 g/dL' },
  { value: '8.7 - 10', label: '8.7 - 10.0 g/dL (Moderate Anemia)' },
  { value: '10 - 11.3', label: '10.0 - 11.3 g/dL (Mild Anemia)' },
  { value: '11.3 - 12.6', label: '11.3 - 12.6 g/dL' },
  { value: '12.6 - 13.9', label: '12.6 - 13.9 g/dL' },
  { value: '13.9 - 15.2', label: '13.9 - 15.2 g/dL (Normal Physiological)' },
  { value: '15.2 - 16.5', label: '15.2 - 16.5 g/dL (Optimal High)' },
  { value: '≥ 16.5', label: '≥ 16.5 g/dL (High)' },
];

export const PCV_OPTIONS: OptionItem[] = [
  { value: '< 17.9', label: '< 17.9 % (Severe Hematocrit Loss)' },
  { value: '17.9 - 21.8', label: '17.9 - 21.8 %' },
  { value: '21.8 - 25.7', label: '21.8 - 25.7 %' },
  { value: '25.7 - 29.6', label: '25.7 - 29.6 %' },
  { value: '29.6 - 33.5', label: '29.6 - 33.5 % (Low)' },
  { value: '33.5 - 37.4', label: '33.5 - 37.4 %' },
  { value: '37.4 - 41.3', label: '37.4 - 41.3 %' },
  { value: '41.3 - 45.2', label: '41.3 - 45.2 % (Normal Adult Range)' },
  { value: '45.2 - 49.1', label: '45.2 - 49.1 %' },
  { value: '≥ 49.1', label: '≥ 49.1 % (High Concentration)' },
];

export const RBCC_OPTIONS: OptionItem[] = [
  { value: '< 2.69', label: '< 2.69 M/µL (Very Low)' },
  { value: '2.69 - 3.28', label: '2.69 - 3.28 M/µL' },
  { value: '3.28 - 3.87', label: '3.28 - 3.87 M/µL (Low)' },
  { value: '3.87 - 4.46', label: '3.87 - 4.46 M/µL' },
  { value: '4.46 - 5.05', label: '4.46 - 5.05 M/µL (Normal Low)' },
  { value: '5.05 - 5.64', label: '5.05 - 5.64 M/µL (Optimal)' },
  { value: '5.64 - 6.23', label: '5.64 - 6.23 M/µL' },
  { value: '6.23 - 6.82', label: '6.23 - 6.82 M/µL' },
  { value: '≥ 7.41', label: '≥ 7.41 M/µL (High Count)' },
];

export const WBCC_OPTIONS: OptionItem[] = [
  { value: '< 4980', label: '< 4980 cells/cumm (Low / Leukopenia)' },
  { value: '4980 - 7360', label: '4980 - 7360 cells/cumm (Normal)' },
  { value: '7360 - 9740', label: '7360 - 9740 cells/cumm' },
  { value: '9740 - 12120', label: '9740 - 12120 cells/cumm (Elevated)' },
  { value: '12120 - 14500', label: '12120 - 14500 cells/cumm (High)' },
  { value: '14500 - 16880', label: '14500 - 16880 cells/cumm' },
  { value: '16880 - 19260', label: '16880 - 19260 cells/cumm' },
  { value: '19260 - 21640', label: '19260 - 21640 cells/cumm (Leukocytosis)' },
];

export const DEFAULT_PATIENT_INPUT: PatientInput = {
  age: '59 - 66',
  bp_diastolic: 76,
  bp_limit: '70 - 80',
  sg: '1.019 - 1.021',
  al: '< 0',
  su: '< 0',
  rbc: 'Normal',
  pc: 'Normal',
  pcc: 'Not Present',
  ba: 'Not Present',
  bgr: '< 112',
  bu: '< 48.1',
  sod: '138 - 143',
  sc: '< 3.65',
  pot: '< 7.31',
  hemo: '13.9 - 15.2',
  pcv: '41.3 - 45.2',
  rbcc: '5.05 - 5.64',
  wbcc: '4980 - 7360',
  htn: 'No',
  dm: 'No',
  cad: 'No',
  appet: 'Good',
  pe: 'No',
  ane: 'No',
};
