import React from 'react';
import { Activity, Shield, Globe, ChevronDown, HeartHandshake } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface NavbarProps { currentView: string; onNavigate: (view: string) => void; }

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { currentUser, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleVictimNav = () => onNavigate(currentUser?.role === 'victim' ? 'victim' : 'victim-login');
  const handleProfessionalNav = () => onNavigate(currentUser && (currentUser.role === 'counsellor' || currentUser.role === 'admin') ? 'professional' : 'professional-login');
  const handleLogout = () => { logout(); onNavigate('landing'); };

  const activeVictim = ['victim','victim-login','checkin'].includes(currentView);
  const activeProfessional = ['professional','professional-login'].includes(currentView);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-500/10 bg-[#070E0B]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-3">
        <button onClick={() => onNavigate('landing')} className="flex items-center gap-3 text-left min-w-0">
          <div className="relative w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-emerald-400/20 to-emerald-950 flex items-center justify-center border border-emerald-300/30 shadow-[0_0_35px_-5px_rgba(52,211,153,.15)]">
            <Activity className="w-5 h-5 text-emerald-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">PSYNOVA</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-300 border border-emerald-300/20">SIH-26094</span>
            </div>
            <p className="text-[10px] tracking-wide text-slate-400 font-medium hidden sm:block">Trajectory Intelligence</p>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-1.5">
          <button onClick={() => onNavigate('professional')} className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition">{t.nav.cases}</button>
          <button onClick={() => onNavigate('professional')} className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition inline-flex items-center gap-1.5">
            {t.nav.alerts} <span className="px-1.5 py-0.5 text-[10px] font-mono bg-rose-500/15 text-rose-300 border border-rose-500/25 rounded-full">3</span>
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-300" />
            <select aria-label={t.nav.language} value={language} onChange={(e) => setLanguage(e.target.value as any)} className="bg-white/5 text-slate-300 px-2 py-1.5 rounded-lg border border-slate-700/60 text-[11px] font-semibold outline-none cursor-pointer">
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          <button onClick={handleVictimNav} className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition ${activeVictim ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200' : 'border-slate-700/60 bg-white/5 text-slate-300 hover:bg-white/10'}`}>
            <HeartHandshake className="w-4 h-4 text-emerald-300" /><span>{t.nav.victimPortal}</span>
          </button>
          <button onClick={handleProfessionalNav} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition ${activeProfessional ? 'bg-gradient-to-r from-emerald-300 to-emerald-500 text-[#07130f]' : 'bg-gradient-to-r from-emerald-300 to-emerald-500 text-[#07130f] hover:brightness-110'} shadow-[0_0_35px_-5px_rgba(52,211,153,.15)]`}>
            <Shield className="w-4 h-4" /><span>{currentUser && (currentUser.role === 'counsellor' || currentUser.role === 'admin') ? t.nav.professionalPortal : t.nav.login}</span>
          </button>

          {currentUser && (
            <div className="relative group hidden xl:block">
              <button className="flex items-center gap-2 text-xs bg-white/5 text-slate-300 px-3 py-2 rounded-lg border border-slate-700/60">
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
                <span className="font-semibold max-w-[110px] truncate">{currentUser.displayName || currentUser.caseId || 'User'}</span><ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute right-0 mt-1 w-56 glass-card rounded-xl shadow-xl py-2 hidden group-hover:block z-50">
                <div className="px-3 py-2 border-b border-white/5"><div className="text-xs font-bold text-white truncate">{currentUser.displayName}</div><div className="text-[10px] text-slate-500">{currentUser.role}</div></div>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10">{t.nav.logout}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
