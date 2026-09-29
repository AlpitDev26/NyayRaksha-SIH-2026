import React, { useState } from 'react';
import { CaseFile, DocumentRecord } from '../types';
import { storageService } from '../services/storageService';
import { X, AlertTriangle, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

interface TamperSimulationModalProps {
  caseFile: CaseFile;
  onClose: () => void;
  onSuccess: () => void;
}

export const TamperSimulationModal: React.FC<TamperSimulationModalProps> = ({
  caseFile,
  onClose,
  onSuccess,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(caseFile.documents[0]?.id || '');
  const [statusMessage, setStatusMessage] = useState('');

  const handleTamper = () => {
    if (!selectedDocId) return;
    const ok = storageService.simulateDocumentTampering(caseFile.id, selectedDocId);
    if (ok) {
      setStatusMessage('Document hash maliciously altered! Blockchain integrity alert triggered.');
      onSuccess();
    }
  };

  const handleRestore = () => {
    if (!selectedDocId) return;
    const ok = storageService.restoreDocumentFromLedger(caseFile.id, selectedDocId);
    if (ok) {
      setStatusMessage('Document restored to immutable blockchain ledger state.');
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-lg rounded-xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <Zap className="w-4 h-4" />
            <span>Adversary Tampering Simulation Sandbox</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          This security audit tool demonstrates how NSDJ-DMS prevents evidence tampering. If an unauthorized insider or adversary alters an encrypted document or changes a byte, the local SHA-256 hash diverges from the blockchain ledger, immediately flagging a tamper alert.
        </p>

        {statusMessage && (
          <div className="p-3 bg-slate-950 border border-amber-500/40 rounded text-amber-300 text-xs font-mono">
            {statusMessage}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400">
            Select Document to Target in Case {caseFile.caseNumber}:
          </label>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-100 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            {caseFile.documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title} ({d.documentType})
              </option>
            ))}
          </select>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleRestore}
            className="px-3 py-2 text-xs font-medium text-emerald-300 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/50 rounded cursor-pointer flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Restore from Blockchain</span>
          </button>

          <button
            onClick={handleTamper}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded shadow cursor-pointer flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Execute Malicious Tamper</span>
          </button>
        </div>
      </div>
    </div>
  );
};
