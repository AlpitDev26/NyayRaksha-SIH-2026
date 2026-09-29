import React, { useState, useEffect } from 'react';
import { SmartEvidenceLockerCompartment, UserRole, SupportedLanguage } from '../types';
import { phase10Service } from '../services/phase10Service';
import {
  Boxes,
  Lock,
  Unlock,
  Radio,
  Thermometer,
  Droplets,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Scan,
} from 'lucide-react';

interface SmartEvidenceLockerViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const SmartEvidenceLockerView: React.FC<SmartEvidenceLockerViewProps> = ({
  currentRole: _currentRole,
}) => {
  const [lockers, setLockers] = useState<SmartEvidenceLockerCompartment[]>([]);
  const [selectedLocker, setSelectedLocker] = useState<SmartEvidenceLockerCompartment | null>(null);
  const [officerName, setOfficerName] = useState('Head Constable Devendra Singh (Malkhana Moharrir)');
  const [searchFilter, setSearchFilter] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isScanningNfc, setIsScanningNfc] = useState(false);

  useEffect(() => {
    const list = phase10Service.getSmartLockers();
    setLockers(list);
    if (list.length > 0) setSelectedLocker(list[0]);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleAccess = async (compartmentId: string) => {
    try {
      const updated = await phase10Service.toggleLockerAccess(compartmentId, officerName);
      setLockers([...phase10Service.getSmartLockers()]);
      setSelectedLocker({ ...updated });
      showToast(
        updated.hardwareStatus === 'ACCESS_UNLOCKED'
          ? `Compartment ${compartmentId} UNLOCKED via biometric verification!`
          : `Compartment ${compartmentId} SECURED and locked!`
      );
    } catch (e: any) {
      showToast('Error: ' + e.message);
    }
  };

  const handleSimulateNfcScan = () => {
    setIsScanningNfc(true);
    setTimeout(() => {
      setIsScanningNfc(false);
      showToast('NFC/RFID Tag Handshake Verified: ISO/IEC 17025 Encrypted Token Matched');
    }, 1200);
  };

  const filteredLockers = lockers.filter(
    (l) =>
      l.compartmentId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.storedEvidenceTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.lockerHubName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 border border-cyan-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ISO/IEC 17025 Malkhana Grid
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400" /> NFC / RFID Telemetry Live
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <Boxes className="w-6 h-6 text-cyan-400" />
              Smart Evidence Locker & Cold-Chain Telemetry Grid
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Physical evidence custody tracking with live NFC/RFID tag scanning, hardware door lock state telemetry, cryogenic/ambient temperature monitoring (-20°C to 21°C), and tamper-evident audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateNfcScan}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <Scan className={`w-4 h-4 ${isScanningNfc ? 'animate-spin' : ''}`} />
              {isScanningNfc ? 'Scanning NFC Tag...' : 'Scan NFC / RFID Tag'}
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

      {/* Main Grid: Lockers Roster & Active Vault Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lockers List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Malkhana Compartments ({filteredLockers.length})
              </h3>
              <div className="relative w-40">
                <Search className="w-3 h-3 absolute left-2 top-2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter vault ID..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded pl-6 pr-2 py-1 text-[11px] text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredLockers.map((locker) => {
                const isSelected = selectedLocker?.compartmentId === locker.compartmentId;
                const isLocked = locker.hardwareStatus === 'SECURED_LOCKED';
                return (
                  <div
                    key={locker.compartmentId}
                    onClick={() => setSelectedLocker(locker)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-300">
                        {locker.compartmentId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                          isLocked
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        {locker.hardwareStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-200 mt-1.5 line-clamp-1">
                      {locker.storedEvidenceTitle}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-900 font-mono">
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-cyan-400" />
                        {locker.temperatureTelemetryCelsius}°C
                      </span>
                      <span className="text-[10px] text-slate-500">
                        RFID: {locker.nfcRfidTagId}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Compartment Telemetry & Biometric Unlatch */}
        <div className="lg:col-span-7 space-y-4">
          {selectedLocker ? (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-300">
                        {selectedLocker.compartmentId}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {selectedLocker.targetTempCategory.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white mt-1">
                      {selectedLocker.lockerHubName}
                    </h2>
                    <div className="text-xs text-slate-400">
                      Evidence Code: <span className="font-mono text-cyan-400 font-bold">{selectedLocker.storedEvidenceCode}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Hardware Door State</span>
                    <span className="text-xs font-bold font-mono text-emerald-400">
                      {selectedLocker.hardwareDoorSensorIntegrity.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Stored Evidence Description */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Enclosed Evidence Asset
                  </div>
                  <div className="text-sm font-bold text-white">{selectedLocker.storedEvidenceTitle}</div>
                </div>

                {/* Sensor Telemetry Gauges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>Internal Temp</span>
                      <Thermometer className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-xl font-bold text-white">
                      {selectedLocker.temperatureTelemetryCelsius}°C
                    </div>
                    <div className="text-[10px] text-emerald-400">Target Range Optimal</div>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>Relative Humidity</span>
                      <Droplets className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-xl font-bold text-white">
                      {selectedLocker.humidityPercentage}%
                    </div>
                    <div className="text-[10px] text-emerald-400">Anti-Oxidation Seal</div>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>Access Events</span>
                      <Activity className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-xl font-bold text-white">
                      {selectedLocker.accessLogEventsCount}
                    </div>
                    <div className="text-[10px] text-slate-400">Biometrics Audited</div>
                  </div>
                </div>

                {/* Biometric Custodian Control Bar */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-emerald-400" /> Biometric Custodian Handshake
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      Smart NFC Tag: {selectedLocker.nfcRfidTagId}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Active Custodian: {selectedLocker.activeCustodianOfficer}</span>
                    <span className="font-mono text-[10px]">
                      Last Event: {new Date(selectedLocker.lastAccessTimestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => handleToggleAccess(selectedLocker.compartmentId)}
                      className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        selectedLocker.hardwareStatus === 'SECURED_LOCKED'
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-950/50'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                      }`}
                    >
                      {selectedLocker.hardwareStatus === 'SECURED_LOCKED' ? (
                        <>
                          <Unlock className="w-4 h-4" /> Biometric Unlatch Door
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" /> Lock & Re-Seal Enclave
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
              <Boxes className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select compartment to view hardware telemetry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
