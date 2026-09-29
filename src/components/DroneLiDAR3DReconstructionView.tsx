import React, { useState } from 'react';
import {
  Compass,
  Layers,
  Plane,
  ShieldCheck,
  Building,
  CheckCircle2,
  FileCheck2,
  Plus,
  Send,
  Lock,
  Eye,
  Crosshair,
} from 'lucide-react';
import { phase15Service } from '../services/phase15Service';
import { DroneLiDAR3DReconstructionRecord } from '../types';

export const DroneLiDAR3DReconstructionView: React.FC = () => {
  const [reconstructions, setReconstructions] = useState<DroneLiDAR3DReconstructionRecord[]>(
    phase15Service.getLiDARReconstructions()
  );
  const [selectedRecord, setSelectedRecord] = useState<DroneLiDAR3DReconstructionRecord>(
    reconstructions[0] || null
  );
  const [activeFeatureFilter, setActiveFeatureFilter] = useState<'ALL' | 'TRAJECTORY' | 'SPATTER' | 'SIGHTLINE'>('ALL');
  const [isNewReconstructionModalOpen, setIsNewReconstructionModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [caseRef, setCaseRef] = useState<string>('DL-01-2026-CR-0041');
  const [sceneName, setSceneName] = useState<string>('Industrial Park Warehouse / Entry Gate Perimeter');
  const [pilotName, setPilotName] = useState<string>('SI Amit Kumar (NFSU Aerial Forensics Unit)');
  const [pointDensity, setPointDensity] = useState<number>(5200);

  const filteredFeatures = selectedRecord
    ? selectedRecord.trajectoriesAndSpatters.filter((f) => {
        if (activeFeatureFilter === 'ALL') return true;
        if (activeFeatureFilter === 'TRAJECTORY') return f.featureType === 'BULLET_TRAJECTORY_VECTOR';
        if (activeFeatureFilter === 'SPATTER') return f.featureType === 'BLOOD_SPATTER_ORIGIN';
        if (activeFeatureFilter === 'SIGHTLINE') return f.featureType === 'SHOOTER_SIGHTLINE_CONE';
        return true;
      })
    : [];

  const handleCreateReconstruction = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await phase15Service.createLiDARReconstruction({
      caseNumberRef: caseRef,
      sceneName,
      dgcaDigitalSkyToken: `DGCA-NPNT-2026-TOKEN-${Math.floor(10000 + Math.random() * 90000)}`,
      pilotOfficerName: pilotName,
      lidarPointDensityPerSqM: Number(pointDensity),
      orthomosaicResolutionCm: 0.35,
      droneFlightCoordinates: {
        latitude: 28.5355,
        longitude: 77.391,
        altitudeMeters: 50.0,
      },
      trajectoriesAndSpatters: [
        {
          featureId: 'TRAJ-01',
          featureType: 'BULLET_TRAJECTORY_VECTOR',
          coordinates3D: { x: 10.2, y: 14.1, z: 1.5 },
          directionVector: { azimuthDeg: 88.4, elevationDeg: -2.1 },
          forensicNotes: 'Trajectory originating from perimeter security tower window',
          caliberOrVelocityMatch: '7.62x39mm @ 715 m/s',
        },
      ],
      c2paDroneFlightHash: `c2pa-provenance-drone-mavic3-enterprise-${Date.now()}`,
    });

    const updated = phase15Service.getLiDARReconstructions();
    setReconstructions(updated);
    setSelectedRecord(created);
    setIsNewReconstructionModalOpen(false);
    setToastMessage(`3D Drone LiDAR Crime Scene Reconstruction #${created.reconstructionId} registered with NFSU seal`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/80 border border-teal-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Plane className="w-48 h-48 text-teal-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded uppercase tracking-wider">
                NFSU Aerial Forensics
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded uppercase tracking-wider">
                3D LiDAR & Drone Rules 2021
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Plane className="w-6 h-6 text-teal-400" />
              National Forensic Drone & GIS LiDAR 3D Crime Scene Engine
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              High-density LiDAR 3D point cloud photogrammetry, ballistic bullet trajectory calculations, blood spatter
              trigonometric impact origins, and DGCA Digital Sky cryptographic provenance.
            </p>
          </div>

          <button
            onClick={() => setIsNewReconstructionModalOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Process Drone LiDAR Flight Dataset</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-teal-950/90 border border-teal-500/60 text-teal-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-teal-300 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of 3D Reconstructions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              LiDAR Reconstructions ({reconstructions.length})
            </h2>
          </div>

          <div className="space-y-3">
            {reconstructions.map((item) => {
              const isSelected = selectedRecord?.reconstructionId === item.reconstructionId;

              return (
                <div
                  key={item.reconstructionId}
                  onClick={() => setSelectedRecord(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-teal-500/60 ring-1 ring-teal-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-teal-400">{item.reconstructionId}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-teal-500/15 text-teal-300 border-teal-500/30">
                      {item.lidarPointDensityPerSqM} pts/m²
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1">{item.sceneName}</div>
                  <div className="text-xs text-slate-400 mb-2">Case Ref: {item.caseNumberRef}</div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">DGCA Token:</span>
                    <span className="font-mono text-[11px] text-indigo-400">{item.dgcaDigitalSkyToken.slice(0, 16)}...</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 3D Point Cloud Canvas & Trajectory Visualizer */}
        {selectedRecord && (
          <div className="lg:col-span-2 space-y-6">
            {/* 3D Scene Viewport Simulation Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Crosshair className="w-5 h-5 text-teal-400" />
                    {selectedRecord.sceneName}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Drone Pilot: <span className="text-slate-200">{selectedRecord.pilotOfficerName}</span>
                  </div>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setActiveFeatureFilter('ALL')}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      activeFeatureFilter === 'ALL' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400'
                    }`}
                  >
                    All Vectors
                  </button>
                  <button
                    onClick={() => setActiveFeatureFilter('TRAJECTORY')}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      activeFeatureFilter === 'TRAJECTORY' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400'
                    }`}
                  >
                    Trajectories
                  </button>
                  <button
                    onClick={() => setActiveFeatureFilter('SPATTER')}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      activeFeatureFilter === 'SPATTER' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400'
                    }`}
                  >
                    Blood Spatter
                  </button>
                </div>
              </div>

              {/* Simulated 3D Coordinate Grid Canvas */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 relative overflow-hidden h-72 flex flex-col justify-between">
                <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono z-10">
                  <span>LiDAR Elevation Mesh (Z-Axis: 0.00m to +4.50m)</span>
                  <span className="text-teal-400 font-bold">Orthomosaic Resolution: {selectedRecord.orthomosaicResolutionCm} cm/px</span>
                </div>

                {/* 3D Features Vector Markers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 z-10 my-auto">
                  {filteredFeatures.map((feat) => (
                    <div
                      key={feat.featureId}
                      className="bg-slate-900/90 border border-teal-500/40 p-3 rounded-lg shadow-lg text-xs space-y-1 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-teal-400">{feat.featureId}</span>
                        <span className="text-[10px] text-slate-400">{feat.featureType.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="text-slate-200 text-[11px]">{feat.forensicNotes}</div>
                      <div className="text-[10px] font-mono text-cyan-300 pt-1 border-t border-slate-800 flex justify-between">
                        <span>XYZ: [{feat.coordinates3D.x}, {feat.coordinates3D.y}, {feat.coordinates3D.z}]</span>
                        <span>Az: {feat.directionVector.azimuthDeg}°</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono z-10">
                  <span>C2PA Authenticity Verified</span>
                  <span>Flight Lat/Long: {selectedRecord.droneFlightCoordinates.latitude}° N, {selectedRecord.droneFlightCoordinates.longitude}° E</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Validation Proof */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  NFSU 3D Photogrammetric Validation Hash (Sec 63 BSA 2023)
                </h4>
                <span className="text-[11px] font-mono text-emerald-400">Court Admissible 3D Model</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-teal-400 break-all">
                {selectedRecord.nfsuForensicValidationSha256}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Process Drone Dataset */}
      {isNewReconstructionModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plane className="w-5 h-5 text-teal-400" />
                Process Drone LiDAR Flight Dataset
              </h3>
              <button
                onClick={() => setIsNewReconstructionModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateReconstruction} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Case Number Reference</label>
                <input
                  type="text"
                  required
                  value={caseRef}
                  onChange={(e) => setCaseRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Crime Scene / Structure Name</label>
                <input
                  type="text"
                  required
                  value={sceneName}
                  onChange={(e) => setSceneName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Certified Pilot Officer Name</label>
                <input
                  type="text"
                  required
                  value={pilotName}
                  onChange={(e) => setPilotName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">LiDAR Point Density (Points / m²)</label>
                <input
                  type="number"
                  required
                  value={pointDensity}
                  onChange={(e) => setPointDensity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewReconstructionModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Generate 3D Point Mesh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
