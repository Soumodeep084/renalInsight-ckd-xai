import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Unable to generate prediction. Please review the entered information and try again.',
  onRetry,
}) => {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 sm:p-8 text-rose-900 shadow-xs animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-rose-100 text-rose-600 rounded-xl shrink-0">
          <AlertOctagon className="w-6 h-6" />
        </div>

        <div className="space-y-3 flex-1">
          <div>
            <h4 className="text-base font-bold text-rose-950">Assessment Error</h4>
            <p className="text-sm text-rose-800 mt-1 leading-relaxed">{message}</p>
          </div>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Analysis</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
