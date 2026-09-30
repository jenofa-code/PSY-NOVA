import React, { useState, useEffect } from 'react';
import {
  PlayCircle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  X,
  ArrowRight,
  ShieldAlert,
  Info,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { storageService } from '../../services/storageService';
import { CaseRecord } from '../../types';

interface DemoModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToCase: (caseId: string) => void;
}

export const DemoModeModal: React.FC<DemoModeModalProps> = ({
  isOpen,
  onClose,
  onJumpToCase,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(7); // Default to full trajectory so judges immediately see the flagged case, but can click step 1-7
  const [caseRecord, setCaseRecord] = useState<CaseRecord | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const loadCase = () => {
    const c = storageService.getCaseById('PSY-1024');
    if (c) setCaseRecord(c);
  };

  useEffect(() => {
    if (isOpen) {
      loadCase();
    }
  }, [isOpen]);

  const handleSetStep = (step: number) => {
    setCurrentStep(step);
    storageService.setDemoStep(step);
    loadCase();
  };

  const handleReset = () => {
    storageService.resetAllData();
    setCurrentStep(1);
    storageService.setDemoStep(1);
    loadCase();
  };

  // Auto play sequence
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 7) {
            setIsPlaying(false);
            return 7;
          }
          const next = prev + 1;
          storageService.setDemoStep(next);
          loadCase();
          return next;
        });
      }, 2500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  if (!isOpen) return null;

  const steps = [
    { num: 1, label: 'Week 1 Baseline', score: 32, subtext: 'FIR registered; baseline score 32/100 (Stable)' },
    { num: 2, label: 'Week 2 Check-in', score: 38, subtext: 'Routine check-in; mild sleep tension (+6 pts)' },
    { num: 3, label: 'Case Event', score: 38, subtext: 'Court summons delivered; village intimidation reported' },
    { num: 4, label: 'Week 3 Check-in', score: 47, subtext: 'Score increases to 47; trajectory marked worsening' },
    { num: 5, label: 'Missed Check-in', score: 47, subtext: 'Scheduled check-in missed; engagement avoidance signal' },
    { num: 6, label: 'Week 4 Check-in', score: 61, subtext: 'Score surges to 61; perceived safety collapsed to 2/5' },
    { num: 7, label: 'Week 5 Escalation', score: 73, subtext: 'Score hits 73; early warning trigger fires to portal' },
  ];

  const chartData = caseRecord?.history.map((h) => ({
    name: h.weekLabel,
    score: h.distressScore,
    date: h.date,
  })) || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-xl relative my-8 text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Trajectory Scenario Preview
                </h3>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md">
                  SIH26094
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Synthetic demonstration of changing distress trajectory: Case PSY-1024 (32 → 38 → 47 → 61 → 73)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-xs ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{isPlaying ? 'Pause Auto-Run' : 'Auto-Play Scenario'}</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 7-Step Interactive Progression Bar */}
        <div className="mb-6">
          <div className="text-xs font-bold text-slate-700 mb-2.5 flex items-center justify-between">
            <span>Click any step to inspect the real-time AI state:</span>
            <span className="text-indigo-700 font-semibold font-mono">Stage {currentStep} of 7</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {steps.map((s) => {
              const isActive = currentStep === s.num;
              const isPast = currentStep >= s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => handleSetStep(s.num)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isActive
                      ? 'bg-indigo-50/80 border-indigo-600 shadow-xs ring-1 ring-indigo-600 text-slate-900'
                      : isPast
                      ? 'bg-slate-50 hover:bg-slate-100/70 border-slate-200 text-slate-700'
                      : 'bg-slate-50/50 border-slate-200/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono text-slate-500">Step {s.num}</span>
                    <span className={`text-[10px] font-extrabold ${isActive ? 'text-indigo-700' : 'text-slate-600'}`}>
                      {s.score} pts
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-900 mt-1 truncate">
                    {s.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Simulation Dashboard View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recharts Mini Curve */}
          <div className="lg:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Simulated Trajectory Velocity</span>
              </span>
              <span className="text-[11px] text-slate-600">
                Current: <strong className="text-indigo-700 font-bold">{caseRecord?.currentDistressScore || 32} / 100</strong>
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="demoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[20, 90]} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#0f172a' }}
                  />
                  <ReferenceLine y={60} stroke="#e11d48" strokeDasharray="3 3" />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fill="url(#demoGrad)"
                    dot={{ fill: '#4f46e5', r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 text-[11px] text-slate-600 font-medium">
              {steps[currentStep - 1]?.subtext}
            </div>
          </div>

          {/* AI Decision Signals for Current Step */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Explainable Signals
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                  caseRecord?.riskLevel === 'high' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {caseRecord?.riskLevel || 'Low'} Risk
                </span>
              </div>

              <div className="space-y-2 mt-3">
                {caseRecord?.contributingSignals.slice(0, 3).map((sig, idx) => (
                  <div key={idx} className="text-xs p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-rose-600 font-bold">
                        {sig.direction === 'up' ? '↑' : sig.direction === 'down' ? '↓' : '⚠'}
                      </span>
                      <span>{sig.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{sig.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {currentStep >= 7 && (
              <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Early-warning review flag shown in prototype portal</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Jump Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Synthetic, non-diagnostic prototype view of longitudinal distress monitoring with human review.</span>
          </div>

          <button
            id="modal-view-full-case-btn"
            onClick={() => {
              onJumpToCase('PSY-1024');
              onClose();
            }}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs"
          >
            <span>Open Case #PSY-1024 in Professional Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
