import React, { useState, useMemo } from 'react';
import { CaseFile, CaseStage, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import {
  FolderOpen,
  Filter,
  Plus,
  ArrowUpDown,
  Search,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface CasesPipelineViewProps {
  cases: CaseFile[];
  language: SupportedLanguage;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCase: (caseItem: CaseFile) => void;
  onOpenNewFir: () => void;
}

const ALL_STAGES: Array<{ id: CaseStage | 'ALL'; label: string }> = [
  { id: 'ALL', label: 'All Stages' },
  { id: 'fir_registered', label: '1. FIR Filed' },
  { id: 'investigation', label: '2. Investigation' },
  { id: 'evidence_collected', label: '3. Evidence Vault' },
  { id: 'forensic_analysis', label: '4. Forensics FSL' },
  { id: 'charge_sheet_draft', label: '5. Charge Sheet' },
  { id: 'prosecution_scrutiny', label: '6. Prosecution' },
  { id: 'court_efiling', label: '7. Court e-Filing' },
  { id: 'judicial_trial', label: '8. Trial' },
  { id: 'judgment_delivered', label: '9. Judgment' },
];

export const CasesPipelineView: React.FC<CasesPipelineViewProps> = ({
  cases,
  language,
  searchQuery,
  onSearchChange,
  onSelectCase,
  onOpenNewFir,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [selectedStage, setSelectedStage] = useState<CaseStage | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'docs' | 'evidence'>('date');

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Stage filter
      if (selectedStage !== 'ALL' && c.stage !== selectedStage) return false;

      // Priority filter
      if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesCaseNo = c.caseNumber.toLowerCase().includes(query);
        const matchesCnr = c.cnrNumber?.toLowerCase().includes(query) || false;
        const matchesTitle = c.title.toLowerCase().includes(query);
        const matchesAccused = c.accused.some(a => a.name.toLowerCase().includes(query));
        const matchesSection = c.legalActsAndSections.some(s => s.toLowerCase().includes(query));
        const matchesHash = c.documents.some(d => d.sha256Hash.toLowerCase().includes(query));
        return matchesCaseNo || matchesCnr || matchesTitle || matchesAccused || matchesSection || matchesHash;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'docs') return b.documents.length - a.documents.length;
      if (sortBy === 'evidence') return b.evidenceItems.length - a.evidenceItems.length;
      return new Date(b.firDate).getTime() - new Date(a.firDate).getTime();
    });
  }, [cases, selectedStage, priorityFilter, searchQuery, sortBy]);

  return (
    <div className="space-y-4">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight font-serif flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-amber-400" />
            <span>National Case Dossiers & Pipeline</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Centralized registry of verified cognizable criminal cases, forensic records, and judicial e-filings.
          </p>
        </div>

        <button
          onClick={onOpenNewFir}
          className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors cursor-pointer shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.btnNewFir}</span>
        </button>
      </div>

      {/* Stage Filter Buttons - Segmented Interactive Controls */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
        {ALL_STAGES.map((s) => {
          const isActive = selectedStage === s.id;
          const count = s.id === 'ALL' ? cases.length : cases.filter(c => c.stage === s.id).length;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedStage(s.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{s.label}</span>
              <span className={`text-[10px] font-mono tabular-nums ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Search & Sorting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search case #, accused name, sections, police station..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-400">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-950 text-slate-300 border border-slate-700 px-2 py-1.5 rounded focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="NATIONAL_SECURITY">National Security</option>
              <option value="HIGH_SENSITIVITY">High Sensitivity</option>
              <option value="URGENT">Urgent</option>
              <option value="ROUTINE">Routine</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <span>Sort By:</span>
          <button
            onClick={() => setSortBy('date')}
            className={`px-2 py-1 rounded cursor-pointer ${sortBy === 'date' ? 'bg-slate-800 text-amber-300 font-semibold' : 'hover:text-white'}`}
          >
            Filing Date
          </button>
          <button
            onClick={() => setSortBy('docs')}
            className={`px-2 py-1 rounded cursor-pointer ${sortBy === 'docs' ? 'bg-slate-800 text-amber-300 font-semibold' : 'hover:text-white'}`}
          >
            Docs Count
          </button>
          <button
            onClick={() => setSortBy('evidence')}
            className={`px-2 py-1 rounded cursor-pointer ${sortBy === 'evidence' ? 'bg-slate-800 text-amber-300 font-semibold' : 'hover:text-white'}`}
          >
            Evidence Items
          </button>
        </div>
      </div>

      {/* Cases Data Table - Clean High Density Grid with Unboxed Metadata */}
      {filteredCases.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-lg space-y-3">
          <FolderOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-300">No Case Files Found</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No active case files match your search criteria or selected stage filter.
          </p>
          <button
            onClick={() => {
              setSelectedStage('ALL');
              setPriorityFilter('ALL');
              onSearchChange('');
            }}
            className="px-3 py-1.5 text-xs text-amber-400 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Case / CNR Ref</th>
                  <th className="py-3 px-4">Case Title & Offence Sections</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Evidence & Docs</th>
                  <th className="py-3 px-4">Lead Investigator</th>
                  <th className="py-3 px-4 text-right">Integrity Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-sans">
                {filteredCases.map((caseItem) => {
                  const isTampered = caseItem.tamperStatus === 'TAMPER_ALERT';
                  return (
                    <tr
                      key={caseItem.id}
                      onClick={() => onSelectCase(caseItem)}
                      className={`hover:bg-slate-800/60 transition-colors cursor-pointer ${
                        isTampered ? 'bg-red-950/20' : ''
                      }`}
                    >
                      {/* Case Number & CNR */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <div className="font-mono font-bold text-amber-400">
                          {caseItem.caseNumber}
                        </div>
                        {caseItem.cnrNumber && (
                          <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                            CNR: {caseItem.cnrNumber}
                          </div>
                        )}
                        <div className="text-[11px] text-slate-400 mt-1">
                          {caseItem.firDate.slice(0, 10)}
                        </div>
                      </td>

                      {/* Title & Sections */}
                      <td className="py-3.5 px-4 align-top max-w-md">
                        <div className="font-medium text-slate-100 line-clamp-1">
                          {caseItem.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span className="text-slate-300 font-medium">
                            {caseItem.policeStation}
                          </span>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-slate-400 truncate">
                            {caseItem.legalActsAndSections.slice(0, 2).join('; ')}
                            {caseItem.legalActsAndSections.length > 2 && ` (+${caseItem.legalActsAndSections.length - 2} more)`}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Accused: {caseItem.accused.map(a => a.name).join(', ')}
                        </div>
                      </td>

                      {/* Current Stage */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-800 text-amber-300 border border-slate-700">
                          {caseItem.stage.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 capitalize">
                          Priority: {caseItem.priority.toLowerCase().replace(/_/g, ' ')}
                        </div>
                      </td>

                      {/* Evidence & Docs Count */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap font-mono tabular-nums text-slate-300 text-[11px]">
                        <div>Docs: {caseItem.documents.length}</div>
                        <div>Exhibits: {caseItem.evidenceItems.length}</div>
                        <div>FSL Reports: {caseItem.forensicReports.length}</div>
                      </td>

                      {/* Lead Investigator */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap text-slate-300">
                        <div className="font-medium">{caseItem.leadInvestigator.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {caseItem.leadInvestigator.badgeId}
                        </div>
                      </td>

                      {/* Integrity Status */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        {isTampered ? (
                          <div className="inline-flex items-center gap-1 text-red-400 font-semibold font-mono text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                            <span>TAMPER ALERT</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>ANCHORED OK</span>
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-[120px] ml-auto mt-0.5">
                          Root: {caseItem.merkleRoot.slice(0, 8)}...
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
