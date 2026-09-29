import React, { useState } from 'react';
import {
  FileSignature,
  Building,
  CheckCircle2,
  FileCheck2,
  Plus,
  Send,
  Lock,
  Scale,
  CreditCard,
  QrCode,
  UserCheck,
} from 'lucide-react';
import { phase15Service } from '../services/phase15Service';
import { DigitalBailBondSuretyRecord } from '../types';

export const DigitalBailBondSuretyView: React.FC = () => {
  const [records, setRecords] = useState<DigitalBailBondSuretyRecord[]>(phase15Service.getBailBondRecords());
  const [selectedRecord, setSelectedRecord] = useState<DigitalBailBondSuretyRecord>(records[0] || null);
  const [isNewBailModalOpen, setIsNewBailModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [inmateName, setInmateName] = useState<string>('Suresh R. Gaikwad');
  const [inmateId, setInmateId] = useState<string>('INM-ARTHUR-2026-104');
  const [caseRef, setCaseRef] = useState<string>('MH-02-2026-CR-0089');
  const [bailAmount, setBailAmount] = useState<number>(75000);
  const [suretyName, setSuretyName] = useState<string>('Sunita S. Gaikwad (Spouse)');
  const [aadhaarMasked, setAadhaarMasked] = useState<string>('XXXXXXXX9942');
  const [solvencyType, setSolvencyType] = useState<
    'LAND_REVENUE_RECORD_DIGILOCKER' | 'BANK_FD_LIEN_HOLD' | 'SALARY_CERTIFICATE_VERIFIED'
  >('BANK_FD_LIEN_HOLD');
  const [solvencyAmount, setSolvencyAmount] = useState<number>(500000);

  const handleCreateBailBond = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await phase15Service.createBailBondRecord({
      inmateIdRef: inmateId,
      inmateName,
      caseNumberRef: caseRef,
      bailAmountRupees: Number(bailAmount),
      suretyDetails: {
        suretyName,
        aadhaarMasked,
        relationshipWithAccused: 'Spouse & Permanent Resident',
        solvencyVerificationType: solvencyType,
        solvencyVerifiedAmountRupees: Number(solvencyAmount),
      },
      sec491BNSSForfeitureLiabilityRisk: 'LOW_RISK_FIRST_TIME',
      releaseDispatchStatus: 'TRANSMITTED_TO_PRISON_SUPERINTENDENT',
    });

    const updated = phase15Service.getBailBondRecords();
    setRecords(updated);
    setSelectedRecord(created);
    setIsNewBailModalOpen(false);
    setToastMessage(`Digital Bail Bond #${created.bailBondId} generated & dispatched to Prison Superintendent via ICJS`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <FileSignature className="w-48 h-48 text-emerald-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded uppercase tracking-wider">
                Sec 479 & 480 BNSS E-Bail
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded uppercase tracking-wider">
                ICJS 2.0 60-Min Jail Dispatch
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileSignature className="w-6 h-6 text-emerald-400" />
              National Sovereign Digital Bail Bond & Surety Smart Ledger
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              End-to-end electronic bail bond execution, automated DigiLocker solvency certificate & bank fixed deposit
              lien holds, Section 491 BNSS forfeiture risk assessment, and direct ICJS transmission to prison authorities.
            </p>
          </div>

          <button
            onClick={() => setIsNewBailModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Execute Digital Bail Bond</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-300 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bail Bond Dockets */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              Active E-Bail Bonds ({records.length})
            </h2>
          </div>

          <div className="space-y-3">
            {records.map((item) => {
              const isSelected = selectedRecord?.bailBondId === item.bailBondId;

              return (
                <div
                  key={item.bailBondId}
                  onClick={() => setSelectedRecord(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/60 ring-1 ring-emerald-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-emerald-400">{item.bailBondId}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        item.releaseDispatchStatus === 'INMATE_RELEASED_CUSTODY'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                      }`}
                    >
                      {item.releaseDispatchStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1">{item.inmateName}</div>
                  <div className="text-xs text-slate-400 mb-2">Surety: {item.suretyDetails.suretyName}</div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Bail Sum:</span>
                    <span className="font-mono font-bold text-amber-400">
                      ₹{item.bailAmountRupees.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed E-Bail Bond Dossier */}
        {selectedRecord && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                    Section 480 BNSS Bail Grant
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{selectedRecord.inmateName}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Inmate Reference:{' '}
                    <span className="font-mono text-slate-200 font-semibold">{selectedRecord.inmateIdRef}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-right">
                  <div className="text-[11px] text-slate-400">Sanctioned Bail Bond Amount</div>
                  <div className="text-xl font-mono font-bold text-emerald-400 mt-0.5">
                    ₹{selectedRecord.bailAmountRupees.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Surety Solvency Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Verified Surety Details
                  </div>
                  <div className="text-sm font-semibold text-white">{selectedRecord.suretyDetails.suretyName}</div>
                  <div className="text-[11px] text-slate-400">
                    Aadhaar: {selectedRecord.suretyDetails.aadhaarMasked} ({selectedRecord.suretyDetails.relationshipWithAccused})
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    Solvency Verification (DigiLocker / Bank Lien)
                  </div>
                  <div className="text-sm font-semibold text-emerald-300">
                    {selectedRecord.suretyDetails.solvencyVerificationType.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Verified Solvency Cover: ₹{selectedRecord.suretyDetails.solvencyVerifiedAmountRupees.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* ICJS 2.0 Prison Dispatch Clock */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Building className="w-4 h-4 text-cyan-400" />
                  ICJS 2.0 Prison Dispatch & Digital Release Slip (Under 60 Mins)
                </h4>
                <span className="text-xs text-emerald-400 font-semibold">Direct Prison Push</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Pursuant to Supreme Court FASTER guidelines and BNSS standards, e-Bail release orders are pushed directly
                to the Prison Superintendent portal within 60 minutes of bond execution, preventing overstay in custody.
              </p>
            </div>

            {/* QR Bond Seal SHA-256 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  Digital Bail Bond Cryptographic QR Seal (Sec 63 BSA 2023)
                </h4>
                <span className="text-[11px] font-mono text-emerald-400">SHA-256</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 break-all">
                {selectedRecord.digitalBailBondQrSealSha256}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: New Bail Bond */}
      {isNewBailModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-emerald-400" />
                Execute Electronic Bail Bond
              </h3>
              <button
                onClick={() => setIsNewBailModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateBailBond} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Inmate / Accused Name</label>
                <input
                  type="text"
                  required
                  value={inmateName}
                  onChange={(e) => setInmateName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Inmate ID</label>
                  <input
                    type="text"
                    required
                    value={inmateId}
                    onChange={(e) => setInmateId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bail Sum (INR ₹)</label>
                  <input
                    type="number"
                    required
                    value={bailAmount}
                    onChange={(e) => setBailAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Surety Name & Relation</label>
                <input
                  type="text"
                  required
                  value={suretyName}
                  onChange={(e) => setSuretyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Solvency Verification Mode</label>
                <select
                  value={solvencyType}
                  onChange={(e) =>
                    setSolvencyType(
                      e.target.value as
                        | 'LAND_REVENUE_RECORD_DIGILOCKER'
                        | 'BANK_FD_LIEN_HOLD'
                        | 'SALARY_CERTIFICATE_VERIFIED'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="BANK_FD_LIEN_HOLD">Bank Fixed Deposit Automatic Lien Hold</option>
                  <option value="LAND_REVENUE_RECORD_DIGILOCKER">DigiLocker Certified Land Revenue 7/12 Record</option>
                  <option value="SALARY_CERTIFICATE_VERIFIED">Government / Corporate Salary Solvency Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Solvency Cover Value (INR ₹)</label>
                <input
                  type="number"
                  required
                  value={solvencyAmount}
                  onChange={(e) => setSolvencyAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewBailModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Sign & Push E-Bail Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
