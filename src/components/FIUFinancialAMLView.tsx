import React, { useState } from 'react';
import {
  Coins,
  ShieldAlert,
  Building,
  ArrowUpRight,
  TrendingUp,
  Scale,
  Plus,
  Send,
  CheckCircle2,
  FileCheck2,
  Lock,
} from 'lucide-react';
import { phase13Service } from '../services/phase13Service';
import { FIUFinancialIntelligenceRecord } from '../types';

export const FIUFinancialAMLView: React.FC = () => {
  const [records, setRecords] = useState<FIUFinancialIntelligenceRecord[]>(phase13Service.getFIURecords());
  const [selectedRecord, setSelectedRecord] = useState<FIUFinancialIntelligenceRecord>(records[0] || null);
  const [isNewAlertModalOpen, setIsNewAlertModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [syndicateName, setSyndicateName] = useState<string>('Apex Matrix Offshore Hawala Syndicate');
  const [volumeRupees, setVolumeRupees] = useState<number>(450000000);
  const [predicateSections, setPredicateSections] = useState<string>('Sec 3 & 4 PMLA 2002, Sec 111 BNS, Sec 318(4) BNS');
  const [agency, setAgency] = useState<'ENFORCEMENT_DIRECTORATE_ED' | 'FIU_IND_FINNET' | 'INCOME_TAX_INVESTIGATION'>(
    'ENFORCEMENT_DIRECTORATE_ED'
  );

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const sections = predicateSections.split(',').map((s) => s.trim());

    const created = await phase13Service.createFIURecord({
      syndicateOrEntityName: syndicateName,
      investigatingAgency: agency,
      pmlaPredicateSections: sections,
      totalLaunderingVolumeRupees: Number(volumeRupees),
      attachmentStatus: 'PROVISIONAL_ATTACHMENT_SEC_5',
      hawalaNodesTracked: [
        {
          nodeLocation: 'Surat Diamond Bourse Hawala Channel',
          operatorAlias: '"Surat Operator-9"',
          estimatedFlowRupees: 180000000,
        },
      ],
      cryptoMixerEntities: [
        {
          blockchain: 'TRON_TRC20',
          mixerContractOrAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
          launderedAmountCrypto: '3,200,000 USDT',
          fiatEquivalentRupees: 281600000,
        },
      ],
      benamiPropertiesAttached: [
        {
          propertyDescription: 'Commercial Office Tower (Floor 14-16)',
          location: 'BKC, Bandra East, Mumbai',
          marketValueRupees: 140000000,
        },
      ],
    });

    const updated = phase13Service.getFIURecords();
    setRecords(updated);
    setSelectedRecord(created);
    setIsNewAlertModalOpen(false);
    setToastMessage(`FIU-IND FINNET 2.0 Attachment Docket created under Alert ID ${created.alertId}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-red-950/80 border border-amber-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Coins className="w-48 h-48 text-amber-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded uppercase tracking-wider">
                FIU-IND FINNET 2.0
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded uppercase tracking-wider">
                PMLA 2002 & Sec 107 BNSS
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Coins className="w-6 h-6 text-amber-400" />
              Financial Intelligence & Crypto-Hawala AML De-Anonymization Mesh
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Cross-border Hawala tracking, USDT TRC-20 & Bitcoin tumbler peeling analysis, Benami property attachment
              under Section 5 PMLA / Section 107 BNSS, and Special Court Confiscation Orders.
            </p>
          </div>

          <button
            onClick={() => setIsNewAlertModalOpen(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Generate FIU Suspicious Transaction Alert</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-amber-950/90 border border-amber-500/60 text-amber-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-amber-300 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of FIU Alerts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Active AML & Attachment Dockets ({records.length})
            </h2>
          </div>

          <div className="space-y-3">
            {records.map((fiu) => {
              const isSelected = selectedRecord?.alertId === fiu.alertId;

              return (
                <div
                  key={fiu.alertId}
                  onClick={() => setSelectedRecord(fiu)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/60 ring-1 ring-amber-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-amber-400">{fiu.alertId}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        fiu.attachmentStatus === 'CONFIRMATION_BY_ADJUDICATING_AUTHORITY'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {fiu.attachmentStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1 line-clamp-2">{fiu.syndicateOrEntityName}</div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Laundering:</span>
                    <span className="font-mono font-bold text-amber-400">
                      ₹{(fiu.totalLaunderingVolumeRupees / 10000000).toFixed(2)} Cr
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Hawala & Crypto De-anonymization Console */}
        {selectedRecord && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                    {selectedRecord.investigatingAgency.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{selectedRecord.syndicateOrEntityName}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Sections: <span className="text-slate-200">{selectedRecord.pmlaPredicateSections.join(' | ')}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Total Attached Assets Value</div>
                  <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                    ₹{selectedRecord.totalLaunderingVolumeRupees.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Crypto Tumbler & Hawala Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Crypto Tumbler Tracking */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    De-Anonymized Crypto Tumbler Traces
                  </h4>
                  <span className="text-xs font-mono text-cyan-300">TRC-20 & Taproot</span>
                </div>

                <div className="space-y-3 text-xs">
                  {selectedRecord.cryptoMixerEntities.map((crypto, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Blockchain:</span>
                        <span className="font-mono font-semibold text-cyan-400">{crypto.blockchain}</span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 break-all p-1.5 bg-slate-900 rounded">
                        {crypto.mixerContractOrAddress}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-400">Laundered:</span>
                        <span className="font-bold text-white">
                          {crypto.launderedAmountCrypto} (₹{crypto.fiatEquivalentRupees.toLocaleString('en-IN')})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benami Properties Attached */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-400" />
                    Benami Real Estate Attached (Sec 107 BNSS)
                  </h4>
                  <span className="text-xs font-mono text-emerald-400">Attached</span>
                </div>

                <div className="space-y-3 text-xs">
                  {selectedRecord.benamiPropertiesAttached.map((prop, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                      <div className="font-semibold text-white">{prop.propertyDescription}</div>
                      <div className="text-slate-400 text-[11px]">{prop.location}</div>
                      <div className="flex items-center justify-between pt-1 text-slate-300">
                        <span>Market Value:</span>
                        <span className="font-mono font-bold text-emerald-400">
                          ₹{prop.marketValueRupees.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Special Court PMLA Order Seal */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  Special Court PMLA Confiscation Order Digital Seal
                </h4>
                <span className="text-[11px] font-mono text-amber-300">Section 63 BSA Hash</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-amber-400 break-all">
                {selectedRecord.specialJudgeOrderSha256}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: New FIU Alert */}
      {isNewAlertModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                Create FIU-IND AML Suspicious Transaction Docket
              </h3>
              <button
                onClick={() => setIsNewAlertModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Syndicate / Shell Entity Name</label>
                <input
                  type="text"
                  required
                  value={syndicateName}
                  onChange={(e) => setSyndicateName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Investigating Agency</label>
                <select
                  value={agency}
                  onChange={(e) =>
                    setAgency(
                      e.target.value as 'ENFORCEMENT_DIRECTORATE_ED' | 'FIU_IND_FINNET' | 'INCOME_TAX_INVESTIGATION'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="ENFORCEMENT_DIRECTORATE_ED">Directorate of Enforcement (ED)</option>
                  <option value="FIU_IND_FINNET">Financial Intelligence Unit - India (FIU-IND)</option>
                  <option value="INCOME_TAX_INVESTIGATION">Income Tax Investigation Directorate</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estimated Laundered Volume (INR ₹)</label>
                <input
                  type="number"
                  required
                  value={volumeRupees}
                  onChange={(e) => setVolumeRupees(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Predicate Offense Sections</label>
                <input
                  type="text"
                  required
                  value={predicateSections}
                  onChange={(e) => setPredicateSections(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewAlertModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Dispatch Provisional Attachment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
