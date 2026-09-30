import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Shield,
  ArrowUpDown,
} from 'lucide-react';
import { CaseRecord, RiskLevel, TrajectoryStatus } from '../../types';
import { storageService } from '../../services/storageService';

interface CasesListProps {
  onSelectCase: (caseId: string) => void;
}

export const CasesList: React.FC<CasesListProps> = ({ onSelectCase }) => {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [trajectoryFilter, setTrajectoryFilter] = useState<string>('all');
  const [followUpFilter, setFollowUpFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distress_desc' | 'distress_asc' | 'date'>('distress_desc');

  useEffect(() => {
    const load = () => {
      setCases(storageService.getCases());
    };
    load();
    const unsub = storageService.subscribe(load);
    return () => unsub();
  }, []);

  const filteredCases = cases
    .filter((c) => {
      const matchesSearch =
        c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.assignedCounsellor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.recentStressor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRisk = riskFilter === 'all' || c.riskLevel === riskFilter;
      const matchesTrajectory = trajectoryFilter === 'all' || c.trajectory === trajectoryFilter;
      const matchesFollowUp =
        followUpFilter === 'all'
          ? true
          : followUpFilter === 'due'
          ? Boolean(c.followUpDue)
          : !c.followUpDue;

      return matchesSearch && matchesRisk && matchesTrajectory && matchesFollowUp;
    })
    .sort((a, b) => {
      if (sortBy === 'distress_desc') return b.currentDistressScore - a.currentDistressScore;
      if (sortBy === 'distress_asc') return a.currentDistressScore - b.currentDistressScore;
      return new Date(b.lastCheckInAt || '').getTime() - new Date(a.lastCheckInAt || '').getTime();
    });

  const getTrajectoryBadge = (trajectory: string) => {
    if (trajectory === 'improving') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Improving</span>
        </span>
      );
    }
    if (trajectory === 'stable') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
          <Minus className="w-3.5 h-3.5" />
          <span>Stable</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
        <TrendingUp className="w-3.5 h-3.5" />
        <span>Worsening</span>
      </span>
    );
  };

  const getRiskBadge = (risk: string) => {
    if (risk === 'low') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (risk === 'moderate') return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Case ID (e.g. PSY-1024), district, or stressor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Risk: All</option>
              <option value="low">Low Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="high">High Risk</option>
            </select>

            <select
              value={trajectoryFilter}
              onChange={(e) => setTrajectoryFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Trajectory: All</option>
              <option value="worsening">Worsening</option>
              <option value="stable">Stable</option>
              <option value="improving">Improving</option>
            </select>

            <select
              value={followUpFilter}
              onChange={(e) => setFollowUpFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Follow-ups: All</option>
              <option value="due">Follow-up Due</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="distress_desc">Distress: High to Low</option>
              <option value="distress_asc">Distress: Low to High</option>
              <option value="date">Most Recent Check-in</option>
            </select>

            {(searchQuery || riskFilter !== 'all' || trajectoryFilter !== 'all' || followUpFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setRiskFilter('all');
                  setTrajectoryFilter('all');
                  setFollowUpFilter('all');
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 px-2 py-1 font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Case</th>
                <th className="px-5 py-3.5">Distress Score</th>
                <th className="px-5 py-3.5">Risk Level</th>
                <th className="px-5 py-3.5">Trend / Trajectory</th>
                <th className="px-5 py-3.5">Last Check-in</th>
                <th className="px-5 py-3.5">Follow-up</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((c) => (
                <tr
                  key={c.caseId}
                  onClick={() => onSelectCase(c.caseId)}
                  className="hover:bg-slate-50/80 cursor-pointer transition"
                >
                  {/* Case ID */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs">
                        ID
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 font-mono text-sm">{c.caseId}</div>
                        <div className="text-[11px] text-slate-500">{c.district}</div>
                      </div>
                    </div>
                  </td>

                  {/* Distress Score */}
                  <td className="px-5 py-4">
                    <div className="flex items-baseline gap-1">
                      <span className="font-extrabold text-base text-slate-900">{c.currentDistressScore}</span>
                      <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Prev: {c.previousDistressScore} ({c.currentDistressScore - c.previousDistressScore >= 0 ? `+${c.currentDistressScore - c.previousDistressScore}` : c.currentDistressScore - c.previousDistressScore})
                    </div>
                  </td>

                  {/* Risk Level */}
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase border ${getRiskBadge(c.riskLevel)}`}>
                      {c.riskLevel}
                    </span>
                  </td>

                  {/* Trend / Trajectory */}
                  <td className="px-5 py-4">
                    {getTrajectoryBadge(c.trajectory)}
                  </td>

                  {/* Last Check-in */}
                  <td className="px-5 py-4">
                    <div className="text-slate-900 font-medium">
                      {c.lastCheckInAt ? new Date(c.lastCheckInAt).toLocaleDateString() : 'Today'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {c.history?.length || 1} assessments
                    </div>
                  </td>

                  {/* Follow-up */}
                  <td className="px-5 py-4">
                    {c.followUpDue ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-indigo-700 font-medium bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        <Clock className="w-3 h-3" />
                        <span>Due {c.followUpDue}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Up to date</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(c.caseId);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 text-xs font-semibold transition"
                    >
                      View Case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCases.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-500">
            No matching cases found for the selected filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
