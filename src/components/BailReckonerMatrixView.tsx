import React, { useState } from 'react';
import {
  BailReckonerProfile,
  SupportedLanguage,
  UserRole,
} from '../types';
import { phase7Service } from '../services/phase7Service';
import {
  Scale,
  ShieldCheck,
  AlertOctagon,
  Clock,
  User,
  CheckCircle,
  FileCheck,
  Send,
  Building,
  DollarSign,
  AlertTriangle,
  Award,
  Stamp,
  Download,
} from 'lucide-react';

interface BailReckonerMatrixViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const BailReckonerMatrixView: React.FC<BailReckonerMatrixViewProps> = ({
  language: _language,
  currentRole: _currentRole,
}) => {
  const [profiles, setProfiles] = useState<BailReckonerProfile[]>(() =>
    phase7Service.getBailProfiles()
  );
  const [selectedCaseId, setSelectedCaseId] = useState<string>(profiles[0]?.caseId || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedProfile = profiles.find((p) => p.caseId === selectedCaseId) || profiles[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDispatchEBail = (caseId: string) => {
    const updated = phase7Service.dispatchEBailReleaseBond(caseId);
    setProfiles((prev) => prev.map((p) => (p.caseId === caseId ? updated : p)));
    showToast(`Section 479 BNSS e-Bail Release Bond dispatched to ICJS e-Prisons for ${updated.accusedName}.`);
  };

  if (!selectedProfile) {
    return <div className="p-8 text-center text-slate-400">No undertrial bail profiles found.</div>;
  }

  // Calculate percentage of threshold served
  const thresholdDays = selectedProfile.statutoryLibertyThresholdMonths * 30.4;
  const progressPercent = Math.min(100, Math.round((selectedProfile.currentDetentionDays / thresholdDays) * 100));
  const isEntitled = selectedProfile.currentDetentionDays >= thresholdDays;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500/90 text-slate-950 font-medium px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-amber-300">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 p-5 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-emerald-950/40 border border-emerald-500/40 p-1 flex items-center justify-center shrink-0 shadow-md">
            <Scale className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                SECTIONS 479 & 480 BNSS 2023
              </span>
              <span className="text-slate-400">NATIONAL PRE-TRIAL LIBERTY & E-BAIL MATRIX</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white font-serif tracking-tight mt-0.5">
              Statutory Undertrial Bail Reckoner & Liberty Engine
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated evaluation of Section 479 BNSS mandatory bail thresholds (1/3rd detention for first-time offenders) and instant cryptographic e-Bail release bond transmission to e-Prisons.
            </p>
          </div>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 rounded bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Automated Daily Custody Audit</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Profiles List & Detailed Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Undertrial Inmate Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Undertrial Inmate Roster</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{profiles.length} Active</span>
          </div>

          <div className="space-y-2">
            {profiles.map((p) => {
              const capDays = p.statutoryLibertyThresholdMonths * 30.4;
              const entitled = p.currentDetentionDays >= capDays;
              return (
                <button
                  key={p.caseId}
                  onClick={() => setSelectedCaseId(p.caseId)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer space-y-1.5 ${
                    selectedCaseId === p.caseId
                      ? 'bg-emerald-950/40 border-emerald-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{p.accusedName}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        entitled
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {entitled ? 'MANDATORY BAIL' : 'IN SCRUTINY'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono flex justify-between">
                    <span>{p.caseNumber}</span>
                    <span>{p.currentDetentionDays} days served</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Statutory Reckoner Workspace (2 Columns) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-5">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white font-serif">{selectedProfile.accusedName}</span>
                <span className="text-xs text-slate-400">({selectedProfile.accusedAge} yrs)</span>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-[10px] rounded">
                  {selectedProfile.isFirstTimeOffender ? 'First-Time Offender (1/3rd Rule)' : 'Repeat Offender (1/2 Rule)'}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                <span>Prison: {selectedProfile.prisonId}</span>
                <span>•</span>
                <span>Location: {selectedProfile.cellBlock}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1.5 rounded text-xs font-bold font-mono ${
                  selectedProfile.judicialApprovalStatus === 'GRANTED_E_BAIL'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                }`}
              >
                {selectedProfile.judicialApprovalStatus.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Statutory Liberty Clock & Threshold Gauge */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold">Sec 479 BNSS Statutory Custody Clock</span>
              <span className={isEntitled ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {selectedProfile.currentDetentionDays} / {Math.round(thresholdDays)} Days ({progressPercent}%)
              </span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative">
              <div
                style={{ width: `${progressPercent}%` }}
                className={`h-full transition-all duration-500 ${
                  isEntitled ? 'bg-gradient-to-r from-amber-500 to-emerald-400' : 'bg-amber-500'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 text-xs font-mono">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <div className="text-slate-400 text-[10px]">Max Statutory Penalty</div>
                <div className="text-white font-bold">{selectedProfile.maximumImprisonmentMonths} Months</div>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <div className="text-slate-400 text-[10px]">Sec 479 Liberty Threshold</div>
                <div className="text-emerald-400 font-bold">
                  {selectedProfile.statutoryLibertyThresholdMonths} Months ({selectedProfile.isFirstTimeOffender ? '1/3rd' : '1/2nd'})
                </div>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <div className="text-slate-400 text-[10px]">Current Detention</div>
                <div className="text-amber-400 font-bold">
                  {selectedProfile.currentDetentionMonths} Months ({selectedProfile.currentDetentionDays} Days)
                </div>
              </div>
            </div>
          </div>

          {/* Offenses Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Framed Penal Sections (BNS 2023 / Special Acts)
            </h4>
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Penal Section</th>
                    <th className="p-2.5">Act</th>
                    <th className="p-2.5">Max Penalty</th>
                    <th className="p-2.5">Nature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {selectedProfile.offensesList.map((off, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/40">
                      <td className="p-2.5 font-bold text-white">{off.section}</td>
                      <td className="p-2.5">{off.act}</td>
                      <td className="p-2.5">{off.maxPenaltyYears} Years</td>
                      <td className="p-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            off.isBailable ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                          }`}
                        >
                          {off.isBailable ? 'Bailable' : 'Non-Bailable'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Surety Compliance & e-Bail Dispatch Actions */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="font-bold text-white font-mono flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Surety & Bond Requirements</span>
              </div>
              <span className="text-slate-300 font-mono">
                Bond Amount: ₹{selectedProfile.suretyRequirement.amountRupees.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>
                Sureties Verified: {selectedProfile.suretyRequirement.suretiesVerified} of{' '}
                {selectedProfile.suretyRequirement.suretiesRequired}
              </span>
              <span className="text-emerald-400">
                {selectedProfile.suretyRequirement.localSuretyVerified ? '✓ Local Surety Verified' : 'Pending'}
              </span>
            </div>

            <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">
                {selectedProfile.eBailReleaseBondGenerated ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Transmitted to ICJS e-Prisons Pillar ({selectedProfile.icjsDispatchTimestamp})
                  </span>
                ) : (
                  <span>Ready for instant cryptographic e-Bail release order issuance.</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDispatchEBail(selectedProfile.caseId)}
                  disabled={selectedProfile.eBailReleaseBondGenerated}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{selectedProfile.eBailReleaseBondGenerated ? 'e-Bail Dispatched' : 'Issue & Dispatch e-Bail Bond'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
