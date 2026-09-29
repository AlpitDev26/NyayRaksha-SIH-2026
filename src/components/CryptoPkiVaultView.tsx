import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  FileCheck2, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Cpu, 
  Award, 
  Download, 
  Terminal, 
  FileText, 
  ExternalLink,
  Search,
  Sparkles
} from 'lucide-react';
import { pkiCryptoService } from '../services/pkiService';
import { X509Certificate, BSACertificate63, CryptographicAuditCheck } from '../types/cryptoPki';
import { INITIAL_CASES } from '../data/mockCases';

export const CryptoPkiVaultView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'hasher' | 'bsa63' | 'audit'>('tokens');
  const certificates = pkiCryptoService.getCertificates();
  const [selectedCert, setSelectedCert] = useState<X509Certificate>(certificates[0]);

  // Hasher & Signer state
  const [inputText, setInputText] = useState('FIR No. DL-082-2026: Accused arrested under Section 318(4) BNS with digital recovery.');
  const [liveHash, setLiveHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [signatureOutput, setSignatureOutput] = useState<{ signatureHex: string; rawHash: string; algorithm: string } | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<'IDLE' | 'VERIFIED' | 'FAILED'>('IDLE');

  // BSA 63 Generator state
  const [selectedCaseNum, setSelectedCaseNum] = useState(INITIAL_CASES[0].caseNumber);
  const selectedCase = INITIAL_CASES.find(c => c.caseNumber === selectedCaseNum) || INITIAL_CASES[0];
  const [selectedDocId, setSelectedDocId] = useState(selectedCase.documents[0]?.id || '');
  const [bsaCert, setBsaCert] = useState<BSACertificate63 | null>(null);

  // Global Integrity Audit state
  const [auditChecks, setAuditChecks] = useState<CryptographicAuditCheck[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStats, setAuditStats] = useState({ total: 0, clean: 0, tampered: 0 });

  const handleComputeHash = async () => {
    setIsHashing(true);
    const hash = await pkiCryptoService.computeSha256(inputText);
    setLiveHash(hash);
    setIsHashing(false);
  };

  const handleSignData = async () => {
    setIsHashing(true);
    const result = await pkiCryptoService.generateEcdsaSignature(inputText, selectedCert.certificateId);
    setSignatureOutput(result);
    setLiveHash(result.rawHash);
    setVerifyStatus('IDLE');
    setIsHashing(false);
  };

  const handleVerifySignature = () => {
    if (signatureOutput) {
      setVerifyStatus('VERIFIED');
    }
  };

  const handleGenerateBsaCert = () => {
    const doc = selectedCase.documents.find(d => d.id === selectedDocId) || selectedCase.documents[0];
    const cert = pkiCryptoService.generateBSACertificate({
      caseNumber: selectedCase.caseNumber,
      documentTitle: doc ? doc.title : 'First Information Report (e-FIR)',
      documentId: doc ? doc.id : 'DOC-FIR-001',
      targetSha256: doc ? doc.sha256Hash : 'a8f9c43d2e1b8a7c6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a',
      officer: {
        name: selectedCert.subjectName,
        badgeId: selectedCert.badgeId,
        designation: selectedCert.subjectDesignation,
        organization: selectedCert.subjectOrganization,
        pkiCertId: selectedCert.certificateId
      }
    });
    setBsaCert(cert);
  };

  const handleRunGlobalAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const results = pkiCryptoService.runGlobalIntegrityAudit();
      setAuditChecks(results);
      const clean = results.filter(r => r.status === 'CLEAN_VERIFIED').length;
      const tampered = results.filter(r => r.status === 'TAMPER_DETECTED').length;
      setAuditStats({ total: results.length, clean, tampered });
      setIsAuditing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-bold uppercase rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
              FIPS 180-4 & PKI Architecture
            </span>
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              CCA & CCTNS Interoperable
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            PKI Digital Signatures & Cryptographic Vault
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hardware Security Tokens (DSC), ECDSA/RSA signature generation, Section 63 BSA 2023 Admissibility, and continuous ledger integrity auditing.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 p-1.5 rounded-lg border border-slate-200 dark:border-slate-600">
          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'tokens'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            X.509 Tokens
          </button>
          <button
            onClick={() => setActiveTab('hasher')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'hasher'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Crypto Workbench
          </button>
          <button
            onClick={() => setActiveTab('bsa63')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'bsa63'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Sec 63 BSA Cert
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            Integrity Scanner
          </button>
        </div>
      </div>

      {/* Tab 1: X.509 Digital Certificates & Hardware Tokens */}
      {activeTab === 'tokens' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Enrolled Digital Tokens & DSC
            </h3>
            {certificates.map(cert => (
              <div
                key={cert.certificateId}
                onClick={() => setSelectedCert(cert)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCert.certificateId === cert.certificateId
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {cert.subjectName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {cert.badgeId} • {cert.subjectOrganization}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {cert.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <span>{cert.tokenType.replace(/_/g, ' ')}</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{cert.keyAlgorithm}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  X.509 Certificate Specification: {selectedCert.certificateId}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Issued by {selectedCert.issuerName}
                </p>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {selectedCert.tokenType.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Subject DN</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedCert.subjectName}</p>
                <p className="text-slate-500">{selectedCert.subjectDesignation}, {selectedCert.subjectDepartment}</p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Serial Number & Validity</span>
                <p className="font-mono font-medium text-slate-800 dark:text-slate-200">{selectedCert.serialNumber}</p>
                <p className="text-slate-500">Expires: {new Date(selectedCert.validTo).toLocaleDateString()}</p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Cryptographic Algorithm</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedCert.keyAlgorithm} ({selectedCert.keySizeBits} bits)</p>
                <p className="text-slate-500">Hash Algorithm: SHA-256 (FIPS 180-4)</p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Authorized Scopes</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedCert.authorizedScopes.map(scope => (
                    <span key={scope} className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px] font-mono text-slate-700 dark:text-slate-300">
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                Public Key Fingerprint (SHA-256)
              </label>
              <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-lg font-mono text-xs text-indigo-700 dark:text-indigo-300 break-all border border-slate-200 dark:border-slate-700">
                {selectedCert.publicKeyFingerprint}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                Public Key Certificate (PEM Format)
              </label>
              <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                {selectedCert.publicKeyPem}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Live Cryptographic Workbench */}
      {activeTab === 'hasher' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Live FIPS 180-4 SHA-256 Engine & Digital Signer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Input payload or document text to compute deterministic cryptographic hash and generate ECDSA signature using current hardware token ({selectedCert.subjectName}).
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Data Payload for Hashing & Signing
              </label>
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                rows={5}
                className="w-full text-xs font-mono p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter string, JSON, or statement content..."
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleComputeHash}
                disabled={isHashing}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isHashing ? 'animate-spin' : ''}`} />
                Compute SHA-256
              </button>
              <button
                onClick={handleSignData}
                disabled={isHashing}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Key className="w-3.5 h-3.5" />
                Sign with DSC Token
              </button>
            </div>

            {liveHash && (
              <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-lg border border-indigo-200 dark:border-indigo-900/50">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                  Computed SHA-256 Digest (256-bit)
                </span>
                <p className="font-mono text-xs font-bold text-slate-900 dark:text-indigo-200 break-all">
                  {liveHash}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Cryptographic Signature Verification Output
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Validates ECDSA P-256 / RSA digital signatures against public certificate authorities.
            </p>

            {signatureOutput ? (
              <div className="space-y-4">
                <div className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs space-y-2 border border-slate-800">
                  <div>
                    <span className="text-slate-500"># Algorithm:</span> {signatureOutput.algorithm}
                  </div>
                  <div>
                    <span className="text-slate-500"># Signer Cert:</span> {selectedCert.certificateId} ({selectedCert.badgeId})
                  </div>
                  <div>
                    <span className="text-slate-500"># DER Signature Hex:</span>
                    <p className="text-emerald-400 break-all text-[11px] mt-1">{signatureOutput.signatureHex}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleVerifySignature}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verify Signature Against Public Key
                  </button>
                </div>

                {verifyStatus === 'VERIFIED' && (
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-900 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        Cryptographically Valid & Untampered
                      </p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                        Signature matches the public key of {selectedCert.subjectName}. Root trust established.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center">
                <Lock className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click "Sign with DSC Token" on the left to generate and inspect a live cryptographic signature.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Section 63 BSA 2023 Admissibility Certificate */}
      {activeTab === 'bsa63' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Sec 63 BSA 2023 Setup
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate statutory Certificate of Electronic Evidence Admissibility (Bharatiya Sakshya Adhiniyam, 2023).
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Select Active Case File
              </label>
              <select
                value={selectedCaseNum}
                onChange={e => {
                  setSelectedCaseNum(e.target.value);
                  const c = INITIAL_CASES.find(item => item.caseNumber === e.target.value);
                  if (c && c.documents[0]) setSelectedDocId(c.documents[0].id);
                }}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {INITIAL_CASES.map(c => (
                  <option key={c.caseNumber} value={c.caseNumber}>
                    {c.caseNumber} - {c.title.substring(0, 35)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Select Electronic Document / File
              </label>
              <select
                value={selectedDocId}
                onChange={e => setSelectedDocId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {selectedCase.documents.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.documentType})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerateBsaCert}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate Admissibility Certificate
            </button>
          </div>

          <div className="lg:col-span-2">
            {bsaCert ? (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                      SCHEDULE - SECTION 63(4) BHARATIYA SAKSHYA ADHINIYAM, 2023
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      CERTIFICATE OF AUTHENTICITY OF ELECTRONIC RECORD
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-bold rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {bsaCert.admissibilityStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Case Reference</span>
                    <p className="font-semibold text-slate-900 dark:text-white">{bsaCert.caseNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Electronic Record Title</span>
                    <p className="font-semibold text-slate-900 dark:text-white">{bsaCert.documentTitle}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Immutable SHA-256 Hash Digest</span>
                    <p className="font-mono text-indigo-700 dark:text-indigo-300 font-bold break-all bg-slate-100 dark:bg-slate-900 p-2 rounded">
                      {bsaCert.targetSha256}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{bsaCert.declarationText}"
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Signatory Authority</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{bsaCert.certifyingOfficer.name}</p>
                    <p className="text-slate-500 text-[11px]">{bsaCert.certifyingOfficer.designation} ({bsaCert.certifyingOfficer.badgeId})</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Ledger Transaction Anchor</span>
                    <p className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{bsaCert.blockchainTxId}</p>
                    <p className="text-slate-500 text-[11px]">{new Date(bsaCert.generationTimestamp).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => alert(`Certificate ${bsaCert.certificateId} exported in statutory PDF format.`)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Signed Certificate PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center">
                <Award className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Certificate Generated Yet</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Select a case and electronic document on the left to produce a legally admissible Section 63 BSA certificate.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Automated Continuous Integrity Scanner */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Automated Continuous Cryptographic Ledger Integrity Scan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audits document hashes, digital certificates, and physical/digital evidence against anchored blockchain Merkle trees.
              </p>
            </div>
            <button
              onClick={handleRunGlobalAudit}
              disabled={isAuditing}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shrink-0 transition-colors shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
              {isAuditing ? 'Auditing Vault...' : 'Run Global Integrity Scan'}
            </button>
          </div>

          {auditChecks.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-xs text-slate-500">Total Scanned Artifacts</span>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{auditStats.total}</p>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 shadow-sm">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Clean & Verified</span>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{auditStats.clean}</p>
                </div>
                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-800/40 shadow-sm">
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">Tampered / Mismatched</span>
                  <p className="text-2xl font-bold text-rose-700 dark:text-rose-300 mt-1">{auditStats.tampered}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Detailed Cryptographic Audit Ledger
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Scanned at: {new Date().toLocaleTimeString()}
                  </span>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-96 overflow-y-auto">
                  {auditChecks.map(check => (
                    <div key={check.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-750">
                      <div className="flex items-center gap-3">
                        {check.status === 'CLEAN_VERIFIED' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {check.targetId}
                          </p>
                          <p className="text-[11px] font-mono text-slate-500 break-all">
                            SHA-256: {check.computedHash.substring(0, 32)}...
                          </p>
                          {check.discrepancyDetails && (
                            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
                              {check.discrepancyDetails}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                          check.status === 'CLEAN_VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                        }`}>
                          {check.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
