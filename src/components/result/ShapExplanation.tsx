import React, { useState } from 'react';
import { ShapFactor } from '../../types/ckd';
import { formatShapValue } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Layers, HelpCircle } from 'lucide-react';

interface ShapExplanationProps {
  increasingFactors: ShapFactor[];
  decreasingFactors: ShapFactor[];
  allFactors: ShapFactor[];
}

type TabType = 'all' | 'increasing' | 'decreasing';

export const ShapExplanation: React.FC<ShapExplanationProps> = ({
  increasingFactors,
  decreasingFactors,
  allFactors,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const getDisplayedFactors = () => {
    switch (activeTab) {
      case 'increasing':
        return increasingFactors;
      case 'decreasing':
        return decreasingFactors;
      default:
        return allFactors;
    }
  };

  const displayedFactors = getDisplayedFactors();

  // Max absolute SHAP value for scaling bars proportionately
  const maxShap = Math.max(
    ...allFactors.map((f) => Math.abs(f.shapValue)),
    0.4
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg uppercase tracking-wider border border-teal-200/60">
              Explainable AI (XAI)
            </span>
            <span className="text-xs text-slate-400 font-mono">SHAP Framework</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-2">
            Why did the model make this prediction?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Feature contributions explain which inputs pushed the prediction toward or away from CKD.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-xs shrink-0">
          <div className="flex items-center gap-1.5 font-medium text-rose-700">
            <span className="w-3 h-3 bg-rose-500 rounded-sm"></span>
            <span>+ Increases CKD</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-teal-700">
            <span className="w-3 h-3 bg-teal-600 rounded-sm"></span>
            <span>- Decreases CKD</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 space-x-1 sm:space-x-4 text-xs sm:text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'all'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Factors ({allFactors.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('increasing')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'increasing'
              ? 'border-rose-600 text-rose-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-rose-600" />
          <span>Increasing CKD ({increasingFactors.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('decreasing')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'decreasing'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingDown className="w-4 h-4 text-teal-600" />
          <span>Decreasing CKD ({decreasingFactors.length})</span>
        </button>
      </div>

      {/* SHAP Factors Horizontal Bar Chart List */}
      <div className="space-y-4">
        {displayedFactors.map((factor, idx) => {
          const isIncreasing = factor.direction === 'increasing';
          const barWidthPercent = (Math.abs(factor.shapValue) / maxShap) * 100;

          return (
            <div
              key={`${factor.feature}-${idx}`}
              className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isIncreasing ? 'bg-rose-500' : 'bg-teal-600'
                    }`}
                  />
                  <span>{factor.displayFeature}</span>
                  <span className="text-slate-400 font-normal text-xs">({factor.value})</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 font-mono text-slate-600">
                    {factor.category}
                  </span>
                  <span
                    className={`font-mono font-bold text-xs ${
                      isIncreasing ? 'text-rose-700' : 'text-teal-700'
                    }`}
                  >
                    SHAP: {formatShapValue(factor.shapValue)}
                  </span>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isIncreasing
                      ? 'bg-gradient-to-r from-rose-400 to-rose-600'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-600'
                  }`}
                  style={{ width: `${Math.max(barWidthPercent, 3)}%` }}
                />
              </div>

              {factor.description && (
                <p className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">
                  {factor.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-slate-800">Understanding SHAP Values:</strong> SHAP (SHapley Additive exPlanations) values quantify the magnitude and direction of each clinical parameter's impact on the model's prediction score compared to baseline dataset averages.
        </p>
      </div>
    </div>
  );
};
