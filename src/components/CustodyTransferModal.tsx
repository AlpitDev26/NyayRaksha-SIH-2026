import React, { useState } from 'react';
import { CaseFile, EvidenceItem, SupportedLanguage, CustodyTransferRecord } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { storageService } from '../services/storageService';
import {
  X,
  ArrowRightLeft,
  Lock,
  CheckCircle2,
  AlertCircle,
  Shield,
  Loader2,
} from 'lucide-react';

interface CustodyTransferModalProps {
  caseFile: CaseFile;
  evidence: EvidenceItem;
  onClose: () => void;
  onSuccess: () => void;
  language: SupportedLanguage;
}

export const CustodyTransferModal: React.FC<CustodyTransferModalProps> = ({
  caseFile,
  evidence,
  onClose,
  onSuccess,
  language,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [fromOfficer, setFromOfficer] = useState(evidence.currentCustodian);
  const [fromDept, setFromDept] = useState(evidence.custodianDepartment);

  const [toOfficer, setToOfficer] = useState('Dr. Sunita Deshmukh (CFSL Senior Scientist)');
  const [toDept, setToDept] = useState('Central Forensic Science Laboratory (CBI Campus, New Delhi)');
  const [purpose, setPurpose] = useState(
    'Transmission for advanced physical & cyber bitstream extraction under Sec 293 CrPC / Sec 329 BNSS.'
  );
  const [location, setLocation] = useState('CFSL Digital Forensics Examination Bay 3');
  const [sealCondition, setSealCondition] = useState<CustodyTransferRecord['sealCondition']>('INTACT_SEALED');
  const [signerBadge, setSignerBadge] = useState('IO-TRANSFER-AUTH-2026');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toOfficer || !toDept || !purpose) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await storageService.transferEvidenceCustody(caseFile.id, evidence.id, {
        fromOfficer,
        fromDept,
        toOfficer,
        toDept,
        purpose,
        location,
        sealCondition,
        signerBadge,
      });

      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Custody transfer failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-serif">
                Record Evidence Chain of Custody Transfer
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                {evidence.evidenceCode} · Case: {caseFile.caseNumber}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleTransfer} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-500 rounded text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Evidence Details Card */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
            <div className="font-semibold text-white text-sm">{evidence.title}</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-3 font-mono">
              <span>Category: {evidence.category}</span>
              <span>·</span>
              <span>Seal: {evidence.tamperSealNumber}</span>
              <span>·</span>
              <span className="text-emerald-400">Status: {evidence.sealStatus}</span>
            </div>
          </div>

          {/* Transfer From & To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* FROM */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <span className="font-semibold text-slate-200 text-xs text-amber-400">
                Relinquishing Custodian (Transfer From)
              </span>
              <div>
                <label className="block text-slate-400 mb-0.5">Officer Name / ID</label>
                <input
                  type="text"
                  value={fromOfficer}
                  onChange={(e) => setFromOfficer(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-0.5">Department / Station</label>
                <input
                  type="text"
                  value={fromDept}
                  onChange={(e) => setFromDept(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            {/* TO */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <span className="font-semibold text-slate-200 text-xs text-cyan-400">
                Receiving Custodian (Transfer To)
              </span>
              <div>
                <label className="block text-slate-400 mb-0.5">Receiving Officer / Lab Scientist *</label>
                <input
                  type="text"
                  value={toOfficer}
                  onChange={(e) => setToOfficer(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-0.5">Receiving Agency / Court *</label>
                <input
                  type="text"
                  value={toDept}
                  onChange={(e) => setToDept(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Purpose & Handover Details */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
            <div>
              <label className="block text-slate-400 mb-1">Handover Purpose / Statutory Requirement *</label>
              <textarea
                rows={2}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Physical Handover Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Physical Seal Verification Condition</label>
                <select
                  value={sealCondition}
                  onChange={(e) => setSealCondition(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="INTACT_SEALED">Intact & Factory/Police Sealed</option>
                  <option value="BROKEN_FOR_LAB">Opened under Lab Protocols for Extraction</option>
                  <option value="RE_SEALED_WITH_SEC_BARCODE">Re-sealed with Secondary Barcode</option>
                </select>
              </div>
            </div>
          </div>

          {/* PKI Signoff */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded flex items-center justify-between font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Dual Digital Signature Commitment</span>
            </span>
            <span className="text-slate-400">Sec 63 BSA / Sec 65B Certified</span>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded border border-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow-md transition-colors cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Anchoring Custody Handover...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Execute Cryptographic Handover</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
