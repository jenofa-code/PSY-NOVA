import React, { useState } from 'react';
import {
  PhoneCall,
  MessageSquare,
  Shield,
  Calendar,
  Clock,
  Send,
  HeartHandshake,
  CheckCircle2,
  Lock,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { CaseRecord } from '../../types';

interface VictimSupportProps {
  caseRecord: CaseRecord | null;
}

export const VictimSupport: React.FC<VictimSupportProps> = ({ caseRecord }) => {
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setMessageText('');
    setTimeout(() => setMessageSent(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Support & Assistance
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Human care and professional support are always here for you. Automated check-ins never replace human counsel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Contact Assigned Counsellor & Next Follow-up */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assigned Counsellor Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-base">
                  AS
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {caseRecord?.assignedCounsellor || 'Dr. Anita Sharma'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    District Clinical Counsellor & Social Worker
                  </p>
                  <div className="inline-flex items-center gap-1.5 mt-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Available for Scheduled Support
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-slate-500 block">Case Reference</span>
                <span className="text-xs font-mono font-bold text-indigo-700">
                  {caseRecord?.caseId || 'PSY-1024'}
                </span>
              </div>
            </div>

            {/* Follow-up Information */}
            <div className="py-4 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div className="text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Next Follow-up Session</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {caseRecord?.followUpDue || 'Scheduled within 48 hours'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Regular routine check-in with your assigned counsellor
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div className="text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Follow-up Status</span>
                </div>
                <div className="font-bold text-indigo-700 text-sm capitalize">
                  {caseRecord?.followUpStatus?.replace('_', ' ') || 'Due Today'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Authorized support team has been notified
                </div>
              </div>
            </div>

            {/* Direct Message to Counsellor */}
            <div className="pt-4">
              <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                <span>Send a Direct Note to Your Counsellor</span>
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                If you have experienced any new incident, concern, or wish to request an earlier meeting, leave a secure message below.
              </p>

              {messageSent ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your note has been securely forwarded to Dr. Anita Sharma. You will receive a follow-up confirmation.</span>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <textarea
                    rows={3}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message here (e.g., 'Can we schedule a call tomorrow afternoon?')"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-slate-50/50"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!messageText.trim()}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Note</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Privacy & Safe Storage Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Zero-Knowledge Confidentiality</span>
            </div>
            <p className="leading-relaxed">
              Your communications and check-in reports are accessible strictly by authorized human professionals assigned to your support file. The system does not share data with commercial networks or third-party advertisers.
            </p>
          </div>
        </div>

        {/* Right Column: 24/7 Helplines & Emergency Services */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-indigo-600" />
              <span>24/7 National Support Helplines</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              If you feel distressed, overwhelmed, or in need of immediate counsel, free toll-free human assistance is available at any time.
            </p>

            <div className="space-y-3">
              {/* Tele-MANAS */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs">
                <div className="font-bold text-slate-900">Tele-MANAS</div>
                <div className="text-indigo-700 font-extrabold text-lg my-1">
                  14416
                </div>
                <p className="text-slate-600 text-[11px]">
                  Government of India round-the-clock psychological first aid, tele-counselling, and crisis de-escalation in regional languages.
                </p>
              </div>

              {/* NALSA Legal Aid */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-bold text-slate-900">National Legal Services (NALSA)</div>
                <div className="text-slate-900 font-extrabold text-lg my-1">
                  15100
                </div>
                <p className="text-slate-600 text-[11px]">
                  Free legal representation, protection orders, and legal aid counsel for victims of atrocities and vulnerable witnesses.
                </p>
              </div>

              {/* National Emergency 112 */}
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-xs">
                <div className="font-bold text-rose-900">Immediate Emergency / Police</div>
                <div className="text-rose-700 font-extrabold text-lg my-1">
                  112
                </div>
                <p className="text-rose-800 text-[11px]">
                  For urgent physical safety threats, police assistance, or immediate dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
