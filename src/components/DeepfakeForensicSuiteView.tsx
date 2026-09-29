import React, { useState } from 'react';
import {
  SyntheticMediaForensicAnalysis,
  SupportedLanguage,
  UserRole,
} from '../types';
import { phase7Service } from '../services/phase7Service';
import {
  Microscope,
  ShieldCheck,
  AlertOctagon,
  FileCheck,
  Activity,
  AudioWaveform,
  Video,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  Sparkles,
  Download,
  Eye,
  Sliders,
  Cpu,
  Lock,
} from 'lucide-react';

interface DeepfakeForensicSuiteViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const DeepfakeForensicSuiteView: React.FC<DeepfakeForensicSuiteViewProps> = ({
  language: _language,
  currentRole: _currentRole,
}) => {
  const [analyses, setAnalyses] = useState<SyntheticMediaForensicAnalysis[]>(() =>
    phase7Service.getDeepfakeAnalyses()
  );
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>(analyses[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'SPECTRAL_FFT' | 'FRAME_ARTIFACTS' | 'PROVENANCE_C2PA' | 'BSA63_CERT'>(
    'SPECTRAL_FFT'
  );
  const [isScanningNew, setIsScanningNew] = useState(false);
  const [scanMediaType, setScanMediaType] = useState<'AUDIO' | 'VIDEO' | 'IMAGE'>('AUDIO');
  const [scanFileName, setScanFileName] = useState('surveillance_audio_clip_wiretap.wav');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedAnalysis = analyses.find((a) => a.id === selectedAnalysisId) || analyses[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRunDiagnostic = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanningNew(true);
    setTimeout(() => {
      const newAnalysis = phase7Service.runNewSyntheticMediaDiagnostic(
        `EVD-2026-DL-${Math.floor(Math.random() * 800 + 100)}`,
        scanMediaType,
        scanFileName
      );
      setAnalyses([newAnalysis, ...analyses]);
      setSelectedAnalysisId(newAnalysis.id);
      setIsScanningNew(false);
      showToast('Section 63 BSA Forensic Diagnostic Scan complete.');
    }, 1200);
  };

  if (!selectedAnalysis) {
    return <div className="p-8 text-center text-slate-400">No forensic media records available.</div>;
  }

  const isFake = selectedAnalysis.manipulationVerdict === 'CONFIRMED_DEEPFAKE_SYNTHETIC' || selectedAnalysis.manipulationVerdict === 'PROBABLE_MANIPULATION';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500/90 text-slate-950 font-medium px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-amber-300">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/30 p-5 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-indigo-950/40 border border-indigo-500/40 p-1 flex items-center justify-center shrink-0 shadow-md">
            <Microscope className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <span className="px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/30">
                SECTION 63 BHARATIYA SAKSHYA ADHINIYAM (BSA 2023)
              </span>
              <span className="text-slate-400">CFSL DEEPFAKE & SYNTHETIC MEDIA LAB</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white font-serif tracking-tight mt-0.5">
              Deepfake & Synthetic Media Forensic Integrity Suite
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-spectrum AI manipulation detection, neural vocoder voice cloning diagnostics, facial warping artifact detection, and C2PA provenance certification for court admissibility.
            </p>
          </div>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 rounded bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Neural FFT Analyzer Active</span>
          </div>
        </div>
      </div>

      {/* Upper Section: Media Selection & New Scan Trigger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanned Exhibits Carousel / List */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Diagnostic Queue</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{analyses.length} items</span>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {analyses.map((a) => {
              const fake = a.manipulationVerdict === 'CONFIRMED_DEEPFAKE_SYNTHETIC' || a.manipulationVerdict === 'PROBABLE_MANIPULATION';
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAnalysisId(a.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-colors cursor-pointer space-y-1 ${
                    selectedAnalysisId === a.id
                      ? 'bg-indigo-950/40 border-indigo-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">{a.evidenceCode}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        fake
                          ? 'bg-red-950 text-red-400 border border-red-500/40'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {fake ? `FAKE (${a.deepfakeProbability}%)` : 'AUTHENTIC'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 truncate font-mono">{a.fileName}</p>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Type: {a.mediaType}</span>
                    <span>Score: {a.overallAuthenticityScore}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scan Launcher Form (2 Columns) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Launch New Deepfake / AI Forensic Diagnostic</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">CFSL Cyber-Audio Engine v4.8</span>
          </div>

          <form onSubmit={handleRunDiagnostic} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Target Media Category</label>
              <select
                value={scanMediaType}
                onChange={(e) => setScanMediaType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded p-2 font-mono"
              >
                <option value="AUDIO">Audio Recording / Wiretap</option>
                <option value="VIDEO">Video / CCTV / Bodycam</option>
                <option value="IMAGE">Digital Photo / Document Scan</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Media File Identifier / Hash</label>
              <input
                type="text"
                value={scanFileName}
                onChange={(e) => setScanFileName(e.target.value)}
                placeholder="e.g. extortion_voice_memo_02.wav"
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded p-2 focus:border-indigo-400 outline-none font-mono"
              />
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={isScanningNew}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold text-xs rounded transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
              >
                {isScanningNew ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing FFT & Neural Artifacts...</span>
                  </>
                ) : (
                  <>
                    <Microscope className="w-3.5 h-3.5" />
                    <span>Run Deepfake Multi-Spectrum Diagnostic</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Diagnostic Workspace */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-6">
        {/* Selected Evidence Overview Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 font-bold">{selectedAnalysis.evidenceCode}</span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-white font-mono">{selectedAnalysis.fileName}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-3 font-mono">
              <span>SHA-256: {selectedAnalysis.sha256Hash.slice(0, 24)}...</span>
              <span>•</span>
              <span>Case: {selectedAnalysis.caseId}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Authenticity Score</div>
              <div className={`text-xl font-bold font-mono ${isFake ? 'text-red-400' : 'text-emerald-400'}`}>
                {selectedAnalysis.overallAuthenticityScore}%
              </div>
            </div>
            <div
              className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${
                isFake
                  ? 'bg-red-950/60 border-red-500/50 text-red-300'
                  : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              }`}
            >
              {isFake ? <AlertOctagon className="w-5 h-5 text-red-400" /> : <ShieldCheck className="w-5 h-5 text-emerald-400" />}
              <div>
                <div className="text-[10px] font-mono uppercase font-bold">Verdict</div>
                <div className="text-xs font-bold font-sans">{selectedAnalysis.manipulationVerdict.replace(/_/g, ' ')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('SPECTRAL_FFT')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'SPECTRAL_FFT'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AudioWaveform className="w-3.5 h-3.5" />
            <span>Spectral FFT & Voice Jitter</span>
          </button>
          <button
            onClick={() => setActiveTab('FRAME_ARTIFACTS')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'FRAME_ARTIFACTS'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Frame Anomaly Visualizer</span>
          </button>
          <button
            onClick={() => setActiveTab('PROVENANCE_C2PA')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'PROVENANCE_C2PA'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>C2PA Hardware Provenance</span>
          </button>
          <button
            onClick={() => setActiveTab('BSA63_CERT')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'BSA63_CERT'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Section 63 BSA Certificate</span>
          </button>
        </div>

        {/* Tab 1: Spectral FFT & Voice Jitter */}
        {activeTab === 'SPECTRAL_FFT' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono uppercase">
                  Fast Fourier Transform (FFT) Frequency Spectrum
                </span>
                <span className="text-[10px] font-mono text-slate-400">Sample Rate: 48 kHz / 24-bit</span>
              </div>

              {/* Dynamic FFT Waveform Bar Chart Visualizer */}
              <div className="h-44 bg-slate-900 rounded p-4 flex items-end justify-between gap-1.5 border border-slate-800">
                {selectedAnalysis.frequencySpectrumFftData.map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      style={{ height: `${val}%` }}
                      className={`w-full rounded-t transition-all duration-500 ${
                        isFake && val > 75
                          ? 'bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                          : 'bg-indigo-500/70'
                      }`}
                    />
                    <span className="text-[8px] font-mono text-slate-500">{idx * 2}k</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {isFake
                  ? 'Abnormal phase discontinuity and synthetic high-frequency energy spikes detected at 4kHz - 8kHz bands, characteristic of neural diffusion vocoders (e.g. ElevenLabs/RVC).'
                  : 'Natural harmonic resonance curve consistent with physical human vocal tract acoustic dissipation.'}
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white font-mono uppercase">Biometric Jitter Metrics</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Spectral Anomaly:</span>
                    <span className={`font-mono font-bold ${selectedAnalysis.spectralAnomalyScore > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {selectedAnalysis.spectralAnomalyScore}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${selectedAnalysis.spectralAnomalyScore}%` }}
                      className={`h-full ${selectedAnalysis.spectralAnomalyScore > 50 ? 'bg-red-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                </div>

                {selectedAnalysis.voiceBiometricJitterScore !== undefined && (
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Vocal Tract Jitter Ratio:</span>
                      <span className={`font-mono font-bold ${selectedAnalysis.voiceBiometricJitterScore > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {selectedAnalysis.voiceBiometricJitterScore}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${selectedAnalysis.voiceBiometricJitterScore}%` }}
                        className={`h-full ${selectedAnalysis.voiceBiometricJitterScore > 50 ? 'bg-red-500' : 'bg-emerald-500'}`}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="text-slate-400">Detected Tool Signatures:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedAnalysis.detectedTooltags.map((tag, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-indigo-300 font-mono text-[10px] rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Frame Anomaly Visualizer */}
        {activeTab === 'FRAME_ARTIFACTS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white font-mono uppercase">
                Frame-by-Frame Temporal & Spatial Manipulation Traces
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {selectedAnalysis.frameAnomalies.length} Anomaly Events Flagged
              </span>
            </div>

            {selectedAnalysis.frameAnomalies.length === 0 ? (
              <div className="p-8 bg-slate-950 rounded-lg border border-slate-800 text-center text-xs text-emerald-400 space-y-1">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                <div className="font-bold">No Spatial or Facial Manipulation Artifacts Detected</div>
                <div className="text-slate-400">Media demonstrates continuous natural frame-to-frame pixel noise distributions.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedAnalysis.frameAnomalies.map((anom, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 rounded-lg border border-red-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-red-400 font-bold">Frame #{anom.frameNumber} (t = {anom.timestampSec}s)</span>
                      <span className="px-2 py-0.5 bg-red-950 border border-red-500/40 text-red-300 text-[10px] rounded">
                        Confidence: {(anom.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-200">{anom.anomalyType}</p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Flagged by: Spatial Convolutional Gradient Filter & Morphological Edge Analyzer
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: C2PA Provenance */}
        {activeTab === 'PROVENANCE_C2PA' && (
          <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">C2PA Content Credentials & Hardware Enclave Trace</h4>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                  selectedAnalysis.c2paProvenanceVerified
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                }`}
              >
                {selectedAnalysis.c2paProvenanceVerified ? 'C2PA MANIFEST VERIFIED' : 'NO HARDWARE C2PA ATTESTATION'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1.5">
                <span className="text-slate-400">EXIF Metadata Status:</span>
                <div className="text-white font-bold">{selectedAnalysis.exifMetadataConsistency}</div>
                <p className="text-[11px] text-slate-400 font-sans">
                  {selectedAnalysis.exifMetadataConsistency === 'CONSISTENT'
                    ? 'EXIF header timeline perfectly matches hardware sensor serial and clock counters.'
                    : 'EXIF structure indicates software post-processing or synthetic generative exporter.'}
                </p>
              </div>

              <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1.5">
                <span className="text-slate-400">Cryptographic Root Certificate:</span>
                <div className="text-indigo-300">{selectedAnalysis.bsa63CertificateDigest}</div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Issued under Ministry of Home Affairs Digital Forensic Standard 2026.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Section 63 BSA Certificate */}
        {activeTab === 'BSA63_CERT' && (
          <div className="p-6 bg-slate-950 rounded-lg border border-indigo-500/40 space-y-4">
            <div className="text-center border-b border-slate-800 pb-3">
              <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
                CENTRAL FORENSIC SCIENCE LABORATORY (CFSL)
              </div>
              <h3 className="text-base font-bold text-white font-serif mt-0.5">
                CERTIFICATE OF ELECTRONIC EVIDENCE AUTHENTICITY
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Issued pursuant to Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA)
              </p>
            </div>

            <div className="text-xs text-slate-300 font-serif leading-relaxed space-y-3">
              <p>
                This is to certify that the electronic record identified as <strong>{selectedAnalysis.fileName}</strong> (Evidence Code: <strong>{selectedAnalysis.evidenceCode}</strong>) with SHA-256 hash digest <code>{selectedAnalysis.sha256Hash}</code> was subjected to multi-spectral deepfake and artificial neural synthesis analysis in accordance with ISO/IEC 27037 standards.
              </p>
              <div className="p-3 bg-slate-900 rounded border border-slate-800 font-mono text-xs space-y-1">
                <div>• Overall Authenticity Score: <strong>{selectedAnalysis.overallAuthenticityScore}%</strong></div>
                <div>• Manipulation Classification: <strong className={isFake ? 'text-red-400' : 'text-emerald-400'}>{selectedAnalysis.manipulationVerdict}</strong></div>
                <div>• CFSL Certificate Digest: <strong>{selectedAnalysis.bsa63CertificateDigest}</strong></div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1 font-mono text-[11px]">
                <div className="text-slate-400">Digitally Signed By:</div>
                <div className="text-white font-bold">{selectedAnalysis.examinerSignOff.signerName} ({selectedAnalysis.examinerSignOff.signerDesignation})</div>
                <div className="text-emerald-400 text-[10px]">PKI Digest: {selectedAnalysis.examinerSignOff.signatureHex.slice(0, 32)}...</div>
              </div>

              <button
                onClick={() => showToast('Section 63 BSA Official Cryptographic Dossier downloaded.')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm self-start md:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Certified BSA Sec 63 Dossier</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
