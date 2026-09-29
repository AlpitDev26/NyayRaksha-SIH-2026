import React, { useState } from 'react';
import { CaseFile, SupportedLanguage, UserRole } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { storageService } from '../services/storageService';
import {
  Scale,
  Calendar,
  FileCheck,
  Plus,
  Lock,
  Search,
  CheckCircle,
  FileText,
  Gavel,
  Shield,
  Stamp,
} from 'lucide-react';

interface CourtroomViewProps {
  cases: CaseFile[];
  language: SupportedLanguage;
  currentRole: UserRole;
  onSelectCase: (caseItem: CaseFile) => void;
  onOpenJudicialOrderModal: (caseItem: CaseFile) => void;
}

export const CourtroomView: React.FC<CourtroomViewProps> = ({
  cases,
  language,
  currentRole,
  onSelectCase,
  onOpenJudicialOrderModal,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all hearing dates
  const listedHearings: Array<{ caseFile: CaseFile; hearing: any }> = [];
  cases.forEach((c) => {
    c.hearingDates.forEach((h) => {
      listedHearings.push({ caseFile: c, hearing: h });
    });
  });

  const courtCases = cases.filter((c) =>
    ['court_efiling', 'judicial_trial', 'judgment_delivered', 'archived'].includes(c.stage)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner with Sovereign Judicial Stamp Asset */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 p-5 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-red-950/40 border border-red-500/40 p-1 flex items-center justify-center shrink-0 shadow-md">
            <img
              src="/src/assets/images/judicial_seal_stamp_1790520821200.jpg"
              alt="Judicial Stamp"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <Scale className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Scale className="w-3.5 h-3.5" />
              <span>DIGITAL JUDICIAL BENCH & E-FILING REGISTRY</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white font-serif tracking-tight mt-0.5">
              Court Proceedings & Judicial Orders
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Judicial magistrate hearing dockets, electronic bail ruling issuance, non-bailable warrants, and certified digital judgments.
            </p>
          </div>
        </div>

        {cases.length > 0 && (
          <button
            onClick={() => onOpenJudicialOrderModal(cases[0])}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <Gavel className="w-4 h-4" />
            <span>Issue Judicial Order / Judgment</span>
          </button>
        )}
      </div>

      {/* Cause List Schedule */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>National Daily Cause List & Hearing Schedule</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Total Listed: {listedHearings.length}
          </span>
        </div>

        {listedHearings.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded border border-slate-800">
            No hearings scheduled on the active cause list.
          </div>
        ) : (
          <div className="space-y-2">
            {listedHearings.map(({ caseFile, hearing }, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950 border border-slate-800 rounded flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1.5 bg-slate-900 border border-amber-500/30 rounded font-mono text-amber-400 font-bold text-center shrink-0">
                    <div className="text-[10px] text-slate-500 uppercase">HEARING</div>
                    <div>{hearing.date}</div>
                  </div>
                  <div>
                    <button
                      onClick={() => onSelectCase(caseFile)}
                      className="font-mono font-bold text-slate-200 hover:text-amber-300 text-left block cursor-pointer"
                    >
                      {caseFile.caseNumber} {caseFile.cnrNumber ? `· CNR: ${caseFile.cnrNumber}` : ''}
                    </button>
                    <div className="text-slate-300 line-clamp-1">{caseFile.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Bench: {hearing.bench}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-amber-200 font-medium">{hearing.purpose}</div>
                    {hearing.outcome && (
                      <div className="text-[11px] text-emerald-400 mt-0.5">
                        Outcome: {hearing.outcome}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onOpenJudicialOrderModal(caseFile)}
                    className="px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Issue Bench Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Court Cases Dossiers */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Cases in Judicial Stage ({courtCases.length})
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courtCases.map((c) => (
            <div
              key={c.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono font-bold text-amber-400 text-xs">
                      {c.caseNumber}
                    </span>
                    {c.cnrNumber && (
                      <div className="font-mono text-[10px] text-slate-400">CNR: {c.cnrNumber}</div>
                    )}
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-800 text-amber-300 border border-slate-700">
                    {c.stage.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>

                <h3 className="font-semibold text-white text-sm line-clamp-1">{c.title}</h3>
                <div className="text-xs text-slate-400">Court: {c.courtName}</div>

                {c.judicialJudgment && (
                  <div className="p-2.5 bg-slate-950 border border-amber-500/40 rounded text-xs space-y-1">
                    <div className="flex items-center justify-between text-amber-400 font-bold">
                      <span>Certified Final Judgment</span>
                      <span>{c.judicialJudgment.verdict}</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Delivered by: {c.judicialJudgment.presidingJudge}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => onSelectCase(c)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  View Case Docket →
                </button>
                <button
                  onClick={() => onOpenJudicialOrderModal(c)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Gavel className="w-3.5 h-3.5" />
                  <span>Judicial Action</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
