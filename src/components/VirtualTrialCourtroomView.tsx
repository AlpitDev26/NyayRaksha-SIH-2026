import React, { useState } from 'react';
import {
  CourtroomHearingSession,
  SupportedLanguage,
  UserRole,
} from '../types';
import { phase7Service } from '../services/phase7Service';
import {
  Scale,
  Video,
  Mic,
  FileText,
  CheckCircle,
  AlertTriangle,
  Gavel,
  ShieldCheck,
  Award,
  Sparkles,
  Send,
  Eye,
  UserCheck,
  Clock,
  Radio,
  Building2,
  Lock,
  Stamp,
  Play,
  Pause,
  RefreshCw,
} from 'lucide-react';

interface VirtualTrialCourtroomViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const VirtualTrialCourtroomView: React.FC<VirtualTrialCourtroomViewProps> = ({
  language: _language,
  currentRole: _currentRole,
}) => {
  const [sessions, setSessions] = useState<CourtroomHearingSession[]>(() =>
    phase7Service.getCourtroomSessions()
  );
  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id || '');
  const [newStenoText, setNewStenoText] = useState('');
  const [stenoSpeaker, setStenoSpeaker] = useState<'JUDGE' | 'PROSECUTOR' | 'DEFENSE' | 'WITNESS'>('PROSECUTOR');
  const [isRecordingLive, setIsRecordingLive] = useState(true);
  const [activeTab, setActiveTab] = useState<'TRIAL_FEED' | 'EXHIBITS' | 'ORDER_SHEET' | 'E_PRISONS_LINK'>('TRIAL_FEED');
  const [judicialAnnotation, setJudicialAnnotation] = useState('');
  const [selectedExhibitId, setSelectedExhibitId] = useState<string>('EXH-001');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddStenography = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newStenoText.trim() || !activeSession) return;

    const speakerMap = {
      JUDGE: activeSession.presidingJudge,
      PROSECUTOR: activeSession.publicProsecutor,
      DEFENSE: activeSession.defenseCounsel,
      WITNESS: activeSession.witnessName,
    };

    const updated = phase7Service.addStenographyEntry(activeSession.id, {
      speaker: speakerMap[stenoSpeaker],
      speakerRole: stenoSpeaker,
      text: newStenoText.trim(),
      citations: newStenoText.includes('Section') || newStenoText.includes('Sec')
        ? ['BNSS 2023 Sec 530', 'BSA 2023 Sec 63']
        : undefined,
    });

    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setNewStenoText('');
    showToast('Transcript entry logged with cryptographic timestamp.');
  };

  const handleRaiseObjection = (type: 'SECTION_63_BSA_AUTHENTICITY' | 'RELEVANCY' | 'HEARSAY') => {
    if (!activeSession) return;
    const textMap = {
      SECTION_63_BSA_AUTHENTICITY:
        'Defense Counsel raises formal objection under Section 63(4) of Bharatiya Sakshya Adhiniyam, 2023 regarding electronic device hash chain continuity.',
      RELEVANCY: 'Prosecution objects on the grounds of relevancy to the framed charges under Section 318(4) BNS.',
      HEARSAY: 'Defense objects: The testimony constitutes uncorroborated hearsay without digital metadata verification.',
    };

    const updated = phase7Service.addStenographyEntry(activeSession.id, {
      speaker: activeSession.defenseCounsel,
      speakerRole: 'DEFENSE',
      text: textMap[type],
      objectionType: type,
      objectionRuling: 'PENDING',
      citations: ['BSA 2023 Sec 63'],
    });

    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showToast(`Objection (${type}) registered before the Bench.`);
  };

  const handleObjectionRuling = (stenoId: string, ruling: 'SUSTAINED' | 'OVERRULED') => {
    if (!activeSession) return;
    const updated = phase7Service.updateRulingObjection(activeSession.id, stenoId, ruling);
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showToast(`Magistrate ruling: Objection ${ruling}.`);
  };

  const handleAdmitExhibit = (exhibitId: string, ruling: 'ADMITTED_FORMALLY' | 'REJECTED') => {
    if (!activeSession) return;
    const annotation = judicialAnnotation || 'Endorsed in open virtual court under Section 530 BNSS.';
    const updated = phase7Service.admitExhibitWithJudgeEndorsement(
      activeSession.id,
      exhibitId,
      ruling,
      annotation
    );
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setJudicialAnnotation('');
    showToast(`Exhibit ${ruling === 'ADMITTED_FORMALLY' ? 'Admitted and Endorsed' : 'Marked Rejected'}.`);
  };

  if (!activeSession) {
    return <div className="p-8 text-center text-slate-400">No active courtroom hearings found.</div>;
  }

  const selectedExhibit = activeSession.presentedExhibits.find((e) => e.id === selectedExhibitId) || activeSession.presentedExhibits[0];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500/90 text-slate-950 font-medium px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-amber-300">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner with Judicial Sovereign Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 p-5 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-amber-950/40 border border-amber-500/40 p-1 flex items-center justify-center shrink-0 shadow-md">
            <Scale className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/30">
                SECTION 530 BNSS & E-COURTS 4.0
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Radio className="w-3 h-3 animate-pulse" /> LIVE DIGITAL TRIAL ARENA
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white font-serif tracking-tight mt-0.5">
              Virtual Courtroom & Electronic Hearing Deck
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live judicial trial proceedings with biometrically secured e-Prisons WebRTC link, real-time stenographic feed, and cryptographic exhibit admission under Section 63 BSA.
            </p>
          </div>
        </div>

        {/* Action Badges */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 rounded bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Patiala House Court #02</span>
          </div>
          <div className="px-3 py-1.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </div>

      {/* Main Courtroom Grid: Virtual Benches */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Bench 1: Presiding Magistrate (Center-Left / Top) */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-lg p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-300" />
          <div>
            <div className="flex items-center justify-between text-xs text-amber-400 font-mono mb-2">
              <span className="flex items-center gap-1 font-semibold">
                <Gavel className="w-3.5 h-3.5" /> PRESIDING MAGISTRATE
              </span>
              <span className="px-1.5 py-0.5 bg-amber-950 border border-amber-500/40 rounded text-[10px]">
                ON BENCH
              </span>
            </div>
            <h3 className="text-sm font-bold text-white font-serif">{activeSession.presidingJudge}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Chief Metropolitan Magistrate</p>
            <div className="mt-3 p-2 bg-slate-950/60 rounded border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Court:</span>
                <span className="text-white font-medium">Court No. 2, Patiala House</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Digital Seal:</span>
                <span className="text-emerald-400 font-mono text-[10px]">ECDSA-CMM-DEL-04</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Sec 530 BNSS Authorized</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Certified
            </span>
          </div>
        </div>

        {/* Bench 2: Public Prosecutor Rostrum */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-blue-400 font-mono mb-2">
              <span className="flex items-center gap-1 font-semibold">
                <Award className="w-3.5 h-3.5" /> PROSECUTION ROSTRUM
              </span>
              <span className="px-1.5 py-0.5 bg-blue-950 border border-blue-500/40 rounded text-[10px] text-blue-300">
                ACTIVE
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">{activeSession.publicProsecutor}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Special Public Prosecutor (CBI / State)</p>
            <div className="mt-3 p-2 bg-slate-950/60 rounded border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-blue-300 font-medium">Tendering Evidence Ex. P-14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Case FIR:</span>
                <span className="text-amber-400 font-mono">{activeSession.caseNumber}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>State Prosecution Desk</span>
            <span className="text-blue-400">Verified Identity</span>
          </div>
        </div>

        {/* Bench 3: Defense Counsel Deck */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-purple-400 font-mono mb-2">
              <span className="flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> DEFENSE COUNSEL
              </span>
              <span className="px-1.5 py-0.5 bg-purple-950 border border-purple-500/40 rounded text-[10px] text-purple-300">
                CONNECTED
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">{activeSession.defenseCounsel}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Counsel for Accused Vikramaditya Roy</p>
            <div className="mt-3 p-2 bg-slate-950/60 rounded border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Bar Enrolment:</span>
                <span className="text-purple-300 font-mono text-[10px]">D/4412/2014</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Objection:</span>
                <span className="text-amber-400 font-medium">Sec 63 BSA Extraction</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Legal Aid & Private Bar</span>
            <span className="text-purple-400">Bar Council OK</span>
          </div>
        </div>

        {/* Bench 4: Accused Remote Video Link (e-Prisons Biometric Check) */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-400 font-mono mb-2">
              <span className="flex items-center gap-1 font-semibold">
                <Video className="w-3.5 h-3.5" /> E-PRISONS REMOTE LINK
              </span>
              <span className="px-1.5 py-0.5 bg-emerald-950 border border-emerald-500/40 rounded text-[10px] text-emerald-300 flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> MATCH {activeSession.ePrisonsBiometricCheck.biometricMatchScore}%
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">{activeSession.accusedName}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{activeSession.accusedLocation}</p>
            <div className="mt-3 p-2 bg-slate-950/60 rounded border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Prisons UID:</span>
                <span className="text-slate-200 font-mono text-[10px]">{activeSession.ePrisonsBiometricCheck.accusedUid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Warden Sign:</span>
                <span className="text-emerald-400 font-mono text-[10px]">{activeSession.ePrisonsBiometricCheck.wardenSignature}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Under Judicial Custody</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Biometric Valid
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('TRIAL_FEED')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'TRIAL_FEED'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Live Stenography & Transcript</span>
        </button>
        <button
          onClick={() => setActiveTab('EXHIBITS')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'EXHIBITS'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Evidence Exhibits & Sec 63 BSA Endorsement</span>
        </button>
        <button
          onClick={() => setActiveTab('ORDER_SHEET')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ORDER_SHEET'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Daily Judicial Order Sheet</span>
        </button>
      </div>

      {/* Tab 1: Live Stenography & Transcript Feed */}
      {activeTab === 'TRIAL_FEED' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stenographic Live Feed (2 Columns) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Real-Time Electronic Stenography Log
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <button
                  onClick={() => setIsRecordingLive(!isRecordingLive)}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer transition-colors"
                >
                  {isRecordingLive ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                  <span>{isRecordingLive ? 'Streaming Live' : 'Paused'}</span>
                </button>
              </div>
            </div>

            {/* Scrollable Transcript Messages */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-2">
              {activeSession.stenographyLog.map((entry) => {
                const roleColors = {
                  JUDGE: 'bg-amber-950/40 border-amber-500/30 text-amber-300',
                  PROSECUTOR: 'bg-blue-950/40 border-blue-500/30 text-blue-300',
                  DEFENSE: 'bg-purple-950/40 border-purple-500/30 text-purple-300',
                  WITNESS: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300',
                  STENOGRAPHER: 'bg-slate-800/40 border-slate-700 text-slate-300',
                };

                return (
                  <div
                    key={entry.id}
                    className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-1.5 transition-all hover:border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${roleColors[entry.speakerRole]}`}>
                          {entry.speaker}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {entry.timestamp}
                        </span>
                      </div>

                      {entry.objectionType && (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-red-950 border border-red-500/50 text-red-300 text-[10px] font-mono rounded flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Objection: {entry.objectionType}
                          </span>
                          {entry.objectionRuling === 'PENDING' ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleObjectionRuling(entry.id, 'SUSTAINED')}
                                className="px-1.5 py-0.5 bg-emerald-700 hover:bg-emerald-600 text-[10px] font-semibold text-white rounded cursor-pointer"
                              >
                                Sustain
                              </button>
                              <button
                                onClick={() => handleObjectionRuling(entry.id, 'OVERRULED')}
                                className="px-1.5 py-0.5 bg-red-700 hover:bg-red-600 text-[10px] font-semibold text-white rounded cursor-pointer"
                              >
                                Overrule
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                entry.objectionRuling === 'SUSTAINED'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-red-950 text-red-400 border border-red-500/40'
                              }`}
                            >
                              {entry.objectionRuling}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed">{entry.text}</p>

                    {entry.citations && entry.citations.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span className="text-[10px] font-mono text-amber-400">Statutory Citations:</span>
                        {entry.citations.map((cit, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-slate-300 text-[10px] rounded font-mono"
                          >
                            {cit}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Real-Time Speech Input Simulator */}
            <form onSubmit={handleAddStenography} className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
              <select
                value={stenoSpeaker}
                onChange={(e) => setStenoSpeaker(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded px-2.5 py-2 font-mono"
              >
                <option value="PROSECUTOR">Prosecutor</option>
                <option value="DEFENSE">Defense Counsel</option>
                <option value="JUDGE">Magistrate</option>
                <option value="WITNESS">Witness</option>
              </select>
              <input
                type="text"
                value={newStenoText}
                onChange={(e) => setNewStenoText(e.target.value)}
                placeholder="Transcribe speech or type judicial statement..."
                className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded px-3 py-2 focus:border-amber-400 outline-none font-sans"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors cursor-pointer flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Log</span>
              </button>
            </form>
          </div>

          {/* Right Action Deck: Objections & Sworn Statements */}
          <div className="space-y-4">
            {/* Quick Objection Launcher */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Quick Objection Protocol</span>
              </h3>
              <p className="text-xs text-slate-400">
                Raise instant statutory objections under the new criminal laws (BNS / BNSS / BSA):
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleRaiseObjection('SECTION_63_BSA_AUTHENTICITY')}
                  className="w-full text-left p-2.5 bg-slate-950 hover:bg-slate-800 border border-red-500/30 hover:border-red-500/60 rounded text-xs transition-colors cursor-pointer group"
                >
                  <div className="font-semibold text-red-300 group-hover:text-red-200 flex items-center justify-between">
                    <span>Sec 63(4) BSA Extraction Objection</span>
                    <span className="text-[10px] font-mono text-slate-400">Electronic Hash Continuity</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Challenge cryptographic device seizure timeline or integrity.
                  </p>
                </button>
                <button
                  onClick={() => handleRaiseObjection('RELEVANCY')}
                  className="w-full text-left p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded text-xs transition-colors cursor-pointer group"
                >
                  <div className="font-semibold text-slate-200 group-hover:text-white flex items-center justify-between">
                    <span>Relevancy under Sec 318(4) BNS</span>
                    <span className="text-[10px] font-mono text-slate-400">Charge Scope</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Object to evidence exceeding framed charge particulars.
                  </p>
                </button>
                <button
                  onClick={() => handleRaiseObjection('HEARSAY')}
                  className="w-full text-left p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded text-xs transition-colors cursor-pointer group"
                >
                  <div className="font-semibold text-slate-200 group-hover:text-white flex items-center justify-between">
                    <span>Hearsay & Unverified Statement</span>
                    <span className="text-[10px] font-mono text-slate-400">Section 6 BSA</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Statement without direct witness or certified metadata.
                  </p>
                </button>
              </div>
            </div>

            {/* Witness Box & Oath Certification */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Witness Box & Oath Check</span>
                </h3>
                <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono rounded">
                  OATH ADMINISTERED
                </span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Deponent:</span>
                  <span className="text-white font-medium">{activeSession.witnessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Designation:</span>
                  <span className="text-slate-300">Chief Forensic Cyber Analyst, CFSL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Oaths Act 1969:</span>
                  <span className="text-emerald-400 font-mono text-[10px]">AFFIRMED SEC 4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Evidence Exhibits & Sec 63 BSA Endorsement */}
      {activeTab === 'EXHIBITS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exhibit List */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Court Evidence Exhibits</span>
            </h3>
            <div className="space-y-2">
              {activeSession.presentedExhibits.map((exh) => (
                <button
                  key={exh.id}
                  onClick={() => setSelectedExhibitId(exh.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer space-y-1.5 ${
                    selectedExhibitId === exh.id
                      ? 'bg-amber-950/40 border-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">{exh.courtExhibitNumber || exh.evidenceCode}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        exh.admittedStatus === 'ADMITTED_FORMALLY'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : exh.admittedStatus === 'REJECTED'
                          ? 'bg-red-950 text-red-400 border border-red-500/40'
                          : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {exh.admittedStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{exh.title}</p>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono">
                    <span>By: {exh.submittedBy}</span>
                    <span>Sec 63: {exh.bsaCertificateVerified ? 'Verified' : 'Pending'}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Exhibit Detail & Judicial Endorsement Workspace (2 Columns) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase">
                  {selectedExhibit.courtExhibitNumber || 'UNMARKED EXHIBIT'}
                </span>
                <h3 className="text-base font-bold text-white">{selectedExhibit.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-slate-800 text-slate-300 font-mono text-xs rounded border border-slate-700">
                  {selectedExhibit.evidenceCode}
                </span>
              </div>
            </div>

            {/* Cryptographic Proof Card */}
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">SHA-256 Ledger Digest:</span>
                <span className="text-emerald-400 text-[11px] font-mono">{selectedExhibit.sha256Digest}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Section 63 BSA Certification:</span>
                <span className={selectedExhibit.bsaCertificateVerified ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                  {selectedExhibit.bsaCertificateVerified ? 'COMPLIANT & SIGNED' : 'REQUIRES LAB RE-EXAMINATION'}
                </span>
              </div>
              {selectedExhibit.endorsementSignature && (
                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                  <div className="text-amber-400 font-bold font-mono text-[10px] flex items-center gap-1">
                    <Stamp className="w-3 h-3" /> JUDICIAL ADMISSION SEAL (PATIALA HOUSE COURTS)
                  </div>
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-slate-400">Endorsed By:</span>
                    <span className="text-white">{selectedExhibit.endorsementSignature.signerName} ({selectedExhibit.endorsementSignature.signerDesignation})</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-slate-400">Digital Signature Hex:</span>
                    <span className="text-emerald-400">{selectedExhibit.endorsementSignature.signatureHex.slice(0, 32)}...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Judicial Endorsement Action Form */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Magistrate Admission Remarks & Order Annotation (Sec 530 BNSS):
              </label>
              <textarea
                value={judicialAnnotation}
                onChange={(e) => setJudicialAnnotation(e.target.value)}
                placeholder="Enter judicial ruling observations, objection resolution, or conditional exhibit marking..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded p-3 focus:border-amber-400 outline-none"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAdmitExhibit(selectedExhibit.id, 'ADMITTED_FORMALLY')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Formally Admit Exhibit with Digital Seal</span>
                </button>
                <button
                  onClick={() => handleAdmitExhibit(selectedExhibit.id, 'REJECTED')}
                  className="px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-600/50 text-red-300 font-bold text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Reject Exhibit (Inadmissible)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Daily Judicial Order Sheet */}
      {activeTab === 'ORDER_SHEET' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white font-serif">
                Daily Judicial Order Sheet (Record of Proceedings)
              </h2>
              <p className="text-xs text-slate-400">
                Generated under Rule 14, Delhi High Court Rules & Section 530 Bharatiya Nagarik Suraksha Sanhita, 2023.
              </p>
            </div>
            <div className="px-3 py-1.5 bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-mono rounded flex items-center gap-1.5">
              <Stamp className="w-4 h-4" />
              <span>Court Order No. 2026/DL/482-ORD-08</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 font-serif leading-relaxed space-y-3">
            <div className="text-center border-b border-slate-800 pb-2">
              <div className="font-bold text-white text-sm">IN THE COURT OF CHIEF METROPOLITAN MAGISTRATE</div>
              <div className="text-amber-400 font-sans text-xs">PATIALA HOUSE DISTRICT COURTS, NEW DELHI</div>
              <div className="text-slate-400 font-mono text-[11px] mt-0.5">CNR NO: DLPH01-004821-2026 | FIR NO: 482/2026 PS SPECIAL CELL</div>
            </div>

            <p>
              <strong>Present:</strong> Sh. S.K. Mahapatra, Ld. Special PP for the State (CBI/Cyber).
              <br />
              Ms. Meenakshi Sundaram, Ld. Counsel for the Accused Vikramaditya Roy (through VC from Tihar Jail #4).
            </p>

            <p className="italic text-slate-200">
              "{activeSession.activeOrderDraft}"
            </p>

            <p>
              <strong>Order:</strong> Matter be listed for remaining prosecution witnesses and cross-examination on <strong>04.10.2026</strong>. Accused be produced via high-security encrypted VC link from Tihar Jail. Jail Superintendent to ensure uninterrupted biometric link.
            </p>

            <div className="pt-4 flex items-center justify-between font-sans text-xs border-t border-slate-800">
              <div>
                <span className="text-slate-400">Digital Order Hash:</span>{' '}
                <span className="text-emerald-400 font-mono text-[11px]">
                  0x9482bf1a002948ce19948271aeb40192847a91
                </span>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">Hon. Sh. Rajeshwar Nath (DHJS)</div>
                <div className="text-slate-400 text-[11px]">Chief Metropolitan Magistrate</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
