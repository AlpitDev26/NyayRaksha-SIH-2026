import React, { useState } from 'react';
import { BlockchainBlock, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { storageService } from '../services/storageService';
import { ChainAuditReport } from '../services/blockchainLedger';
import {
  Database,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Layers,
  Key,
  CheckCircle,
  Copy,
  Check,
  Search,
  Zap,
} from 'lucide-react';

interface BlockchainExplorerViewProps {
  language: SupportedLanguage;
  onRefresh: () => void;
}

export const BlockchainExplorerView: React.FC<BlockchainExplorerViewProps> = ({
  language,
  onRefresh,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const blocks = storageService.ledger.getBlocks().slice().reverse();
  const [auditReport, setAuditReport] = useState<ChainAuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [tamperTargetBlock, setTamperTargetBlock] = useState<number>(blocks[0]?.blockNumber || 1040);

  const handleRunFullAudit = async () => {
    setIsAuditing(true);
    try {
      const report = await storageService.ledger.verifyFullChain();
      setAuditReport(report);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSimulateTampering = (blockNum: number) => {
    const rawBlocks = storageService.ledger.getBlocks();
    const targetIdx = rawBlocks.findIndex((b) => b.blockNumber === blockNum);
    if (targetIdx >= 0) {
      storageService.ledger.tamperWithBlock(
        targetIdx,
        'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      );
      handleRunFullAudit();
      onRefresh();
    }
  };

  const handleResetLedger = () => {
    storageService.resetAllData();
    setAuditReport(null);
    onRefresh();
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/30 p-5 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
            <Database className="w-3.5 h-3.5" />
            <span>PROOF-OF-AUTHORITY SOVEREIGN CONSENSUS</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white font-serif tracking-tight mt-0.5">
            NyayRaksha Sovereign Justice Blockchain Ledger Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
            Decentralized, immutable audit record maintaining SHA-256 Merkle proofs and digital certificate signatures across 5 sovereign government validator nodes.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRunFullAudit}
            disabled={isAuditing}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing Ledger...' : 'Audit Entire Blockchain'}</span>
          </button>
          <button
            onClick={handleResetLedger}
            className="px-3 py-2 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded transition-colors cursor-pointer"
          >
            Reset Ledger
          </button>
        </div>
      </div>

      {/* Audit Report Banner */}
      {auditReport && (
        <div
          className={`p-4 rounded-lg border flex items-center justify-between gap-4 ${
            auditReport.isChainValid
              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
              : 'bg-red-950/60 border-red-500/80 text-red-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {auditReport.isChainValid ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />
            )}
            <div>
              <div className="font-bold text-sm font-serif">
                {auditReport.isChainValid
                  ? 'FULL CHAIN INTEGRITY AUDIT PASSED: 100% CONSENSUS'
                  : 'INTEGRITY BREACH DETECTED DURING AUDIT'}
              </div>
              <div className="text-xs opacity-90 mt-0.5">
                {auditReport.isChainValid
                  ? `All ${auditReport.totalBlocks} blocks and ${auditReport.totalTransactions} transactions verified against Merkle roots and validator signatures.`
                  : auditReport.reason}
              </div>
            </div>
          </div>
          <div className="text-right font-mono text-xs opacity-80 shrink-0">
            Validated across {auditReport.validatorNodesCount} Sovereign Nodes
          </div>
        </div>
      )}

      {/* Interactive Tamper Attack Simulation Controls */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white text-xs flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Interactive Malicious Tampering Attack Sandbox</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Simulate Bad Actor Vector</span>
        </div>
        <p className="text-xs text-slate-400">
          Inject a modified document hash directly into any blockchain block to witness the cryptographic consensus engine immediately detect and isolate the tampered block.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {blocks.map((b) => (
            <button
              key={b.blockNumber}
              onClick={() => handleSimulateTampering(b.blockNumber)}
              className="px-3 py-1.5 bg-slate-950 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-800 hover:border-red-600/60 rounded text-xs font-mono transition-colors cursor-pointer"
            >
              Tamper with Block #{b.blockNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Block Stream Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Block Height: #{blocks[0]?.blockNumber || 0}</span>
          <span>Consensus Nodes: Supreme Court, MHA, CFSL, DoP, High Court</span>
        </div>

        <div className="space-y-3">
          {blocks.map((block) => (
            <div
              key={block.blockNumber}
              className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-all space-y-3"
            >
              {/* Block Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded font-mono font-bold text-xs">
                    Block #{block.blockNumber}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="font-mono text-xs text-slate-400">
                    {block.timestamp.replace('T', ' ').slice(0, 19)} UTC
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="font-mono text-xs text-amber-400">Nonce: {block.nonce}</span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 truncate max-w-sm">
                  Validator: {block.validatorNode}
                </div>
              </div>

              {/* Hashes & Merkle Root */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-500">Block Hash:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300 truncate max-w-[200px]">{block.blockHash}</span>
                    <button
                      onClick={() => copyHash(block.blockHash)}
                      className="text-slate-500 hover:text-white p-0.5 cursor-pointer"
                    >
                      {copiedHash === block.blockHash ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-500">Previous Hash:</span>
                  <span className="text-slate-400 truncate max-w-[200px]">{block.previousHash}</span>
                </div>
              </div>

              <div className="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-[11px] flex items-center justify-between text-slate-400">
                <span>Merkle Root:</span>
                <span className="text-purple-300 truncate max-w-md">{block.merkleRoot}</span>
              </div>

              {/* Transactions in Block */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Transactions Committed ({block.transactions.length})
                </div>

                {block.transactions.map((tx) => (
                  <div
                    key={tx.txId}
                    className="p-2.5 bg-slate-950/80 rounded border border-slate-800 text-xs font-mono space-y-1"
                  >
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-bold text-amber-400">{tx.caseNumber}</span>
                      <span className="text-emerald-400 text-[10px]">[{tx.documentType}]</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Document SHA-256:</span>
                      <span className="text-slate-200 truncate max-w-sm">{tx.sha256Hash}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[10px] pt-0.5 border-t border-slate-900">
                      <span>Signer: {tx.signerOrg} ({tx.signerRole})</span>
                      <span className="text-purple-400 truncate max-w-[180px]">Tx: {tx.txId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
