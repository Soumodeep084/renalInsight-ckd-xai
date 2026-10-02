import React from 'react';
import { HeartPulse } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import { SegmentedToggle } from './SegmentedToggle';
import { BINARY_YES_NO, APPETITE_OPTIONS } from '../../data/formOptions';
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
  return (
    <SectionCard
      title="Medical History & Symptoms"
      subtitle="Comorbid cardiovascular conditions, metabolic history & uremic symptoms"
      icon={HeartPulse}
      badge="Clinical History (6 Features)"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Hypertension */}
        <FormField
          id="htn"
          label="Hypertension"
          required
          tooltip="Diagnosed high blood pressure. Chronic high pressure contributes to glomerular microvascular sclerosis."
          error={errors.htn}
        >
          <SegmentedToggle
            id="htn"
            value={formData.htn}
            onChange={(val) => onChange('htn', val)}
            options={BINARY_YES_NO}
          />
        </FormField>

        {/* Diabetes Mellitus */}
        <FormField
          id="dm"
          label="Diabetes Mellitus"
          required
          tooltip="Diagnosed history of diabetes. Diabetic microvascular pathology is a major contributor to renal dysfunction."
          error={errors.dm}
        >
          <SegmentedToggle
            id="dm"
            value={formData.dm}
            onChange={(val) => onChange('dm', val)}
            options={BINARY_YES_NO}
          />
        </FormField>

        {/* Coronary Artery Disease */}
        <FormField
          id="cad"
          label="Coronary Artery Disease"
          required
          tooltip="History of ischemic heart disease or coronary artery atherosclerosis."
          error={errors.cad}
        >
          <SegmentedToggle
            id="cad"
            value={formData.cad}
            onChange={(val) => onChange('cad', val)}
            options={BINARY_YES_NO}
          />
        </FormField>

        {/* Appetite */}
        <FormField
          id="appet"
          label="Appetite Status"
          required
          tooltip="Nutritional status assessment. Poor appetite (Anorexia) often correlates with uremic retention."
          error={errors.appet}
        >
          <SegmentedToggle
            id="appet"
            value={formData.appet}
            onChange={(val) => onChange('appet', val)}
            options={APPETITE_OPTIONS}
          />
        </FormField>

        {/* Pedal Edema */}
        <FormField
          id="pe"
          label="Pedal Edema (Leg Swelling)"
          required
          tooltip="Swelling in feet or ankles due to fluid retention and impaired renal sodium excretion."
          error={errors.pe}
        >
          <SegmentedToggle
            id="pe"
            value={formData.pe}
            onChange={(val) => onChange('pe', val)}
            options={BINARY_YES_NO}
          />
        </FormField>

        {/* Anemia */}
        <FormField
          id="ane"
          label="Clinical Anemia"
          required
          tooltip="Diagnosed anemia due to impaired erythropoietin production by damaged kidneys."
          error={errors.ane}
        >
          <SegmentedToggle
            id="ane"
            value={formData.ane}
            onChange={(val) => onChange('ane', val)}
            options={BINARY_YES_NO}
          />
        </FormField>
      </div>
    </SectionCard>
  );
};
