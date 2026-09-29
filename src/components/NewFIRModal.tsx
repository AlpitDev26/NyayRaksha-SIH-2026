import React, { useState } from 'react';
import { SupportedLanguage, UserRole } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { storageService } from '../services/storageService';
import { aiLegalService, SectionRecommendation } from '../services/aiLegalService';
import {
  X,
  FileSignature,
  Sparkles,
  Plus,
  Trash2,
  Lock,
  CheckCircle2,
  AlertCircle,
  Shield,
  Loader2,
} from 'lucide-react';

interface NewFIRModalProps {
  onClose: () => void;
  onSuccess: () => void;
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const NewFIRModal: React.FC<NewFIRModalProps> = ({
  onClose,
  onSuccess,
  language,
  currentRole,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [caseNumber, setCaseNumber] = useState(
    `FIR-2026-CR-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [policeStation, setPoliceStation] = useState('Special Cyber Cell Police Station, Mandir Marg');
  const [jurisdictionState, setJurisdictionState] = useState('NCT of Delhi');
  const [courtName, setCourtName] = useState('Special Court of Judicial Magistrate, Patiala House Courts, New Delhi');
  const [priority, setPriority] = useState<'ROUTINE' | 'URGENT' | 'HIGH_SENSITIVITY' | 'NATIONAL_SECURITY'>('HIGH_SENSITIVITY');

  const [complainantName, setComplainantName] = useState('Dr. Sudarshan Roy');
  const [complainantContact, setComplainantContact] = useState('+91 98110 55443 · roy.s@nic.in');
  const [complainantAddress, setComplainantAddress] = useState('Block C, Institutional Area, New Delhi - 110003');

  const [accusedList, setAccusedList] = useState<Array<{ name: string; alias: string; status: 'UNKNOWN' | 'DETAINED' | 'ABSCONDING' | 'IN_JUDICIAL_CUSTODY' | 'ON_BAIL' }>>([
    { name: 'Unknown Perpetrator (Handle: DarkSpectre)', alias: 'DarkSpectre', status: 'UNKNOWN' },
  ]);

  const [firNarrative, setFirNarrative] = useState(
    'On 26-09-2026 at approximately 14:30 IST, unauthorized brute force credential stuffing was detected against internal government financial API endpoints. Server logs indicate exfiltration of 12.4 GB encrypted database dumps and attempted diversion of ₹8.5 Crore into unverified offshore cryptocurrency addresses.'
  );

  const [sections, setSections] = useState<string[]>([
    'BNS Sec 318(4) (Cheating and Dishonestly Inducing Delivery of Property)',
    'IT Act 2000 Sec 43/66 (Computer System Hacking & Data Theft)',
    'BNS Sec 336(3) (Forgery of Electronic Record)',
  ]);

  const [newSectionInput, setNewSectionInput] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<SectionRecommendation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Officer Info
  const [officerName, setOfficerName] = useState('Insp. Alok Vardhan');
  const [officerRank, setOfficerRank] = useState('Inspector of Police');
  const [officerBadge, setOfficerBadge] = useState('DP-CYB-9102');
  const [officerDept, setOfficerDept] = useState('Delhi Police Cyber Crime Unit');

  const handleAddAccused = () => {
    setAccusedList([...accusedList, { name: '', alias: '', status: 'UNKNOWN' }]);
  };

  const handleRemoveAccused = (idx: number) => {
    setAccusedList(accusedList.filter((_, i) => i !== idx));
  };

  const handleUpdateAccused = (idx: number, field: string, value: any) => {
    const updated = [...accusedList];
    updated[idx] = { ...updated[idx], [field]: value };
    setAccusedList(updated);
  };

  const handleAddManualSection = () => {
    if (newSectionInput.trim() && !sections.includes(newSectionInput.trim())) {
      setSections([...sections, newSectionInput.trim()]);
      setNewSectionInput('');
    }
  };

  const handleRemoveSection = (sec: string) => {
    setSections(sections.filter((s) => s !== sec));
  };

  const handleRunAISectionAnalysis = async () => {
    if (!firNarrative.trim()) return;
    setIsClassifying(true);
    try {
      const recs = await aiLegalService.classifyAndRecommendSections(firNarrative);
      setAiSuggestions(recs);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze sections');
    } finally {
      setIsClassifying(false);
    }
  };

  const handleApplySuggestion = (sug: SectionRecommendation) => {
    const formatted = `${sug.section} (${sug.title})`;
    if (!sections.includes(formatted)) {
      setSections([...sections, formatted]);
    }
  };

  const handleSubmitFIR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseNumber || !firNarrative || sections.length === 0) {
      setErrorMsg('Please fill all mandatory fields and specify at least one penal section.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const title = `State vs. ${accusedList[0]?.name || 'Unknown'} (${sections[0]?.slice(0, 20) || 'Cognizable Offence'})`;
      await storageService.registerNewCase({
        caseNumber,
        courtName,
        policeStation,
        jurisdictionState,
        title,
        legalActsAndSections: sections,
        firDate: new Date().toISOString(),
        priority,
        leadInvestigator: {
          name: officerName,
          rank: officerRank,
          badgeId: officerBadge,
          phone: '+91 98100 12345',
        },
        complainant: {
          name: complainantName,
          contact: complainantContact,
          address: complainantAddress,
        },
        accused: accusedList.map((a) => ({
          name: a.name || 'Unknown',
          alias: a.alias || undefined,
          status: a.status,
        })),
        witnessCount: 2,
        firNarrative,
        filingOfficerName: officerName,
        filingOfficerBadge: officerBadge,
        filingOfficerDept: officerDept,
      });

      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to file E-FIR on blockchain');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <FileSignature className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-serif">
                Register E-FIR (First Information Report)
              </h2>
              <p className="text-xs text-slate-400">
                Statutory First Report under Sec 173 BNSS with instant SHA-256 blockchain commit.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmitFIR} className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-500 rounded text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Police Station & Case Reference */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
            <div className="font-semibold text-slate-200 text-xs flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Jurisdiction & FIR Reference</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">FIR Number *</label>
                <input
                  type="text"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">State / UT Jurisdiction</label>
                <input
                  type="text"
                  value={jurisdictionState}
                  onChange={(e) => setJurisdictionState(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Priority Classification</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="NATIONAL_SECURITY">National Security</option>
                  <option value="HIGH_SENSITIVITY">High Sensitivity</option>
                  <option value="URGENT">Urgent</option>
                  <option value="ROUTINE">Routine</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Police Station *</label>
                <input
                  type="text"
                  value={policeStation}
                  onChange={(e) => setPoliceStation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Designated Competent Court</label>
                <input
                  type="text"
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Incident Narrative & AI Section Assistant */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 text-xs">
                Incident & Occurrence Narrative (Facts of the Case) *
              </span>
              <button
                type="button"
                onClick={handleRunAISectionAnalysis}
                disabled={isClassifying || !firNarrative.trim()}
                className="px-3 py-1 text-xs font-semibold text-indigo-300 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/60 rounded transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isClassifying ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                )}
                <span>AI Recommend Legal Sections</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={firNarrative}
              onChange={(e) => setFirNarrative(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-100 focus:outline-none focus:border-amber-500 font-sans"
              placeholder="State the date, time, location, methodology, and sequence of events..."
              required
            />

            {/* AI Suggestions Dropdown Cards */}
            {aiSuggestions.length > 0 && (
              <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-lg space-y-2">
                <div className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Recommended Statutory Sections:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {aiSuggestions.map((sug, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-slate-900 border border-slate-800 rounded flex flex-col justify-between gap-1.5"
                    >
                      <div>
                        <div className="font-mono font-bold text-amber-300">{sug.section}</div>
                        <div className="text-slate-200 font-medium">{sug.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{sug.rationale}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplySuggestion(sug)}
                        className="self-end px-2 py-0.5 text-[10px] font-semibold text-indigo-200 bg-indigo-900/80 hover:bg-indigo-800 rounded transition-colors cursor-pointer"
                      >
                        + Add Section
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Selected Sections */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <label className="block text-slate-400">Applicable Acts & Sections Charged *</label>
              <div className="flex flex-wrap gap-2">
                {sections.map((sec) => (
                  <span
                    key={sec}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-amber-500/40 rounded text-amber-300 font-mono text-xs"
                  >
                    <span>{sec}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(sec)}
                      className="text-slate-500 hover:text-red-400 ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1.5">
                <input
                  type="text"
                  value={newSectionInput}
                  onChange={(e) => setNewSectionInput(e.target.value)}
                  placeholder="e.g. BNS Sec 61(2) (Criminal Conspiracy)"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddManualSection}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Complainant & Accused Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Complainant */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <span className="font-semibold text-slate-200 text-xs">Complainant / Informant</span>
              <div>
                <label className="block text-slate-400 mb-0.5">Name / Designation *</label>
                <input
                  type="text"
                  value={complainantName}
                  onChange={(e) => setComplainantName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-0.5">Contact (Phone / Email)</label>
                <input
                  type="text"
                  value={complainantContact}
                  onChange={(e) => setComplainantContact(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-0.5">Address</label>
                <input
                  type="text"
                  value={complainantAddress}
                  onChange={(e) => setComplainantAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Accused List */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 text-xs">Accused Person(s)</span>
                <button
                  type="button"
                  onClick={handleAddAccused}
                  className="text-amber-400 hover:text-amber-300 text-xs font-semibold cursor-pointer"
                >
                  + Add Accused
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {accusedList.map((acc, i) => (
                  <div key={i} className="p-2.5 bg-slate-900 border border-slate-800 rounded space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder="Accused Full Name"
                        value={acc.name}
                        onChange={(e) => handleUpdateAccused(i, 'name', e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                        required
                      />
                      {accusedList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAccused(i)}
                          className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Alias / Handle"
                        value={acc.alias}
                        onChange={(e) => handleUpdateAccused(i, 'alias', e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                      />
                      <select
                        value={acc.status}
                        onChange={(e) => handleUpdateAccused(i, 'status', e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="UNKNOWN">Status: Unknown</option>
                        <option value="DETAINED">Detained / Interrogated</option>
                        <option value="IN_JUDICIAL_CUSTODY">In Judicial Custody</option>
                        <option value="ABSCONDING">Absconding</option>
                        <option value="ON_BAIL">On Bail</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Investigating Officer Digital Signature */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Investigating Officer PKI Digital Signature</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                Sec 63 Bharatiya Sakshya Adhiniyam Admissible
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500 block">Officer Name:</span>
                <span className="text-slate-200">{officerName}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500 block">Designation:</span>
                <span className="text-slate-200">{officerRank}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500 block">Badge / Officer ID:</span>
                <span className="text-amber-400">{officerBadge}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500 block">Organization:</span>
                <span className="text-slate-200 truncate">{officerDept}</span>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              Anchors SHA-256 hash & PKI digital signature directly to National Justice Blockchain.
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded border border-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow-md transition-colors cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Anchoring on Ledger...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Digitally Sign & Register E-FIR</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
