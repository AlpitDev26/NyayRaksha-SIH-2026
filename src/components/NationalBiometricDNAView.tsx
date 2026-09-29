import React, { useState } from 'react';
import {
  Fingerprint,
  Dna,
  Eye,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Plus,
  Send,
  Lock,
} from 'lucide-react';
import { phase13Service } from '../services/phase13Service';
import { NationalBiometricDNARecord } from '../types';

export const NationalBiometricDNAView: React.FC = () => {
  const [records, setRecords] = useState<NationalBiometricDNARecord[]>(phase13Service.getBiometricDNARecords());
  const [selectedRecord, setSelectedRecord] = useState<NationalBiometricDNARecord>(records[0] || null);
  const [isNewProfileModalOpen, setIsNewProfileModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Profile Form
  const [caseRef, setCaseRef] = useState<string>('DL-01-2026-CR-0041');
  const [subjectMasked, setSubjectMasked] = useState<string>('R*** T***');
  const [category, setCategory] = useState<'CONVICT_HEINOUS' | 'ACCUSED_UNDER_TRIAL' | 'HABITUAL_OFFENDER_PREVENTIVE'>(
    'ACCUSED_UNDER_TRIAL'
  );
  const [officerName, setOfficerName] = useState<string>('Inspector Ajay Rastogi (Delhi Police Cyber Cell)');

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await phase13Service.createBiometricDNARecord({
      caseNumberRef: caseRef,
      subjectNameMasked: subjectMasked,
      category,
      nafisFingerprintRecord: {
        tenPrintCardUploaded: true,
        nistMatchQualityScore: 98.9,
        nafisNationalId: `NAFIS-IND-DEL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      },
      dnaCodisProfile: {
        strLociCount: 24,
        sampleType: 'BUCCAL_SWAB',
        nfsuAccreditationRef: 'NFSU-GUJ-ISO17025-2026-DNA-009',
        alleleMatrix: [
          { locus: 'D3S1358', allele1: '14', allele2: '16' },
          { locus: 'vWA', allele1: '17', allele2: '19' },
          { locus: 'FGA', allele1: '20', allele2: '23' },
          { locus: 'D8S1179', allele1: '11', allele2: '14' },
          { locus: 'D21S11', allele1: '30', allele2: '32.2' },
          { locus: 'D18S51', allele1: '13', allele2: '17' },
        ],
      },
      irisBiometricTemplateSha256: '99887766554433221100aabbccddeeff00112233445566778899aabbccddeeff',
      collectionOfficerName: officerName,
      dateOfBiometricCollection: new Date().toISOString(),
      expungementStatus: 'ACTIVE_PROFILE',
    });

    const updated = phase13Service.getBiometricDNARecords();
    setRecords(updated);
    setSelectedRecord(created);
    setIsNewProfileModalOpen(false);
    setToastMessage(`CPID 2022 Biometric & DNA Record registered under ${created.cpidReferenceId}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExpungement = () => {
    if (!selectedRecord) return;
    selectedRecord.expungementStatus = 'EXPUNGEMENT_ORDERED_ACQUITTAL';
    setRecords([...records]);
    setToastMessage(`Statutory Expungement & DNA Sample Destruction Protocol executed under CPID Act 2022`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/80 border border-teal-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Fingerprint className="w-48 h-48 text-teal-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded uppercase tracking-wider">
                CPID Act 2022
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded uppercase tracking-wider">
                NAFIS & CODIS 24-STR Mesh
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Fingerprint className="w-6 h-6 text-teal-400" />
              National Biometric DNA & NAFIS Identification Vault
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Criminal Procedure (Identification) Act 2022 compliance: 24 STR Loci CODIS Allele Profiling, Ten-Print
              Automated Fingerprint Identification (NAFIS), Iris Biometric Templates, and Judicial Expungement Controls.
            </p>
          </div>

          <button
            onClick={() => setIsNewProfileModalOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Enrol CPID Biometric Record</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-teal-950/90 border border-teal-500/60 text-teal-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-teal-300 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Biometric Profiles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-teal-400" />
              Registered CPID Profiles ({records.length})
            </h2>
          </div>

          <div className="space-y-3">
            {records.map((profile) => {
              const isSelected = selectedRecord?.cpidReferenceId === profile.cpidReferenceId;

              return (
                <div
                  key={profile.cpidReferenceId}
                  onClick={() => setSelectedRecord(profile)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-teal-500/60 ring-1 ring-teal-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-teal-400">{profile.cpidReferenceId}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        profile.expungementStatus === 'ACTIVE_PROFILE'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {profile.expungementStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1">{profile.subjectNameMasked}</div>

                  <div className="text-[11px] text-slate-400 mt-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Case Ref:</span>
                      <span className="font-mono text-slate-200">{profile.caseNumberRef}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>NAFIS Match Quality:</span>
                      <span className="font-mono text-teal-400 font-bold">
                        {profile.nafisFingerprintRecord.nistMatchQualityScore}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: DNA Allele Matrix & NAFIS Ten-Print */}
        {selectedRecord && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded">
                    {selectedRecord.category.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{selectedRecord.subjectNameMasked}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    CPID Identifier:{' '}
                    <span className="font-mono text-teal-300 font-semibold">{selectedRecord.cpidReferenceId}</span>
                  </div>
                </div>

                {selectedRecord.expungementStatus === 'ACTIVE_PROFILE' && (
                  <button
                    onClick={handleExpungement}
                    className="px-4 py-2 bg-rose-600/80 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Order Expungement upon Acquittal</span>
                  </button>
                )}
              </div>

              {/* NAFIS & Iris Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Fingerprint className="w-3.5 h-3.5 text-teal-400" />
                    NAFIS Ten-Print National ID
                  </div>
                  <div className="text-sm font-semibold text-white font-mono mt-1">
                    {selectedRecord.nafisFingerprintRecord.nafisNationalId}
                  </div>
                  <div className="text-[10px] text-teal-400 mt-1">
                    NIST FIPS Quality: {selectedRecord.nafisFingerprintRecord.nistMatchQualityScore}%
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    Iris Biometric Template Token
                  </div>
                  <div className="font-mono text-[10px] text-indigo-400 break-all mt-1">
                    {selectedRecord.irisBiometricTemplateSha256}
                  </div>
                </div>
              </div>
            </div>

            {/* 24 STR Loci CODIS DNA Allele Matrix */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Dna className="w-4 h-4 text-teal-400" />
                  24 STR Loci CODIS DNA Allele Matrix (NFSU Accredited)
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  Sample: {selectedRecord.dnaCodisProfile.sampleType.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {selectedRecord.dnaCodisProfile.alleleMatrix.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                    <div className="text-[10px] font-mono text-teal-400 font-bold">{item.locus}</div>
                    <div className="text-xs font-mono font-semibold text-white mt-1">
                      {item.allele1} , {item.allele2}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Accreditation: {selectedRecord.dnaCodisProfile.nfsuAccreditationRef}</span>
                <span className="text-teal-400">ISO/IEC 17025 Certified</span>
              </div>
            </div>

            {/* Statutory Protection Seal */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Statutory Biometric Cryptographic Seal (CPID Act 2022)
                </h4>
                <span className="text-[11px] font-mono text-emerald-400">Immutable Hash</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 break-all">
                {selectedRecord.statutoryProtectionSha256}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: New Profile Form */}
      {isNewProfileModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-400" />
                Enrol CPID Biometric & DNA Record
              </h3>
              <button
                onClick={() => setIsNewProfileModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Case Number Reference</label>
                <input
                  type="text"
                  required
                  value={caseRef}
                  onChange={(e) => setCaseRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Masked Subject Name</label>
                <input
                  type="text"
                  required
                  value={subjectMasked}
                  onChange={(e) => setSubjectMasked(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject Category</label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as 'CONVICT_HEINOUS' | 'ACCUSED_UNDER_TRIAL' | 'HABITUAL_OFFENDER_PREVENTIVE'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="ACCUSED_UNDER_TRIAL">Accused Under Trial (Section 53A BNSS)</option>
                  <option value="CONVICT_HEINOUS">Convicted of Heinous Offense (CPID Act)</option>
                  <option value="HABITUAL_OFFENDER_PREVENTIVE">Habitual Offender / Preventive Security</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Collecting Forensic Officer</label>
                <input
                  type="text"
                  required
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewProfileModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Save & Cryptographically Anchor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
