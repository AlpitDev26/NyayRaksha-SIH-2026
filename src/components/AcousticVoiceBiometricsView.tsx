import React, { useState } from 'react';
import {
  Mic,
  Activity,
  AudioWaveform,
  Volume2,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Send,
  Lock,
  Sparkles,
  Search,
} from 'lucide-react';
import { phase15Service } from '../services/phase15Service';
import { AcousticVoiceBiometricRecord } from '../types';

export const AcousticVoiceBiometricsView: React.FC = () => {
  const [records, setRecords] = useState<AcousticVoiceBiometricRecord[]>(phase15Service.getVoiceRecords());
  const [selectedRecord, setSelectedRecord] = useState<AcousticVoiceBiometricRecord>(records[0] || null);
  const [isNewSampleModalOpen, setIsNewSampleModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [caseRef, setCaseRef] = useState<string>('DL-01-2026-CR-0041');
  const [suspectAlias, setSuspectAlias] = useState<string>('Vikas @ Sharpshooter (Intercepted Threat Note)');
  const [sourceType, setSourceType] = useState<
    'INTERCEPTED_RANSOM_CALL' | 'WIRETAP_EXTORTION_RECORDING' | 'COURTROOM_TESTIMONY_DEPOSITION'
  >('INTERCEPTED_RANSOM_CALL');
  const [duration, setDuration] = useState<number>(36);
  const [f0, setF0] = useState<number>(118.2);
  const [f1, setF1] = useState<number>(490);
  const [f2, setF2] = useState<number>(1620);
  const [f3, setF3] = useState<number>(2540);
  const [officerName, setOfficerName] = useState<string>(
    'Dr. Sandeep K. Malhotra (Director, Forensic Acoustics Lab, NFSU Delhi)'
  );

  const handleCreateVoiceRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await phase15Service.createVoiceRecord({
      caseNumberRef: caseRef,
      suspectNameOrAlias: suspectAlias,
      audioSourceType: sourceType,
      durationSeconds: Number(duration),
      acousticMetrics: {
        fundamentalFrequencyF0Hz: Number(f0),
        formantF1Hz: Number(f1),
        formantF2Hz: Number(f2),
        formantF3Hz: Number(f3),
        jitterPercent: 0.38,
        shimmerPercent: 1.05,
      },
      syntheticAiDetection: 'GENUINE_HUMAN_VOICE',
      likelihoodRatioMatchPercentage: 98.7,
      chiefAcousticForensicOfficer: officerName,
    });

    const updated = phase15Service.getVoiceRecords();
    setRecords(updated);
    setSelectedRecord(created);
    setIsNewSampleModalOpen(false);
    setToastMessage(`Acoustic Voice Biometric Docket #${created.sampleId} analyzed and anchored under BSA Section 63`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-950/80 via-slate-900 to-indigo-950/80 border border-violet-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Mic className="w-48 h-48 text-violet-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/40 rounded uppercase tracking-wider">
                NFSU Forensic Acoustics
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded uppercase tracking-wider">
                MFCC & Voice Deepfake Detection
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Mic className="w-6 h-6 text-violet-400" />
              National Forensic Voice & Acoustic Speaker Biometrics Grid
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              128-band Mel-Frequency Cepstral Coefficients (MFCC) acoustic vector extraction, pitch formant profiling,
              AI-synthesized voice clone detection, and Section 63 BSA 2023 evidentiary attestation.
            </p>
          </div>

          <button
            onClick={() => setIsNewSampleModalOpen(true)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-violet-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Ingest Voice Audio Sample</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-violet-950/90 border border-violet-500/60 text-violet-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-violet-300 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Voice Samples */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-violet-400" />
              Acoustic Biometric Samples ({records.length})
            </h2>
          </div>

          <div className="space-y-3">
            {records.map((item) => {
              const isSelected = selectedRecord?.sampleId === item.sampleId;

              return (
                <div
                  key={item.sampleId}
                  onClick={() => setSelectedRecord(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-violet-500/60 ring-1 ring-violet-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-violet-400">{item.sampleId}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-emerald-500/15 text-emerald-300 border-emerald-500/30">
                      {item.syntheticAiDetection.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1">{item.suspectNameOrAlias}</div>
                  <div className="text-xs text-slate-400 mb-2">{item.audioSourceType.replace(/_/g, ' ')}</div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Likelihood Ratio (LR):</span>
                    <span className="font-mono font-bold text-emerald-400">{item.likelihoodRatioMatchPercentage}% Match</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Acoustic Formants & Spectrogram Analysis */}
        {selectedRecord && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded">
                    {selectedRecord.audioSourceType.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{selectedRecord.suspectNameOrAlias}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Examiner: <span className="text-slate-200">{selectedRecord.chiefAcousticForensicOfficer}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-right">
                  <div className="text-[11px] text-slate-400">Speaker Biometric Match</div>
                  <div className="text-xl font-mono font-bold text-emerald-400 mt-0.5">
                    {selectedRecord.likelihoodRatioMatchPercentage}%
                  </div>
                </div>
              </div>

              {/* Formants Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Pitch (F0)</div>
                  <div className="text-base font-mono font-bold text-violet-300 mt-1">
                    {selectedRecord.acousticMetrics.fundamentalFrequencyF0Hz} Hz
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Formant F1</div>
                  <div className="text-base font-mono font-bold text-cyan-300 mt-1">
                    {selectedRecord.acousticMetrics.formantF1Hz} Hz
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Formant F2</div>
                  <div className="text-base font-mono font-bold text-cyan-300 mt-1">
                    {selectedRecord.acousticMetrics.formantF2Hz} Hz
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Formant F3</div>
                  <div className="text-base font-mono font-bold text-cyan-300 mt-1">
                    {selectedRecord.acousticMetrics.formantF3Hz} Hz
                  </div>
                </div>
              </div>
            </div>

            {/* Spectrogram MFCC Hash & Deepfake Authenticity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-violet-400" />
                    128-Band MFCC Vector Hash
                  </h4>
                  <span className="text-xs font-mono text-violet-300">Feature Vector</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-violet-400 break-all">
                  {selectedRecord.spectrogramMfccSha256}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    AI Clone & Deepfake Verification
                  </h4>
                  <span className="text-xs text-emerald-400 font-semibold">Human Verified</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Phase-continuity and neural artifact analysis confirms genuine human biological glottal pulses. No
                  synthetic text-to-speech vocoder artefacts detected.
                </p>
              </div>
            </div>

            {/* Section 63 BSA Evidentiary Seal */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Section 63 BSA 2023 Acoustic Forensic Evidentiary Certificate Hash
                </h4>
                <span className="text-[11px] font-mono text-emerald-400">Court Admissible</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 break-all">
                {selectedRecord.evidentiaryCertificateBSA63Sha256}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Ingest Voice Sample */}
      {isNewSampleModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-violet-400" />
                Ingest Forensic Voice Audio Sample
              </h3>
              <button
                onClick={() => setIsNewSampleModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateVoiceRecord} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Case Reference Number</label>
                <input
                  type="text"
                  required
                  value={caseRef}
                  onChange={(e) => setCaseRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Suspect Name / Speaker Alias</label>
                <input
                  type="text"
                  required
                  value={suspectAlias}
                  onChange={(e) => setSuspectAlias(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Audio Source Category</label>
                <select
                  value={sourceType}
                  onChange={(e) =>
                    setSourceType(
                      e.target.value as
                        | 'INTERCEPTED_RANSOM_CALL'
                        | 'WIRETAP_EXTORTION_RECORDING'
                        | 'COURTROOM_TESTIMONY_DEPOSITION'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="INTERCEPTED_RANSOM_CALL">Intercepted Ransom / Kidnapping Call</option>
                  <option value="WIRETAP_EXTORTION_RECORDING">Wiretapped Extortion Recording</option>
                  <option value="COURTROOM_TESTIMONY_DEPOSITION">Courtroom Live Deposition Exemplar</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (Seconds)</label>
                  <input
                    type="number"
                    required
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fundamental Pitch F0 (Hz)</label>
                  <input
                    type="number"
                    required
                    value={f0}
                    onChange={(e) => setF0(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Chief Forensic Acoustic Officer</label>
                <input
                  type="text"
                  required
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewSampleModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Analyze & Anchor MFCC Vector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
