import React from 'react';
import { User } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import { SelectField } from './SelectField';
import { InputField } from './InputField';
import { AGE_OPTIONS, BP_LIMIT_OPTIONS } from '../../data/formOptions';
import { PatientInput } from '../../types/ckd';

interface PatientInfoSectionProps {
  formData: PatientInput;
  onChange: (field: keyof PatientInput, value: any) => void;
  errors?: Record<string, string>;
}

export const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({
  formData,
  onChange,
  errors = {},
}) => {
  return (
    <SectionCard
      title="Patient Information"
      subtitle="Basic demographics and resting physiological parameters"
      icon={User}
      badge="General Demographics"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Age Dropdown */}
        <FormField
          id="age"
          label="Patient Age"
          unit="years"
          required
          tooltip="Age group normalized from dataset ranges. Standardized for baseline risk stratification."
          error={errors.age}
        >
          <SelectField
            id="age"
            value={formData.age}
            onChange={(val) => onChange('age', val)}
            options={AGE_OPTIONS}
            hasError={!!errors.age}
          />
        </FormField>

        {/* Diastolic Blood Pressure Numeric */}
        <FormField
          id="bp_diastolic"
          label="Diastolic Blood Pressure"
          unit="mmHg"
          required
          tooltip="Resting arterial blood pressure measured in resting phase. Range 40 - 180 mmHg."
          error={errors.bp_diastolic}
        >
          <InputField
            id="bp_diastolic"
            type="number"
            value={formData.bp_diastolic}
            onChange={(val) => onChange('bp_diastolic', parseFloat(val) || 0)}
            placeholder="e.g. 76"
            min={40}
            max={180}
            hasError={!!errors.bp_diastolic}
          />
        </FormField>

        {/* BP Limit Dropdown */}
        <FormField
          id="bp_limit"
          label="BP Limit Category"
          unit="mmHg"
          required
          tooltip="Categorical threshold categorization for resting arterial pressure burden."
          error={errors.bp_limit}
        >
          <SelectField
            id="bp_limit"
            value={formData.bp_limit}
            onChange={(val) => onChange('bp_limit', val)}
            options={BP_LIMIT_OPTIONS}
            hasError={!!errors.bp_limit}
          />
        </FormField>
      </div>
    </SectionCard>
  );
};
