import React, { useState } from 'react';
import {
  Crosshair,
  Radio,
  ShieldAlert,
  Cpu,
  MapPin,
  CheckCircle2,
  FileCheck2,
  Plus,
  Send,
  Lock,
  Coins,
} from 'lucide-react';
import { phase15Service } from '../services/phase15Service';
import { CounterTerrorDroneIncursionRecord } from '../types';

export const CounterTerrorDroneRadarView: React.FC = () => {
  const [records, setRecords] = useState<CounterTerrorDroneIncursionRecord[]>(phase15Service.getDroneRecords());
  const [selectedRecord, setSelectedRecord] = useState<CounterTerrorDroneIncursionRecord>(records[0] || null);
  const [isNewInterceptionModalOpen, setIsNewInterceptionModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [sector, setSector] = useState<string>('Jammu International Border - RS Pura Sector');
  const [droneType, setDroneType] = useState<
    'HEXACOPTER_CUSTOM_HEAVY_LIFT' | 'QUADCOPTER_SURVEILLANCE' | 'FIXED_WING_LOITERING_UAV'
  >('HEXACOPTER_CUSTOM_HEAVY_LIFT');
  const [neutralization, setNeutralization] = useState<
    'SOFT_KILL_RF_JAMMING' | 'HARD_KILL_KINETIC_DEFENSE' | 'GPS_SPOOF_AUTO_LAND'
  >('SOFT_KILL_RF_JAMMING');
  const [payload, setPayload] = useState<string>(
    '3x Chinese Type-86 Grenades, 1.5 kg Semtex RDX IED, 2 Satellite Handsets'
  );
  const [payloadValue, setPayloadValue] = useState<number>(15000000);
  const [uapaCourt, setUapaCourt] = useState<string>('Special NIA UAPA Court, Jammu');

  const handleCreateDroneRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await phase15Service.createDroneRecord({
      sectorName: sector,
      gpsCoordinates: { latitude: 32.6102, longitude: 74.7291 },
      interceptionTimestamp: new Date().toISOString(),
      droneType,
      neutralizationMethod: neutralization,
      payloadRecovered: payload,
      payloadEstimatedValueRupees: Number(payloadValue),
      firmwareTelemetryExtracted: {
        flightLogWaypointsCount: 28,
        launchOriginCoordinates: '32.5510° N, 74.6812° E (Launch Node)',
        targetDropZoneCoordinates: '32.6098° N, 74.7285° E (Field Outpost)',
        flightControllerSerial: `STM32-UAV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      },
      specialUAPACourtRef: uapaCourt,
    });

    const updated = phase15Service.getDroneRecords();
    setRecords(updated);
    setSelectedRecord(created);
    setIsNewInterceptionModalOpen(false);
    setToastMessage(`Counter-Terror Drone Incident #${created.droneIncidentId} logged with UAPA digital evidence`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/80 border border-red-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Crosshair className="w-48 h-48 text-red-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/40 rounded uppercase tracking-wider">
                Counter-Terror Air Defense
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded uppercase tracking-wider">
                UAPA 1967 & Sec 113 BNS
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Crosshair className="w-6 h-6 text-red-400" />
              Counter-Terrorism & Drone Incursion Aerial Radar Grid
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Anti-drone RF jamming and kinetic defense logs, contraband/arms payload extraction, flight controller
              firmware waypoint telemetry forensics, and Special UAPA Court prosecution docketing.
            </p>
          </div>

          <button
            onClick={() => setIsNewInterceptionModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-red-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Record Drone Interception</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-red-950/90 border border-red-500/60 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-red-300 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Drone Interceptions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400" />
              Intercepted UAV Incursions ({records.length})
            </h2>
          </div>

          <div className="space-y-3">
            {records.map((item) => {
              const isSelected = selectedRecord?.droneIncidentId === item.droneIncidentId;

              return (
                <div
                  key={item.droneIncidentId}
                  onClick={() => setSelectedRecord(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-red-500/60 ring-1 ring-red-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-red-400">{item.droneIncidentId}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-red-500/15 text-red-300 border-red-500/30">
                      {item.neutralizationMethod.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1">{item.sectorName}</div>
                  <div className="text-xs text-slate-400 mb-2">{item.droneType.replace(/_/g, ' ')}</div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Payload Value:</span>
                    <span className="font-mono font-bold text-amber-400">
                      ₹{(item.payloadEstimatedValueRupees / 10000000).toFixed(2)} Cr
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Firmware Forensics & Recovered Payload */}
        {selectedRecord && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30 rounded">
                    {selectedRecord.droneType.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{selectedRecord.sectorName}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Special Court Ref:{' '}
                    <span className="text-slate-200 font-semibold">{selectedRecord.specialUAPACourtRef}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-right">
                  <div className="text-[11px] text-slate-400">Neutralization Strategy</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mt-1">
                    {selectedRecord.neutralizationMethod.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Interception Coordinates</div>
                  <div className="text-sm font-mono font-semibold text-cyan-400 mt-1">
                    {selectedRecord.gpsCoordinates.latitude}° N, {selectedRecord.gpsCoordinates.longitude}° E
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Firmware Controller Serial</div>
                  <div className="text-xs font-mono font-bold text-amber-400 mt-1">
                    {selectedRecord.firmwareTelemetryExtracted.flightControllerSerial}
                  </div>
                </div>
              </div>
            </div>

            {/* Recovered Contraband & Arms Payload */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
                <Coins className="w-4 h-4 text-amber-400" />
                Recovered Terrorist Arms & Contraband Payload
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                {selectedRecord.payloadRecovered}
              </p>
            </div>

            {/* Firmware Flight Log Waypoints */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Flight Telemetry & Origin Forensic Waypoint Track
                </h4>
                <span className="text-xs font-mono text-cyan-300">
                  {selectedRecord.firmwareTelemetryExtracted.flightLogWaypointsCount} Waypoints Extracted
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Launch Origin (Reconstructed):</div>
                  <div className="font-mono text-red-300 font-semibold mt-1">
                    {selectedRecord.firmwareTelemetryExtracted.launchOriginCoordinates}
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Target Drop Zone:</div>
                  <div className="font-mono text-amber-300 font-semibold mt-1">
                    {selectedRecord.firmwareTelemetryExtracted.targetDropZoneCoordinates}
                  </div>
                </div>
              </div>
            </div>

            {/* UAPA Evidence Proof */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  Special UAPA Court Digital Evidentiary Hash (Sec 63 BSA 2023)
                </h4>
                <span className="text-[11px] font-mono text-emerald-400">SHA-256</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-red-400 break-all">
                {selectedRecord.uapaEvidenceSha256}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: New Drone Incident */}
      {isNewInterceptionModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-red-400" />
                Record Counter-Terror Drone Interception
              </h3>
              <button
                onClick={() => setIsNewInterceptionModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateDroneRecord} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Border Sector / Location</label>
                <input
                  type="text"
                  required
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Drone Classification</label>
                <select
                  value={droneType}
                  onChange={(e) =>
                    setDroneType(
                      e.target.value as
                        | 'HEXACOPTER_CUSTOM_HEAVY_LIFT'
                        | 'QUADCOPTER_SURVEILLANCE'
                        | 'FIXED_WING_LOITERING_UAV'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="HEXACOPTER_CUSTOM_HEAVY_LIFT">Hexacopter Custom Heavy-Lift (Arms/Narcotics Carrier)</option>
                  <option value="QUADCOPTER_SURVEILLANCE">Quadcopter Tactical Recon Surveillance</option>
                  <option value="FIXED_WING_LOITERING_UAV">Fixed-Wing Loitering Autonomous UAV</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Neutralization Countermeasure</label>
                <select
                  value={neutralization}
                  onChange={(e) =>
                    setNeutralization(
                      e.target.value as
                        | 'SOFT_KILL_RF_JAMMING'
                        | 'HARD_KILL_KINETIC_DEFENSE'
                        | 'GPS_SPOOF_AUTO_LAND'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="SOFT_KILL_RF_JAMMING">Soft-Kill Multi-Band RF & GNSS Jammer</option>
                  <option value="HARD_KILL_KINETIC_DEFENSE">Hard-Kill Kinetic Close-Range Shot</option>
                  <option value="GPS_SPOOF_AUTO_LAND">GPS Spoofing & Automated Safe Landing</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Recovered Payload Details</label>
                <textarea
                  rows={2}
                  required
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estimated Value (INR ₹)</label>
                  <input
                    type="number"
                    required
                    value={payloadValue}
                    onChange={(e) => setPayloadValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Special UAPA Court</label>
                  <input
                    type="text"
                    required
                    value={uapaCourt}
                    onChange={(e) => setUapaCourt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
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
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Save Drone Forensic Docket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
