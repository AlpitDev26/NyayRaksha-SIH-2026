import React from 'react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import {
  LayoutDashboard,
  FolderOpen,
  FileSignature,
  Boxes,
  Microscope,
  Briefcase,
  Scale,
  ShieldCheck,
  Cpu,
  Sparkles,
  CheckCircle,
  Database,
  Lock,
  Network,
  Mail,
  TrendingUp,
  Archive,
  Gavel,
  Radio,
  Share2,
  Video,
  FileCheck,
  Building,
  HeartHandshake,
  ShieldAlert,
  Dna,
  UserCheck,
  Plane,
  Truck,
  Handshake,
  BookOpen,
  Activity,
  KeyRound,
  Coins,
  Heart,
  FolderLock,
  Globe,
  Server,
  Building2,
  Fingerprint,
  Award,
  Radiation,
  Anchor,
  AlertOctagon,
  Mic,
  Crosshair,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'iam_hierarchy'
  | 'crypto_pki'
  | 'hsm_ceremony'
  | 'quantum_dr_hub'
  | 'sc_full_court'
  | 'constitutional_collegium'
  | 'emergency_bench'
  | 'cases'
  | 'fir_desk'
  | 'investigation'
  | 'remand_orders'
  | 'transit_convoy'
  | 'eprisons_grid'
  | 'digital_panchnama'
  | 'evidence'
  | 'smart_lockers'
  | 'forensics'
  | 'autopsy_inquest'
  | 'nfsu_forensics'
  | 'cbrn_explosives'
  | 'voice_biometrics'
  | 'biometric_dna'
  | 'deepfake_forensics'
  | 'cyber_takedown'
  | 'chargesheet_generator'
  | 'organized_crime'
  | 'fiu_aml'
  | 'drone_radar'
  | 'maritime_surveillance'
  | 'juvenile_justice'
  | 'plea_bargaining'
  | 'preventive_detention'
  | 'prosecution'
  | 'courtroom'
  | 'virtual_courtroom'
  | 'bail_reckoner'
  | 'digital_bail_bond'
  | 'sentencing_reckoner'
  | 'witness_protection'
  | 'fugitive_hub'
  | 'mlat_extradition'
  | 'citizen_elocker'
  | 'icjs_grid'
  | 'summons_warrants'
  | 'crime_analytics'
  | 'legal_precedents'
  | 'judicial_kpi'
  | 'verifier'
  | 'blockchain'
  | 'bft_consensus_mesh'
  | 'ai_legal'
  | 'sovereign_audit';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  language: SupportedLanguage;
  pendingHearingsCount: number;
  unanchoredCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  language,
  pendingHearingsCount,
  unanchoredCount: _unanchoredCount,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const navItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: t.navDashboard, icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'iam_hierarchy', label: 'IAM & Organization Matrix', icon: <Lock className="w-4 h-4" /> },
    { id: 'crypto_pki', label: 'PKI & Crypto Vault', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'hsm_ceremony', label: 'Air-Gap HSM Key Ceremony (FIPS)', icon: <KeyRound className="w-4 h-4 text-cyan-400" /> },
    { id: 'quantum_dr_hub', label: 'Quantum-Safe Geo-DR Hub (FIPS 203)', icon: <Server className="w-4 h-4 text-cyan-300" /> },
    { id: 'sc_full_court', label: 'Supreme Court Full Court (Art 142)', icon: <Scale className="w-4 h-4 text-amber-300" /> },
    { id: 'constitutional_collegium', label: 'Constitutional Collegium (Art 124)', icon: <Award className="w-4 h-4 text-purple-400" /> },
    { id: 'emergency_bench', label: 'Constitutional Emergency & Sec 163', icon: <AlertOctagon className="w-4 h-4 text-red-400" /> },
    { id: 'cases', label: t.navCases, icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'fir_desk', label: 'Multilingual E-FIR Desk', icon: <FileSignature className="w-4 h-4" /> },
    { id: 'investigation', label: 'Investigation & Case Diary', icon: <Cpu className="w-4 h-4" /> },
    { id: 'remand_orders', label: 'Remand & Rojnamcha (Sec 187)', icon: <Gavel className="w-4 h-4 text-indigo-400" /> },
    { id: 'transit_convoy', label: 'Inter-State Transit Convoy (Sec 187(4))', icon: <Truck className="w-4 h-4 text-amber-400" /> },
    { id: 'eprisons_grid', label: 'ePrisons & Custody Liberty (Sec 479)', icon: <Building2 className="w-4 h-4 text-blue-400" /> },
    { id: 'digital_panchnama', label: 'Audio-Video Panchnama (Sec 105)', icon: <Video className="w-4 h-4 text-rose-400" /> },
    { id: 'evidence', label: t.navEvidence, icon: <Boxes className="w-4 h-4" /> },
    { id: 'smart_lockers', label: 'Smart Evidence RFID Grid', icon: <Boxes className="w-4 h-4 text-cyan-400" /> },
    { id: 'forensics', label: t.navForensics, icon: <Microscope className="w-4 h-4" /> },
    { id: 'autopsy_inquest', label: 'Medico-Legal Autopsy (Sec 194-196)', icon: <Activity className="w-4 h-4 text-rose-400" /> },
    { id: 'nfsu_forensics', label: 'NFSU Crime Scene Triage (Sec 176(3))', icon: <Dna className="w-4 h-4 text-teal-400" /> },
    { id: 'cbrn_explosives', label: 'CBRN & Explosives Lab (DRDO/NFSU)', icon: <Radiation className="w-4 h-4 text-red-400" /> },
    { id: 'voice_biometrics', label: 'Forensic Voice Biometrics (MFCC)', icon: <Mic className="w-4 h-4 text-violet-400" /> },
    { id: 'biometric_dna', label: 'Biometric DNA & NAFIS (CPID Act)', icon: <Fingerprint className="w-4 h-4 text-teal-300" /> },
    { id: 'deepfake_forensics', label: 'Deepfake & AI Media Forensics', icon: <Radio className="w-4 h-4 text-indigo-400" /> },
    { id: 'cyber_takedown', label: 'Cyber Takedown & 1930 NCRP (Sec 69A)', icon: <Globe className="w-4 h-4 text-red-400" /> },
    { id: 'chargesheet_generator', label: 'Charge-Sheet & Scrutiny (Sec 193)', icon: <FileCheck className="w-4 h-4 text-indigo-300" /> },
    { id: 'organized_crime', label: 'Organized Crime & Forfeiture (Sec 111)', icon: <ShieldAlert className="w-4 h-4 text-amber-400" /> },
    { id: 'fiu_aml', label: 'FIU-IND AML & Hawala Tracing (PMLA)', icon: <Coins className="w-4 h-4 text-amber-300" /> },
    { id: 'drone_radar', label: 'Anti-Drone Radar & UAPA (Sec 113)', icon: <Crosshair className="w-4 h-4 text-red-400" /> },
    { id: 'maritime_surveillance', label: 'Maritime & Coastal Radar Grid', icon: <Anchor className="w-4 h-4 text-blue-400" /> },
    { id: 'juvenile_justice', label: 'Juvenile Justice & POCSO (JJ Act)', icon: <Heart className="w-4 h-4 text-emerald-400" /> },
    { id: 'plea_bargaining', label: 'Plea Bargaining & MSD (Sec 289-300)', icon: <Handshake className="w-4 h-4 text-emerald-400" /> },
    { id: 'preventive_detention', label: 'Preventive Peace Bonds (Sec 125-135)', icon: <ShieldAlert className="w-4 h-4 text-amber-500" /> },
    { id: 'prosecution', label: t.navProsecution, icon: <Briefcase className="w-4 h-4" /> },
    {
      id: 'courtroom',
      label: t.navCourtroom,
      icon: <Scale className="w-4 h-4" />,
      badge: pendingHearingsCount > 0 ? pendingHearingsCount : undefined,
    },
    { id: 'virtual_courtroom', label: 'Live Virtual Trial Deck (Sec 530)', icon: <Gavel className="w-4 h-4 text-amber-400" /> },
    { id: 'bail_reckoner', label: 'Bail Reckoner & Liberty (Sec 479)', icon: <Scale className="w-4 h-4 text-emerald-400" /> },
    { id: 'digital_bail_bond', label: 'Digital Bail Bond & Surety (Sec 480)', icon: <FileSignature className="w-4 h-4 text-emerald-400" /> },
    { id: 'sentencing_reckoner', label: 'Sentencing & Restitution (Sec 395)', icon: <HeartHandshake className="w-4 h-4 text-emerald-300" /> },
    { id: 'witness_protection', label: 'Witness Protection (Sec 398)', icon: <UserCheck className="w-4 h-4 text-indigo-400" /> },
    { id: 'fugitive_hub', label: 'Fugitive & Asset Forfeiture (Sec 84/107)', icon: <ShieldAlert className="w-4 h-4 text-amber-400" /> },
    { id: 'mlat_extradition', label: 'MLAT & Extradition (Sec 111-114)', icon: <Plane className="w-4 h-4 text-blue-400" /> },
    { id: 'citizen_elocker', label: 'Citizen E-Locker & BSA 63 Vault', icon: <FolderLock className="w-4 h-4 text-blue-400" /> },
    { id: 'icjs_grid', label: 'ICJS 2.0 Sovereign Grid', icon: <Network className="w-4 h-4" /> },
    { id: 'summons_warrants', label: 'e-Summons & Warrants (Sec 64)', icon: <Mail className="w-4 h-4" /> },
    { id: 'crime_analytics', label: 'Crime Analytics & Clocks (Sec 187)', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'legal_precedents', label: 'Supreme Court Precedent Graph', icon: <BookOpen className="w-4 h-4 text-purple-400" /> },
    { id: 'judicial_kpi', label: 'National Judicial KPI & NJDG 3.0', icon: <TrendingUp className="w-4 h-4 text-amber-400" /> },
    { id: 'verifier', label: t.navVerifier, icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'blockchain', label: t.navBlockchain, icon: <Database className="w-4 h-4" /> },
    { id: 'bft_consensus_mesh', label: 'BFT Consensus & DR Mesh', icon: <Share2 className="w-4 h-4 text-cyan-400" /> },
    { id: 'ai_legal', label: t.navAiLegal, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'sovereign_audit', label: 'Audit, Redact & Archival', icon: <Archive className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-80px)]">
      {/* Navigation List */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Justice & Investigation Lifecycle
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                isActive
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className={isActive ? 'text-amber-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="text-[11px] font-mono tabular-nums text-amber-400 font-semibold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sovereign Node & Security Status Footer */}
      <div className="mt-auto p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="px-2 py-1.5 text-[11px] text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Storage Node</span>
            </span>
            <span className="font-mono text-[10px] text-emerald-400">AES-256-GCM</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Hash Standard</span>
            <span className="font-mono text-[10px] text-slate-300">FIPS 180-4 (SHA-256)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Digital Signatures</span>
            <span className="font-mono text-[10px] text-slate-300">PKI / Sec 63 BSA</span>
          </div>
          <div className="pt-1 border-t border-slate-800/60 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Sovereign Node v3.4</span>
            <span className="text-emerald-500">Node Sync OK</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
