import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  BadgeCheck,
  UserCheck,
  FileText,
  HeartHandshake,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ProfessionalLoginProps {
  onLoginSuccess: () => void;
  onSwitchToVictim: () => void;
  onBackToHome: () => void;
}

export const ProfessionalLogin: React.FC<ProfessionalLoginProps> = ({
  onLoginSuccess,
  onSwitchToVictim,
  onBackToHome,
}) => {
  const { loginAsProfessional } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const [email, setEmail] = useState('dr.asharma@dmhp.gov.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('counsellor');
  const [district, setDistrict] = useState('Madurai');
  const [badgeId, setBadgeId] = useState('OFF-DMHP-7821');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const officialPersonas = [
    {
      name: 'Dr. Anita Sharma, M.Phil',
      role: 'counsellor' as UserRole,
      department: 'District Mental Health Program (DMHP)',
      email: 'dr.asharma@dmhp.gov.in',
      district: 'Madurai',
      badgeId: 'OFF-DMHP-7821',
      title: 'Clinical Counsellor',
    },
    {
      name: 'S. K. Verma, IAS',
      role: 'admin' as UserRole,
      department: 'District Social Justice & Protection Cell',
      email: 's.verma@welfare.gov.in',
      district: 'Madurai',
      badgeId: 'OFF-PROT-4012',
      title: 'District Protection Officer',
    },
    {
      name: 'K. Meenakshi, Adv.',
      role: 'counsellor' as UserRole,
      department: 'District Legal Services Authority (DLSA)',
      email: 'k.meenakshi@dlsa.gov.in',
      district: 'Coimbatore',
      badgeId: 'OFF-DLSA-1904',
      title: 'Legal Aid Counsel',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const selectedPersona = officialPersonas.find((p) => p.email === email);
      const res = loginAsProfessional({
        email,
        password,
        role,
        displayName: selectedPersona?.name || (role === 'counsellor' ? 'Dr. Anita Sharma, M.Phil' : 'S. K. Verma, IAS'),
        department: selectedPersona?.department || (role === 'counsellor' ? 'District Mental Health Program (DMHP)' : 'District Protection Officer'),
        district,
        badgeId,
      });

      setLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || t.auth.authFailed);
      }
    }, 250);
  };

  const handleSelectPersona = (p: (typeof officialPersonas)[0]) => {
    setEmail(p.email);
    setRole(p.role);
    setDistrict(p.district);
    setBadgeId(p.badgeId);
    setPassword('password123');
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
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 glass-card border border-emerald-500/15 px-2.5 py-1 rounded-lg text-slate-300">
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <select aria-label={t.nav.language} value={language} onChange={(e) => setLanguage(e.target.value as any)} className="bg-transparent text-slate-300 text-[11px] font-semibold outline-none">
                <option value="en">English</option><option value="ta">தமிழ்</option><option value="hi">हिन्दी</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5 glass-card border border-emerald-500/15 px-3 py-1 rounded-lg text-slate-300 font-semibold">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>{t.auth.officialAccess}</span>
            </div>
          </div>
        </div>

        {/* Main Official Card */}
        <div className="auth-card glass-card rounded-3xl p-7 sm:p-9 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.auth.officialAccess}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.auth.officialTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md mx-auto leading-relaxed">
              {t.auth.officialDescription}
            </p>
          </div>

          {/* Compliance & Security Audit Notice */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 mb-6 text-xs text-amber-950 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.auth.securityNotice}</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              {t.auth.securityDescription}
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{error}</p>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Prototype only: select a registered demo official below. This is not production SSO.
                </p>
              </div>
            </div>
          )}

          {/* 1-Click Official Persona Selection */}
          <div className="mb-6">
            <label className="text-[11px] font-bold text-slate-700 block mb-2">
              {t.auth.personaLabel}
            </label>
            <div className="space-y-2">
              {officialPersonas.map((p) => (
                <button
                  key={p.email}
                  type="button"
                  onClick={() => handleSelectPersona(p)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${
                    email === p.email
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-950 ring-1 ring-indigo-200 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {p.department} • <span className="font-semibold text-indigo-700">{p.district}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-1 rounded bg-white border border-slate-200 text-slate-600">
                    {p.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5" htmlFor="official-email">
                {t.auth.email}
              </label>
              <input
                id="official-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@dmhp.gov.in"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-medium text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5" htmlFor="official-role">
                  {t.auth.role}
                </label>
                <select
                  id="official-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                >
                  <option value="counsellor">Clinical Counsellor (DMHP)</option>
                  <option value="admin">Protection Officer (Social Justice)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5" htmlFor="official-district">
                  {t.auth.district}
                </label>
                <select
                  id="official-district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                >
                  <option value="Madurai">Madurai District</option>
                  <option value="Coimbatore">Coimbatore District</option>
                  <option value="Tirunelveli">Tirunelveli District</option>
                  <option value="Chennai">Chennai Central</option>
                  <option value="Thanjavur">Thanjavur District</option>
                  <option value="Dindigul">Dindigul District</option>
                  <option value="Salem">Salem District</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="official-password">
                  {t.auth.password}
                </label>
                <span className="text-[10px] text-slate-500">
                  {t.auth.demo}: <strong className="font-mono text-slate-700">password123</strong>
                </span>
              </div>
              <div className="relative">
                <input
                  id="official-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Official clearance passphrase"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-medium text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="submit-professional-login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span>Authenticating Department Token...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.auth.authenticate}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Portal Switch Link */}
          <div className="mt-7 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 text-[11px]">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Token: <strong className="font-mono text-slate-700">{badgeId}</strong></span>
            </div>
            <button
              type="button"
              onClick={onSwitchToVictim}
              className="text-teal-700 hover:text-teal-900 font-semibold transition flex items-center gap-1"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{t.auth.switchVictim}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
