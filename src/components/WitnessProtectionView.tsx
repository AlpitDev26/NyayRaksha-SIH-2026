import React, { useState, useEffect } from 'react';
import { WitnessProtectionProfile, CaseFile, UserRole, SupportedLanguage } from '../types';
import { phase9Service } from '../services/phase9Service';
import { storageService } from '../services/storageService';
import {
  UserCheck,
  ShieldAlert,
  Lock,
  EyeOff,
  Home,
  Radio,
  FileCheck,
  PlusCircle,
  AlertOctagon,
  Sparkles,
  PhoneCall,
  Search,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';

interface WitnessProtectionViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const WitnessProtectionView: React.FC<WitnessProtectionViewProps> = ({
  currentRole: _currentRole,
}) => {
  const [witnesses, setWitnesses] = useState<WitnessProtectionProfile[]>([]);
  const [selectedWitness, setSelectedWitness] = useState<WitnessProtectionProfile | null>(null);
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  // Enrollment Form State
  const [originalName, setOriginalName] = useState('Sunil Kumar Saxena (Database Admin)');
  const [pseudonym, setPseudonym] = useState('Witness Alpha-9 (Protected)');
  const [threatCategory, setThreatCategory] = useState<WitnessProtectionProfile['threatCategory']>(
    'CATEGORY_A_SEVERE_LIFE_THREAT'
  );
  const [threatScore, setThreatScore] = useState<number>(92);
  const [threatSummary, setThreatSummary] = useState(
    'Primary eye-witness to illegal fund diversion; received repeated intimidation calls and vehicle tailing.'
  );
  const [judgeName, setJudgeName] = useState('Hon. Special Judge (BNS/CBI), Tis Hazari Courts');
  const [selectedMeasures, setSelectedMeasures] = useState<
    Array<WitnessProtectionProfile['protectionMeasuresSanctioned'][number]>
  >([
    'IDENTITY_CONCEALMENT_REDACTION',
    'SAFE_HOUSE_RELOCATION',
    'ARMED_POLICE_PROTECTION_24X7',
    'IN_CAMERA_VIDEO_DEPOSITION',
    'EMERGENCY_SOS_BEACON',
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const list = phase9Service.getWitnessProfiles();
    setWitnesses(list);
    if (list.length > 0) setSelectedWitness(list[0]);
    const stored = storageService.getCases();
    setCases(stored);
    if (stored.length > 0) setSelectedCaseId(stored[0].id);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleMeasure = (
    measure: WitnessProtectionProfile['protectionMeasuresSanctioned'][number]
  ) => {
    if (selectedMeasures.includes(measure)) {
      setSelectedMeasures(selectedMeasures.filter((m) => m !== measure));
    } else {
      setSelectedMeasures([...selectedMeasures, measure]);
    }
  };

  const handleEnrollWitness = async () => {
    const targetCase = cases.find((c) => c.id === selectedCaseId);
    if (!targetCase) return;

    try {
      const created = await phase9Service.enrollWitnessInProtectionScheme(
        targetCase,
        originalName,
        pseudonym,
        threatCategory,
        threatScore,
        threatSummary,
        selectedMeasures,
        judgeName
      );
      setWitnesses([...phase9Service.getWitnessProfiles()]);
      setSelectedWitness(created);
      showToast('Witness enrolled under Section 398 BNSS with encrypted pseudonym sealing!');
    } catch (e: any) {
      showToast('Error: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Section 398 BNSS 2023 & NALSA Mandate
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <EyeOff className="w-3 h-3 text-rose-400" /> Identity Redaction Engine
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-indigo-400" />
              National Sovereign Witness Protection Scheme (Sec 398 BNSS)
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Comprehensive threat assessment matrix (Category A/B/C), encrypted cryptographic pseudonyms in court transcripts, armed police escort deployment, and safe-house relocation networks.
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

      {/* Main Grid: Enrollment Form & Protection Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Configurator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-indigo-400" /> Enroll Protected Witness
              </span>
              <span className="text-[10px] text-indigo-400 font-mono">Sec 398 BNSS</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Investigation Case:</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Witness Original Identity (Confidential):</label>
                  <input
                    type="text"
                    value={originalName}
                    onChange={(e) => setOriginalName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Public Court Pseudonym:</label>
                  <input
                    type="text"
                    value={pseudonym}
                    onChange={(e) => setPseudonym(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Threat Category (Sec 398):</label>
                  <select
                    value={threatCategory}
                    onChange={(e: any) => setThreatCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  >
                    <option value="CATEGORY_A_SEVERE_LIFE_THREAT">Category A - Threat to Life of Witness/Family</option>
                    <option value="CATEGORY_B_SAFETY_PROPERTY_THREAT">Category B - Threat to Safety / Reputation / Property</option>
                    <option value="CATEGORY_C_INTIMIDATION_MODERATE">Category C - Moderate Threat / Intimidation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Threat TAM Score (0-100):</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={threatScore}
                    onChange={(e) => setThreatScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Threat Assessment Narrative:</label>
                <textarea
                  rows={2}
                  value={threatSummary}
                  onChange={(e) => setThreatSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              {/* Protection Measures Checkbox Grid */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                  Sanctioned Protective Directives
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                  {[
                    { key: 'IDENTITY_CONCEALMENT_REDACTION', label: 'Identity Concealment & Court Record Redaction' },
                    { key: 'SAFE_HOUSE_RELOCATION', label: 'Safe House Secret Relocation' },
                    { key: 'ARMED_POLICE_PROTECTION_24X7', label: '24x7 Armed Police Escort (SPU)' },
                    { key: 'IN_CAMERA_VIDEO_DEPOSITION', label: 'In-Camera Video Deposition (Sec 530 BNSS)' },
                    { key: 'EMERGENCY_SOS_BEACON', label: 'Emergency Encrypted SOS Distress Beacon' },
                  ].map((item: any) => (
                    <label key={item.key} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedMeasures.includes(item.key)}
                        onChange={() => handleToggleMeasure(item.key)}
                        className="rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-0"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleEnrollWitness}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" /> Issue Section 398 Protection Order
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Protected Profile View & Threat Log */}
        <div className="lg:col-span-7 space-y-4">
          {selectedWitness ? (
            <div className="space-y-4">
              {/* Profile Overview Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-300">
                        {selectedWitness.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {selectedWitness.threatCategory.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white mt-1">
                      {selectedWitness.witnessAssignedPseudonym}
                    </h2>
                    <div className="text-xs text-slate-400 font-mono">
                      Order Ref: {selectedWitness.witnessProtectionOrderRef} | Date: {new Date(selectedWitness.orderDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">TAM Threat Score</span>
                    <span className="text-xl font-bold font-mono text-rose-400">
                      {selectedWitness.threatAssessmentScore} / 100
                    </span>
                  </div>
                </div>

                {/* Identity Redaction Badge */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold text-white">Encrypted Cryptographic Identity Seal:</span>
                      <div className="font-mono text-[10px] text-slate-400 truncate max-w-sm">
                        {selectedWitness.encryptedIdentitySealHash}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    Vault Sealed
                  </span>
                </div>

                {/* Active Protective Measures */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Active Security Measures (Sec 398(3) BNSS)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedWitness.protectionMeasuresSanctioned.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-950 rounded border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{m.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Threat Incident Log */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-amber-400" /> 24x7 Threat Surveillance Incidents Log
                  </h4>
                  <div className="space-y-2">
                    {selectedWitness.threatIncidentsLogged.map((inc, iIdx) => (
                      <div
                        key={iIdx}
                        className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-200">
                          <span>{inc.incidentType}</span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(inc.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">Source: {inc.sourceOrChannel}</div>
                        <div className="text-[11px] text-emerald-400 font-mono">
                          Action: {inc.actionTaken}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-end">
                  <button
                    onClick={() => showToast('In-Camera Protected Deposition link generated with identity scrambler enabled!')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <KeyRound className="w-4 h-4" /> Open In-Camera Protected Channel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
              <UserCheck className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select protected witness or enroll a new profile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
