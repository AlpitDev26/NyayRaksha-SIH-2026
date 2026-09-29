import React, { useState, useEffect } from 'react';
import { MedicoLegalAutopsyRecord, CaseFile, UserRole, SupportedLanguage } from '../types';
import { phase11Service } from '../services/phase11Service';
import { storageService } from '../services/storageService';
import {
  Activity,
  HeartCrack,
  FileCheck,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Building,
  Thermometer,
  Layers,
  Printer,
  FileText,
  MapPin,
  Crosshair,
  Video,
} from 'lucide-react';

interface MedicoLegalAutopsyViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const MedicoLegalAutopsyView: React.FC<MedicoLegalAutopsyViewProps> = ({
  currentRole: _currentRole,
}) => {
  const [autopsies, setAutopsies] = useState<MedicoLegalAutopsyRecord[]>([]);
  const [selectedAutopsy, setSelectedAutopsy] = useState<MedicoLegalAutopsyRecord | null>(null);
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  // Form State
  const [deceasedName, setDeceasedName] = useState('Late Sh. Rohit K. Verma');
  const [deceasedAge, setDeceasedAge] = useState<number>(42);
  const [deceasedGender, setDeceasedGender] = useState<MedicoLegalAutopsyRecord['deceasedGender']>('MALE');
  const [inquestType, setInquestType] = useState<MedicoLegalAutopsyRecord['inquestType']>(
    'POLICE_INQUEST_SEC_194'
  );
  const [causeOfDeath, setCauseOfDeath] = useState(
    'Hemorrhagic Shock consequent to Ante-Mortem Penetrating Firearm Injury to Thorax'
  );
  const [injurySite, setInjurySite] = useState('Left 4th Intercostal Space, Mid-Clavicular Line');
  const [injuryType, setInjuryType] = useState<any>('FIREARM_ENTRY_WOUND');

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const list = phase11Service.getAutopsyRecords();
    setAutopsies(list);
    if (list.length > 0) setSelectedAutopsy(list[0]);
    const stored = storageService.getCases();
    setCases(stored);
    if (stored.length > 0) setSelectedCaseId(stored[0].id);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const anatomicalHotspots = [
    { label: 'Cranium / Temporal', defaultType: 'BLUNT_FORCE_CONTUSION' },
    { label: 'Cervical / Neck & Larynx', defaultType: 'LIGATURE_STRANGULATION_MARK' },
    { label: 'Anterior Thorax & Heart', defaultType: 'FIREARM_ENTRY_WOUND' },
    { label: 'Posterior Thorax (Exit)', defaultType: 'FIREARM_EXIT_WOUND' },
    { label: 'Upper Abdomen & Liver', defaultType: 'INCISED_STAB_WOUND' },
    { label: 'Right Forearm (Defense)', defaultType: 'BLUNT_FORCE_CONTUSION' },
  ];

  const handleCreateAutopsy = async () => {
    const target = cases.find((c) => c.id === selectedCaseId);
    if (!target) return;

    try {
      const created = await phase11Service.createAutopsyRecord(
        target,
        deceasedName,
        deceasedAge,
        deceasedGender,
        inquestType,
        causeOfDeath,
        injurySite,
        injuryType
      );
      setAutopsies([...phase11Service.getAutopsyRecords()]);
      setSelectedAutopsy(created);
      showToast('Section 194/196 Inquest & Medico-Legal Post-Mortem Certificate generated!');
    } catch (e: any) {
      showToast('Error: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/80 to-slate-900 border border-rose-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-rose-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Sections 194, 195 & 196 BNSS 2023
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <HeartCrack className="w-3 h-3 text-emerald-400" /> 2D Anatomical Injury Mapping & C2PA Video Hash
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <Activity className="w-6 h-6 text-rose-400" />
              Medico-Legal Autopsy & Magisterial Inquest Hub
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Statutory inquest proceedings for unnatural and custodial deaths under Sections 194 & 196 BNSS, integrated with 2D anatomical wound profiling, C2PA post-mortem videography hashes, toxicological viscera correlation, and Chief Judicial Magistrate transmission.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print Post-Mortem Cert
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

      {/* Main Grid: Autopsy Form & Medical Report Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Anatomical Hotspots */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-400" /> Formulate Inquest Panchnama
              </span>
              <span className="text-[10px] text-rose-400 font-mono">Sec 194/196 BNSS</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Homicide / Inquest Case:</label>
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

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-400 font-medium mb-1">Deceased Name:</label>
                  <input
                    type="text"
                    value={deceasedName}
                    onChange={(e) => setDeceasedName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Age:</label>
                  <input
                    type="number"
                    value={deceasedAge}
                    onChange={(e) => setDeceasedAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Inquest Category:</label>
                <select
                  value={inquestType}
                  onChange={(e: any) => setInquestType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                >
                  <option value="POLICE_INQUEST_SEC_194">Police Inquest (Sec 194 BNSS - Unnatural Death)</option>
                  <option value="MAGISTERIAL_INQUEST_SEC_196_CUSTODIAL">Magisterial Inquest (Sec 196 BNSS - Custodial Death)</option>
                  <option value="DOWRY_DEATH_INQUEST_SEC_196">Inquest in Death within 7 Yrs of Marriage (Sec 196 BNSS)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Probable Cause of Death:</label>
                <textarea
                  rows={2}
                  value={causeOfDeath}
                  onChange={(e) => setCauseOfDeath(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              {/* Quick 2D Anatomical Hotspot Selector */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
                  <Crosshair className="w-3 h-3" /> Quick Anatomical Hotspot Mapping
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {anatomicalHotspots.map((spot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setInjurySite(spot.label);
                        setInjuryType(spot.defaultType);
                      }}
                      className="px-2 py-1.5 bg-slate-900 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/50 rounded text-[11px] text-left text-slate-300 transition-colors truncate"
                    >
                      {spot.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Primary Injury Site:</label>
                  <input
                    type="text"
                    value={injurySite}
                    onChange={(e) => setInjurySite(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Wound Morphology:</label>
                  <select
                    value={injuryType}
                    onChange={(e: any) => setInjuryType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  >
                    <option value="FIREARM_ENTRY_WOUND">Firearm Entry Wound</option>
                    <option value="FIREARM_EXIT_WOUND">Firearm Exit Wound</option>
                    <option value="INCISED_STAB_WOUND">Incised Stab Wound</option>
                    <option value="BLUNT_FORCE_CONTUSION">Blunt Force Contusion / Laceration</option>
                    <option value="LIGATURE_STRANGULATION_MARK">Ligature Strangulation Mark</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCreateAutopsy}
                className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-rose-200" /> Compile & Certify Autopsy Report
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Autopsy Report Card */}
        <div className="lg:col-span-7 space-y-4">
          {selectedAutopsy ? (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-300">
                        {selectedAutopsy.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {selectedAutopsy.inquestType.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white mt-1">
                      {selectedAutopsy.deceasedName} (Age: {selectedAutopsy.deceasedAge} / {selectedAutopsy.deceasedGender})
                    </h2>
                    <div className="text-xs text-slate-400">
                      Institute: {selectedAutopsy.hospitalOrMortuary}
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs">
                    <span className="text-slate-400 block text-[10px]">Transmission Status</span>
                    <span className="text-emerald-400 font-bold">{selectedAutopsy.magistrateTransmissionStatus.replace(/_/g, ' ')}</span>
                  </div>
                </div>

                {/* Probable Cause of Death Box */}
                <div className="p-3.5 bg-rose-950/40 rounded-xl border border-rose-500/30 space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-rose-300">
                    Probable Cause of Death (Sec 39 BNSS Medical Opinion)
                  </div>
                  <div className="text-xs text-slate-200 font-bold leading-relaxed">
                    {selectedAutopsy.probableCauseOfDeath}
                  </div>
                </div>

                {/* Injuries Catalog */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Anatomical Injuries Documented ({selectedAutopsy.injuriesFound.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedAutopsy.injuriesFound.map((inj) => (
                      <div
                        key={inj.injuryNumber}
                        className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-200">
                          <span>#{inj.injuryNumber}: {inj.anatomicalSite}</span>
                          <span className="text-[10px] font-mono text-rose-400">
                            {inj.lethalContribution.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Type: {inj.injuryType.replace(/_/g, ' ')} | Dimensions: {inj.dimensionsCm}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Viscera Toxicology, C2PA Video & DNA Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 block uppercase">VISCERA CHEMICAL TOXICOLOGY</span>
                    <div className="text-slate-300 text-[11px]">{selectedAutopsy.toxicologyVisceraFindings}</div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 block uppercase flex items-center gap-1">
                      <Video className="w-3 h-3 text-rose-400" /> C2PA AUTOPSY VIDEO HASH
                    </span>
                    <div className="text-rose-300 font-mono text-[10px] truncate">
                      {selectedAutopsy.videoRecordingC2paHash}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Medical Cert Part B Hash: {selectedAutopsy.medicalCertPartB_Sha256.slice(0, 16)}...
                  </span>
                  <button
                    onClick={() => showToast('Inquest report and C2PA video hashes transmitted to Chief Judicial Magistrate!')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <FileCheck className="w-4 h-4" /> Dispatch to Magistrate
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
              <Activity className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select inquest record or create a new post-mortem examination.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
