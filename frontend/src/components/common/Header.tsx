import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Activity,
  Info,
  Server,
  RefreshCw,
  LayoutDashboard,
  Stethoscope,
  FileCheck2,
  BookOpen,
} from 'lucide-react';
import { checkApiHealth } from '../../services/predictionService';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const location = useLocation();
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const verifyHealth = async () => {
    setIsChecking(true);
    const res = await checkApiHealth();
    setIsBackendOnline(res.healthy);
    setIsChecking(false);
  };

  useEffect(() => {
    verifyHealth();

    // 60000ms = 1 minute 
    const interval = setInterval(verifyHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  const getPageMeta = () => {
    switch (location.pathname) {
      case '/':
        return {
          title: 'Clinical AI Dashboard',
          subtitle: 'Executive overview, model specifications & workflow navigation',
          icon: LayoutDashboard,
        };
      case '/predict':
        return {
          title: 'CKD Risk Prediction Form',
          subtitle: 'Enter patient parameters across 24 validated features for real-time inference',
          icon: Stethoscope,
        };
      case '/results':
        return {
          title: 'XAI Prediction & Explainability Report',
          subtitle: 'Quantitative SHAP feature attribution and clinical risk breakdown',
          icon: FileCheck2,
        };
      case '/guide':
        return {
          title: 'Understanding Your Results & CKD Guide',
          subtitle: 'Beginner-friendly explanation of 24 clinical features and SHAP reasoning',
          icon: BookOpen,
        };
      case '/about':
        return {
          title: 'About RenalInsight',
          subtitle: 'Model specifications, research dataset & SHAP methodology',
          icon: Info,
        };
      default:
        return {
          title: 'RenalInsight Portal',
          subtitle: 'Explainable AI for Chronic Kidney Disease assessment',
          icon: Activity,
        };
    }
  };

  const { title, subtitle, icon: PageIcon } = getPageMeta();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 transition-all shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left side: Mobile menu toggle + Titles */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 truncate">
              <PageIcon className="w-5 h-5 text-teal-600 shrink-0 hidden sm:inline-block" />
              <span className="truncate">{title}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium truncate hidden sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right side: Live backend connection indicator */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={verifyHealth}
            title="Click to refresh server health status"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${isBackendOnline === true
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              : isBackendOnline === false
                ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
          >
            <span className="relative flex h-2 w-2">
              {isBackendOnline === true && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${isBackendOnline === true
                  ? 'bg-emerald-500'
                  : isBackendOnline === false
                    ? 'bg-rose-500'
                    : 'bg-amber-400'
                  }`}
              ></span>
            </span>
            <Server className="w-3.5 h-3.5 hidden sm:inline-block" />
            <span className="hidden sm:inline">
              {isChecking
                ? 'Checking...'
                : isBackendOnline === true
                  ? 'Server Connected'
                  : isBackendOnline === false
                    ? 'Server Offline'
                    : 'Checking API...'}
            </span>
            <span className="sm:hidden font-bold">
              {isBackendOnline === true ? 'API Online' : isBackendOnline === false ? 'API Offline' : 'API...'}
            </span>
            <RefreshCw className={`w-3 h-3 ml-0.5 ${isChecking ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
