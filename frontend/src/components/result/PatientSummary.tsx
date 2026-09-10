import React from 'react';
import { PatientInput } from '../../types/ckd';
import { Edit3, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface PatientSummaryProps {
  inputData: PatientInput;
  onEditInputs: () => void;
}

export const PatientSummary: React.FC<PatientSummaryProps> = ({ inputData, onEditInputs }) => {
  const summaryItems = [
    { label: 'Patient Age', value: inputData.age, category: 'Demographics' },
    { label: 'Diastolic BP', value: `${inputData.bp_diastolic} mmHg`, category: 'Demographics' },
    { label: 'BP Limit', value: inputData.bp_limit, category: 'Demographics' },
    { label: 'Specific Gravity', value: inputData.sg, category: 'Urinalysis' },
    { label: 'Albuminuria', value: inputData.al, category: 'Urinalysis' },
    { label: 'Urinary Sugar', value: inputData.su, category: 'Urinalysis' },
    { label: 'Red Blood Cells', value: inputData.rbc, category: 'Urinalysis' },
    { label: 'Pus Cells', value: inputData.pc, category: 'Urinalysis' },
    { label: 'Pus Cell Clumps', value: inputData.pcc, category: 'Urinalysis' },
    { label: 'Bacteria', value: inputData.ba, category: 'Urinalysis' },
    { label: 'Blood Glucose', value: `${inputData.bgr} mg/dL`, category: 'Blood Panel' },
    { label: 'Blood Urea', value: `${inputData.bu} mg/dL`, category: 'Blood Panel' },
    { label: 'Serum Creatinine', value: `${inputData.sc} mg/dL`, category: 'Blood Panel' },
    { label: 'Serum Sodium', value: `${inputData.sod} mEq/L`, category: 'Blood Panel' },
    { label: 'Potassium', value: `${inputData.pot} mEq/L`, category: 'Blood Panel' },
    { label: 'Hemoglobin', value: `${inputData.hemo} g/dL`, category: 'Blood Panel' },
    { label: 'Packed Cell Volume', value: `${inputData.pcv} %`, category: 'Blood Panel' },
    { label: 'RBC Count', value: `${inputData.rbcc} M/µL`, category: 'Blood Panel' },
    { label: 'WBC Count', value: `${inputData.wbcc} cells/cumm`, category: 'Blood Panel' },
    { label: 'Hypertension', value: inputData.htn, category: 'Symptoms' },
    { label: 'Diabetes Mellitus', value: inputData.dm, category: 'Symptoms' },
    { label: 'Coronary Artery Disease', value: inputData.cad, category: 'Symptoms' },
    { label: 'Appetite Status', value: inputData.appet, category: 'Symptoms' },
    { label: 'Pedal Edema', value: inputData.pe, category: 'Symptoms' },
    { label: 'Clinical Anemia', value: inputData.ane, category: 'Symptoms' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 border border-teal-200/60 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Patient Input Summary
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Verified clinical features submitted for model assessment
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEditInputs}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Edit3 className="w-4 h-4 text-teal-400" />
          <span>Edit Inputs</span>
        </button>
      </div>

      {/* Grid of Values */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {summaryItems.map((item, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1 hover:bg-slate-100/80 transition-colors"
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {item.category}
            </div>
            <div className="text-xs font-semibold text-slate-700 truncate">{item.label}</div>
            <div className="text-xs font-bold text-slate-900 font-mono flex items-center gap-1">
              {item.value === 'Yes' || item.value === 'Abnormal' || item.value === 'Present' ? (
                <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
              ) : item.value === 'No' || item.value === 'Normal' || item.value === 'Not Present' ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
              ) : null}
              <span className="truncate">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
