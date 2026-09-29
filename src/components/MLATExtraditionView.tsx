import React, { useState, useEffect } from 'react';
import { MLATExtraditionRecord, CaseFile, UserRole, SupportedLanguage } from '../types';
import { phase9Service } from '../services/phase9Service';
import { storageService } from '../services/storageService';
import {
  Globe,
  FileCheck,
  Send,
  Building,
  Scale,
  ShieldCheck,
  CheckCircle2,
  PlusCircle,
  Sparkles,
  Plane,
  FileText,
  Lock,
  ExternalLink,
} from 'lucide-react';

interface MLATExtraditionViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const MLATExtraditionView: React.FC<MLATExtraditionViewProps> = ({
  currentRole: _currentRole,
}) => {
  const [records, setRecords] = useState<MLATExtraditionRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MLATExtraditionRecord | null>(null);
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  // Form State
  const [fugitiveName, setFugitiveName] = useState('Danish Farooqui @ Danny Bhai');
  const [nationality, setNationality] = useState('Indian');
  const [countryTarget, setCountryTarget] = useState('United Arab Emirates (Dubai)');
  const [foreignCourt, setForeignCourt] = useState('Dubai Court of Appeal / Extradition Division');
  const [requestType, setRequestType] = useState<MLATExtraditionRecord['requestType']>(
    'EXTRADITION_TREATY_REQUEST'
  );
  const [treaty, setTreaty] = useState<MLATExtraditionRecord['treatyFramework']>('BILATERAL_MLAT');
  const [dualCriminology, setDualCriminology] = useState(
    'Offenses correspond to Transnational Wire Fraud & Laundering (Sec 316(2), 111 BNS 2023 vs UAE Federal Law No. 20 of 2018).'
  );
  const [leadOfficer, setLeadOfficer] = useState('Joint Secretary (Extradition), Ministry of External Affairs');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const list = phase9Service.getMLATRecords();
    setRecords(list);
    if (list.length > 0) setSelectedRecord(list[0]);
    const stored = storageService.getCases();
    setCases(stored);
    if (stored.length > 0) setSelectedCaseId(stored[0].id);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateMLAT = async () => {
    const targetCase = cases.find((c) => c.id === selectedCaseId);
    if (!targetCase) return;

    try {
      const created = await phase9Service.generateMLATRequest(
        targetCase,
        fugitiveName,
        nationality,
        countryTarget,
        foreignCourt,
        requestType,
        treaty,
        dualCriminology,
        leadOfficer
      );
      setRecords([...phase9Service.getMLATRecords()]);
      setSelectedRecord(created);
      showToast('MLAT / Letters Rogatory Dossier generated and dispatched to MEA Diplomatic Grid!');
    } catch (e: any) {
      showToast('Error: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/80 to-slate-900 border border-blue-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-blue-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Sections 111–114 BNSS 2023
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-400" /> MEA / MHA Sovereign Diplomatic Grid
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <Plane className="w-6 h-6 text-blue-400" />
              Sovereign MLAT, Letters Rogatory & International Extradition Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Cross-border reciprocal evidence gathering via Letters Rogatory (Sec 114 BNSS), bilateral mutual legal assistance treaties (MLAT), foreign property attachment (Sec 113 BNSS), and diplomatic extradition dossiers.
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

      {/* Main Grid: MLAT Request Creator & Diplomatic Dossier Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-blue-400" /> Initiate Letters Rogatory / Extradition
              </span>
              <span className="text-[10px] text-blue-400 font-mono">Sec 111-114 BNSS</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Case File:</label>
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
                  <label className="block text-slate-400 font-medium mb-1">Fugitive / Subject Name:</label>
                  <input
                    type="text"
                    value={fugitiveName}
                    onChange={(e) => setFugitiveName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Subject Nationality:</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Foreign Contracting State:</label>
                  <input
                    type="text"
                    value={countryTarget}
                    onChange={(e) => setCountryTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Treaty Framework:</label>
                  <select
                    value={treaty}
                    onChange={(e: any) => setTreaty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  >
                    <option value="BILATERAL_MLAT">Bilateral MLAT Accord</option>
                    <option value="HAGUE_EVIDENCE_CONVENTION">Hague Evidence Convention</option>
                    <option value="UN_ODC_RECIPROCITY_ACCORD">UN ODC Reciprocity Convention</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Request Type:</label>
                <select
                  value={requestType}
                  onChange={(e: any) => setRequestType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                >
                  <option value="EXTRADITION_TREATY_REQUEST">Extradition & Surrender Request</option>
                  <option value="LETTERS_ROGATORY_SEC_114">Letters Rogatory for Overseas Evidence (Sec 114 BNSS)</option>
                  <option value="ATTACHMENT_OF_PROPERTY_SEC_113">Attachment of Property Situated in Foreign State (Sec 113 BNSS)</option>
                  <option value="SERVICE_OF_SUMMONS_SEC_111">Reciprocal Service of Summons / Warrants (Sec 111 BNSS)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Foreign Judicial / Central Authority:</label>
                <input
                  type="text"
                  value={foreignCourt}
                  onChange={(e) => setForeignCourt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Dual Criminology & Legal Nexus:</label>
                <textarea
                  rows={2}
                  value={dualCriminology}
                  onChange={(e) => setDualCriminology(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <button
                onClick={handleCreateMLAT}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-200" /> Compile & Transmit Diplomatic Dossier
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Diplomatic Dossier View */}
        <div className="lg:col-span-7 space-y-4">
          {selectedRecord ? (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-300">
                        {selectedRecord.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {selectedRecord.diplomaticStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white mt-1">
                      {selectedRecord.fugitiveOrSubjectName} ({selectedRecord.subjectNationality})
                    </h2>
                    <div className="text-xs text-slate-400">
                      Destination: {selectedRecord.foreignCountryTarget} | Authority: {selectedRecord.foreignJudicialAuthority}
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs text-slate-400">
                    <div>MEA Clearance Ref</div>
                    <div className="text-emerald-400 font-bold">{selectedRecord.meaClearanceRef}</div>
                  </div>
                </div>

                {/* Treaty Matrix Details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">REQUEST TYPE</span>
                    <span className="text-white font-bold">{selectedRecord.requestType.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">TREATY BASE</span>
                    <span className="text-white">{selectedRecord.treatyFramework.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">MHA NODAL APPROVAL</span>
                    <span className="text-emerald-400">{new Date(selectedRecord.mhaNodalApprovalDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Dual Criminology Assessment */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-blue-400" /> Dual Criminology & Reciprocal Compliance
                  </h4>
                  <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-slate-800 leading-relaxed">
                    {selectedRecord.offenseBriefDualCriminology}
                  </p>
                </div>

                {/* Digital Dossier Sealed Hash */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">CRYPTOGRAPHIC EVIDENCE DOSSIER HASH</span>
                    <span className="text-emerald-400">{selectedRecord.digitalDossierHash}</span>
                  </div>
                  <Lock className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-slate-500">
                    Lead: {selectedRecord.leadMEAOfficer}
                  </div>

                  <button
                    onClick={() => showToast('Diplomatic pouch dispatched via Sovereign Encrypted MEA gateway!')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Dispatch Diplomatic Pouch
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
              <Globe className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select MLAT record or initiate a new Letters Rogatory request.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
