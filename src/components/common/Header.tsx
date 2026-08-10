import React from 'react';
import { Menu, Activity, Bell, Info } from 'lucide-react';
import { ActiveTab } from '../../types/ckd';

interface HeaderProps {
  activeTab: ActiveTab;
  onMobileMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onMobileMenuToggle }) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left side: Mobile menu toggle + Titles */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {activeTab === 'dashboard' ? (
                <>
                  <Activity className="w-6 h-6 text-teal-600 hidden sm:inline-block" />
                  <span>CKD Risk Prediction</span>
                </>
              ) : (
                <>
                  <Info className="w-6 h-6 text-teal-600 hidden sm:inline-block" />
                  <span>About RenalInsight</span>
                </>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
              {activeTab === 'dashboard'
                ? 'Explainable machine learning-based chronic kidney disease risk analysis'
                : 'Architecture, model methodology, SHAP explainability & clinical dataset overview'}
            </p>
          </div>
        </div>

        {/* Right side: Status indicator & notification icon */}
        <div className="flex items-center gap-3">
          {/* Static Model Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-xs font-semibold shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Model Ready</span>
          </div>

          <div className="sm:hidden flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>

          {/* Info/Notification Icon */}
          <button
            type="button"
            className="p-2 text-slate-500 hover:text-teal-600 hover:bg-slate-100 rounded-full transition-colors relative"
            title="System notifications & research notices"
            aria-label="System notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
