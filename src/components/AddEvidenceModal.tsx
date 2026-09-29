import React, { useState } from 'react';
import { CaseFile, EvidenceCategory, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { X, Boxes, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface AddEvidenceModalProps {
  caseFile: CaseFile;
  currentRole: UserRole;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddEvidenceModal: React.FC<AddEvidenceModalProps> = ({
  caseFile,
  currentRole,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EvidenceCategory>('DIGITAL');
  const [description, setDescription] = useState('');
  const [collectedLocation, setCollectedLocation] = useState('Scene of Crime / Search Location');
  const [tamperSealNumber, setTamperSealNumber] = useState(
    `SEAL-DL-2026-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [sampleRawContent, setSampleRawContent] = useState('');
  const [officerName, setOfficerName] = useState('Insp. Alok Vardhan');
  const [officerBadge, setOfficerBadge] = useState('DP-CYB-9102');
  const [officerDept, setOfficerDept] = useState('Delhi Police Evidence Wing');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setErrorMsg('Please provide exhibit title and description.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await storageService.registerEvidence(caseFile.id, {
        title,
        category,
        description,
        collectedLocation,
        officerName,
        officerBadge,
        officerDept,
        tamperSealNumber,
        sampleRawContent: sampleRawContent || `${title}:${category}:${Date.now()}`,
      });

      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register evidence');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-xl rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-white font-serif">
            <Boxes className="w-5 h-5 text-amber-400" />
            <span>Register Evidence Exhibit · Case {caseFile.caseNumber}</span>
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

          <div>
            <label className="block text-slate-400 mb-1">Exhibit Title / Nomenclature *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SanDisk 1TB NVMe Solid State Drive (Mark S-1)"
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Evidence Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="DIGITAL">Digital Artifact / Drive / Phone</option>
                <option value="BALLISTICS">Ballistics / Firearm / Cartridge</option>
                <option value="NARCOTICS">Narcotics / Chemical Contraband</option>
                <option value="BIOLOGICAL_DNA">Biological / Blood / DNA</option>
                <option value="DOCUMENTARY">Physical Ledger / Document</option>
                <option value="FINANCIAL_RECORDS">Financial Ledger / Cheque</option>
                <option value="WEAPON">Blunt / Sharp Weapon</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Tamper Seal Barcode #</label>
              <input
                type="text"
                value={tamperSealNumber}
                onChange={(e) => setTamperSealNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Description & Recovery Condition *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe serial numbers, condition upon seizure, packaging, and marking..."
              className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-slate-100 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Seizure Location & Geo-Coordinates</label>
            <input
              type="text"
              value={collectedLocation}
              onChange={(e) => setCollectedLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
            />
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
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sealing on Blockchain...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Register & Anchor Evidence</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
