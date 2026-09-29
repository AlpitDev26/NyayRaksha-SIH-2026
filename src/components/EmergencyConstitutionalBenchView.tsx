import React, { useState } from 'react';
import {
  AlertOctagon,
  Scale,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Plus,
  Send,
  Lock,
  Radio,
} from 'lucide-react';
import { phase14Service } from '../services/phase14Service';
import { EmergencyConstitutionalBenchRecord } from '../types';

export const EmergencyConstitutionalBenchView: React.FC = () => {
  const [records, setRecords] = useState<EmergencyConstitutionalBenchRecord[]>(phase14Service.getEmergencyRecords());
  const [selectedRecord, setSelectedRecord] = useState<EmergencyConstitutionalBenchRecord>(records[0] || null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState<string>(
    'Magisterial Prohibitory Order under Section 163 BNSS (Erstwhile Sec 144 CrPC)'
  );
  const [orderType, setOrderType] = useState<
    'SEC_163_BNSS_PROHIBITORY_ORDER' | 'HABEAS_CORPUS_WRIT_ART_226' | 'DISASTER_SPECIAL_BENCH_DMA'
  >('SEC_163_BNSS_PROHIBITORY_ORDER');
  const [district, setDistrict] = useState<string>('Mumbai South & Coastal Port Enclave');
  const [radiusKm, setRadiusKm] = useState<number>(3.5);
  const [magistrate, setMagistrate] = useState<string>(
    'Chief Metropolitan Magistrate / Special Executive Magistrate, Mumbai'
  );
  const [orderSummary, setOrderSummary] = useState<string>(
    'Prohibition on public gatherings of more than 4 persons, restriction on drones, and surveillance lockdown in port perimeter.'
  );

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await phase14Service.createEmergencyOrder({
      orderType,
      title,
      affectedGeographicalZone: {
        districtName: district,
        centerCoordinates: { latitude: 18.922, longitude: 72.8347 },
        containmentRadiusKm: Number(radiusKm),
      },
      presidingJudgeOrMagistrate: magistrate,
      curfewStatus: 'ESSENTIAL_SERVICES_EXEMPTED',
      teleHearingConducted: true,
      orderSummary,
      effectiveFrom: new Date().toISOString(),
      effectiveUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const updated = phase14Service.getEmergencyRecords();
    setRecords(updated);
    setSelectedRecord(created);
    setIsNewOrderModalOpen(false);
    setToastMessage(`Emergency Constitutional Bench Order #${created.emergencyOrderId} published with live GIS radius seal`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-purple-950/80 border border-red-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <AlertOctagon className="w-48 h-48 text-red-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/40 rounded uppercase tracking-wider">
                Sec 163 BNSS Prohibitory Console
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded uppercase tracking-wider">
                Article 226 Habeas Corpus Fast-Track
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <AlertOctagon className="w-6 h-6 text-red-400" />
              Sovereign Constitutional Emergency & Special Judicial Enclave
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Magisterial Section 163 BNSS (former Sec 144 CrPC) orders with GIS radius mapping, 24x7 Habeas Corpus
              emergency tele-hearing dockets, and Disaster Management Act special judicial oversights.
            </p>
          </div>

          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-red-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Promulgate Emergency Judicial Order</span>
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
        {/* Left Column: List of Emergency Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Scale className="w-4 h-4 text-red-400" />
              Active Emergency Dockets ({records.length})
            </h2>
          </div>

          <div className="space-y-3">
            {records.map((order) => {
              const isSelected = selectedRecord?.emergencyOrderId === order.emergencyOrderId;

              return (
                <div
                  key={order.emergencyOrderId}
                  onClick={() => setSelectedRecord(order)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-red-500/60 ring-1 ring-red-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-red-400">{order.emergencyOrderId}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-red-500/15 text-red-300 border-red-500/30">
                      {order.orderType.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1 line-clamp-2">{order.title}</div>
                  <div className="text-xs text-slate-400 mb-2">{order.affectedGeographicalZone.districtName}</div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Curfew Status:</span>
                    <span className="font-semibold text-amber-400">{order.curfewStatus.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Emergency Docket & GIS Map */}
        {selectedRecord && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30 rounded">
                    {selectedRecord.orderType.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{selectedRecord.title}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Presiding Authority:{' '}
                    <span className="text-slate-200 font-semibold">{selectedRecord.presidingJudgeOrMagistrate}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-right">
                  <div className="text-[11px] text-slate-400">Emergency Tele-Bench Status</div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1 mt-1">
                    <Radio className="w-3.5 h-3.5" />
                    24x7 Virtual Roster Active
                  </div>
                </div>
              </div>

              {/* Geographical Zone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    Affected District & GIS Coordinates
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">
                    {selectedRecord.affectedGeographicalZone.districtName}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400 mt-0.5">
                    {selectedRecord.affectedGeographicalZone.centerCoordinates.latitude}° N,{' '}
                    {selectedRecord.affectedGeographicalZone.centerCoordinates.longitude}° E
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Containment Radius & Duration</div>
                  <div className="text-sm font-bold text-amber-400 mt-1">
                    {selectedRecord.affectedGeographicalZone.containmentRadiusKm} KM Prohibitory Zone
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Valid Until: {new Date(selectedRecord.effectiveUntil).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Prohibitory Directives */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
                <FileCheck2 className="w-4 h-4 text-red-400" />
                Magisterial Prohibitory Directives & Restrictions
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                {selectedRecord.orderSummary}
              </p>
            </div>

            {/* Magisterial Seal SHA-256 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Magisterial Seal & Cryptographic Gazette Anchor (Sec 63 BSA 2023)
                </h4>
                <span className="text-[11px] font-mono text-emerald-400">SHA-256</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-red-400 break-all">
                {selectedRecord.magisterialSealSha256}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Promulgate Emergency Order */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-400" />
                Promulgate Emergency Judicial Order
              </h3>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Order Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Statutory Basis</label>
                <select
                  value={orderType}
                  onChange={(e) =>
                    setOrderType(
                      e.target.value as
                        | 'SEC_163_BNSS_PROHIBITORY_ORDER'
                        | 'HABEAS_CORPUS_WRIT_ART_226'
                        | 'DISASTER_SPECIAL_BENCH_DMA'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="SEC_163_BNSS_PROHIBITORY_ORDER">Section 163 BNSS (Prohibitory Magisterial Order)</option>
                  <option value="HABEAS_CORPUS_WRIT_ART_226">Article 226 Habeas Corpus Emergency Writ</option>
                  <option value="DISASTER_SPECIAL_BENCH_DMA">Disaster Management Act 2005 Special Bench Order</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Affected District</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Radius (KM)</label>
                  <input
                    type="number"
                    required
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Presiding Judge / Magistrate</label>
                <input
                  type="text"
                  required
                  value={magistrate}
                  onChange={(e) => setMagistrate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Order Summary & Directives</label>
                <textarea
                  rows={2}
                  required
                  value={orderSummary}
                  onChange={(e) => setOrderSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Seal & Promulgate Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
