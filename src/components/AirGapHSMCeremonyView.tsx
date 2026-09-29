import React, { useState, useEffect } from 'react';
import { AirGapHSMCeremonyRecord, UserRole, SupportedLanguage } from '../types';
import { phase11Service } from '../services/phase11Service';
import {
  Cpu,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Server,
  Layers,
  FileCheck,
  Building,
  Terminal,
  FileCode,
  HardDrive,
} from 'lucide-react';

interface AirGapHSMCeremonyViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const AirGapHSMCeremonyView: React.FC<AirGapHSMCeremonyViewProps> = ({
  currentRole: _currentRole,
}) => {
  const [ceremonies, setCeremonies] = useState<AirGapHSMCeremonyRecord[]>([]);
  const [selectedCeremony, setSelectedCeremony] = useState<AirGapHSMCeremonyRecord | null>(null);
  const [ceremonyType, setCeremonyType] = useState<AirGapHSMCeremonyRecord['ceremonyType']>(
    'MASTER_LEDGER_ROOT_ROTATION'
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const list = phase11Service.getHSMCeremonies();
    setCeremonies(list);
    if (list.length > 0) setSelectedCeremony(list[0]);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleStartCeremony = async () => {
    setIsExecuting(true);
    setStepIndex(1);

    setTimeout(() => {
      setStepIndex(2);
      setTimeout(async () => {
        setStepIndex(3);
        const created = await phase11Service.executeHSMCeremony(ceremonyType);
        const updated = phase11Service.getHSMCeremonies();
        setCeremonies([...updated]);
        setSelectedCeremony(created);
        setIsExecuting(false);
        setStepIndex(0);
        showToast('FIPS 140-3 Level 4 Air-Gap HSM Key Ceremony successfully concluded!');
      }, 1200);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 border border-cyan-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                FIPS 140-3 Level 4 Certified Enclave
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-emerald-400" /> 3-of-5 Shamir Secret Threshold Quorum
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-cyan-400" />
              Sovereign Air-Gap HSM Root Key Ceremony
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Cryptographic root rotation and Shamir threshold secret sharing ceremony executed inside an electromagnetic Faraday air-gap chamber by the tripartite collegium (Supreme Court Judicial Trustee, MHA Security Trustee, NIC Infrastructure Trustee).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 bg-slate-950/80 border border-cyan-500/40 rounded-xl text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">HSM Security Profile</div>
              <div className="text-xs font-mono font-bold text-cyan-300">
                BSI / CC EAL6+ Certified
              </div>
            </div>
          </div>
        </div>

        {notification && (
          <div className="mt-3 p-2.5 bg-emerald-950/90 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ceremony Launcher & History */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-cyan-400" /> Initiate Air-Gap Key Ceremony
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">Faraday Enclave</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Ceremony Classification:</label>
                <select
                  value={ceremonyType}
                  onChange={(e: any) => setCeremonyType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                >
                  <option value="MASTER_LEDGER_ROOT_ROTATION">Master Ledger Root Rotation (Annual)</option>
                  <option value="DISASTER_RECOVERY_FAILOVER_HYDERABAD">Disaster Recovery Cold-Site Failover</option>
                  <option value="SHAMIR_THRESHOLD_RECONSTRUCTION">Shamir Threshold Emergency Reconstruction</option>
                </select>
              </div>

              {/* Ceremony Execution Progress */}
              {isExecuting && (
                <div className="p-3.5 bg-cyan-950/40 rounded-xl border border-cyan-500/40 space-y-2 animate-pulse">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                    <span>Executing Protocol Phase {stepIndex}/3</span>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {stepIndex === 1 && 'Authenticating 3-of-5 Hardware Smart Cards & Verifying PIN Entropy...'}
                    {stepIndex === 2 && 'Generating Shamir Polynomial Shares & Computing Cold-Vault Root Hash...'}
                    {stepIndex === 3 && 'Signing Collegium Audit Certificate and Sealing HSM Enclave...'}
                  </div>
                </div>
              )}

              <button
                disabled={isExecuting}
                onClick={handleStartCeremony}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 disabled:opacity-50 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" /> Convene Quorum & Execute Ceremony
              </button>
            </div>
          </div>

          {/* Past Ceremonies */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Ceremony Audit Log ({ceremonies.length})
            </span>
            <div className="space-y-2">
              {ceremonies.map((c) => (
                <div
                  key={c.ceremonyId}
                  onClick={() => setSelectedCeremony(c)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedCeremony?.ceremonyId === c.ceremonyId
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>{c.ceremonyType.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] font-mono text-emerald-400">SUCCESS</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{c.fips140Level.replace(/_/g, ' ')}</span>
                    <span className="font-mono text-[10px]">{new Date(c.ceremonyTimestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Key Custodians & Ceremony Certificate */}
        <div className="lg:col-span-7 space-y-4">
          {selectedCeremony ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      {selectedCeremony.ceremonyId}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {selectedCeremony.ceremonyStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">
                    {selectedCeremony.ceremonyType.replace(/_/g, ' ')}
                  </h2>
                  <div className="text-xs text-slate-400">
                    Threshold: {selectedCeremony.thresholdMofN.replace(/_/g, ' ')} | Protocol: {selectedCeremony.fips140Level.replace(/_/g, ' ')}
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className="text-slate-400 block text-[10px]">Collegium Cert Ref</span>
                  <span className="text-cyan-400 font-bold">{selectedCeremony.collegiumAuditCertificate}</span>
                </div>
              </div>

              {/* Key Custodians Present */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  Tripartite Key Custodians (Quorum Satisfied)
                </div>

                <div className="space-y-2">
                  {selectedCeremony.keyCustodiansPresent.map((k, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{k.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-300">
                          {k.role}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Dept: {k.department}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-mono text-[10px]">SmartCard OK</span>
                          <span className="text-emerald-400 font-mono text-[10px]">PIN Entropy 100%</span>
                        </div>
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 truncate">
                        Shamir Partial Share Hash: {k.partialKeyShareSha256}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cold Vault Backup & Ledger Root */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">COLD VAULT BACKUP DIGEST</span>
                  <div className="text-cyan-300 font-mono text-[11px] break-all">
                    {selectedCeremony.coldVaultBackupHash}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">SOVEREIGN LEDGER STATE HASH</span>
                  <div className="text-emerald-400 font-mono text-[11px] break-all">
                    {selectedCeremony.sovereignLedgerStateHash}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  onClick={() => showToast('Dispatched Sovereign HSM Root Certificate to Supreme Court e-Committee & MHA!')}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <FileCheck className="w-4 h-4" /> Export Signed Collegium Certificate
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
              <Cpu className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select an HSM key ceremony record to review cryptographic quorum verification.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
