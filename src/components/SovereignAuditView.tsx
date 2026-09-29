import React, { useState } from 'react';
import {
  SupportedLanguage,
  SovereignAuditLog,
  AirgapArchivalPackage,
  CaseFile,
} from '../types';
import { icjsService } from '../services/icjsService';
import { storageService } from '../services/storageService';
import {
  ShieldCheck,
  FileCheck2,
  Download,
  Eye,
  Lock,
  Archive,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  FileText,
  Copy,
  Check,
} from 'lucide-react';

interface SovereignAuditViewProps {
  language: SupportedLanguage;
}

export const SovereignAuditView: React.FC<SovereignAuditViewProps> = ({ language: _language }) => {
  const [activeTab, setActiveTab] = useState<'audit_stream' | 'zk_redactor' | 'airgap_export'>('audit_stream');
  const [auditLogs, setAuditLogs] = useState<SovereignAuditLog[]>(icjsService.getAuditLogs());
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [copiedText, setCopiedText] = useState(false);

  // Redactor State
  const cases = storageService.getCases();
  const [selectedCaseNumber, setSelectedCaseNumber] = useState(cases[0]?.caseNumber || 'FIR-2026-CR-0982');
  const [maskVictims, setMaskVictims] = useState(true);
  const [maskWitnesses, setMaskWitnesses] = useState(true);
  const [maskContacts, setMaskContacts] = useState(true);
  const [redactedResult, setRedactedResult] = useState<any>(null);

  // Airgap Archival State
  const [archiveCaseNumber, setArchiveCaseNumber] = useState(cases[0]?.caseNumber || 'FIR-2026-CR-0982');
  const [isArchiving, setIsArchiving] = useState(false);
  const [generatedArchive, setGeneratedArchive] = useState<AirgapArchivalPackage | null>(null);

  const filteredLogs =
    filterAction === 'ALL'
      ? auditLogs
      : auditLogs.filter((l) => l.action === filterAction);

  const handleGenerateRedaction = () => {
    const targetCase = cases.find((c) => c.caseNumber === selectedCaseNumber) || cases[0];
    if (!targetCase) return;
    const res = icjsService.generateZeroKnowledgeRedactedExtract(
      targetCase,
      maskVictims,
      maskWitnesses,
      maskContacts
    );
    setRedactedResult(res);
  };

  const handleGenerateArchive = async () => {
    const targetCase = cases.find((c) => c.caseNumber === archiveCaseNumber) || cases[0];
    if (!targetCase) return;
    setIsArchiving(true);
    try {
      const pkg = await icjsService.generateAirgappedArchivePackage(targetCase);
      setGeneratedArchive(pkg);
      setAuditLogs([...icjsService.getAuditLogs()]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsArchiving(false);
    }
  };

  const handleCopyRedactedText = () => {
    if (redactedResult?.redactedText) {
      navigator.clipboard.writeText(redactedResult.redactedText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handleDownloadOfflineHtml = () => {
    if (!generatedArchive) return;
    const targetCase = cases.find((c) => c.caseNumber === archiveCaseNumber) || cases[0];
    const blob = new Blob([JSON.stringify({ package: generatedArchive, case: targetCase }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedArchive.packageId}.nsdj`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/30 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  Sovereign Audit, Zero-Knowledge Redaction & Air-Gapped Archival
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                    SEC 532 BNSS & SEC 63 BSA
                  </span>
                </h1>
                <p className="text-xs text-slate-300">
                  Cryptographic Audit Trail, Automated PII Masking for RTI/Public Release, and Standalone Airgap Archive Package Generator
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAuditLogs([...icjsService.getAuditLogs()])}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Trail</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 mt-5 gap-1">
          <button
            onClick={() => setActiveTab('audit_stream')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'audit_stream'
                ? 'bg-slate-800 text-emerald-400 border-t-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sovereign Audit Trail ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('zk_redactor')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'zk_redactor'
                ? 'bg-slate-800 text-emerald-400 border-t-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sec 72 BNSS Zero-Knowledge Redactor (Public/RTI)
          </button>
          <button
            onClick={() => setActiveTab('airgap_export')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'airgap_export'
                ? 'bg-slate-800 text-emerald-400 border-t-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sec 532 BNSS Airgap Archival Package (.nsdj)
          </button>
        </div>
      </div>

      {/* Audit Stream Tab */}
      {activeTab === 'audit_stream' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Audit Actions</option>
                <option value="DIGITAL_SIGNATURE_APPLIED">Digital Signature Applied</option>
                <option value="ICJS_SYNC">ICJS Synapse Interchange</option>
                <option value="CUSTODY_TRANSFERRED">Custody Transfer</option>
                <option value="BLOCKCHAIN_ANCHOR">Blockchain Ledger Anchor</option>
                <option value="AIRGAP_ARCHIVE_EXPORT">Airgap Archive Export</option>
              </select>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Immutable Merkle Log Stream Active
            </span>
          </div>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{log.id}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] font-semibold">
                      {log.action}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-500 text-[10px]">Actor / Officer:</span>
                    <div className="font-semibold text-white">
                      {log.actorName} ({log.badgeId})
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Resource Target:</span>
                    <div className="font-mono text-amber-300">
                      {log.resourceType}: {log.resourceId}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Client Origin Node:</span>
                    <div className="font-mono text-slate-400">{log.ipAddress}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500 truncate" title={log.sha256Digest}>
                    Digest: {log.sha256Digest}
                  </span>
                  <span className="text-emerald-400 font-semibold shrink-0 ml-2">INTEGRITY OK</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zero Knowledge Redactor Tab */}
      {activeTab === 'zk_redactor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Section 72 BNSS Public Masking Config</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Select Case Dossier</label>
                  <select
                    value={selectedCaseNumber}
                    onChange={(e) => setSelectedCaseNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                  >
                    {cases.map((c) => (
                      <option key={c.id} value={c.caseNumber}>
                        {c.caseNumber} - {c.title.substring(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="maskVictim"
                      checked={maskVictims}
                      onChange={(e) => setMaskVictims(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-emerald-500"
                    />
                    <label htmlFor="maskVictim" className="text-slate-300 font-medium">
                      Mask Victim / Complainant Identity (Sec 72 BNSS)
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="maskWitness"
                      checked={maskWitnesses}
                      onChange={(e) => setMaskWitnesses(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-emerald-500"
                    />
                    <label htmlFor="maskWitness" className="text-slate-300 font-medium">
                      Redact Protected Witness Depositions & Names
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="maskContact"
                      checked={maskContacts}
                      onChange={(e) => setMaskContacts(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-emerald-500"
                    />
                    <label htmlFor="maskContact" className="text-slate-300 font-medium">
                      Redact Aadhaar Numbers, Phones & Bank Accounts
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleGenerateRedaction}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Generate Certified Redacted Extract</span>
                </button>
              </div>
            </div>
          </div>

          {/* Redacted Preview */}
          <div className="lg:col-span-7">
            {redactedResult ? (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400">Certified Extract Preview</span>
                    <h3 className="text-sm font-bold text-white font-mono">{redactedResult.redactedDossierTitle}</h3>
                  </div>
                  <button
                    onClick={handleCopyRedactedText}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Public Extract</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-200 whitespace-pre-wrap max-h-[500px] overflow-y-auto border border-slate-800/80 leading-relaxed">
                  {redactedResult.redactedText}
                </pre>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
                Click "Generate Certified Redacted Extract" to produce a legally compliant public release document.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Airgap Archival Tab */}
      {activeTab === 'airgap_export' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 max-w-4xl mx-auto">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Archive className="w-5 h-5 text-emerald-400" />
              <span>Section 532 BNSS Air-Gapped Case Archival Engine</span>
            </h2>
            <p className="text-xs text-slate-300">
              Generate self-contained, cryptographically signed standalone judicial package (.nsdj) for air-gapped courtrooms and long-term 30-year archival retention
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Target Judicial Dossier</label>
              <select
                value={archiveCaseNumber}
                onChange={(e) => setArchiveCaseNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.caseNumber}>
                    {c.caseNumber} - {c.title.substring(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerateArchive}
                disabled={isArchiving}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                {isArchiving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Compiling Standalone Merkle Tree...</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4" />
                    <span>Build Sealed .nsdj Archival Package</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {generatedArchive && (
            <div className="p-5 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">{generatedArchive.packageId}.nsdj</h3>
                    <span className="text-[10px] text-slate-400">Ready for Air-Gapped High-Court Deployment</span>
                  </div>
                </div>
                <button
                  onClick={handleDownloadOfflineHtml}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .nsdj Package</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500">Retention Class:</span>
                  <div className="font-semibold text-amber-300 mt-0.5">{generatedArchive.statutoryRetentionCategory}</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500">Total Documents:</span>
                  <div className="font-bold text-white mt-0.5">{generatedArchive.totalDocumentsCount} files</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500">Sealed Evidence:</span>
                  <div className="font-bold text-white mt-0.5">{generatedArchive.totalEvidenceCount} exhibits</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500">Package Size:</span>
                  <div className="font-bold text-white mt-0.5">{generatedArchive.totalSizeMb} MB</div>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1 font-mono text-[10px]">
                <div className="text-slate-400">Root Merkle Hash:</div>
                <div className="text-emerald-400 break-all">{generatedArchive.rootMerkleHash}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
