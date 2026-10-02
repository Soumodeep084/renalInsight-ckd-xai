import React, { useState } from 'react';
import { ShapFactor } from '../../types/ckd';
import { formatShapValue } from '../../utils/formatters';
import { getDualExplanation } from '../../data/featureGuideData';
import {
  TrendingUp,
  TrendingDown,
  Layers,
  Filter,
  ShieldCheck,
  Activity,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface ShapExplanationProps {
  increasingFactors: ShapFactor[];
  decreasingFactors: ShapFactor[];
  allFactors: ShapFactor[];
  onOpenGuide?: () => void;
}

type DirectionTab = 'all' | 'increasing' | 'decreasing' | 'split';
type CategoryFilter = 'all' | 'Kidney' | 'Blood' | 'Symptom' | 'Demographic';

export const ShapExplanation: React.FC<ShapExplanationProps> = ({
  increasingFactors,
  decreasingFactors,
  allFactors,
  onOpenGuide,
}) => {
  const [activeTab, setActiveTab] = useState<DirectionTab>('split');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [showAllIncreasing, setShowAllIncreasing] = useState(false);
  const [showAllDecreasing, setShowAllDecreasing] = useState(false);
  const [expandedMedicalIds, setExpandedMedicalIds] = useState<Record<string, boolean>>({});

  // Maximum SHAP value for proportional bar scaling
  const maxShap = Math.max(
    ...allFactors.map((f) => Math.abs(f.shapValue)),
    0.3
  );

  const filterByCategory = (factors: ShapFactor[]) => {
    if (selectedCategory === 'all') return factors;
    return factors.filter((f) => f.category === selectedCategory);
  };

  const filteredIncreasing = filterByCategory(increasingFactors);
  const filteredDecreasing = filterByCategory(decreasingFactors);
  const filteredAll = filterByCategory(allFactors);

  const toggleMedicalDetail = (cardKey: string) => {
    setExpandedMedicalIds((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));
  };

  const renderFactorCard = (factor: ShapFactor, index: number) => {
    const isIncreasing = factor.direction === 'increasing';
    const barWidthPercent = Math.min((Math.abs(factor.shapValue) / maxShap) * 100, 100);
    const cardKey = `${factor.feature}-${index}-${factor.direction}`;
    const isMedicalExpanded = !!expandedMedicalIds[cardKey];

    // Dual explanations
    const dual = getDualExplanation(factor.feature, factor.direction, factor.value, factor.shapValue);
    const generalText = factor.plainExplanation || factor.generalExplanation || dual.generalExplanation;
    const medicalText = factor.medicalExplanation || factor.description || dual.medicalExplanation;
    const strength = factor.influenceStrength || dual.influenceStrength;

    const strengthStyles = {
      Strong: isIncreasing
        ? 'bg-rose-100 text-rose-800 border-rose-300'
        : 'bg-teal-100 text-teal-900 border-teal-300',
      Moderate: 'bg-slate-100 text-slate-700 border-slate-200',
      Mild: 'bg-slate-50 text-slate-500 border-slate-200',
    };

    const categoryBadgeColors: Record<string, string> = {
      Kidney: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      Blood: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      Symptom: 'bg-amber-50 text-amber-800 border-amber-200',
      Demographic: 'bg-sky-50 text-sky-800 border-sky-200',
    };

    return (
      <div
        key={cardKey}
        className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 bg-white ${isIncreasing
            ? 'border-rose-100 hover:border-rose-300 hover:shadow-xs'
            : 'border-teal-100 hover:border-teal-300 hover:shadow-xs'
          }`}
      >
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 text-xs sm:text-sm">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 font-bold text-slate-900">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${isIncreasing ? 'bg-rose-500' : 'bg-teal-600'
                  }`}
              />
              <span className="truncate">{factor.displayFeature}</span>

              {/* Direction Indicator Badge */}
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${isIncreasing
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-teal-50 text-teal-700 border-teal-200'
                  }`}
              >
                {isIncreasing ? (
                  <>
                    <TrendingUp className="w-3 h-3" />
                    <span>Pushes toward CKD</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3" />
                    <span>Pushes toward Not CKD</span>
                  </>
                )}
              </span>
            </div>

            {factor.value !== undefined && factor.value !== '' && (
              <div className="text-xs text-slate-500 font-medium pl-4.5">
                Observed Patient Value:{' '}
                <span className="text-slate-800 font-semibold">{String(factor.value)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${strengthStyles[strength]
                  }`}
              >
                {strength} Influence
              </span>
              <span
                className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ${isIncreasing
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}
              >
                {formatShapValue(factor.shapValue)}
              </span>
            </div>

            <span
              className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${categoryBadgeColors[factor.category] || 'bg-slate-100 text-slate-700'
                }`}
            >
              {factor.category}
            </span>
          </div>
        </div>

        {/* Proportional Magnitude Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${isIncreasing
                ? 'bg-linear-to-r from-rose-400 to-rose-600'
                : 'bg-linear-to-r from-teal-400 to-teal-600'
              }`}
            style={{ width: `${Math.max(barWidthPercent, 4)}%` }}
          />
        </div>

        {/* 1. General Explanation (Beginner Friendly, visible by default) */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
            <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>General Explanation</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-normal">
            {generalText}
          </p>
        </div>

        {/* 2. Medical Explanation Toggle (Expandable for technical detail) */}
        <div className="pt-0.5">
          <button
            type="button"
            onClick={() => toggleMedicalDetail(cardKey)}
            className="text-[11px] font-semibold text-slate-500 hover:text-teal-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{isMedicalExpanded ? 'Hide clinical medical details' : 'Show clinical medical details'}</span>
            {isMedicalExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isMedicalExpanded && (
            <div className="mt-2 p-3 bg-teal-50/40 rounded-xl border border-teal-100 text-xs text-slate-600 leading-relaxed animate-fade-in font-mono text-[11px]">
              <strong className="text-teal-900 block font-semibold mb-0.5 font-sans text-xs">
                Clinical Pathology Context:
              </strong>
              {medicalText}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
      {/* Title & Explainer Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg uppercase tracking-wider border border-teal-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Explainable AI (XAI) Engine</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Patient Biomarker Contribution Analysis
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Understand how each specific biomarker influenced the model's decision score towards or away from Chronic Kidney Disease.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 text-xs w-full sm:w-auto">
          <div className="flex items-center gap-1.5 font-bold text-rose-700">
            <span className="w-3 h-3 bg-rose-500 rounded-sm" />
            <span>+ Increases CKD Risk</span>
          </div>
          <div className="h-4 w-px bg-slate-200 hidden xs:block" />
          <div className="flex items-center gap-1.5 font-bold text-teal-700">
            <span className="w-3 h-3 bg-teal-600 rounded-sm" />
            <span>- Decreases CKD Risk</span>
          </div>
        </div>
      </div>

      {/* Beginner Quick Guide Callout */}
      <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-teal-950">
        <div className="flex items-start gap-2.5 min-w-0">
          <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">How to read these factor cards: </span>
            <span className="text-slate-700">
              Each card shows the test name, your value, whether it pushed the score toward or away from CKD, and an easy general explanation. Click "Show clinical medical details" on any card for technical background.
            </span>
          </div>
        </div>

        {onOpenGuide && (
          <button
            type="button"
            onClick={onOpenGuide}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer w-full sm:w-auto"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View Full 24-Feature Guide</span>
          </button>
        )}
      </div>

      {/* Control Bar: View Tabs & Domain Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100/90 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'split'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Side-by-Side View
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('increasing')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'increasing'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
              }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Risk Enhancers ({increasingFactors.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('decreasing')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'decreasing'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-teal-700'
              }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Protective Factors ({decreasingFactors.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Factors ({allFactors.length})</span>
          </button>
        </div>

        {/* Category Domain Filter */}
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Domain:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as CategoryFilter)}
            aria-label="Filter SHAP factors by clinical domain category"
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-32.5"
          >
            <option value="all">All Domains</option>
            <option value="Kidney">Kidney & Urinalysis</option>
            <option value="Blood">Blood & Biochemistry</option>
            <option value="Symptom">Symptoms & History</option>
            <option value="Demographic">Demographics</option>
          </select>
        </div>
      </div>

      {/* Main Factors Display Body */}
      {activeTab === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Risk-Increasing Factors Column */}
          <div className="space-y-4 bg-rose-50/40 p-4 sm:p-5 rounded-2xl border border-rose-100">
            <div className="flex items-center justify-between border-b border-rose-200/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-rose-950">
                    Factors Increasing CKD Prediction
                  </h4>
                  <p className="text-[11px] text-rose-700 font-medium">
                    Features pushing classification towards CKD (+ SHAP)
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                {filteredIncreasing.length}
              </span>
            </div>

            {filteredIncreasing.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No significant risk-increasing factors in this category.
              </div>
            ) : (
              <div className="space-y-3">
                {(showAllIncreasing ? filteredIncreasing : filteredIncreasing.slice(0, 5)).map(
                  (factor, idx) => renderFactorCard(factor, idx)
                )}

                {filteredIncreasing.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setShowAllIncreasing(!showAllIncreasing)}
                    className="w-full py-2.5 text-xs font-bold text-rose-800 bg-rose-100/60 hover:bg-rose-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {showAllIncreasing ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        <span>Show Top 5 Risk Factors Only</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span>Show All {filteredIncreasing.length} Risk Factors</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Risk-Decreasing Factors Column */}
          <div className="space-y-4 bg-teal-50/40 p-4 sm:p-5 rounded-2xl border border-teal-100">
            <div className="flex items-center justify-between border-b border-teal-200/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-teal-950">
                    Factors Decreasing CKD Prediction
                  </h4>
                  <p className="text-[11px] text-teal-700 font-medium">
                    Protective parameters pushing classification towards Not CKD (- SHAP)
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                {filteredDecreasing.length}
              </span>
            </div>

            {filteredDecreasing.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No significant protective factors in this category.
              </div>
            ) : (
              <div className="space-y-3">
                {(showAllDecreasing ? filteredDecreasing : filteredDecreasing.slice(0, 5)).map(
                  (factor, idx) => renderFactorCard(factor, idx)
                )}

                {filteredDecreasing.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setShowAllDecreasing(!showAllDecreasing)}
                    className="w-full py-2.5 text-xs font-bold text-teal-800 bg-teal-100/60 hover:bg-teal-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {showAllDecreasing ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        <span>Show Top 5 Protective Factors Only</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span>Show All {filteredDecreasing.length} Protective Factors</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {(activeTab === 'increasing'
            ? filteredIncreasing
            : activeTab === 'decreasing'
              ? filteredDecreasing
              : filteredAll
          ).map((factor, idx) => renderFactorCard(factor, idx))}
        </div>
      )}

      {/* Scientific & Clinical Methodology Disclaimer Callout */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-slate-800">
            Understanding SHAP Feature Attributions
          </h5>
          <p className="leading-relaxed">
            SHAP (SHapley Additive exPlanations) calculates how much each of your 24 clinical markers influenced the AI's calculation.
            <strong className="text-slate-800 font-semibold"> Remember:</strong> SHAP explains what the statistical model noticed in your data, not a direct medical diagnosis. Clinical health decisions must always be discussed with a qualified medical professional.
          </p>
        </div>
      </div>
    </div>
  );
};

