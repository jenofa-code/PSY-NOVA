import React, { useState } from 'react';
import {
  HeartHandshake,
  Shield,
  Lock,
  ArrowRight,
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  PhoneCall,
  Globe,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../types';

interface VictimLoginProps {
  onLoginSuccess: () => void;
  onSwitchToProfessional: () => void;
  onBackToHome: () => void;
}

export const VictimLogin: React.FC<VictimLoginProps> = ({
  onLoginSuccess,
  onSwitchToProfessional,
  onBackToHome,
}) => {
  const { loginAsVictim } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [caseId, setCaseId] = useState('PSY-1024');
  const [pin, setPin] = useState('1024');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const sampleCases = [
    { id: 'PSY-1024', label: 'PSY-1024 (Escalating Distress - 73/100)', tag: 'Urgent', pin: '1024' },
    { id: 'PSY-1028', label: 'PSY-1028 (Moderate Distress - 58/100)', tag: 'Monitored', pin: '1028' },
    { id: 'PSY-1042', label: 'PSY-1042 (De-escalating / Stable - 26/100)', tag: 'Recovering', pin: '1042' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = loginAsVictim({ caseId, pin });
      setLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || t.auth.authFailed);
      }
    }, 250);
  };

  const handleQuickSelect = (sampleId: string, samplePin: string) => {
    setCaseId(sampleId);
    setPin(samplePin);
    setError(null);
  };

  return (
    <div className="login-shell min-h-[calc(100vh-4rem)] py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
          <button
            onClick={onBackToHome}
            className="hover:text-indigo-600 transition flex items-center gap-1 font-semibold"
          >
            ← {t.auth.backHome}
          </button>
          <div className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-1 font-bold ${language === 'en' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              EN
            </button>
            <span>•</span>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-1 font-bold ${language === 'ta' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              தமிழ்
            </button>
            <span>•</span>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-1 font-bold ${language === 'hi' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="auth-card glass-card rounded-3xl p-7 sm:p-9 shadow-2xl relative overflow-hidden">
          {/* Gentle Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
              <Shield className="w-3.5 h-3.5 text-teal-600" />
              <span>{t.auth.participantSpace}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.auth.victimTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md mx-auto leading-relaxed">
              {t.auth.victimDescription}
            </p>
          </div>

          {/* Privacy Guarantee Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-xs text-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Lock className="w-3.5 h-3.5 text-teal-600" />
              <span>{t.auth.privacyTitle}</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {t.auth.privacyDescription}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{error}</p>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  For this prototype, try demo Case ID <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">PSY-1024</code> with PIN <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">1024</code>.
                </p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="victim-case-id">
                  Participant Case ID
                </label>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Where is my Case ID?</span>
                </button>
              </div>
              <input
                id="victim-case-id"
                type="text"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value.toUpperCase())}
                placeholder="e.g. PSY-1024"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-mono font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                required
              />
            </div>

            {/* Quick Demo Case Selector */}
            <div>
              <span className="text-[11px] text-slate-500 font-medium block mb-1.5">
                Prototype demo cases (synthetic data):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {sampleCases.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => handleQuickSelect(sc.id, sc.pin)}
                    className={`px-2.5 py-1.5 rounded-lg border text-left text-xs transition ${
                      caseId === sc.id
                        ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-mono font-bold text-xs">{sc.id}</div>
                    <div className="text-[10px] text-slate-500">{sc.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="victim-pin">
                  Access PIN / Passcode
                </label>
                <span className="text-[10px] text-slate-500">
                  Demo access PIN: <strong className="text-slate-700 font-mono">1024</strong>
                </span>
              </div>
              <div className="relative">
                <input
                  id="victim-pin"
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="4-digit PIN"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-mono font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="submit-victim-login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Verifying Access Token...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Access Confidential Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Support Helplines Footnote */}
          <div className="mt-7 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
              <span>Immediate Helpline: Tele-MANAS (<strong>14416</strong>)</span>
            </div>
            <button
              type="button"
              onClick={onSwitchToProfessional}
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition"
            >
              Are you an official? Official Login →
            </button>
          </div>
        </div>
      </div>

      {/* Case ID Guidance Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-xl text-slate-900">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-3">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold mb-2">About Your Participant Case ID</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Your Case ID (such as <code className="font-mono font-bold bg-slate-100 px-1 py-0.5 rounded text-indigo-700">PSY-1024</code>) is issued directly by your assigned District Mental Health Counsellor or District Social Justice Protection Officer when enrolling in the monitoring program.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2 mb-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>It prevents anyone from linking your real identity to your answers.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>For this prototype, use <strong className="font-mono">PSY-1024</strong> with PIN <strong className="font-mono">1024</strong>.</span>
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
            >
              Got it, close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
