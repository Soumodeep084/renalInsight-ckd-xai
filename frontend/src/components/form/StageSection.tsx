import React from 'react';
import { Layers, Info } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import { SelectField } from './SelectField';
import { STAGE_OPTIONS } from '../../data/formOptions';
import { PatientInput } from '../../types/ckd';

interface StageSectionProps {
  formData: PatientInput;
  onChange: (field: keyof PatientInput, value: any) => void;
  errors?: Record<string, string>;
}

export const StageSection: React.FC<StageSectionProps> = ({
  formData,
  onChange,
  errors = {},
}) => {
  return (
    <SectionCard
      title="CKD Staging Parameter"
      subtitle="Current clinical classification stage per dataset features"
      icon={Layers}
      badge="Dataset Parameter"
    >
      <div className="space-y-4">
        <FormField
          id="stage"
          label="CKD Stage Classification"
          required
          tooltip="CKD stage is included as a model feature in the current research dataset."
          error={errors.stage}
        >
          <SelectField
            id="stage"
            value={formData.stage}
            onChange={(val) => onChange('stage', val)}
            options={STAGE_OPTIONS}
            hasError={!!errors.stage}
          />
        </FormField>

        {/* Informational Callout as mandated by prompt */}
        <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-sky-900">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold">Research Feature Note:</span> CKD stage is included as a model feature in the current research dataset. Stage 1 represents mild impairment with normal GFR, progressing to Stage 5 kidney failure.
          </p>
        </div>
      </div>
    </SectionCard>
  );
};
