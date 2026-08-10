import React from 'react';
import { HeartPulse } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import { SegmentedToggle } from './SegmentedToggle';
import { PatientInput } from '../../types/ckd';

interface SymptomsSectionProps {
  formData: PatientInput;
  onChange: (field: keyof PatientInput, value: any) => void;
  errors?: Record<string, string>;
}

export const SymptomsSection: React.FC<SymptomsSectionProps> = ({
  formData,
  onChange,
  errors = {},
}) => {
  const binaryOptions = [
    { value: 'No', label: 'No' },
    { value: 'Yes', label: 'Yes' },
  ];

  const appetiteOptions = [
    { value: 'Good', label: 'Good' },
    { value: 'Poor', label: 'Poor' },
  ];

  return (
    <SectionCard
      title="Medical Conditions & Symptoms"
      subtitle="Comorbid conditions, systemic cardiovascular history & uremic symptoms"
      icon={HeartPulse}
      badge="Clinical Manifestations"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Hypertension */}
        <FormField
          id="htn"
          label="Hypertension"
          required
          tooltip="Diagnosed systemic arterial hypertension. Key contributor to renal vascular damage."
          error={errors.htn}
        >
          <SegmentedToggle
            id="htn"
            value={formData.htn}
            onChange={(val) => onChange('htn', val)}
            options={binaryOptions}
          />
        </FormField>

        {/* Diabetes Mellitus */}
        <FormField
          id="dm"
          label="Diabetes Mellitus"
          required
          tooltip="History of type 1 or type 2 diabetes. Primary cause of end-stage renal disease worldwide."
          error={errors.dm}
        >
          <SegmentedToggle
            id="dm"
            value={formData.dm}
            onChange={(val) => onChange('dm', val)}
            options={binaryOptions}
          />
        </FormField>

        {/* Coronary Artery Disease */}
        <FormField
          id="cad"
          label="Coronary Artery Disease"
          required
          tooltip="Presence of ischemic heart disease or coronary artery atherosclerosis."
          error={errors.cad}
        >
          <SegmentedToggle
            id="cad"
            value={formData.cad}
            onChange={(val) => onChange('cad', val)}
            options={binaryOptions}
          />
        </FormField>

        {/* Appetite */}
        <FormField
          id="appet"
          label="Appetite Status"
          required
          tooltip="Nutritional status assessment. Poor appetite (Anorexia) often indicates uremic toxin retention."
          error={errors.appet}
        >
          <SegmentedToggle
            id="appet"
            value={formData.appet}
            onChange={(val) => onChange('appet', val)}
            options={appetiteOptions}
          />
        </FormField>

        {/* Pedal Edema */}
        <FormField
          id="pe"
          label="Pedal Edema"
          required
          tooltip="Swelling in feet/lower limbs due to renal sodium excretion reduction and fluid retention."
          error={errors.pe}
        >
          <SegmentedToggle
            id="pe"
            value={formData.pe}
            onChange={(val) => onChange('pe', val)}
            options={binaryOptions}
          />
        </FormField>

        {/* Anemia */}
        <FormField
          id="ane"
          label="Clinical Anemia"
          required
          tooltip="Diagnosed anemia secondary to impaired renal erythropoietin secretion."
          error={errors.ane}
        >
          <SegmentedToggle
            id="ane"
            value={formData.ane}
            onChange={(val) => onChange('ane', val)}
            options={binaryOptions}
          />
        </FormField>
      </div>
    </SectionCard>
  );
};
