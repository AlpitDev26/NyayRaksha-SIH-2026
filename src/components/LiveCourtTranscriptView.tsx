import React, { useState } from 'react';
import {
  Mic,
  Languages,
  Radio,
  ShieldCheck,
  Building,
  CheckCircle2,
  FileCheck2,
  Send,
  Plus,
  Lock,
  Volume2,
} from 'lucide-react';
import { phase15Service } from '../services/phase15Service';
import { LiveCourtTranscriptRecord } from '../types';

export const LiveCourtTranscriptView: React.FC = () => {
  const [transcripts, setTranscripts] = useState<LiveCourtTranscriptRecord[]>(phase15Service.getLiveTranscripts());
  const [selectedSession, setSelectedSession] = useState<LiveCourtTranscriptRecord>(transcripts[0] || null);
  const [showHindiTranslation, setShowHindiTranslation] = useState<boolean>(true);
  const [isDialogueModalOpen, setIsDialogueModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for new spoken dialogue
  const [speakerRole, setSpeakerRole] = useState<
    'CHIEF_JUSTICE' | 'PUISNE_JUDGE' | 'ATTORNEY_GENERAL' | 'SOLICITOR_GENERAL' | 'SENIOR_ADVOCATE' | 'WITNESS_EXAMINED'
  >('SENIOR_ADVOCATE');
  const [speakerName, setSpeakerName] = useState<string>('Ld. Senior Advocate Sh. Kapil Sibal');
  const [spokenText, setSpokenText] = useState<string>(
    'The petitioners submit that procedural fairness under Section 187 of the BNSS mandates immediate supply of electronic case diary copies to the accused at the stage of remand.'
  );
  const [translatedHindi, setTranslatedHindi] = useState<string>(
    'याचिकाकर्ताओं का तर्क है कि बीएनएसएस की धारा 187 के तहत रिमांड के चरण में अभियुक्त को इलेक्ट्रॉनिक केस डायरी की प्रति प्रदान करना अनिवार्य है।'
  );

  const handleAddDialogue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;

    await phase15Service.appendDialogueSegment(selectedSession.sessionId, {
      speakerRole,
      speakerName,
      spokenText,
      translatedTextHindi: translatedHindi,
    });

    const updated = phase15Service.getLiveTranscripts();
    setTranscripts(updated);
    const curr = updated.find((s) => s.sessionId === selectedSession.sessionId);
    if (curr) setSelectedSession(curr);

    setIsDialogueModalOpen(false);
    setToastMessage(`Live courtroom stenography segment anchored with Section 63 BSA SHA-256 seal`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Mic className="w-48 h-48 text-purple-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded uppercase tracking-wider">
                Article 145(3) Constitution Bench
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded uppercase tracking-wider">
                22 Official Languages Teleprompter
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Mic className="w-6 h-6 text-purple-400" />
              Sovereign Supreme Court Live Multi-Lingual Transcriber
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time courtroom audio stenography, speaker voiceprint diarization, simultaneous Hindi & Eighth Schedule
              translation, and continuous Section 63 BSA 2023 cryptographic watermarking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHindiTranslation(!showHindiTranslation)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                showHindiTranslation
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              <Languages className="w-4 h-4" />
              <span>{showHindiTranslation ? 'Simultaneous Hindi Subtitles (Active)' : 'English Only'}</span>
            </button>

            <button
              onClick={() => setIsDialogueModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>Record Spoken Submission</span>
            </button>
          </div>
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
        {/* Left Column: Active Court Session Info */}
        {selectedSession && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-mono text-xs font-semibold text-purple-400">{selectedSession.sessionId}</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {selectedSession.sessionStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{selectedSession.benchTitle}</h3>
                <div className="text-xs text-slate-400 mt-1 font-mono">{selectedSession.caseNumberRef}</div>
              </div>

              <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span>Stenographer:</span>
                  <span className="text-slate-200 font-semibold">{selectedSession.stenographerOfficerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Languages:</span>
                  <span className="text-purple-300 font-semibold">
                    {selectedSession.activeSimultaneousLanguages.join(', ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Session Commenced:</span>
                  <span className="font-mono text-slate-300">
                    {new Date(selectedSession.sessionStartedTimestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Full Transcript BSA 63 Master Seal
                </div>
                <div className="font-mono text-[10px] text-emerald-400 break-all p-2 bg-slate-950 rounded border border-slate-800">
                  {selectedSession.fullTranscriptBSA63SealSha256}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Live Streaming Stenography Stream */}
        {selectedSession && (
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-400" />
                Live Courtroom Dialogue Stream ({selectedSession.dialogues.length} Segments)
              </h2>
              <span className="text-xs font-mono text-slate-500">Continuous BSA 63 Hash Chaining</span>
            </div>

            <div className="space-y-3">
              {selectedSession.dialogues.map((dialogue) => {
                const isBench = dialogue.speakerRole === 'CHIEF_JUSTICE' || dialogue.speakerRole === 'PUISNE_JUDGE';
                const isAG = dialogue.speakerRole === 'ATTORNEY_GENERAL' || dialogue.speakerRole === 'SOLICITOR_GENERAL';

                return (
                  <div
                    key={dialogue.segmentId}
                    className={`p-4 rounded-xl border transition-all ${
                      isBench
                        ? 'bg-slate-900/90 border-purple-500/40 shadow-md'
                        : isAG
                        ? 'bg-slate-900/80 border-indigo-500/40'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            isBench
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : isAG
                              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {dialogue.speakerRole.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-bold text-white">{dialogue.speakerName}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                        <span>{dialogue.timestamp}</span>
                        <span className="text-emerald-400 font-semibold">{dialogue.voiceprintConfidencePercent}% Match</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{dialogue.spokenText}</p>

                    {showHindiTranslation && dialogue.translatedTextHindi && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs text-purple-300 leading-relaxed font-sans bg-purple-950/20 p-2 rounded border border-purple-900/30">
                        <span className="text-[10px] uppercase font-bold text-purple-400 block mb-0.5">
                          Hindi Live Subtitle (हिन्दी अनुवाद):
                        </span>
                        {dialogue.translatedTextHindi}
                      </div>
                    )}

                    <div className="mt-2 pt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Segment: {dialogue.segmentId}</span>
                      <span className="truncate max-w-[280px]">Hash: {dialogue.segmentHashSha256}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Append Spoken Dialogue */}
      {isDialogueModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-purple-400" />
                Record Courtroom Spoken Submission
              </h3>
              <button
                onClick={() => setIsDialogueModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleAddDialogue} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Speaker Role</label>
                <select
                  value={speakerRole}
                  onChange={(e) =>
                    setSpeakerRole(
                      e.target.value as
                        | 'CHIEF_JUSTICE'
                        | 'PUISNE_JUDGE'
                        | 'ATTORNEY_GENERAL'
                        | 'SOLICITOR_GENERAL'
                        | 'SENIOR_ADVOCATE'
                        | 'WITNESS_EXAMINED'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="CHIEF_JUSTICE">Hon. Chief Justice of India</option>
                  <option value="PUISNE_JUDGE">Hon. Senior Puisne Judge</option>
                  <option value="ATTORNEY_GENERAL">Ld. Attorney General for India</option>
                  <option value="SOLICITOR_GENERAL">Ld. Solicitor General of India</option>
                  <option value="SENIOR_ADVOCATE">Ld. Senior Advocate</option>
                  <option value="WITNESS_EXAMINED">Witness / Expert Witness</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Speaker Name</label>
                <input
                  type="text"
                  required
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Spoken Text (English)</label>
                <textarea
                  rows={3}
                  required
                  value={spokenText}
                  onChange={(e) => setSpokenText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Simultaneous Translation (Hindi)</label>
                <textarea
                  rows={2}
                  required
                  value={translatedHindi}
                  onChange={(e) => setTranslatedHindi(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDialogueModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Anchor Segment & Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
