import React, { useState } from 'react';
import {
  FolderLock,
  Download,
  QrCode,
  ShieldCheck,
  FileCheck2,
  Send,
  UserCheck,
  Clock,
  ExternalLink,
  Coins,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { phase12Service } from '../services/phase12Service';
import { CitizenJusticeELockerRecord } from '../types';

export const CitizenJusticeELockerView: React.FC = () => {
  const [records, setRecords] = useState<CitizenJusticeELockerRecord[]>(phase12Service.getCitizenELockerRecords());
  const [selectedRecord, setSelectedRecord] = useState<CitizenJusticeELockerRecord>(records[0] || null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState<boolean>(false);
  const [newRequestType, setNewRequestType] = useState<
    'CERTIFIED_COPY_BSA_63' | 'PRIVATE_COMPLAINT_BNSS_223' | 'VICTIM_COMPENSATION_BNSS_396' | 'LEGAL_AID_APPLICATION_BNSS_340'
  >('CERTIFIED_COPY_BSA_63');
  const [caseRef, setCaseRef] = useState<string>('DL-01-2026-CR-0041');
  const [docTitle, setDocTitle] = useState<string>('Certified Copy of Forensic Report & Chargesheet (Sec 193 BNSS)');
  const [jurisdiction, setJurisdiction] = useState<string>('Patiala House Sessions Court, New Delhi');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredRecords = records.filter(
    (r) =>
      r.caseNumberRef.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.certifiedDocumentTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.requestId.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await phase12Service.issueCitizenELockerDocument({
      citizenAadhaarVaultToken: `AV-TOKEN-${Math.floor(1000 + Math.random() * 9000)}-2026-VAULT`,
      citizenNameMasked: 'A*** K*** S***',
      mobileLinkedMasked: 'XXXXXX9012',
      requestType: newRequestType,
      caseNumberRef: caseRef,
      courtJurisdiction: jurisdiction,
      certifiedDocumentTitle: docTitle,
      issuingJudgeName: 'Registrar (Judicial) / CJM Bench',
      status: 'ISSUED_AND_AVAILABLE',
      downloadExpiryTimestamp: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const updated = phase12Service.getCitizenELockerRecords();
    setRecords(updated);
    setSelectedRecord(created);
    setIsNewRequestModalOpen(false);
    setToastMessage(`Digitally certified e-Locker dossier issued under Section 63 BSA 2023 with Token ${created.requestId}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <FolderLock className="w-48 h-48 text-blue-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded uppercase tracking-wider">
                Citizen Justice Access
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded uppercase tracking-wider">
                DigiLocker & BSA 63 Vault
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FolderLock className="w-6 h-6 text-blue-400" />
              Judicial E-Locker & Citizen Justice Access Portal
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Instant issuance of Section 63 BSA 2023 e-Certified Copies with sovereign QR tamper verification, Private
              Criminal Complaint e-filing (Sec 223 BNSS), and Victim Compensation tracking.
            </p>
          </div>

          <button
            onClick={() => setIsNewRequestModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-900/30"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Apply for e-Certified Copy / Legal Aid</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-blue-950/90 border border-blue-500/60 text-blue-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-blue-300 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of e-Locker Records */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              e-Locker Issued Dossiers ({filteredRecords.length})
            </h2>
          </div>

          {/* Search Filter */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Case No., Request ID, Document Title..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-3">
            {filteredRecords.map((record) => {
              const isSelected = selectedRecord?.requestId === record.requestId;
              return (
                <div
                  key={record.requestId}
                  onClick={() => setSelectedRecord(record)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500/60 ring-1 ring-blue-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-blue-400">{record.requestId}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        record.status === 'ISSUED_AND_AVAILABLE'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : record.status === 'DISBURSED_DIRECT_BENEFIT'
                          ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {record.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-white mb-1 line-clamp-2">{record.certifiedDocumentTitle}</div>

                  <div className="text-[11px] text-slate-400 mt-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Case Ref:</span>
                      <span className="font-mono text-slate-200">{record.caseNumberRef}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Citizen Vault:</span>
                      <span className="font-mono text-slate-400">{record.citizenNameMasked}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Issued: {new Date(record.issuedTimestamp).toLocaleDateString()}</span>
                    <span className="text-blue-400 flex items-center gap-1">
                      <QrCode className="w-3 h-3" />
                      BSA 63 Stamp
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Document Verification & E-Locker Viewer */}
        {selectedRecord && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Document Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                    {selectedRecord.requestType.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{selectedRecord.certifiedDocumentTitle}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Jurisdiction: <span className="text-slate-200">{selectedRecord.courtJurisdiction}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center shrink-0">
                  <QrCode className="w-16 h-16 text-blue-400 mx-auto" />
                  <div className="text-[10px] font-mono text-slate-400 mt-1">Scan for Live BSA 63 Verification</div>
                </div>
              </div>

              {/* Citizen & Judicial Signature Credentials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Citizen Digital Identity</div>
                  <div className="text-sm font-semibold text-white mt-1">{selectedRecord.citizenNameMasked}</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">Mobile: {selectedRecord.mobileLinkedMasked}</div>
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    DigiLocker / Aadhaar Vault Token Linked
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Issuing Judicial Authority</div>
                  <div className="text-sm font-semibold text-white mt-1">{selectedRecord.issuingJudgeName}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Expiry:{' '}
                    <span className="text-slate-200">
                      {new Date(selectedRecord.downloadExpiryTimestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-[10px] text-blue-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Valid for Government & Banking e-Verification
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic Digital Signature & BSA Section 63 Proof */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Section 63 BSA 2023 Electronic Certified Seal & Hash Proof
                </h4>
                <span className="text-[11px] text-emerald-300 font-mono">Immutable Hash Signature</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 break-all">
                {selectedRecord.digitalSignatureBSA63Sha256}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Public Verification URL:</span>
                <a
                  href={selectedRecord.qrVerificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono text-[11px]"
                >
                  {selectedRecord.qrVerificationUrl.slice(0, 45)}...
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Optional Legal Aid & Victim Compensation Details */}
            {selectedRecord.nalSACompensationAmountRupees && (
              <div className="bg-slate-900/80 border border-teal-500/30 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-teal-300 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-teal-400" />
                    NALSA Section 396 BNSS Victim Compensation Grant
                  </h4>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    ₹{selectedRecord.nalSACompensationAmountRupees.toLocaleString('en-IN')} Sanctioned
                  </span>
                </div>

                {selectedRecord.legalAidCounselAssigned && (
                  <div className="text-xs text-slate-300 grid grid-cols-2 gap-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-500">Appointed Pro-Bono Counsel:</span>
                      <div className="font-semibold text-white mt-0.5">
                        {selectedRecord.legalAidCounselAssigned.advocateName}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Bar Council Enrollment:</span>
                      <div className="font-mono text-slate-300 mt-0.5">
                        {selectedRecord.legalAidCounselAssigned.barCouncilEnrollment}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Download & DigiLocker Push Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setToastMessage(`Pushing document #${selectedRecord.requestId} directly to citizen's DigiLocker Sovereign Drive...`);
                  setTimeout(() => setToastMessage(null), 3500);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer border border-slate-700"
              >
                <FolderLock className="w-4 h-4 text-amber-400" />
                <span>Push to DigiLocker</span>
              </button>

              <button
                onClick={() => {
                  setToastMessage(`Downloading Sec 63 BSA Certified PDF with Watermark & QR Code for ${selectedRecord.requestId}`);
                  setTimeout(() => setToastMessage(null), 3500);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-900/30"
              >
                <Download className="w-4 h-4" />
                <span>Download e-Certified PDF Copy</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: New Citizen Request */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-400" />
                Citizen e-Locker Document Application
              </h3>
              <button
                onClick={() => setIsNewRequestModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Application Type</label>
                <select
                  value={newRequestType}
                  onChange={(e) =>
                    setNewRequestType(
                      e.target.value as
                        | 'CERTIFIED_COPY_BSA_63'
                        | 'PRIVATE_COMPLAINT_BNSS_223'
                        | 'VICTIM_COMPENSATION_BNSS_396'
                        | 'LEGAL_AID_APPLICATION_BNSS_340'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="CERTIFIED_COPY_BSA_63">e-Certified Copy (Section 63 BSA 2023)</option>
                  <option value="PRIVATE_COMPLAINT_BNSS_223">Private Criminal Complaint (Sec 223 BNSS)</option>
                  <option value="VICTIM_COMPENSATION_BNSS_396">Victim Compensation Application (Sec 396 BNSS)</option>
                  <option value="LEGAL_AID_APPLICATION_BNSS_340">Pro-Bono Legal Aid Assignment (Sec 340 BNSS)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Case Number / CNR Reference</label>
                <input
                  type="text"
                  required
                  value={caseRef}
                  onChange={(e) => setCaseRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Requested Document Title</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Court Jurisdiction</label>
                <input
                  type="text"
                  required
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Generate e-Certified Copy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
