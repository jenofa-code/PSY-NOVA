import React from 'react';
import {
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  X,
  PhoneCall,
} from 'lucide-react';
import { DistressAnalysisResult } from '../../services/aiEngine';
import { useLanguage } from '../../context/LanguageContext';

interface CheckInResultModalProps {
  result: DistressAnalysisResult;
  onClose: () => void;
  onViewHistory: () => void;
  onViewSupport: () => void;
  onViewHome: () => void;
}

export const CheckInResultModal: React.FC<CheckInResultModalProps> = ({
  result,
  onClose,
  onViewHistory,
  onViewSupport,
  onViewHome,
}) => {
  const getTrajectoryLabel = (traj: string) => {
    if (traj === 'improving') return { text: 'Decreasing', icon: <TrendingDown className="w-5 h-5 text-emerald-600" /> };
    if (traj === 'stable') return { text: 'Stable', icon: <Minus className="w-5 h-5 text-teal-600" /> };
    return { text: 'Increasing', icon: <TrendingUp className="w-5 h-5 text-rose-600" /> };
  };

  const getRiskBadge = (risk: string) => {
    if (risk === 'low') return 'text-emerald-800 bg-emerald-50 border-emerald-200';
    if (risk === 'moderate') return 'text-amber-800 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const previousScore = result.previousScore || Math.max(20, result.score - result.changeFromPrevious);
  const trajectoryInfo = getTrajectoryLabel(result.trajectory);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl relative my-8 text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Check-in Recorded ✓
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thank you for sharing how you feel today.
            </p>
          </div>
        </div>

        {/* Primary Result Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Your Check-in
          </div>
          <div className="text-4xl font-extrabold text-slate-900 my-2">
            {result.score} <span className="text-lg font-normal text-slate-400">/ 100</span>
          </div>

          <div className="flex items-center justify-center gap-2 mt-3">
            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-lg border ${getRiskBadge(result.riskLevel)}`}>
              {result.riskLevel}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-xs">
              {trajectoryInfo.icon}
              <span>{trajectoryInfo.text}</span>
            </span>
          </div>
        </div>

        {/* What changed section */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 mb-6">
          <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide mb-1.5">
            What changed?
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed mb-3">
            {result.changeFromPrevious > 0
              ? 'Your recent check-ins show an increase in distress indicators. Your assigned support counsellor will review this to provide extra support.'
              : result.changeFromPrevious < 0
              ? 'Your indicators show a positive reduction in tension since your previous check-in.'
              : 'Your check-in indicators remain steady and consistent with your baseline.'}
          </p>

          {/* Small Comparison */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-indigo-100/80 text-center text-xs">
            <div className="p-2 bg-white rounded-xl border border-indigo-100 shadow-xs">
              <span className="text-[11px] text-slate-500 block">Previous</span>
              <span className="text-sm font-bold text-slate-800">{previousScore}</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-indigo-100 shadow-xs">
              <span className="text-[11px] text-slate-500 block">Current</span>
              <span className="text-sm font-bold text-slate-800">{result.score}</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-indigo-100 shadow-xs">
              <span className="text-[11px] text-slate-500 block">Change</span>
              <span className={`text-sm font-bold ${result.changeFromPrevious > 0 ? 'text-rose-600' : result.changeFromPrevious < 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                {result.changeFromPrevious > 0 ? `+${result.changeFromPrevious}` : result.changeFromPrevious}
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-500 text-center mb-6 leading-relaxed">
          Prototype estimate — not a clinical diagnosis. Does not replace human medical or psychological care.
        </p>

        {/* Navigation Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={onViewHistory}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs text-center"
          >
            View My History
          </button>
          <button
            onClick={onViewSupport}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition text-center"
          >
            Support Services
          </button>
          <button
            onClick={onViewHome}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition text-center"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
