import React, { useState, useEffect } from 'react';
import { PreventivePeaceBondRecord, UserRole, SupportedLanguage } from '../types';
import { phase9Service } from '../services/phase9Service';
import {
  ShieldAlert,
  Gavel,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  FileText,
  Radio,
  MapPin,
  Clock,
  Send,
  Sparkles,
  Users,
  Search,
} from 'lucide-react';

interface PreventiveDetentionViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const PreventiveDetentionView: React.FC<PreventiveDetentionViewProps> = ({
  currentRole: _currentRole,
}) => {
  const [bonds, setBonds] = useState<PreventivePeaceBondRecord[]>([]);
  const [selectedBond, setSelectedBond] = useState<PreventivePeaceBondRecord | null>(null);

  // Form State
  const [respondentName, setRespondentName] = useState('Kallu @ Kuldeep Pehalwan');
  const [aliases, setAliases] = useState('Kallu Shooter, Kuldeep Gujjar');
  const [age, setAge] = useState<number>(38);
  const [address, setAddress] = useState('Village Mandawali, Near Primary School, East Delhi');
  const [policeStation, setPoliceStation] = useState('PS Mandawali, East District');
  const [district, setDistrict] = useState('East District, Delhi');
  const [bnssSection, setBnssSection] = useState<PreventivePeaceBondRecord['bnssSection']>(
    'SEC_129_HABITUAL_OFFENDERS'
  );
  const [threatDescription, setThreatDescription] = useState(
    'Habitual extortion and intimidation of local merchants and tender bidders. Immediate breach of public tranquility anticipated.'
  );
  const [bondAmount, setBondAmount] = useState<number>(250000);
  const [periodMonths, setPeriodMonths] = useState<number>(36);
  const [suretiesCount, setSuretiesCount] = useState<number>(2);
  const [magistrateName, setMagistrateName] = useState('Sh. Arvind Nambiar, IAS (Sub-Divisional Magistrate)');
  const [geoFenceKm, setGeoFenceKm] = useState<number>(5.0);

  const [notification, setNotification] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    const list = phase9Service.getPeaceBonds();
    setBonds(list);
    if (list.length > 0) setSelectedBond(list[0]);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreatePeaceBond = async () => {
    try {
      const aliasArray = aliases.split(',').map((a) => a.trim()).filter(Boolean);
      const created = await phase9Service.createPreventivePeaceBond(
        respondentName,
        aliasArray,
        age,
        address,
        policeStation,
        district,
        bnssSection,
        threatDescription,
        bondAmount,
        periodMonths,
        suretiesCount,
        magistrateName,
        geoFenceKm
      );
      setBonds([...phase9Service.getPeaceBonds()]);
      setSelectedBond(created);
      showToast(`Section ${bnssSection.replace(/[^0-9]/g, '')} BNSS Show Cause Notice Issued by Executive Magistrate!`);
    } catch (e: any) {
      showToast('Error: ' + e.message);
    }
  };

  const filteredBonds = bonds.filter(
    (b) =>
      b.respondentName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.caseNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.policeStation.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/80 to-slate-900 border border-amber-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-amber-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Chapter VIII BNSS 2023 (Sections 125–135)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Gavel className="w-3 h-3 text-emerald-400" /> Executive Magistrate Grid
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
              Preventive Detention & Peace Bonds (Sec 125–135 BNSS)
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Executive magistrate jurisdiction for security for keeping peace (Sec 126), good behaviour from habitual offenders (Sec 129), show-cause notices (Sec 130), and geo-fenced police station reporting rosters.
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

      {/* Main Grid: Peace Bond Creator & Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Archive */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-400" /> Issue Section 130 Show Cause Notice
              </span>
              <span className="text-[10px] text-amber-400 font-mono">Sec 125-135 BNSS</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Respondent Full Name:</label>
                  <input
                    type="text"
                    value={respondentName}
                    onChange={(e) => setRespondentName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Age:</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Aliases & Pseudonyms:</label>
                <input
                  type="text"
                  value={aliases}
                  onChange={(e) => setAliases(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">BNSS Chapter VIII Provision:</label>
                <select
                  value={bnssSection}
                  onChange={(e: any) => setBnssSection(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                >
                  <option value="SEC_129_HABITUAL_OFFENDERS">Sec 129 - Security for Good Behaviour from Habitual Offenders (3 Yrs)</option>
                  <option value="SEC_126_BREACH_OF_PEACE">Sec 126 - Security for Keeping Peace in Other Cases (1 Yr)</option>
                  <option value="SEC_127_SEDITIOUS_MATTERS">Sec 127 - Security from Persons Disseminating Seditious Matters (1 Yr)</option>
                  <option value="SEC_128_VAGRANTS_SUSPECTS">Sec 128 - Security from Suspected Persons / Vagrants (1 Yr)</option>
                  <option value="SEC_125_CONVICTION">Sec 125 - Security for Keeping Peace on Conviction (3 Yrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Grounds & Threat Description:</label>
                <textarea
                  rows={2}
                  value={threatDescription}
                  onChange={(e) => setThreatDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Bond Amount (₹):</label>
                  <input
                    type="number"
                    step={25000}
                    value={bondAmount}
                    onChange={(e) => setBondAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Period (Months):</label>
                  <input
                    type="number"
                    value={periodMonths}
                    onChange={(e) => setPeriodMonths(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Sureties Required:</label>
                  <input
                    type="number"
                    value={suretiesCount}
                    onChange={(e) => setSuretiesCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Geo-Fence Radius (Km):</label>
                  <input
                    type="number"
                    step={0.5}
                    value={geoFenceKm}
                    onChange={(e) => setGeoFenceKm(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleCreatePeaceBond}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200" /> Issue Show-Cause & Formulate Peace Bond
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Peace Bonds & Geographic Surveillance */}
        <div className="lg:col-span-7 space-y-4">
          {selectedBond ? (
            <div className="space-y-4">
              {/* Executive Magistrate Order Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-300">
                        {selectedBond.caseNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {selectedBond.inquiryStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white mt-1">
                      {selectedBond.respondentName} (Age: {selectedBond.age})
                    </h2>
                    <div className="text-xs text-slate-400">
                      Aliases: {selectedBond.aliasList.join(', ')} | Jurisdiction: {selectedBond.jurisdictionDistrict}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Security Bond Amount</span>
                    <span className="text-base font-bold font-mono text-amber-400">
                      ₹{selectedBond.bondAmountRupees.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Section Specific Tag */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">Statutory Provision:</span>
                    <div className="text-slate-300 mt-0.5">
                      {selectedBond.bnssSection.replace(/_/g, ' ')} ({selectedBond.bondPeriodMonths} Months Period)
                    </div>
                  </div>
                  <div className="text-right font-mono text-[11px] text-slate-400">
                    <div>Notice Ref: {selectedBond.showCauseNoticeRef}</div>
                    <div className="text-emerald-400">Sureties: {selectedBond.suretiesVerifiedCount} / {selectedBond.suretiesRequiredCount} Verified</div>
                  </div>
                </div>

                {/* Threat Summary */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Grounds of Threat to Public Tranquility (Sec 130 BNSS)
                  </h4>
                  <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-slate-800 leading-relaxed">
                    {selectedBond.threatDescription}
                  </p>
                </div>

                {/* Geographic Geo-Fencing & Reporting Protocol */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" /> Geo-Fenced Containment Zone
                    </div>
                    <div className="text-slate-400">
                      Max Movement: {selectedBond.geoFencedRadiusKm} Km radius from {selectedBond.address}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> Mandatory Police Station Roster
                    </div>
                    <div className="text-slate-400">
                      {selectedBond.mandatoryReportingSchedule || 'Weekly check-in'}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-slate-500">
                    Magistrate: {selectedBond.executiveMagistrateName}
                  </div>

                  <button
                    onClick={() => showToast('Section 130 Notice transmitted to Police Station for immediate physical service!')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Dispatch Notice to PS
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
              <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select peace bond record or issue a new show-cause notice.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
