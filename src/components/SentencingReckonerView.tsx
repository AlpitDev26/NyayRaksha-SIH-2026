import React, { useState, useEffect } from 'react';
import { SentencingVictimAssessment, CaseFile, UserRole, SupportedLanguage } from '../types';
import { phase8Service } from '../services/phase8Service';
import { storageService } from '../services/storageService';
import {
  Scale,
  HeartHandshake,
  Gavel,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Calculator,
  Coins,
  Sparkles,
  Printer,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface SentencingReckonerViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const SentencingReckonerView: React.FC<SentencingReckonerViewProps> = ({
  currentRole: _currentRole,
}) => {
  const [assessments, setAssessments] = useState<SentencingVictimAssessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<SentencingVictimAssessment | null>(null);
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  // Interactive Assessment Form State
  const [primaryOffense, setPrimaryOffense] = useState('BNS Sec 316(2) - Criminal Breach of Trust');
  const [statutoryMin, setStatutoryMin] = useState<number>(3);
  const [statutoryMax, setStatutoryMax] = useState<number>(7);
  const [aggravatingCount, setAggravatingCount] = useState<number>(2);
  const [mitigatingCount, setMitigatingCount] = useState<number>(1);
  const [victimInjury, setVictimInjury] = useState<
    'FATAL_LOSS_OF_LIFE' | 'GRIEVOUS_PERMANENT_DISABILITY' | 'SEVERE_PHYSICAL_INJURY' | 'PSYCHOLOGICAL_TRAUMA' | 'PROPERTY_EXTORTION_LOSS'
  >('PROPERTY_EXTORTION_LOSS');
  const [medicalExpenses, setMedicalExpenses] = useState<number>(150000);
  const [livelihoodLoss, setLivelihoodLoss] = useState<number>(1200000);
  const [notification, setNotification] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const list = phase8Service.getSentencingAssessments();
    setAssessments(list);
    if (list.length > 0) setSelectedAssessment(list[0]);
    const stored = storageService.getCases();
    setCases(stored);
    if (stored.length > 0) setSelectedCaseId(stored[0].id);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleComputeAssessment = async () => {
    const target = cases.find((c) => c.id === selectedCaseId);
    if (!target) return;

    setIsCalculating(true);
    try {
      const computed = await phase8Service.calculateSentencingAndCompensation(
        target,
        primaryOffense,
        statutoryMax,
        statutoryMin,
        aggravatingCount,
        mitigatingCount,
        victimInjury,
        medicalExpenses,
        livelihoodLoss
      );
      setAssessments([...phase8Service.getSentencingAssessments()]);
      setSelectedAssessment(computed);
      showToast('Sentencing & Victim Compensation assessment computed under Sec 395/396 BNSS!');
    } catch (e: any) {
      showToast('Calculation error: ' + e.message);
    } finally {
      setIsCalculating(false);
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
                Sections 395 & 396 BNSS 2023
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <HeartHandshake className="w-3 h-3" /> CVCF / NALSA Restitution Matrix
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <Scale className="w-6 h-6 text-emerald-400" />
              Judicial Sentencing & Victim Restitution Reckoner
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Equitable sentencing matrix balancing aggravating/mitigating factors under BNS with automated mathematical evaluation of victim compensation and direct fine defrayment under Section 395(1)(b) BNSS.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print Judicial Order
            </button>
          </div>
        </div>

        {notification && (
          <div className="mt-3 p-2.5 bg-emerald-950/90 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Interactive Reckoner Configurator & Result Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Assessment Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Calculator className="w-4 h-4 text-emerald-400" /> Case Parameters & Penal Bounds
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Case Docket:</label>
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
                <label className="block text-slate-400 font-medium mb-1">Primary BNS Offense Section:</label>
                <input
                  type="text"
                  value={primaryOffense}
                  onChange={(e) => setPrimaryOffense(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Min Term (Years):</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={statutoryMin}
                    onChange={(e) => setStatutoryMin(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Max Term (Years):</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={statutoryMax}
                    onChange={(e) => setStatutoryMax(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              {/* Factors Weightage */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <div>
                  <label className="block text-rose-400 font-semibold mb-1">Aggravating Factors:</label>
                  <input
                    type="number"
                    min={0}
                    max={6}
                    value={aggravatingCount}
                    onChange={(e) => setAggravatingCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Sophistication, premeditation</span>
                </div>
                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Mitigating Factors:</label>
                  <input
                    type="number"
                    min={0}
                    max={6}
                    value={mitigatingCount}
                    onChange={(e) => setMitigatingCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">First offense, family dependents</span>
                </div>
              </div>

              {/* Victim Restitution Assessment */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4" /> Sec 396 Victim Impact Details
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Victim Harm Category:</label>
                  <select
                    value={victimInjury}
                    onChange={(e: any) => setVictimInjury(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  >
                    <option value="PROPERTY_EXTORTION_LOSS">Property Extortion / Financial Fraud</option>
                    <option value="SEVERE_PHYSICAL_INJURY">Severe Physical Injury</option>
                    <option value="GRIEVOUS_PERMANENT_DISABILITY">Grievous Permanent Disability</option>
                    <option value="FATAL_LOSS_OF_LIFE">Fatal Loss of Life</option>
                    <option value="PSYCHOLOGICAL_TRAUMA">Psychological Trauma / Vulnerable Victim</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Medical Costs (₹):</label>
                    <input
                      type="number"
                      step={10000}
                      value={medicalExpenses}
                      onChange={(e) => setMedicalExpenses(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Livelihood Loss (₹):</label>
                    <input
                      type="number"
                      step={50000}
                      value={livelihoodLoss}
                      onChange={(e) => setLivelihoodLoss(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={isCalculating}
                onClick={handleComputeAssessment}
                className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                {isCalculating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-emerald-200" /> Calculating Equations...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" /> Compute Sentencing & Restitution
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Computed Judicial Matrix & Formatted Ruling */}
        <div className="lg:col-span-7 space-y-4">
          {selectedAssessment ? (
            <div className="space-y-4">
              {/* Computed KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Recommended Prison Term
                  </div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                    {Math.floor(selectedAssessment.recommendedPrisonTermMonths / 12)} Yrs{' '}
                    {selectedAssessment.recommendedPrisonTermMonths % 12 > 0 &&
                      `${selectedAssessment.recommendedPrisonTermMonths % 12} Mos`}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Range: {selectedAssessment.statutoryMinimumYears} to {selectedAssessment.statutoryMaximumYears} Years
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Fine Imposed
                  </div>
                  <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                    ₹{selectedAssessment.recommendedFineAmountRupees.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">
                    ₹{selectedAssessment.victimAssessment.restitutionFromConvictFineRupees.toLocaleString('en-IN')} to Victim (Sec 395)
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total Victim Compensation
                  </div>
                  <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                    ₹{selectedAssessment.victimAssessment.calculatedTotalCompensationRupees.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    DLSA / CVCF Scheme
                  </div>
                </div>
              </div>

              {/* Victim Restitution Breakdown */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-rose-400" />
                    Section 396 BNSS Victim Restitution Breakdown
                  </span>
                  <span className="font-mono text-[11px] text-emerald-400">
                    {selectedAssessment.victimAssessment.dlsOrderRef}
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500">Victim / Beneficiary</span>
                    <div className="font-bold text-slate-200">
                      {selectedAssessment.victimAssessment.victimName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Harm: {selectedAssessment.victimAssessment.injurySeverity.replace(/_/g, ' ')}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500">Compensation Sourcing</span>
                    <div className="text-[11px] text-slate-300 flex justify-between">
                      <span>From Convict Fine:</span>
                      <span className="font-mono text-amber-400">
                        ₹{selectedAssessment.victimAssessment.restitutionFromConvictFineRupees.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 flex justify-between">
                      <span>From State DLSA Fund:</span>
                      <span className="font-mono text-cyan-400">
                        ₹{selectedAssessment.victimAssessment.stateTreasuryContributionRupees.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Judicial Sentencing Draft Order */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                    <Gavel className="w-3.5 h-3.5 text-amber-400" /> Official Judicial Sentencing & Compensation Order
                  </h4>
                  <pre className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                    {selectedAssessment.judicialSentencingDraft}
                  </pre>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => showToast('Order digitally signed by Judicial Magistrate & transmitted to DLSA registry!')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <FileCheck className="w-4 h-4" /> Sign & Dispatch to DLSA
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
              <Scale className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select case to generate sentencing and victim restitution.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
