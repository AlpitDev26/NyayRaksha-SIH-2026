import React, { useState, useEffect } from 'react';
import {
  OrganizedCrimeSyndicateRecord,
  UserRole,
  SupportedLanguage,
} from '../types';
import { phase11Service } from '../services/phase11Service';
import {
  ShieldAlert,
  Layers,
  DollarSign,
  Building2,
  Lock,
  Globe2,
  PlusCircle,
  Sparkles,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
  Coins,
  ShieldCheck,
  Flame,
  Scale,
} from 'lucide-react';

interface OrganizedCrimeForfeitureViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const OrganizedCrimeForfeitureView: React.FC<OrganizedCrimeForfeitureViewProps> = ({
  currentRole: _currentRole,
}) => {
  const [syndicates, setSyndicates] = useState<OrganizedCrimeSyndicateRecord[]>([]);
  const [selectedSyndicate, setSelectedSyndicate] = useState<OrganizedCrimeSyndicateRecord | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Form State for New Syndicate Docket
  const [syndicateName, setSyndicateName] = useState('Nexus Cartel Transnational Hawala Network');
  const [kingpinName, setKingpinName] = useState('Tariq Ahmad @ Dubai Commander');
  const [category, setCategory] = useState<OrganizedCrimeSyndicateRecord['syndicateCategory']>(
    'SEC_111_BNS_ORGANIZED_CRIME'
  );
  const [membersCount, setMembersCount] = useState(24);
  const [proceedsAmount, setProceedsAmount] = useState(620000000); // 62 Cr
  const [nodeEntityName, setNodeEntityName] = useState('Al-Safir Bullion & Commodities FZE');
  const [nodeType, setNodeType] = useState<any>('OFFSHORE_HAWALA_NODE');
  const [nodeFrozenAmount, setNodeFrozenAmount] = useState(145000000);

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const list = phase11Service.getSyndicates();
    setSyndicates(list);
    if (list.length > 0) setSelectedSyndicate(list[0]);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateSyndicate = async () => {
    try {
      const created = await phase11Service.createSyndicateRecord(
        syndicateName,
        kingpinName,
        category,
        membersCount,
        proceedsAmount,
        nodeEntityName,
        nodeType,
        nodeFrozenAmount
      );
      const updated = phase11Service.getSyndicates();
      setSyndicates([...updated]);
      setSelectedSyndicate(created);
      showToast('Section 111 BNS Organized Crime Docket & Sec 107 BNSS Freeze Attachment registered!');
    } catch (e: any) {
      showToast('Error: ' + e.message);
    }
  };

  const filtered = syndicates.filter(
    (s) =>
      s.syndicateName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.kingpinName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.fiuAlertReference.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const totalSeizedAcrossAll = syndicates.reduce(
    (acc, s) =>
      acc +
      s.illicitFinancialNodes.reduce((nodeAcc, n) => nodeAcc + n.frozenAmountRupees, 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/80 to-slate-900 border border-amber-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-amber-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Section 111 & 112 BNS 2023 | Sec 107 BNSS
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-400" /> Multi-Agency FIU / PMLA / NIA Grid
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
              Organized Crime Syndicates & Terror Asset Forfeiture
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Real-time prosecution workbench for Section 111 BNS organized crime cartels, petty syndicates (Sec 112), money laundering trails, FIU-IND suspicious transaction reporting, and Section 107 BNSS attachment & forfeiture orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 bg-slate-950/80 border border-amber-500/40 rounded-xl text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Total Frozen Assets</div>
              <div className="text-base font-mono font-bold text-amber-300">
                ₹{(totalSeizedAcrossAll / 10000000).toFixed(2)} Cr
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

      {/* Grid: Cartel Ledger / Registration & Financial Network Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Docket List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Create Syndicate Docket Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-400" /> Register Syndicate & Attach Assets
              </span>
              <span className="text-[10px] text-amber-400 font-mono">Sec 111 BNS</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Syndicate / Cartel Name:</label>
                <input
                  type="text"
                  value={syndicateName}
                  onChange={(e) => setSyndicateName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Alleged Kingpin / Head:</label>
                  <input
                    type="text"
                    value={kingpinName}
                    onChange={(e) => setKingpinName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Category (BNS):</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  >
                    <option value="SEC_111_BNS_ORGANIZED_CRIME">Sec 111 BNS (Organized Crime)</option>
                    <option value="SEC_112_BNS_PETTY_ORGANIZED">Sec 112 BNS (Petty Organized)</option>
                    <option value="TRANSNATIONAL_TERROR_FINANCING">Transnational Terror Syndicate</option>
                    <option value="CYBER_CRIME_CARTEL">Cyber Crime Hawala Network</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Active Operatives Count:</label>
                  <input
                    type="number"
                    value={membersCount}
                    onChange={(e) => setMembersCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Estimated Proceeds (₹):</label>
                  <input
                    type="number"
                    value={proceedsAmount}
                    onChange={(e) => setProceedsAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              {/* Initial Node Attachment */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Initial Node Attachment (Sec 107 BNSS)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Entity / Benami Asset"
                    value={nodeEntityName}
                    onChange={(e) => setNodeEntityName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                  />
                  <select
                    value={nodeType}
                    onChange={(e: any) => setNodeType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                  >
                    <option value="OFFSHORE_HAWALA_NODE">Offshore Hawala Account</option>
                    <option value="CRYPTO_TUMBLER_WALLET">Crypto Tumbler Pool</option>
                    <option value="BENAMI_REAL_ESTATE">Benami Commercial Property</option>
                    <option value="SHELL_COMPANY">Shell Trading Entity</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[10px]">Frozen Value:</span>
                  <input
                    type="number"
                    value={nodeFrozenAmount}
                    onChange={(e) => setNodeFrozenAmount(Number(e.target.value))}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-amber-300 font-mono text-xs"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateSyndicate}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200" /> Generate Attachment & Forfeiture Docket
              </button>
            </div>
          </div>

          {/* List of Active Syndicates */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Investigated Syndicates ({filtered.length})
              </span>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                <input
                  type="text"
                  placeholder="Filter cartels..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-7 pr-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 w-36"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSyndicate(s)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedSyndicate?.id === s.id
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="truncate">{s.syndicateName}</span>
                    <span className="text-[10px] font-mono text-amber-400 shrink-0">
                      ₹{(s.totalProceedsEstimatedRupees / 10000000).toFixed(1)} Cr
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Kingpin: {s.kingpinName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 font-mono">
                      {s.illicitFinancialNodes.length} Nodes Frozen
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Syndicate Deep Dive & Multi-Node Network Graph */}
        <div className="lg:col-span-7 space-y-4">
          {selectedSyndicate ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {selectedSyndicate.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {selectedSyndicate.syndicateCategory.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">
                    {selectedSyndicate.syndicateName}
                  </h2>
                  <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                    <span>Alleged Head: <strong className="text-slate-200">{selectedSyndicate.kingpinName}</strong></span>
                    <span>•</span>
                    <span>Operatives: <strong className="text-slate-200">{selectedSyndicate.activeMembersCount}</strong></span>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className="text-slate-400 block text-[10px]">FIU-IND STR Alert Ref</span>
                  <span className="text-amber-400 font-bold">{selectedSyndicate.fiuAlertReference}</span>
                </div>
              </div>

              {/* Statutory Invocation Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedSyndicate.uapaOrPmlaSections.map((sec, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-rose-950/60 text-rose-300 border border-rose-500/30"
                  >
                    {sec}
                  </span>
                ))}
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-blue-950/60 text-blue-300 border border-blue-500/30">
                  Lead Agency: {selectedSyndicate.investigatingAgency.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Illicit Financial Nodes & Assets Attached (Sec 107 BNSS) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" /> Attached Assets & Frozen Channels (Sec 107 BNSS)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Total: ₹{(selectedSyndicate.illicitFinancialNodes.reduce((a, b) => a + b.frozenAmountRupees, 0) / 10000000).toFixed(2)} Cr
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedSyndicate.illicitFinancialNodes.map((node) => (
                    <div
                      key={node.nodeId}
                      className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                            {node.nodeId}
                          </span>
                          <span className="font-bold text-xs text-slate-200">{node.entityName}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {node.fiuFlagStatus.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase">Node Type</span>
                          <span className="text-slate-300">{node.nodeType.replace(/_/g, ' ')}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase">Jurisdiction</span>
                          <span className="text-slate-300">{node.jurisdiction}</span>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-[9px] text-slate-500 block uppercase">Frozen Amount</span>
                          <span className="text-amber-300 font-bold">
                            ₹{(node.frozenAmountRupees / 10000000).toFixed(2)} Cr
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cryptographic Attachment Order Seal */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Special Judge (PMLA/NIA) Attachment Order Hash
                  </span>
                  <span className="text-emerald-400 font-bold">CERTIFIED SEC 107 BNSS</span>
                </div>
                <div className="font-mono text-[11px] text-slate-400 break-all select-all">
                  {selectedSyndicate.courtAttachmentOrderSha256}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  onClick={() => showToast('Transmitted forfeiture dossier to FIU-IND and Enforcement Directorate portal!')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <FileCheck className="w-4 h-4" /> Dispatch Forfeiture Docket to FIU-IND
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
              <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select an organized crime docket to inspect asset attachment tree.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
