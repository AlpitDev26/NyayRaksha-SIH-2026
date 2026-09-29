import React, { useState, useEffect } from 'react';
import { ChargeSheetForm51, CaseFile, UserRole, SupportedLanguage } from '../types';
import { phase8Service } from '../services/phase8Service';
import { storageService } from '../services/storageService';
import {
  FileText,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Send,
  Printer,
  Sparkles,
  Download,
  Stamp,
  UserCheck,
  Scale,
  PlusCircle,
  Search,
} from 'lucide-react';

interface ChargeSheetGeneratorViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
  onSelectCase?: (caseItem: CaseFile) => void;
}

export const ChargeSheetGeneratorView: React.FC<ChargeSheetGeneratorViewProps> = ({
  currentRole: _currentRole,
}) => {
  const [chargeSheets, setChargeSheets] = useState<ChargeSheetForm51[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<ChargeSheetForm51 | null>(null);
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSupplementaryMode, setIsSupplementaryMode] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const list = phase8Service.getChargeSheets();
    setChargeSheets(list);
    if (list.length > 0) setSelectedSheet(list[0]);
    const storedCases = storageService.getCases();
    setCases(storedCases);
    if (storedCases.length > 0) setSelectedCaseId(storedCases[0].id);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleGenerateChargeSheet = async () => {
    const targetCase = cases.find((c) => c.id === selectedCaseId);
    if (!targetCase) return;

    setIsGenerating(true);
    try {
      const generated = await phase8Service.generateChargeSheetForm51(
        targetCase,
        isSupplementaryMode,
        isSupplementaryMode ? 1 : undefined
      );
      setChargeSheets([...phase8Service.getChargeSheets()]);
      setSelectedSheet(generated);
      showToast(`Final Report (Form 5.1 - Sec 193 BNSS) successfully drafted and signed!`);
    } catch (e: any) {
      showToast('Error generating charge-sheet: ' + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredSheets = chargeSheets.filter(
    (cs) =>
      cs.caseNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      cs.firNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      cs.ioName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Section 193 BNSS 2023 & Form 5.1
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Prosecutorial Scrutiny AI
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-400" />
              Final Police Report / Charge-Sheet Generator
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Automated compilation of statutory Form 5.1 under Section 193(3) of Bharatiya Nagarik Suraksha Sanhita, with automated prosecutorial scrutiny, limitation audit (Sec 187), and Section 63 BSA certificate anchoring.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print Form 5.1
            </button>
          </div>
        </div>

        {notification && (
          <div className="mt-3 p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Generator & Scrutiny Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Case Selector & Charge Sheets Archive */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Generator Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-indigo-400" /> Generate Statutory Form 5.1
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Select Active Investigation Case:
                </label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.title.slice(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="suppCheck"
                  checked={isSupplementaryMode}
                  onChange={(e) => setIsSupplementaryMode(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-indigo-500 focus:ring-0 w-3.5 h-3.5"
                />
                <label htmlFor="suppCheck" className="text-xs text-slate-300 font-medium">
                  Supplementary Charge Sheet (Sec 193(9) BNSS)
                </label>
              </div>

              <button
                disabled={isGenerating || !selectedCaseId}
                onClick={handleGenerateChargeSheet}
                className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/30 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-indigo-200" />
                    Running Scrutiny & Compiling...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    Auto-Compile & Sign Form 5.1
                  </>
                )}
              </button>
            </div>
          </div>

          {/* List of Filed Charge Sheets */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Filed Police Reports ({filteredSheets.length})
              </h3>
              <div className="relative w-36">
                <Search className="w-3 h-3 absolute left-2 top-2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter case..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded pl-6 pr-2 py-1 text-[11px] text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredSheets.map((cs) => {
                const isSelected = selectedSheet?.id === cs.id;
                const score = cs.prosecutorialScrutiny.overallCognizanceReadinessScore;
                return (
                  <div
                    key={cs.id}
                    onClick={() => setSelectedSheet(cs)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-indigo-300">
                        {cs.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          score >= 90
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {score}% Ready
                      </span>
                    </div>

                    <div className="text-xs font-medium text-slate-200 mt-1">
                      {cs.caseNumber}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                      <span>{cs.policeStation.split(',')[0]}</span>
                      <span>{new Date(cs.dateOfFiling).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Form 5.1 & Scrutiny Engine */}
        <div className="lg:col-span-8 space-y-5">
          {selectedSheet ? (
            <div className="space-y-5">
              {/* Prosecutorial Scrutiny Matrix Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                      Automated Pre-Cognizance Scrutiny Audit
                    </span>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Scale className="w-5 h-5 text-amber-400" />
                      Statutory Defect Audit & Limitation Check
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Cognizance Readiness</div>
                      <div className="text-lg font-black text-emerald-400 font-mono">
                        {selectedSheet.prosecutorialScrutiny.overallCognizanceReadinessScore}%
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        selectedSheet.prosecutorialScrutiny.scrutinyStatus === 'APPROVED_FOR_FILING'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {selectedSheet.prosecutorialScrutiny.scrutinyStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Defects & Compliance Checklist */}
                <div className="mt-4 space-y-2.5">
                  {selectedSheet.prosecutorialScrutiny.defectsList.map((defect) => (
                    <div
                      key={defect.id}
                      className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 flex items-start gap-3"
                    >
                      {defect.severity === 'COMPLIANT_PASSED' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{defect.title}</span>
                          <span className="font-mono text-[10px] text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/50">
                            {defect.relevantSection}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{defect.description}</p>
                        {defect.autoRemediationHint && (
                          <div className="text-[10px] text-amber-400/90 mt-1 flex items-center gap-1 font-mono">
                            <span>Remedy:</span> {defect.autoRemediationHint}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form 5.1 Official Statutory View */}
              <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-6 shadow-xl space-y-6 text-slate-200">
                {/* Formal Header */}
                <div className="text-center border-b border-slate-700 pb-4">
                  <div className="text-[11px] font-serif uppercase tracking-widest text-slate-400 font-bold">
                    FORM NO. 5.1 | GOVERNMENT OF INDIA
                  </div>
                  <h2 className="text-lg font-serif font-black text-white tracking-wide mt-1">
                    FINAL REPORT / CHARGE SHEET UNDER SECTION 193 BNSS, 2023
                  </h2>
                  <div className="text-xs font-mono text-indigo-400 mt-1">
                    Police Station: {selectedSheet.policeStation} | FIR No: {selectedSheet.firNumber}
                  </div>
                </div>

                {/* Core Case Particulars Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">CASE NUMBER</span>
                    <span className="text-white font-bold">{selectedSheet.caseNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">DATE OF FILING</span>
                    <span className="text-white">{new Date(selectedSheet.dateOfFiling).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">INVESTIGATING OFFICER</span>
                    <span className="text-white">{selectedSheet.ioName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">COURT JURISDICTION</span>
                    <span className="text-white">{selectedSheet.courtName.slice(0, 24)}...</span>
                  </div>
                </div>

                {/* Brief Facts & Investigation Findings */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                      1. Brief Facts of the Case
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded border border-slate-800/80 mt-1">
                      {selectedSheet.briefFactsOfCase}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                      2. Result of Investigation & Evidence Summary
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded border border-slate-800/80 mt-1">
                      {selectedSheet.investigationFindings}
                    </p>
                  </div>
                </div>

                {/* List of Accused Persons */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                    3. Particulars of Accused Persons Charged (Form 5.1 Col 7 & 8)
                  </h4>
                  <div className="space-y-2">
                    {selectedSheet.accusedList.map((acc, idx) => (
                      <div
                        key={acc.id}
                        className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">
                            Accused #{idx + 1}: {acc.fullName} (Age: {acc.age}, S/o {acc.fatherName})
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {acc.custodyStatus.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Address: {acc.address}
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {acc.chargedSections.map((sec, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 bg-rose-950/60 text-rose-300 border border-rose-800/50 rounded text-[10px] font-mono font-bold"
                            >
                              {sec}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* List of Relied Witnesses & Exhibits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                      4. Witnesses Relied (Sec 180 BNSS)
                    </h4>
                    <div className="space-y-2">
                      {selectedSheet.witnessesList.map((wit) => (
                        <div
                          key={wit.id}
                          className="p-2.5 bg-slate-950 rounded border border-slate-800 text-xs space-y-1"
                        >
                          <div className="font-bold text-slate-200 flex items-center justify-between">
                            <span>PW-{wit.witnessNumber}: {wit.name}</span>
                            <span className="text-[10px] text-indigo-400">{wit.type}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">{wit.keyDepositionSummary}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                      5. Electronic Exhibits & Sec 63 BSA Hash
                    </h4>
                    <div className="space-y-2">
                      {selectedSheet.reliedDocumentsList.map((doc, dIdx) => (
                        <div
                          key={dIdx}
                          className="p-2.5 bg-slate-950 rounded border border-slate-800 text-xs space-y-1"
                        >
                          <div className="font-bold text-slate-200 flex items-center justify-between">
                            <span>{doc.docTitle}</span>
                            <span className="font-mono text-[10px] text-emerald-400">
                              {doc.exhibitCode}
                            </span>
                          </div>
                          <div className="font-mono text-[9px] text-slate-500 truncate">
                            SHA-256: {doc.sha256}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Digital PKI Seal & Magistrate Cognizance Section */}
                <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Stamp className="w-8 h-8 text-indigo-400" />
                    <div>
                      <div className="text-xs font-bold text-white">
                        Digitally Signed by: {selectedSheet.digitalSignatureSeal.signerName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Cert ID: {selectedSheet.digitalSignatureSeal.certificateId} | {selectedSheet.digitalSignatureSeal.organization}
                      </div>
                      <div className="text-[9px] text-emerald-400 font-mono">
                        Sec 63 BSA & IT Act PKI Signature Validated
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast('Transmitted directly to Judicial Magistrate Court Registry via ICJS e-Filing grid!')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Dispatch to Court
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select or generate a Section 193 Charge-Sheet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
