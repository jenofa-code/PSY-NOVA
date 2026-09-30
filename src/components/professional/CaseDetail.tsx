import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  HeartHandshake,
  ShieldAlert,
  Send,
  UserCheck,
  Building,
  Scale,
  Sparkles,
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
import { CaseRecord, TimelineEvent, InterventionRecord } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

interface CaseDetailProps {
  caseId: string;
  onBack: () => void;
}

export const CaseDetail: React.FC<CaseDetailProps> = ({ caseId, onBack }) => {
  const { currentUser } = useAuth();
  const [caseRecord, setCaseRecord] = useState<CaseRecord | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  // Modals for actions
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>('');
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleNotes, setScheduleNotes] = useState<string>('');
  const [showReferralModal, setShowReferralModal] = useState<boolean>(false);
  const [referralType, setReferralType] = useState<InterventionRecord['type']>('tele_counselling');
  const [referralTitle, setReferralTitle] = useState<string>('');
  const [referralNotes, setReferralNotes] = useState<string>('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');

  const refreshData = () => {
    const c = storageService.getCaseById(caseId);
    if (c) setCaseRecord(c);
    const tl = storageService.getTimelineForCase(caseId);
    setTimeline(tl);
  };

  useEffect(() => {
    refreshData();
    const unsub = storageService.subscribe(refreshData);
    return () => unsub();
  }, [caseId]);

  if (!caseRecord) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
        <p>Case not found or loaded.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-semibold"
        >
          Return to cases
        </button>
      </div>
    );
  }

  const handleAcknowledgeAlert = () => {
    const alerts = storageService.getAlerts().filter((a) => a.caseId === caseId && a.status === 'open');
    alerts.forEach((alert) => {
      storageService.updateAlertStatus(alert.id, 'acknowledged', currentUser?.displayName);
    });

    storageService.addTimelineEvent({
      id: `TL-ACK-${Date.now()}`,
      caseId,
      type: 'human_review',
      title: 'Alert Acknowledged by Official',
      description: `Case alert reviewed and acknowledged by ${currentUser?.displayName || 'Authorized Official'}. Prioritized for human follow-up.`,
      timestamp: new Date().toISOString(),
      badge: 'Human Action',
    });

    setActionSuccessMsg('Alert acknowledged. Case status updated in audit log.');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    storageService.addTimelineEvent({
      id: `TL-NOTE-${Date.now()}`,
      caseId,
      type: 'human_review',
      title: 'Case Note Added',
      description: noteContent,
      timestamp: new Date().toISOString(),
      badge: 'Case Note',
    });

    setNoteContent('');
    setShowNoteModal(false);
    setActionSuccessMsg('Case note successfully recorded.');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleDate) return;

    storageService.addTimelineEvent({
      id: `TL-SCHED-${Date.now()}`,
      caseId,
      type: 'human_review',
      title: 'Follow-up Scheduled',
      description: `Follow-up set for ${scheduleDate}. Notes: ${scheduleNotes || 'Routine check'}`,
      timestamp: new Date().toISOString(),
      badge: 'Follow-up',
    });

    // Update case record followUpDue
    storageService.updateCase(caseId, {
      followUpDue: scheduleDate,
    });

    setScheduleDate('');
    setScheduleNotes('');
    setShowScheduleModal(false);
    setActionSuccessMsg(`Follow-up scheduled for ${scheduleDate}.`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleCreateReferral = (type: InterventionRecord['type'], title: string, defaultNote: string) => {
    setReferralType(type);
    setReferralTitle(title);
    setReferralNotes(defaultNote);
    setShowReferralModal(true);
  };

  const submitReferral = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.addIntervention({
      caseId,
      officerId: currentUser?.uid || 'officer-1',
      officerName: currentUser?.displayName || 'Authorized Official',
      type: referralType,
      title: referralTitle,
      status: 'in_progress',
      notes: referralNotes,
      aiRecommended: true,
    });

    storageService.addTimelineEvent({
      id: `TL-REF-${Date.now()}`,
      caseId,
      type: 'human_review',
      title: `Referral Created: ${referralTitle}`,
      description: referralNotes,
      timestamp: new Date().toISOString(),
      badge: 'Referral',
    });

    setShowReferralModal(false);
    setActionSuccessMsg(`Referral to "${referralTitle}" submitted.`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // Trajectory calculations
  const history = caseRecord.history || [];
  const firstScore = history.length > 0 ? history[0].distressScore : caseRecord.currentDistressScore;
  const currentScore = caseRecord.currentDistressScore;
  const scoreChange = currentScore - caseRecord.previousDistressScore;
  const totalChange = currentScore - firstScore;

  // Chart data
  const chartData = history.map((h) => ({
    name: h.weekLabel,
    score: h.distressScore,
    date: h.date,
    risk: h.riskLevel,
  }));

  const getTrajectoryIcon = (trajectory: string) => {
    if (trajectory === 'improving') return <TrendingDown className="w-4 h-4 text-emerald-600" />;
    if (trajectory === 'stable') return <Minus className="w-4 h-4 text-teal-600" />;
    return <TrendingUp className="w-4 h-4 text-rose-600" />;
  };

  const getRiskBadge = (risk: string) => {
    if (risk === 'low') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (risk === 'moderate') return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            id="back-to-cases-btn"
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-xs"
            aria-label="Back to cases"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
                {caseRecord.caseId}
              </h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-md font-bold uppercase border ${getRiskBadge(caseRecord.riskLevel)}`}>
                {caseRecord.riskLevel} Risk
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-md font-medium text-slate-600 bg-slate-100 border border-slate-200">
                {caseRecord.district}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Assigned: {caseRecord.assignedCounsellor} • Registered: {caseRecord.registeredDate}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAcknowledgeAlert}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition"
          >
            <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Acknowledge</span>
          </button>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-600" />
            <span>Schedule Follow-up</span>
          </button>

          <button
            onClick={() => setShowNoteModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Add Case Note</span>
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Case Overview Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Current Score */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Current Score</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
            {caseRecord.currentDistressScore}
            <span className="text-xs font-normal text-slate-400 font-mono"> / 100</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Previous: {caseRecord.previousDistressScore}
          </div>
        </div>

        {/* Change */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Score Change</div>
          <div className={`text-xl font-bold mt-0.5 ${scoreChange > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {scoreChange > 0 ? `+${scoreChange}` : scoreChange} pts
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Total shift: {totalChange > 0 ? `+${totalChange}` : totalChange} pts
          </div>
        </div>

        {/* Trajectory */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Trajectory</div>
          <div className="flex items-center gap-1 mt-0.5 text-sm font-bold text-slate-900 capitalize">
            {getTrajectoryIcon(caseRecord.trajectory)}
            <span>{caseRecord.trajectory.replace('_', ' ')}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {caseRecord.consecutiveIncreases} consecutive increases
          </div>
        </div>

        {/* Escalation Risk */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Escalation Risk</div>
          <div className="text-sm font-extrabold uppercase mt-0.5 text-rose-600">
            {caseRecord.escalationRisk || 'HIGH'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Early-warning status
          </div>
        </div>

        {/* Last Check-in */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Last Check-in</div>
          <div className="text-xs font-bold text-slate-800 mt-1 truncate">
            {caseRecord.lastCheckInAt ? new Date(caseRecord.lastCheckInAt).toLocaleDateString() : 'Today'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {caseRecord.history?.length || 1} total sessions
          </div>
        </div>

        {/* Follow-up Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Follow-up Status</div>
          <div className="text-xs font-bold text-indigo-700 mt-1 truncate">
            {caseRecord.followUpDue ? `Due ${caseRecord.followUpDue}` : 'Up to date'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Assigned to {caseRecord.assignedCounsellor.split(' ')[0]}
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Trajectory Chart & Contributing Signals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 13: Distress Trajectory Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>Distress Trajectory</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Longitudinal assessment tracking change over time across weekly check-ins
                </p>
              </div>

              {/* Trajectory numbers: 32 → 38 → 47 → 61 → 73 */}
              <div className="flex items-center gap-1.5 text-xs font-bold font-mono bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
                {history.map((h, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className={h.distressScore >= 60 ? 'text-rose-600' : 'text-slate-700'}>
                      {h.distressScore}
                    </span>
                    {i < history.length - 1 && <span className="text-slate-400 font-normal">→</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* Recharts Line Chart */}
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg text-xs">
                            <div className="font-bold text-slate-900">{data.name} ({data.date})</div>
                            <div className="text-indigo-600 font-extrabold text-sm mt-1">
                              Distress Score: {data.score} / 100
                            </div>
                            <div className="text-slate-500 capitalize">Risk: {data.risk}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    y={60}
                    stroke="#f43f5e"
                    strokeDasharray="4 4"
                    label={{
                      value: 'High Distress Threshold (60)',
                      fill: '#e11d48',
                      fontSize: 10,
                      position: 'insideTopRight',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    dot={{ fill: '#4f46e5', r: 4, stroke: '#ffffff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#4338ca' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Summary sentence */}
            <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <strong>Trajectory Summary:</strong> Distress increased by {Math.abs(totalChange)} points across {history.length} assessments.
              </div>
              <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded shrink-0">
                {caseRecord.consecutiveIncreases} Consecutive Increases
              </span>
            </div>
          </div>

          {/* Section 14: Contributing Signals */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Contributing Signals</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Observed multi-modal indicator shifts detected across recent check-ins. Note: These represent contributing signals, not clinical causes.
              </p>
            </div>

            <div className="space-y-3">
              {caseRecord.contributingSignals.map((sig, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-xs"
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                      sig.direction === 'up'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : sig.direction === 'down'
                        ? 'bg-teal-100 text-teal-700 border border-teal-200'
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {sig.direction === 'up' ? '↑' : sig.direction === 'down' ? '↓' : '⚠'}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{sig.label}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        {sig.impact} Weight
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                      {sig.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline of Human Reviews & Logged Notes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Case History & Logged Notes</h3>
            <div className="space-y-3 text-xs">
              {timeline.map((event) => (
                <div key={event.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900">{event.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Early Warning & Human Follow-Up Actions */}
        <div className="space-y-6">
          {/* Section 15: Early Warning */}
          {caseRecord.currentDistressScore >= 60 && (
            <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 text-rose-800 font-bold mb-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Early Warning</span>
              </div>
              <p className="text-xs font-semibold text-rose-950 mb-3">
                {caseRecord.caseId} shows a worsening distress trajectory.
              </p>

              <div className="p-3 bg-white/90 border border-rose-200 rounded-xl text-xs space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Escalation Risk:</span>
                  <span className="font-extrabold text-rose-700">HIGH</span>
                </div>
                <div className="text-[11px] text-slate-700 leading-relaxed border-t border-rose-100 pt-2">
                  <strong>Explanation:</strong> Distress has increased across multiple consecutive check-ins and engagement has decreased.
                </div>
              </div>

              {/* Mandatory constraint notice */}
              <div className="p-2.5 bg-rose-100/70 border border-rose-200 rounded-xl text-[11px] text-rose-900 font-semibold">
                AI-assisted early warning. Human professional review required.
              </div>
            </div>
          )}

          {/* Section 16: Human Follow-Up Actions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Human Follow-up Actions</h3>
            <p className="text-xs text-slate-500 mb-4">
              Authorized professional must confirm and execute clinical and support actions.
            </p>

            <div className="space-y-3">
              {/* Action 1: Acknowledge */}
              <button
                onClick={handleAcknowledgeAlert}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-xs font-semibold text-slate-800 transition"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600" />
                  <span>Acknowledge</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">Review & mark</span>
              </button>

              {/* Action 2: Schedule Follow-up */}
              <button
                onClick={() => setShowScheduleModal(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-xs font-semibold text-slate-800 transition"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>Schedule Follow-up</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">Set session date</span>
              </button>

              {/* Action 3: Add Case Note */}
              <button
                onClick={() => setShowNoteModal(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-xs font-semibold text-slate-800 transition"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Add Case Note</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">Audit record</span>
              </button>

              {/* Action 4: Refer to Counselling */}
              <button
                onClick={() =>
                  handleCreateReferral(
                    'tele_counselling',
                    'Clinical Counselling Session',
                    'Trauma-informed supportive counselling session following marked distress increase.'
                  )
                }
                className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-xs font-semibold text-indigo-900 transition"
              >
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-indigo-700" />
                  <span>Refer to Counselling</span>
                </div>
                <span className="text-[10px] text-indigo-700 font-medium">Dr. Anita Sharma</span>
              </button>

              {/* Action 5: Refer to Support Services */}
              <button
                onClick={() =>
                  handleCreateReferral(
                    'protection_review',
                    'Support & Legal Protection Services',
                    'Initiate multi-agency victim assistance check with District Legal Aid and Protection unit.'
                  )
                }
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>Refer to Support Services</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">NALSA / District</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 mb-2">Add Clinical Case Note</h3>
            <p className="text-xs text-slate-500 mb-4">
              This note will be recorded to the case audit timeline for Case {caseRecord.caseId}.
            </p>
            <form onSubmit={handleAddNote}>
              <textarea
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Enter confidential clinical observations, contact notes, or safety check summary..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4"
                required
              />
              <div className="flex justify-end gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Follow-up Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 mb-2">Schedule Human Follow-up</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select date for next scheduled outreach with Case {caseRecord.caseId}.
            </p>
            <form onSubmit={handleScheduleFollowUp} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Session Objective</label>
                <input
                  type="text"
                  value={scheduleNotes}
                  onChange={(e) => setScheduleNotes(e.target.value)}
                  placeholder="e.g. Discuss court summons anxiety and verify sleep status"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 text-xs font-semibold pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Referral Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Refer Case</h3>
            <p className="text-xs text-slate-500 mb-4">
              Initiate formal referral for Case {caseRecord.caseId}.
            </p>
            <form onSubmit={submitReferral} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Referral Service</label>
                <input
                  type="text"
                  value={referralTitle}
                  onChange={(e) => setReferralTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Instructions / Note</label>
                <textarea
                  rows={3}
                  value={referralNotes}
                  onChange={(e) => setReferralNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 text-xs font-semibold pt-2">
                <button
                  type="button"
                  onClick={() => setShowReferralModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition"
                >
                  Confirm Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
