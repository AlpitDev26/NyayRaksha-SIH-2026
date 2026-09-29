import React from 'react';
import { DocumentRecord } from '../types';
import { X, Shield, Printer, CheckCircle2, AlertTriangle, Lock, Stamp } from 'lucide-react';

interface DocumentPreviewModalProps {
  document: DocumentRecord;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
}) => {
  const isTampered = document.tamperState === 'TAMPERED';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-sm line-clamp-1">{document.title}</div>
              <div className="text-[11px] text-slate-400 font-mono">
                Case: {document.caseNumber} · Format: {document.fileFormat} · Classification: {document.classification}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certified Copy</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Printable Paper Simulation */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950/70 flex justify-center">
          <div className="w-full max-w-2xl bg-white text-slate-900 p-8 rounded-lg shadow-xl relative border border-slate-300 font-serif leading-relaxed text-xs">
            {/* Government Official Watermark in center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-6xl font-bold tracking-widest uppercase rotate-[-30deg] select-none text-slate-900">
                OFFICIAL RECORD · NSDJ-DMS
              </span>
            </div>

            {/* Header Crest & Title */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-4 relative">
              <div className="text-[11px] font-sans font-bold tracking-widest text-slate-700 uppercase">
                GOVERNMENT OF INDIA · MINISTRY OF LAW & JUSTICE
              </div>
              <div className="text-sm font-bold uppercase tracking-wider mt-0.5 text-slate-950 font-serif">
                NATIONAL SECURE DIGITAL JUSTICE & INVESTIGATION PLATFORM
              </div>
              <div className="text-[10px] font-mono text-slate-600 mt-1">
                CERTIFIED ELECTRONIC RECORD UNDER SECTION 63 BHARATIYA SAKSHYA ADHINIYAM, 2023
              </div>

              {/* Red Wax Seal Simulation Stamp */}
              <div className="absolute right-0 top-0 w-14 h-14 rounded-full border-2 border-red-700 text-red-700 flex flex-col items-center justify-center font-sans font-bold text-[8px] uppercase rotate-12 opacity-80">
                <Stamp className="w-4 h-4" />
                <span>DIGITALLY SEALED</span>
              </div>
            </div>

            {/* Case & Doc Meta Grid */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-sans border-b border-slate-200 pb-3 mb-4 text-slate-700">
              <div>
                <span className="font-bold text-slate-900">CASE NUMBER:</span> {document.caseNumber}
              </div>
              <div>
                <span className="font-bold text-slate-900">DOCUMENT ID:</span> {document.id}
              </div>
              <div>
                <span className="font-bold text-slate-900">TYPE:</span> {document.documentType}
              </div>
              <div>
                <span className="font-bold text-slate-900">TIMESTAMP:</span> {document.createdAt}
              </div>
            </div>

            {/* Document Body Preview */}
            <div className="space-y-4 text-slate-800 text-xs font-sans whitespace-pre-wrap min-h-[220px]">
              {document.fileContentPreview ||
                `[CERTIFIED CASE DOCUMENT - ${document.documentType}]
This official record was securely encrypted and anchored to the National Blockchain Ledger on ${document.createdAt}.
All evidentiary statements, logs, and signatures contained herein are legally valid under Section 63 of Bharatiya Sakshya Adhiniyam, 2023.`}
            </div>

            {/* Digital Signature & Blockchain Footer */}
            <div className="mt-8 pt-4 border-t-2 border-slate-900 font-mono text-[9px] text-slate-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">SHA-256 CRYPTOGRAPHIC DIGEST:</span>
                <span className={isTampered ? 'text-red-600 font-bold' : 'text-slate-900'}>
                  {document.sha256Hash}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>BLOCKCHAIN ANCHOR TX:</span>
                <span className="text-slate-900">{document.blockchainTxId || 'ANCHORED_COMMITTED'}</span>
              </div>
              {document.digitalSignatures.length > 0 && (
                <div className="flex items-center justify-between">
                  <span>DIGITAL CERTIFICATE:</span>
                  <span className="text-slate-900">
                    {document.digitalSignatures[0].signerName} ({document.digitalSignatures[0].certificateId})
                  </span>
                </div>
              )}
              <div className="pt-2 text-center text-[9px] text-slate-500 font-sans italic">
                This certified extract is generated automatically from the immutable NSDJ-DMS ledger. No physical signature required.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
