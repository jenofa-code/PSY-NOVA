import React, { useState, useEffect } from 'react';
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Shield,
  ArrowRight,
  Activity,
  BellRing,
  HeartHandshake,
  UserCheck,
  Award,
  CheckCircle,
  Clock,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { CaseRecord, AlertRecord } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CasesList } from './CasesList';
import { CaseDetail } from './CaseDetail';
import { AlertsView } from './AlertsView';
import { FollowUpsView } from './FollowUpsView';

export type ProfessionalTab = 'dashboard' | 'cases' | 'case_detail' | 'alerts' | 'followups' | 'profile';

interface ProfessionalDashboardProps {
  initialCaseId?: string | null;
  currentTab?: ProfessionalTab;
  onTabChange?: (tab: ProfessionalTab) => void;
}

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({
  initialCaseId = null,
  currentTab: controlledTab,
  onTabChange,
}) => {
  const { currentUser, logout } = useAuth();
  const { t } = useLanguage();

  const [internalTab, setInternalTab] = useState<ProfessionalTab>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(initialCaseId);

  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);

  const activeTab = controlledTab || internalTab;

  const setActiveTab = (tab: ProfessionalTab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  useEffect(() => {
    if (initialCaseId) {
      setSelectedCaseId(initialCaseId);
      setActiveTab('case_detail');
    }
  }, [initialCaseId]);

  const refreshData = () => {
    setCases(storageService.getCases());
    setAlerts(storageService.getAlerts());
  };

  useEffect(() => {
    refreshData();
    const unsub = storageService.subscribe(refreshData);
    return () => unsub();
  }, []);

  const totalActive = cases.length;
  const highRiskCount = cases.filter((c) => c.riskLevel === 'high' || c.riskLevel === 'critical').length;
  const worseningCount = cases.filter(
    (c) => c.trajectory === 'worsening' || c.trajectory === 'rapidly_worsening'
  ).length;
  const followUpsDueCount = cases.filter((c) => Boolean(c.followUpDue)).length;
  const openAlertsCount = alerts.filter((a) => a.status === 'open').length;

  // Cases needing attention (high risk or worsening)
  const attentionCases = cases.filter(
    (c) => c.currentDistressScore >= 50 || c.trajectory === 'worsening' || c.trajectory === 'rapidly_worsening'
  );

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('case_detail');
  };

  const getRiskBadge = (risk: string) => {
    if (risk === 'low') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (risk === 'moderate') return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="glass-card rounded-2xl p-5 mb-5 border border-emerald-500/15">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[.18em] text-emerald-300"><span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />Live command center</div>
            <h1 className="text-2xl font-extrabold text-white mt-1">Trajectory Intelligence Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1">Monitor change over time, inspect explainable signals, and route every escalation to human review.</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500"><span className="px-2 py-1 rounded-md border border-emerald-500/20 bg-emerald-500/5 text-emerald-300">SYNTHETIC DATA</span><span>HUMAN-IN-THE-LOOP</span></div>
        </div>
      </div>
      {/* Professional Portal Subnavigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeTab === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('cases')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeTab === 'cases' || activeTab === 'case_detail'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Cases ({cases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeTab === 'alerts'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>Alerts</span>
          {openAlertsCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
              {openAlertsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('followups')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeTab === 'followups'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Follow-ups</span>
          {followUpsDueCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
              {followUpsDueCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Profile & Credentials</span>
        </button>
      </div>

      {/* VIEW: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Active Cases */}
            <div
              onClick={() => setActiveTab('cases')}
              className="glass-card glass-card-interactive cursor-pointer rounded-2xl p-5 transition"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-medium">Active Cases</span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{totalActive}</div>
              <p className="text-xs text-indigo-600 mt-2 flex items-center gap-1 font-medium">
                <span>Under active trajectory tracking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>

            {/* 2. High-Risk Cases */}
            <div
              onClick={() => setActiveTab('cases')}
              className="glass-card glass-card-interactive cursor-pointer rounded-2xl p-5 transition"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-medium">High-Risk Cases</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-3xl font-extrabold text-rose-600">{highRiskCount}</div>
              <p className="text-xs text-rose-600 mt-2 flex items-center gap-1 font-medium">
                <span>Distress score 60+ threshold</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>

            {/* 3. Worsening Cases */}
            <div
              onClick={() => setActiveTab('cases')}
              className="glass-card glass-card-interactive cursor-pointer rounded-2xl p-5 transition"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-medium">Worsening Cases</span>
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-extrabold text-amber-600">{worseningCount}</div>
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1 font-medium">
                <span>Upward distress velocity</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>

            {/* 4. Follow-ups Due */}
            <div
              onClick={() => setActiveTab('followups')}
              className="glass-card glass-card-interactive cursor-pointer rounded-2xl p-5 transition"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-medium">Follow-ups Due</span>
                <Calendar className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-3xl font-extrabold text-teal-700">{followUpsDueCount}</div>
              <p className="text-xs text-teal-700 mt-2 flex items-center gap-1 font-medium">
                <span>Scheduled for human contact</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </div>

          {/* Section 11: Cases Needing Attention */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Cases Needing Attention</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Priority cases flagged for elevated distress or accelerating trajectory shifts
                </p>
              </div>
              <button
                onClick={() => setActiveTab('cases')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View All Cases</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {attentionCases.map((c) => (
                <div
                  key={c.caseId}
                  className="bg-slate-50 hover:bg-slate-100/80 transition p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-indigo-700 text-xs shadow-xs">
                      ID
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono text-sm">{c.caseId}</span>
                        <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${getRiskBadge(c.riskLevel)}`}>
                          {c.riskLevel}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <TrendingUp className="w-3 h-3" />
                          <span>Worsening</span>
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Last check-in: <strong className="text-slate-700">{c.lastCheckInAt ? new Date(c.lastCheckInAt).toLocaleDateString() : 'Today'}</strong> • District: {c.district}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-slate-900">
                        {c.currentDistressScore} <span className="text-xs font-normal text-slate-400 font-mono">/ 100</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {c.consecutiveIncreases} consecutive increases
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectCase(c.caseId)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-xs"
                    >
                      View Case
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CASES LIST */}
      {activeTab === 'cases' && (
        <CasesList onSelectCase={handleSelectCase} />
      )}

      {/* VIEW: CASE DETAIL */}
      {activeTab === 'case_detail' && selectedCaseId && (
        <CaseDetail
          caseId={selectedCaseId}
          onBack={() => setActiveTab('cases')}
        />
      )}

      {/* VIEW: ALERTS */}
      {activeTab === 'alerts' && (
        <AlertsView onSelectCase={handleSelectCase} />
      )}

      {/* VIEW: FOLLOW-UPS */}
      {activeTab === 'followups' && (
        <FollowUpsView onSelectCase={handleSelectCase} />
      )}

      {/* VIEW: PROFILE & CREDENTIALS */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Profile Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                  AS
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {currentUser?.displayName || 'Dr. Anita Sharma'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    District Clinical Mental Health Officer • DMHP Unit
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>Authorized Official</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Credential ID:</span>
                <span className="font-bold text-slate-900 font-mono">OFF-DMHP-7821</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Jurisdiction:</span>
                <span className="font-bold text-slate-900">District Legal & Mental Health Authority</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">System Access:</span>
                <span className="font-bold text-slate-900">Full Trajectory Audit & Intervention Access</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Assigned Caseload:</span>
                <span className="font-bold text-slate-900">{cases.length} Monitored Cases</span>
              </div>
            </div>
          </div>

          {/* Compliance & Human Agency Guarantee */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs text-slate-700 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Mandatory Clinical & Legal Disclaimers</span>
            </h3>
            <p className="leading-relaxed text-slate-600">
              PSYNOVA is a prototype designed to identify increasing psychological distress over time. It does not provide clinical diagnosis and does not replace qualified professionals.
            </p>
            <p className="leading-relaxed text-slate-600">
              The AI only provides an early-warning signal and possible support suggestions. All final decisions regarding clinical care, psychological assistance, legal aid referrals, witness protection, and rehabilitation remain strictly with authorized human professionals.
            </p>
          </div>

          {/* Sign Out Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Sign Out of Professional Session</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Securely terminate official session and release encryption keys.
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100/70 text-xs font-bold transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
