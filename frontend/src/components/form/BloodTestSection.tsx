import React from 'react';
import { TestTube } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import { SelectField } from './SelectField';
import {
  BGR_OPTIONS,
  BU_OPTIONS,
  SOD_OPTIONS,
  SC_OPTIONS,
  POT_OPTIONS,
  HEMO_OPTIONS,
  PCV_OPTIONS,
  RBCC_OPTIONS,
  WBCC_OPTIONS,
} from '../../data/formOptions';
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
      title="Blood Test Parameters"
      subtitle="Serum biochemistry, renal retention markers, electrolytes & hematology panel"
      icon={TestTube}
      badge="Serum Laboratory (9 Markers)"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Blood Glucose */}
        <FormField
          id="bgr"
          label="Blood Glucose (Random)"
          unit="mg/dL"
          required
          tooltip="Random blood sugar level. Elevated values suggest glycemic dysregulation or diabetic nephropathy."
          error={errors.bgr}
        >
          <SelectField
            id="bgr"
            value={formData.bgr}
            onChange={(val) => onChange('bgr', val)}
            options={BGR_OPTIONS}
            hasError={!!errors.bgr}
          />
        </FormField>

        {/* Blood Urea */}
        <FormField
          id="bu"
          label="Blood Urea"
          unit="mg/dL"
          required
          tooltip="Waste product from protein breakdown. Higher levels indicate diminished urea clearance by kidneys."
          error={errors.bu}
        >
          <SelectField
            id="bu"
            value={formData.bu}
            onChange={(val) => onChange('bu', val)}
            options={BU_OPTIONS}
            hasError={!!errors.bu}
          />
        </FormField>

        {/* Serum Creatinine */}
        <FormField
          id="sc"
          label="Serum Creatinine"
          unit="mg/dL"
          required
          tooltip="Primary biomarker for kidney filtration function. Higher values indicate reduced renal clearance."
          error={errors.sc}
        >
          <SelectField
            id="sc"
            value={formData.sc}
            onChange={(val) => onChange('sc', val)}
            options={SC_OPTIONS}
            hasError={!!errors.sc}
          />
        </FormField>

        {/* Sodium */}
        <FormField
          id="sod"
          label="Sodium"
          unit="mEq/L"
          required
          tooltip="Electrolyte balance index. Hyponatremia (<135) or Hypernatremia can reflect fluid overload or renal tubular dysfunction."
          error={errors.sod}
        >
          <SelectField
            id="sod"
            value={formData.sod}
            onChange={(val) => onChange('sod', val)}
            options={SOD_OPTIONS}
            hasError={!!errors.sod}
          />
        </FormField>

        {/* Potassium */}
        <FormField
          id="pot"
          label="Potassium"
          unit="mEq/L"
          required
          tooltip="Essential serum electrolyte. Hyperkalemia (≥5.5) is a major complication of advanced renal failure."
          error={errors.pot}
        >
          <SelectField
            id="pot"
            value={formData.pot}
            onChange={(val) => onChange('pot', val)}
            options={POT_OPTIONS}
            hasError={!!errors.pot}
          />
        </FormField>

        {/* Hemoglobin */}
        <FormField
          id="hemo"
          label="Hemoglobin"
          unit="g/dL"
          required
          tooltip="Oxygen-carrying protein in red blood cells. Anemia (<11.3) is frequent in CKD due to erythropoietin deficiency."
          error={errors.hemo}
        >
          <SelectField
            id="hemo"
            value={formData.hemo}
            onChange={(val) => onChange('hemo', val)}
            options={HEMO_OPTIONS}
            hasError={!!errors.hemo}
          />
        </FormField>

        {/* Packed Cell Volume */}
        <FormField
          id="pcv"
          label="Packed Cell Volume (PCV)"
          unit="%"
          required
          tooltip="Hematocrit percentage of red blood cells in total blood volume."
          error={errors.pcv}
        >
          <SelectField
            id="pcv"
            value={formData.pcv}
            onChange={(val) => onChange('pcv', val)}
            options={PCV_OPTIONS}
            hasError={!!errors.pcv}
          />
        </FormField>

        {/* RBC Count */}
        <FormField
          id="rbcc"
          label="Red Blood Cell Count"
          unit="M/µL"
          required
          tooltip="Total red blood cell concentration."
          error={errors.rbcc}
        >
          <SelectField
            id="rbcc"
            value={formData.rbcc}
            onChange={(val) => onChange('rbcc', val)}
            options={RBCC_OPTIONS}
            hasError={!!errors.rbcc}
          />
        </FormField>

        {/* WBC Count */}
        <FormField
          id="wbcc"
          label="White Blood Cell Count"
          unit="cells/cumm"
          required
          tooltip="Total leukocyte count indicative of systemic inflammation or infection."
          error={errors.wbcc}
        >
          <SelectField
            id="wbcc"
            value={formData.wbcc}
            onChange={(val) => onChange('wbcc', val)}
            options={WBCC_OPTIONS}
            hasError={!!errors.wbcc}
          />
        </FormField>
      </div>
    </SectionCard>
  );
};
