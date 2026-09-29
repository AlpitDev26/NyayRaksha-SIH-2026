import React, { useState } from 'react';
import {
  Award,
  KeyRound,
  Scale,
  ShieldCheck,
  Building,
  CheckCircle2,
  FileCheck2,
  Sparkles,
  Send,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import { phase13Service } from '../services/phase13Service';
import { ConstitutionalCollegiumRecord } from '../types';

export const ConstitutionalCollegiumView: React.FC = () => {
  const [resolutions, setResolutions] = useState<ConstitutionalCollegiumRecord[]>(phase13Service.getCollegiumRecords());
  const [selectedRes, setSelectedRes] = useState<ConstitutionalCollegiumRecord>(resolutions[0] || null);
  const [isNewResolutionModalOpen, setIsNewResolutionModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [candidateName, setCandidateName] = useState<string>('Hon. Justice Meera R. Deshpande');
  const [currentDesignation, setCurrentDesignation] = useState<string>(
    'Senior Judge, High Court of Karnataka (Seniority Rank #4)'
  );
  const [proposedDesignation, setProposedDesignation] = useState<string>('Chief Justice, High Court of Himachal Pradesh');
  const [recommendationType, setRecommendationType] = useState<
    'ELEVATION_TO_BENCH' | 'CHIEF_JUSTICE_APPOINTMENT' | 'INTER_STATE_TRANSFER' | 'RECUSAL_INTEGRITY_AUDIT'
  >('CHIEF_JUSTICE_APPOINTMENT');
  const [resolutionText, setResolutionText] = useState<string>(
    'The Collegium resolves to recommend the appointment of Smt. Justice Meera R. Deshpande as Chief Justice of the High Court of Himachal Pradesh, having regard to her outstanding judicial acumen, disposal of over 4,200 appeals, and impeccable integrity standards.'
  );

  const handleCreateResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await phase13Service.createCollegiumResolution({
      collegiumType: 'SUPREME_COURT_COLLEGIUM',
      resolutionTitle: `Collegium Resolution on ${recommendationType.replace(/_/g, ' ')} of ${candidateName}`,
      recommendationType,
      judicialCandidateOrJudgeName: candidateName,
      currentDesignationOrBarStatus: currentDesignation,
      proposedDesignation,
      integrityIndexScore: 99.1,
      caseDisposalEfficiencyScore: 97.4,
      conflictOfInterestFlag: 'NONE_CLEARED',
      signatoryJudges: [
        {
          judgeName: 'Hon. Chief Justice of India',
          designation: 'Chief Justice of India & Head of Collegium',
          signedTimestamp: new Date().toISOString(),
        },
        {
          judgeName: 'Hon. Senior Puisne Judge I',
          designation: 'Judge, Supreme Court of India',
          signedTimestamp: new Date().toISOString(),
        },
        {
          judgeName: 'Hon. Senior Puisne Judge II',
          designation: 'Judge, Supreme Court of India',
          signedTimestamp: new Date().toISOString(),
        },
      ],
      shamirQuorumAchieved: true,
      resolutionText,
    });

    const updated = phase13Service.getCollegiumRecords();
    setResolutions(updated);
    setSelectedRes(created);
    setIsNewResolutionModalOpen(false);
    setToastMessage(`Constitutional Collegium Resolution #${created.resolutionId} sealed with 3-of-5 Shamir Quorum`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Award className="w-48 h-48 text-purple-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded uppercase tracking-wider">
                Article 124 / 217 Constitution of India
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded uppercase tracking-wider">
                3-of-5 Shamir Secret Quorum
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-400" />
              Sovereign Constitutional Collegium & Judicial Integrity Vault
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Supreme Court & High Court Collegium resolution management, Shamir multi-judge digital seal quorum,
              judgment disposal performance metrics, and algorithmic conflict-of-interest recusal screening.
            </p>
          </div>

          <button
            onClick={() => setIsNewResolutionModalOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Draft Collegium Recommendation</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-purple-950/90 border border-purple-500/60 text-purple-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-purple-300 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Resolutions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-400" />
              Collegium Resolutions ({resolutions.length})
            </h2>
          </div>

          <div className="space-y-3">
            {resolutions.map((res) => {
              const isSelected = selectedRes?.resolutionId === res.resolutionId;

              return (
                <div
                  key={res.resolutionId}
                  onClick={() => setSelectedRes(res)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-purple-500/60 ring-1 ring-purple-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-purple-400">{res.resolutionId}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-purple-500/15 text-purple-300 border-purple-500/30">
                      {res.collegiumType.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1">{res.judicialCandidateOrJudgeName}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">{res.resolutionTitle}</div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Integrity Score:</span>
                    <span className="font-bold text-emerald-400">{res.integrityIndexScore}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Resolution Details & Multi-Judge Signatures */}
        {selectedRes && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
                    {selectedRes.recommendationType.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{selectedRes.judicialCandidateOrJudgeName}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Current: <span className="text-slate-200">{selectedRes.currentDesignationOrBarStatus}</span>
                  </div>
                  <div className="text-xs text-purple-300 mt-0.5">
                    Proposed: <span className="font-semibold text-white">{selectedRes.proposedDesignation}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">Shamir Threshold Quorum</div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1 mt-1">
                    <KeyRound className="w-3.5 h-3.5" />
                    3-of-5 Signatures Complete
                  </div>
                </div>
              </div>

              {/* Integrity & Disposal Scores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Integrity Index Score</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">{selectedRes.integrityIndexScore}%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">NJDG Historical Evaluation</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Disposal Performance Score</div>
                  <div className="text-lg font-bold text-cyan-400 mt-1">{selectedRes.caseDisposalEfficiencyScore}%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Disposal vs Institution Rate</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Conflict-of-Interest Audit</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1.5 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    {selectedRes.conflictOfInterestFlag.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Resolution Text */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
                <FileCheck2 className="w-4 h-4 text-purple-400" />
                Collegium Resolution Text & Deliberation Minutes
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800">
                {selectedRes.resolutionText}
              </p>
            </div>

            {/* Signatory Judges */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  Signatory Collegium Judges (Cryptographic Signatures)
                </h4>
                <span className="text-xs text-emerald-400 font-semibold">Valid Sovereign Seals</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedRes.signatoryJudges.map((judge, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                    <div className="font-semibold text-white">{judge.judgeName}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{judge.designation}</div>
                    <div className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      PKI Signed: {new Date(judge.signedTimestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Immutable Seal */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Immutable Collegium Resolution Hash Seal (Sec 63 BSA 2023)
                </h4>
                <span className="text-[11px] font-mono text-emerald-400">SHA-256</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-purple-400 break-all">
                {selectedRes.immutableCollegiumSealSha256}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: New Collegium Resolution */}
      {isNewResolutionModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                Draft Constitutional Collegium Resolution
              </h3>
              <button
                onClick={() => setIsNewResolutionModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateResolution} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judicial Candidate / Judge Name</label>
                <input
                  type="text"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Recommendation Type</label>
                <select
                  value={recommendationType}
                  onChange={(e) =>
                    setRecommendationType(
                      e.target.value as
                        | 'ELEVATION_TO_BENCH'
                        | 'CHIEF_JUSTICE_APPOINTMENT'
                        | 'INTER_STATE_TRANSFER'
                        | 'RECUSAL_INTEGRITY_AUDIT'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="CHIEF_JUSTICE_APPOINTMENT">Chief Justice Appointment (High Court)</option>
                  <option value="ELEVATION_TO_BENCH">Elevation to High Court / Supreme Court Bench</option>
                  <option value="INTER_STATE_TRANSFER">Inter-State Judicial Transfer</option>
                  <option value="RECUSAL_INTEGRITY_AUDIT">Bench Recusal & Conflict Scrutiny</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Current Designation / Standing</label>
                <input
                  type="text"
                  required
                  value={currentDesignation}
                  onChange={(e) => setCurrentDesignation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Proposed Designation / Post</label>
                <input
                  type="text"
                  required
                  value={proposedDesignation}
                  onChange={(e) => setProposedDesignation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Resolution Text</label>
                <textarea
                  rows={3}
                  required
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewResolutionModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Sign with Shamir Quorum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
