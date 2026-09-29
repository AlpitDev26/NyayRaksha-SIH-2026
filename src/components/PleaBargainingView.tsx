import React, { useState, useEffect } from 'react';
import { PleaBargainingDisposition, CaseFile, UserRole, SupportedLanguage } from '../types';
import { phase10Service } from '../services/phase10Service';
import { storageService } from '../services/storageService';
import {
  Handshake,
  Scale,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  FileCheck,
  Sparkles,
  Gavel,
  ShieldCheck,
  DollarSign,
  HeartHandshake,
  Lock,
} from 'lucide-react';

interface PleaBargainingViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const PleaBargainingView: React.FC<PleaBargainingViewProps> = ({
  currentRole: _currentRole,
}) => {
  const [dispositions, setDispositions] = useState<PleaBargainingDisposition[]>([]);
  const [selectedDisp, setSelectedDisp] = useState<PleaBargainingDisposition | null>(null);
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  // Form State
  const [accusedName, setAccusedName] = useState('Sameer Qureshi (Accused #2)');
  const [victimCompensation, setVictimCompensation] = useState<number>(850000);
  const [prosecutionCosts, setProsecutionCosts] = useState<number>(50000);
  const [communityServiceTask, setCommunityServiceTask] = useState(
    '120 Hours Community Service at DLSA Legal Literacy Helpdesk'
  );

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const list = phase10Service.getPleaDispositions();
    setDispositions(list);
    if (list.length > 0) setSelectedDisp(list[0]);
    const stored = storageService.getCases();
    setCases(stored);
    if (stored.length > 0) setSelectedCaseId(stored[0].id);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateDisposition = async () => {
    const targetCase = cases.find((c) => c.id === selectedCaseId);
    if (!targetCase) return;

    try {
      const created = await phase10Service.createPleaBargainingDisposition(
        targetCase,
        accusedName,
        victimCompensation,
        prosecutionCosts,
        communityServiceTask
      );
      setDispositions([...phase10Service.getPleaDispositions()]);
      setSelectedDisp(created);
      showToast('Section 293 MSD Report approved and Section 296 Final Judgment entered!');
    } catch (e: any) {
      showToast('Error: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 border border-emerald-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Chapter XXII BNSS 2023 (Sections 289–300)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <HeartHandshake className="w-3 h-3" /> Restorative Settlement
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <Handshake className="w-6 h-6 text-emerald-400" />
              Plea Bargaining & Mutually Satisfactory Disposition (MSD) Arena
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Statutory restorative justice under Chapter XXII of BNSS 2023. Enables mutually satisfactory dispositions (MSD), victim restitution, 1/4th reduced sentencing under Sec 295, and non-appealable final judgment under Sec 298 BNSS.
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

      {/* Main Grid: Negotiator & Order Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: MSD Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" /> Formulate Section 293 MSD Settlement
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Sec 290 Eligible</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Criminal Case:</label>
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

              <div>
                <label className="block text-slate-400 font-medium mb-1">Applicant Accused Name:</label>
                <input
                  type="text"
                  value={accusedName}
                  onChange={(e) => setAccusedName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Victim Restitution (₹):</label>
                  <input
                    type="number"
                    step={25000}
                    value={victimCompensation}
                    onChange={(e) => setVictimCompensation(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Prosecution Costs (₹):</label>
                  <input
                    type="number"
                    step={5000}
                    value={prosecutionCosts}
                    onChange={(e) => setProsecutionCosts(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Community Service Directive (Sec 4 BNS):</label>
                <input
                  type="text"
                  value={communityServiceTask}
                  onChange={(e) => setCommunityServiceTask(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              {/* Statutory Requisites Check */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1.5 text-[11px] text-slate-300">
                <div className="font-bold text-emerald-300 uppercase tracking-wider text-[10px]">
                  Section 290 BNSS Eligibility Matrix
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Offense penalty ≤ 7 years imprisonment
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Not an offense against women or children below 14 yrs
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Voluntary In-Camera Examination completed (Sec 291)
                </div>
              </div>

              <button
                onClick={handleCreateDisposition}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" /> Finalize MSD & Pronounce Sec 296 Judgment
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: MSD Report & Section 296 Judgment */}
        <div className="lg:col-span-7 space-y-4">
          {selectedDisp ? (
            <div className="space-y-4">
              {/* Disposition Summary Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-300">
                        {selectedDisp.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        MSD Finalized (Sec 293)
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white mt-1">
                      Applicant: {selectedDisp.applicantAccusedName}
                    </h2>
                    <div className="text-xs text-slate-400">
                      Court: {selectedDisp.judicialMagistrateName} | Case: {selectedDisp.caseNumber}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Total Restitution Paid</span>
                    <span className="text-base font-bold font-mono text-emerald-400">
                      ₹{selectedDisp.victimCompensationAgreedRupees.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Mitigated Punishment KPI Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">MITIGATED TERM</span>
                    <span className="text-white font-bold">{selectedDisp.mitigatedSentenceMonths} Months</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">PROSECUTION COSTS</span>
                    <span className="text-amber-400 font-bold">₹{selectedDisp.prosecutionCostsRupees.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">APPEAL STATUS</span>
                    <span className="text-emerald-400 font-bold">Non-Appealable (Sec 298)</span>
                  </div>
                </div>

                {/* Section 296 Judicial Judgment Draft */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                    <Gavel className="w-3.5 h-3.5 text-amber-400" /> Formal Judgment under Section 296 BNSS
                  </h4>
                  <pre className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                    {selectedDisp.finalJudgmentDraftSec296}
                  </pre>
                </div>

                {/* Digital Seal */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">MUTUALLY SATISFACTORY DISPOSITION RECORD HASH</span>
                    <span className="text-emerald-400">{selectedDisp.judicialSealSha256}</span>
                  </div>
                  <Lock className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-end">
                  <button
                    onClick={() => showToast('Section 296 Final Judgment dispatched to e-Courts & ICJS e-Prisons registry!')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <FileCheck className="w-4 h-4" /> Seal & Archive Judgment
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
              <Handshake className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select disposition or formulate a new plea bargain.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
