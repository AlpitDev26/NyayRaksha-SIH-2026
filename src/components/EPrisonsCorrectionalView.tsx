import React, { useState } from 'react';
import {
  Building2,
  Clock,
  UserCheck,
  ShieldCheck,
  Video,
  HeartPulse,
  Send,
  Plus,
  Scale,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { phase13Service } from '../services/phase13Service';
import { EPrisonsCorrectionalRecord } from '../types';

export const EPrisonsCorrectionalView: React.FC = () => {
  const [inmates, setInmates] = useState<EPrisonsCorrectionalRecord[]>(phase13Service.getEPrisonsRecords());
  const [selectedInmate, setSelectedInmate] = useState<EPrisonsCorrectionalRecord>(inmates[0] || null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isParoleModalOpen, setIsParoleModalOpen] = useState<boolean>(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState<boolean>(false);
  const [paroleDays, setParoleDays] = useState<number>(14);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Admission form
  const [newInmateName, setNewInmateName] = useState<string>('Rameshwar P. Tiwari');
  const [newAge, setNewAge] = useState<number>(31);
  const [newFacility, setNewFacility] = useState<string>('Central Jail No. 4, Tihar, New Delhi');
  const [newCaseRef, setNewCaseRef] = useState<string>('DL-01-2026-CR-0041');
  const [newBNSSections, setNewBNSSections] = useState<string>('Sec 303(2) BNS, Sec 318(2) BNS');
  const [newIsFirstTime, setNewIsFirstTime] = useState<boolean>(true);
  const [newMaxSentenceDays, setNewMaxSentenceDays] = useState<number>(1095);

  const filteredInmates = inmates.filter(
    (i) =>
      i.inmateName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      i.undertrialNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      i.prisonFacility.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleGrantParole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInmate) return;

    phase13Service.grantParoleApproval(selectedInmate.inmateId, paroleDays);
    const updated = phase13Service.getEPrisonsRecords();
    setInmates(updated);
    const curr = updated.find((i) => i.inmateId === selectedInmate.inmateId);
    if (curr) setSelectedInmate(curr);

    setIsParoleModalOpen(false);
    setToastMessage(`Superintendent sanctioned ${paroleDays}-day emergency parole for ${selectedInmate.inmateName}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleNewAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    const threshold = newIsFirstTime ? Math.floor(newMaxSentenceDays / 3) : Math.floor(newMaxSentenceDays / 2);
    const sections = newBNSSections.split(',').map((s) => s.trim());

    const created = await phase13Service.createEPrisonsRecord({
      undertrialNumber: `UT-2026/${Math.floor(10000 + Math.random() * 90000)}`,
      prisonFacility: newFacility,
      inmateName: newInmateName,
      age: Number(newAge),
      caseNumberRef: newCaseRef,
      bookedSectionsBNS: sections,
      isFirstTimeOffender: newIsFirstTime,
      custodyType: 'JUDICIAL_CUSTODY',
      dateOfAdmission: new Date().toISOString(),
      totalDaysIncarcerated: 1,
      maxSentenceApplicableDays: Number(newMaxSentenceDays),
      sec479BNSSThresholdDays: threshold,
      sec479BailEligible: false,
      sec53MedicalFitnessStatus: 'FIT',
      paroleOrFurloughEligibility: {
        eligible: false,
        conductScore: 100,
      },
      vcCourtProductionStatus: 'NOT_DUE',
      superintendentDigitalSeal: `DIGISEAL-SUPT-${Date.now().toString().slice(-4)}`,
    });

    const updated = phase13Service.getEPrisonsRecords();
    setInmates(updated);
    setSelectedInmate(created);
    setIsAdmissionModalOpen(false);
    setToastMessage(`Inmate admission booked & biometric slip generated for ${created.inmateName}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Building2 className="w-48 h-48 text-blue-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded uppercase tracking-wider">
                National ePrisons Grid
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded uppercase tracking-wider">
                Sec 479 BNSS Undertrial Clock
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-400" />
              ePrisons & Correctional Undertrial Liberty Console
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time monitoring of Section 479 BNSS default bail thresholds (1/3rd maximum imprisonment for first-time
              offenders), mandatory Section 53 BNSS medical fitness, and biometric VC court production verification.
            </p>
          </div>

          <button
            onClick={() => setIsAdmissionModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Admit Inmate / Generate Custody Slip</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-blue-950/90 border border-blue-500/60 text-blue-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-blue-300 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Inmate Directory */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              Incarcerated Inmates ({filteredInmates.length})
            </h2>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Inmate Name, UT Number, Jail..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-3">
            {filteredInmates.map((inmate) => {
              const isSelected = selectedInmate?.inmateId === inmate.inmateId;
              const percentElapsed = Math.min(
                100,
                Math.round((inmate.totalDaysIncarcerated / inmate.sec479BNSSThresholdDays) * 100)
              );

              return (
                <div
                  key={inmate.inmateId}
                  onClick={() => setSelectedInmate(inmate)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500/60 ring-1 ring-blue-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-blue-400">{inmate.undertrialNumber}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        inmate.custodyType === 'JUDICIAL_CUSTODY'
                          ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                          : inmate.custodyType === 'INTERIM_BAIL_OUT'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {inmate.custodyType.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1">{inmate.inmateName}</div>
                  <div className="text-[11px] text-slate-400 mb-2 truncate">{inmate.prisonFacility}</div>

                  {/* Sec 479 BNSS Progress Bar */}
                  <div className="space-y-1 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Sec 479 BNSS Custody Clock:</span>
                      <span className="font-mono text-amber-400 font-semibold">
                        {inmate.totalDaysIncarcerated} / {inmate.sec479BNSSThresholdDays} Days ({percentElapsed}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          percentElapsed >= 100 ? 'bg-rose-500' : percentElapsed >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentElapsed}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Inmate Dossier & Section 479 Reckoner */}
        {selectedInmate && (
          <div className="lg:col-span-2 space-y-6">
            {/* Action Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400">Assigned Detention Facility</div>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  {selectedInmate.prisonFacility}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsParoleModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Sanction Furlough / Parole</span>
                </button>
              </div>
            </div>

            {/* Section 479 BNSS Liberty Analysis Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  Section 479 BNSS Maximum Period for which Undertrial Prisoner Can Be Detained
                </h3>
                <span className="text-xs font-mono text-emerald-400">
                  {selectedInmate.isFirstTimeOffender ? '1/3rd Sentence Rule (1st Offender)' : '1/2nd Sentence Rule'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Total Incarceration Served</div>
                  <div className="text-lg font-bold text-white mt-1">{selectedInmate.totalDaysIncarcerated} Days</div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Admitted on: {new Date(selectedInmate.dateOfAdmission).toLocaleDateString()}
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Max Sentence Threshold</div>
                  <div className="text-lg font-bold text-amber-400 mt-1">
                    {selectedInmate.sec479BNSSThresholdDays} Days
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Total Potential: {selectedInmate.maxSentenceApplicableDays} Days
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Statutory Default Bail Status</div>
                  <div
                    className={`text-sm font-bold mt-1.5 ${
                      selectedInmate.totalDaysIncarcerated >= selectedInmate.sec479BNSSThresholdDays
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {selectedInmate.totalDaysIncarcerated >= selectedInmate.sec479BNSSThresholdDays
                      ? 'MANDATORY BAIL DUE'
                      : 'CUSTODY WITHIN STATUTORY LIMIT'}
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Fitness & Video Conference Court Production */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-400" />
                    Section 53 BNSS Medical Fitness Record
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      selectedInmate.sec53MedicalFitnessStatus === 'FIT'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {selectedInmate.sec53MedicalFitnessStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Mandatory medical examination performed upon jail admission and before every court remand extension.
                  Prison medical officer certification digitally anchored.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Video className="w-4 h-4 text-indigo-400" />
                    Video Conference Court Production (Sec 530)
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {selectedInmate.vcCourtProductionStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Inmate production conducted via encrypted courtroom video conference link to prevent physical transit
                  risks and custody escape attempts.
                </p>
              </div>
            </div>

            {/* Biometric Custody Slip SHA-256 Proof */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Biometric Custody Slip Cryptographic Hash (Sec 63 BSA 2023)
                </h4>
                <span className="text-[11px] font-mono text-emerald-400">FIPS SHA-256</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 break-all">
                {selectedInmate.biometricCustodySlipSha256}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Grant Parole / Furlough */}
      {isParoleModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                Sanction Emergency Parole / Furlough
              </h3>
              <button
                onClick={() => setIsParoleModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleGrantParole} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Inmate Name</label>
                <input
                  type="text"
                  disabled
                  value={selectedInmate?.inmateName}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Parole Duration (Days)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={60}
                  value={paroleDays}
                  onChange={(e) => setParoleDays(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsParoleModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Sign & Issue Parole Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Inmate Admission */}
      {isAdmissionModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                Admit Inmate & Generate Custody Slip
              </h3>
              <button
                onClick={() => setIsAdmissionModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleNewAdmission} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Inmate Full Name</label>
                <input
                  type="text"
                  required
                  value={newInmateName}
                  onChange={(e) => setNewInmateName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">First-Time Offender?</label>
                  <select
                    value={newIsFirstTime ? 'YES' : 'NO'}
                    onChange={(e) => setNewIsFirstTime(e.target.value === 'YES')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="YES">Yes (1/3rd Sec 479 Threshold)</option>
                    <option value="NO">No (1/2nd Sec 479 Threshold)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Prison Facility</label>
                <input
                  type="text"
                  required
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Booked BNS Sections</label>
                <input
                  type="text"
                  required
                  value={newBNSSections}
                  onChange={(e) => setNewBNSSections(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdmissionModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Admit & Issue Custody Seal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
