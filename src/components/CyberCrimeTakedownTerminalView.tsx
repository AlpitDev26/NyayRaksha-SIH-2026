import React, { useState } from 'react';
import {
  Globe,
  Radio,
  Lock,
  Building,
  CheckCircle2,
  Send,
  Plus,
  Zap,
} from 'lucide-react';
import { phase12Service } from '../services/phase12Service';
import { CyberCrimeTakedownRecord } from '../types';

export const CyberCrimeTakedownTerminalView: React.FC = () => {
  const [takedowns, setTakedowns] = useState<CyberCrimeTakedownRecord[]>(phase12Service.getCyberTakedowns());
  const [selectedTakedown, setSelectedTakedown] = useState<CyberCrimeTakedownRecord>(takedowns[0] || null);
  const [isNewNoticeModalOpen, setIsNewNoticeModalOpen] = useState<boolean>(false);
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState<boolean>(false);

  // Form states for new Notice
  const [i4cRef, setI4cRef] = useState<string>('1930-NCRP-2026-99310');
  const [incidentType, setIncidentType] = useState<
    | 'DEEPFAKE_MALICIOUS_MEDIA'
    | 'FINANCIAL_PHISHING_MULE_GRID'
    | 'DARKNET_NARCOTICS_SYNDICATE'
    | 'RANSOMWARE_CRITICAL_INFRA'
    | 'TERROR_RECRUITMENT_CHANNEL'
  >('FINANCIAL_PHISHING_MULE_GRID');
  const [platform, setPlatform] = useState<
    | 'TELEGRAM_ENCRYPTED_CHANNEL'
    | 'DARKNET_TOR_ONION'
    | 'X_PLATFORM_BOTNET'
    | 'OFFSHORE_CRYPTO_MIXER'
    | 'PHISHING_DOMAIN_REGISTRAR'
  >('PHISHING_DOMAIN_REGISTRAR');
  const [offendingUrl, setOffendingUrl] = useState<string>('https://sbi-kyc-update-portal-fraud2026.online/login');
  const [statutoryPower, setStatutoryPower] = useState<
    'SEC_69A_IT_ACT' | 'SEC_79_3_B_IT_ACT' | 'SEC_111_BNS_ORGANIZED_CYBER_CRIME'
  >('SEC_69A_IT_ACT');

  // Freeze Modal states
  const [bankName, setBankName] = useState<string>('Axis Bank Ltd.');
  const [accNumber, setAccNumber] = useState<string>('91802003891XXXX');
  const [freezeAmount, setFreezeAmount] = useState<number>(2450000);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await phase12Service.issueCyberTakedownNotice({
      i4cIncidentRef: i4cRef,
      incidentType,
      targetPlatform: platform,
      offendingUrlOrHandle: offendingUrl,
      statutoryPowersInvoked: statutoryPower,
      takedownStatus: 'ISSUED_AWAITING_INTERMEDIARY',
      muleBankAccountsFrozen: [],
      certInEscalationRef: `CERT-IN-2026-TICKET-${Math.floor(1000 + Math.random() * 9000)}`,
      certInOfficerName: 'Deputy Director S. Ramachandran (CERT-In National Cyber Grid)',
    });

    const updated = phase12Service.getCyberTakedowns();
    setTakedowns(updated);
    setSelectedTakedown(created);
    setIsNewNoticeModalOpen(false);
    setToastMessage(`Emergency Takedown Notice #${created.noticeId} dispatched under ${created.statutoryPowersInvoked}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFreezeAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTakedown) return;

    phase12Service.freezeAdditionalMuleAccount(selectedTakedown.noticeId, {
      bankName,
      accountNumberMasked: accNumber,
      frozenAmountRupees: Number(freezeAmount),
      fiuAlertId: `FIU-IND-RAPID-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    const updated = phase12Service.getCyberTakedowns();
    setTakedowns(updated);
    const curr = updated.find((n) => n.noticeId === selectedTakedown.noticeId);
    if (curr) setSelectedTakedown(curr);

    setIsFreezeModalOpen(false);
    setToastMessage(`Rapid Financial Mule Account Frozen (₹${Number(freezeAmount).toLocaleString('en-IN')}) via FIU-IND 1930 Portal`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-indigo-950/80 border border-red-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Globe className="w-48 h-48 text-red-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/40 rounded uppercase tracking-wider">
                I4C National Command
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded uppercase tracking-wider">
                Sec 69A IT Act & Sec 111 BNS
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Globe className="w-6 h-6 text-red-400" />
              Cyber Crime & Dark Web Takedown Terminal
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time integration with 1930 National Cyber Crime Reporting Portal (NCRP), Section 69A / 79(3)(b) IT Act
              emergency blocking directives, and immediate financial mule account freezing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewNoticeModalOpen(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-red-900/30"
            >
              <Zap className="w-4 h-4" />
              <span>Issue Section 69A Takedown Directive</span>
            </button>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-red-950/90 border border-red-500/60 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-red-300 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Takedown Directives */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400" />
              Active Takedowns & Directives ({takedowns.length})
            </h2>
          </div>

          <div className="space-y-3">
            {takedowns.map((notice) => {
              const isSelected = selectedTakedown?.noticeId === notice.noticeId;
              const totalFrozen = notice.muleBankAccountsFrozen.reduce((acc, m) => acc + m.frozenAmountRupees, 0);

              return (
                <div
                  key={notice.noticeId}
                  onClick={() => setSelectedTakedown(notice)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-red-500/60 ring-1 ring-red-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-red-400">{notice.noticeId}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        notice.takedownStatus === 'EMERGENCY_BLOCKED_CERT_IN'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : notice.takedownStatus === 'FROZEN_FINANCIAL_MULE_ACCOUNTS'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-red-500/15 text-red-300 border-red-500/30'
                      }`}
                    >
                      {notice.takedownStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-white mb-1">{notice.incidentType.replace(/_/g, ' ')}</div>

                  <div className="text-[11px] text-slate-400 mt-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Platform:</span>
                      <span className="font-mono text-slate-200">{notice.targetPlatform.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>NCRP 1930 Ref:</span>
                      <span className="font-mono text-slate-300">{notice.i4cIncidentRef}</span>
                    </div>
                  </div>

                  {totalFrozen > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Total Mule Funds Frozen:</span>
                      <span className="font-bold text-amber-400">₹{totalFrozen.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Directive & Live Mule Freeze Console */}
        {selectedTakedown && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Directive Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30 rounded">
                    {selectedTakedown.statutoryPowersInvoked.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">
                    {selectedTakedown.incidentType.replace(/_/g, ' ')}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1">
                    NCRP 1930 Incident ID:{' '}
                    <span className="font-mono text-slate-200 font-semibold">{selectedTakedown.i4cIncidentRef}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsFreezeModalOpen(true)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Freeze Mule Bank Account</span>
                </button>
              </div>

              {/* Target & Intermediary Info */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                <div className="text-slate-400">Offending URL / Channel Handle / Onion Domain:</div>
                <div className="font-mono text-xs text-red-400 break-all p-2 bg-slate-900 rounded border border-slate-800">
                  {selectedTakedown.offendingUrlOrHandle}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">CERT-In Escalation Desk</div>
                  <div className="text-xs font-semibold text-white mt-1">{selectedTakedown.certInOfficerName}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    Ticket: {selectedTakedown.certInEscalationRef}
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Digital Evidence Forensic Hash (BSA 63)</div>
                  <div className="font-mono text-[10px] text-emerald-400 break-all mt-1">
                    {selectedTakedown.digitalEvidenceSha256}
                  </div>
                </div>
              </div>
            </div>

            {/* Mule Bank Accounts Frozen Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-400" />
                  Frozen Financial Mule Bank Accounts (Sec 106 BNSS / FIU-IND)
                </h4>
                <span className="text-xs text-amber-400 font-bold">
                  {selectedTakedown.muleBankAccountsFrozen.length} Accounts Intercepted
                </span>
              </div>

              {selectedTakedown.muleBankAccountsFrozen.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-lg border border-slate-800">
                  No bank accounts flagged for freezing under this directive yet. Click "Freeze Mule Bank Account" to link.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedTakedown.muleBankAccountsFrozen.map((mule, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          <Building className="w-3.5 h-3.5 text-blue-400" />
                          {mule.bankName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          Account: {mule.accountNumberMasked} | FIU Alert: {mule.fiuAlertId}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-amber-400">
                          ₹{mule.frozenAmountRupees.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-emerald-400 font-semibold">Immediate Lien Placed</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Emergency Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setToastMessage(
                    `Transmitting High-Priority Section 69A Gazette Notice to Telegram Legal & Ministry of Electronics & IT (MeitY)...`
                  );
                  setTimeout(() => setToastMessage(null), 3500);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-red-900/30"
              >
                <Radio className="w-4 h-4" />
                <span>Broadcast MeitY Intermediary Takedown Directive</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Issue Section 69A Takedown Directive */}
      {isNewNoticeModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-red-400" />
                Issue Emergency Cyber Takedown Directive
              </h3>
              <button
                onClick={() => setIsNewNoticeModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">NCRP 1930 Helpline Incident ID</label>
                <input
                  type="text"
                  required
                  value={i4cRef}
                  onChange={(e) => setI4cRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Incident Categorization</label>
                <select
                  value={incidentType}
                  onChange={(e) =>
                    setIncidentType(
                      e.target.value as
                        | 'DEEPFAKE_MALICIOUS_MEDIA'
                        | 'FINANCIAL_PHISHING_MULE_GRID'
                        | 'DARKNET_NARCOTICS_SYNDICATE'
                        | 'RANSOMWARE_CRITICAL_INFRA'
                        | 'TERROR_RECRUITMENT_CHANNEL'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="FINANCIAL_PHISHING_MULE_GRID">Financial Phishing & Mule Syndicate (Sec 318(4) BNS)</option>
                  <option value="DEEPFAKE_MALICIOUS_MEDIA">Deepfake Impersonation & Harassment (Sec 79 BNS)</option>
                  <option value="DARKNET_NARCOTICS_SYNDICATE">Darknet Escrow & Contraband Portal (Sec 111 BNS)</option>
                  <option value="RANSOMWARE_CRITICAL_INFRA">Critical Infrastructure Ransomware (Sec 66F IT Act)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Intermediary / Platform</label>
                <select
                  value={platform}
                  onChange={(e) =>
                    setPlatform(
                      e.target.value as
                        | 'TELEGRAM_ENCRYPTED_CHANNEL'
                        | 'DARKNET_TOR_ONION'
                        | 'X_PLATFORM_BOTNET'
                        | 'OFFSHORE_CRYPTO_MIXER'
                        | 'PHISHING_DOMAIN_REGISTRAR'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="PHISHING_DOMAIN_REGISTRAR">Phishing Domain Registrar / Web Host</option>
                  <option value="TELEGRAM_ENCRYPTED_CHANNEL">Telegram Encrypted Bot / Public Channel</option>
                  <option value="DARKNET_TOR_ONION">Darknet TOR .onion Hidden Service</option>
                  <option value="OFFSHORE_CRYPTO_MIXER">Offshore Cryptocurrency Tumbler / Smart Contract</option>
                  <option value="X_PLATFORM_BOTNET">X / Twitter Coordinated Inauthentic Network</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Offending URL / Domain / Channel</label>
                <input
                  type="text"
                  required
                  value={offendingUrl}
                  onChange={(e) => setOffendingUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Statutory Authority Invoked</label>
                <select
                  value={statutoryPower}
                  onChange={(e) =>
                    setStatutoryPower(
                      e.target.value as 'SEC_69A_IT_ACT' | 'SEC_79_3_B_IT_ACT' | 'SEC_111_BNS_ORGANIZED_CYBER_CRIME'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="SEC_69A_IT_ACT">Section 69A IT Act (Emergency Blocking Order)</option>
                  <option value="SEC_79_3_B_IT_ACT">Section 79(3)(b) IT Act (Intermediary Take-Down Notice)</option>
                  <option value="SEC_111_BNS_ORGANIZED_CYBER_CRIME">Section 111 BNS (Organized Cyber Crime Nexus)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewNoticeModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Dispatch Emergency Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Freeze Mule Bank Account */}
      {isFreezeModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-400" />
                Rapid Financial Mule Account Freeze (FIU-IND)
              </h3>
              <button
                onClick={() => setIsFreezeModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleFreezeAccount} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Bank Name</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Masked Account Number</label>
                <input
                  type="text"
                  required
                  value={accNumber}
                  onChange={(e) => setAccNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Amount to Freeze (INR ₹)</label>
                <input
                  type="number"
                  required
                  value={freezeAmount}
                  onChange={(e) => setFreezeAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg text-amber-300 text-[11px] flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Automatic lien will be placed via Reserve Bank of India & FIU-IND 1930 Cyber Fraud Gateway.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFreezeModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Building className="w-4 h-4" />
                  Execute Immediate Lien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
