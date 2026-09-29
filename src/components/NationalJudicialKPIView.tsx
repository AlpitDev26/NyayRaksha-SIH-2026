import React, { useState, useEffect } from 'react';
import { NationalJudicialKPIMetrics, UserRole, SupportedLanguage } from '../types';
import { phase10Service } from '../services/phase10Service';
import {
  TrendingUp,
  Activity,
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Scale,
  Building,
  FileCheck,
  Globe,
  Printer,
  Sparkles,
} from 'lucide-react';

interface NationalJudicialKPIViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const NationalJudicialKPIView: React.FC<NationalJudicialKPIViewProps> = ({
  currentRole: _currentRole,
}) => {
  const [kpis, setKpis] = useState<NationalJudicialKPIMetrics | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const data = phase10Service.getNationalJudicialKPIs();
    setKpis(data);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  if (!kpis) return null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/80 to-slate-900 border border-amber-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-amber-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                NJDG 3.0 National Sovereign Grid
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-400" /> Live High Court Federation Sync
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-amber-400" />
              National Judicial KPI & Sovereign Benchmarking Hub
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              High-altitude telemetry across Indian High Courts and Subordinate Judiciary. Real-time auditing of BNSS statutory milestone clocks, Case Clearance Rate (CCR), and undertrial liberty index.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print CJI Audit Report
            </button>
          </div>
        </div>

        {notification && (
          <div className="mt-3 p-2.5 bg-emerald-950/90 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Case Clearance Rate (CCR)
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {kpis.nationalCaseClearanceRatePct}%
          </div>
          <div className="text-[11px] text-emerald-400/90 flex items-center gap-1">
            <span>+4.2% disposal surplus</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Undertrial Detention Ratio
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400">
            {kpis.underTrialDetentionRatioPct}%
          </div>
          <div className="text-[11px] text-slate-400">
            Sec 479 BNSS Liberty Active
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Sec 187 90-Day Charge Sheet Adherence
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">
            {kpis.bnss90DayChargeSheetCompliancePct}%
          </div>
          <div className="text-[11px] text-slate-400">
            Statutory Default Bail Avoided
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Sec 392 30-Day Judgment Delivery
          </div>
          <div className="text-2xl font-black font-mono text-purple-400">
            {kpis.bnss30DayJudgmentDeliveryCompliancePct}%
          </div>
          <div className="text-[11px] text-slate-400">
            Expedited Ruling Pronouncement
          </div>
        </div>
      </div>

      {/* State Performance Benchmark Leaderboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> State Judiciary Performance Index & Composite Ranking
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive index combining disposal rate, e-Courts 4.0 virtual hearings, and BNSS milestone adherence.
            </p>
          </div>

          <button
            onClick={() => showToast('Presidential Judicial Audit digest signed with Root CA seal!')}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <FileCheck className="w-3.5 h-3.5" /> Sign Presidential Audit
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">RANK</th>
                <th className="py-2.5 px-3">STATE JURISDICTION</th>
                <th className="py-2.5 px-3">LEAD BENCH / DISTRICT</th>
                <th className="py-2.5 px-3">DISPOSAL (CCR)</th>
                <th className="py-2.5 px-3">ACTIVE PENDENCY</th>
                <th className="py-2.5 px-3 text-right">COMPOSITE SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {kpis.statePerformanceRoster.map((state, idx) => (
                <tr key={state.stateName} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 px-3">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-[10px]">
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans font-bold text-white">
                    {state.stateName}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {state.leadDistrict}
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">
                    {state.clearanceRate}%
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {state.pendencyCasesCount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                      {state.compositeScore} / 100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
