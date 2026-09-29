import React, { useState } from 'react';
import {
  Anchor,
  Compass,
  Radio,
  ShieldCheck,
  Building,
  CheckCircle2,
  FileCheck2,
  Plus,
  Send,
  Lock,
  Coins,
} from 'lucide-react';
import { phase14Service } from '../services/phase14Service';
import { MaritimeCoastalSurveillanceRecord } from '../types';

export const MaritimeCoastalSurveillanceView: React.FC = () => {
  const [records, setRecords] = useState<MaritimeCoastalSurveillanceRecord[]>(phase14Service.getMaritimeRecords());
  const [selectedRecord, setSelectedRecord] = useState<MaritimeCoastalSurveillanceRecord>(records[0] || null);
  const [isNewInterceptionModalOpen, setIsNewInterceptionModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [vesselName, setVesselName] = useState<string>('Al-Najm-III (High-Speed Stateless Dhow)');
  const [vesselType, setVesselType] = useState<
    'UNREGISTERED_SPEED_DHOW' | 'MERCHANT_CARGO_VESSEL' | 'TRAWLER_UNAUTHORIZED_EEZ'
  >('UNREGISTERED_SPEED_DHOW');
  const [contrabandDesc, setContrabandDesc] = useState<string>(
    'Commercial Grade Synthetic Narcotics (MDMA 200 kg & Meth 150 kg)'
  );
  const [contrabandValue, setContrabandValue] = useState<number>(1750000000);
  const [crewCount, setCrewCount] = useState<number>(5);
  const [coastalStation, setCoastalStation] = useState<string>(
    'Porbandar Coastal Marine Police Station, Gujarat'
  );
  const [sector, setSector] = useState<string>('Kathiawar Coastline Sector 2 (Porbandar Deep Sea)');

  const handleCreateInterception = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await phase14Service.createMaritimeRecord({
      vesselNameOrCallsign: vesselName,
      vesselType,
      flagState: 'UNFLAGGED_SUSPECT_VESSEL',
      gpsCoordinates: {
        latitude: 21.6421,
        longitude: 69.5812,
        nauticalMilesFromShore: 38.0,
        coastalSector: sector,
      },
      interceptingUnit: 'INDIAN_COAST_GUARD_ICG',
      contrabandSeizedDescription: contrabandDesc,
      seizedContrabandValueRupees: Number(contrabandValue),
      crewMembersDetainedCount: Number(crewCount),
      maritimeAudioVideoPanchnamaSha256: '77889900aabbccddeeff0011223344556677889900aabbccddeeff0011223344',
      designatedCoastalPoliceStation: coastalStation,
      vesselConfiscationStatus: 'SEIZED_IN_COASTAL_CUSTODY',
    });

    const updated = phase14Service.getMaritimeRecords();
    setRecords(updated);
    setSelectedRecord(created);
    setIsNewInterceptionModalOpen(false);
    setToastMessage(`Maritime Incursion Interception #${created.incursionId} logged with Sec 105 Audio-Video Panchnama`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-teal-950/80 border border-blue-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Anchor className="w-48 h-48 text-blue-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded uppercase tracking-wider">
                Indian Coast Guard & Marine Police
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded uppercase tracking-wider">
                EEZ & Territorial Waters Act 1976
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Anchor className="w-6 h-6 text-blue-400" />
              National Maritime & Coastal Radar Incursion Grid
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Coastal Security Network (CSN) radar tracking, high-seas narcotics and arms interception, Section 105 BNSS
              maritime body-worn camera panchnama, and coastal police station handover.
            </p>
          </div>

          <button
            onClick={() => setIsNewInterceptionModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Log Maritime Interception Docket</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-blue-950/90 border border-blue-500/60 text-blue-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-blue-300 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interceptions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-400" />
              Maritime Incursion Dockets ({records.length})
            </h2>
          </div>

          <div className="space-y-3">
            {records.map((item) => {
              const isSelected = selectedRecord?.incursionId === item.incursionId;

              return (
                <div
                  key={item.incursionId}
                  onClick={() => setSelectedRecord(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500/60 ring-1 ring-blue-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-blue-400">{item.incursionId}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-blue-500/15 text-blue-300 border-blue-500/30">
                      {item.vesselType.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1">{item.vesselNameOrCallsign}</div>
                  <div className="text-xs text-slate-400 mb-2">{item.gpsCoordinates.coastalSector}</div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Seized Value:</span>
                    <span className="font-mono font-bold text-amber-400">
                      ₹{(item.seizedContrabandValueRupees / 10000000).toFixed(2)} Cr
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Maritime Dossier */}
        {selectedRecord && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                    {selectedRecord.interceptingUnit.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{selectedRecord.vesselNameOrCallsign}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Designated Coastal Station:{' '}
                    <span className="text-slate-200 font-semibold">{selectedRecord.designatedCoastalPoliceStation}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-right">
                  <div className="text-[11px] text-slate-400">Contraband Value (Estimated)</div>
                  <div className="text-xl font-mono font-bold text-amber-400 mt-0.5">
                    ₹{selectedRecord.seizedContrabandValueRupees.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Coordinates & Detained Crew */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">GPS Interception Coordinates</div>
                  <div className="text-sm font-mono font-semibold text-cyan-400 mt-1">
                    {selectedRecord.gpsCoordinates.latitude}° N, {selectedRecord.gpsCoordinates.longitude}° E
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {selectedRecord.gpsCoordinates.nauticalMilesFromShore} Nautical Miles from Baseline
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Crew & Incursion Status</div>
                  <div className="text-sm font-bold text-white mt-1">
                    {selectedRecord.crewMembersDetainedCount} Foreign Crew Members Detained
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">
                    Status: {selectedRecord.vesselConfiscationStatus.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Contraband Description */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
                <Coins className="w-4 h-4 text-amber-400" />
                Seized High-Seas Contraband & Inventory
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                {selectedRecord.contrabandSeizedDescription}
              </p>
            </div>

            {/* Section 105 BNSS Panchnama Proof */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Section 105 BNSS Maritime Audio-Video Panchnama Hash
                </h4>
                <span className="text-[11px] font-mono text-emerald-400">C2PA Verified</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-blue-400 break-all">
                {selectedRecord.maritimeAudioVideoPanchnamaSha256}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Log Interception */}
      {isNewInterceptionModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Anchor className="w-5 h-5 text-blue-400" />
                Log Maritime Incursion Interception
              </h3>
              <button
                onClick={() => setIsNewInterceptionModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateInterception} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Vessel Name / Callsign</label>
                <input
                  type="text"
                  required
                  value={vesselName}
                  onChange={(e) => setVesselName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Vessel Type</label>
                <select
                  value={vesselType}
                  onChange={(e) =>
                    setVesselType(
                      e.target.value as
                        | 'UNREGISTERED_SPEED_DHOW'
                        | 'MERCHANT_CARGO_VESSEL'
                        | 'TRAWLER_UNAUTHORIZED_EEZ'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="UNREGISTERED_SPEED_DHOW">Unregistered High-Speed Dhow (Contraband Carrier)</option>
                  <option value="MERCHANT_CARGO_VESSEL">Commercial Cargo / Merchant Ship</option>
                  <option value="TRAWLER_UNAUTHORIZED_EEZ">Foreign Deep-Sea Trawler (Illegal EEZ Incursion)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contraband Description</label>
                <textarea
                  rows={2}
                  required
                  value={contrabandDesc}
                  onChange={(e) => setContrabandDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Seized Value (INR ₹)</label>
                  <input
                    type="number"
                    required
                    value={contrabandValue}
                    onChange={(e) => setContrabandValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Crew Count Detained</label>
                  <input
                    type="number"
                    required
                    value={crewCount}
                    onChange={(e) => setCrewCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Designated Coastal Marine Station</label>
                <input
                  type="text"
                  required
                  value={coastalStation}
                  onChange={(e) => setCoastalStation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewInterceptionModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Anchor Maritime Panchnama
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
