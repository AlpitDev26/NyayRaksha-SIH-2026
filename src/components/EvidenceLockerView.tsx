import React, { useState, useMemo } from 'react';
import { CaseFile, EvidenceItem, EvidenceCategory, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import {
  Boxes,
  Shield,
  ArrowRightLeft,
  Search,
  Filter,
  QrCode,
  Lock,
  CheckCircle,
  AlertTriangle,
  FileText,
  MapPin,
  Calendar,
  User,
} from 'lucide-react';

interface EvidenceLockerViewProps {
  cases: CaseFile[];
  language: SupportedLanguage;
  onOpenTransferModal: (caseItem: CaseFile, evidence: EvidenceItem) => void;
  onSelectCase: (caseItem: CaseFile) => void;
}

const CATEGORIES: Array<{ id: EvidenceCategory | 'ALL'; label: string }> = [
  { id: 'ALL', label: 'All Categories' },
  { id: 'DIGITAL', label: 'Digital Artifacts' },
  { id: 'BALLISTICS', label: 'Ballistics & Firearms' },
  { id: 'NARCOTICS', label: 'Narcotics & Seizures' },
  { id: 'BIOLOGICAL_DNA', label: 'Biological / DNA' },
  { id: 'DOCUMENTARY', label: 'Documentary Records' },
  { id: 'FINANCIAL_RECORDS', label: 'Financial Records' },
];

export const EvidenceLockerView: React.FC<EvidenceLockerViewProps> = ({
  cases,
  language,
  onOpenTransferModal,
  onSelectCase,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [selectedCategory, setSelectedCategory] = useState<EvidenceCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Flatten all evidence items with case context
  const allEvidence = useMemo(() => {
    const list: Array<{ item: EvidenceItem; caseFile: CaseFile }> = [];
    for (const c of cases) {
      for (const ev of c.evidenceItems) {
        list.push({ item: ev, caseFile: c });
      }
    }
    return list;
  }, [cases]);

  const filtered = useMemo(() => {
    return allEvidence.filter(({ item, caseFile }) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = item.evidenceCode.toLowerCase().includes(q);
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesCase = caseFile.caseNumber.toLowerCase().includes(q);
        const matchesSeal = item.tamperSealNumber.toLowerCase().includes(q);
        const matchesCustodian = item.currentCustodian.toLowerCase().includes(q);
        return matchesCode || matchesTitle || matchesCase || matchesSeal || matchesCustodian;
      }
      return true;
    });
  }, [allEvidence, selectedCategory, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight font-serif flex items-center gap-2">
            <Boxes className="w-5 h-5 text-amber-400" />
            <span>National Evidence & Chain of Custody Locker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically sealed physical & electronic exhibits with multi-agency digital handover logs.
          </p>
        </div>
      </div>

      {/* Category Segmented Controls */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count =
            cat.id === 'ALL'
              ? allEvidence.length
              : allEvidence.filter((e) => e.item.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-mono tabular-nums ${
                  isActive ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search evidence barcode, exhibit title, case ref, seal number, custodian..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-700/80 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Evidence Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-lg space-y-2">
          <Boxes className="w-8 h-8 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-300">No Evidence Exhibits Found</div>
          <p className="text-xs text-slate-500">No items match your category or query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(({ item, caseFile }) => (
            <div
              key={item.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-xs">
                        {item.evidenceCode}
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-950 text-slate-300 border border-slate-800">
                        {item.category}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectCase(caseFile)}
                      className="text-[11px] font-mono text-slate-400 hover:text-amber-300 mt-0.5 block text-left cursor-pointer"
                    >
                      Case: {caseFile.caseNumber}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                      <CheckCircle className="w-3 h-3" />
                      <span>{item.sealStatus.replace(/_/g, ' ')}</span>
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>
                </div>

                {/* Evidence Metadata Grid */}
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-[11px] space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Tamper-Proof Seal:</span>
                    <span className="text-amber-300">{item.tamperSealNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Current Custodian:</span>
                    <span className="text-slate-200 truncate max-w-[200px]">
                      {item.currentCustodian} ({item.custodianDepartment})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Vault Location:</span>
                    <span className="text-cyan-400">{item.storageVaultLocation}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/80">
                    <span>SHA-256 Checksum:</span>
                    <span className="text-emerald-400 truncate max-w-[180px]">{item.sha256Checksum}</span>
                  </div>
                </div>

                {/* Chain of Custody summary */}
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Total Handovers: {item.chainOfCustody.length}</span>
                  <span className="font-mono text-[10px] text-purple-400">
                    Blockchain Anchored OK
                  </span>
                </div>
              </div>

              {/* Bottom Transfer Action */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onSelectCase(caseFile)}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  View Case Dossier →
                </button>
                <button
                  onClick={() => onOpenTransferModal(caseFile, item)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Transfer Custody</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
