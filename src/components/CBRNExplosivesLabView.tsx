import React, { useState } from 'react';
import {
  Radiation,
  Flame,
  ShieldAlert,
  ShieldCheck,
  Building,
  CheckCircle2,
  FileCheck2,
  Plus,
  Send,
  Lock,
  Activity,
} from 'lucide-react';
import { phase14Service } from '../services/phase14Service';
import { CBRNExplosivesLabRecord } from '../types';

export const CBRNExplosivesLabView: React.FC = () => {
  const [records, setRecords] = useState<CBRNExplosivesLabRecord[]>(phase14Service.getCBRNRecords());
  const [selectedRecord, setSelectedRecord] = useState<CBRNExplosivesLabRecord>(records[0] || null);
  const [isNewAnalysisModalOpen, setIsNewAnalysisModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [incidentRef, setIncidentRef] = useState<string>('BLAST-SITE-2026-MUM-012');
  const [threatType, setThreatType] = useState<
    'HIGH_EXPLOSIVE_MILITARY' | 'RADIOLOGICAL_ISOTOPE' | 'CHEMICAL_TOXIN' | 'BIOLOGICAL_PATHOGEN'
  >('HIGH_EXPLOSIVE_MILITARY');
  const [substance, setSubstance] = useState<string>(
    'Plastic Explosive Composition C-4 (RDX 91% with Polyisobutylene binder)'
  );
  const [radiationScore, setRadiationScore] = useState<string>(
    'Detonation Velocity: 8,092 m/s; High Thermal Output (Peak Overpressure: 42.5 bar)'
  );
  const [vaultCell, setVaultCell] = useState<string>('HERMETIC-VAULT-CELL-A1 (Explosive Containment)');
  const [scientistName, setScientistName] = useState<string>(
    'Dr. K. S. Narayanan (Joint Director, Forensic Chemistry, NFSU)'
  );

  const handleCreateAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await phase14Service.createCBRNRecord({
      incidentReference: incidentRef,
      threatType,
      substanceIdentified: substance,
      spectroscopyGcMsSpectrumSha256: '887766554433221100aabbccddeeff0011223344556677889900aabbccddeeff',
      radiationOrToxicityScore: radiationScore,
      accreditationAuthority: 'NFSU_NATIONAL_FORENSIC_SCIENCES_UNIVERSITY',
      hermeticVaultStorageCell: vaultCell,
      chiefScientistExaminer: scientistName,
      chainOfCustodyVerified: true,
    });

    const updated = phase14Service.getCBRNRecords();
    setRecords(updated);
    setSelectedRecord(created);
    setIsNewAnalysisModalOpen(false);
    setToastMessage(`CBRN & Explosive Forensic Certificate #${created.analysisId} generated under Section 63 BSA`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/80 border border-red-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Radiation className="w-48 h-48 text-red-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/40 rounded uppercase tracking-wider">
                DRDO CFEES & NFSU Certified
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded uppercase tracking-wider">
                CBRN & Post-Blast Forensics
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Radiation className="w-6 h-6 text-red-400" />
              CBRN & Military Explosives Forensic Lab Grid
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Accredited chemical, biological, radiological, and military-grade explosive residue spectroscopy (GC-MS,
              FTIR, Raman), Hermetic Blast Vault chain-of-custody, and Section 63 BSA judicial certification.
            </p>
          </div>

          <button
            onClick={() => setIsNewAnalysisModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-red-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Record CBRN Forensic Examination</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-red-950/90 border border-red-500/60 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-red-300 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Analyses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-400" />
              CBRN Lab Dockets ({records.length})
            </h2>
          </div>

          <div className="space-y-3">
            {records.map((item) => {
              const isSelected = selectedRecord?.analysisId === item.analysisId;

              return (
                <div
                  key={item.analysisId}
                  onClick={() => setSelectedRecord(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-red-500/60 ring-1 ring-red-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-red-400">{item.analysisId}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-red-500/15 text-red-300 border-red-500/30">
                      {item.threatType.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1 line-clamp-2">{item.substanceIdentified}</div>
                  <div className="text-xs text-slate-400 mb-2">Incident: {item.incidentReference}</div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Accreditation:</span>
                    <span className="font-semibold text-emerald-400">{item.accreditationAuthority.split('_')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Spectrogram & Hermetic Vault Status */}
        {selectedRecord && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30 rounded">
                    {selectedRecord.accreditationAuthority.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{selectedRecord.substanceIdentified}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Chief Examiner: <span className="text-slate-200">{selectedRecord.chiefScientistExaminer}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-right">
                  <div className="text-[11px] text-slate-400">Hermetic Storage Vault</div>
                  <div className="text-xs font-mono font-bold text-amber-400 mt-1">
                    {selectedRecord.hermeticVaultStorageCell}
                  </div>
                </div>
              </div>

              {/* Toxicity / Blast Dynamics */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400">Detonation Dynamics & Brisance Score:</span>
                <div className="font-semibold text-red-300">{selectedRecord.radiationOrToxicityScore}</div>
              </div>
            </div>

            {/* GC-MS Spectrum & Chain of Custody */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    GC-MS Chromatography Spectrum Hash
                  </h4>
                  <span className="text-xs font-mono text-cyan-300">Raw Spectrum</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-cyan-400 break-all">
                  {selectedRecord.spectroscopyGcMsSpectrumSha256}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    Hermetic Vault Chain-of-Custody
                  </h4>
                  <span className="text-xs text-emerald-400 font-semibold">Verified</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Hazardous sample stored in dual-sealed argon containment under -20°C temperature control. Continuous RFID
                  weight sensor logging active.
                </p>
              </div>
            </div>

            {/* Evidentiary Certificate Hash */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Section 63 BSA 2023 Evidentiary Certificate Hash
                </h4>
                <span className="text-[11px] font-mono text-emerald-400">Court Admissible</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 break-all">
                {selectedRecord.courtEvidentiaryCertificateBSA63Sha256}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Record CBRN Examination */}
      {isNewAnalysisModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Radiation className="w-5 h-5 text-red-400" />
                Record CBRN / Explosive Forensic Examination
              </h3>
              <button
                onClick={() => setIsNewAnalysisModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateAnalysis} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Incident Reference Number</label>
                <input
                  type="text"
                  required
                  value={incidentRef}
                  onChange={(e) => setIncidentRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Threat Classification</label>
                <select
                  value={threatType}
                  onChange={(e) =>
                    setThreatType(
                      e.target.value as
                        | 'HIGH_EXPLOSIVE_MILITARY'
                        | 'RADIOLOGICAL_ISOTOPE'
                        | 'CHEMICAL_TOXIN'
                        | 'BIOLOGICAL_PATHOGEN'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="HIGH_EXPLOSIVE_MILITARY">Military-Grade High Explosive (RDX / PETN / TNT)</option>
                  <option value="RADIOLOGICAL_ISOTOPE">Radiological Isotope (Dirty Bomb Precursor)</option>
                  <option value="CHEMICAL_TOXIN">Chemical Weapon Agent / Precursor (CWC Schedule)</option>
                  <option value="BIOLOGICAL_PATHOGEN">Biological Pathogen / Toxin</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Identified Substance Details</label>
                <input
                  type="text"
                  required
                  value={substance}
                  onChange={(e) => setSubstance(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Radiation / Detonation Velocity Score</label>
                <input
                  type="text"
                  required
                  value={radiationScore}
                  onChange={(e) => setRadiationScore(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Chief Scientist Examiner</label>
                <input
                  type="text"
                  required
                  value={scientistName}
                  onChange={(e) => setScientistName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewAnalysisModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Sign Forensic Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
