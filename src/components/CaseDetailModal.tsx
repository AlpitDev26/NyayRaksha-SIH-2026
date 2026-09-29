import React, { useState } from 'react';
import {
  CaseFile,
  DocumentRecord,
  EvidenceItem,
  ForensicReport,
  UserRole,
  SupportedLanguage,
} from '../types';
import { TRANSLATIONS } from '../services/i18n';
import {
  X,
  Shield,
  FileText,
  Boxes,
  Microscope,
  Scale,
  Sparkles,
  Lock,
  CheckCircle,
  AlertTriangle,
  Download,
  Plus,
  ArrowRightLeft,
  Key,
  Calendar,
  User,
  MapPin,
  FileCode,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { aiLegalService, ChargeSheetAuditResult } from '../services/aiLegalService';

interface CaseDetailModalProps {
  caseFile: CaseFile;
  onClose: () => void;
  currentRole: UserRole;
  language: SupportedLanguage;
  onRefreshCase: () => void;
  onOpenCustodyTransfer: (evidence: EvidenceItem) => void;
  onOpenSubmitForensic: (caseItem: CaseFile) => void;
  onOpenAddDoc: (caseItem: CaseFile) => void;
  onOpenAddEvidence: (caseItem: CaseFile) => void;
  onOpenJudicialOrder: (caseItem: CaseFile) => void;
  onPreviewDocument: (doc: DocumentRecord) => void;
  onOpenTamperModal: (caseItem: CaseFile) => void;
}

type TabType =
  | 'overview'
  | 'documents'
  | 'evidence'
  | 'forensics'
  | 'chargesheet'
  | 'court_orders'
  | 'ai_digest';

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseFile,
  onClose,
  currentRole,
  language,
  onRefreshCase,
  onOpenCustodyTransfer,
  onOpenSubmitForensic,
  onOpenAddDoc,
  onOpenAddEvidence,
  onOpenJudicialOrder,
  onPreviewDocument,
  onOpenTamperModal,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [aiDigest, setAiDigest] = useState<string>('');
  const [isGeneratingDigest, setIsGeneratingDigest] = useState(false);
  const [auditResult, setAuditResult] = useState<ChargeSheetAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleGenerateDigest = async () => {
    setIsGeneratingDigest(true);
    try {
      const digest = await aiLegalService.generateJudicialDigest(caseFile);
      setAiDigest(digest);
    } finally {
      setIsGeneratingDigest(false);
    }
  };

  const handleRunCaseAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await aiLegalService.auditCaseForCourtFiling(caseFile);
      setAuditResult(res);
    } finally {
      setIsAuditing(false);
    }
  };

  const isTampered = caseFile.tamperStatus === 'TAMPER_ALERT';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-5xl rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {caseFile.caseNumber}
                </span>
                {caseFile.cnrNumber && (
                  <>
                    <span className="text-slate-600">·</span>
                    <span className="font-mono text-xs text-slate-400">
                      CNR: {caseFile.cnrNumber}
                    </span>
                  </>
                )}
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-300 font-medium">
                  {caseFile.courtName}
                </span>
              </div>
              <h2 className="text-base font-bold text-white line-clamp-1 font-serif mt-0.5">
                {caseFile.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenTamperModal(caseFile)}
              className="px-2.5 py-1 text-xs font-semibold text-red-300 bg-red-950/60 hover:bg-red-900/70 border border-red-800/60 rounded transition-colors cursor-pointer flex items-center gap-1"
              title="Simulate Malicious Tampering"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Test Tampering</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tamper Warning Banner inside modal */}
        {isTampered && (
          <div className="bg-red-950/90 border-b border-red-500/60 px-6 py-2.5 flex items-center justify-between text-xs text-red-200">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce shrink-0" />
              <span>CRYPTOGRAPHIC HASH MISMATCH: Document record altered outside consensus!</span>
            </div>
            <button
              onClick={() => {
                const firDoc = caseFile.documents[0];
                if (firDoc) {
                  storageService.restoreDocumentFromLedger(caseFile.id, firDoc.id);
                  onRefreshCase();
                }
              }}
              className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-[11px] cursor-pointer"
            >
              Restore from Blockchain
            </button>
          </div>
        )}

        {/* Tab Navigation Buttons */}
        <div className="px-6 bg-slate-950/60 border-b border-slate-800 flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Case Overview', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'documents', label: `Documents (${caseFile.documents.length})`, icon: <FileCode className="w-3.5 h-3.5" /> },
            { id: 'evidence', label: `Evidence Vault (${caseFile.evidenceItems.length})`, icon: <Boxes className="w-3.5 h-3.5" /> },
            { id: 'forensics', label: `Forensics FSL (${caseFile.forensicReports.length})`, icon: <Microscope className="w-3.5 h-3.5" /> },
            { id: 'chargesheet', label: 'Charge Sheet & Scrutiny', icon: <Scale className="w-3.5 h-3.5" /> },
            { id: 'court_orders', label: `Judicial Orders (${caseFile.documents.filter(d => ['BAIL_ORDER', 'JUDICIAL_WARRANT', 'COURT_ORDER_SHEET', 'FINAL_JUDGMENT'].includes(d.documentType)).length})`, icon: <Lock className="w-3.5 h-3.5" /> },
            { id: 'ai_digest', label: 'AI Judicial Digest', icon: <Sparkles className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-3.5 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-300 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-300">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Meta Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-slate-500 text-[10px] uppercase font-semibold">Police Station & State</div>
                  <div className="text-slate-100 font-medium">{caseFile.policeStation}</div>
                  <div className="text-slate-400">{caseFile.jurisdictionState}</div>
                </div>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-slate-500 text-[10px] uppercase font-semibold">Lead Investigator (IO)</div>
                  <div className="text-slate-100 font-medium">{caseFile.leadInvestigator.name}</div>
                  <div className="text-slate-400 font-mono text-[11px]">{caseFile.leadInvestigator.rank} · {caseFile.leadInvestigator.badgeId}</div>
                </div>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-slate-500 text-[10px] uppercase font-semibold">Merkle Root & Blockchain Status</div>
                  <div className="text-emerald-400 font-mono text-[11px] truncate">{caseFile.merkleRoot}</div>
                  <div className="text-slate-400 text-[10px] flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Anchored across 5 validator nodes</span>
                  </div>
                </div>
              </div>

              {/* Legal Sections Applied */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>Statutory Penal Sections Charged</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {caseFile.legalActsAndSections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="px-2.5 py-1 bg-slate-900 border border-slate-700/80 rounded text-slate-300 font-mono text-xs"
                    >
                      {sec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Accused & Complainant Profiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                    <User className="w-4 h-4 text-red-400" />
                    <span>Accused Persons ({caseFile.accused.length})</span>
                  </div>
                  <div className="space-y-2">
                    {caseFile.accused.map((acc, i) => (
                      <div key={i} className="p-2.5 bg-slate-900 border border-slate-800 rounded flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">{acc.name}</div>
                          {acc.alias && <div className="text-[11px] text-slate-400">Alias: {acc.alias}</div>}
                          {acc.custodyLocation && <div className="text-[10px] text-slate-500">{acc.custodyLocation}</div>}
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-800 text-amber-300 border border-slate-700">
                          {acc.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>Complainant / Informant</span>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded space-y-1">
                    <div className="font-semibold text-white">{caseFile.complainant.name}</div>
                    <div className="text-slate-400">{caseFile.complainant.contact}</div>
                    <div className="text-[11px] text-slate-500">{caseFile.complainant.address}</div>
                  </div>
                </div>
              </div>

              {/* Hearing Schedule */}
              {caseFile.hearingDates.length > 0 && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>National Court Cause List & Hearing Record</span>
                  </div>
                  <div className="space-y-1.5">
                    {caseFile.hearingDates.map((h, i) => (
                      <div key={i} className="p-2.5 bg-slate-900 border border-slate-800 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-mono text-amber-400 font-semibold">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{h.date}</span>
                        </div>
                        <div className="flex-1 text-slate-200">{h.purpose}</div>
                        <div className="text-slate-400 text-[11px]">{h.bench}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Encrypted Case Document Repository
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Documents are encrypted with AES-256-GCM. SHA-256 integrity digests are anchored on the blockchain.
                  </p>
                </div>
                <button
                  onClick={() => onOpenAddDoc(caseFile)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload & Anchor Document</span>
                </button>
              </div>

              {caseFile.documents.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-lg border border-slate-800 text-slate-500">
                  No documents anchored yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {caseFile.documents.map((doc) => {
                    const isDocTampered = doc.tamperState === 'TAMPERED';
                    return (
                      <div
                        key={doc.id}
                        className={`p-3.5 bg-slate-950 border rounded-lg transition-colors space-y-2 ${
                          isDocTampered ? 'border-red-500/80 bg-red-950/20' : 'border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <FileText className={`w-4 h-4 mt-0.5 ${isDocTampered ? 'text-red-400' : 'text-amber-400'}`} />
                            <div>
                              <div className="font-semibold text-white flex items-center gap-2">
                                <span>{doc.title}</span>
                                <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.2 bg-slate-900 rounded border border-slate-700">
                                  {doc.documentType}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                                <span>Uploaded by: {doc.uploadedBy.name} ({doc.uploadedBy.department})</span>
                                <span>·</span>
                                <span>Size: {doc.fileSizeKb} KB</span>
                                <span>·</span>
                                <span>Format: {doc.fileFormat}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => onPreviewDocument(doc)}
                              className="px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-400" />
                              <span>View Verified Copy</span>
                            </button>
                          </div>
                        </div>

                        {/* Hash & Signature Verification Ribbon */}
                        <div className="p-2 bg-slate-900/90 rounded border border-slate-800 text-[11px] font-mono space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">SHA-256 Digest:</span>
                            <span className={isDocTampered ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                              {doc.sha256Hash}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Vault Storage URI:</span>
                            <span className="text-slate-300 truncate max-w-sm">{doc.storageUri}</span>
                          </div>
                          {doc.blockchainTxId && (
                            <div className="flex items-center justify-between text-slate-400">
                              <span>Blockchain Anchor Tx:</span>
                              <span className="text-purple-400 truncate max-w-sm">{doc.blockchainTxId}</span>
                            </div>
                          )}
                          {doc.digitalSignatures.length > 0 && (
                            <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-slate-300">
                              <span className="text-slate-400">Digital Certificate:</span>
                              <span className="text-amber-300">
                                {doc.digitalSignatures[0].signerName} ({doc.digitalSignatures[0].certificateId})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EVIDENCE & CHAIN OF CUSTODY */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Physical & Digital Evidence Locker
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Dual-seal tamper-evident physical & electronic evidence exhibits with unbroken cryptographic chain of custody.
                  </p>
                </div>
                <button
                  onClick={() => onOpenAddEvidence(caseFile)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Evidence Item</span>
                </button>
              </div>

              {caseFile.evidenceItems.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-lg border border-slate-800 text-slate-500">
                  No physical or digital evidence registered yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {caseFile.evidenceItems.map((ev) => (
                    <div key={ev.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-400 text-xs">
                              {ev.evidenceCode}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700">
                              {ev.category}
                            </span>
                            <span className="text-slate-600">·</span>
                            <span className="font-mono text-[10px] text-emerald-400">
                              Tamper Seal: {ev.tamperSealNumber}
                            </span>
                          </div>
                          <div className="font-semibold text-white text-sm mt-1">{ev.title}</div>
                          <div className="text-slate-400 mt-0.5">{ev.description}</div>
                        </div>

                        <button
                          onClick={() => onOpenCustodyTransfer(ev)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Transfer Custody</span>
                        </button>
                      </div>

                      {/* Chain of Custody Timeline */}
                      <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg space-y-2">
                        <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                          <span>Chain of Custody Handover Log</span>
                          <span className="font-mono text-[10px] text-slate-500">
                            Current Custodian: {ev.currentCustodian} ({ev.custodianDepartment})
                          </span>
                        </div>

                        {ev.chainOfCustody.length === 0 ? (
                          <div className="text-[11px] text-slate-500">Initial seizure custody logged.</div>
                        ) : (
                          <div className="space-y-2 pt-1">
                            {ev.chainOfCustody.map((coc, idx) => (
                              <div key={idx} className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] space-y-1">
                                <div className="flex items-center justify-between text-slate-400 font-mono">
                                  <span>{coc.timestamp.replace('T', ' ').slice(0, 19)}</span>
                                  <span className="text-emerald-400">SEAL: {coc.sealCondition}</span>
                                </div>
                                <div className="text-slate-200">
                                  <span className="text-slate-400">From:</span> {coc.fromOfficer} ({coc.fromDepartment}) →{' '}
                                  <span className="text-slate-400">To:</span> {coc.toOfficer} ({coc.toDepartment})
                                </div>
                                <div className="text-slate-400 italic">Purpose: {coc.purpose}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FORENSICS FSL */}
          {activeTab === 'forensics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Forensic Science Laboratory (FSL) Reports
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Scientific reports under Sec 293 CrPC / Sec 329 BNSS with certified raw extraction hashes.
                  </p>
                </div>
                <button
                  onClick={() => onOpenSubmitForensic(caseFile)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Submit FSL Report</span>
                </button>
              </div>

              {caseFile.forensicReports.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-lg border border-slate-800 text-slate-500">
                  No forensic laboratory examination reports submitted yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {caseFile.forensicReports.map((fsl) => (
                    <div key={fsl.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-purple-400 text-xs">
                              {fsl.fslRefNumber}
                            </span>
                            <span className="text-slate-600">·</span>
                            <span className="text-slate-300">{fsl.laboratory}</span>
                          </div>
                          <div className="font-semibold text-white text-sm mt-1">{fsl.testType}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Examiner: {fsl.examinerName} ({fsl.examinerBadge})
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-emerald-400 font-mono font-bold text-sm">
                            {fsl.confidenceScore}% Match
                          </div>
                          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-800 text-emerald-300 border border-slate-700">
                            {fsl.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900 rounded border border-slate-800 text-xs space-y-2">
                        <div>
                          <span className="font-semibold text-slate-300">Methodology: </span>
                          <span className="text-slate-400">{fsl.methodology}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-300">Findings: </span>
                          <span className="text-slate-200">{fsl.findings}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-300">Scientific Conclusion: </span>
                          <span className="text-amber-200">{fsl.conclusion}</span>
                        </div>
                      </div>

                      <div className="p-2 bg-slate-900 font-mono text-[10px] text-slate-400 rounded flex flex-col gap-1">
                        <div>Report SHA-256: <span className="text-purple-300">{fsl.reportHash}</span></div>
                        <div>Raw Extraction Hash: <span className="text-slate-300">{fsl.rawExtractionHash}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CHARGE SHEET & SCRUTINY */}
          {activeTab === 'chargesheet' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Final Police Report & Prosecution Scrutiny (Sec 173 CrPC / 193 BNSS)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Evidentiary review, witness cited list, and statutory sanction check before judicial filing.
                  </p>
                </div>
                <button
                  onClick={handleRunCaseAudit}
                  disabled={isAuditing}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/60 rounded transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isAuditing ? 'Auditing Dossier...' : 'Run AI Evidentiary Audit'}</span>
                </button>
              </div>

              {auditResult && (
                <div className="p-4 bg-slate-950 border border-indigo-900/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="font-bold text-white">AI Case Readiness Audit Score</span>
                    </div>
                    <div className="font-mono text-lg font-bold text-amber-400">
                      {auditResult.overallReadinessScore} / 100
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">{auditResult.summaryVerdict}</p>

                  {auditResult.deficiencies.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="text-[11px] font-semibold text-red-300 uppercase">
                        Evidentiary & Procedural Defects to Rectify:
                      </div>
                      {auditResult.deficiencies.map((def, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-900 rounded border border-slate-800 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-red-300">{def.category}</span>
                            <span className="px-1.5 py-0.2 text-[10px] font-mono bg-red-950 text-red-400 rounded">
                              {def.severity}
                            </span>
                          </div>
                          <div className="text-slate-300">{def.description}</div>
                          <div className="text-emerald-400 text-[11px]">→ Suggested Remedy: {def.suggestedRemedy}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {caseFile.chargeSheetDraft ? (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Charge Sheet Draft Details</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-800 text-amber-300 border border-slate-700">
                      Prosecution Status: {caseFile.chargeSheetDraft.prosecutionCognizanceReview}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-400">Sections Charged: </span>
                      <span>{caseFile.chargeSheetDraft.sectionsCharged.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400">Summary of Evidence: </span>
                      <p className="text-slate-300 mt-1">{caseFile.chargeSheetDraft.summaryOfEvidence}</p>
                    </div>
                    {caseFile.chargeSheetDraft.prosecutorNotes && (
                      <div className="p-2.5 bg-slate-900 rounded border border-slate-800 mt-2">
                        <span className="font-semibold text-amber-400">Prosecutor Scrutiny Remarks: </span>
                        <span className="text-slate-300">{caseFile.chargeSheetDraft.prosecutorNotes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-950 rounded-lg border border-slate-800 text-slate-500">
                  Charge sheet draft not compiled yet. IO investigation in progress.
                </div>
              )}
            </div>
          )}

          {/* TAB 6: COURT ORDERS & WARRANTS */}
          {activeTab === 'court_orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Judicial Orders, Bail Rulings & Final Judgments
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Court order sheets with judicial magistrate digital seal and public verifiable certificate.
                  </p>
                </div>
                <button
                  onClick={() => onOpenJudicialOrder(caseFile)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Issue Judicial Order / Judgment</span>
                </button>
              </div>

              {caseFile.judicialJudgment && (
                <div className="p-4 bg-slate-950 border border-amber-500/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 text-sm flex items-center gap-2">
                      <Scale className="w-4 h-4" />
                      <span>Certified Final Judgment</span>
                    </span>
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-amber-400 text-slate-950 rounded">
                      {caseFile.judicialJudgment.verdict}
                    </span>
                  </div>
                  <div className="text-slate-200 text-xs">
                    Presiding Judge: {caseFile.judicialJudgment.presidingJudge} (Delivered on: {caseFile.judicialJudgment.deliveryDate})
                  </div>
                  {caseFile.judicialJudgment.sentenceSummary && (
                    <div className="p-2.5 bg-slate-900 rounded text-amber-200 text-xs">
                      {caseFile.judicialJudgment.sentenceSummary}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {caseFile.documents
                  .filter((d) => ['BAIL_ORDER', 'JUDICIAL_WARRANT', 'COURT_ORDER_SHEET', 'FINAL_JUDGMENT'].includes(d.documentType))
                  .map((orderDoc) => (
                    <div key={orderDoc.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-white">{orderDoc.title}</div>
                        <button
                          onClick={() => onPreviewDocument(orderDoc)}
                          className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 cursor-pointer"
                        >
                          View Certified Copy
                        </button>
                      </div>
                      <div className="text-slate-300 text-xs line-clamp-2">{orderDoc.summary}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 7: AI JUDICIAL DIGEST */}
          {activeTab === 'ai_digest' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>AI Judicial Bench Brief</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Automated, authoritative summary of factual matrix, forensic corroboration, and statutory citations.
                  </p>
                </div>
                <button
                  onClick={handleGenerateDigest}
                  disabled={isGeneratingDigest}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingDigest ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingDigest ? 'Synthesizing...' : 'Generate Fresh Digest'}</span>
                </button>
              </div>

              {aiDigest ? (
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                  {aiDigest}
                </div>
              ) : (
                <div className="p-12 text-center bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                  <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
                  <div className="text-sm font-semibold text-slate-300">
                    Instant AI Judicial Brief Generation
                  </div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Click the button above to synthesize all case diary entries, forensic findings, and witness statements into a concise judicial bench docket.
                  </p>
                  <button
                    onClick={handleGenerateDigest}
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer"
                  >
                    Generate Judicial Brief Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
