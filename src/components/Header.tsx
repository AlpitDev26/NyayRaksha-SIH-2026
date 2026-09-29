import React from 'react';
import { UserRole, SupportedLanguage } from '../types';
import { TRANSLATIONS, LANGUAGE_LABELS } from '../services/i18n';
import { Shield, Globe, Lock, Search, RefreshCw, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenVerifier: () => void;
  onOpenNewFir: () => void;
  chainValid: boolean;
  onRunAudit: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  onOpenVerifier,
  onOpenNewFir,
  chainValid,
  onRunAudit,
  searchQuery,
  onSearchChange,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const roleLabels: Record<UserRole, string> = {
    investigating_officer: t.roleInvestigatingOfficer,
    forensic_examiner: t.roleForensicExaminer,
    public_prosecutor: t.rolePublicProsecutor,
    judicial_magistrate: t.roleJudicialMagistrate,
    court_registrar: t.roleCourtRegistrar,
    sovereign_auditor: t.roleSovereignAuditor,
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800/80 backdrop-blur-md">
      {/* Top Banner Notice */}
      <div className="bg-slate-950/80 px-4 py-1 text-xs border-b border-slate-800/50 flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-amber-400">GOVERNMENT OF INDIA</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{t.govHeader}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono text-emerald-400">SHA-256 + ECDSA + Merkle Ledger</span>
        </div>
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={onRunAudit}
            className={`flex items-center gap-1.5 font-mono text-xs cursor-pointer hover:underline ${
              chainValid ? 'text-emerald-400' : 'text-red-400 font-bold'
            }`}
          >
            {chainValid ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ledger Integrity: Verified</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>Tamper Alert Detected</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 overflow-hidden shadow-sm">
            <img
              src="/src/assets/images/national_justice_emblem_1790520809737.jpg"
              alt="National Justice Emblem"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback icon container
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <Shield className="w-5 h-5 text-amber-400 shrink-0" />
          </div>
          <div>
            <span className="text-base lg:text-lg font-bold tracking-tight text-white font-serif flex items-center gap-1.5">
              NyayRaksha
              <span className="text-xs font-normal text-amber-300/80 hidden sm:inline font-sans">
                न्यायरक्षा | {t.appSubtitle}
              </span>
            </span>
          </div>
        </div>

        {/* Zone 2: Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-700/70 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/70 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Zone 3: Actions & Role / Language Selection */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="pl-7 pr-2 py-1.5 text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-md focus:outline-none focus:border-amber-500 cursor-pointer transition-colors"
            >
              {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGE_LABELS[lang].native} ({LANGUAGE_LABELS[lang].name})
                </option>
              ))}
            </select>
          </div>

          {/* Role Switcher */}
          <div className="relative flex items-center">
            <Lock className="w-3.5 h-3.5 text-amber-400 absolute left-2 pointer-events-none" />
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="pl-7 pr-2 py-1.5 text-xs bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/30 rounded-md focus:outline-none focus:border-amber-400 cursor-pointer font-medium transition-colors"
              title="Active Sovereign Security Role"
            >
              <option value="investigating_officer">👮 IO / Police Inspector</option>
              <option value="forensic_examiner">🔬 FSL / Cyber Examiner</option>
              <option value="public_prosecutor">⚖️ Public Prosecutor</option>
              <option value="judicial_magistrate">🏛️ Judicial Magistrate</option>
              <option value="court_registrar">📋 Court Registrar</option>
              <option value="sovereign_auditor">🛡️ System Auditor</option>
            </select>
          </div>

          {/* Quick Action Button: New FIR */}
          <button
            onClick={onOpenNewFir}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.btnNewFir}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
