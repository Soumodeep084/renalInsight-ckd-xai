import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, LayoutDashboard, Stethoscope } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-rose-600 px-2.5 py-1 bg-rose-50 rounded-full border border-rose-200">
            404 • Page Not Found
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Invalid Route
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            The requested page does not exist in the RenalInsight clinical portal. Please use the navigation links below.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/predict"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <Stethoscope className="w-4 h-4" />
            <span>CKD Prediction</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
