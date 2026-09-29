import React, { useState } from 'react';
import { SupportedFIRLanguage, MultilingualFIRPayload } from '../types/firCase';
import { FIR_LANGUAGES, firCaseService } from '../services/firCaseService';
import { aiLegalService, SectionRecommendation } from '../services/aiLegalService';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import {
  FileSignature,
  Globe,
  Mic,
  MicOff,
  Sparkles,
  Plus,
  Trash2,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Languages,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface MultilingualFIRViewProps {
  language: SupportedLanguage;
  onFIRSubmitted: () => void;
}

export const MultilingualFIRView: React.FC<MultilingualFIRViewProps> = ({
  language,
  onFIRSubmitted,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [selectedLanguage, setSelectedLanguage] = useState<SupportedFIRLanguage>('hi');
  const [caseNumber, setCaseNumber] = useState(
    `FIR-2026-CR-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [policeStation, setPoliceStation] = useState('Special Cyber Cell Police Station, Mandir Marg');
  const [district, setDistrict] = useState('New Delhi District');
  const [state, setState] = useState('NCT of Delhi');
  const [courtName, setCourtName] = useState('Special Court of Judicial Magistrate, Patiala House Courts, New Delhi');

  const [complainantName, setComplainantName] = useState('प्रमोद कुमार वर्मा (Pramod Kumar Verma)');
  const [complainantPhone, setComplainantPhone] = useState('+91 98110 55443');
  const [complainantAddress, setComplainantAddress] = useState('मकान सं. 42, बाराखंभा रोड, नई दिल्ली - 110001');

  const [incidentDateTime, setIncidentDateTime] = useState('2026-09-26T18:30');
  const [incidentPlace] = useState('बाराखंभा मेट्रो स्टेशन गेट नं. 2, नई दिल्ली');

  const [verbatimOriginal, setVerbatimOriginal] = useState(
    FIR_LANGUAGES['hi'].sampleComplainantStatement
  );
  const [translatedEnglish, setTranslatedEnglish] = useState(
    FIR_LANGUAGES['en'].sampleComplainantStatement
  );
  const [enableTranslation, setEnableTranslation] = useState(true);

  const [accusedList, setAccusedList] = useState<Array<{ name: string; alias: string; status: any }>>([
    { name: 'दो अज्ञात व्यक्ति (Two unidentified persons)', alias: 'काली बाइक सवार', status: 'UNKNOWN' },
  ]);

  const [actsAndSections, setActsAndSections] = useState<string[]>([
    'BNS Sec 309(4) (Robbery with deadly weapon)',
    'Arms Act 1959 Sec 25/27 (Unlawful possession of firearm)',
  ]);
  const [newSectionInput, setNewSectionInput] = useState('');

  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<SectionRecommendation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [officerName] = useState('Insp. Alok Vardhan');
  const [officerBadge] = useState('DP-CYB-9102');
  const [officerDept] = useState('Delhi Police Investigation Wing');

  const handleLanguageChange = (newLang: SupportedFIRLanguage) => {
    setSelectedLanguage(newLang);
    setVerbatimOriginal(FIR_LANGUAGES[newLang].sampleComplainantStatement);
  };

  const handleSimulateVoiceDictation = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
    } else {
      setIsRecordingVoice(true);
      setTimeout(() => {
        setIsRecordingVoice(false);
        setVerbatimOriginal(
          FIR_LANGUAGES[selectedLanguage].sampleComplainantStatement +
            ' (रिकॉर्डेड ऑडियो से डिजिटल रूप से स्थानांतरित)'
        );
      }, 2000);
    }
  };

  const handleRunAISectionAdvisor = async () => {
    if (!verbatimOriginal.trim()) return;
    setIsClassifying(true);
    try {
      const recs = await aiLegalService.classifyAndRecommendSections(
        verbatimOriginal + ' ' + (translatedEnglish || '')
      );
      setAiSuggestions(recs);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleApplySection = (sec: SectionRecommendation) => {
    const formatted = `${sec.section} (${sec.title})`;
    if (!actsAndSections.includes(formatted)) {
      setActsAndSections([...actsAndSections, formatted]);
    }
  };

  const handleAddManualSection = () => {
    if (newSectionInput.trim() && !actsAndSections.includes(newSectionInput.trim())) {
      setActsAndSections([...actsAndSections, newSectionInput.trim()]);
      setNewSectionInput('');
    }
  };

  const handleSubmitFIR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseNumber || !verbatimOriginal || actsAndSections.length === 0) {
      setErrorMsg('Please complete all mandatory fields and specify penal sections.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await firCaseService.registerMultilingualFIR({
        caseNumber,
        policeStation,
        district,
        state,
        courtName,
        firLanguage: selectedLanguage,
        complainantName,
        complainantPhone,
        complainantAddress,
        accusedList,
        incidentDateTime,
        incidentPlace,
        actsAndSections,
        verbatimStatementOriginal: verbatimOriginal,
        translatedStatementEnglish: enableTranslation ? translatedEnglish : undefined,
        isAiTranslated: enableTranslation && selectedLanguage !== 'en',
        officerName,
        officerBadge,
        officerDept,
      });

      setSuccessMsg(`E-FIR [${caseNumber}] registered and anchored to blockchain with PKI signature.`);
      setIsSubmitting(false);
      onFIRSubmitted();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to lodge E-FIR');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 p-5 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Languages className="w-3.5 h-3.5" />
            <span>MULTILINGUAL E-FIR ENGINE · SECTION 173 BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white font-serif tracking-tight mt-0.5">
            Vernacular First Information Report (E-FIR) Registration
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Lodge cognizable criminal complaints natively in 13 Indian regional languages while preserving the original verbatim legal record with non-repudiable SHA-256 blockchain anchoring.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/60 rounded-lg text-emerald-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg('')}
            className="text-emerald-300 hover:text-white cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Regional Language Selection Ribbon */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>Select Regional Language for Complainant Deposition (13 Scheduled Languages):</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {(Object.keys(FIR_LANGUAGES) as SupportedFIRLanguage[]).map((langCode) => {
            const meta = FIR_LANGUAGES[langCode];
            const isSelected = selectedLanguage === langCode;
            return (
              <button
                key={langCode}
                type="button"
                onClick={() => handleLanguageChange(langCode)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{meta.nativeName}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                  ({meta.name})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main E-FIR Form */}
      <form onSubmit={handleSubmitFIR} className="space-y-5 text-xs text-slate-300">
        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-500 rounded text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Jurisdiction & Reference */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
          <div className="font-semibold text-slate-200 text-xs flex items-center gap-2">
            <FileSignature className="w-4 h-4 text-amber-400" />
            <span>FIR Jurisdiction & Station Allocation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">FIR Sequence Number *</label>
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Police Station *</label>
              <input
                type="text"
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">District / State</label>
              <input
                type="text"
                value={`${district}, ${state}`}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Complainant & Incident Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
            <span className="font-semibold text-slate-200 text-xs">Complainant / Informant Profile</span>
            <div>
              <label className="block text-slate-400 mb-0.5">Name *</label>
              <input
                type="text"
                value={complainantName}
                onChange={(e) => setComplainantName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-0.5">Phone / Contact</label>
              <input
                type="text"
                value={complainantPhone}
                onChange={(e) => setComplainantPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-0.5">Residential Address</label>
              <input
                type="text"
                value={complainantAddress}
                onChange={(e) => setComplainantAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
            <span className="font-semibold text-slate-200 text-xs">Occurrence of Offence Details</span>
            <div>
              <label className="block text-slate-400 mb-0.5">Date & Time of Occurrence *</label>
              <input
                type="datetime-local"
                value={incidentDateTime}
                onChange={(e) => setIncidentDateTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-0.5">Place of Occurrence & Landmarks</label>
              <input
                type="text"
                value={incidentPlace}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-0.5">Designated Competent Court</label>
              <input
                type="text"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Dual-Pane Verbatim Statement & Optional Judicial Translation */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-white text-xs flex items-center gap-2">
                <span>Complainant Deposition (Original Language: {FIR_LANGUAGES[selectedLanguage].name})</span>
                <span className="px-2 py-0.2 text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                  VERBATIM LEGAL RECORD
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                The original regional statement is encrypted and stored as the definitive legal proof.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSimulateVoiceDictation}
                className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isRecordingVoice
                    ? 'bg-red-600 text-white border-red-500 animate-pulse'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                {isRecordingVoice ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isRecordingVoice ? 'Listening to Officer Speech...' : 'Audio Voice Dictation'}</span>
              </button>

              <button
                type="button"
                onClick={handleRunAISectionAdvisor}
                disabled={isClassifying || !verbatimOriginal.trim()}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/60 rounded transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isClassifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                <span>AI Section Advisor</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Pane: Original Verbatim Text */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Original Statement ({FIR_LANGUAGES[selectedLanguage].nativeName}):</span>
                <span className="font-mono text-emerald-400">Preserved 100% Verbatim</span>
              </div>
              <textarea
                rows={6}
                value={verbatimOriginal}
                onChange={(e) => setVerbatimOriginal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-amber-500 font-sans text-xs leading-relaxed"
                placeholder="Enter complainant statement in regional language..."
                required
              />
            </div>

            {/* Right Pane: English Judicial Translation (Clearly Disclaimed) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="text-amber-300 font-medium">Judicial Inter-State Digest (English):</span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableTranslation}
                    onChange={(e) => setEnableTranslation(e.target.checked)}
                    className="accent-amber-400"
                  />
                  <span>Enable Dual-Pane Digest</span>
                </label>
              </div>

              {enableTranslation ? (
                <div className="space-y-1">
                  <div className="p-1.5 bg-amber-950/40 border border-amber-500/40 rounded text-[10px] font-mono text-amber-300 font-semibold text-center">
                    AI GENERATED TRANSLATION · NOT ORIGINAL LEGAL RECORD
                  </div>
                  <textarea
                    rows={5}
                    value={translatedEnglish}
                    onChange={(e) => setTranslatedEnglish(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-300 focus:outline-none focus:border-amber-500 font-sans text-xs leading-relaxed"
                    placeholder="AI synthesized translation for higher courts and inter-state prosecution..."
                  />
                </div>
              ) : (
                <div className="h-36 bg-slate-950/40 border border-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-xs">
                  Dual-pane translation disabled. Only original verbatim statement will be archived.
                </div>
              )}
            </div>
          </div>

          {/* AI Suggestions Box */}
          {aiSuggestions.length > 0 && (
            <div className="p-3.5 bg-indigo-950/40 border border-indigo-800/60 rounded-lg space-y-2">
              <div className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Suggested Bharatiya Nyaya Sanhita (BNS) Penal Provisions:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {aiSuggestions.map((sug, i) => (
                  <div key={i} className="p-2.5 bg-slate-900 border border-slate-800 rounded flex flex-col justify-between gap-1">
                    <div>
                      <div className="font-mono font-bold text-amber-300">{sug.section}</div>
                      <div className="text-slate-200 text-xs font-medium">{sug.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{sug.rationale}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplySection(sug)}
                      className="self-end px-2 py-0.5 text-[10px] font-semibold text-indigo-200 bg-indigo-900/80 hover:bg-indigo-800 rounded transition-colors cursor-pointer"
                    >
                      + Add to FIR
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Penal Sections */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <label className="block text-slate-400">Statutory Penal Sections Charged *</label>
            <div className="flex flex-wrap gap-2">
              {actsAndSections.map((sec) => (
                <span
                  key={sec}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-950 border border-amber-500/40 rounded text-amber-300 font-mono text-xs"
                >
                  <span>{sec}</span>
                  <button
                    type="button"
                    onClick={() => setActsAndSections(actsAndSections.filter((s) => s !== sec))}
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
                className="flex-1 bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddManualSection}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 cursor-pointer"
              >
                Add Section
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: PKI Digital Sign & Blockchain Commit */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="font-semibold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Investigating Officer Digital Signature Commitment</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Signed by: {officerName} ({officerBadge}) · {officerDept}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Anchoring E-FIR on Blockchain...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Digitally Sign & Commit E-FIR</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
