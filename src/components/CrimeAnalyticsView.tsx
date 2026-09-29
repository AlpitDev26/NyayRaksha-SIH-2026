import React, { useState } from 'react';
import { SupportedLanguage, CrimeHotspotItem, StatutoryCustodyClock } from '../types';
import { icjsService } from '../services/icjsService';
import {
  MapPin,
  TrendingUp,
  Clock,
  AlertTriangle,
  Flame,
  ShieldAlert,
  BarChart3,
  Layers,
  Search,
  CheckCircle,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';

interface CrimeAnalyticsViewProps {
  language: SupportedLanguage;
  onNavigateToCase?: (caseNumber: string) => void;
}

export const CrimeAnalyticsView: React.FC<CrimeAnalyticsViewProps> = ({
  language: _language,
  onNavigateToCase: _onNavigateToCase,
}) => {
  const [hotspots] = useState<CrimeHotspotItem[]>(icjsService.getHotspots());
  const [custodyClocks] = useState<StatutoryCustodyClock[]>(icjsService.getCustodyClocks());
  const [selectedHotspot, setSelectedHotspot] = useState<CrimeHotspotItem | null>(hotspots[0] || null);
  const [activeTab, setActiveTab] = useState<'hotspots' | 'custody_clocks' | 'syndicates'>('hotspots');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredHotspots =
    filterCategory === 'ALL'
      ? hotspots
      : hotspots.filter((h) => h.crimeCategory === filterCategory);

  const getSeverityBadge = (severity: CrimeHotspotItem['riskSeverity']) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold font-mono flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-400" />
            CRITICAL HOTSPOT
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold font-mono">
            ELEVATED RISK
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold font-mono">
            MODERATE
          </span>
        );
    }
  };

  const getCustodyStatusBadge = (status: StatutoryCustodyClock['status']) => {
    switch (status) {
      case 'CRITICAL_48_HOURS':
        return (
          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold animate-pulse flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            CRITICAL (&lt; 72H TO DEFAULT BAIL)
          </span>
        );
      case 'WARNING_7_DAYS':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            WARNING (&lt; 7 DAYS)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            COMPLIANT TIMELINE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-rose-500/30 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40">
                <TrendingUp className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  National Crime Analytics & Section 187 BNSS Custody Clocks
                  <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono">
                    NATIONAL GRID INTEL
                  </span>
                </h1>
                <p className="text-xs text-slate-300">
                  Cross-Commissionerates Modus Operandi Clustering, Geospatial Offense Hotspots & Statutory Default Bail Countdown Watchdog
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-right">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Section 187 BNSS Default Clock</span>
              <span className="text-xs font-mono font-bold text-rose-400">1 Case Nearing 90-Day Limit</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 mt-5 gap-1">
          <button
            onClick={() => setActiveTab('hotspots')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'hotspots'
                ? 'bg-slate-800 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Geospatial Crime Hotspots ({hotspots.length})
          </button>
          <button
            onClick={() => setActiveTab('custody_clocks')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'custody_clocks'
                ? 'bg-slate-800 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sec 187 BNSS Custody Clocks ({custodyClocks.length})
          </button>
          <button
            onClick={() => setActiveTab('syndicates')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'syndicates'
                ? 'bg-slate-800 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Modus Operandi & Syndicate Clustering
          </button>
        </div>
      </div>

      {/* Hotspots Tab */}
      {activeTab === 'hotspots' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List of Hotspots */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="ALL">All Offense Categories</option>
                  <option value="CYBER_FINANCIAL_FRAUD">Cyber Financial Fraud</option>
                  <option value="WHITE_COLLAR_CORRUPTION">White Collar & Shell Companies</option>
                  <option value="NARCOTICS_TRAFFICKING">Narcotics & Border Smuggling</option>
                </select>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Last 90 Days Aggregation</span>
            </div>

            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {filteredHotspots.map((h) => {
                const isSelected = selectedHotspot?.id === h.id;
                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHotspot(h)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-950/30 border-rose-500/50 shadow-lg'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-400" />
                        <span className="font-bold text-sm text-white">{h.district}, {h.state}</span>
                      </div>
                      {getSeverityBadge(h.riskSeverity)}
                    </div>

                    <p className="text-xs text-slate-300 font-medium">{h.policeStation}</p>
                    <p className="text-[11px] text-slate-400 mt-1 truncate">{h.topModusOperandi}</p>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px]">
                      <div>
                        <span className="text-slate-500 text-[10px]">90-Day Incidents:</span>
                        <div className="font-mono text-white font-bold">{h.incidentCountPast90Days} cases</div>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px]">Clearance Rate:</span>
                        <div className="font-mono text-emerald-400 font-bold">{h.resolvedRatePercent}%</div>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px]">Syndicates:</span>
                        <div className="font-mono text-amber-300 font-semibold">{h.activeSyndicates.length} rings</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hotspot Geospatial Detail Panel */}
          <div className="lg:col-span-6">
            {selectedHotspot ? (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-400">Jurisdictional Hotspot Profile</span>
                    <h3 className="text-base font-bold text-white">{selectedHotspot.district}, {selectedHotspot.state}</h3>
                  </div>
                  {getSeverityBadge(selectedHotspot.riskSeverity)}
                </div>

                <div className="space-y-4 text-xs">
                  {/* Simulated Map / Coordinates Card */}
                  <div className="relative h-44 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <div className="relative text-center p-4 space-y-2">
                      <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto animate-pulse">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="font-mono text-xs text-rose-300 font-bold">
                        Coordinates: {selectedHotspot.coordinates[0]}° N, {selectedHotspot.coordinates[1]}° E
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Jurisdiction: {selectedHotspot.policeStation}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px]">Primary Modus Operandi (MO)</span>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 font-medium mt-1">
                      {selectedHotspot.topModusOperandi}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px]">Identified Active Syndicates & Gangs</span>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {selectedHotspot.activeSyndicates.map((syn, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400">Total 90-Day Cases</span>
                      <div className="text-lg font-bold text-white font-mono mt-0.5">{selectedHotspot.incidentCountPast90Days}</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400">Prosecution Filing Rate</span>
                      <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{selectedHotspot.resolvedRatePercent}%</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
                Select a hotspot to view detailed crime intelligence and jurisdictional telemetry.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section 187 BNSS Custody Clocks Tab */}
      {activeTab === 'custody_clocks' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-rose-400" />
                  <span>Section 187 BNSS Custody Limitation Watchdog (Default Bail Countdown)</span>
                </h2>
                <p className="text-xs text-slate-300">
                  Statutory 60-day & 90-day investigation custody caps before statutory default bail right accrues to undertrial under BNSS Section 187(3)
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold">
                MANDATORY COMPLIANCE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {custodyClocks.map((c) => {
                const percentSpent = Math.min(100, Math.round((c.daysInCustody / c.statutoryLimitDays) * 100));
                return (
                  <div
                    key={c.caseId}
                    className={`p-4 rounded-xl border space-y-3 ${
                      c.status === 'CRITICAL_48_HOURS'
                        ? 'bg-rose-950/30 border-rose-500/50 shadow-lg'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">{c.caseNumber}</span>
                      {getCustodyStatusBadge(c.status)}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">{c.accusedName}</h3>
                      <div className="text-[11px] text-slate-400">
                        Arrest Date: {new Date(c.arrestTimestamp).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400">Custody Elapsed: {c.daysInCustody} days</span>
                        <span className="font-mono font-bold text-white">{c.statutoryLimitDays} Day Max Limit</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            percentSpent > 85 ? 'bg-rose-500 animate-pulse' : percentSpent > 60 ? 'bg-amber-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${percentSpent}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] pt-0.5">
                        <span className="text-slate-400">Remaining to Charge-Sheet:</span>
                        <span className={`font-mono font-bold ${c.remainingDays < 7 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {c.remainingDays} Days Left
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500 text-[10px]">Statutory Deadline:</span>
                        <span className="font-mono text-slate-200">{c.chargesheetFilingDeadline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 text-[10px]">Remand Expiry:</span>
                        <span className="font-mono text-amber-300">{c.magistrateRemandExpiryDate}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Syndicates Tab */}
      {activeTab === 'syndicates' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-rose-400" />
              <span>Multi-Jurisdiction Syndicate Correlation Graph</span>
            </h2>
            <p className="text-xs text-slate-300">
              Correlating transnational illicit financial flows, forged identities, and digital device fingerprints across State Police Commissionerates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-amber-400">GhostByte Racket</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono">14 Cases Linked</span>
              </div>
              <p className="text-[11px] text-slate-300">
                P2P USDT laundering syndicates targeting senior citizens via APK screen-sharing trojans.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                Hub: <strong>Delhi NCT, Gurugram, Kolkata</strong>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-indigo-400">Horizon Syndicate</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">9 Cases Linked</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Shell company invoicing and fake Director DIN allocations with off-shore wire transfers.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                Hub: <strong>Mumbai BKC, Dubai, Singapore</strong>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-400">Falcon Border Corridor</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono">22 Cases Linked</span>
              </div>
              <p className="text-[11px] text-slate-300">
                High-payload commercial narcotics drops utilizing GPS-programmed hexacopter drones.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                Hub: <strong>Amritsar Range, Tarn Taran, Jalandhar</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
