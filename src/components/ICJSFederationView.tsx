import React, { useState } from 'react';
import { SupportedLanguage, ICJSPillar, ICJSTransaction, ICJSPillarStatus } from '../types';
import { icjsService } from '../services/icjsService';
import { storageService } from '../services/storageService';
import {
  Network,
  Server,
  RefreshCw,
  Send,
  CheckCircle2,
  Shield,
  Clock,
  ArrowRight,
  Database,
  Lock,
  Code2,
  Activity,
  AlertTriangle,
  FileCheck,
  Building2,
} from 'lucide-react';

interface ICJSFederationViewProps {
  language: SupportedLanguage;
}

export const ICJSFederationView: React.FC<ICJSFederationViewProps> = ({ language: _language }) => {
  const [pillars, setPillars] = useState<ICJSPillarStatus[]>(icjsService.getPillars());
  const [transactions, setTransactions] = useState<ICJSTransaction[]>(icjsService.getTransactions());
  const [selectedTx, setSelectedTx] = useState<ICJSTransaction | null>(transactions[0] || null);

  // Sync Form State
  const [sourcePillar, setSourcePillar] = useState<ICJSPillar>('CCTNS_POLICE');
  const [targetPillar, setTargetPillar] = useState<ICJSPillar>('E_COURTS');
  const [actionType, setActionType] = useState<ICJSTransaction['actionType']>('CHARGE_SHEET_DISPATCH');
  const [selectedCaseNumber, setSelectedCaseNumber] = useState('FIR-2026-CR-0982');
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'transactions' | 'openapi' | 'topology'>('matrix');

  const cases = storageService.getCases();

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const tx = await icjsService.executeICJSSync(
        sourcePillar,
        targetPillar,
        actionType,
        selectedCaseNumber
      );
      setTransactions([...icjsService.getTransactions()]);
      setPillars([...icjsService.getPillars()]);
      setSelectedTx(tx);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  const getPillarColor = (pillar: ICJSPillar) => {
    switch (pillar) {
      case 'CCTNS_POLICE':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'E_FORENSICS':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'E_PROSECUTION':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'E_COURTS':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'E_PRISONS':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                <Network className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  ICJS 2.0 Inter-Agency Federation Grid
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                    NATIONAL MESH LIVE
                  </span>
                </h1>
                <p className="text-xs text-slate-300">
                  Interoperable Criminal Justice System 2.0 • Real-Time Synchronized Cryptographic Bus connecting Police, Forensics, Prosecution, Courts & Prisons
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="text-right mr-3 hidden sm:block">
              <div className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Mesh Encryption</div>
              <div className="text-xs font-mono text-indigo-300 font-semibold">mTLS 1.3 + SHA-256 HMAC</div>
            </div>
            <button
              onClick={() => {
                setPillars([...icjsService.getPillars()]);
                setTransactions([...icjsService.getTransactions()]);
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Synapses</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 mt-5 gap-1">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-slate-800 text-indigo-400 border-t-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Inter-Agency Matrix & Quick Dispatch
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-slate-800 text-indigo-400 border-t-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Gateway Ledger ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('topology')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'topology'
                ? 'bg-slate-800 text-indigo-400 border-t-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sovereign Mesh Architecture
          </button>
          <button
            onClick={() => setActiveTab('openapi')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'openapi'
                ? 'bg-slate-800 text-indigo-400 border-t-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            OpenAPI & JSON-LD Specs
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 5 Pillars Status Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-indigo-400" />
                <span>5 Sovereign Pillars of Digital Justice</span>
              </h2>
              <span className="text-[11px] text-emerald-400 font-mono">100% Operational</span>
            </div>

            <div className="space-y-3">
              {pillars.map((p) => {
                const colorClass = getPillarColor(p.pillar);
                return (
                  <div
                    key={p.pillar}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${colorClass}`}>
                          {p.pillar}
                        </span>
                        <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {p.status} ({p.latencyMs}ms)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px]">
                      <div>
                        <div className="text-slate-400 text-[10px]">Endpoint Protocol</div>
                        <div className="font-mono text-slate-200 truncate">{p.protocolVersion}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px]">24h Packet Volume</div>
                        <div className="font-mono text-slate-200">{p.packetsTransferred24h.toLocaleString()} txs</div>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <div className="text-slate-400 text-[10px]">Gateway Key</div>
                        <div className="font-mono text-slate-300 truncate" title={p.gatewayKeyFingerprint}>
                          {p.gatewayKeyFingerprint.substring(0, 16)}...
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Inter-Pillar Sync Trigger Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <Send className="w-4 h-4 text-indigo-400" />
                <span>Inter-Pillar Cryptographic Dispatcher</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Source Node Pillar</label>
                  <select
                    value={sourcePillar}
                    onChange={(e) => setSourcePillar(e.target.value as ICJSPillar)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="CCTNS_POLICE">Police (CCTNS / e-FIR)</option>
                    <option value="E_FORENSICS">Forensics (e-Forensics / CFSL)</option>
                    <option value="E_PROSECUTION">Prosecution (e-Prosecution DPA)</option>
                    <option value="E_COURTS">Courts (e-Courts CIS 3.2 / NJDG)</option>
                    <option value="E_PRISONS">Prisons (e-Prisons Custody)</option>
                  </select>
                </div>

                <div className="flex justify-center -my-2 text-slate-500">
                  <ArrowRight className="w-4 h-4 rotate-90 lg:rotate-0 text-indigo-400" />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Destination Node Pillar</label>
                  <select
                    value={targetPillar}
                    onChange={(e) => setTargetPillar(e.target.value as ICJSPillar)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="E_COURTS">Courts (e-Courts CIS 3.2 / NJDG)</option>
                    <option value="E_PROSECUTION">Prosecution (e-Prosecution DPA)</option>
                    <option value="E_FORENSICS">Forensics (e-Forensics / CFSL)</option>
                    <option value="E_PRISONS">Prisons (e-Prisons Custody)</option>
                    <option value="CCTNS_POLICE">Police (CCTNS / e-FIR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Inter-Agency Action Type</label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as ICJSTransaction['actionType'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="CHARGE_SHEET_DISPATCH">E-Charge-Sheet Sec 193 BNSS Filing to Court</option>
                    <option value="E_FIR_TRANSFER">Inter-State FIR Notification & Case Handshake</option>
                    <option value="FSL_REQUISITION">Forensic Evidence Examination Requisition</option>
                    <option value="BAIL_ORDER_SYNC">Judicial Bail Order Sync to Jail Superintendent</option>
                    <option value="PRISONER_PRODUCTION_REQUEST">Custody Production & Video Link Scheduling</option>
                    <option value="INTER_STATE_LOOKUP">Inter-State Criminal Nexus & Record Lookup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target Case File</label>
                  <select
                    value={selectedCaseNumber}
                    onChange={(e) => setSelectedCaseNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {cases.map((c) => (
                      <option key={c.id} value={c.caseNumber}>
                        {c.caseNumber} - {c.title.substring(0, 40)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-lg space-y-1.5 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5 font-semibold text-indigo-300">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Cryptographic Gateway Protocol</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Payload will be signed with the active CCA Digital Signature certificate (SHA-256 with ECDSA) and verified at recipient gateway before commit.
                  </p>
                </div>

                <button
                  onClick={handleTriggerSync}
                  disabled={isSyncing}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Signing & Transmitting Payload...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Execute Inter-Agency Dispatch</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Gateway Transactions ({transactions.length})
            </h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {transactions.map((tx) => {
                const isSelected = selectedTx?.id === tx.id;
                return (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{tx.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          {tx.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{tx.latencyMs}ms</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <span>{tx.sourcePillar.replace('_', ' ')}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className="text-indigo-300">{tx.targetPillar.replace('_', ' ')}</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-amber-400">{tx.caseNumber}</span>
                      <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transaction Detail Inspector */}
          <div className="lg:col-span-5">
            {selectedTx ? (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Transaction Inspector</span>
                    <h3 className="text-sm font-bold text-white font-mono">{selectedTx.id}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono">
                    {selectedTx.status}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px]">Action Type</div>
                    <div className="font-semibold text-indigo-300">{selectedTx.actionType}</div>
                  </div>

                  <div>
                    <div className="text-slate-400 text-[10px]">Case / CNR Number</div>
                    <div className="font-mono text-white">
                      {selectedTx.caseNumber} ({selectedTx.cnrNumber || 'N/A'})
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 text-[10px]">Acknowledgment Code</div>
                    <div className="font-mono text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800">
                      {selectedTx.acknowledgementCode}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 text-[10px]">Payload SHA-256 Digest</div>
                    <div className="font-mono text-[10px] text-slate-300 bg-slate-950 p-2 rounded border border-slate-800 break-all">
                      {selectedTx.payloadDigest}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Digital Gateway Signature (Sec 63 BSA)</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Signer: <strong>{selectedTx.digitalSignature.signerName}</strong> (
                      {selectedTx.digitalSignature.signerDesignation})
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 break-all">
                      Cert: {selectedTx.digitalSignature.certificateId} • {selectedTx.digitalSignature.signatureAlgorithm}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
                Select a transaction from the left list to inspect its cryptographic payload.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Topology & Mesh Architecture Tab */}
      {activeTab === 'topology' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-indigo-400" />
              <span>National Sovereign Digital Justice Architecture (ICJS 2.0 Synaptic Fabric)</span>
            </h2>
            <p className="text-xs text-slate-300">
              Zero-Trust, High-Availability Multi-Tier Judicial Mesh across Union Ministry of Home Affairs, Supreme Court e-Committee & State Law Departments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 bg-blue-950/30 border border-blue-500/30 rounded-xl space-y-2">
              <div className="font-bold text-blue-400 text-xs flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>1. POLICE</span>
              </div>
              <div className="text-[11px] text-slate-300 font-semibold">CCTNS 4.0 / e-FIR</div>
              <p className="text-[10px] text-slate-400">
                FIR intake, GD entry, case diary updates (Sec 175 BNSS), and digital seizure memos.
              </p>
            </div>

            <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-2">
              <div className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                <span>2. FORENSICS</span>
              </div>
              <div className="text-[11px] text-slate-300 font-semibold">e-Forensics / NFSU</div>
              <p className="text-[10px] text-slate-400">
                FSL requisitions, chemical/cyber extractions, calibration logs, and Sec 63 BSA reports.
              </p>
            </div>

            <div className="p-4 bg-purple-950/30 border border-purple-500/30 rounded-xl space-y-2">
              <div className="font-bold text-purple-400 text-xs flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                <span>3. PROSECUTION</span>
              </div>
              <div className="text-[11px] text-slate-300 font-semibold">e-Prosecution DPA</div>
              <p className="text-[10px] text-slate-400">
                Charge-sheet scrutiny, statutory legal opinions, cognizance clearances, and bail objections.
              </p>
            </div>

            <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-2">
              <div className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                <Server className="w-4 h-4" />
                <span>4. COURTS</span>
              </div>
              <div className="text-[11px] text-slate-300 font-semibold">e-Courts 4.0 / NJDG</div>
              <p className="text-[10px] text-slate-400">
                E-Filing intake, judicial cognizance, trial proceedings, bail orders, and certified copies.
              </p>
            </div>

            <div className="p-4 bg-rose-950/30 border border-rose-500/30 rounded-xl space-y-2">
              <div className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>5. PRISONS</span>
              </div>
              <div className="text-[11px] text-slate-300 font-semibold">e-Prisons Custody</div>
              <p className="text-[10px] text-slate-400">
                Undertrial custody tracking, production warrant execution, video conferencing hearings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* OpenAPI Specs Tab */}
      {activeTab === 'openapi' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>ICJS 2.0 JSON-LD Sovereign Gateway Schema Specification</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              OpenAPI 3.1.0 Compatible
            </span>
          </div>

          <pre className="p-4 bg-slate-950 rounded-lg text-[11px] font-mono text-emerald-400 overflow-x-auto border border-slate-800 max-h-[450px]">
{`{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "@context": "https://justice.gov.in/icjs/v2/context.jsonld",
  "title": "National Sovereign Digital Justice ICJS 2.0 Inter-Agency Interchange Record",
  "type": "object",
  "required": [
    "transactionId",
    "timestamp",
    "sourcePillar",
    "targetPillar",
    "payloadDigest",
    "digitalSignature",
    "statutoryActReferences"
  ],
  "properties": {
    "transactionId": { "type": "string", "example": "TX-ICJS-2026-9901" },
    "sourcePillar": { "type": "string", "enum": ["CCTNS_POLICE", "E_FORENSICS", "E_PROSECUTION", "E_COURTS", "E_PRISONS"] },
    "targetPillar": { "type": "string", "enum": ["CCTNS_POLICE", "E_FORENSICS", "E_PROSECUTION", "E_COURTS", "E_PRISONS"] },
    "caseNumber": { "type": "string", "example": "FIR-2026-CR-0982" },
    "cnrNumber": { "type": "string", "example": "DLHC01-008921-2026" },
    "statutoryActReferences": {
      "type": "array",
      "items": { "type": "string" },
      "example": ["Section 193 BNSS", "Section 63 BSA"]
    },
    "payloadDigest": { "type": "string", "format": "sha256" },
    "digitalSignature": {
      "type": "object",
      "properties": {
        "certificateId": { "type": "string" },
        "signatureAlgorithm": { "type": "string", "enum": ["SHA256withECDSA", "SHA256withRSA"] },
        "signatureHex": { "type": "string" },
        "publicKeyFingerprint": { "type": "string" }
      }
    }
  }
}`}
          </pre>
        </div>
      )}
    </div>
  );
};
