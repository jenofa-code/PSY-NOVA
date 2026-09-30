import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { CaseRecord } from '../../types';

interface VictimHistoryProps {
  caseRecord: CaseRecord | null;
  onStartCheckIn: () => void;
}

export const VictimHistory: React.FC<VictimHistoryProps> = ({ caseRecord, onStartCheckIn }) => {
  const history = caseRecord?.history || [];

  const chartData = history.map((h) => ({
    name: h.weekLabel,
    score: h.distressScore,
    date: h.date,
  }));

  const currentScore = caseRecord?.currentDistressScore || 32;
  const previousScore = caseRecord?.previousDistressScore || 30;
  const scoreDiff = currentScore - previousScore;

  const getTrendBadge = (trajectory?: string) => {
    if (trajectory === 'improving') {
      return {
        label: 'Decreasing',
        icon: <TrendingDown className="w-4 h-4 text-emerald-600" />,
        className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    }
    if (trajectory === 'stable') {
      return {
        label: 'Stable',
        icon: <Minus className="w-4 h-4 text-teal-600" />,
        className: 'bg-teal-50 text-teal-800 border-teal-200',
      };
    }
    return {
      label: 'Increasing',
      icon: <TrendingUp className="w-4 h-4 text-rose-600" />,
      className: 'bg-rose-50 text-rose-800 border-rose-200',
    };
  };

  const trendInfo = getTrendBadge(caseRecord?.trajectory);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              My Check-in History
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Tracking changes in your distress indicators over time to ensure timely human support.
            </p>
          </div>
          <button
            onClick={onStartCheckIn}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <span>New Check-in</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Current Estimate</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-slate-900">{currentScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-2 text-xs text-slate-600">
            {currentScore >= 60 ? 'Higher indicator range' : currentScore >= 40 ? 'Moderate range' : 'Mild range'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Overall Trend</div>
          <div className="flex items-center gap-2 mt-1">
            {trendInfo.icon}
            <span className="text-2xl font-bold text-slate-900">{trendInfo.label}</span>
          </div>
          <div className="mt-2">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${trendInfo.className}`}>
              {caseRecord?.trajectory?.replace('_', ' ') || 'Stable'}
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Recent Change</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-3xl font-extrabold ${scoreDiff > 0 ? 'text-rose-600' : scoreDiff < 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
              {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff}
            </span>
            <span className="text-xs text-slate-400">points</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Compared to previous check-in ({previousScore})
          </div>
        </div>
      </div>

      {/* Distress Trajectory Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Distress Estimate Trajectory
            </h3>
            <p className="text-xs text-slate-500">
              Progression over recorded check-in sessions
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span>Distress Score</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                  color: '#0f172a',
                }}
                formatter={(value: any) => [`${value} / 100`, 'Distress Score']}
              />
              <ReferenceLine y={60} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'Support Threshold (60)', position: 'insideTopRight', fill: '#f43f5e', fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 7, fill: '#4f46e5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Trajectory markers: {history.map((h) => h.distressScore).join(' → ')}</span>
          </div>
          <span className="text-[11px] text-slate-400">Prototype estimate — not a clinical diagnosis.</span>
        </div>
      </div>

      {/* Previous Check-in Table / List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Previous Check-ins Log
        </h3>

        <div className="space-y-3">
          {history.length > 0 ? (
            history.map((h, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs shrink-0">
                    W{h.checkInIndex}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {h.weekLabel} • {h.date}
                    </div>
                    <p className="text-slate-500 mt-0.5">
                      {h.eventNote || 'Routine periodic self-report recorded.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="font-bold text-slate-900 text-base">
                      {h.distressScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${
                      h.riskLevel === 'high'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : h.riskLevel === 'moderate'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {h.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">
              No previous check-in records found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
