import React, { useState } from 'react';
import { CaseFile, DocumentType, DocumentClassification, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { X, UploadCloud, Lock, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface AddDocumentModalProps {
  caseFile: CaseFile;
  currentRole: UserRole;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  caseFile,
  currentRole,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('CASE_DIARY');
  const [classification, setClassification] = useState<DocumentClassification>('CONFIDENTIAL');
  const [fileFormat, setFileFormat] = useState<'PDF' | 'IMAGE_PNG' | 'IMAGE_JPG' | 'JSON' | 'TEXT'>('PDF');
  const [fileContent, setFileContent] = useState('');
  const [uploaderName, setUploaderName] = useState('ACP Raghavendra Sharma');
  const [uploaderBadge, setUploaderBadge] = useState('DP-CYB-8812');
  const [uploaderDept, setUploaderDept] = useState('Delhi Police Cyber Crime Unit');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target?.result as string || 'BINARY_CONTAINER_DATA');
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileContent) {
      setErrorMsg('Please provide document title and content.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await storageService.addDocument(caseFile.id, {
        title,
        documentType,
        classification,
        fileFormat,
        fileSizeKb: Math.max(120, Math.floor(fileContent.length / 8)),
        fileContent,
        uploaderName,
        uploaderBadge,
        uploaderRole: currentRole,
        uploaderDept,
      });

      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to anchor document');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-xl rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-white font-serif">
            <UploadCloud className="w-5 h-5 text-amber-400" />
            <span>Upload & Anchor Document to Case {caseFile.caseNumber}</span>
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
            <label className="block text-slate-400 mb-1">Select Local File (PDF, Image, or JSON)</label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Document Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Supplementary Witness Statement Sec 161 CrPC"
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Document Type *</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="CASE_DIARY">Case Diary Entry</option>
                <option value="WITNESS_STATEMENT">Witness Statement (Sec 161/164)</option>
                <option value="SEIZURE_MEMO">Seizure Memo & Panchnama</option>
                <option value="ARREST_MEMO">Arrest & Inspection Memo</option>
                <option value="CYBER_EXTRACTION_LOG">Cyber Extraction Log</option>
                <option value="PROSECUTION_OPINION">Prosecution Legal Opinion</option>
                <option value="CERTIFIED_EXTRACT">Certified Document Extract</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Security Classification</label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="UNCLASSIFIED">UNCLASSIFIED</option>
                <option value="RESTRICTED">RESTRICTED</option>
                <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                <option value="SECRET">SECRET</option>
                <option value="TOP_SECRET">TOP SECRET</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Document Content / Statement Text *</label>
            <textarea
              rows={4}
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              placeholder="Enter official statement, extraction transcript, or document content..."
              className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1 text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>AES-256-GCM + SHA-256 Anchoring</span>
            </span>
            <span className="text-slate-400">Signer: {uploaderName} ({uploaderBadge})</span>
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
                  <span>Anchoring...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Encrypt & Anchor on Blockchain</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
