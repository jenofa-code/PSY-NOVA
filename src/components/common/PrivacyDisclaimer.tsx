import React, { useState } from 'react';
import { ShieldAlert, Info, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const PrivacyDisclaimer: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const { t } = useLanguage();

  if (isDismissed) return null;

  return (
    <div
      id="psynova-privacy-banner"
      className="bg-amber-500/10 border-b border-amber-500/20 text-amber-200 px-4 py-2 text-xs transition-all backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <div className="text-xs text-amber-200">
            <span className="font-bold text-amber-300 mr-1.5">Privacy Notice:</span>
            <span>
              PSYNOVA is a prototype designed to identify increasing psychological distress over time. It does not provide clinical diagnosis and does not replace qualified professionals.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <span className="text-[11px] text-amber-200 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shadow-xs font-medium">
            Synthetic / Demo Data
          </span>
          <button
            id="dismiss-privacy-banner"
            onClick={() => setIsDismissed(true)}
            className="text-amber-300 hover:text-amber-100 p-0.5 rounded hover:bg-amber-500/10 transition"
            aria-label="Dismiss disclaimer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    <div className="text-[10px]">Prototype only — synthetic data; not a diagnostic or emergency service.</div>
      </div>
    );
};
