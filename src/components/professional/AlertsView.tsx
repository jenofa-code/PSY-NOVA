import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Calendar,
  Eye,
  Shield,
  Filter,
} from 'lucide-react';
import { AlertRecord } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

interface AlertsViewProps {
  onSelectCase: (caseId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ onSelectCase }) => {
  const { currentUser } = useAuth();
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [statusTab, setStatusTab] = useState<'all' | 'open' | 'acknowledged' | 'resolved'>('all');
  const [selectedCaseForSchedule, setSelectedCaseForSchedule] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleNotes, setScheduleNotes] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  useEffect(() => {
    const load = () => {
      setAlerts(storageService.getAlerts());
    };
    load();
    const unsub = storageService.subscribe(load);
    return () => unsub();
  }, []);

  const handleAcknowledge = (alertId: string, caseId: string) => {
    storageService.updateAlertStatus(alertId, 'acknowledged', currentUser?.displayName || 'Authorized Official');
    storageService.addTimelineEvent({
      id: `TL-ACK-${Date.now()}`,
      caseId,
      type: 'human_review',
      title: 'Alert Acknowledged by Official',
      description: `Alert marked as reviewed by ${currentUser?.displayName || 'Authorized Official'}.`,
      timestamp: new Date().toISOString(),
      badge: 'Human Action',
    });
    setSuccessMsg(`Alert for Case ${caseId} acknowledged.`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseForSchedule || !scheduleDate) return;

    storageService.updateCase(selectedCaseForSchedule, {
      followUpDue: scheduleDate,
    });

    storageService.addTimelineEvent({
      id: `TL-SCHED-${Date.now()}`,
      caseId: selectedCaseForSchedule,
      type: 'human_review',
      title: 'Follow-up Scheduled from Alert',
      description: `Session date set for ${scheduleDate}. Note: ${scheduleNotes || 'Routine contact'}`,
      timestamp: new Date().toISOString(),
      badge: 'Follow-up',
    });

    setSuccessMsg(`Follow-up scheduled for Case ${selectedCaseForSchedule} on ${scheduleDate}.`);
    setTimeout(() => setSuccessMsg(''), 3500);
    setSelectedCaseForSchedule(null);
    setScheduleDate('');
    setScheduleNotes('');
  };

  const filteredAlerts = alerts.filter((a) => {
    if (statusTab === 'all') return true;
    return a.status === statusTab;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Early Warning Alerts</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Notifications triggered when longitudinal assessment signals show significant distress trajectory shifts.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setStatusTab('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              statusTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setStatusTab('open')}
            className={`px-3 py-1.5 rounded-lg transition ${
              statusTab === 'open'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Open ({alerts.filter((a) => a.status === 'open').length})
          </button>
          <button
            onClick={() => setStatusTab('acknowledged')}
            className={`px-3 py-1.5 rounded-lg transition ${
              statusTab === 'acknowledged'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Acknowledged ({alerts.filter((a) => a.status === 'acknowledged').length})
          </button>
          <button
            onClick={() => setStatusTab('resolved')}
            className={`px-3 py-1.5 rounded-lg transition ${
              statusTab === 'resolved'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resolved ({alerts.filter((a) => a.status === 'resolved').length})
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white border rounded-2xl p-5 shadow-xs transition ${
              alert.status === 'open'
                ? 'border-rose-200/90 hover:border-rose-300'
                : 'border-slate-200 opacity-90'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  Early Warning
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {alert.caseId}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(alert.createdAt).toLocaleDateString()}
                </span>
              </div>

              {alert.acknowledgedBy && (
                <span className="text-[11px] text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                  Acknowledged by {alert.acknowledgedBy}
                </span>
              )}
            </div>

            {/* Alert Message */}
            <p className="text-xs font-semibold text-slate-800 mb-1">
              Worsening distress trajectory detected.
            </p>
            <p className="text-xs text-slate-600 mb-4">
              {alert.reason} Human review recommended.
            </p>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium">
                Status: <span className="capitalize font-semibold text-slate-700">{alert.status}</span>
              </div>

              <div className="flex items-center gap-2">
                {alert.status === 'open' && (
                  <button
                    onClick={() => handleAcknowledge(alert.id, alert.caseId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Acknowledge</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedCaseForSchedule(alert.caseId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-600" />
                  <span>Schedule Follow-up</span>
                </button>

                <button
                  onClick={() => onSelectCase(alert.caseId)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-xs"
                >
                  <span>View Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500 shadow-xs">
            No alerts matching the selected status.
          </div>
        )}
      </div>

      {/* Schedule Follow-up Modal */}
      {selectedCaseForSchedule && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 mb-2">Schedule Human Follow-up</h3>
            <p className="text-xs text-slate-500 mb-4">
              Set outreach date for Case {selectedCaseForSchedule}.
            </p>
            <form onSubmit={handleScheduleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Objective / Notes</label>
                <input
                  type="text"
                  value={scheduleNotes}
                  onChange={(e) => setScheduleNotes(e.target.value)}
                  placeholder="e.g. Assess escalating distress and check safety"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 text-xs font-semibold pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCaseForSchedule(null)}
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
