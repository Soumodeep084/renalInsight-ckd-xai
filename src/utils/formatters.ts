import { RiskLevel, PredictionTarget } from '../types/ckd';

export function formatPercentage(val: number): string {
  return `${val.toFixed(2)}%`;
}

export function formatShapValue(val: number): string {
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toFixed(4)}`;
}

export function getRiskBadgeStyle(risk: RiskLevel): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (risk) {
    case 'Low':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'Moderate':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'High':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
      };
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-500',
      };
  }
}

export function getPredictionBadgeStyle(target: PredictionTarget): {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
} {
  if (target === 'CKD') {
    return {
      bg: 'bg-rose-500/10',
      text: 'text-rose-700',
      border: 'border-rose-300',
      badgeBg: 'bg-rose-600 text-white',
    };
  }
  return {
    bg: 'bg-teal-500/10',
    text: 'text-teal-800',
    border: 'border-teal-300',
    badgeBg: 'bg-teal-700 text-white',
  };
}
