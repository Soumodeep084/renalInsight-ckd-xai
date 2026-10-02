import React from 'react';
import { User } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import { InputField } from './InputField';
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
      title="Patient Demographics & Vitals"
      subtitle="Basic patient profile and resting physiological measurements"
      icon={User}
      badge="Demographics (2 Features)"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Patient Age Numeric */}
        <FormField
          id="age"
          label="Patient Age"
          unit="years"
          required
          tooltip="Patient age in years (1 – 120). Age-related changes influence baseline kidney filtration capacity."
          error={errors.age}
        >
          <InputField
            id="age"
            type="number"
            value={formData.age}
            onChange={(val) => onChange('age', parseFloat(val) || 0)}
            placeholder="e.g. 48"
            min={1}
            max={120}
            step={1}
            hasError={!!errors.age}
          />
        </FormField>

        {/* Blood Pressure Numeric */}
        <FormField
          id="bp"
          label="Blood Pressure"
          unit="mm Hg"
          required
          tooltip="Resting arterial blood pressure in mm Hg (typically 70 – 80 mm Hg for healthy adults)."
          error={errors.bp}
        >
          <InputField
            id="bp"
            type="number"
            value={formData.bp}
            onChange={(val) => onChange('bp', parseFloat(val) || 0)}
            placeholder="e.g. 80"
            min={40}
            max={250}
            step={1}
            hasError={!!errors.bp}
          />
        </FormField>
      </div>
    </SectionCard>
  );
};
