import React, { useState } from 'react';
import {
  Shield,
  Heart,
  FileText,
  UserCheck,
  Lock,
  Scale,
  Sparkles,
  AlertTriangle,
  Clock,
  EyeOff,
  Building,
  GraduationCap,
  Home,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { phase12Service } from '../services/phase12Service';
import { JuvenileJusticeRecord } from '../types';

export const JuvenileJusticeArenaView: React.FC = () => {
  const [records, setRecords] = useState<JuvenileJusticeRecord[]>(phase12Service.getJuvenileRecords());
  const [selectedRecord, setSelectedRecord] = useState<JuvenileJusticeRecord>(records[0] || null);
  const [anonymizationFilterActive, setAnonymizationFilterActive] = useState<boolean>(true);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState<boolean>(false);
  const [newRecommendation, setNewRecommendation] = useState<'TRIAL_AS_ADULT_CHILDRENS_COURT' | 'REHABILITATION_UNDER_JJB'>(
    'REHABILITATION_UNDER_JJB'
  );
  const [psychologistNotes, setPsychologistNotes] = useState<string>('');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const handleAssessmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    phase12Service.updateJuvenileAssessment(selectedRecord.id, newRecommendation, psychologistNotes);
    const updated = phase12Service.getJuvenileRecords();
    setRecords(updated);
    const curr = updated.find((r) => r.id === selectedRecord.id);
    if (curr) setSelectedRecord(curr);

    setIsAssessmentModalOpen(false);
    setPsychologistNotes('');
    setFeedbackToast(`Section 15 JJB Assessment successfully updated with cryptographic seal for ${selectedRecord.id}`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Heart className="w-48 h-48 text-emerald-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded uppercase tracking-wider">
                Sovereign Child Protection
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded uppercase tracking-wider">
                JJ Act 2015 & POCSO Enclave
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-emerald-400" />
              National Juvenile & Child Protection Justice Arena
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Juvenile Justice Board (JJB) Preliminary Assessments (Sec 15 JJ Act), Social Investigation Reports (Form 6),
              and Mandatory Cryptographic Identity Redaction Shield (Sec 74 JJ Act / Sec 33 POCSO).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAnonymizationFilterActive(!anonymizationFilterActive)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                anonymizationFilterActive
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              <EyeOff className="w-4 h-4" />
              <span>{anonymizationFilterActive ? 'Sec 74 Redaction Active (Protected)' : 'Anonymization Mask Disabled'}</span>
            </button>
          </div>
        </div>
      </div>

      {feedbackToast && (
        <div className="bg-emerald-900/90 border border-emerald-500/60 text-emerald-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedbackToast}</span>
          </div>
          <button onClick={() => setFeedbackToast(null)} className="text-emerald-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Juvenile Inquiries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              Active JJB Inquiry Dockets ({records.length})
            </h2>
          </div>

          <div className="space-y-3">
            {records.map((record) => {
              const isSelected = selectedRecord?.id === record.id;
              return (
                <div
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/50 ring-1 ring-emerald-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-emerald-400">{record.caseNumber}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        record.isHeinousOffense
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {record.isHeinousOffense ? 'Heinous Offense (>= 7 Yrs)' : 'Petty / Serious Offense'}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1">
                    {anonymizationFilterActive ? record.anonymizedPseudonym : `Juvenile Dossier #${record.id}`}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/60">
                    <div>
                      <span className="text-slate-500">Age at Offense:</span>{' '}
                      <span className="text-slate-200 font-semibold">{record.ageAtOffense} Years</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Age Verified by:</span>{' '}
                      <span className="text-slate-200 font-mono text-[11px]">{record.ageDeterminationBasis.replace(/_/g, ' ')}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Next Hearing: {new Date(record.nextJJBHearingDate).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                        record.preliminaryAssessmentSec15JJB.recommendation === 'REHABILITATION_UNDER_JJB'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {record.preliminaryAssessmentSec15JJB.recommendation === 'REHABILITATION_UNDER_JJB'
                        ? 'JJB Rehab Track'
                        : "Children's Court Trial"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed JJB Record & Assessment Matrix */}
        {selectedRecord && (
          <div className="lg:col-span-2 space-y-6">
            {/* Action Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400">Presiding Juvenile Justice Board</div>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-400" />
                  {selectedRecord.jjbMagistratePresiding}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAssessmentModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Update Sec 15 Preliminary Assessment</span>
                </button>
              </div>
            </div>

            {/* Statutory Privacy & Anonymization Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Section 74 JJ Act 2015 & Sec 33 POCSO Anonymization Protocol
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded">
                  FIPS Cryptographic Shield Active
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Statutory Redacted Identifier</div>
                  <div className="text-sm font-semibold text-white mt-1">{selectedRecord.anonymizedPseudonym}</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Identity, school, address, and parental details cryptographically masked to avoid social stigma.
                  </p>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Identity Redaction Shield SHA-256</div>
                  <div className="font-mono text-xs text-emerald-400 break-all mt-1">
                    {selectedRecord.identityRedactionShieldSha256}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Anchored to Sovereign National Judicial Ledger (Sec 63 BSA compliant)
                  </div>
                </div>
              </div>
            </div>

            {/* Section 15 JJ Act Preliminary Assessment Matrix */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  Section 15 JJ Act Preliminary Assessment (Age 16-18 Heinous Offense)
                </h3>
                <span className="text-xs text-slate-400">
                  Assessment Date: {new Date(selectedRecord.preliminaryAssessmentSec15JJB.assessmentDate).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1">Clinical Psychologist</div>
                  <div className="text-sm font-semibold text-slate-200">
                    {selectedRecord.preliminaryAssessmentSec15JJB.psychologistName}
                  </div>
                  <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    Psychological Evaluation Completed
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1">Mental & Physical Capacity</div>
                  <div className="text-sm font-semibold text-slate-200">
                    {selectedRecord.preliminaryAssessmentSec15JJB.mentalPhysicalCapacityEvaluated
                      ? 'Adequate Cognitive Capacity'
                      : 'Cognitive Deficiency Noted'}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400">
                    Consequence Comprehension:{' '}
                    <span className="text-white font-semibold">
                      {selectedRecord.preliminaryAssessmentSec15JJB.abilityToUnderstandConsequences ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1">JJB Statutory Recommendation</div>
                  <div
                    className={`text-sm font-bold ${
                      selectedRecord.preliminaryAssessmentSec15JJB.recommendation === 'REHABILITATION_UNDER_JJB'
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {selectedRecord.preliminaryAssessmentSec15JJB.recommendation === 'REHABILITATION_UNDER_JJB'
                      ? 'Rehabilitation under JJB Framework'
                      : "Transfer to Children's Court (Sec 18(3))"}
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-slate-500 break-all">
                    Report SHA: {selectedRecord.preliminaryAssessmentSec15JJB.assessmentReportSha256.slice(0, 20)}...
                  </div>
                </div>
              </div>
            </div>

            {/* Social Investigation Report (Form 6) & Care Plan (Form 7) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form 6 SIR */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    Social Investigation Report (Form 6)
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Probation Officer: {selectedRecord.socialInvestigationReportForm6.probationOfficerName}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400">Family Background:</span>
                    <p className="text-slate-200 mt-0.5 bg-slate-950 p-2 rounded border border-slate-800">
                      {selectedRecord.socialInvestigationReportForm6.familySocioEconomicBackground}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">School Attendance:</span>
                    <p className="text-slate-200 mt-0.5 bg-slate-950 p-2 rounded border border-slate-800">
                      {selectedRecord.socialInvestigationReportForm6.schoolAttendanceRecord}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400">Peer Group Influence:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        selectedRecord.socialInvestigationReportForm6.peerGroupInfluenceScore === 'HIGH'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {selectedRecord.socialInvestigationReportForm6.peerGroupInfluenceScore} Risk
                    </span>
                  </div>
                </div>
              </div>

              {/* Form 7 Individual Care Plan */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-teal-400" />
                    Individual Care Plan (Form 7)
                  </h4>
                  <span className="text-[11px] text-teal-300">Rehabilitation Track</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400">Counseling & De-radicalization Plan:</span>
                    <p className="text-slate-200 mt-0.5 bg-slate-950 p-2 rounded border border-slate-800">
                      {selectedRecord.individualCarePlanForm7.counselingPlan}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Vocational Skill Development:</span>
                    <p className="text-slate-200 mt-0.5 bg-slate-950 p-2 rounded border border-slate-800">
                      {selectedRecord.individualCarePlanForm7.vocationalTrainingStream}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400">Assigned Fit Facility:</span>
                    <span className="text-slate-200 font-semibold flex items-center gap-1">
                      <Home className="w-3.5 h-3.5 text-teal-400" />
                      {selectedRecord.individualCarePlanForm7.fitFacilityAssigned.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Update Section 15 Preliminary Assessment */}
      {isAssessmentModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-400" />
                JJB Section 15 Assessment Recording
              </h3>
              <button
                onClick={() => setIsAssessmentModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleAssessmentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Statutory Track Recommendation (Sec 15 & 18(3) JJ Act 2015)
                </label>
                <select
                  value={newRecommendation}
                  onChange={(e) =>
                    setNewRecommendation(e.target.value as 'TRIAL_AS_ADULT_CHILDRENS_COURT' | 'REHABILITATION_UNDER_JJB')
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="REHABILITATION_UNDER_JJB">
                    Rehabilitation & Reformatory Care under JJB (Stay in Observation Home)
                  </option>
                  <option value="TRIAL_AS_ADULT_CHILDRENS_COURT">
                    Transfer to Children's Court for Trial as an Adult (Heinous Crime)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Psychologist & Board Evaluation Endorsement Notes
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record cognitive examination findings, moral reasoning maturity, and impulse control scores..."
                  value={psychologistNotes}
                  onChange={(e) => setPsychologistNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-600"
                />
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-300 text-[11px] flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>This assessment will be signed with JJB Principal Magistrate cryptographic PKI credentials.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAssessmentModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Sign & Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
