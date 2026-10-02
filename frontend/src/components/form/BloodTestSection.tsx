import React from 'react';
import { TestTube } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import { InputField } from './InputField';
import { PatientInput } from '../../types/ckd';

interface BloodTestSectionProps {
  formData: PatientInput;
  onChange: (field: keyof PatientInput, value: any) => void;
  errors?: Record<string, string>;
}

export const BloodTestSection: React.FC<BloodTestSectionProps> = ({
  formData,
  onChange,
  errors = {},
}) => {
  return (
    <SectionCard
      title="Blood Chemistry & Hematology"
      subtitle="Serum renal biomarkers, electrolytes, blood counts & hemoglobin levels"
      icon={TestTube}
      badge="Serum Laboratory (9 Features)"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Blood Glucose */}
        <FormField
          id="bgr"
          label="Blood Glucose (Random)"
          unit="mg/dL"
          required
          tooltip="Random blood sugar concentration. Normal fasting is 70 – 125 mg/dL."
          error={errors.bgr}
        >
          <InputField
            id="bgr"
            type="number"
            value={formData.bgr}
            onChange={(val) => onChange('bgr', parseFloat(val) || 0)}
            placeholder="e.g. 121"
            min={30}
            max={600}
            step={1}
            hasError={!!errors.bgr}
          />
        </FormField>

        {/* Blood Urea */}
        <FormField
          id="bu"
          label="Blood Urea"
          unit="mg/dL"
          required
          tooltip="Waste product from dietary protein. Normal range is 15 – 45 mg/dL. Elevated levels denote azotemia."
          error={errors.bu}
        >
          <InputField
            id="bu"
            type="number"
            value={formData.bu}
            onChange={(val) => onChange('bu', parseFloat(val) || 0)}
            placeholder="e.g. 36"
            min={1}
            max={500}
            step={0.5}
            hasError={!!errors.bu}
          />
        </FormField>

        {/* Serum Creatinine */}
        <FormField
          id="sc"
          label="Serum Creatinine"
          unit="mg/dL"
          required
          tooltip="Key kidney filtration marker. Normal range is 0.6 – 1.2 mg/dL. High values indicate declining filtration."
          error={errors.sc}
        >
          <InputField
            id="sc"
            type="number"
            value={formData.sc}
            onChange={(val) => onChange('sc', parseFloat(val) || 0)}
            placeholder="e.g. 1.2"
            min={0.1}
            max={50}
            step={0.1}
            hasError={!!errors.sc}
          />
        </FormField>

        {/* Sodium */}
        <FormField
          id="sod"
          label="Serum Sodium"
          unit="mEq/L"
          required
          tooltip="Electrolyte balance index. Normal physiological range is 135 – 145 mEq/L."
          error={errors.sod}
        >
          <InputField
            id="sod"
            type="number"
            value={formData.sod}
            onChange={(val) => onChange('sod', parseFloat(val) || 0)}
            placeholder="e.g. 137"
            min={80}
            max={200}
            step={0.5}
            hasError={!!errors.sod}
          />
        </FormField>

        {/* Potassium */}
        <FormField
          id="pot"
          label="Serum Potassium"
          unit="mEq/L"
          required
          tooltip="Critical electrolyte for cardiac rhythm. Normal range is 3.5 – 5.0 mEq/L."
          error={errors.pot}
        >
          <InputField
            id="pot"
            type="number"
            value={formData.pot}
            onChange={(val) => onChange('pot', parseFloat(val) || 0)}
            placeholder="e.g. 4.4"
            min={1.0}
            max={15.0}
            step={0.1}
            hasError={!!errors.pot}
          />
        </FormField>

        {/* Hemoglobin */}
        <FormField
          id="hemo"
          label="Hemoglobin"
          unit="g/dL"
          required
          tooltip="Oxygen-carrying red cell protein. Normal adult range is 12.0 – 17.5 g/dL. Low values indicate renal anemia."
          error={errors.hemo}
        >
          <InputField
            id="hemo"
            type="number"
            value={formData.hemo}
            onChange={(val) => onChange('hemo', parseFloat(val) || 0)}
            placeholder="e.g. 15.4"
            min={2.0}
            max={25.0}
            step={0.1}
            hasError={!!errors.hemo}
          />
        </FormField>

        {/* Packed Cell Volume */}
        <FormField
          id="pcv"
          label="Packed Cell Volume (PCV)"
          unit="%"
          required
          tooltip="Hematocrit percentage of red blood cells in circulating blood. Normal is 36 – 50%."
          error={errors.pcv}
        >
          <InputField
            id="pcv"
            type="number"
            value={formData.pcv}
            onChange={(val) => onChange('pcv', parseFloat(val) || 0)}
            placeholder="e.g. 44"
            min={10}
            max={70}
            step={1}
            hasError={!!errors.pcv}
          />
        </FormField>

        {/* RBC Count */}
        <FormField
          id="rbcc"
          label="Red Blood Cell Count"
          unit="M/cmm"
          required
          tooltip="Total red blood cell concentration. Normal adult range is 4.0 – 5.9 M/cmm."
          error={errors.rbcc}
        >
          <InputField
            id="rbcc"
            type="number"
            value={formData.rbcc}
            onChange={(val) => onChange('rbcc', parseFloat(val) || 0)}
            placeholder="e.g. 5.2"
            min={1.0}
            max={10.0}
            step={0.1}
            hasError={!!errors.rbcc}
          />
        </FormField>

        {/* WBC Count */}
        <FormField
          id="wbcc"
          label="White Blood Cell Count"
          unit="cells/cumm"
          required
          tooltip="Total leukocyte count. Normal range is 4,500 – 11,000 cells/cumm."
          error={errors.wbcc}
        >
          <InputField
            id="wbcc"
            type="number"
            value={formData.wbcc}
            onChange={(val) => onChange('wbcc', parseFloat(val) || 0)}
            placeholder="e.g. 7800"
            min={1000}
            max={50000}
            step={100}
            hasError={!!errors.wbcc}
          />
        </FormField>
      </div>
    </SectionCard>
  );
};
