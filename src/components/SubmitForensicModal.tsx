import React, { useState } from 'react';
import { CaseFile, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { X, Microscope, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface SubmitForensicModalProps {
  caseFile: CaseFile;
  currentRole: UserRole;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubmitForensicModal: React.FC<SubmitForensicModalProps> = ({
  caseFile,
  currentRole,
  onClose,
  onSuccess,
}) => {
  const [fslRefNumber, setFslRefNumber] = useState(
    `CFSL/DL/2026/EX-${Math.floor(100 + Math.random() * 900)}`
  );
  const [laboratory, setLaboratory] = useState(
    'Central Forensic Science Laboratory (CFSL), CBI Complex, Lodhi Road, New Delhi'
  );
  const [examinerName, setExaminerName] = useState('Dr. Sunita Deshmukh');
  const [examinerBadge, setExaminerBadge] = useState('CFSL-CYB-044');
  const [evidenceItemId, setEvidenceItemId] = useState(
    caseFile.evidenceItems[0]?.id || 'evd-generic'
  );
  const [testType, setTestType] = useState(
    'Bitstream Image Verification & Memory Volatility Analysis'
  );
  const [methodology, setMethodology] = useState(
    'ISO/IEC 27037:2012 Guidelines for Identification, Collection, Acquisition and Preservation of Digital Evidence'
  );
  const [findings, setFindings] = useState(
    'Cryptographic SHA-256 analysis of raw storage blocks matched malware command-and-control beacons communicating with malicious offshore host.'
  );
  const [conclusion, setConclusion] = useState(
    'Conclusive scientific proof linking the seized hardware to the unauthorized financial transactions.'
  );
  const [confidenceScore, setConfidenceScore] = useState<number>(99.8);
  const [instrumentCalibrationRef, setInstrumentCalibrationRef] = useState('NIST-CFTT-2026-CAL');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fslRefNumber || !findings || !conclusion) {
      setErrorMsg('Please complete all mandatory report fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await storageService.submitForensicReport(caseFile.id, {
        fslRefNumber,
        examinerName,
        examinerBadge,
        laboratory,
        evidenceItemId,
        testType,
        methodology,
        findings,
        conclusion,
        confidenceScore,
        instrumentCalibrationRef,
      });

      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit report');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-white font-serif">
            <Microscope className="w-5 h-5 text-purple-400" />
            <span>File Certified Forensic Laboratory Report · Case {caseFile.caseNumber}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-500 rounded text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">FSL Report Reference # *</label>
              <input
                type="text"
                value={fslRefNumber}
                onChange={(e) => setFslRefNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Target Evidence Exhibit</label>
              <select
                value={evidenceItemId}
                onChange={(e) => setEvidenceItemId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {caseFile.evidenceItems.length > 0 ? (
                  caseFile.evidenceItems.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.evidenceCode} - {e.title}
                    </option>
                  ))
                ) : (
                  <option value="generic">Direct Case Physical/Electronic Exhibit</option>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Test Type / Scientific Examination</label>
            <input
              type="text"
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Testing Methodology & Standard Operating Protocol</label>
            <input
              type="text"
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Technical Findings & Extraction Data *</label>
            <textarea
              rows={3}
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Scientific Conclusion / Expert Opinion *</label>
            <textarea
              rows={2}
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Match Confidence (%)</label>
              <input
                type="number"
                step="0.1"
                min="50"
                max="100"
                value={confidenceScore}
                onChange={(e) => setConfidenceScore(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Equipment Calibration Hash Ref</label>
              <input
                type="text"
                value={instrumentCalibrationRef}
                onChange={(e) => setInstrumentCalibrationRef(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
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
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-purple-400 hover:bg-purple-300 rounded shadow transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sign & Commit FSL Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
