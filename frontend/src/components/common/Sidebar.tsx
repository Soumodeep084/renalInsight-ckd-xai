import React from 'react';
import { LayoutDashboard, Stethoscope, Info, ShieldAlert, X, Brain } from 'lucide-react';
import { ActiveTab } from '../../types/ckd';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onScrollToForm?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpenMobile,
  onCloseMobile,
  onScrollToForm,
}) => {
  const handleNavClick = (tab: ActiveTab, scrollToForm = false) => {
    onTabChange(tab);
    onCloseMobile();
    if (scrollToForm && onScrollToForm) {
      setTimeout(() => {
        onScrollToForm();
      }, 50);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800 select-none">
      {/* Top Header Logo */}
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white font-bold">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block leading-tight">
              RenalInsight
            </span>
            <span className="text-xs font-medium text-teal-400 block tracking-wide">
              Explainable CKD AI
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Main Navigation
        </div>

        <button
          type="button"
          onClick={() => handleNavClick('dashboard')}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'dashboard'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavClick('dashboard', true)}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group"
        >
          <Stethoscope className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          <span>Prediction Form</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavClick('about')}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'about'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>About Model</span>
        </button>
      </div>

      {/* Bottom Footer Callout */}
      <div className="p-4 m-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>AI-assisted risk analysis</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Not a diagnostic tool. Research decision-support system intended for academic clinical evaluation.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay & Sliding Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[80vw] z-50 shadow-2xl animate-fade-in">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
