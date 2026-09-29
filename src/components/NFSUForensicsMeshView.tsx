import React, { useState, useEffect } from 'react';
import {
  NFSUCrimeSceneDispatchRecord,
  NFSUForensicSample,
  CaseFile,
  UserRole,
  SupportedLanguage,
  ForensicDiscipline,
} from '../types';
import { phase9Service } from '../services/phase9Service';
import { storageService } from '../services/storageService';
import {
  Microscope,
  Dna,
  Crosshair,
  FlaskConical,
  Smartphone,
  Truck,
  MapPin,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  PlusCircle,
  FileCheck,
  Sparkles,
  Barcode,
  Search,
  Activity,
  Layers,
} from 'lucide-react';

interface NFSUForensicsMeshViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const NFSUForensicsMeshView: React.FC<NFSUForensicsMeshViewProps> = ({
  currentRole: _currentRole,
}) => {
  const [dispatches, setDispatches] = useState<NFSUCrimeSceneDispatchRecord[]>([]);
  const [selectedDispatch, setSelectedDispatch] = useState<NFSUCrimeSceneDispatchRecord | null>(null);
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  // Dispatch Form State
  const [leadScientist, setLeadScientist] = useState('Dr. Vivek Sharma (CFSL/NFSU)');
  const [discipline, setDiscipline] = useState<ForensicDiscipline>('DNA_PROFILING');
  const [sampleType, setSampleType] = useState('Touch DNA Swab from weapon handle / steering wheel');
  const [collectionLocation, setCollectionLocation] = useState('Driver Seat Console / Dash');
  const [tempCelsius, setTempCelsius] = useState<number>(-20.0);
  const [isDispatching, setIsDispatching] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const list = phase9Service.getNFSUDispatches();
    setDispatches(list);
    if (list.length > 0) setSelectedDispatch(list[0]);
    const storedCases = storageService.getCases();
    setCases(storedCases);
    if (storedCases.length > 0) setSelectedCaseId(storedCases[0].id);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDispatchVan = async () => {
    const targetCase = cases.find((c) => c.id === selectedCaseId);
    if (!targetCase) return;

    setIsDispatching(true);
    try {
      const created = await phase9Service.dispatchNFSUCrimeSceneTeam(
        targetCase,
        leadScientist,
        discipline,
        sampleType,
        collectionLocation,
        tempCelsius
      );
      setDispatches([...phase9Service.getNFSUDispatches()]);
      setSelectedDispatch(created);
      showToast('NFSU Mobile Forensic Van Dispatched (Sec 176(3) BNSS Mandate Recorded)!');
    } catch (e: any) {
      showToast('Error: ' + e.message);
    } finally {
      setIsDispatching(false);
    }
  };

  const getDisciplineIcon = (d: ForensicDiscipline) => {
    switch (d) {
      case 'DNA_PROFILING':
        return <Dna className="w-4 h-4 text-emerald-400" />;
      case 'BALLISTICS_TOOLMARK':
        return <Crosshair className="w-4 h-4 text-amber-400" />;
      case 'TOXICOLOGY_GCMS':
        return <FlaskConical className="w-4 h-4 text-rose-400" />;
      case 'CYBER_MOBILE_EXTRACTION':
        return <Smartphone className="w-4 h-4 text-cyan-400" />;
      default:
        return <Microscope className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/80 to-slate-900 border border-teal-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-teal-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Section 176(3) BNSS 2023 Forensic Mandate
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Truck className="w-3 h-3 text-emerald-400" /> NFSU Mobile Van Telemetry
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <Microscope className="w-6 h-6 text-teal-400" />
              NFSU Multidisciplinary Forensic Mesh & Crime Scene Triage
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Mandatory forensic expert deployment for offenses punishable with 7+ years imprisonment under Sec 176(3) BNSS, integrated with cold-chain telemetry, automated CODIS STR DNA matching, 3D ballistics striation, and cyber flash memory dump extraction.
            </p>
          </div>
        </div>

        {notification && (
          <div className="mt-3 p-2.5 bg-emerald-950/90 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Van Dispatch Controller & Active Forensic Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dispatch Configurator & Samples */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-teal-400" /> Dispatch Mobile Forensic Van
              </span>
              <span className="text-[10px] text-teal-400 font-mono">Sec 176(3) 7+ Yrs</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Serious Crime Case:</label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.title.slice(0, 32)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Lead Forensic Scientist (NFSU/CFSL):</label>
                <input
                  type="text"
                  value={leadScientist}
                  onChange={(e) => setLeadScientist(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Forensic Discipline:</label>
                  <select
                    value={discipline}
                    onChange={(e: any) => setDiscipline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  >
                    <option value="DNA_PROFILING">DNA Profiling (CODIS STR)</option>
                    <option value="BALLISTICS_TOOLMARK">Ballistics & 3D Toolmarks</option>
                    <option value="TOXICOLOGY_GCMS">Toxicology (GC-MS/LC-MS)</option>
                    <option value="CYBER_MOBILE_EXTRACTION">Cyber & RAM Chip-Off</option>
                    <option value="FINGERPRINT_AFIS">Fingerprint (AFIS/NAFIS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Cold-Chain Temp (°C):</label>
                  <input
                    type="number"
                    step={1}
                    value={tempCelsius}
                    onChange={(e) => setTempCelsius(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Sample Description:</label>
                <input
                  type="text"
                  value={sampleType}
                  onChange={(e) => setSampleType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Crime Scene Micro-Location:</label>
                <input
                  type="text"
                  value={collectionLocation}
                  onChange={(e) => setCollectionLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <button
                disabled={isDispatching}
                onClick={handleDispatchVan}
                className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-950/50 transition-all cursor-pointer"
              >
                {isDispatching ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-teal-200" /> Dispatching Mobile Van...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-teal-200" /> Dispatch Van & Seal Evidence
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Crime Scene Lab Report & Forensic Spectra */}
        <div className="lg:col-span-7 space-y-4">
          {selectedDispatch ? (
            <div className="space-y-4">
              {/* Scene Dispatch Overview Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-300">
                        {selectedDispatch.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Sec 176(3) BNSS Verified
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white mt-1">
                      {selectedDispatch.laboratoryAssigned}
                    </h2>
                    <div className="text-xs text-slate-400">
                      Mobile Van: {selectedDispatch.mobileForensicVanId} | Lead Scientist: {selectedDispatch.leadForensicScientist}
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs">
                    <span className="text-slate-400 block text-[10px]">FSL Ref Number</span>
                    <span className="text-teal-400 font-bold">{selectedDispatch.fslRefNumber}</span>
                  </div>
                </div>

                {/* Samples Triage Stream */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    <span>Collected Forensic Exhibits ({selectedDispatch.samplesCollected.length})</span>
                    <span className="text-[10px] text-teal-400 font-mono">Cold-Chain Monitored</span>
                  </h4>

                  {selectedDispatch.samplesCollected.map((smpl) => (
                    <div
                      key={smpl.sampleId}
                      className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2">
                        <div className="flex items-center gap-2">
                          {getDisciplineIcon(smpl.discipline)}
                          <div>
                            <span className="text-xs font-bold text-white">{smpl.sampleType}</span>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Barcode: {smpl.barcode} | Location: {smpl.collectedLocation}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          {smpl.coldChainTempCelsius !== undefined && (
                            <span className="px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/40 text-[10px] font-mono flex items-center gap-1">
                              <Thermometer className="w-3 h-3 text-cyan-400" />
                              {smpl.coldChainTempCelsius}°C
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-mono">
                            {smpl.matchConfidenceScore}% Match
                          </span>
                        </div>
                      </div>

                      {/* Scientific Findings & Spectral / Allele Table */}
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800">
                        {smpl.scientificFindings}
                      </p>

                      {smpl.keySpectralOrAlleleData && (
                        <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono text-xs">
                          <div className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">
                            Instrument Telemetry & Genetic Allele Markers
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                            {Object.entries(smpl.keySpectralOrAlleleData).map(([key, val]) => (
                              <div key={key} className="bg-slate-950 p-1.5 rounded border border-slate-800">
                                <span className="text-slate-500 block text-[9px]">{key}</span>
                                <span className="text-slate-200 font-bold">{String(val)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                        <span>Examiner: {smpl.cfslExaminerName}</span>
                        <span className="text-emerald-400">Sec 39 BNSS Expert Certification Valid</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-end">
                  <button
                    onClick={() => showToast('Section 176(3) BNSS Certificate transmitted to Trial Bench & Public Prosecutor!')}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <FileCheck className="w-4 h-4" /> Export Sec 176(3) Report
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
              <Microscope className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select or dispatch an NFSU forensic mobile team.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
