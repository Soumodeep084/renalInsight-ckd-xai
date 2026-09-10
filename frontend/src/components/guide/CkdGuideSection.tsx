import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Sparkles,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Droplet,
  TestTube,
  HeartPulse,
  User,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { FEATURE_GUIDE_DATA, FeatureGuideItem } from '../../data/featureGuideData';

interface CkdGuideSectionProps {
  initialOpenFeatureId?: string;
  className?: string;
  defaultExpanded?: boolean;
}

export const CkdGuideSection: React.FC<CkdGuideSectionProps> = ({
  initialOpenFeatureId,
  className = '',
  defaultExpanded = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>(initialOpenFeatureId || null);
  const [isShapGuideOpen, setIsShapGuideOpen] = useState(true);

  const categories = [
    { id: 'all', label: 'All 25 Features', count: 25 },
    { id: 'Demographic', label: 'Patient & BP', count: 3, icon: User },
    { id: 'Kidney', label: 'Kidney & Urine', count: 7, icon: Droplet },
    { id: 'Blood', label: 'Blood Lab Panel', count: 9, icon: TestTube },
    { id: 'Symptom', label: 'Conditions & Symptoms', count: 6, icon: HeartPulse },
  ];

  const filteredFeatures = FEATURE_GUIDE_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.categoryKey === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.simpleExplanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.medicalExplanation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFeature = (id: string) => {
    setExpandedFeatureId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold border border-teal-400/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Beginner-Friendly Clinical Reference</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Understanding Your CKD Results & Features
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            No medical background required. Explore how the 25 clinical markers work, why they matter for kidney health, and how to easily interpret your AI prediction factors.
          </p>
        </div>
      </div>

      {/* Part 1: How to Read SHAP Explanations Guide Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>How to Read SHAP Explanations</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-teal-100 text-teal-800 rounded-full">
                  Simple Guide
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Understand how individual biomarkers shaped this specific prediction
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsShapGuideOpen(!isShapGuideOpen)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Toggle SHAP guide"
          >
            {isShapGuideOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {isShapGuideOpen && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When our AI evaluates a patient's information, <strong>SHAP</strong> calculates the exact influence of each individual test result on the final score. Here is the easy way to read it:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Positive SHAP */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs sm:text-sm">
                  <div className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <span>Pushes Toward CKD (+)</span>
                </div>
                <p className="text-xs text-rose-900/90 leading-relaxed">
                  These factors <strong>increased</strong> the estimated risk score for Chronic Kidney Disease based on patterns seen in medical data.
                </p>
              </div>

              {/* Card 2: Negative SHAP */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-xs sm:text-sm">
                  <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                    <TrendingDown className="w-3.5 h-3.5" />
                  </div>
                  <span>Pushes Toward Not CKD (-)</span>
                </div>
                <p className="text-xs text-teal-900/90 leading-relaxed">
                  These are <strong>protective factors</strong>. Normal or healthy values that helped lower the prediction score.
                </p>
              </div>

              {/* Card 3: Influence Strength */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs sm:text-sm">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    📊
                  </div>
                  <span>Bar Length = Strength</span>
                </div>
                <p className="text-xs text-indigo-900/90 leading-relaxed">
                  A longer bar or higher number means that specific factor had a <strong>stronger impact</strong> on this patient's prediction.
                </p>
              </div>

              {/* Card 4: Statistical vs Diagnosis */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs sm:text-sm">
                  <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>Explains Decision, Not Cause</span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  SHAP explains <strong>why the model made its calculation</strong>. It is not an absolute medical diagnosis or a direct guarantee of cause.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Part 2: The 25 Clinical Features Dictionary */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              The 25 Clinical Features Explained
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Click any feature below to explore what it measures in simple language and why it matters
            </p>
          </div>

          <div className="text-xs font-bold text-teal-800 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200 self-start sm:self-auto">
            {filteredFeatures.length} of 25 Features Shown
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl text-xs font-bold">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat.id ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search features (e.g. Creatinine, Sugar)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Features List / Accordion */}
        <div className="space-y-3 pt-2">
          {filteredFeatures.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500 space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-700">No matching clinical features found</p>
              <p>Try searching for a different term or selecting "All 25 Features".</p>
            </div>
          ) : (
            filteredFeatures.map((feature, idx) => {
              const isExpanded = expandedFeatureId === feature.id;
              return (
                <div
                  key={feature.id}
                  className={`rounded-2xl border transition-all ${
                    isExpanded
                      ? 'border-teal-300 bg-teal-50/20 shadow-xs'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  {/* Clickable Card Header */}
                  <button
                    type="button"
                    onClick={() => toggleFeature(feature.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm sm:text-base">
                          {feature.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          {feature.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1 sm:line-clamp-none font-normal">
                        {feature.simpleExplanation}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:block text-right text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Normal Target
                        </span>
                        <span className="font-semibold text-slate-700">{feature.typicalNormal}</span>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details Body */}
                  {isExpanded && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 border-t border-slate-100 space-y-4 animate-fade-in text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Box 1: Plain English Meaning */}
                        <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-teal-800">
                            <Info className="w-4 h-4 text-teal-600" />
                            <span>In Plain English</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">
                            {feature.simpleExplanation}
                          </p>
                        </div>

                        {/* Box 2: Why It Matters */}
                        <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <CheckCircle2 className="w-4 h-4 text-slate-600" />
                            <span>Why It Matters for Kidney Health</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed font-mono text-[11px]">
                            {feature.medicalExplanation}
                          </p>
                        </div>
                      </div>

                      {/* Box 3: Risk Impact Summary */}
                      <div className="p-3.5 bg-slate-100/70 rounded-xl flex items-start gap-2.5 text-slate-700">
                        <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 font-semibold">Prediction Impact: </strong>
                          <span>{feature.riskContext}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
