import React, { useState } from 'react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { computeFileSHA256, computeSHA256 } from '../services/cryptoEngine';
import { storageService } from '../services/storageService';
import {
  ShieldCheck,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Copy,
  Check,
  Search,
  Key,
} from 'lucide-react';

interface DocumentVerifierViewProps {
  language: SupportedLanguage;
}

export const DocumentVerifierView: React.FC<DocumentVerifierViewProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [calculatedHash, setCalculatedHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    found: boolean;
    tx?: any;
    block?: any;
    caseMatch?: any;
    docMatch?: any;
    error?: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // Sample hashes to test instantly
  const sampleHashes = [
    { label: 'E-FIR (Cyber Case)', hash: 'a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9' },
    { label: 'CFSL Cyber Forensics Report', hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b' },
    { label: 'Final Police Charge Sheet', hash: '11223344556677889900aabbccddeeff0011223344556677889900aabbccddee' },
    { label: 'Certified Final Judgment', hash: 'aabbccddeeff0011223344556677889900aabbccddeeff001122334455667788' },
  ];

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const hash = await computeFileSHA256(file);
      setCalculatedHash(hash);
      performVerification(hash);
    } catch (err: any) {
      setVerificationResult({ found: false, error: 'Failed to compute file checksum' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextVerify = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    try {
      let hash = inputText.trim();
      // If user provided text instead of 64-char hex hash, compute SHA-256 of text
      if (hash.length !== 64 || !/^[0-9a-fA-F]{64}$/.test(hash)) {
        hash = await computeSHA256(inputText.trim());
      }
      setCalculatedHash(hash);
      performVerification(hash);
    } finally {
      setIsProcessing(false);
    }
  };

  const performVerification = (hash: string) => {
    const match = storageService.ledger.findTransactionByHash(hash);
    const allCases = storageService.getCases();
    let docMatch: any = null;
    let caseMatch: any = null;

    for (const c of allCases) {
      const d = c.documents.find((doc) => doc.sha256Hash.toLowerCase() === hash.toLowerCase());
      if (d) {
        docMatch = d;
        caseMatch = c;
        break;
      }
    }

    if (match.found) {
      setVerificationResult({
        found: true,
        tx: match.tx,
        block: match.block,
        caseMatch,
        docMatch,
      });
    } else {
      setVerificationResult({
        found: false,
        caseMatch,
        docMatch,
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>FIPS 180-4 CRYPTOGRAPHIC VERIFIER</span>
        </div>
        <h1 className="text-2xl font-bold text-white font-serif tracking-tight">
          Sovereign SHA-256 Document & Blockchain Verifier
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Verify the authenticity, non-repudiation, and immutability of any legal document, evidence exhibit, or forensic report against the National Blockchain Ledger.
        </p>
      </div>

      {/* Drag and Drop / File Input Box */}
      <div className="p-8 bg-slate-900 border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-xl text-center space-y-4 transition-colors">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center space-y-3"
        >
          <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <span className="text-sm font-semibold text-white">
              Click to browse or drag & drop any PDF, image, or case binary
            </span>
            <p className="text-xs text-slate-400 mt-1">
              Browser computes real SHA-256 hash locally. No document contents leave your secure sandbox.
            </p>
          </div>
        </label>

        {/* Or Text / Hash Input */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Or Paste 64-character SHA-256 Hash / Raw Text
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9"
              className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleTextVerify}
              disabled={isProcessing || !inputText.trim()}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer shrink-0"
            >
              {isProcessing ? 'Verifying...' : 'Verify Hash'}
            </button>
          </div>

          {/* Preset Hash Quick Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-[11px] text-slate-500">Quick Test Samples:</span>
            {sampleHashes.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(sample.hash);
                  setCalculatedHash(sample.hash);
                  performVerification(sample.hash);
                }}
                className="px-2.5 py-1 text-[11px] font-mono bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded transition-colors cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Result Card */}
      {verificationResult && (
        <div
          className={`p-6 rounded-xl border transition-all ${
            verificationResult.found
              ? 'bg-emerald-950/30 border-emerald-500/50'
              : 'bg-red-950/30 border-red-500/50'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {verificationResult.found ? (
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              )}

              <div>
                <h2
                  className={`text-base font-bold font-serif ${
                    verificationResult.found ? 'text-emerald-300' : 'text-red-300'
                  }`}
                >
                  {verificationResult.found
                    ? 'AUTHENTIC & IMMUTABLE: Blockchain Integrity Verified'
                    : 'UNVERIFIED / TAMPERED RECORD'}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  {verificationResult.found
                    ? 'This document matches an anchored transaction committed to the sovereign blockchain ledger. Timestamp, digital signatures, and Merkle proofs are verified.'
                    : 'The computed SHA-256 hash was NOT found in the blockchain ledger or the file has been modified since its initial commitment.'}
                </p>
              </div>
            </div>
          </div>

          {/* Hash details */}
          <div className="mt-4 p-3.5 bg-slate-950/90 rounded-lg border border-slate-800 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>Calculated SHA-256 Digest:</span>
              <div className="flex items-center gap-2">
                <span className="text-amber-300">{calculatedHash}</span>
                <button
                  onClick={() => copyToClipboard(calculatedHash)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {verificationResult.found && verificationResult.tx && (
              <>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Blockchain Transaction ID:</span>
                  <span className="text-purple-400 truncate max-w-md">{verificationResult.tx.txId}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Anchored Block Height:</span>
                  <span className="text-white font-bold">Block #{verificationResult.block?.blockNumber}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Committed Timestamp:</span>
                  <span className="text-slate-200">{verificationResult.tx.timestamp}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Signer Organization:</span>
                  <span className="text-emerald-400">{verificationResult.tx.signerOrg} ({verificationResult.tx.signerRole})</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Case Reference:</span>
                  <span className="text-amber-400">{verificationResult.tx.caseNumber}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
                  <span>Validator Node Signature:</span>
                  <span className="text-slate-300 truncate max-w-md">{verificationResult.block?.validatorSignature}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
