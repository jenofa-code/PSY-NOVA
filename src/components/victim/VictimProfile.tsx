import React from 'react';
import {
  Shield,
  Lock,
  User,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Info,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CaseRecord } from '../../types';

interface VictimProfileProps {
  caseRecord: CaseRecord | null;
}

export const VictimProfile: React.FC<VictimProfileProps> = ({ caseRecord }) => {
  const { currentUser, logout } = useAuth();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Profile & Privacy
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Review your anonymized participant profile, privacy protections, and language preferences.
        </p>
      </div>

      {/* Case Identity Details */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Participant File Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 block mb-1 font-medium">Anonymized Case Identifier</span>
            <div className="font-mono font-bold text-indigo-700 text-base">
              {caseRecord?.caseId || currentUser?.caseId || 'PSY-1024'}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Identity protected under zero-knowledge case mapping.
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 block mb-1 font-medium">Assigned Support Professional</span>
            <div className="font-bold text-slate-900 text-base">
              {caseRecord?.assignedCounsellor || 'Dr. Anita Sharma'}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              District DMHP Clinical Support Officer
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 block mb-1 font-medium">Registration Date</span>
            <div className="font-semibold text-slate-800 text-sm">
              {caseRecord?.registrationDate || '2026-08-01'}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Baseline monitoring active
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 block mb-1 font-medium">Cadence</span>
            <div className="font-semibold text-slate-800 text-sm">
              Weekly Routine Check-in
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Next due: {caseRecord?.followUpDue || '48 hours'}
            </span>
          </div>
        </div>
      </div>

      {/* Language Preference */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-indigo-600" />
          <span>Preferred Language</span>
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          Select the language in which you would like to view check-ins and prompts:
        </p>

        <div className="grid grid-cols-3 gap-3 max-w-md">
          <button
            onClick={() => setLanguage('en')}
            className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
              language === 'en'
                ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ta')}
            className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
              language === 'ta'
                ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            தமிழ்
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
              language === 'hi'
                ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* Privacy Notice Card */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 shadow-xs text-xs space-y-3">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
          <Lock className="w-4 h-4 text-indigo-600" />
          <span>Privacy & Prototype Notice</span>
        </div>
        <p className="text-slate-700 leading-relaxed">
          <strong>PSYNOVA is a prototype designed to identify increasing psychological distress over time. It does not provide clinical diagnosis and does not replace qualified professionals.</strong>
        </p>
        <div className="pt-2 text-slate-600 space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>All records stored with pseudonymized IDs to ensure full privacy.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Only designated district counsellors and authorized officials have decryption access.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Never shared with commercial data brokers or public search engines.</span>
          </div>
        </div>
      </div>

      {/* Sign Out Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Sign Out of Participant Portal</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            End this session on this device. You can log back in at any time with your Case ID and PIN.
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
  );
};
