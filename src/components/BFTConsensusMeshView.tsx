import React, { useState } from 'react';
import {
  BFTConsensusNode,
  ConsensusRoundEvent,
  DisasterRecoverySnapshot,
  SupportedLanguage,
  UserRole,
} from '../types';
import { phase7Service } from '../services/phase7Service';
import {
  Network,
  Server,
  Activity,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Download,
  Zap,
  Radio,
  Cpu,
  Database,
  Layers,
  Archive,
} from 'lucide-react';

interface BFTConsensusMeshViewProps {
  language: SupportedLanguage;
  currentRole: UserRole;
}

export const BFTConsensusMeshView: React.FC<BFTConsensusMeshViewProps> = ({
  language: _language,
  currentRole: _currentRole,
}) => {
  const [nodes, setNodes] = useState<BFTConsensusNode[]>(() =>
    phase7Service.getBFTNodes()
  );
  const [latestRound, setLatestRound] = useState<ConsensusRoundEvent | null>(null);
  const [isSimulatingRound, setIsSimulatingRound] = useState(false);
  const [snapshot, setSnapshot] = useState<DisasterRecoverySnapshot | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleNode = (nodeId: string) => {
    const updated = phase7Service.toggleNodePartition(nodeId);
    setNodes(updated);
    const node = updated.find((n) => n.nodeId === nodeId);
    showToast(
      `${node?.nodeName} is now ${node?.status === 'SYNCED_HEALTHY' ? 'ONLINE & SYNCED' : 'ISOLATED / PARTITIONED'}.`
    );
  };

  const handleExecuteRound = () => {
    setIsSimulatingRound(true);
    setTimeout(() => {
      const event = phase7Service.executeConsensusRound();
      setLatestRound(event);
      setNodes([...phase7Service.getBFTNodes()]);
      setIsSimulatingRound(false);
      showToast(`Consensus Round #${event.roundId} committed at Block #${event.blockNumber}.`);
    }, 600);
  };

  const handleGenerateSnapshot = () => {
    const snap = phase7Service.createAirgappedDisasterRecoverySnapshot();
    setSnapshot(snap);
    showToast('Air-Gapped Sovereign Black Box Snapshot compiled.');
  };

  const healthyNodesCount = nodes.filter((n) => n.status === 'SYNCED_HEALTHY').length;
  const quorumRequired = Math.ceil((nodes.length * 2) / 3);
  const isQuorumAvailable = healthyNodesCount >= quorumRequired;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500/90 text-slate-950 font-medium px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-amber-300">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 p-5 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-cyan-950/40 border border-cyan-500/40 p-1 flex items-center justify-center shrink-0 shadow-md">
            <Network className="w-7 h-7 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                PBFT 2/3+ BYZANTINE FAULT TOLERANCE
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Radio className="w-3 h-3 animate-pulse" /> MULTI-STATE SDC REPLICATION
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white font-serif tracking-tight mt-0.5">
              Sovereign BFT Distributed Consensus & Disaster Recovery Mesh
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-state cryptographic ledger synchronization across Delhi, Mumbai, Bengaluru, Hyderabad, and Kolkata State Data Centers with air-gapped cold disaster recovery.
            </p>
          </div>
        </div>

        {/* Global Quorum Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`px-3.5 py-2 rounded-lg border text-xs font-mono flex items-center gap-2 ${
              isQuorumAvailable
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/60 border-red-500/50 text-red-300'
            }`}
          >
            {isQuorumAvailable ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
            <div>
              <div className="font-bold">Byzantine Quorum: {healthyNodesCount}/{nodes.length} Nodes</div>
              <div className="text-[10px] text-slate-400">Required: {quorumRequired}+ for Consensus</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions Row */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Consensus Round Engine & Fault Injection</span>
          </h3>
          <p className="text-xs text-slate-400">
            Simulate live block proposals, validator cryptographic voting, or toggle node partitions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExecuteRound}
            disabled={isSimulatingRound || !isQuorumAvailable}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-bold text-xs rounded transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
          >
            {isSimulatingRound ? (
              <>
                <Activity className="w-3.5 h-3.5 animate-spin" />
                <span>Collecting PBFT Signatures...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Simulate Block Consensus Round</span>
              </>
            )}
          </button>

          <button
            onClick={handleGenerateSnapshot}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-700"
          >
            <Archive className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Airgap DR Snapshot</span>
          </button>
        </div>
      </div>

      {/* State Data Center Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map((node) => {
          const isOnline = node.status === 'SYNCED_HEALTHY';
          return (
            <div
              key={node.nodeId}
              className={`p-4 rounded-lg border transition-all ${
                isOnline
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-red-950/20 border-red-500/40'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Server className={`w-4 h-4 ${isOnline ? 'text-cyan-400' : 'text-red-400'}`} />
                  <span className="text-xs font-mono font-bold text-white">{node.nodeId}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isOnline
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'bg-red-950 text-red-400 border border-red-500/40'
                  }`}
                >
                  {isOnline ? 'HEALTHY' : 'PARTITIONED'}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs font-sans">
                <h4 className="font-bold text-slate-200">{node.nodeName}</h4>
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Role: {node.role}</span>
                  <span>IP: {node.ipAddress}</span>
                </div>
              </div>

              <div className="mt-3 p-2.5 bg-slate-950 rounded border border-slate-800/80 text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Block Height:</span>
                  <span className="text-cyan-400 font-bold">#{node.blockHeight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Network Latency:</span>
                  <span className={node.latencyMs > 100 ? 'text-red-400' : 'text-emerald-400'}>
                    {node.latencyMs} ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PBFT Votes Cast:</span>
                  <span className="text-slate-300">{node.signatureCount}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">Weight: {node.stakeOrWeight}%</span>
                <button
                  onClick={() => handleToggleNode(node.nodeId)}
                  className={`px-2 py-1 rounded text-[10px] font-semibold font-mono cursor-pointer transition-colors ${
                    isOnline
                      ? 'bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300'
                      : 'bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {isOnline ? 'Inject Network Fault' : 'Restore Connection'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Consensus Event Log & DR Snapshot (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Round Telemetry */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Latest PBFT Consensus Round Telemetry</span>
            </h3>
            {latestRound && (
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[10px] font-mono rounded">
                {latestRound.consensusState}
              </span>
            )}
          </div>

          {latestRound ? (
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Round ID:</span>
                <span className="text-white font-bold">#{latestRound.roundId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Block Number:</span>
                <span className="text-cyan-400 font-bold">#{latestRound.blockNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Proposed By:</span>
                <span className="text-slate-200">{latestRound.proposedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transactions Included:</span>
                <span className="text-amber-400 font-bold">{latestRound.txCount} txs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Validator Signatures:</span>
                <span className="text-emerald-400 font-bold">
                  {latestRound.signaturesGathered}/{nodes.length} (Quorum Met)
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">State Root Hash:</span>
                <span className="text-slate-300 truncate max-w-[200px]">{latestRound.stateRootHash}</span>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-950 rounded-lg border border-slate-800 text-center text-xs text-slate-400">
              Click &quot;Simulate Block Consensus Round&quot; to witness live PBFT validation.
            </div>
          )}
        </div>

        {/* Disaster Recovery Snapshot Preview */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Archive className="w-4 h-4 text-amber-400" />
              <span>Air-Gapped Sovereign Black Box Snapshot</span>
            </h3>
            {snapshot && (
              <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 text-[10px] font-mono rounded">
                READY
              </span>
            )}
          </div>

          {snapshot ? (
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Snapshot ID:</span>
                <span className="text-amber-400 font-bold">{snapshot.snapshotId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Cases Synchronized:</span>
                <span className="text-white font-bold">{snapshot.totalCasesCount} cases</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Ledger Digest:</span>
                <span className="text-emerald-400">{snapshot.totalLedgerHash.slice(0, 24)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Root Airgap Seal:</span>
                <span className="text-cyan-300">{snapshot.airgapSignature}</span>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => showToast('Disaster Recovery JSON bundle exported.')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download .sovereign-dr.json</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-950 rounded-lg border border-slate-800 text-center text-xs text-slate-400">
              Click &quot;Export Airgap DR Snapshot&quot; to produce an immutable sovereign state point.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
