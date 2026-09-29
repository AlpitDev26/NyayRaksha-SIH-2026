import React, { useState } from 'react';
import {
  Gavel,
  Scale,
  Award,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Plus,
  Send,
  Lock,
  Sparkles,
} from 'lucide-react';
import { phase15Service } from '../services/phase15Service';
import { SupremeCourtFullCourtBenchRecord } from '../types';

export const SupremeCourtFullCourtBenchView: React.FC = () => {
  const [records, setRecords] = useState<SupremeCourtFullCourtBenchRecord[]>(phase15Service.getSCBenchRecords());
  const [selectedRecord, setSelectedRecord] = useState<SupremeCourtFullCourtBenchRecord>(records[0] || null);
  const [isNewBenchModalOpen, setIsNewBenchModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [caseTitle, setCaseTitle] = useState<string>(
    'In Re: Quantum-Resistant Digital Evidence Presumption & Mandatory Post-Quantum PKI in Criminal Trials'
  );
  const [benchStrength, setBenchStrength] = useState<
    '5_JUDGE_CONSTITUTION_BENCH' | '7_JUDGE_LARGER_BENCH' | '9_JUDGE_FULL_COURT_CONSTITUTIONAL'
  >('9_JUDGE_FULL_COURT_CONSTITUTIONAL');
  const [articles, setArticles] = useState<string>('Article 14, Article 21, Article 141, Article 142');
  const [ratioSummary, setRatioSummary] = useState<string>(
    'The 9-Judge Full Court Bench ruled that all electronic chargesheets, forensic DNA spectra, and digital orders sealed under FIPS 203/204 Post-Quantum Cryptography satisfy Section 63 BSA 2023 with irrebuttable authenticity.'
  );
  const [art142Directive, setArt142Directive] = useState<string>(
    'The Supreme Court invokes Article 142 to direct the Union of India and all High Courts to deploy quantum-safe disaster recovery nodes across all 28 State Judicial Data Centres within 90 days.'
  );

  const handleCreateSCBench = async (e: React.FormEvent) => {
    e.preventDefault();
    const articlesArray = articles.split(',').map((s) => s.trim());

    const created = await phase15Service.createSCBenchRecord({
      benchStrength,
      caseTitle,
      constitutionalArticlesInvolved: articlesArray,
      presidingChiefJustice: 'Hon. Chief Justice of India',
      coramJudges: [
        'Hon. Chief Justice of India',
        'Hon. Justice Senior Puisne Judge I',
        'Hon. Justice Senior Puisne Judge II',
        'Hon. Justice Senior Puisne Judge III',
        'Hon. Justice Senior Puisne Judge IV',
        'Hon. Justice Senior Puisne Judge V',
        'Hon. Justice Senior Puisne Judge VI',
        'Hon. Justice Senior Puisne Judge VII',
        'Hon. Justice Senior Puisne Judge VIII',
      ],
      ratioDecidendiLawSummary: ratioSummary,
      article142CompleteJusticeDirective: art142Directive,
      unanimousOrMajorityDecision: 'UNANIMOUS_CONCURRENCE',
      bindingPrecedentStatus: 'LAW_OF_THE_LAND_ART_141',
    });

    const updated = phase15Service.getSCBenchRecords();
    setRecords(updated);
    setSelectedRecord(created);
    setIsNewBenchModalOpen(false);
    setToastMessage(`Supreme Court Full Court Decree #${created.benchReferenceId} promulgated under Article 141/142`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-purple-950/80 border border-amber-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Scale className="w-48 h-48 text-amber-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded uppercase tracking-wider">
                Article 141 & 142 Constitution of India
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded uppercase tracking-wider">
                9-Judge Full Court Bench
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Scale className="w-6 h-6 text-amber-400" />
              Sovereign Supreme Court Full Court & Constitutional Bench Registry
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Authoritative constitutional bench references (5, 7, and 9-Judge benches), Article 141 binding ratio
              decidendi law declarations, and Article 142 "Complete Justice" sovereign decree enforcement.
            </p>
          </div>

          <button
            onClick={() => setIsNewBenchModalOpen(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Promulgate Constitutional Bench Decree</span>
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
        {/* Left Column: Constitutional Benches */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Gavel className="w-4 h-4 text-amber-400" />
              Constitutional Bench Decrees ({records.length})
            </h2>
          </div>

          <div className="space-y-3">
            {records.map((item) => {
              const isSelected = selectedRecord?.benchReferenceId === item.benchReferenceId;

              return (
                <div
                  key={item.benchReferenceId}
                  onClick={() => setSelectedRecord(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/60 ring-1 ring-amber-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-amber-400">{item.benchReferenceId}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-amber-500/15 text-amber-300 border-amber-500/30">
                      {item.benchStrength.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1 line-clamp-2">{item.caseTitle}</div>
                  <div className="text-xs text-slate-400 mb-2">Presiding: {item.presidingChiefJustice}</div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-semibold text-emerald-400">Law of the Land (Art 141)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Court Decree & Article 142 Directives */}
        {selectedRecord && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                    {selectedRecord.benchStrength.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{selectedRecord.caseTitle}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Articles Interpreted:{' '}
                    <span className="text-slate-200">{selectedRecord.constitutionalArticlesInvolved.join(' | ')}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-right">
                  <div className="text-[11px] text-slate-400">Decision Mandate</div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1 mt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {selectedRecord.unanimousOrMajorityDecision.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>

              {/* Bench Coram List */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400">Coram of Justices:</span>
                <div className="text-xs text-slate-200">{selectedRecord.coramJudges.join('; ')}</div>
              </div>
            </div>

            {/* Ratio Decidendi */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Ratio Decidendi (Binding Pan-India Precedent under Article 141)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                {selectedRecord.ratioDecidendiLawSummary}
              </p>
            </div>

            {/* Article 142 Inherent Decree */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
                <Gavel className="w-4 h-4 text-purple-400" />
                Article 142 "Complete Justice" Sovereign Directives
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                {selectedRecord.article142CompleteJusticeDirective}
              </p>
            </div>

            {/* Post-Quantum Root Seal */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Full Court Post-Quantum Cryptographic Root Seal (NIST FIPS 204 ML-DSA)
                </h4>
                <span className="text-[11px] font-mono text-emerald-400">PQC Lattice Root</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-amber-400 break-all">
                {selectedRecord.pqcPostQuantumRootSealSha256}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Promulgate SC Bench */}
      {isNewBenchModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                Promulgate Supreme Court Constitutional Bench Decree
              </h3>
              <button
                onClick={() => setIsNewBenchModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateSCBench} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Case Title</label>
                <input
                  type="text"
                  required
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bench Strength</label>
                <select
                  value={benchStrength}
                  onChange={(e) =>
                    setBenchStrength(
                      e.target.value as
                        | '5_JUDGE_CONSTITUTION_BENCH'
                        | '7_JUDGE_LARGER_BENCH'
                        | '9_JUDGE_FULL_COURT_CONSTITUTIONAL'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="9_JUDGE_FULL_COURT_CONSTITUTIONAL">9-Judge Full Court Constitutional Bench</option>
                  <option value="7_JUDGE_LARGER_BENCH">7-Judge Larger Constitution Bench</option>
                  <option value="5_JUDGE_CONSTITUTION_BENCH">5-Judge Constitution Bench</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Constitutional Articles</label>
                <input
                  type="text"
                  required
                  value={articles}
                  onChange={(e) => setArticles(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Ratio Decidendi Summary (Art 141)</label>
                <textarea
                  rows={2}
                  required
                  value={ratioSummary}
                  onChange={(e) => setRatioSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Article 142 Complete Justice Directive</label>
                <textarea
                  rows={2}
                  required
                  value={art142Directive}
                  onChange={(e) => setArt142Directive(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewBenchModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Seal & Promulgate Gazette Decree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
