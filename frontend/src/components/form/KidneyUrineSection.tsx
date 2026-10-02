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
  BINARY_NORMAL_ABNORMAL,
  BINARY_PRESENT_NOTPRESENT,
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
      title="Kidney & Urinalysis Parameters"
      subtitle="Urine concentration, protein leakage & microscopic urinary sediment findings"
      icon={Droplet}
      badge="Urinalysis (7 Features)"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Specific Gravity */}
        <FormField
          id="sg"
          label="Specific Gravity"
          required
          tooltip="Measures urine concentration. Normal range is 1.015 – 1.025. Low values indicate reduced renal concentrating ability."
          error={errors.sg}
        >
          <SelectField
            id="sg"
            value={formData.sg.toString()}
            onChange={(val) => onChange('sg', parseFloat(val))}
            options={SG_OPTIONS.map((o) => ({ value: o.value.toString(), label: o.label }))}
            hasError={!!errors.sg}
          />
        </FormField>

        {/* Albumin */}
        <FormField
          id="al"
          label="Albumin (Urine Protein)"
          unit="scale (0-5)"
          required
          tooltip="Presence of protein in urine (0 = Negative/Normal, 1+ to 5+ indicates worsening proteinuria)."
          error={errors.al}
        >
          <SelectField
            id="al"
            value={formData.al.toString()}
            onChange={(val) => onChange('al', parseInt(val, 10))}
            options={ALBUMIN_OPTIONS.map((o) => ({ value: o.value.toString(), label: o.label }))}
            hasError={!!errors.al}
          />
        </FormField>

        {/* Sugar */}
        <FormField
          id="su"
          label="Urinary Glucose (Sugar)"
          unit="scale (0-5)"
          required
          tooltip="Presence of sugar in urine (0 = Negative/Normal, 1+ to 5+ indicates glucosuria)."
          error={errors.su}
        >
          <SelectField
            id="su"
            value={formData.su.toString()}
            onChange={(val) => onChange('su', parseInt(val, 10))}
            options={SUGAR_OPTIONS.map((o) => ({ value: o.value.toString(), label: o.label }))}
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
            options={BINARY_NORMAL_ABNORMAL}
          />
        </FormField>

        {/* Pus Cell */}
        <FormField
          id="pc"
          label="Pus Cells (Pyuria)"
          required
          tooltip="Presence of white blood cells in urine, signaling urinary inflammation or infection."
          error={errors.pc}
        >
          <SegmentedToggle
            id="pc"
            value={formData.pc}
            onChange={(val) => onChange('pc', val)}
            options={BINARY_NORMAL_ABNORMAL}
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
            options={BINARY_PRESENT_NOTPRESENT}
          />
        </FormField>

        {/* Bacteria */}
        <FormField
          id="ba"
          label="Bacteria"
          required
          tooltip="Microscopic bacteria detection in clean-catch urine specimen."
          error={errors.ba}
          className="md:col-span-2 lg:col-span-1"
        >
          <SegmentedToggle
            id="ba"
            value={formData.ba}
            onChange={(val) => onChange('ba', val)}
            options={BINARY_PRESENT_NOTPRESENT}
          />
        </FormField>
      </div>
    </SectionCard>
  );
};
