import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  Activity,
  BookOpen,
  Info,
  ShieldAlert,
  X,
  Brain,
} from 'lucide-react';
import { usePrediction } from '../../context/PredictionContext';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { result } = usePrediction();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/predict',
      label: 'CKD Prediction',
      icon: Stethoscope,
      badge: null,
    },
    {
      to: '/results',
      label: 'Results & XAI',
      icon: Activity,
      badge: result ? (result.prediction === 'CKD' ? 'CKD' : 'Not CKD') : null,
      badgeColor: result?.prediction === 'CKD' ? 'bg-rose-500 text-white' : 'bg-teal-500 text-slate-950',
    },
    {
      to: '/guide',
      label: 'CKD & Feature Guide',
      icon: BookOpen,
      badge: '25 Features',
      badgeColor: 'bg-teal-700 text-white',
    },
    {
      to: '/about',
      label: 'About & Model',
      icon: Info,
      badge: null,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800 select-none">
      {/* Top Header Logo */}
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <NavLink
          to="/"
          onClick={onCloseMobile}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white font-bold group-hover:scale-105 transition-transform">
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
        </NavLink>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close navigation menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Clinical Portal Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Medical Research Callout */}
      <div className="p-4 m-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Research Support AI</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Not a diagnostic device. Decision-support framework intended for clinical research evaluation.
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
