import React from 'react';
import { CaseFile, SupportedLanguage, CaseStage, UserRole } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import {
  FolderOpen,
  FileCheck2,
  Boxes,
  Database,
  Scale,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  Lock,
  FileText,
  Activity,
} from 'lucide-react';

interface DashboardViewProps {
  cases: CaseFile[];
  language: SupportedLanguage;
  currentRole: UserRole;
  blockHeight: number;
  onSelectCase: (caseItem: CaseFile) => void;
  onNavigateTo: (tab: any) => void;
  onOpenNewFir: () => void;
  onOpenVerifier: () => void;
  onRunAudit: () => void;
  chainValid: boolean;
}

const STAGE_ORDER: CaseStage[] = [
  'fir_registered',
  'investigation',
  'evidence_collected',
  'forensic_analysis',
  'charge_sheet_draft',
  'prosecution_scrutiny',
  'court_efiling',
  'judicial_trial',
  'judgment_delivered',
  'archived',
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  cases,
  language,
  currentRole,
  blockHeight,
  onSelectCase,
  onNavigateTo,
  onOpenNewFir,
  onOpenVerifier,
  onRunAudit,
  chainValid,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const totalDocuments = cases.reduce((sum, c) => sum + c.documents.length, 0);
  const totalEvidence = cases.reduce((sum, c) => sum + c.evidenceItems.length, 0);
  const totalHearings = cases.reduce((sum, c) => sum + c.hearingDates.length, 0);
  const tamperedCases = cases.filter(c => c.tamperStatus === 'TAMPER_ALERT');

  const stageCounts = STAGE_ORDER.map(stage => ({
    stage,
    count: cases.filter(c => c.stage === stage).length,
  }));

  const recentCases = [...cases].slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Welcome / Sovereign Context Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 p-5 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CENTRAL INTEGRITY NODE ACTIVE · NIC SECURE CERTIFIED</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1 font-serif">
            NyayRaksha · Sovereign Digital Justice Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            NyayRaksha (न्यायरक्षा): Interoperable, tamper-evident case lifecycle backbone connecting Police, Forensic Laboratories (CFSL/NFSU),
            Directorate of Prosecution, and Judicial Courts via encrypted storage & SHA-256 cryptographic blockchain anchoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenNewFir}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.btnNewFir}</span>
          </button>
          <button
            onClick={onOpenVerifier}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.btnVerifyDocument}</span>
          </button>
        </div>
      </div>

      {/* Tamper Alert Warning Banner if tampered */}
      {(!chainValid || tamperedCases.length > 0) && (
        <div className="p-4 bg-red-950/60 border border-red-500/50 rounded-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
            <div>
              <div className="text-sm font-semibold text-red-200">
                CRITICAL INTEGRITY VIOLATION DETECTED
              </div>
              <div className="text-xs text-red-300/80">
                Unauthorised document alteration detected outside cryptographic consensus. Document SHA-256 mismatch flagged against immutable blockchain ledger.
              </div>
            </div>
          </div>
          <button
            onClick={onRunAudit}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded transition-colors cursor-pointer shrink-0"
          >
            Inspect Corrupted Block
          </button>
        </div>
      )}

      {/* Primary Quantitative Metric Cards - Tabular Figures */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.statTotalCases}</span>
            <FolderOpen className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-2">
            {cases.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Active across 4 states</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.statAnchoredDocs}</span>
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-2">
            {totalDocuments}
          </div>
          <div className="text-[11px] text-emerald-400/90 mt-1">100% SHA-256 anchored</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.statEvidenceItems}</span>
            <Boxes className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-2">
            {totalEvidence}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Dual-seal malkhana custody</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.statChainIntegrity}</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-2">
            #{blockHeight}
          </div>
          <div className="text-[11px] text-purple-300 mt-1">Sovereign Proof-of-Authority</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.statCourtHearings}</span>
            <Scale className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-2">
            {totalHearings}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Listed on National Cause List</div>
        </div>
      </div>

      {/* Case Lifecycle Pipeline Visual Flow */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide">
              End-to-End Justice Lifecycle Progression
            </h2>
          </div>
          <button
            onClick={() => onNavigateTo('cases')}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>View Full Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 pt-2">
          {stageCounts.map(({ stage, count }, idx) => {
            const stageName = stage.replace(/_/g, ' ').toUpperCase();
            return (
              <div
                key={stage}
                onClick={() => onNavigateTo('cases')}
                className="p-2.5 bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 rounded flex flex-col justify-between transition-colors cursor-pointer group"
              >
                <div className="text-[10px] font-mono text-slate-400 group-hover:text-amber-300 truncate">
                  0{idx + 1}. {stageName}
                </div>
                <div className="text-lg font-bold font-mono tabular-nums text-white mt-2 group-hover:text-amber-400">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Grid: Priority Active Cases & Architectural Integrity Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Case Dossiers */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-amber-400" />
              <span>High Priority Case Files</span>
            </h2>
            <button
              onClick={() => onNavigateTo('cases')}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Browse All ({cases.length})
            </button>
          </div>

          <div className="space-y-2">
            {recentCases.map((caseItem) => (
              <div
                key={caseItem.id}
                onClick={() => onSelectCase(caseItem)}
                className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-lg transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-semibold text-amber-400">
                        {caseItem.caseNumber}
                      </span>
                      {caseItem.cnrNumber && (
                        <>
                          <span className="text-slate-600">·</span>
                          <span className="font-mono text-slate-400 text-[11px]">
                            CNR: {caseItem.cnrNumber}
                          </span>
                        </>
                      )}
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 text-[11px] truncate">
                        {caseItem.policeStation}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-100 mt-1 line-clamp-1">
                      {caseItem.title}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-800 text-amber-300 border border-slate-700">
                      {caseItem.stage.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
                  <span>Docs: {caseItem.documents.length}</span>
                  <span>Exhibits: {caseItem.evidenceItems.length}</span>
                  <span>Forensic Reports: {caseItem.forensicReports.length}</span>
                  <span className="text-slate-400">
                    Lead: {caseItem.leadInvestigator.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Sovereign Security Architecture & Quick Tools */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Sovereign Storage & Ledger Matrix</span>
            </h2>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <div className="font-semibold text-emerald-400">Encrypted Document Vault</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Large binaries, PDFs, forensic disk images, and video exhibits are encrypted client-side with AES-256-GCM.
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <div className="font-semibold text-purple-400">SHA-256 Merkle Ledger</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Only 64-character SHA-256 digest + digital certificate signatures are committed to the immutable blockchain, preventing chain bloat.
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <div className="font-semibold text-amber-400">Multi-Agency Chain of Custody</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Every handover between Police, CFSL, Prosecution, and Court is dual-signed with PKI certificates.
                </div>
              </div>
            </div>
          </div>

          {/* Phase 6: ICJS 2.0 & Statutory Clocks Hub */}
          <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-900/40 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>ICJS 2.0 Sovereign Grid</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">5 Pillars Live</span>
            </div>
            <p className="text-xs text-slate-400">
              Synchronized data bus connecting Police CCTNS, Forensics, Prosecution, e-Courts 4.0 & e-Prisons.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onNavigateTo('icjs_grid')}
                className="py-1.5 text-xs font-medium text-indigo-200 bg-indigo-950/80 hover:bg-indigo-900/80 border border-indigo-700/50 rounded transition-colors cursor-pointer text-center"
              >
                ICJS Synapses →
              </button>
              <button
                onClick={() => onNavigateTo('summons_warrants')}
                className="py-1.5 text-xs font-medium text-amber-200 bg-amber-950/80 hover:bg-amber-900/80 border border-amber-700/50 rounded transition-colors cursor-pointer text-center"
              >
                e-Summons →
              </button>
            </div>
          </div>

          {/* Quick AI Scrutiny Tool Launch Card */}
          <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-900/40 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Legal Section Classifier</span>
            </div>
            <p className="text-xs text-slate-400">
              Paste an incident narrative to instantly map relevant Bharatiya Nyaya Sanhita (BNS) & IT Act sections.
            </p>
            <button
              onClick={() => onNavigateTo('ai_legal')}
              className="w-full py-1.5 text-xs font-medium text-indigo-200 bg-indigo-950/80 hover:bg-indigo-900/80 border border-indigo-700/50 rounded transition-colors cursor-pointer text-center"
            >
              Open AI Legal Suite →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
