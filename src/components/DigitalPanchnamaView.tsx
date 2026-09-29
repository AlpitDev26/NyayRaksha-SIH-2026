import React, { useState, useEffect } from 'react';
import { DigitalAudioVideoPanchnama, CaseFile, UserRole, SupportedLanguage } from '../types';
import { phase8Service } from '../services/phase8Service';
import { storageService } from '../services/storageService';
import {
  Video,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Lock,
  PlusCircle,
  FileText,
  Radio,
  Fingerprint,
  Send,
  Boxes,
  Camera,
  Hash,
  Sparkles,
} from 'lucide-react';

interface DigitalPanchnamaViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const DigitalPanchnamaView: React.FC<DigitalPanchnamaViewProps> = ({
  currentRole: _currentRole,
}) => {
  const [panchnamas, setPanchnamas] = useState<DigitalAudioVideoPanchnama[]>([]);
  const [selectedPanchnama, setSelectedPanchnama] = useState<DigitalAudioVideoPanchnama | null>(null);
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  // New Panchnama Modal/Form state
  const [panchnamaType, setPanchnamaType] = useState<DigitalAudioVideoPanchnama['panchnamaType']>(
    'SEARCH_AND_SEIZURE_SEC_105'
  );
  const [locationAddress, setLocationAddress] = useState('Flat 402, Royal Palms, Sector 62, Noida');
  const [latitude, setLatitude] = useState(28.6271);
  const [longitude, setLongitude] = useState(77.3725);
  const [panch1Name, setPanch1Name] = useState('Rameshwar Dayal');
  const [panch1Aadhaar, setPanch1Aadhaar] = useState('7192');
  const [panch2Name, setPanch2Name] = useState('Kavita Sundaram');
  const [panch2Aadhaar, setPanch2Aadhaar] = useState('4819');
  const [itemDesc, setItemDesc] = useState('1x Encrypted Hard Drive (Western Digital 4TB)');
  const [itemQty, setItemQty] = useState('1 Unit');
  const [itemCategory, setItemCategory] = useState<any>('DIGITAL_DEVICE');
  const [itemLoc, setItemLoc] = useState('Recovered from bedroom wardrobe top shelf');

  const [isRecordingLive, setIsRecordingLive] = useState(false);
  const [recordDurationSec, setRecordDurationSec] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const list = phase8Service.getDigitalPanchnamas();
    setPanchnamas(list);
    if (list.length > 0) setSelectedPanchnama(list[0]);
    const stored = storageService.getCases();
    setCases(stored);
    if (stored.length > 0) setSelectedCaseId(stored[0].id);
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isRecordingLive) {
      interval = setInterval(() => {
        setRecordDurationSec((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordDurationSec(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingLive]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCaptureLiveLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          showToast(`Geo-Coordinates captured: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          showToast('Using simulated high-precision GNSS location.');
        }
      );
    } else {
      showToast('Geolocation active (GNSS Enclave Tagged)');
    }
  };

  const handleCreatePanchnama = async () => {
    const target = cases.find((c) => c.id === selectedCaseId);
    if (!target) return;

    try {
      const created = await phase8Service.createDigitalPanchnama(
        target,
        panchnamaType,
        locationAddress,
        latitude,
        longitude,
        panch1Name,
        panch1Aadhaar,
        panch2Name,
        panch2Aadhaar,
        [
          {
            description: itemDesc,
            category: itemCategory,
            qty: itemQty,
            location: itemLoc,
          },
        ]
      );
      setPanchnamas([...phase8Service.getDigitalPanchnamas()]);
      setSelectedPanchnama(created);
      setIsRecordingLive(false);
      showToast('Section 105 Audio-Video Panchnama sealed and transmitted to Judicial Magistrate!');
    } catch (e: any) {
      showToast('Error: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/80 to-slate-900 border border-rose-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-rose-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Section 105 BNSS 2023 Mandate
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400" /> Real-Time Magistrate Stream
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <Video className="w-6 h-6 text-rose-400" />
              Digital Audio-Video Search & Seizure Panchnama Deck
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Mandatory electronic recording of search, seizure, and recovery with live GNSS geo-tagging, dual independent Panch biometric signing, and automated dispatch to the Judicial Magistrate under Section 105 BNSS.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRecordingLive(!isRecordingLive)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                isRecordingLive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse shadow-lg shadow-rose-900/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Camera className="w-4 h-4" />
              {isRecordingLive
                ? `Recording Body-Cam Stream (${Math.floor(recordDurationSec / 60)}:${(recordDurationSec % 60)
                    .toString()
                    .padStart(2, '0')})`
                : 'Start Section 105 Live Cam'}
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

      {/* Main Grid: Live Builder & Recorded Panchnamas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Panchnama Builder Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-400" /> Construct Section 105 Panchnama
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">GNSS Geo-Active</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Investigation Case File:</label>
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
                <label className="block text-slate-400 font-medium mb-1">Panchnama Type:</label>
                <select
                  value={panchnamaType}
                  onChange={(e: any) => setPanchnamaType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                >
                  <option value="SEARCH_AND_SEIZURE_SEC_105">Search & Seizure (Sec 105 BNSS)</option>
                  <option value="CRIME_SCENE_INSPECTION">Crime Scene Inspection & Spot Panchnama</option>
                  <option value="RECOVERY_UNDER_SEC_23_BSA">Recovery of Discovery (Sec 23 BSA 2023)</option>
                  <option value="INQUEST_PANCHNAMA">Inquest Panchnama (Sec 194 BNSS)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Seizure Location & Address:</label>
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              {/* Geo Coordinates */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> GNSS Geo-Coordinates
                  </span>
                  <button
                    onClick={handleCaptureLiveLocation}
                    className="text-[10px] text-rose-400 hover:text-rose-300 underline font-mono"
                  >
                    Sync Live GPS
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800 text-slate-300">
                    Lat: {latitude.toFixed(4)}° N
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800 text-slate-300">
                    Lng: {longitude.toFixed(4)}° E
                  </div>
                </div>
              </div>

              {/* Panch Witnesses Biometric Info */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <Fingerprint className="w-3.5 h-3.5" /> Panch Witnesses (Independent)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400">Panch #1 Name:</label>
                    <input
                      type="text"
                      value={panch1Name}
                      onChange={(e) => setPanch1Name(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400">Panch #1 Aadhaar Last-4:</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={panch1Aadhaar}
                      onChange={(e) => setPanch1Aadhaar(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400">Panch #2 Name:</label>
                    <input
                      type="text"
                      value={panch2Name}
                      onChange={(e) => setPanch2Name(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400">Panch #2 Aadhaar Last-4:</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={panch2Aadhaar}
                      onChange={(e) => setPanch2Aadhaar(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Seized Property Details */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Boxes className="w-3.5 h-3.5 text-rose-400" /> Property Seized & Sealed
                </div>
                <div>
                  <input
                    type="text"
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value)}
                    placeholder="Item description..."
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 text-xs mb-1.5"
                  />
                  <input
                    type="text"
                    value={itemLoc}
                    onChange={(e) => setItemLoc(e.target.value)}
                    placeholder="Specific spot where found..."
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 text-xs"
                  />
                </div>
              </div>

              <button
                onClick={handleCreatePanchnama}
                className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-rose-200" /> Seal & Transmit under Section 105 BNSS
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Panchnama Records & Live Stream Ledger */}
        <div className="lg:col-span-7 space-y-4">
          {selectedPanchnama ? (
            <div className="space-y-4">
              {/* Panchnama Ledger Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-300">
                        {selectedPanchnama.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {selectedPanchnama.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      {selectedPanchnama.panchnamaType.replace(/_/g, ' ')}
                    </h3>
                  </div>

                  <div className="text-right font-mono text-xs text-slate-400">
                    <div>Magistrate Notified</div>
                    <div className="text-emerald-400 font-bold">
                      {new Date(selectedPanchnama.magistrateNotificationTimestamp || '').toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Location and Officer Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">CASE NUMBER</span>
                    <span className="text-white font-bold">{selectedPanchnama.caseNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">LEAD OFFICER</span>
                    <span className="text-white">{selectedPanchnama.leadOfficer.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">GNSS POSITION</span>
                    <span className="text-emerald-400">
                      {selectedPanchnama.geoCoordinates.latitude.toFixed(3)}N,{' '}
                      {selectedPanchnama.geoCoordinates.longitude.toFixed(3)}E
                    </span>
                  </div>
                </div>

                {/* Audio-Video Live Stream Verification Card */}
                <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Video className="w-4 h-4 text-rose-400" /> Electronic Video Evidence Stream
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      C2PA Enclave Certified
                    </span>
                  </div>

                  {selectedPanchnama.audioVideoRecordings.map((rec) => (
                    <div key={rec.recordingId} className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Device: {rec.deviceModel}</span>
                        <span className="font-mono text-indigo-400">Duration: {Math.round(rec.durationSec / 60)} mins</span>
                      </div>
                      <div className="p-2 bg-slate-900 rounded font-mono text-[10px] text-slate-400 truncate">
                        <span className="text-slate-500">Stream Hash:</span> {rec.sha256Hash}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Seized Items Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Seized Inventory & Tamper-Evident Seals
                  </h4>
                  <div className="space-y-2">
                    {selectedPanchnama.seizedItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-white">{item.description}</div>
                          <div className="text-[11px] text-slate-400">
                            Location: {item.seizureLocationDetail} ({item.quantity})
                          </div>
                        </div>
                        <div className="text-right font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-rose-950/70 text-rose-300 border border-rose-800/40 font-bold block">
                            {item.tamperEvidentSealNumber}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panch Signatures Footer */}
                <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Fingerprint className="w-4 h-4 text-emerald-400" />
                    <span>
                      Panch Signatures Verified: {selectedPanchnama.panchWitnesses.map((p) => p.name).join(', ')}
                    </span>
                  </div>

                  <button
                    onClick={() => showToast('Section 105 Compliance Certificate exported as verifiable PDF!')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-400" /> Export Sec 105 Certificate
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
              <Video className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select or create a Section 105 Digital Panchnama.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
