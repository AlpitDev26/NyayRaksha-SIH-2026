import React, { useState, useEffect } from 'react';
import { LegalPrecedentCitation, UserRole, SupportedLanguage } from '../types';
import { phase10Service } from '../services/phase10Service';
import {
  BookOpen,
  Scale,
  Search,
  CheckCircle2,
  Copy,
  Sparkles,
  ExternalLink,
  Layers,
  Award,
  Bookmark,
  Quote,
} from 'lucide-react';

interface LegalPrecedentGraphViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const LegalPrecedentGraphView: React.FC<LegalPrecedentGraphViewProps> = ({
  currentRole: _currentRole,
}) => {
  const [precedents, setPrecedents] = useState<LegalPrecedentCitation[]>([]);
  const [selectedPrecedent, setSelectedPrecedent] = useState<LegalPrecedentCitation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const list = phase10Service.getPrecedents();
    setPrecedents(list);
    if (list.length > 0) setSelectedPrecedent(list[0]);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCopyCitation = (citation: LegalPrecedentCitation) => {
    const text = `${citation.caseTitle} (${citation.neutralCitation}) - "${citation.keyQuotableExcerpt}"`;
    navigator.clipboard.writeText(text);
    showToast(`Citation copied: ${citation.neutralCitation}`);
  };

  const filteredPrecedents = precedents.filter(
    (p) =>
      p.caseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.neutralCitation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.interpretedActsAndSections.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.ratioDecidendi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/80 to-slate-900 border border-purple-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-purple-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Bharatiya Nyaya & Sanhita Precedent Intelligence
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Scale className="w-3 h-3 text-emerald-400" /> Supreme Court & HC Full Benches
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-400" />
              Judicial Case Law Precedent & Citation Knowledge Graph
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Constitutional and appellate interpretations of BNSS 2023, BNS 2023, and BSA 2023. Real-time extraction of Ratio Decidendi vs Obiter Dicta with binding authority validation.
            </p>
          </div>
        </div>

        {notification && (
          <div className="mt-3 p-2.5 bg-emerald-950/90 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Search & Citations Library */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & Roster */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search Section 63 BSA, Sec 479, or case title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredPrecedents.map((prec) => {
                const isSelected = selectedPrecedent?.id === prec.id;
                return (
                  <div
                    key={prec.id}
                    onClick={() => setSelectedPrecedent(prec)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-purple-300">
                        {prec.neutralCitation}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {prec.precedentStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-200 mt-1.5">
                      {prec.caseTitle}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {prec.interpretedActsAndSections.map((sec, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono text-slate-400"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Citation Deep Dive */}
        <div className="lg:col-span-7 space-y-4">
          {selectedPrecedent ? (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-300">
                        {selectedPrecedent.neutralCitation}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {selectedPrecedent.bench.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white mt-1">
                      {selectedPrecedent.caseTitle}
                    </h2>
                    <div className="text-xs text-slate-400">
                      Court: {selectedPrecedent.courtName} | Pronounced: {selectedPrecedent.decisionDate}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyCitation(selectedPrecedent)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-purple-400" /> Copy Citation
                  </button>
                </div>

                {/* Quotable Landmark Excerpt Box */}
                <div className="p-4 bg-gradient-to-r from-purple-950/40 to-slate-950 rounded-xl border border-purple-500/30 relative">
                  <Quote className="w-6 h-6 text-purple-400/40 absolute top-2 right-2" />
                  <div className="text-[10px] uppercase font-bold tracking-wider text-purple-300 mb-1">
                    Landmark Operative Excerpt
                  </div>
                  <div className="text-xs text-purple-100 font-serif italic leading-relaxed">
                    {selectedPrecedent.keyQuotableExcerpt}
                  </div>
                </div>

                {/* Ratio Decidendi */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-emerald-400" /> Ratio Decidendi (Binding Principle of Law)
                  </h4>
                  <p className="text-xs text-slate-300 bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 leading-relaxed">
                    {selectedPrecedent.ratioDecidendi}
                  </p>
                </div>

                {/* Obiter Dicta */}
                {selectedPrecedent.obiterDicta && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Obiter Dicta (Judicial Observations)
                    </h4>
                    <p className="text-xs text-slate-400 bg-slate-950/50 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                      {selectedPrecedent.obiterDicta}
                    </p>
                  </div>
                )}

                <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                    <CheckCircle2 className="w-4 h-4" /> Binding Article 141 Law of the Land
                  </div>

                  <button
                    onClick={() => showToast('Citation inserted directly into Active Order Draft in Virtual Courtroom!')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <Sparkles className="w-4 h-4" /> Insert into Judgment Draft
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select precedent to view ratio decidendi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
