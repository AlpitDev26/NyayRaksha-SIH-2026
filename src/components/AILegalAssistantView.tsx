import React, { useState, useEffect, useMemo } from 'react';
import {
  SupportedLanguage,
  CaseFile,
  BailEvaluationFactors,
  BailEvaluationResult,
  StatutoryChargeSheetDossier,
  TrialSimulationMessage,
} from '../types';
import { TRANSLATIONS } from '../services/i18n';
import {
  aiLegalService,
  SectionRecommendation,
  ChargeSheetAuditResult,
  PRECEDENT_LIBRARY,
} from '../services/aiLegalService';
import { storageService } from '../services/storageService';
import {
  Sparkles,
  Scale,
  FileCheck,
  BookOpen,
  Send,
  Loader2,
  Copy,
  Check,
  Shield,
  HelpCircle,
  Network,
  Gavel,
  AlertTriangle,
  FileText,
  User,
  Building,
  CreditCard,
  Smartphone,
  Car,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award,
  RefreshCw,
  Printer,
  FileDown,
  Layers,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface AILegalAssistantViewProps {
  language: SupportedLanguage;
}

type AssistantMode =
  | 'section_classifier'
  | 'chargesheet_generator'
  | 'bail_matrix'
  | 'criminal_nexus'
  | 'courtroom_sim'
  | 'forensic_digest'
  | 'precedent_benchbook';

export const AILegalAssistantView: React.FC<AILegalAssistantViewProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeMode, setActiveMode] = useState<AssistantMode>('section_classifier');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Cases loaded from storage
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  useEffect(() => {
    const loadedCases = storageService.getCases();
    setCases(loadedCases);
    if (loadedCases.length > 0) {
      setSelectedCaseId(loadedCases[0].id);
    }
  }, []);

  const selectedCase = useMemo(() => {
    return cases.find((c) => c.id === selectedCaseId) || cases[0] || null;
  }, [cases, selectedCaseId]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- MODE 1: SECTION CLASSIFIER STATE ---
  const [narrativeInput, setNarrativeInput] = useState(
    'Accused person Vikramaditya Rao impersonated an authorized bank security director and deployed LockBit 3.0 ransomware payload on the core banking servers, siphoning ₹4.8 Crore into offshore shell accounts via fraudulent RTGS wires.'
  );
  const [sections, setSections] = useState<SectionRecommendation[]>([]);
  const [isClassifying, setIsClassifying] = useState(false);

  const handleClassify = async () => {
    if (!narrativeInput.trim()) return;
    setIsClassifying(true);
    try {
      const recs = await aiLegalService.classifyAndRecommendSections(narrativeInput);
      setSections(recs);
    } finally {
      setIsClassifying(false);
    }
  };

  useEffect(() => {
    if (activeMode === 'section_classifier' && sections.length === 0) {
      handleClassify();
    }
  }, [activeMode]);

  // --- MODE 2: STATUTORY CHARGESHEET GENERATOR STATE ---
  const [auditResult, setAuditResult] = useState<ChargeSheetAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [generatedDossier, setGeneratedDossier] = useState<StatutoryChargeSheetDossier | null>(null);
  const [ioNarrativeNotes, setIoNarrativeNotes] = useState(
    'Accused was intercepted with cold-storage cryptocurrency hardware keys. Forensic recovery confirms simultaneous login into compromised root nodes.'
  );

  const handleRunAudit = async () => {
    if (!selectedCase) return;
    setIsAuditing(true);
    try {
      const res = await aiLegalService.auditCaseForCourtFiling(selectedCase);
      setAuditResult(res);
      const dossier = aiLegalService.generateStatutoryChargeSheet(selectedCase, ioNarrativeNotes);
      setGeneratedDossier(dossier);
    } finally {
      setIsAuditing(false);
    }
  };

  useEffect(() => {
    if (selectedCase && activeMode === 'chargesheet_generator') {
      handleRunAudit();
    }
  }, [selectedCase, activeMode]);

  // --- MODE 3: BAIL PREDICTABILITY & RISK MATRIX STATE ---
  const [bailFactors, setBailFactors] = useState<BailEvaluationFactors>({
    accusedName: 'Vikramaditya Rao',
    age: 34,
    gender: 'MALE',
    priorConvictionsCount: 0,
    isFirstTimeOffender: true,
    custodyDaysSpent: 45,
    maximumStatutoryTermMonths: 84, // 7 years
    flightRiskIndicators: {
      hasValidPassport: true,
      hasForeignBankAccounts: true,
      localPermanentResident: true,
      gainfullyEmployed: true,
      hasFamilyDependents: true,
    },
    tamperingRiskIndicators: {
      victimIsVulnerableOrMinor: false,
      hasCoercedWitnesses: false,
      possessesAdminAccessToDigitalEvidence: true,
      coAccusedAbsconding: true,
    },
    offenseClassification: {
      isHeinous: false,
      isEconomicOffenseOver1Cr: true,
      isNarcoticsCommercialQuantity: false,
      isSexualOffenceOrPOCSO: false,
    },
  });

  const bailResult = useMemo(() => {
    if (!selectedCase) return null;
    return aiLegalService.evaluateBailRisk(selectedCase, bailFactors);
  }, [selectedCase, bailFactors]);

  // --- MODE 4: CRIMINAL NEXUS & SYNDICATE GRAPH STATE ---
  const [nexusSearch, setNexusSearch] = useState('');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('ALL');
  const nexusData = useMemo(() => {
    return aiLegalService.analyzeCriminalNexus(cases);
  }, [cases]);

  const filteredEntities = useMemo(() => {
    return nexusData.entities.filter((e) => {
      const matchesSearch =
        e.label.toLowerCase().includes(nexusSearch.toLowerCase()) ||
        e.identifierValue.toLowerCase().includes(nexusSearch.toLowerCase()) ||
        e.modusOperandiTag.toLowerCase().includes(nexusSearch.toLowerCase());
      const matchesType = selectedEntityType === 'ALL' || e.entityType === selectedEntityType;
      return matchesSearch && matchesType;
    });
  }, [nexusData, nexusSearch, selectedEntityType]);

  // --- MODE 5: LIVE COURTROOM SIMULATION STATE ---
  const [simDialogue, setSimDialogue] = useState<TrialSimulationMessage[]>([]);
  const [simInput, setSimInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleStartOrResetSim = () => {
    if (!selectedCase) return;
    const initial = aiLegalService.simulateCourtroomDialogue(selectedCase, []);
    setSimDialogue(initial);
  };

  useEffect(() => {
    if (activeMode === 'courtroom_sim' && simDialogue.length === 0 && selectedCase) {
      handleStartOrResetSim();
    }
  }, [activeMode, selectedCase]);

  const handleSendSimArgument = () => {
    if (!selectedCase || !simInput.trim()) return;
    setIsSimulating(true);
    setTimeout(() => {
      const updated = aiLegalService.simulateCourtroomDialogue(selectedCase, simDialogue, simInput);
      setSimDialogue(updated);
      setSimInput('');
      setIsSimulating(false);
    }, 400);
  };

  // --- MODE 6: FORENSIC DIGEST STATE ---
  const [rawForensicText, setRawForensicText] = useState(
    'Extracted raw memory dump from Linux blade server using Volatility 3 framework. Identified process PID 4410 executing memory-injected ELF payload with hardcoded C2 IP 185.220.101.44 and SHA-256 matching known LockBit 3.0 variant. Write-blocker hardware verification log NIST CFTT calibration confirmed zero bit alterations on source SSD.'
  );
  const [forensicDigestOutput, setForensicDigestOutput] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleSynthesizeForensics = async () => {
    if (!rawForensicText.trim()) return;
    setIsSynthesizing(true);
    try {
      setForensicDigestOutput(`[PLAIN-LANGUAGE JUDICIAL SCIENTIFIC BRIEF - FSL TECHNICAL CERTIFICATION]

1. SUMMARY OF FORENSIC FINDINGS:
The Forensic Science Laboratory (CFSL) cyber division has verified with mathematical certainty that the seized server was actively infected with a malicious ransomware process (LockBit 3.0 variant) designed to siphon institutional funds.

2. DIRECT ATTRIBUTION TO ACCUSED:
Encrypted network session logs and SSH credentials extracted from volatile RAM directly match the cryptographic tokens recovered from the personal device of the accused.

3. STATUTORY COMPLIANCE UNDER SECTION 63 BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023:
The physical SSD drive was acquired using NIST CFTT-certified hardware write-blockers. Cryptographic SHA-256 hash was generated at the crime scene and immutably anchored on the Sovereign Blockchain Ledger, precluding any possibility of post-seizure tampering or fabrication.`);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // --- MODE 7: PRECEDENT BENCHBOOK STATE ---
  const [benchSearch, setBenchSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');

  const filteredPrecedents = useMemo(() => {
    return PRECEDENT_LIBRARY.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(benchSearch.toLowerCase()) ||
        p.citation.toLowerCase().includes(benchSearch.toLowerCase()) ||
        p.ratioDecidendi.toLowerCase().includes(benchSearch.toLowerCase()) ||
        p.relatedActs.some((a) => a.toLowerCase().includes(benchSearch.toLowerCase()));
      const matchSubject = selectedSubject === 'ALL' || p.primarySubject === selectedSubject;
      return matchSearch && matchSubject;
    });
  }, [benchSearch, selectedSubject]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-5 rounded-xl border border-indigo-900/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="tracking-wider uppercase font-semibold">
              Phase 5: Sovereign Intelligence & Judicial Decision Support Suite
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white font-serif tracking-tight mt-1">
            AI Legal Decision Engine & Copilot
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Statutory penal classification under Bharatiya Nyaya Sanhita (BNS 2023), Section 193 BNSS Charge-Sheet auto-dossier generation, Triple-Test bail predictability matrix, and multi-state criminal syndicate nexus analyzer.
          </p>
        </div>

        {/* Global Case Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-lg border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">Active Case:</span>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="bg-slate-900 text-xs text-amber-300 font-mono px-2 py-1 rounded border border-slate-700 focus:outline-none focus:border-amber-500 max-w-[220px] truncate"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.caseNumber} - {c.title.slice(0, 30)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto shadow-sm">
        {[
          { id: 'section_classifier', label: '1. Penal Section AI', icon: <Scale className="w-3.5 h-3.5" /> },
          { id: 'chargesheet_generator', label: '2. Sec 193 BNSS Charge-Sheet', icon: <FileCheck className="w-3.5 h-3.5" /> },
          { id: 'bail_matrix', label: '3. Bail Risk Matrix', icon: <Gavel className="w-3.5 h-3.5" /> },
          { id: 'criminal_nexus', label: '4. Criminal Nexus Graph', icon: <Network className="w-3.5 h-3.5" /> },
          { id: 'courtroom_sim', label: '5. Courtroom Hearing Sim', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'forensic_digest', label: '6. FSL Judicial Digest', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'precedent_benchbook', label: '7. Bench Book & Precedents', icon: <BookOpen className="w-3.5 h-3.5" /> },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMode(m.id as AssistantMode)}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeMode === m.id
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
          >
            {m.icon}
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: SECTION CLASSIFIER & PENAL STATUTE MAPPER */}
      {/* ========================================================================= */}
      {activeMode === 'section_classifier' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Incident Narrative → Bharatiya Nyaya Sanhita (BNS) Section Mapper</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Natural language penal intelligence: maps crime descriptions to BNS 2023, IT Act, NDPS, and Arms Act with IPC cross-walk, cognizable/bailable classifications, and prescribed sentencing.
              </p>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 rounded">
              BNS 2023 Live Ruleset
            </span>
          </div>

          <div className="space-y-2.5">
            <textarea
              rows={4}
              value={narrativeInput}
              onChange={(e) => setNarrativeInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-sans leading-relaxed"
              placeholder="Paste incident narrative, complainant disclosure, or crime scene observation..."
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>Quick Presets:</span>
                <button
                  onClick={() =>
                    setNarrativeInput(
                      'Deepfake CEO audio call duped accounts manager into transferring ₹3.2 Crore offshore into Dubai shell accounts.'
                    )
                  }
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]"
                >
                  Deepfake Cyber Fraud
                </button>
                <button
                  onClick={() =>
                    setNarrativeInput(
                      'Seized 420kg synthetic tramadol and methamphetamine tablets from disguised refrigerated ambulance at interstate border checkpost.'
                    )
                  }
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]"
                >
                  NDPS Contraband Seizure
                </button>
                <button
                  onClick={() =>
                    setNarrativeInput(
                      'Fabricated revenue department stamp and forged electronic digital signature on government land registry records to usurp public property.'
                    )
                  }
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]"
                >
                  Documentary Forgery
                </button>
              </div>

              <button
                onClick={handleClassify}
                disabled={isClassifying || !narrativeInput.trim()}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-md"
              >
                {isClassifying ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Legal Statutes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Classify & Recommend Sections</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {sections.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Identified Statutory Provisions ({sections.length})
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Sorted by Relevance Score</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {sections.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl space-y-2.5 transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400 text-sm">{s.section}</span>
                          {s.ipcEquivalent && (
                            <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-900 text-slate-400 border border-slate-800">
                              (Old: {s.ipcEquivalent})
                            </span>
                          )}
                        </div>
                        <div className="text-slate-100 text-xs font-semibold mt-0.5">{s.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{s.act}</div>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 shrink-0">
                        {s.relevanceScore}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2 rounded border border-slate-800/60">
                      {s.rationale}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                      <div>
                        <span className="text-slate-500">Classification: </span>
                        <span className={s.cognizable ? 'text-amber-300 font-semibold' : 'text-slate-300'}>
                          {s.cognizable ? 'Cognizable' : 'Non-Cognizable'}
                        </span>
                        <span> · </span>
                        <span className={s.bailable ? 'text-emerald-400' : 'text-rose-400 font-semibold'}>
                          {s.bailable ? 'Bailable' : 'Non-Bailable'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Trial Bench: </span>
                        <span className="text-slate-300">{s.triableByCourt}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 bg-slate-900/40 p-1.5 rounded flex items-center justify-between">
                      <span>
                        <strong className="text-slate-300">Prescribed Punishment:</strong> {s.punishmentSummary}
                      </span>
                      <button
                        onClick={() => copyToClipboard(`${s.section}: ${s.title} (${s.act})`, `sec-${idx}`)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === `sec-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: STATUTORY CHARGESHEET & SECTION 193 BNSS FINAL FORM */}
      {/* ========================================================================= */}
      {activeMode === 'chargesheet_generator' && selectedCase && (
        <div className="space-y-6">
          {/* Readiness Audit Card */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Section 193 BNSS Charge-Sheet Readiness Auditor</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated statutory compliance audit prior to judicial filing: verifies Merkle anchors, CFSL laboratory reports, chain of custody logs, and witness statements.
                </p>
              </div>

              {auditResult && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Readiness Score</div>
                    <div
                      className={`text-xl font-mono font-bold ${
                        auditResult.overallReadinessScore >= 85
                          ? 'text-emerald-400'
                          : auditResult.overallReadinessScore >= 60
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {auditResult.overallReadinessScore} / 100
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg border ${
                      auditResult.status === 'READY_FOR_FILING'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                        : auditResult.status === 'DEFICIENCIES_DETECTED'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                        : 'bg-rose-950/60 text-rose-300 border-rose-800'
                    }`}
                  >
                    {auditResult.status.replace(/_/g, ' ')}
                  </span>
                </div>
              )}
            </div>

            {/* Checklist */}
            {auditResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                {auditResult.statutoryChecklist.map((chk, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                      chk.isCompliant
                        ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                        : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                    }`}
                  >
                    {chk.isCompliant ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <div className="font-mono text-[11px] font-bold text-slate-200">{chk.rule}</div>
                      <div className="text-[11px] text-slate-400">{chk.mandate}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-1">{chk.remarks}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generated Charge Sheet Dossier */}
          {generatedDossier && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                      FORM NO. 193 BNSS
                    </span>
                    <span className="text-xs font-mono text-slate-400">FINAL POLICE REPORT</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-serif mt-1">
                    Charge-Sheet Dossier: {generatedDossier.chargeSheetNumber}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Court: {generatedDossier.courtName} · P.S.: {generatedDossier.policeStation}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(generatedDossier, null, 2), 'cs-dossier')}
                    className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {copiedId === 'cs-dossier' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy JSON</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Dossier</span>
                  </button>
                </div>
              </div>

              {/* Accused Table */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  I. Particulars of Accused Persons Charged ({generatedDossier.accusedParticulars.length})
                </div>
                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 text-[11px] font-mono border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">Accused Name & Alias</th>
                        <th className="p-2.5">Custody Status</th>
                        <th className="p-2.5">Substantive Offences</th>
                        <th className="p-2.5">Prima Facie Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/40 font-mono text-[11px]">
                      {generatedDossier.accusedParticulars.map((acc) => (
                        <tr key={acc.accusedNumber}>
                          <td className="p-2.5 font-bold text-amber-400">A-{acc.accusedNumber}</td>
                          <td className="p-2.5 font-sans font-semibold text-slate-200">
                            {acc.fullName} {acc.alias !== 'None' && <span className="text-slate-400">({acc.alias})</span>}
                          </td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 text-[10px] rounded bg-slate-900 text-slate-300 border border-slate-800">
                              {acc.currentCustody}
                            </span>
                          </td>
                          <td className="p-2.5 text-amber-300">{acc.chargesPertaining.join('; ')}</td>
                          <td className="p-2.5 font-sans text-slate-400 text-[11px]">{acc.primaFacieRole}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Witnesses List */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  II. Calendar of Prosecution Witnesses ({generatedDossier.prosecutionWitnesses.length})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {generatedDossier.prosecutionWitnesses.map((pw) => (
                    <div key={pw.witnessCode} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-amber-400 text-xs">{pw.witnessCode}: {pw.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {pw.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{pw.keyDepositionPoint}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material Objects & Certificates */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  III. Material Objects & Electronic Evidence Admissibility (Sec 63 BSA 2023)
                </div>
                <div className="space-y-2">
                  {generatedDossier.materialObjectsAndDocuments.map((mo, i) => (
                    <div key={i} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="font-mono font-bold text-slate-200">{mo.exhibitCode}</div>
                        <div className="text-slate-400">{mo.description}</div>
                        <div className="font-mono text-[10px] text-slate-500 truncate max-w-lg">
                          SHA-256 Digest: {mo.sha256Digest}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Sec 63 BSA Certified
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{mo.fslReportRef}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prosecution Prayer & Signatures */}
              <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-xl space-y-3">
                <div className="text-xs font-mono font-bold text-amber-300 uppercase">IV. Prosecution Prayer & Digital Attestation</div>
                <p className="text-xs text-slate-300 italic leading-relaxed">{generatedDossier.prosecutionPrayer}</p>
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
                  <div>
                    Investigating Officer: <strong className="text-white">{generatedDossier.ioDetails.name}</strong> ({generatedDossier.ioDetails.rank}) · Badge: {generatedDossier.ioDetails.badgeId}
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Signed with NIC DSC Smart Card · Hash Anchored</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: SMART BAIL PREDICTABILITY & RISK MATRIX */}
      {/* ========================================================================= */}
      {activeMode === 'bail_matrix' && selectedCase && bailResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Factor Configurator */}
          <div className="lg:col-span-5 p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
                <Gavel className="w-4 h-4 text-amber-400" />
                <span>Bail Risk Factors Matrix</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Adjust accused parameters to compute real-time Triple-Test probabilities and statutory bailability under BNSS 2023.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 text-[11px] font-mono">Accused Applicant:</label>
                <input
                  type="text"
                  value={bailFactors.accusedName}
                  onChange={(e) => setBailFactors({ ...bailFactors, accusedName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 text-[11px] font-mono">Custody Days Spent:</label>
                  <input
                    type="number"
                    value={bailFactors.custodyDaysSpent}
                    onChange={(e) => setBailFactors({ ...bailFactors, custodyDaysSpent: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white mt-1 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] font-mono">Max Statutory Term (Months):</label>
                  <input
                    type="number"
                    value={bailFactors.maximumStatutoryTermMonths}
                    onChange={(e) =>
                      setBailFactors({ ...bailFactors, maximumStatutoryTermMonths: parseInt(e.target.value) || 12 })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white mt-1 font-mono"
                  />
                </div>
              </div>

              {/* Checkboxes for Flight Risk */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="text-[11px] font-mono font-bold text-slate-300">Flight Risk & Societal Roots:</div>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bailFactors.flightRiskIndicators.hasValidPassport}
                    onChange={(e) =>
                      setBailFactors({
                        ...bailFactors,
                        flightRiskIndicators: { ...bailFactors.flightRiskIndicators, hasValidPassport: e.target.checked },
                      })
                    }
                    className="rounded text-amber-500"
                  />
                  <span>Holds Valid International Passport</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bailFactors.flightRiskIndicators.hasForeignBankAccounts}
                    onChange={(e) =>
                      setBailFactors({
                        ...bailFactors,
                        flightRiskIndicators: { ...bailFactors.flightRiskIndicators, hasForeignBankAccounts: e.target.checked },
                      })
                    }
                    className="rounded text-amber-500"
                  />
                  <span>Possesses Offshore / Foreign Bank Accounts</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bailFactors.flightRiskIndicators.localPermanentResident}
                    onChange={(e) =>
                      setBailFactors({
                        ...bailFactors,
                        flightRiskIndicators: { ...bailFactors.flightRiskIndicators, localPermanentResident: e.target.checked },
                      })
                    }
                    className="rounded text-amber-500"
                  />
                  <span>Deep Local Ties / Permanent Resident</span>
                </label>
              </div>

              {/* Checkboxes for Tampering Risk */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="text-[11px] font-mono font-bold text-slate-300">Evidentiary Tampering & Witness Risk:</div>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bailFactors.tamperingRiskIndicators.possessesAdminAccessToDigitalEvidence}
                    onChange={(e) =>
                      setBailFactors({
                        ...bailFactors,
                        tamperingRiskIndicators: {
                          ...bailFactors.tamperingRiskIndicators,
                          possessesAdminAccessToDigitalEvidence: e.target.checked,
                        },
                      })
                    }
                    className="rounded text-amber-500"
                  />
                  <span>Admin Access to Remote Servers / Encryption Keys</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bailFactors.tamperingRiskIndicators.coAccusedAbsconding}
                    onChange={(e) =>
                      setBailFactors({
                        ...bailFactors,
                        tamperingRiskIndicators: {
                          ...bailFactors.tamperingRiskIndicators,
                          coAccusedAbsconding: e.target.checked,
                        },
                      })
                    }
                    className="rounded text-amber-500"
                  />
                  <span>Key Syndicate Co-Accused is Absconding</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bailFactors.tamperingRiskIndicators.hasCoercedWitnesses}
                    onChange={(e) =>
                      setBailFactors({
                        ...bailFactors,
                        tamperingRiskIndicators: {
                          ...bailFactors.tamperingRiskIndicators,
                          hasCoercedWitnesses: e.target.checked,
                        },
                      })
                    }
                    className="rounded text-amber-500"
                  />
                  <span>Recorded Threats / Witness Coercion Reported</span>
                </label>
              </div>

              {/* Heinousness Classification */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="text-[11px] font-mono font-bold text-slate-300">Offence Heinousness:</div>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bailFactors.offenseClassification.isEconomicOffenseOver1Cr}
                    onChange={(e) =>
                      setBailFactors({
                        ...bailFactors,
                        offenseClassification: {
                          ...bailFactors.offenseClassification,
                          isEconomicOffenseOver1Cr: e.target.checked,
                        },
                      })
                    }
                    className="rounded text-amber-500"
                  />
                  <span>Economic Offence Exceeding ₹1 Crore</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bailFactors.offenseClassification.isNarcoticsCommercialQuantity}
                    onChange={(e) =>
                      setBailFactors({
                        ...bailFactors,
                        offenseClassification: {
                          ...bailFactors.offenseClassification,
                          isNarcoticsCommercialQuantity: e.target.checked,
                        },
                      })
                    }
                    className="rounded text-amber-500"
                  />
                  <span>Commercial Quantity Narcotics (Sec 37 NDPS Bar)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Predictive Scoring & Judicial Order */}
          <div className="lg:col-span-7 space-y-4">
            {/* Recommendation Banner */}
            <div
              className={`p-5 rounded-xl border space-y-3 ${
                bailResult.recommendation === 'REJECT_BAIL_CUSTODIAL_REMAND'
                  ? 'bg-rose-950/40 border-rose-800 text-rose-200'
                  : bailResult.recommendation === 'GRANT_CONDITIONAL_BAIL'
                  ? 'bg-amber-950/40 border-amber-800 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                  Sovereign Judicial Recommendation
                </span>
                <span className="text-xl font-mono font-bold">
                  Risk Score: {bailResult.overallRiskScore}/100
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-serif">{bailResult.recommendationTitle}</h3>
              <p className="text-xs text-slate-300">
                Statutory Status: <strong className="font-mono">{bailResult.statutoryBailability}</strong>
              </p>
            </div>

            {/* Triple Test Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1 text-xs">
                <div className="text-[10px] font-mono text-slate-400 uppercase">1. Flight Risk</div>
                <div
                  className={`font-mono font-bold text-sm ${
                    bailResult.tripleTestAssessment.flightRisk.status === 'HIGH'
                      ? 'text-rose-400'
                      : bailResult.tripleTestAssessment.flightRisk.status === 'MODERATE'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {bailResult.tripleTestAssessment.flightRisk.status} ({bailResult.tripleTestAssessment.flightRisk.score}%)
                </div>
                <div className="text-[10px] text-slate-500 truncate">{bailResult.tripleTestAssessment.flightRisk.rationale}</div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1 text-xs">
                <div className="text-[10px] font-mono text-slate-400 uppercase">2. Evidence Tampering</div>
                <div
                  className={`font-mono font-bold text-sm ${
                    bailResult.tripleTestAssessment.tamperingWithEvidence.status === 'HIGH'
                      ? 'text-rose-400'
                      : bailResult.tripleTestAssessment.tamperingWithEvidence.status === 'MODERATE'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {bailResult.tripleTestAssessment.tamperingWithEvidence.status} ({bailResult.tripleTestAssessment.tamperingWithEvidence.score}%)
                </div>
                <div className="text-[10px] text-slate-500 truncate">{bailResult.tripleTestAssessment.tamperingWithEvidence.rationale}</div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1 text-xs">
                <div className="text-[10px] font-mono text-slate-400 uppercase">3. Witness Threat</div>
                <div
                  className={`font-mono font-bold text-sm ${
                    bailResult.tripleTestAssessment.witnessIntimidation.status === 'HIGH'
                      ? 'text-rose-400'
                      : bailResult.tripleTestAssessment.witnessIntimidation.status === 'MODERATE'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {bailResult.tripleTestAssessment.witnessIntimidation.status} ({bailResult.tripleTestAssessment.witnessIntimidation.score}%)
                </div>
                <div className="text-[10px] text-slate-500 truncate">{bailResult.tripleTestAssessment.witnessIntimidation.rationale}</div>
              </div>
            </div>

            {/* Drafted Judicial Bail Order */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  Drafted Judicial Order (BNSS Sec 480 / CrPC Sec 437)
                </span>
                <button
                  onClick={() => copyToClipboard(bailResult.draftedJudicialBailOrder, 'bail-order')}
                  className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === 'bail-order' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Order</span>
                </button>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {bailResult.draftedJudicialBailOrder}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: CRIMINAL NEXUS & SYNDICATE GRAPH */}
      {/* ========================================================================= */}
      {activeMode === 'criminal_nexus' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
                <Network className="w-4 h-4 text-cyan-400" />
                <span>Cross-Case Criminal Intelligence & Syndicate Nexus Visualizer</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-jurisdiction correlation engine: matches bank accounts, crypto bridges, burner IMEIs, shell entities, and modus operandi vectors across police stations and states.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-rose-950/60 text-rose-300 border border-rose-800">
                {nexusData.highRiskEntitiesCount} Critical Entities
              </span>
              <span className="px-2.5 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-800">
                {nexusData.crossCaseLinksCount} Cross-FIR Links
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={nexusSearch}
                onChange={(e) => setNexusSearch(e.target.value)}
                placeholder="Search suspect alias, shell company, crypto wallet, bank account, IMEI..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
              {['ALL', 'SUSPECT', 'SHELL_COMPANY', 'CRYPTO_WALLET', 'BANK_ACCOUNT', 'PHONE_IMEI', 'VEHICLE'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedEntityType(type)}
                  className={`px-2.5 py-1.5 text-[11px] font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
                    selectedEntityType === type
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {type.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Nexus Entity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredEntities.map((ent) => (
              <div
                key={ent.id}
                className="p-4 bg-slate-950 border border-slate-800 hover:border-cyan-800/60 rounded-xl space-y-3 transition-all shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {ent.entityType === 'SUSPECT' && <User className="w-4 h-4 text-amber-400" />}
                      {ent.entityType === 'SHELL_COMPANY' && <Building className="w-4 h-4 text-purple-400" />}
                      {ent.entityType === 'CRYPTO_WALLET' && <Sparkles className="w-4 h-4 text-cyan-400" />}
                      {ent.entityType === 'BANK_ACCOUNT' && <CreditCard className="w-4 h-4 text-emerald-400" />}
                      {ent.entityType === 'PHONE_IMEI' && <Smartphone className="w-4 h-4 text-blue-400" />}
                      {ent.entityType === 'VEHICLE' && <Car className="w-4 h-4 text-orange-400" />}
                      <span className="font-bold text-white text-xs">{ent.label}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                        ent.riskLevel === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {ent.riskLevel}
                    </span>
                  </div>

                  <div className="font-mono text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800/60 break-all">
                    {ent.identifierValue}
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div>
                      <span className="text-slate-500">M.O. Vector: </span>
                      <span className="text-slate-200">{ent.modusOperandiTag}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Linked Operatives: </span>
                      <span className="text-cyan-300 font-mono">{ent.linkedSuspectNames.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <div className="flex items-center gap-1 text-slate-400">
                    <span>Active FIRs:</span>
                    <span className="text-amber-400 font-bold">{ent.associatedCaseNumbers.length}</span>
                  </div>
                  <div className="text-slate-500 truncate max-w-[140px]">
                    States: {ent.jurisdictionStates.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 5: INTERACTIVE COURTROOM SIMULATOR */}
      {/* ========================================================================= */}
      {activeMode === 'courtroom_sim' && selectedCase && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Live Courtroom Trial & Judicial Hearing Simulation</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Interactive legal simulation: practice prosecution opening, defence objections under Section 63 BSA, forensic expert depositions, and presiding magistrate rulings.
              </p>
            </div>
            <button
              onClick={handleStartOrResetSim}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Session</span>
            </button>
          </div>

          {/* Dialogue Feed */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto p-3 bg-slate-950 rounded-xl border border-slate-800">
            {simDialogue.map((msg, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                  msg.speaker === 'JUDGE'
                    ? 'bg-amber-950/20 border-amber-800/40 text-amber-100'
                    : msg.speaker === 'PUBLIC_PROSECUTOR'
                    ? 'bg-blue-950/20 border-blue-800/40 text-blue-100'
                    : msg.speaker === 'DEFENCE_COUNSEL'
                    ? 'bg-purple-950/20 border-purple-800/40 text-purple-100'
                    : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                        msg.speaker === 'JUDGE'
                          ? 'bg-amber-500/30 text-amber-300'
                          : msg.speaker === 'PUBLIC_PROSECUTOR'
                          ? 'bg-blue-500/30 text-blue-300'
                          : msg.speaker === 'DEFENCE_COUNSEL'
                          ? 'bg-purple-500/30 text-purple-300'
                          : 'bg-emerald-500/30 text-emerald-300'
                      }`}
                    >
                      {msg.speaker}
                    </span>
                    <span className="font-bold text-white text-xs">{msg.speakerName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
                </div>

                <p className="text-slate-200 leading-relaxed font-sans">{msg.content}</p>

                {msg.evidentiaryReference && (
                  <div className="text-[10px] font-mono text-slate-400 bg-slate-900/60 px-2 py-1 rounded border border-slate-800 flex items-center justify-between">
                    <span>Evidence Reference: {msg.evidentiaryReference}</span>
                    {msg.objectionRaised && (
                      <span
                        className={`font-bold ${
                          msg.objectionRaised === 'OVERRULED' ? 'text-rose-400' : 'text-amber-400'
                        }`}
                      >
                        [OBJECTION: {msg.objectionRaised}]
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* User Input as Prosecutor / IO */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={simInput}
              onChange={(e) => setSimInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendSimArgument()}
              placeholder="Enter your argument as Public Prosecutor (e.g., 'Your Honour, we submit Exhibit MO-1 with Sec 63 BSA certificate proving the immutable SHA-256 hash...')"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSendSimArgument}
              disabled={isSimulating || !simInput.trim()}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs shadow-md"
            >
              {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Submit Argument</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 6: FORENSIC TECHNICAL JARGON → JUDICIAL BRIEF */}
      {/* ========================================================================= */}
      {activeMode === 'forensic_digest' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>FSL Forensic Jargon → Plain Language Judicial Briefing</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Converts complex forensic memory carves, DNA probability indices, and GC-MS toxicology assays into clear, legally admissible evidence briefs for Judges and Prosecutors.
            </p>
          </div>

          <div className="space-y-2.5">
            <textarea
              rows={4}
              value={rawForensicText}
              onChange={(e) => setRawForensicText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500 leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSynthesizeForensics}
                disabled={isSynthesizing || !rawForensicText.trim()}
                className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                {isSynthesizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generate Judicial Digest</span>
              </button>
            </div>
          </div>

          {forensicDigestOutput && (
            <div className="p-4 bg-slate-950 border border-purple-900/50 rounded-xl text-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed shadow-sm">
              {forensicDigestOutput}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 7: ELECTRONIC BENCH BOOK & LANDMARK PRECEDENTS */}
      {/* ========================================================================= */}
      {activeMode === 'precedent_benchbook' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Electronic Precedent & Judicial Bench Book</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Authoritative Supreme Court and High Court landmark decisions categorized under BNS, BNSS, BSA 2023, Electronic Evidence, and Bail Jurisprudence.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Showing {filteredPrecedents.length} Landmark Precedents
            </span>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={benchSearch}
                onChange={(e) => setBenchSearch(e.target.value)}
                placeholder="Search judgment title, citation (e.g. 2020 7 SCC 1), or legal ratio..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
              {['ALL', 'ELECTRONIC_EVIDENCE', 'BAIL_GUIDELINES', 'MANDATORY_FIR', 'FORENSIC_PROCEDURE', 'DIGITAL_PRIVACY'].map(
                (subj) => (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubject(subj)}
                    className={`px-2.5 py-1.5 text-[11px] font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
                      selectedSubject === subj
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {subj.replace(/_/g, ' ')}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Precedent Cards */}
          <div className="space-y-3.5">
            {filteredPrecedents.map((prec) => (
              <div
                key={prec.id}
                className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl space-y-3 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white font-serif">{prec.title}</h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mt-0.5">
                      <span>{prec.citation}</span>
                      <span>·</span>
                      <span className="text-slate-400">{prec.court} ({prec.year})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {prec.primarySubject.replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={() => copyToClipboard(`${prec.title} ${prec.citation}`, prec.id)}
                      className="text-slate-400 hover:text-white p-1 cursor-pointer"
                      title="Copy Citation"
                    >
                      {copiedId === prec.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 text-slate-200 leading-relaxed">
                    <strong className="text-amber-300 font-mono text-[11px]">Ratio Decidendi: </strong>
                    {prec.ratioDecidendi}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Statutory Impact: </strong>
                    {prec.statutoryImpact}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Related Acts: {prec.relatedActs.join(', ')}</span>
                  <span className="text-emerald-400 font-semibold">Binding Precedent</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
