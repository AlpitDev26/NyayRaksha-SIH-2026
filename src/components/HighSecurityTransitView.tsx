import React, { useState } from 'react';
import {
  Truck,
  ShieldAlert,
  Clock,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Send,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { phase14Service } from '../services/phase14Service';
import { HighSecurityTransitRecord } from '../types';

export const HighSecurityTransitView: React.FC = () => {
  const [transits, setTransits] = useState<HighSecurityTransitRecord[]>(phase14Service.getTransitRecords());
  const [selectedTransit, setSelectedTransit] = useState<HighSecurityTransitRecord>(transits[0] || null);
  const [isNewTransitModalOpen, setIsNewTransitModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [prisonerName, setPrisonerName] = useState<string>('Vikramaditya @ Vicky Shooter (Category-A Gangster)');
  const [category, setCategory] = useState<
    'CATEGORY_A_TERROR_SYNDICATE' | 'CATEGORY_B_HEINOUS_CRIMINAL' | 'CATEGORY_C_STANDARD_UNDER_TRIAL'
  >('CATEGORY_A_TERROR_SYNDICATE');
  const [originJail, setOriginJail] = useState<string>('Central Jail No. 2, Tihar, New Delhi');
  const [destination, setDestination] = useState<string>('Special NIA Court / Central Jail, Patiala, Punjab');
  const [battalion, setBattalion] = useState<string>('5th Bn CISF Armed Tactical Escort Group');
  const [commander, setCommander] = useState<string>('Dy. Commandant Suresh R. Meena');
  const [guardsCount, setGuardsCount] = useState<number>(20);
  const [vehicleReg, setVehicleReg] = useState<string>('DL-1C-ZZ-8800 (BR6 Bullet-Proof Armored Transport)');
  const [borderStation, setBorderStation] = useState<string>('Haryana-Punjab Inter-State Border Post, Shambhu');

  const handleCreateTransit = async (e: React.FormEvent) => {
    e.preventDefault();
    const departure = new Date().toISOString();
    const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const created = await phase14Service.createTransitRecord({
      prisonerName,
      prisonerCategory: category,
      originJailFacility: originJail,
      destinationCourtOrPrison: destination,
      escortBattalionName: battalion,
      escortCommanderOfficer: commander,
      armedGuardsCount: Number(guardsCount),
      vehicleRegistrationNumber: vehicleReg,
      gpsTelemetryLiveStatus: 'IN_TRANSIT_ON_ROUTE',
      departureTimestamp: departure,
      statutory24HrDeadlineTimestamp: deadline,
      borderHandoverPoliceStation: borderStation,
      transitRemandMagistrateOrderSha256: '9f8e7d6c5b4a3210fedcba0987654321fedcba0987654321fedcba0987654321',
    });

    const updated = phase14Service.getTransitRecords();
    setTransits(updated);
    setSelectedTransit(created);
    setIsNewTransitModalOpen(false);
    setToastMessage(`Inter-State High-Security Transit Pass #${created.transitPassId} generated with 24-hr statutory clock`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTriggerSOS = () => {
    if (!selectedTransit) return;
    phase14Service.triggerTransitSOS(selectedTransit.transitPassId);
    setTransits(phase14Service.getTransitRecords());
    setToastMessage(`CRITICAL ALERT: Emergency Armed Escort SOS Broadcast dispatched to Inter-State Police QRT Network`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border border-amber-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Truck className="w-48 h-48 text-amber-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded uppercase tracking-wider">
                Sec 187(4) BNSS Transit Clock
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/40 rounded uppercase tracking-wider">
                Article 22(2) Constitution of India
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Truck className="w-6 h-6 text-amber-400" />
              High-Security Inter-State Transit & Convoy Telemetry Grid
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time monitoring of high-risk prisoner inter-state transit, mandatory 24-hour journey exclusion production
              limit under Section 187(4) BNSS, GPS convoy telemetry, and armed Quick Reaction Team (QRT) panic dispatch.
            </p>
          </div>

          <button
            onClick={() => setIsNewTransitModalOpen(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Inter-State Transit Pass</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-amber-950/90 border border-amber-500/60 text-amber-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-amber-300 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Transit Convoys */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-amber-400" />
              Active High-Security Convoys ({transits.length})
            </h2>
          </div>

          <div className="space-y-3">
            {transits.map((transit) => {
              const isSelected = selectedTransit?.transitPassId === transit.transitPassId;
              const isSOS = transit.gpsTelemetryLiveStatus === 'SOS_EMERGENCY_TRIGGERED';

              return (
                <div
                  key={transit.transitPassId}
                  onClick={() => setSelectedTransit(transit)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? isSOS
                        ? 'bg-red-950/60 border-red-500 ring-2 ring-red-500/50 shadow-xl'
                        : 'bg-slate-900 border-amber-500/60 ring-1 ring-amber-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-amber-400">{transit.transitPassId}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        isSOS
                          ? 'bg-red-500/30 text-red-200 border-red-500 animate-pulse'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {transit.gpsTelemetryLiveStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1">{transit.prisonerName}</div>
                  <div className="text-xs text-slate-400 mb-2">{transit.escortBattalionName}</div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">24-Hr Production Due:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {new Date(transit.statutory24HrDeadlineTimestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Convoy Telemetry & Tactical Control */}
        {selectedTransit && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                    {selectedTransit.prisonerCategory.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{selectedTransit.prisonerName}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Escort Commander:{' '}
                    <span className="text-slate-200 font-semibold">{selectedTransit.escortCommanderOfficer}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTriggerSOS}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-red-900/40"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Trigger Convoy SOS Alarm</span>
                  </button>
                </div>
              </div>

              {/* Transit Path Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Origin Detention Center</div>
                  <div className="text-xs font-semibold text-white mt-1">{selectedTransit.originJailFacility}</div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Departed: {new Date(selectedTransit.departureTimestamp).toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Destination Court / Prison</div>
                  <div className="text-xs font-semibold text-white mt-1">{selectedTransit.destinationCourtOrPrison}</div>
                  <div className="text-[10px] text-amber-400 mt-1">
                    24-Hr Expiry: {new Date(selectedTransit.statutory24HrDeadlineTimestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Escort & Tactical Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Armed Battalion & Armored Carrier
                  </h4>
                  <span className="text-xs font-mono text-amber-300">{selectedTransit.armedGuardsCount} Armed Guards</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400">Tactical Carrier:</span>
                    <div className="font-semibold text-white mt-0.5">{selectedTransit.vehicleRegistrationNumber}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Border Handover Station:</span>
                    <div className="font-semibold text-white mt-0.5">{selectedTransit.borderHandoverPoliceStation}</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Section 187(4) BNSS Statutory Compliance
                  </h4>
                  <span className="text-xs text-emerald-400 font-semibold">Mandatory 24-Hr Lock</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  The time necessary for journey from place of arrest to the Magistrate Court is excluded from the 24-hour
                  period under Section 187(4) BNSS and Article 22(2). Automatic judicial timestamp logs prevent illegal
                  transit detentions.
                </p>
              </div>
            </div>

            {/* Cryptographic Handover Proof */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Inter-State Biometric Handover Cryptographic Pass
                </h4>
                <span className="text-[11px] font-mono text-emerald-400">SHA-256</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-amber-400 break-all">
                {selectedTransit.biometricHandoverPassHash}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: New Transit Pass */}
      {isNewTransitModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                Issue High-Security Inter-State Transit Pass
              </h3>
              <button
                onClick={() => setIsNewTransitModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateTransit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Prisoner Name & Aliases</label>
                <input
                  type="text"
                  required
                  value={prisonerName}
                  onChange={(e) => setPrisonerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Security Category</label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as
                        | 'CATEGORY_A_TERROR_SYNDICATE'
                        | 'CATEGORY_B_HEINOUS_CRIMINAL'
                        | 'CATEGORY_C_STANDARD_UNDER_TRIAL'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="CATEGORY_A_TERROR_SYNDICATE">Category-A: Terror / Underworld Syndicate</option>
                  <option value="CATEGORY_B_HEINOUS_CRIMINAL">Category-B: Heinous Convict / Violent Offender</option>
                  <option value="CATEGORY_C_STANDARD_UNDER_TRIAL">Category-C: Standard Undertrial Prisoner</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Origin Facility</label>
                  <input
                    type="text"
                    required
                    value={originJail}
                    onChange={(e) => setOriginJail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Destination Court/Jail</label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Escort Battalion & Commander</label>
                <input
                  type="text"
                  required
                  value={battalion}
                  onChange={(e) => setBattalion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTransitModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Sign & Authorize Convoy Departure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
