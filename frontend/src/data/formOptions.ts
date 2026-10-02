import { PatientInput } from '../types/ckd';

export interface OptionItem {
  value: string;
  label: string;
}

export const SG_OPTIONS: { value: number; label: string }[] = [
  { value: 1.005, label: '1.005 (Dilute)' },
  { value: 1.010, label: '1.010 (Low Normal)' },
  { value: 1.015, label: '1.015 (Normal)' },
  { value: 1.020, label: '1.020 (Optimal)' },
  { value: 1.025, label: '1.025 (Concentrated)' },
];

export const ALBUMIN_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: '0 (Negative / Normal)' },
  { value: 1, label: '1 (Trace / 1+)' },
  { value: 2, label: '2 (Mild / 2+)' },
  { value: 3, label: '3 (Moderate / 3+)' },
  { value: 4, label: '4 (Severe / 4+)' },
  { value: 5, label: '5 (Heavy / 5+)' },
];

export const SUGAR_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: '0 (Negative / Normal)' },
  { value: 1, label: '1 (1+)' },
  { value: 2, label: '2 (2+)' },
  { value: 3, label: '3 (3+)' },
  { value: 4, label: '4 (4+)' },
  { value: 5, label: '5 (5+)' },
];

export const BINARY_NORMAL_ABNORMAL: OptionItem[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'abnormal', label: 'Abnormal' },
];

export const BINARY_PRESENT_NOTPRESENT: OptionItem[] = [
  { value: 'notpresent', label: 'Not Present' },
  { value: 'present', label: 'Present' },
];

export const BINARY_YES_NO: OptionItem[] = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
];

export const APPETITE_OPTIONS: OptionItem[] = [
  { value: 'good', label: 'Good' },
  { value: 'poor', label: 'Poor' },
];

export const DEFAULT_PATIENT_INPUT: PatientInput = {
  // Demographics & Vitals
  age: 48,
  bp: 80,

  // Urinalysis & Kidney Function
  sg: 1.020,
  al: 0,
  su: 0,
  rbc: 'normal',
  pc: 'normal',
  pcc: 'notpresent',
  ba: 'notpresent',

  // Blood Chemistry & Hematology
  bgr: 121,
  bu: 36,
  sc: 1.2,
  sod: 137,
  pot: 4.4,
  hemo: 15.4,
  pcv: 44,
  wbcc: 7800,
  rbcc: 5.2,

  // Medical History & Symptoms
  htn: 'no',
  dm: 'no',
  cad: 'no',
  appet: 'good',
  pe: 'no',
  ane: 'no',
};
