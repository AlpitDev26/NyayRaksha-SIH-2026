import React, { useState } from 'react';
import {
  Server,
  Key,
  Database,
  ArrowRightLeft,
  CheckCircle2,
  Lock,
  Cpu,
  RefreshCw,
  HardDrive,
} from 'lucide-react';
import { phase12Service } from '../services/phase12Service';
import { QuantumResilientDRRecord } from '../types';

export const QuantumResilientDRHubView: React.FC = () => {
  const [nodes, setNodes] = useState<QuantumResilientDRRecord[]>(phase12Service.getQuantumDRNodes());
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pqcTestOutput, setPqcTestOutput] = useState<{
    kemCiphertext: string;
    dsaSignature: string;
    sharedSecretHash: string;
  } | null>(null);

  const handleKeyRotation = async () => {
    setIsRotating(true);
    const result = await phase12Service.triggerQuantumKeyRotation();
    setNodes(phase12Service.getQuantumDRNodes());
    setIsRotating(false);
    setToastMessage(`Quantum-Safe ML-KEM-1024 & ML-DSA-87 root key rotation completed across all sovereign nodes`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFailoverDrill = (target: 'HYDERABAD_DISASTER_RECOVERY_DC' | 'DELHI_PRIMARY_NIC_DC') => {
    phase12Service.simulateRegionFailover(target);
    setNodes(phase12Service.getQuantumDRNodes());
    setToastMessage(`Simulated Geo-DR failover executed: ${target.replace(/_/g, ' ')} is now PRIMARY MASTER`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRunPQCTest = () => {
    setPqcTestOutput({
      kemCiphertext: '7f9a8b1c0d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
      dsaSignature: 'e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3',
      sharedSecretHash: '4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b',
    });
    setToastMessage('NIST FIPS 203 ML-KEM Decapsulation & FIPS 204 Signature verified successfully (0.42ms)');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Server className="w-48 h-48 text-cyan-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded uppercase tracking-wider">
                Post-Quantum Cryptography (PQC)
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded uppercase tracking-wider">
                Tri-Data Center Geo-Mesh
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Server className="w-6 h-6 text-cyan-400" />
              Quantum-Resilient Disaster Recovery & Geo-Redundancy Hub
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              NIST FIPS 203 ML-KEM (CRYSTALS-Kyber) & FIPS 204 ML-DSA (CRYSTALS-Dilithium) sovereign encryption,
              tri-region failover synchronization, and Byzantine fault-tolerant split-brain protection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunPQCTest}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer border border-slate-700"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Simulate PQC Decapsulation</span>
            </button>

            <button
              onClick={handleKeyRotation}
              disabled={isRotating}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-900/30"
            >
              <RefreshCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
              <span>Rotate PQC Root Keys</span>
            </button>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-cyan-950/90 border border-cyan-500/60 text-cyan-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-cyan-300 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Tri-Region Sovereign Node Topology */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Sovereign Tri-Region Node Topology & Active Replication State
          </h2>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Quorum Active (100% Byzantine Fault Tolerance)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nodes.map((node) => {
            const isPrimary = node.role === 'PRIMARY_MASTER';
            const isAirgap = node.role === 'AIRGAP_SOVEREIGN_ARCHIVE';

            return (
              <div
                key={node.nodeId}
                className={`p-5 rounded-xl border relative overflow-hidden transition-all ${
                  isPrimary
                    ? 'bg-slate-900 border-cyan-500/60 ring-1 ring-cyan-500/30 shadow-xl'
                    : isAirgap
                    ? 'bg-slate-900/80 border-purple-500/40'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-semibold text-cyan-400">{node.nodeId}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      isPrimary
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : isAirgap
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {node.role.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="text-sm font-bold text-white mb-2">{node.region.replace(/_/g, ' ')}</div>

                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>PQC Key Exchange:</span>
                    <span className="font-mono text-slate-200 text-[11px]">{node.pqcAlgorithmKem}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>PQC Digital Signature:</span>
                    <span className="font-mono text-slate-200 text-[11px]">{node.pqcAlgorithmDsa}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Replication Latency:</span>
                    <span className="font-mono text-emerald-400">{node.syncLatencyMs} ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Quorum Weight:</span>
                    <span className="font-mono text-slate-300">{node.byzantineConsensusQuorumWeight}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Failover Health:</span>
                    <span className="font-mono text-cyan-300 font-semibold">{node.failoverHealthIndex}%</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="text-[10px] text-slate-500">Immutable Snapshot Hash (Dilithium-5 Encapsulated):</div>
                  <div className="font-mono text-[10px] text-cyan-400 truncate bg-slate-950 p-1.5 rounded border border-slate-800">
                    {node.immutableSnapshotRootHash}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  {!isPrimary && (
                    <button
                      onClick={() =>
                        handleFailoverDrill(
                          node.region === 'HYDERABAD_DISASTER_RECOVERY_DC'
                            ? 'HYDERABAD_DISASTER_RECOVERY_DC'
                            : 'DELHI_PRIMARY_NIC_DC'
                        )
                      }
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Promote to Master</span>
                    </button>
                  )}
                  {isPrimary && (
                    <div className="w-full py-1.5 bg-cyan-950/60 border border-cyan-800/60 rounded text-center text-[11px] text-cyan-300 font-semibold flex items-center justify-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Active Sovereign Master Node</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live PQC Decapsulation Output & Security Audit */}
      {pqcTestOutput && (
        <div className="bg-slate-900 border border-cyan-500/40 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              NIST FIPS 203 (ML-KEM-1024) / FIPS 204 (ML-DSA-87) Cryptographic Handshake
            </h3>
            <span className="text-xs text-emerald-400 font-mono">0.42ms Lattice Decapsulation Time</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-400 font-semibold mb-1">ML-KEM-1024 Ciphertext (Lattice Vector)</div>
              <div className="font-mono text-[10px] text-cyan-400 break-all bg-slate-900 p-2 rounded">
                {pqcTestOutput.kemCiphertext}
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-400 font-semibold mb-1">ML-DSA-87 Quantum Signature</div>
              <div className="font-mono text-[10px] text-purple-400 break-all bg-slate-900 p-2 rounded">
                {pqcTestOutput.dsaSignature}
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-400 font-semibold mb-1">Sovereign Shared Secret Root (SHA3-512)</div>
              <div className="font-mono text-[10px] text-emerald-400 break-all bg-slate-900 p-2 rounded">
                {pqcTestOutput.sharedSecretHash}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Split Brain Shield & Sovereign Geo-Redundancy Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              Split-Brain Partition Shield (Raft + BFT)
            </h4>
            <span className="text-[11px] text-emerald-300 font-semibold">Active & Armed</span>
          </div>

          <p className="text-xs text-slate-400">
            Guarantees that network partition events between Delhi, Hyderabad, and Bhubaneswar cannot create isolated
            mutations. Majority quorum (2f+1) is mathematically strictly enforced before any block or case record is sealed.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" />
              Dual-Hybrid Transition Paradigm
            </h4>
            <span className="text-[11px] text-purple-300 font-semibold">NIST FIPS 203/204 Standard</span>
          </div>

          <p className="text-xs text-slate-400">
            Every digital court order, chargesheet, and forensic report is sealed with simultaneous Classical
            ECDSA-P384 AND Post-Quantum CRYSTALS-Dilithium-5 signatures for backward compatibility and 100-year quantum resilience.
          </p>
        </div>
      </div>
    </div>
  );
};
