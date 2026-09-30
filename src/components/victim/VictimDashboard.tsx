import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  PhoneCall,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Activity,
  FileText,
  Home,
  History,
  User,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { storageService } from '../../services/storageService';
import { CaseRecord } from '../../types';
import { CheckInWizard } from './CheckInWizard';
import { VictimHistory } from './VictimHistory';
import { VictimSupport } from './VictimSupport';
import { VictimProfile } from './VictimProfile';

export type VictimTab = 'home' | 'checkin' | 'history' | 'support' | 'profile';

interface VictimDashboardProps {
  currentTab?: VictimTab;
  onTabChange?: (tab: VictimTab) => void;
}

export const VictimDashboard: React.FC<VictimDashboardProps> = ({
  currentTab: controlledTab,
  onTabChange,
}) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [internalTab, setInternalTab] = useState<VictimTab>('home');
  const [caseRecord, setCaseRecord] = useState<CaseRecord | null>(null);

  const activeTab = controlledTab || internalTab;

  const setActiveTab = (tab: VictimTab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  useEffect(() => {
    const loadCase = () => {
      const caseId = currentUser?.caseId || 'PSY-1024';
      const c = storageService.getCaseById(caseId);
      if (c) setCaseRecord(c);
    };

    loadCase();
    const unsub = storageService.subscribe(loadCase);
    return () => unsub();
  }, [currentUser]);

  const getTrajectoryIcon = (trajectory?: string) => {
    if (trajectory === 'improving') return <TrendingDown className="w-4 h-4 text-emerald-600" />;
    if (trajectory === 'stable') return <Minus className="w-4 h-4 text-teal-600" />;
    return <TrendingUp className="w-4 h-4 text-rose-600" />;
  };

  const getRiskBadge = (risk?: string) => {
    if (risk === 'low') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (risk === 'moderate') return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Victim Portal Subnavigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeTab === 'home'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('checkin')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeTab === 'checkin'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Check-in</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>My History</span>
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeTab === 'support'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Support</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Privacy</span>
        </button>
      </div>

      {/* VIEW: HOME */}
      {activeTab === 'home' && (
        <div className="space-y-6">
          {/* Welcome Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-3">
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Case ID: {caseRecord?.caseId || 'PSY-1024'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                  Welcome to PSYNOVA
                </h1>
                <p className="text-sm font-semibold text-indigo-900 mb-2">
                  "How are you feeling today?"
                </p>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Take a quiet moment to record your wellbeing. Regular check-ins help us understand how you are feeling over time and keep your support circle informed.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <button
                  id="victim-start-checkin-btn"
                  onClick={() => setActiveTab('checkin')}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition"
                >
                  <Activity className="w-4 h-4" />
                  <span>Start Check-in</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Distress Status */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-medium">Current Status</span>
                <Activity className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {caseRecord?.currentDistressScore || 32}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border uppercase ${getRiskBadge(caseRecord?.riskLevel)}`}>
                  {caseRecord?.riskLevel || 'Low'} Risk
                </span>
                <span className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                  {getTrajectoryIcon(caseRecord?.trajectory)}
                  <span className="capitalize">{caseRecord?.trajectory?.replace('_', ' ') || 'Stable'}</span>
                </span>
              </div>
            </div>

            {/* Last Check-in */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-medium">Last Check-in</span>
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-xl font-bold text-slate-900">
                {caseRecord?.lastCheckInAt
                  ? new Date(caseRecord.lastCheckInAt).toLocaleDateString()
                  : 'Baseline Session'}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Score: <strong className="text-slate-800">{caseRecord?.previousDistressScore || 30}</strong> / 100
              </div>
            </div>

            {/* Next Check-in */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-medium">Next Check-in</span>
                <Calendar className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-xl font-bold text-indigo-700">
                {caseRecord?.followUpDue || 'In 48 Hours'}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Cadence: <span className="text-slate-800 font-medium">Weekly periodic check-in</span>
              </div>
            </div>

            {/* Support Assigned */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-medium">Assigned Support</span>
                <Shield className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-sm font-bold text-slate-900 truncate">
                {caseRecord?.assignedCounsellor || 'Dr. Anita Sharma'}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                District Clinical Support Worker
              </div>
            </div>
          </div>

          {/* Home 2-column section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Quick trajectory snippet with link to history */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span>Recent Trajectory Over Time</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Watching how your distress indicators change week to week
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('history')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>View Full History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Step indicator sequence */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 mb-4">
                <div className="text-xs font-medium text-slate-600 mb-2">Trajectory progression:</div>
                <div className="flex items-center flex-wrap gap-2 text-xs font-semibold">
                  {caseRecord?.history.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg border ${
                        h.riskLevel === 'high'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : h.riskLevel === 'moderate'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {h.weekLabel}: {h.distressScore}
                      </span>
                      {i < (caseRecord?.history.length || 0) - 1 && (
                        <span className="text-slate-400">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed">
                If your distress increases across consecutive check-ins, your designated counsellor is automatically notified to reach out with personalized guidance.
              </div>
            </div>

            {/* Right: Quick Support Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <PhoneCall className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Always Here For You
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  Need someone to talk to right now? Reach free government support services round the clock:
                </p>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
                    <span className="text-[11px] text-slate-500 block">Tele-MANAS Toll-Free</span>
                    <span className="font-mono font-bold text-indigo-700 text-sm">14416</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[11px] text-slate-500 block">NALSA Legal Aid</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">15100</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('support')}
                className="mt-4 w-full py-2.5 rounded-xl border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs font-semibold transition text-center"
              >
                Go to Support Services
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CHECK-IN */}
      {activeTab === 'checkin' && (
        <CheckInWizard
          onBack={() => setActiveTab('home')}
          onCompleted={() => setActiveTab('history')}
          onNavigate={(tab) => setActiveTab(tab)}
        />
      )}

      {/* VIEW: HISTORY */}
      {activeTab === 'history' && (
        <VictimHistory
          caseRecord={caseRecord}
          onStartCheckIn={() => setActiveTab('checkin')}
        />
      )}

      {/* VIEW: SUPPORT */}
      {activeTab === 'support' && (
        <VictimSupport caseRecord={caseRecord} />
      )}

      {/* VIEW: PROFILE / PRIVACY */}
      {activeTab === 'profile' && (
        <VictimProfile caseRecord={caseRecord} />
      )}
    </div>
  );
};
