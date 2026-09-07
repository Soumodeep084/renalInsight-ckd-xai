import React from 'react';
import { Droplet } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import { SelectField } from './SelectField';
import { SegmentedToggle } from './SegmentedToggle';
import {
  SG_OPTIONS,
  ALBUMIN_OPTIONS,
  SUGAR_OPTIONS,
  RBC_OPTIONS,
  PC_OPTIONS,
  PCC_OPTIONS,
  BA_OPTIONS,
} from '../../data/formOptions';
import { PatientInput } from '../../types/ckd';

interface KidneyUrineSectionProps {
  formData: PatientInput;
  onChange: (field: keyof PatientInput, value: any) => void;
  errors?: Record<string, string>;
}

export const KidneyUrineSection: React.FC<KidneyUrineSectionProps> = ({
  formData,
  onChange,
  errors = {},
}) => {
  return (
    <SectionCard
      title="Kidney & Urine Parameters"
      subtitle="Urinalysis indicators, protein excretion & microscopic urinary findings"
      icon={Droplet}
      badge="Urinalysis"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Specific Gravity */}
        <FormField
          id="sg"
          label="Specific Gravity"
          required
          tooltip="Measures urine concentration capability. Low values (< 1.015) may indicate impaired renal concentrating ability."
          error={errors.sg}
        >
          <SelectField
            id="sg"
            value={formData.sg}
            onChange={(val) => onChange('sg', val)}
            options={SG_OPTIONS}
            hasError={!!errors.sg}
          />
        </FormField>

        {/* Albumin */}
        <FormField
          id="al"
          label="Albuminuria (Protein)"
          required
          tooltip="Presence of albumin in urine. Key marker for glomerular membrane breakdown."
          error={errors.al}
        >
          <SelectField
            id="al"
            value={formData.al}
            onChange={(val) => onChange('al', val)}
            options={ALBUMIN_OPTIONS}
            hasError={!!errors.al}
          />
        </FormField>

        {/* Sugar */}
        <FormField
          id="su"
          label="Urinary Glucose (Sugar)"
          required
          tooltip="Excretion of glucose in urine, associated with hyperglycemia or tubular reabsorption defects."
          error={errors.su}
        >
          <SelectField
            id="su"
            value={formData.su}
            onChange={(val) => onChange('su', val)}
            options={SUGAR_OPTIONS}
            hasError={!!errors.su}
          />
        </FormField>

        {/* Red Blood Cells */}
        <FormField
          id="rbc"
          label="Red Blood Cells (RBC)"
          required
          tooltip="Presence of erythrocytes in urinary sediment (Hematuria)."
          error={errors.rbc}
        >
          <SegmentedToggle
            id="rbc"
            value={formData.rbc}
            onChange={(val) => onChange('rbc', val)}
            options={RBC_OPTIONS}
          />
        </FormField>

        {/* Pus Cell */}
        <FormField
          id="pc"
          label="Pus Cell (WBC in Urine)"
          required
          tooltip="Presence of white blood cells in urine (Pyuria), signaling inflammation or pyelonephritis."
          error={errors.pc}
        >
          <SegmentedToggle
            id="pc"
            value={formData.pc}
            onChange={(val) => onChange('pc', val)}
            options={PC_OPTIONS}
          />
        </FormField>

        {/* Pus Cell Clumps */}
        <FormField
          id="pcc"
          label="Pus Cell Clumps"
          required
          tooltip="Aggregated inflammatory pus cells in microscopic examination."
          error={errors.pcc}
        >
          <SegmentedToggle
            id="pcc"
            value={formData.pcc}
            onChange={(val) => onChange('pcc', val)}
            options={PCC_OPTIONS}
          />
        </FormField>

        {/* Bacteria */}
        <FormField
          id="ba"
          label="Bacteria"
          required
          tooltip="Microscopic bacteria detection in unspun clean catch urine."
          error={errors.ba}
          className="md:col-span-2 lg:col-span-1"
        >
          <SegmentedToggle
            id="ba"
            value={formData.ba}
            onChange={(val) => onChange('ba', val)}
            options={BA_OPTIONS}
          />
        </FormField>
      </div>
    </SectionCard>
  );
};
