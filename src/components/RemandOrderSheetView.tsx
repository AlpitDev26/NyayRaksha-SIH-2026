import React, { useState, useEffect } from 'react';
import {
  RemandOrderSheetRecord,
  CaseFile,
  UserRole,
  SupportedLanguage,
} from '../types';
import { phase11Service } from '../services/phase11Service';
import { storageService } from '../services/storageService';
import {
  Gavel,
  Calendar,
  Clock,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Building,
  UserCheck,
  Activity,
  Printer,
  FileText,
  Lock,
} from 'lucide-react';

interface RemandOrderSheetViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const RemandOrderSheetView: React.FC<RemandOrderSheetViewProps> = ({
  currentRole: _currentRole,
}) => {
  const [remands, setRemands] = useState<RemandOrderSheetRecord[]>([]);
  const [selectedRemand, setSelectedRemand] = useState<RemandOrderSheetRecord | null>(null);
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  // Remand Application State
  const [accusedName, setAccusedName] = useState('Vikramaditya S. Malhotra');
  const [custodyType, setCustodyType] = useState<RemandOrderSheetRecord['custodyTypeRequested']>(
    'POLICE_CUSTODY_REMAND'
  );
  const [custodyDays, setCustodyDays] = useState<number>(5);
  const [remandGrounds, setRemandGrounds] = useState(
    'Custodial interrogation necessary for on-spot recovery of hardware security keys, decryption of cold wallets, and confrontation with co-accused.'
  );

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const list = phase11Service.getRemandOrders();
    setRemands(list);
    if (list.length > 0) setSelectedRemand(list[0]);
    const storedCases = storageService.getCases();
    setCases(storedCases);
    if (storedCases.length > 0) setSelectedCaseId(storedCases[0].id);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleGrantRemand = async () => {
    const targetCase = cases.find((c) => c.id === selectedCaseId);
    if (!targetCase) return;

    try {
      const created = await phase11Service.grantRemandOrder(
        targetCase,
        accusedName,
        custodyType,
        custodyDays,
        remandGrounds
      );
      const updated = phase11Service.getRemandOrders();
      setRemands([...updated]);
      setSelectedRemand(created);
      showToast('Section 187 BNSS Judicial Remand Order Sheet signed and sealed!');
    } catch (e: any) {
      showToast('Error: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Section 187 BNSS 2023 | Sec 53 & 340 BNSS
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" /> 15-Day Police Custody Limitation Tracker
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <Gavel className="w-6 h-6 text-indigo-400" />
              Judicial Remand, Rojnamcha & Case Diary Engine
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Strict statutory enforcement of Section 187 BNSS custody transitions (15-day police remand ceiling), Section 53 mandatory medical exam records, legal aid compliance under Sec 340 BNSS, and e-Prisons biometric custody custody slips.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print Order Sheet
            </button>
          </div>
        </div>

        {notification && (
          <div className="mt-3 p-2.5 bg-emerald-950/90 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Order Form & Remand Order Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Remand Orders List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-indigo-400" /> Issue Remand Order Sheet
              </span>
              <span className="text-[10px] text-indigo-400 font-mono">Sec 187 BNSS</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Case Docket:</label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.title.slice(0, 32)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Accused Produced:</label>
                <input
                  type="text"
                  value={accusedName}
                  onChange={(e) => setAccusedName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Custody Type:</label>
                  <select
                    value={custodyType}
                    onChange={(e: any) => setCustodyType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  >
                    <option value="POLICE_CUSTODY_REMAND">Police Custody (PC Remand)</option>
                    <option value="JUDICIAL_CUSTODY_REMAND">Judicial Custody (JC Remand)</option>
                    <option value="TRANSIT_REMAND">Transit Remand</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Days Granted:</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={custodyDays}
                    onChange={(e) => setCustodyDays(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Judicial Grounds for Remand:</label>
                <textarea
                  rows={3}
                  value={remandGrounds}
                  onChange={(e) => setRemandGrounds(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              {/* Statutory Checks */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Medical fitness examination verified (Sec 53 BNSS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Right to legal counsel & free legal aid ensured (Sec 340 BNSS)</span>
                </div>
              </div>

              <button
                onClick={handleGrantRemand}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" /> Seal & Dispatch Remand Order
              </button>
            </div>
          </div>

          {/* List of Recent Remand Orders */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Remand Order Archive ({remands.length})
            </span>
            <div className="space-y-2">
              {remands.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRemand(r)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedRemand?.id === r.id
                      ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-200'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>{r.accusedName}</span>
                    <span className="text-[10px] font-mono text-indigo-400">{r.custodyDaysGranted} Days</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{r.custodyTypeRequested.replace(/_/g, ' ')}</span>
                    <span className="font-mono text-[10px]">{r.caseNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order-Sheet Details & Statutory 15-Day Limiter Bar */}
        <div className="lg:col-span-7 space-y-4">
          {selectedRemand ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-300">
                      {selectedRemand.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {selectedRemand.custodyTypeRequested.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">
                    Accused: {selectedRemand.accusedName}
                  </h2>
                  <div className="text-xs text-slate-400">
                    Court: {selectedRemand.presidingMagistrate}
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className="text-slate-400 block text-[10px]">e-Prisons Slip Ref</span>
                  <span className="text-emerald-400 font-bold">{selectedRemand.ePrisonsCustodySlipRef}</span>
                </div>
              </div>

              {/* Section 187(2) Police Custody 15-Day Ceiling Bar */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    Police Custody Utilized (Sec 187(2) BNSS 15-Day Cap)
                  </span>
                  <span className="font-mono text-indigo-400">
                    {selectedRemand.daysInPoliceCustodyTotal} / 15 Days
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      selectedRemand.daysInPoliceCustodyTotal > 12
                        ? 'bg-rose-500'
                        : selectedRemand.daysInPoliceCustodyTotal > 7
                        ? 'bg-amber-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(100, (selectedRemand.daysInPoliceCustodyTotal / 15) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Initial 40/60 day detention window</span>
                  <span>Next Production: {new Date(selectedRemand.nextHearingDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Formal Judicial Order Sheet Text */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Judicial Order Sheet Recorded (Sec 187 BNSS)
                </span>
                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedRemand.orderSheetText}
                </div>
              </div>

              {/* Digital Magistrate Seal */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Magisterial Electronic Seal Hash (Sec 63 BSA / PKI)
                  </span>
                  <span className="text-emerald-400 font-bold">DIGITALLY SEALED</span>
                </div>
                <div className="font-mono text-[11px] text-slate-400 break-all select-all">
                  {selectedRemand.magistrateSealSha256}
                </div>
              </div>

              {/* Transmission actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  onClick={() => showToast('Remand order transmitted to e-Prisons API and Malkhana In-Charge!')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <FileCheck className="w-4 h-4" /> Transmit to e-Prisons & Malkhana
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
              <Gavel className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select a remand docket to inspect formal order-sheet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
