import React, { useState, useEffect } from 'react';
import { FugitiveProclamationAssetRecord, CaseFile, UserRole, SupportedLanguage } from '../types';
import { phase8Service } from '../services/phase8Service';
import { storageService } from '../services/storageService';
import {
  Globe,
  ShieldAlert,
  Building,
  DollarSign,
  AlertOctagon,
  CheckCircle2,
  Lock,
  PlusCircle,
  Radio,
  FileCheck,
  Search,
  ExternalLink,
  Flame,
  KeyRound,
  Sparkles,
} from 'lucide-react';

interface FugitiveInterAgencyHubViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const FugitiveInterAgencyHubView: React.FC<FugitiveInterAgencyHubViewProps> = ({
  currentRole: _currentRole,
}) => {
  const [fugitives, setFugitives] = useState<FugitiveProclamationAssetRecord[]>([]);
  const [selectedFugitive, setSelectedFugitive] = useState<FugitiveProclamationAssetRecord | null>(null);
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  // Proclamation Builder Form
  const [offenderName, setOffenderName] = useState('Danish Farooqui');
  const [aliases, setAliases] = useState('Danny Bhai, Daniel Frost');
  const [passportNo, setPassportNo] = useState('Z8941209');
  const [rewardAmount, setRewardAmount] = useState<number>(1000000);
  const [interpolNotice, setInterpolNotice] = useState<
    'RED_CORNER' | 'BLUE_NOTICE' | 'LOOKOUT_CIRCULAR_LOC' | 'NONE'
  >('RED_CORNER');
  const [assetDescription, setAssetDescription] = useState(
    'Commercial Office Space, Nariman Point, Mumbai (3000 sq.ft)'
  );
  const [assetType, setAssetType] = useState<any>('IMMOVABLE_REAL_ESTATE');
  const [assetValue, setAssetValue] = useState<number>(150000000);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const list = phase8Service.getFugitives();
    setFugitives(list);
    if (list.length > 0) setSelectedFugitive(list[0]);
    const stored = storageService.getCases();
    setCases(stored);
    if (stored.length > 0) setSelectedCaseId(stored[0].id);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleIssueProclamation = async () => {
    const target = cases.find((c) => c.id === selectedCaseId);
    if (!target) return;

    try {
      const aliasArray = aliases.split(',').map((a) => a.trim()).filter(Boolean);
      const created = await phase8Service.createFugitiveProclamation(
        target,
        offenderName,
        aliasArray,
        passportNo,
        rewardAmount,
        interpolNotice,
        assetDescription,
        assetType,
        assetValue
      );
      setFugitives([...phase8Service.getFugitives()]);
      setSelectedFugitive(created);
      showToast('Section 84 Proclamation & Section 107 Asset Freeze order broadcasted!');
    } catch (e: any) {
      showToast('Error: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/80 to-slate-900 border border-amber-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-amber-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Sections 84, 85 & 107 BNSS 2023
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <Globe className="w-3 h-3 text-rose-400" /> Interpol / CBI / FIU Sovereign Network
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
              Proclaimed Offender Hub & Asset Attachment Deck
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              National registry for tracking Section 84 BNSS 30-day proclamation timers, automated Interpol Red Notice broadcasts, and real-time attachment of proceeds of crime under Section 107 BNSS.
            </p>
          </div>
        </div>

        {notification && (
          <div className="mt-3 p-2.5 bg-emerald-950/90 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Proclamation Creator & Global Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Proclamation & Asset Seizure Request Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-400" /> Issue Sec 84 Proclamation Order
              </span>
              <span className="text-[10px] text-amber-400 font-mono">Sec 107 Forfeiture</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Crime Docket:</label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.title.slice(0, 32)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Offender Full Name:</label>
                  <input
                    type="text"
                    value={offenderName}
                    onChange={(e) => setOffenderName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Passport / ID No:</label>
                  <input
                    type="text"
                    value={passportNo}
                    onChange={(e) => setPassportNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Aliases & Known Pseudonyms:</label>
                <input
                  type="text"
                  value={aliases}
                  onChange={(e) => setAliases(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Interpol Notice Type:</label>
                  <select
                    value={interpolNotice}
                    onChange={(e: any) => setInterpolNotice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  >
                    <option value="RED_CORNER">Red Corner Notice (RCN)</option>
                    <option value="BLUE_NOTICE">Blue Notice (Locate/Identify)</option>
                    <option value="LOOKOUT_CIRCULAR_LOC">Look Out Circular (LOC)</option>
                    <option value="NONE">Domestic Warrant Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Reward Bounty (₹):</label>
                  <input
                    type="number"
                    step={100000}
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              {/* Section 107 Attached Asset Specification */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" /> Sec 107 Attached Proceeds of Crime
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Asset Category:</label>
                  <select
                    value={assetType}
                    onChange={(e: any) => setAssetType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 text-xs"
                  >
                    <option value="IMMOVABLE_REAL_ESTATE">Immovable Real Estate (Commercial/Residential)</option>
                    <option value="BANK_ACCOUNT_FIU">FIU Bank Accounts / Fixed Deposits</option>
                    <option value="CRYPTO_COLD_WALLET">Cold Storage Crypto Wallet</option>
                    <option value="LUXURY_VEHICLE">Luxury Vehicles & Superyachts</option>
                    <option value="EQUITY_SHARES">Equity Shares & Debentures</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Asset Description & Address:</label>
                  <input
                    type="text"
                    value={assetDescription}
                    onChange={(e) => setAssetDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Estimated Asset Value (₹):</label>
                  <input
                    type="number"
                    step={1000000}
                    value={assetValue}
                    onChange={(e) => setAssetValue(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 text-xs font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleIssueProclamation}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200" /> Broadcast Proclamation & Freeze Asset
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Proclamation Dashboard & Multi-Agency Grid */}
        <div className="lg:col-span-7 space-y-4">
          {selectedFugitive ? (
            <div className="space-y-4">
              {/* Proclamation Profile Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-300">
                        {selectedFugitive.id}
                      </span>
                      {selectedFugitive.interpolNoticeType !== 'NONE' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {selectedFugitive.interpolNoticeType?.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-black text-white mt-1">
                      {selectedFugitive.offenderName}
                    </h2>
                    <div className="text-xs text-slate-400">
                      Aliases: {selectedFugitive.aliasList.join(', ')}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Reward Bounty</span>
                    <div className="text-base font-bold font-mono text-amber-400">
                      ₹{selectedFugitive.rewardAnnouncedRupees.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Section 84 30-Day Proclamation Countdown Card */}
                <div className="bg-gradient-to-r from-amber-950/40 to-slate-950 p-3.5 rounded-lg border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4 text-amber-400" /> Section 84 BNSS Statutory Proclamation
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Status: {selectedFugitive.bnssSec84ProclamationStatus.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-mono text-xs font-bold">
                    {selectedFugitive.daysRemainingForSurrender} Days Left to Surrender
                  </span>
                </div>

                {/* Section 107 Attached Proceeds of Crime */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-amber-400" /> Attached Assets under Section 107 BNSS
                  </h4>
                  <div className="space-y-2">
                    {selectedFugitive.attachedAssetsSec107.map((asset) => (
                      <div
                        key={asset.assetId}
                        className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{asset.description}</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            ₹{asset.estimatedValueRupees.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Court Ref: {asset.courtOrderRef}</span>
                          <span className="px-2 py-0.5 rounded bg-rose-950/70 text-rose-300 border border-rose-800/40 font-bold">
                            {asset.attachmentStatus.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cross-Agency Broadcast Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" /> Inter-Agency Federation Live Sync
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {selectedFugitive.crossAgencyAlerts.map((alert, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-950 rounded border border-slate-800 text-xs text-center space-y-1"
                      >
                        <div className="font-bold text-slate-300">{alert.agency}</div>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 block">
                          {alert.alertStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-end">
                  <button
                    onClick={() => showToast('Section 84 Public Notice dispatched to National Press & e-Gazette!')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <FileCheck className="w-4 h-4" /> Publish Gazette Proclamation
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
              <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select fugitive to view proclamation & asset details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
