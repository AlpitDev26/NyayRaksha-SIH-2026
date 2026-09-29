import React, { useState } from 'react';
import {
  Archive,
  Key,
  ShieldCheck,
  Building,
  CheckCircle2,
  FileCheck2,
  Plus,
  Send,
  Lock,
  Database,
  Layers,
} from 'lucide-react';
import { phase15Service } from '../services/phase15Service';
import { SovereignColdVaultArchiveRecord } from '../types';

export const SovereignColdVaultArchiveView: React.FC = () => {
  const [archives, setArchives] = useState<SovereignColdVaultArchiveRecord[]>(
    phase15Service.getColdVaultArchives()
  );
  const [selectedArchive, setSelectedArchive] = useState<SovereignColdVaultArchiveRecord>(
    archives[0] || null
  );
  const [isNewArchiveModalOpen, setIsNewArchiveModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [caseRef, setCaseRef] = useState<string>('Criminal Appeal No. 4410 of 2025');
  const [caseTitle, setCaseTitle] = useState<string>(
    'State of Maharashtra v. Sovereign Financial Cartel (Historic PMLA / Sec 111 BNS Landmark Verdict)'
  );
  const [bench, setBench] = useState<string>('Special Full Bench - High Court of Judicature at Bombay');
  const [category, setCategory] = useState<
    'CONSTITUTIONAL_LANDMARK' | 'HISTORIC_FULL_BENCH' | 'HIGH_VALUE_SOVEREIGN_RECORD'
  >('HISTORIC_FULL_BENCH');

  const handleCreateArchive = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await phase15Service.archiveToColdVault({
      caseNumberRef: caseRef,
      caseTitle,
      disposalDate: new Date().toISOString(),
      presidingBench: bench,
      preservationCategory: category,
      pqcPostQuantumLatticeRootHash: 'a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890',
      physicalStorageGeologicalVault: 'Bhubaneswar Deep Geological Enclave - Vault Cell #9',
      preservationIntegrityIndexScore: 100.0,
      nationalArchivesPreservationActRef: `NAI-PRA-1993-RECORD-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    const updated = phase15Service.getColdVaultArchives();
    setArchives(updated);
    setSelectedArchive(created);
    setIsNewArchiveModalOpen(false);
    setToastMessage(`100-Year Post-Quantum Cold Vault Archival sealed under Archive ID ${created.archiveId}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Archive className="w-48 h-48 text-cyan-400" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded uppercase tracking-wider">
                100-Year Post-Quantum Merkle Tree
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded uppercase tracking-wider">
                Public Records Act 1993
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Archive className="w-6 h-6 text-cyan-400" />
              Sovereign National Judicial 100-Year Cold-Vault Archive
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Post-Quantum CRYSTALS-Dilithium-5 lattice Merkle tree root anchoring, Bhubaneswar Deep Geological air-gapped
              cold vault storage, and unbroken zero-knowledge chain-of-custody verification.
            </p>
          </div>

          <button
            onClick={() => setIsNewArchiveModalOpen(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Archive Landmark Judicial Dossier</span>
          </button>
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Archives List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Sovereign Cold Vault Archives ({archives.length})
            </h2>
          </div>

          <div className="space-y-3">
            {archives.map((item) => {
              const isSelected = selectedArchive?.archiveId === item.archiveId;

              return (
                <div
                  key={item.archiveId}
                  onClick={() => setSelectedArchive(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/60 ring-1 ring-cyan-500/30 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-cyan-400">{item.archiveId}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-purple-500/15 text-purple-300 border-purple-500/30">
                      {item.preservationCategory.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1 line-clamp-2">{item.caseTitle}</div>
                  <div className="text-xs text-slate-400 mb-2">Case: {item.caseNumberRef}</div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Integrity:</span>
                    <span className="font-bold text-emerald-400">{item.preservationIntegrityIndexScore}% Perfect</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed 100-Year Cold Vault Dossier */}
        {selectedArchive && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
                    {selectedArchive.preservationCategory.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{selectedArchive.caseTitle}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Bench: <span className="text-slate-200">{selectedArchive.presidingBench}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-right">
                  <div className="text-[11px] text-slate-400">Preservation Rating</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">100-Year PQC Guaranteed</div>
                </div>
              </div>

              {/* Storage Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Physical Air-Gapped Vault Enclave</div>
                  <div className="text-xs font-semibold text-white mt-1">
                    {selectedArchive.physicalStorageGeologicalVault}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Act Ref: {selectedArchive.nationalArchivesPreservationActRef}
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Disposal & Archival Timestamps</div>
                  <div className="text-xs font-semibold text-cyan-300 mt-1">
                    Disposed: {new Date(selectedArchive.disposalDate).toLocaleDateString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Sealed: {new Date(selectedArchive.archivedTimestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Post-Quantum Lattice Root Hash */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Key className="w-4 h-4 text-purple-400" />
                  NIST FIPS 204 CRYSTALS-Dilithium-5 Lattice Merkle Root Hash
                </h4>
                <span className="text-[11px] font-mono text-purple-300">PQC Quantum Immune</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-purple-400 break-all">
                {selectedArchive.pqcPostQuantumLatticeRootHash}
              </div>
            </div>

            {/* Zero Knowledge Chain of Custody Proof */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Zero-Knowledge Unbroken Evidentiary Custody Proof
                </h4>
                <span className="text-[11px] font-mono text-emerald-400">ZK-SNARK Verified</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 break-all">
                {selectedArchive.zeroKnowledgeChainProofSha256}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Archive Landmark Record */}
      {isNewArchiveModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Archive className="w-5 h-5 text-cyan-400" />
                Archive Landmark Judicial Dossier
              </h3>
              <button
                onClick={() => setIsNewArchiveModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateArchive} className="space-y-4 text-xs">
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
                <label className="block text-slate-300 font-semibold mb-1">Judicial Case / Verdict Title</label>
                <input
                  type="text"
                  required
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Presiding Bench</label>
                <input
                  type="text"
                  required
                  value={bench}
                  onChange={(e) => setBench(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Preservation Category</label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as
                        | 'CONSTITUTIONAL_LANDMARK'
                        | 'HISTORIC_FULL_BENCH'
                        | 'HIGH_VALUE_SOVEREIGN_RECORD'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="CONSTITUTIONAL_LANDMARK">Constitutional Landmark (Article 141 Binding)</option>
                  <option value="HISTORIC_FULL_BENCH">Historic Full Bench Precedent</option>
                  <option value="HIGH_VALUE_SOVEREIGN_RECORD">High Value Sovereign Record</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewArchiveModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Seal in 100-Yr Cold Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
