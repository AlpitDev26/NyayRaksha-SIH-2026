import React, { useState } from 'react';
import { CaseFile, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { storageService } from '../services/storageService';
import { aiLegalService, ChargeSheetAuditResult } from '../services/aiLegalService';
import {
  Briefcase,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  FileCheck2,
  Scale,
  Search,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface ProsecutionViewProps {
  cases: CaseFile[];
  language: SupportedLanguage;
  onSelectCase: (caseItem: CaseFile) => void;
  onRefresh: () => void;
}

export const ProsecutionView: React.FC<ProsecutionViewProps> = ({
  cases,
  language,
  onSelectCase,
  onRefresh,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [auditResults, setAuditResults] = useState<Record<string, ChargeSheetAuditResult>>({});
  const [isAuditing, setIsAuditing] = useState(false);
  const [prosecutorNotes, setProsecutorNotes] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'APPROVED' | 'AMENDMENT_REQUIRED'>('APPROVED');

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const handleRunAudit = async (caseItem: CaseFile) => {
    setIsAuditing(true);
    try {
      const res = await aiLegalService.auditCaseForCourtFiling(caseItem);
      setAuditResults((prev) => ({ ...prev, [caseItem.id]: res }));
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSaveScrutiny = async () => {
    if (!activeCase) return;
    await storageService.submitChargeSheet(activeCase.id, {
      sectionsCharged: activeCase.legalActsAndSections,
      summaryOfEvidence: activeCase.chargeSheetDraft?.summaryOfEvidence || 'Comprehensive witness depositions and forensic corroboration.',
      prosecutionCognizanceReview: reviewStatus,
      prosecutorNotes: prosecutorNotes || 'Examined and vetted by Public Prosecutor. Evidence is sufficient for trial under Bharatiya Nagarik Suraksha Sanhita.',
    });
    onRefresh();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight font-serif flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-amber-400" />
          <span>Directorate of Prosecution (DoP) Scrutiny Desk</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Prosecution sanction, charge-sheet legal vetting, evidentiary loophole scanning, and trial readiness review.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Docket Queue */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Pending Scrutiny Docket ({cases.length})
          </div>

          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {cases.map((c) => {
              const isSelected = c.id === activeCase?.id;
              const hasDraft = !!c.chargeSheetDraft;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 text-white'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-amber-400">
                      {c.caseNumber}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-950 rounded text-slate-400 border border-slate-800">
                      {c.stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-xs font-medium line-clamp-1">{c.title}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span>Docs: {c.documents.length}</span>
                    <span>Exhibits: {c.evidenceItems.length}</span>
                    <span>FSL: {c.forensicReports.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Active Case Scrutiny Panel */}
        {activeCase && (
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-amber-400">{activeCase.caseNumber}</span>
                    {activeCase.cnrNumber && (
                      <span className="font-mono text-slate-400">· CNR: {activeCase.cnrNumber}</span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-white font-serif mt-1">
                    {activeCase.title}
                  </h2>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Investigating Agency: {activeCase.policeStation} · Lead: {activeCase.leadInvestigator.name}
                  </div>
                </div>

                <button
                  onClick={() => handleRunAudit(activeCase)}
                  disabled={isAuditing}
                  className="px-3.5 py-2 text-xs font-semibold text-indigo-200 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/60 rounded transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>{isAuditing ? 'Auditing Evidence...' : 'Run AI Loophole Audit'}</span>
                </button>
              </div>

              {/* AI Audit Results */}
              {auditResults[activeCase.id] && (
                <div className="p-4 bg-slate-950 border border-indigo-900/60 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>Evidentiary Sufficiency & Statutory Compliance Audit</span>
                    </span>
                    <span className="font-mono font-bold text-sm text-amber-400">
                      Score: {auditResults[activeCase.id].overallReadinessScore} / 100
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {auditResults[activeCase.id].summaryVerdict}
                  </p>

                  {auditResults[activeCase.id].deficiencies.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      {auditResults[activeCase.id].deficiencies.map((def, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-900 rounded border border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between text-red-300 font-semibold">
                            <span>{def.category}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-red-950 rounded">
                              {def.severity}
                            </span>
                          </div>
                          <div className="text-slate-300">{def.description}</div>
                          <div className="text-emerald-400 text-[11px]">→ Remedy: {def.suggestedRemedy}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Statutory Penal Sections Vetted */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <span className="font-semibold text-slate-200 text-xs">Penal Sections under Review</span>
                <div className="flex flex-wrap gap-2">
                  {activeCase.legalActsAndSections.map((s, idx) => (
                    <div key={idx} className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-amber-300 font-mono text-xs">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Prosecution Sanction Form */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                <span className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Public Prosecutor Scrutiny Decision & Notes</span>
                </span>

                <div>
                  <label className="block text-slate-400 text-xs mb-1">Scrutiny Determination</label>
                  <select
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="APPROVED">APPROVE FOR COURT E-FILING (Cognizance Recommended)</option>
                    <option value="AMENDMENT_REQUIRED">RETURN TO IO FOR FURTHER INVESTIGATION / RECTIFICATION</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1">Prosecution Vetting Remarks *</label>
                  <textarea
                    rows={3}
                    value={prosecutorNotes}
                    onChange={(e) => setProsecutorNotes(e.target.value)}
                    placeholder="Enter legal sanction notes, evidentiary reliability assessment, and trial strategy..."
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => onSelectCase(activeCase)}
                    className="text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Inspect Full Evidence Dossier →
                  </button>

                  <button
                    onClick={handleSaveScrutiny}
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Commit Scrutiny Sanction</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
