import React from 'react';
import { CkdGuideSection } from '../components/guide/CkdGuideSection';
import { Disclaimer } from '../components/common/Disclaimer';

export const GuidePage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <CkdGuideSection />
      <Disclaimer />
    </div>
  );
};
