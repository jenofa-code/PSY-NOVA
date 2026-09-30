import React, { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, Brain, Ear, HeartHandshake, Lock, ShieldCheck, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { CaseRecord } from '../../types';

interface LandingPageProps { onNavigate: (view: string) => void; }

const pipeline = [
  ['01','Listen','Trauma-informed self-reports & gentle check-ins','Multi-modal intake'],
  ['02','Analyze','Cross-signal feature extraction: language, prosody, acoustic stability and case context.','NLP & speech prosody'],
  ['03','Track','Longitudinal trajectory modelling detects accelerating distress before thresholds breach.','Velocity & acceleration curves'],
  ['04','Predict','Prototype forecasting explores possible near-term escalation windows.','Early distress warning'],
  ['05','Explain','Explainable drivers show the contributing signals behind each alert.','Transparent driver weights'],
  ['06','Support','Closed-loop human follow-up routes authorised professionals to the next action.','Human review & escalation'],
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [cases, setCases] = useState<CaseRecord[]>([]);

  useEffect(() => {
    setCases(storageService.getCases());
    return storageService.subscribe(() => setCases(storageService.getCases()));
  }, []);

  const monitor = useMemo(() => {
    const candidate = cases.find(c => c.currentDistressScore >= 60 && (c.trajectory === 'worsening' || c.trajectory === 'rapidly_worsening')) || cases[0];
    return candidate;
  }, [cases]);

  const score = monitor?.currentDistressScore ?? 73;
  const risk = monitor?.riskLevel ?? 'high';
  const trend = monitor?.history?.map(h => h.distressScore) ?? [32,47,61,73];
  const delta = monitor ? monitor.currentDistressScore - monitor.previousDistressScore : 18;
  const badge = risk === 'critical' ? 'CRITICAL' : risk === 'high' ? 'ELEVATED' : risk.toUpperCase();

  const handleVictim = () => onNavigate(currentUser?.role === 'victim' ? 'victim' : 'victim-login');
  const handleOfficer = () => onNavigate(currentUser && (currentUser.role === 'counsellor' || currentUser.role === 'admin') ? 'professional' : 'professional-login');

  return (
    <div className="stitch-grid min-h-screen text-slate-200">
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center">
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-950/40 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-xs font-medium text-emerald-200 tracking-wide">Smart India Hackathon 2026 • PS SIH26094 | Prototype • Synthetic Data</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[4.35rem] font-extrabold tracking-tight text-white leading-[1.05]">
                Don't wait for the crisis.<br />Detect the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300">trajectory.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                PSYNOVA combines self-reported check-ins, language cues, experimental acoustic features, engagement continuity, case context, and longitudinal change into an explainable prototype distress indicator — with trained human review kept in front of every consequential decision.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <button onClick={handleOfficer} className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-300 to-emerald-500 text-[#07130f] hover:brightness-110 transition flex items-center gap-2.5 shadow-[0_0_45px_-8px_rgba(16,185,129,.25)]">
                  <Activity className="w-4 h-4" /> Open Officer Dashboard <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={handleVictim} className="px-5 py-3.5 rounded-xl font-medium text-sm border border-emerald-500/20 bg-emerald-950/30 text-white hover:bg-emerald-900/30 transition flex items-center gap-2.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-300" /> Victim Experience
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" /></span>
                Human-in-the-Loop Protocol: AI watches velocity; certified counsellors authorize clinical action.
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="glass-card rounded-2xl p-5 sm:p-6 shadow-2xl border border-emerald-500/20">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" /><span className="text-xs font-mono font-semibold tracking-wider text-slate-300">LIVE MONITOR</span></div>
                  <div className="text-[10px] font-mono text-slate-400">{monitor?.caseId ?? 'VICTIM_PSY-1024'} • <span className="text-emerald-300">Day {monitor?.totalCheckIns ? monitor.totalCheckIns * 7 : 28}</span></div>
                </div>
                <div className="grid grid-cols-12 gap-4 my-5 items-center">
                  <div className="col-span-5 flex flex-col items-center justify-center p-3 rounded-xl bg-black/25 border border-emerald-500/10">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#123128" strokeWidth="3.5" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F59E0B" strokeDasharray={`${score},100`} strokeLinecap="round" strokeWidth="3.5" />
                      </svg>
                      <div className="absolute flex flex-col items-center"><span className="text-2xl font-black text-white font-mono">{score}</span><span className="text-[9px] font-bold text-amber-400 tracking-wider">{badge}</span></div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-2">Distress Velocity: {delta >= 0 ? '+' : ''}{delta}%</span>
                  </div>
                  <div className="col-span-7 pl-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2"><span>DISTRESS TREND</span><span className="text-amber-400 font-semibold">30-DAY ESCALATION</span></div>
                    <div className="h-20 relative">
                      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 80">
                        <line opacity=".45" stroke="#FB7185" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="200" y1="26" y2="26" />
                        <polyline fill="none" stroke="#F59E0B" strokeLinecap="round" strokeWidth="2.5" points={trend.map((v,i) => `${(i/Math.max(1,trend.length-1))*180},${76-(v*.62)}`).join(' ')} />
                      </svg>
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-slate-500"><span>Baseline</span><span>Current</span></div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    ['Self-report Check-ins', Math.min(95, Math.max(45, score - 5)), 'bg-amber-400'],
                    ['Text Emotion & Semantics', Math.min(92, Math.max(48, score + 3)), 'bg-rose-400'],
                    ['Behavioural Regularity', Math.min(88, Math.max(42, score - 2)), 'bg-amber-400'],
                    ['Case Events & Court Summons Stress', Math.min(84, Math.max(35, score - 15)), 'bg-emerald-300'],
                  ].map(([label,value,color]) => (
                    <div key={String(label)}><div className="flex justify-between text-[10px] font-mono mb-1"><span className="text-slate-300">{label}</span><span className="text-slate-400">{value}%</span></div><div className="h-1.5 rounded-full bg-[#10241d] overflow-hidden"><div className={`h-full rounded-full ${color}`} style={{width:`${value}%`}} /></div></div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shrink-0"><Zap className="w-4 h-4 text-amber-400" /></div>
                  <div className="min-w-0"><div className="text-xs font-semibold text-white">Human review triggered</div><div className="text-[10px] text-slate-400 mt-0.5">Explainable early-warning alert routed for professional review.</div></div>
                  <button onClick={handleOfficer} className="ml-auto shrink-0 px-3 py-1.5 rounded-md bg-amber-400 text-[#1c1303] text-[10px] font-bold">Inspect</button>
                </div>
                <div className="text-center text-[9px] font-mono text-slate-500 mt-4">Synthetic anonymized stream • Non-diagnostic prototype</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-emerald-500/10 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10"><p className="text-[11px] font-mono font-semibold uppercase tracking-[.22em] text-emerald-300">End-to-End Architecture</p><h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">The 6-Stage Trajectory Pipeline</h2><p className="text-sm text-slate-400 mt-2 max-w-2xl mx-auto">From subtle behavioural shifts to calibrated human intervention, ensuring dignity, speed, and mathematical transparency.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pipeline.map(([num,title,desc,tag]) => <div key={num} className="glass-card glass-card-interactive rounded-2xl p-5 min-h-[190px] flex flex-col">
              <div className="w-9 h-9 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 font-mono text-xs font-semibold flex items-center justify-center mb-6">{num}</div>
              <h3 className="text-base font-bold text-white">{title}</h3><p className="text-xs text-slate-400 leading-relaxed mt-2 flex-1">{desc}</p><div className="pt-3 mt-4 border-t border-white/5 text-[10px] font-mono text-emerald-300">{tag}</div>
            </div>)}
          </div>
        </div>
      </section>

      <section className="py-10 border-b border-emerald-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[9px] font-mono uppercase tracking-wider text-slate-500">
          <span className="inline-flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Built to meet people in their own language</span><span>•</span><span>Zero stigma architecture</span><span>•</span><span>Privacy-aware design • DPDPA/DISHA considerations</span>
        </div>
      </section>

      <footer className="py-5"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-slate-500"><span><strong className="text-slate-200">PSYNOVA</strong> &nbsp;•&nbsp; Dynamic Mental Health Monitoring & Trajectory Detection</span><div className="flex gap-5"><span>Data Governance & DPDPA</span><span>Human-in-the-Loop Protocol</span><span>SIH 2026 — PS SIH26094</span></div></div></footer>
    </div>
  );
};
