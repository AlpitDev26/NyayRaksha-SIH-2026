import React, { useState } from 'react';
import {
  Activity,
  Globe2,
  Radio,
  ShieldAlert,
  Building,
  CheckCircle2,
  FileCheck2,
  Plus,
  Send,
  Lock,
  Search,
  PhoneCall,
  Plane,
  Coins,
} from 'lucide-react';
import { phase15Service } from '../services/phase15Service';
import { NATGRIDThreatMatrixRecord } from '../types';

export const NATGRIDThreatMatrixView: React.FC = () => {
  const [threats, setThreats] = useState<NATGRIDThreatMatrixRecord[]>(phase15Service.getNATGRIDThreats());
  const [selectedThreat, setSelectedThreat] = useState<NATGRIDThreatMatrixRecord>(threats[0] || null);
  const [isNewThreatModalOpen, setIsNewThreatModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [suspectName, setSuspectName] = useState<string>(
    'Harpreet @ Happy Sanghera (Trans-National Syndicate Operative)'
  );
  const [threatLevel, setThreatLevel] = useState<
    'CRITICAL_NATIONAL_SECURITY' | 'HIGH_PRIORITY_INTERPOL' | 'ORGANIZED_CRIME_TERROR_NEXUS'
  >('CRITICAL_NATIONAL_SECURITY');
  const [interpolNotice, setInterpolNotice] = useState<
    'RED_CORNER_NOTICE' | 'BLUE_NOTICE' | 'SPECIAL_INTERPOL_MHA_REQUEST'
  >('RED_CORNER_NOTICE');
  const [leadAgency, setLeadAgency] = useState<
    'NATIONAL_INVESTIGATION_AGENCY_NIA' | 'INTELLIGENCE_BUREAU_IB' | 'RESEARCH_AND_ANALYSIS_WING_RAW'
  >('NATIONAL_INVESTIGATION_AGENCY_NIA');

  const handleCreateThreat = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await phase15Service.createNATGRIDThreat({
      suspectOrSyndicateName: suspectName,
      threatLevel,
      interpolNoticeType: interpolNotice,
      passportOrBiometricHash: '44556677889900aabbccddeeff0011223344556677889900aabbccddeeff001122',
      natgridFusionFeeds: {
        immigrationBureauRecord: 'Lookout Circular (LOC) active across all 32 Indian International Immigration Checkposts',
        fiuSuspiciousRemittanceRef: 'Hawala cash layer flagged via overseas shell accounts in Canada and UAE',
        telecomGeofenceTowerLocation: 'VoIP encrypted proxy call route intercepted by National Intelligence Grid',
        ePrisonsIncarceratedAssociate: 'Associates in Bathinda & Nabha High-Security Jails placed under digital isolation',
      },
      interAgencyConsensusStatus: 'INTERCEPTION_WARRANT_ISSUED',
      leadAgency,
    });

    const updated = phase15Service.getNATGRIDThreats();
    setThreats(updated);
    setSelectedThreat(created);
    setIsNewThreatModalOpen(false);
    setToastMessage(`NATGRID Counter-Terrorism Intelligence Docket #${created.threatId} dispatched to MAC Multi-Agency Centre`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-indigo-950/80 border border-rose-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Globe2 className="w-48 h-48 text-rose-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded uppercase tracking-wider">
                NATGRID 2.0 Multi-Agency Centre
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded uppercase tracking-wider">
                NIA Act 2008 & Sec 94 BNSS
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Globe2 className="w-6 h-6 text-rose-400" />
              National Counter-Terrorism & NATGRID Intelligence Fusion Grid
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Cross-correlation across Immigration (BOI), Financial (FIU-IND), Telecom Geofence, ePrisons, and INTERPOL
              Red Corner notices with Section 94 BNSS judicial interception warrants.
            </p>
          </div>

          <button
            onClick={() => setIsNewThreatModalOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Generate NATGRID Threat Docket</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-rose-950/90 border border-rose-500/60 text-rose-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-rose-300 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Threats List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Intelligence Fusion Dockets ({threats.length})
            </h2>
          </div>

          <div className="space-y-3">
            {threats.map((threat) => {
              const isSelected = selectedThreat?.threatId === threat.threatId;

              return (
                <div
                  key={threat.threatId}
                  onClick={() => setSelectedThreat(threat)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-rose-500/60 ring-1 ring-rose-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-rose-400">{threat.threatId}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-rose-500/15 text-rose-300 border-rose-500/30">
                      {threat.threatLevel.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1 line-clamp-2">{threat.suspectOrSyndicateName}</div>
                  <div className="text-xs text-slate-400 mb-2">Lead Agency: {threat.leadAgency.replace(/_/g, ' ')}</div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Notice:</span>
                    <span className="font-bold text-amber-400">{threat.interpolNoticeType?.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Fusion Feeds */}
        {selectedThreat && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded">
                    {selectedThreat.interpolNoticeType?.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{selectedThreat.suspectOrSyndicateName}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Multi-Agency Status:{' '}
                    <span className="text-emerald-400 font-semibold">
                      {selectedThreat.interAgencyConsensusStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-right">
                  <div className="text-[11px] text-slate-400">Lead Task Force</div>
                  <div className="text-xs font-bold text-white mt-1">{selectedThreat.leadAgency.replace(/_/g, ' ')}</div>
                </div>
              </div>
            </div>

            {/* 4 Multi-Agency Fusion Feeds */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold pb-1 border-b border-slate-800">
                  <Plane className="w-4 h-4 text-indigo-400" />
                  Bureau of Immigration (BOI) Feed
                </div>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800">
                  {selectedThreat.natgridFusionFeeds.immigrationBureauRecord}
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-semibold pb-1 border-b border-slate-800">
                  <Coins className="w-4 h-4 text-amber-400" />
                  FIU-IND Suspicious Remittances
                </div>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800">
                  {selectedThreat.natgridFusionFeeds.fiuSuspiciousRemittanceRef}
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold pb-1 border-b border-slate-800">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  Telecom Tower Geofence Intercept
                </div>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800">
                  {selectedThreat.natgridFusionFeeds.telecomGeofenceTowerLocation}
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-rose-300 font-semibold pb-1 border-b border-slate-800">
                  <PhoneCall className="w-4 h-4 text-rose-400" />
                  ePrisons Incarcerated Network Trace
                </div>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800">
                  {selectedThreat.natgridFusionFeeds.ePrisonsIncarceratedAssociate}
                </p>
              </div>
            </div>

            {/* Section 94 BNSS Judicial Warrant Hash */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Section 94 BNSS Judicial Interception Warrant Digital Seal
                </h4>
                <span className="text-[11px] font-mono text-emerald-400">BSA 63 Sealed</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-rose-400 break-all">
                {selectedThreat.judicialWarrantSec94BNSSSha256}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: New NATGRID Threat */}
      {isNewThreatModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-rose-400" />
                Generate NATGRID Counter-Terrorism Intelligence Docket
              </h3>
              <button
                onClick={() => setIsNewThreatModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateThreat} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Suspect / Syndicate Name</label>
                <input
                  type="text"
                  required
                  value={suspectName}
                  onChange={(e) => setSuspectName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Threat Level</label>
                <select
                  value={threatLevel}
                  onChange={(e) =>
                    setThreatLevel(
                      e.target.value as
                        | 'CRITICAL_NATIONAL_SECURITY'
                        | 'HIGH_PRIORITY_INTERPOL'
                        | 'ORGANIZED_CRIME_TERROR_NEXUS'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="CRITICAL_NATIONAL_SECURITY">Critical National Security / Armed Insurgency</option>
                  <option value="HIGH_PRIORITY_INTERPOL">High Priority INTERPOL Red Notice Target</option>
                  <option value="ORGANIZED_CRIME_TERROR_NEXUS">Organized Crime & Narco-Terror Nexus (Sec 111 BNS)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">INTERPOL Notice / MHA Request</label>
                <select
                  value={interpolNotice}
                  onChange={(e) =>
                    setInterpolNotice(
                      e.target.value as
                        | 'RED_CORNER_NOTICE'
                        | 'BLUE_NOTICE'
                        | 'SPECIAL_INTERPOL_MHA_REQUEST'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="RED_CORNER_NOTICE">INTERPOL Red Corner Notice (Arrest & Extradition)</option>
                  <option value="BLUE_NOTICE">INTERPOL Blue Notice (Location Identification)</option>
                  <option value="SPECIAL_INTERPOL_MHA_REQUEST">Special MHA Judicial Reference</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Lead Investigating Agency</label>
                <select
                  value={leadAgency}
                  onChange={(e) =>
                    setLeadAgency(
                      e.target.value as
                        | 'NATIONAL_INVESTIGATION_AGENCY_NIA'
                        | 'INTELLIGENCE_BUREAU_IB'
                        | 'RESEARCH_AND_ANALYSIS_WING_RAW'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="NATIONAL_INVESTIGATION_AGENCY_NIA">National Investigation Agency (NIA)</option>
                  <option value="INTELLIGENCE_BUREAU_IB">Intelligence Bureau (IB / MAC Fusion)</option>
                  <option value="RESEARCH_AND_ANALYSIS_WING_RAW">Research & Analysis Wing (R&AW)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewThreatModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Transmit to Multi-Agency Centre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
