import React, { useState } from 'react';
import { CaseFile, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { X, Gavel, Lock, CheckCircle2, AlertCircle, Loader2, Stamp } from 'lucide-react';

interface JudicialOrderModalProps {
  caseFile: CaseFile;
  currentRole: UserRole;
  onClose: () => void;
  onSuccess: () => void;
}

export const JudicialOrderModal: React.FC<JudicialOrderModalProps> = ({
  caseFile,
  currentRole,
  onClose,
  onSuccess,
}) => {
  const [orderType, setOrderType] = useState<'BAIL_ORDER' | 'JUDICIAL_WARRANT' | 'COURT_ORDER_SHEET' | 'FINAL_JUDGMENT'>('BAIL_ORDER');
  const [orderTitle, setOrderTitle] = useState(`Judicial Order on Bail Application · ${caseFile.caseNumber}`);
  const [judgeName, setJudgeName] = useState('Hon\'ble Justice Rajesh Khurana');
  const [judgeDesignation, setJudgeDesignation] = useState('Special Judge, Sessions Court');
  const [orderText, setOrderText] = useState(
    `IN THE COURT OF SPECIAL JUDGE, PATIALA HOUSE COURTS, NEW DELHI
ORDER ON BAIL APPLICATION UNDER SECTION 480 BNSS / 439 CRPC:
Heard learned Special Public Prosecutor for the State and learned defence counsel for the accused.
Considering the gravity of electronic evidence, unassailable CFSL memory dumps, and recovery of encrypted hardware, no ground is made out for grant of regular bail at this stage.
Bail application stands dismissed. Accused remanded to judicial custody.`
  );
  const [nextHearingDate, setNextHearingDate] = useState('2026-10-15');
  const [nextHearingPurpose, setNextHearingPurpose] = useState('Prosecution Evidence & Cross Examination of IO');
  const [verdict, setVerdict] = useState<'CONVICTED' | 'ACQUITTED' | 'PARTIALLY_CONVICTED' | 'DISMISSED'>('CONVICTED');
  const [sentenceSummary, setSentenceSummary] = useState(
    'Accused sentenced to 5 years Rigorous Imprisonment and a fine of ₹10,00,000 under BNS Sec 318(4).'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderTitle || !orderText) {
      setErrorMsg('Please complete order title and ruling text.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await storageService.issueJudicialOrder(caseFile.id, {
        orderTitle,
        orderType,
        judgeName,
        judgeDesignation,
        orderText,
        nextHearingDate: orderType !== 'FINAL_JUDGMENT' ? nextHearingDate : undefined,
        nextHearingPurpose: orderType !== 'FINAL_JUDGMENT' ? nextHearingPurpose : undefined,
        verdict: orderType === 'FINAL_JUDGMENT' ? verdict : undefined,
        sentenceSummary: orderType === 'FINAL_JUDGMENT' ? sentenceSummary : undefined,
      });

      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to issue judicial order');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-white font-serif">
            <Gavel className="w-5 h-5 text-amber-400" />
            <span>Issue Judicial Order / Certified Ruling · Case {caseFile.caseNumber}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-500 rounded text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Judicial Order Type *</label>
              <select
                value={orderType}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setOrderType(val);
                  if (val === 'FINAL_JUDGMENT') {
                    setOrderTitle(`Certified Final Judgment & Order · ${caseFile.caseNumber}`);
                  } else if (val === 'JUDICIAL_WARRANT') {
                    setOrderTitle(`Non-Bailable Arrest Warrant (NBW) · ${caseFile.caseNumber}`);
                  } else if (val === 'BAIL_ORDER') {
                    setOrderTitle(`Judicial Order on Bail Application · ${caseFile.caseNumber}`);
                  } else {
                    setOrderTitle(`Court Daily Order Sheet · ${caseFile.caseNumber}`);
                  }
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="BAIL_ORDER">Bail Order (Sec 480 BNSS / 439 CrPC)</option>
                <option value="JUDICIAL_WARRANT">Non-Bailable Warrant (NBW)</option>
                <option value="COURT_ORDER_SHEET">Daily Judicial Order Sheet</option>
                <option value="FINAL_JUDGMENT">Final Conviction / Acquittal Judgment</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Order Title *</label>
              <input
                type="text"
                value={orderTitle}
                onChange={(e) => setOrderTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Presiding Judge / Magistrate Name</label>
              <input
                type="text"
                value={judgeName}
                onChange={(e) => setJudgeName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Bench / Court Name</label>
              <input
                type="text"
                value={judgeDesignation}
                onChange={(e) => setJudgeDesignation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {orderType === 'FINAL_JUDGMENT' && (
            <div className="p-3.5 bg-amber-950/20 border border-amber-500/40 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-300 font-semibold mb-1">Final Verdict</label>
                  <select
                    value={verdict}
                    onChange={(e) => setVerdict(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="CONVICTED">CONVICTED</option>
                    <option value="ACQUITTED">ACQUITTED</option>
                    <option value="PARTIALLY_CONVICTED">PARTIALLY CONVICTED</option>
                    <option value="DISMISSED">DISMISSED / STRUCK OFF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-amber-300 font-semibold mb-1">Sentence Decree Summary</label>
                  <input
                    type="text"
                    value={sentenceSummary}
                    onChange={(e) => setSentenceSummary(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-400 mb-1">Judicial Ruling Text / Operative Order *</label>
            <textarea
              rows={5}
              value={orderText}
              onChange={(e) => setOrderText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-slate-100 font-serif text-xs leading-relaxed focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {orderType !== 'FINAL_JUDGMENT' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Next Listed Hearing Date</label>
                <input
                  type="date"
                  value={nextHearingDate}
                  onChange={(e) => setNextHearingDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Next Hearing Purpose</label>
                <input
                  type="text"
                  value={nextHearingPurpose}
                  onChange={(e) => setNextHearingPurpose(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded border border-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Issuing...</span>
                </>
              ) : (
                <>
                  <Stamp className="w-3.5 h-3.5" />
                  <span>Affix Sovereign Seal & Issue Order</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
