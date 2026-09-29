import React, { useState } from 'react';
import {
  SupportedLanguage,
  ESummonsRecord,
  EWarrantRecord,
  ProcessServiceStatus,
  CaseFile,
} from '../types';
import { icjsService } from '../services/icjsService';
import { storageService } from '../services/storageService';
import {
  Mail,
  QrCode,
  MapPin,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Send,
  Plus,
  Search,
  Shield,
  FileText,
  UserCheck,
  Building,
  Smartphone,
  Check,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface SummonsWarrantsViewProps {
  language: SupportedLanguage;
}

export const SummonsWarrantsView: React.FC<SummonsWarrantsViewProps> = ({ language: _language }) => {
  const [activeTab, setActiveTab] = useState<'summons' | 'warrants' | 'issue_summons' | 'issue_warrant'>('summons');
  const [summonsList, setSummonsList] = useState<ESummonsRecord[]>(icjsService.getSummons());
  const [warrantsList, setWarrantsList] = useState<EWarrantRecord[]>(icjsService.getWarrants());
  const [selectedSummons, setSelectedSummons] = useState<ESummonsRecord | null>(summonsList[0] || null);
  const [selectedWarrant, setSelectedWarrant] = useState<EWarrantRecord | null>(warrantsList[0] || null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');

  // Process Server Live Simulation State
  const [simulatingSummonsId, setSimulatingSummonsId] = useState<string | null>(null);
  const [geoLocName, setGeoLocName] = useState('Connaught Place, New Delhi');
  const [simAckType, setSimAckType] = useState<'DIGITAL_OTP' | 'BIOMETRIC_AADHAAR' | 'PROCESS_SERVER_AFFIXED'>('DIGITAL_OTP');

  // Issue Summons Form State
  const cases = storageService.getCases();
  const [formCaseNumber, setFormCaseNumber] = useState(cases[0]?.caseNumber || 'FIR-2026-CR-0982');
  const [formRecipientName, setFormRecipientName] = useState('');
  const [formRecipientType, setFormRecipientType] = useState<ESummonsRecord['recipientType']>('WITNESS');
  const [formMobile, setFormMobile] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formHearingDate, setFormHearingDate] = useState('2026-10-15 10:30 IST');
  const [formPurpose, setFormPurpose] = useState('Deposition and production of electronic records');
  const [formStatutorySection, setFormStatutorySection] = useState('Section 64 & 66 BNSS (Electronic Summons)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Issue Warrant Form State
  const [wFormCaseNumber, setWFormCaseNumber] = useState(cases[0]?.caseNumber || 'FIR-2026-CR-0982');
  const [wFormTargetPerson, setWFormTargetPerson] = useState('');
  const [wFormAlias, setWFormAlias] = useState('');
  const [wFormTargetAddress, setWFormTargetAddress] = useState('');
  const [wFormOffenseSummary, setWFormOffenseSummary] = useState('');
  const [wFormWarrantType, setWFormWarrantType] = useState<EWarrantRecord['warrantType']>('NON_BAILABLE_WARRANT');
  const [wFormAgency, setWFormAgency] = useState('Delhi Police - Special Cell (Cyber & Inter-State Operations)');
  const [wFormLookoutNotice, setWFormLookoutNotice] = useState(true);

  const handleSimulateGeoService = async (summonsId: string) => {
    setSimulatingSummonsId(summonsId);
    try {
      const updated = await icjsService.updateSummonsServiceGeo(
        summonsId,
        geoLocName,
        28.6315 + (Math.random() - 0.5) * 0.05,
        77.2167 + (Math.random() - 0.5) * 0.05,
        simAckType
      );
      setSummonsList([...icjsService.getSummons()]);
      if (updated && selectedSummons?.id === summonsId) {
        setSelectedSummons({ ...updated });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulatingSummonsId(null);
    }
  };

  const handleCreateSummons = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRecipientName.trim()) return;
    setIsSubmitting(true);
    try {
      const targetCase = cases.find((c) => c.caseNumber === formCaseNumber) || cases[0];
      const newSummons = await icjsService.issueESummons({
        caseNumber: formCaseNumber,
        courtName: targetCase?.courtName || 'Court of Chief Metropolitan Magistrate, New Delhi',
        issuedByJudge: 'Hon. Justice K. Ramanathan (CMM)',
        statutorySection: formStatutorySection,
        recipientType: formRecipientType,
        recipientName: formRecipientName,
        recipientContact: {
          mobile: formMobile || '+91-98110-00000',
          email: formEmail || 'recipient@justice.gov.in',
          address: formAddress || 'New Delhi, India',
        },
        hearingDate: formHearingDate,
        hearingPurpose: formPurpose,
        issueDate: new Date().toISOString().split('T')[0],
        dispatchMode: 'MULTI_CHANNEL_SECURE',
      });

      setSummonsList([...icjsService.getSummons()]);
      setSelectedSummons(newSummons);
      setActiveTab('summons');
      setFormRecipientName('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateWarrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wFormTargetPerson.trim()) return;
    setIsSubmitting(true);
    try {
      const targetCase = cases.find((c) => c.caseNumber === wFormCaseNumber) || cases[0];
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);

      const newWarrant = await icjsService.issueEWarrant({
        caseNumber: wFormCaseNumber,
        courtName: targetCase?.courtName || 'Court of Chief Metropolitan Magistrate, New Delhi',
        judgeName: 'Hon. Justice K. Ramanathan (CMM)',
        warrantType: wFormWarrantType,
        targetPersonName: wFormTargetPerson,
        targetAlias: wFormAlias || undefined,
        targetAddress: wFormTargetAddress || 'Address on record',
        offenseSummary: wFormOffenseSummary || 'BNS Penal Offenses under Trial',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: expiry.toISOString().split('T')[0],
        executingAgency: wFormAgency,
        lookoutNoticeIssued: wFormLookoutNotice,
      });

      setWarrantsList([...icjsService.getWarrants()]);
      setSelectedWarrant(newWarrant);
      setActiveTab('warrants');
      setWFormTargetPerson('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: ProcessServiceStatus) => {
    switch (status) {
      case 'SERVED_DIGITALLY_ACK':
      case 'SERVED_PHYSICALLY_GEO':
      case 'EXECUTED_ARRESTED':
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {status.replace(/_/g, ' ')}
          </span>
        );
      case 'OUT_FOR_PHYSICAL_SERVICE':
      case 'DISPATCHED_ELECTRONICALLY':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {status.replace(/_/g, ' ')}
          </span>
        );
      case 'REFUSED_AFFIXED':
      case 'FAILED_UNTRACEABLE':
        return (
          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-semibold flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" />
            {status.replace(/_/g, ' ')}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-slate-500/10 text-slate-400 border border-slate-500/30 text-[10px] font-mono">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Mail className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  Section 64–71 BNSS Electronic Summons & Warrant Hub
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                    STATUTORY DIGITAL PROCESS
                  </span>
                </h1>
                <p className="text-xs text-slate-300">
                  Automated Multi-Channel Electronic Service (WhatsApp, SMS, Handheld Geo-Tagging) & Inter-Court Warrant Execution
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('issue_summons')}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue e-Summons</span>
            </button>
            <button
              onClick={() => setActiveTab('issue_warrant')}
              className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue NBW Warrant</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 mt-5 gap-1">
          <button
            onClick={() => setActiveTab('summons')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'summons'
                ? 'bg-slate-800 text-amber-400 border-t-2 border-amber-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Electronic Summons Ledger ({summonsList.length})
          </button>
          <button
            onClick={() => setActiveTab('warrants')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'warrants'
                ? 'bg-slate-800 text-amber-400 border-t-2 border-amber-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Judicial Warrants & NBW Track ({warrantsList.length})
          </button>
          <button
            onClick={() => setActiveTab('issue_summons')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'issue_summons'
                ? 'bg-slate-800 text-amber-400 border-t-2 border-amber-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            + New e-Summons Dispatch
          </button>
          <button
            onClick={() => setActiveTab('issue_warrant')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'issue_warrant'
                ? 'bg-slate-800 text-amber-400 border-t-2 border-amber-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            + New Warrant Mandate
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'summons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Summons List */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Dispatched e-Summons ({summonsList.length})
              </h2>
              <span className="text-[11px] text-amber-400 font-mono">Sec 64 BNSS Compliant</span>
            </div>

            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {summonsList.map((s) => {
                const isSelected = selectedSummons?.id === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSummons(s)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/30 border-amber-500/50 shadow-lg'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-amber-300">{s.summonsNumber}</span>
                      {getStatusBadge(s.serviceStatus)}
                    </div>

                    <h3 className="text-sm font-semibold text-white">{s.recipientName}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 truncate">{s.hearingPurpose}</p>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px]">
                      <div>
                        <span className="text-slate-500 text-[10px]">Case Reference:</span>
                        <div className="font-mono text-slate-300">{s.caseNumber}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px]">Hearing Date:</span>
                        <div className="font-mono text-slate-200">{s.hearingDate}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summons Detail & Live Process Server Simulator */}
          <div className="lg:col-span-6">
            {selectedSummons ? (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Electronic Summons Certificate</span>
                    <h3 className="text-sm font-bold text-white font-mono">{selectedSummons.summonsNumber}</h3>
                  </div>
                  {getStatusBadge(selectedSummons.serviceStatus)}
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Issuing Court:</span>
                      <span className="font-semibold text-slate-200 text-right">{selectedSummons.courtName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Presiding Bench:</span>
                      <span className="text-slate-200">{selectedSummons.issuedByJudge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Statutory Authority:</span>
                      <span className="text-amber-400 font-mono text-[11px]">{selectedSummons.statutorySection}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 text-[10px]">Recipient ({selectedSummons.recipientType})</span>
                      <div className="font-semibold text-white mt-0.5">{selectedSummons.recipientName}</div>
                      <div className="text-[11px] text-slate-400">{selectedSummons.recipientContact.mobile}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">Hearing Schedule</span>
                      <div className="font-semibold text-amber-300 mt-0.5">{selectedSummons.hearingDate}</div>
                      <div className="text-[11px] text-slate-400 truncate">{selectedSummons.hearingPurpose}</div>
                    </div>
                  </div>

                  {/* Geolocation & Acknowledgement Status */}
                  {selectedSummons.gpsCoordinates ? (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <MapPin className="w-4 h-4" />
                        <span>Geo-Validated Service Proof (Sec 66 BNSS)</span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Location: <strong>{selectedSummons.gpsCoordinates.locationName}</strong>
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">
                        Lat/Lng: {selectedSummons.gpsCoordinates.latitude.toFixed(4)}, {selectedSummons.gpsCoordinates.longitude.toFixed(4)} (Accuracy: {selectedSummons.gpsCoordinates.accuracyMeters}m)
                      </div>
                      <div className="font-mono text-[10px] text-emerald-300 break-all">
                        Ack Signature: {selectedSummons.acknowledgementSignature}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                        <Smartphone className="w-4 h-4" />
                        <span>Process Server Handheld Simulation (Bailiff Field App)</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Simulate the process server serving the summons physically with GPS coordinates and OTP verification:
                      </p>

                      <div className="space-y-2">
                        <input
                          type="text"
                          value={geoLocName}
                          onChange={(e) => setGeoLocName(e.target.value)}
                          placeholder="Process Server Current GPS Location Name"
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs"
                        />
                        <div className="flex gap-2">
                          <select
                            value={simAckType}
                            onChange={(e) => setSimAckType(e.target.value as any)}
                            className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-slate-200 text-xs"
                          >
                            <option value="DIGITAL_OTP">Digital OTP Confirmed</option>
                            <option value="BIOMETRIC_AADHAAR">Aadhaar Biometric e-Sign</option>
                            <option value="PROCESS_SERVER_AFFIXED">Refused / Affixed on Door</option>
                          </select>
                          <button
                            onClick={() => handleSimulateGeoService(selectedSummons.id)}
                            disabled={simulatingSummonsId === selectedSummons.id}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-xs flex items-center gap-1 cursor-pointer"
                          >
                            {simulatingSummonsId === selectedSummons.id ? (
                              <span>Signing Geo-Proof...</span>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Record Geo-Service</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* QR & Merkle Proof */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[10px]">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>QR Verification Token:</span>
                      <span className="text-amber-400">{selectedSummons.qrVerificationCode}</span>
                    </div>
                    <div className="text-slate-500 truncate" title={selectedSummons.merkleProofHash}>
                      Merkle Proof: {selectedSummons.merkleProofHash}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
                Select an electronic summons from the list to view full statutory proof and transmission telemetry.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warrants Tab */}
      {activeTab === 'warrants' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Judicial Warrants ({warrantsList.length})
              </h2>
              <span className="text-[11px] text-rose-400 font-mono">Sec 70–81 BNSS</span>
            </div>

            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {warrantsList.map((w) => {
                const isSelected = selectedWarrant?.id === w.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWarrant(w)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-950/30 border-rose-500/50 shadow-lg'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-rose-400">{w.warrantNumber}</span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                        {w.warrantType.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white">{w.targetPersonName}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 truncate">{w.offenseSummary}</p>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px]">
                      <div>
                        <span className="text-slate-500 text-[10px]">Executing Agency:</span>
                        <div className="font-medium text-slate-300 truncate">{w.executingAgency}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px]">Lookout Notice (LOC):</span>
                        <div className="font-bold text-rose-400">
                          {w.lookoutNoticeIssued ? 'ACTIVATED (IMMIGRATION)' : 'NOT ISSUED'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Warrant Detail */}
          <div className="lg:col-span-6">
            {selectedWarrant ? (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-400">Judicial Mandate</span>
                    <h3 className="text-sm font-bold text-white font-mono">{selectedWarrant.warrantNumber}</h3>
                  </div>
                  {getStatusBadge(selectedWarrant.executionStatus)}
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Court of Record:</span>
                      <span className="font-semibold text-slate-200">{selectedWarrant.courtName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Issuing Judge:</span>
                      <span className="text-slate-200">{selectedWarrant.judgeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Valid Till:</span>
                      <span className="text-rose-400 font-mono">{selectedWarrant.expiryDate}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px]">Target Individual & Alias</span>
                    <div className="font-semibold text-white text-sm">
                      {selectedWarrant.targetPersonName} {selectedWarrant.targetAlias && `(${selectedWarrant.targetAlias})`}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{selectedWarrant.targetAddress}</div>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px]">Grounds & Offense Charge</span>
                    <div className="p-2.5 bg-slate-950 rounded border border-slate-800/80 text-slate-300 leading-relaxed">
                      {selectedWarrant.offenseSummary}
                    </div>
                  </div>

                  {selectedWarrant.lookoutNoticeIssued && (
                    <div className="p-3 bg-rose-950/30 border border-rose-500/40 rounded-lg flex items-center gap-2 text-rose-300 text-xs">
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                      <div>
                        <strong>Bureau of Immigration Lookout Circular (LOC) Active</strong>
                        <p className="text-[10px] text-rose-400/80">
                          Automatic red flag at all 37 International Air/Sea Ports and Land Border Checkpoints.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 text-[10px] font-mono">
                    <div className="text-slate-400">Tamper Seal Digest:</div>
                    <div className="text-amber-400 break-all">{selectedWarrant.tamperSealDigest}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
                Select a warrant to inspect statutory execution instructions and agency dispatch.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form: Issue e-Summons */}
      {activeTab === 'issue_summons' && (
        <form onSubmit={handleCreateSummons} className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Mail className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Issue Electronic Summons (Sec 64 & 66 BNSS)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Case Reference</label>
              <select
                value={formCaseNumber}
                onChange={(e) => setFormCaseNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.caseNumber}>
                    {c.caseNumber} - {c.title.substring(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Recipient Type</label>
              <select
                value={formRecipientType}
                onChange={(e) => setFormRecipientType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              >
                <option value="WITNESS">Witness / Deponent</option>
                <option value="ACCUSED">Accused Person</option>
                <option value="EXPERT_WITNESS">CFSL / Scientific Expert</option>
                <option value="DOCUMENT_CUSTODIAN">Bank / Tech Custodian</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Recipient Full Name & Designation</label>
              <input
                type="text"
                required
                value={formRecipientName}
                onChange={(e) => setFormRecipientName(e.target.value)}
                placeholder="e.g. Smt. Ananya Sen, Senior Forensic Analyst"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Mobile (SMS / WhatsApp Delivery)</label>
              <input
                type="text"
                value={formMobile}
                onChange={(e) => setFormMobile(e.target.value)}
                placeholder="+91-98765-43210"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Email Address</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="witness@org.gov.in"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Physical Address for Handheld Geo-Verification</label>
              <input
                type="text"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                placeholder="e.g. 42 Barakhamba Road, Connaught Place, New Delhi"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Hearing Schedule Date & Time</label>
              <input
                type="text"
                value={formHearingDate}
                onChange={(e) => setFormHearingDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Statutory Provision</label>
              <input
                type="text"
                value={formStatutorySection}
                onChange={(e) => setFormStatutorySection(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Deposition Purpose & Documents Required</label>
              <textarea
                rows={2}
                value={formPurpose}
                onChange={(e) => setFormPurpose(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('summons')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-amber-600/30 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Generating & Signing...' : 'Digitally Sign & Dispatch Summons'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Form: Issue Warrant */}
      {activeTab === 'issue_warrant' && (
        <form onSubmit={handleCreateWarrant} className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-bold text-white">Issue Judicial Warrant (Sec 70–81 BNSS)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Case Reference</label>
              <select
                value={wFormCaseNumber}
                onChange={(e) => setWFormCaseNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.caseNumber}>
                    {c.caseNumber} - {c.title.substring(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Warrant Classification</label>
              <select
                value={wFormWarrantType}
                onChange={(e) => setWFormWarrantType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-semibold text-rose-300"
              >
                <option value="NON_BAILABLE_WARRANT">Non-Bailable Warrant (NBW)</option>
                <option value="BAILABLE_WARRANT">Bailable Warrant (BW)</option>
                <option value="SEARCH_WARRANT">Search & Seizure Warrant</option>
                <option value="PRODUCTION_WARRANT">Production Warrant (Sec 294 BNSS)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Target Person / Entity Name</label>
              <input
                type="text"
                required
                value={wFormTargetPerson}
                onChange={(e) => setWFormTargetPerson(e.target.value)}
                placeholder="Full Name of Accused"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Known Aliases / Handles</label>
              <input
                type="text"
                value={wFormAlias}
                onChange={(e) => setWFormAlias(e.target.value)}
                placeholder="e.g. Vicky, GhostAdmin"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Target Residence / Premises</label>
              <input
                type="text"
                value={wFormTargetAddress}
                onChange={(e) => setWFormTargetAddress(e.target.value)}
                placeholder="Known Residential or Corporate Address"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Offense Narrative & Reasons for Non-Appearance</label>
              <textarea
                rows={2}
                value={wFormOffenseSummary}
                onChange={(e) => setWFormOffenseSummary(e.target.value)}
                placeholder="Describe statutory breach and repeated non-compliance with Section 64 summons..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2 p-3 bg-rose-950/20 border border-rose-500/30 rounded-lg">
              <input
                type="checkbox"
                id="locCheckbox"
                checked={wFormLookoutNotice}
                onChange={(e) => setWFormLookoutNotice(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded bg-slate-950 border-slate-700"
              />
              <label htmlFor="locCheckbox" className="text-xs text-rose-300 font-semibold">
                Issue Bureau of Immigration Lookout Circular (LOC) across all international ports of exit
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('warrants')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/30 cursor-pointer"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Signing Warrant...' : 'Affix Digital Seal & Dispatch NBW'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
