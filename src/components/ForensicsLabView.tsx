import React, { useState } from 'react';
import { CaseFile, ForensicReport, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import {
  Microscope,
  Plus,
  Search,
  CheckCircle,
  FileText,
  Lock,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';

interface ForensicsLabViewProps {
  cases: CaseFile[];
  language: SupportedLanguage;
  onOpenSubmitReport: (caseFile: CaseFile) => void;
  onSelectCase: (caseFile: CaseFile) => void;
}

export const ForensicsLabView: React.FC<ForensicsLabViewProps> = ({
  cases,
  language,
  onOpenSubmitReport,
  onSelectCase,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all forensic reports across cases
  const allReports: Array<{ report: ForensicReport; caseFile: CaseFile }> = [];
  cases.forEach((c) => {
    c.forensicReports.forEach((r) => {
      allReports.push({ report: r, caseFile: c });
    });
  });

  const filtered = allReports.filter(({ report, caseFile }) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesRef = report.fslRefNumber.toLowerCase().includes(q);
      const matchesType = report.testType.toLowerCase().includes(q);
      const matchesLab = report.laboratory.toLowerCase().includes(q);
      const matchesCase = caseFile.caseNumber.toLowerCase().includes(q);
      const matchesExaminer = report.examinerName.toLowerCase().includes(q);
      return matchesRef || matchesType || matchesLab || matchesCase || matchesExaminer;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner with Forensics Lab Visual Asset */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
        <div className="h-32 md:h-40 w-full relative">
          <img
            src="/src/assets/images/forensics_cyber_lab_1790520832288.jpg"
            alt="Forensics Lab Workstation"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-40"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-6 flex flex-col justify-end">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
              <Microscope className="w-4 h-4" />
              <span>CENTRAL FORENSIC SCIENCE LABORATORY (CFSL) & STATE FSL NETWORK</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white font-serif tracking-tight mt-1">
              Forensic Examination & Cyber Analysis Laboratory
            </h1>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Scientific analysis of ballistic, chemical, biological, and digital extractions under ISO/IEC 17025 with immutable bitstream hashes.
            </p>
          </div>
        </div>
      </div>

      {/* Action and Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FSL reference #, test methodology, scientist name, case ref..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-700/80 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {cases.length > 0 && (
            <button
              onClick={() => onOpenSubmitReport(cases[0])}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-purple-400 hover:bg-purple-300 rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>File Certified FSL Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Reports Listing */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-lg space-y-2">
          <Microscope className="w-8 h-8 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-300">No Forensic Reports Found</div>
          <p className="text-xs text-slate-500">
            Submit a new scientific report to anchor its raw bitstream and findings on the blockchain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(({ report, caseFile }) => (
            <div
              key={report.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-purple-400 text-sm">
                      {report.fslRefNumber}
                    </span>
                    <span className="text-slate-600">·</span>
                    <button
                      onClick={() => onSelectCase(caseFile)}
                      className="font-mono text-xs text-slate-400 hover:text-amber-300 cursor-pointer"
                    >
                      Case: {caseFile.caseNumber}
                    </button>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs text-slate-400 font-mono">
                      Completed: {report.dateCompleted.slice(0, 10)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-base mt-1">{report.testType}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Laboratory: {report.laboratory} · Examiner: {report.examinerName} ({report.examinerBadge})
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="text-emerald-400 font-mono font-bold text-lg">
                    {report.confidenceScore}% Scientific Probability
                  </div>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-800 text-purple-300 border border-purple-800/50">
                    Status: {report.status}
                  </span>
                </div>
              </div>

              {/* Scientific Findings & Method Details */}
              <div className="p-3.5 bg-slate-950 rounded border border-slate-800 space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-300">Analysis Methodology: </span>
                  <span className="text-slate-400">{report.methodology}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-300">Technical Findings: </span>
                  <span className="text-slate-200">{report.findings}</span>
                </div>
                <div className="p-2.5 bg-slate-900/90 rounded border border-slate-800 text-amber-200 font-medium">
                  <span className="font-bold text-amber-400">Scientific Opinion / Conclusion: </span>
                  <span>{report.conclusion}</span>
                </div>
              </div>

              {/* Cryptographic Hashes & Digital Signature Proof */}
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 font-mono text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Certified Report SHA-256:</span>
                  <span className="text-purple-400 truncate max-w-sm">{report.reportHash}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Raw Bitstream Extraction Digest:</span>
                  <span className="text-slate-300 truncate max-w-sm">{report.rawExtractionHash}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
                  <span>Blockchain Anchor Tx:</span>
                  <span className="text-emerald-400 truncate max-w-sm">{report.blockchainTxId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
