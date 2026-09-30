import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
  FileText,
  HeartHandshake,
  Shield,
  Scale,
  Coins,
  Filter,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { InterventionRecord, CaseRecord } from '../../types';

interface FollowUpsViewProps {
  onSelectCase: (caseId: string) => void;
}

export const FollowUpsView: React.FC<FollowUpsViewProps> = ({ onSelectCase }) => {
  const { currentUser } = useAuth();
  const [interventions, setInterventions] = useState<InterventionRecord[]>([]);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'scheduled' | 'completed'>('all');
  const [showRecordModal, setShowRecordModal] = useState<boolean>(false);

  // Form state
  const [selectedCaseId, setSelectedCaseId] = useState<string>('PSY-1024');
  const [followUpDate, setFollowUpDate] = useState<string>('');
  const [followUpStatus, setFollowUpStatus] = useState<'scheduled' | 'in_progress' | 'completed'>('scheduled');
  const [caseNote, setCaseNote] = useState<string>('');
  const [supportAction, setSupportAction] = useState<InterventionRecord['type']>('tele_counselling');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const loadData = () => {
    setInterventions(storageService.getInterventions());
    setCases(storageService.getCases());
  };

  useEffect(() => {
    loadData();
    const unsub = storageService.subscribe(loadData);
    return () => unsub();
  }, []);

  const handleRecordFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId || !followUpDate) return;

    const actionTitleMap: Record<string, string> = {
      tele_counselling: 'Clinical Tele-Counselling Follow-up',
      protection_review: 'Witness Protection & Security Check',
      legal_aid: 'DLSA Legal Aid Consultation',
      financial_assistance: 'CVCF Relief Assessment',
    };

    // Add intervention record
    storageService.addIntervention({
      caseId: selectedCaseId,
      officerId: currentUser?.uid || 'officer-1',
      officerName: currentUser?.displayName || 'Authorized Official',
      type: supportAction,
      title: actionTitleMap[supportAction] || 'Follow-up Session',
      status: followUpStatus,
      notes: caseNote,
      aiRecommended: false,
    });

    // Update case follow-up date
    storageService.updateCase(selectedCaseId, {
      followUpDue: followUpDate,
    });

    // Add timeline event
    storageService.addTimelineEvent({
      id: `TL-FU-${Date.now()}`,
      caseId: selectedCaseId,
      type: 'human_review',
      title: `Follow-up Recorded (${followUpStatus})`,
      description: `Follow-up scheduled for ${followUpDate}. Note: ${caseNote}`,
      timestamp: new Date().toISOString(),
      badge: 'Follow-up',
    });

    setShowRecordModal(false);
    setFollowUpDate('');
    setCaseNote('');
    setSuccessMsg(`Follow-up recorded for Case ${selectedCaseId}.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleUpdateStatus = (id: string, newStatus: InterventionRecord['status']) => {
    storageService.updateInterventionStatus(id, newStatus);
    setSuccessMsg(`Status updated to ${newStatus}.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filteredInterventions = interventions.filter((item) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return item.status === 'in_progress';
    if (statusFilter === 'scheduled') return item.status === 'scheduled';
    if (statusFilter === 'completed') return item.status === 'completed';
    return true;
  });

  const getActionIcon = (type: string) => {
    if (type === 'tele_counselling') return <HeartHandshake className="w-4 h-4 text-indigo-600" />;
    if (type === 'legal_aid') return <Scale className="w-4 h-4 text-teal-600" />;
    if (type === 'financial_assistance') return <Coins className="w-4 h-4 text-amber-600" />;
    return <Shield className="w-4 h-4 text-rose-600" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (status === 'scheduled') return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    return 'bg-amber-50 text-amber-800 border-amber-200';
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Follow-up Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage scheduled, pending, and completed human follow-ups and support referrals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({interventions.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'pending' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({interventions.filter((i) => i.status === 'in_progress').length})
            </button>
            <button
              onClick={() => setStatusFilter('scheduled')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'scheduled' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Scheduled ({interventions.filter((i) => i.status === 'scheduled').length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'completed' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({interventions.filter((i) => i.status === 'completed').length})
            </button>
          </div>

          <button
            onClick={() => setShowRecordModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Record Follow-up</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Follow-ups List */}
      <div className="space-y-4">
        {filteredInterventions.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition hover:border-slate-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                  {getActionIcon(item.type)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>{item.title}</span>
                    <span className="font-mono text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                      {item.caseId}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Logged by {item.officerName} • {new Date(item.dispatchedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md border ${getStatusBadge(item.status)}`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Case Note */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 mb-4">
              <span className="font-semibold text-slate-900 block mb-1">Case Note:</span>
              <p className="leading-relaxed text-slate-600">{item.notes}</p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                {item.status !== 'completed' && (
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'completed')}
                    className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>Mark Completed</span>
                  </button>
                )}
                {item.status === 'completed' && (
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'in_progress')}
                    className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                  >
                    <span>Reopen</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => onSelectCase(item.caseId)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <span>View Case Detail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredInterventions.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500 shadow-xs">
            No follow-ups recorded in this category.
          </div>
        )}
      </div>

      {/* Record Follow-up Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Record Follow-up</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter details to track human outreach and support services.
            </p>

            <form onSubmit={handleRecordFollowUp} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Case ID</label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {cases.map((c) => (
                    <option key={c.caseId} value={c.caseId}>
                      {c.caseId} ({c.district} - Distress: {c.currentDistressScore})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Status</label>
                <select
                  value={followUpStatus}
                  onChange={(e) => setFollowUpStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Support / Referral Action</label>
                <select
                  value={supportAction}
                  onChange={(e) => setSupportAction(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="tele_counselling">Clinical Tele-Counselling</option>
                  <option value="legal_aid">Legal Aid (DLSA Consultation)</option>
                  <option value="protection_review">Witness Protection / Police Security Check</option>
                  <option value="financial_assistance">Financial Assistance (CVCF Relief)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Short Case Note</label>
                <textarea
                  rows={3}
                  value={caseNote}
                  onChange={(e) => setCaseNote(e.target.value)}
                  placeholder="Clinical observations, key takeaways, or next steps agreed..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 font-semibold pt-2">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition"
                >
                  Save Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
