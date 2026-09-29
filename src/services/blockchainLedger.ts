import { BlockchainBlock, LedgerTransaction } from '../types';
import { computeSHA256, computeMerkleRoot } from './cryptoEngine';

export interface ChainAuditReport {
  isChainValid: boolean;
  totalBlocks: number;
  totalTransactions: number;
  corruptedBlockIndex?: number;
  reason?: string;
  verifiedAt: string;
  validatorNodesCount: number;
}

export class BlockchainLedgerService {
  private blocks: BlockchainBlock[];

  constructor(initialBlocks: BlockchainBlock[]) {
    this.blocks = [...initialBlocks];
  }

  public getBlocks(): BlockchainBlock[] {
    return [...this.blocks];
  }

  public getLatestBlock(): BlockchainBlock {
    return this.blocks[this.blocks.length - 1];
  }

  public async anchorTransaction(tx: Omit<LedgerTransaction, 'txId' | 'status'>): Promise<{
    transaction: LedgerTransaction;
    block: BlockchainBlock;
  }> {
    const rawTxString = `${tx.timestamp}:${tx.docId}:${tx.sha256Hash}:${tx.signerOrg}:${tx.signatureHex}`;
    const txId = '0x' + (await computeSHA256(rawTxString));

    const confirmedTx: LedgerTransaction = {
      ...tx,
      txId,
      status: 'CONFIRMED',
    };

    const previousBlock = this.getLatestBlock();
    const newBlockNumber = previousBlock ? previousBlock.blockNumber + 1 : 1;
    const previousHash = previousBlock ? previousBlock.blockHash : '0000000000000000000000000000000000000000000000000000000000000000';

    const txHashes = [confirmedTx.sha256Hash];
    const merkleRoot = await computeMerkleRoot(txHashes);
    const timestamp = new Date().toISOString();
    const nonce = Math.floor(100000 + Math.random() * 900000);

    const blockHeaderPayload = `${newBlockNumber}:${timestamp}:${previousHash}:${merkleRoot}:${nonce}:VALIDATOR_SOVEREIGN_NODE_01`;
    const computedHash = await computeSHA256(blockHeaderPayload);
    const blockHash = '0000000000000000000' + computedHash.slice(0, 45);

    const newBlock: BlockchainBlock = {
      blockNumber: newBlockNumber,
      timestamp,
      previousHash,
      blockHash,
      merkleRoot,
      transactions: [confirmedTx],
      nonce,
      validatorNode: 'NODE-01-SUPREME-COURT-NATIONAL-CA',
      validatorSignature: `3045022100${computedHash.slice(0, 54)}0220${computedHash.slice(30, 62)}`,
    };

    this.blocks.push(newBlock);
    return {
      transaction: confirmedTx,
      block: newBlock,
    };
  }

  public findTransactionByHash(sha256Hash: string): {
    found: boolean;
    tx?: LedgerTransaction;
    block?: BlockchainBlock;
  } {
    for (const block of this.blocks) {
      for (const tx of block.transactions) {
        if (tx.sha256Hash.toLowerCase() === sha256Hash.toLowerCase()) {
          return { found: true, tx, block };
        }
      }
    }
    return { found: false };
  }

  public findTransactionByDocId(docId: string): {
    found: boolean;
    tx?: LedgerTransaction;
    block?: BlockchainBlock;
  } {
    for (const block of this.blocks) {
      for (const tx of block.transactions) {
        if (tx.docId === docId) {
          return { found: true, tx, block };
        }
      }
    }
    return { found: false };
  }

  // Cryptographic audit of the entire immutable chain
  public async verifyFullChain(): Promise<ChainAuditReport> {
    let totalTxs = 0;

    for (let i = 0; i < this.blocks.length; i++) {
      const currentBlock = this.blocks[i];
      totalTxs += currentBlock.transactions.length;

      // 1. Verify previous hash link (except genesis/initial block)
      if (i > 0) {
        const prevBlock = this.blocks[i - 1];
        if (currentBlock.previousHash !== prevBlock.blockHash) {
          return {
            isChainValid: false,
            totalBlocks: this.blocks.length,
            totalTransactions: totalTxs,
            corruptedBlockIndex: i,
            reason: `Broken chain link at Block #${currentBlock.blockNumber}. Previous hash mismatch.`,
            verifiedAt: new Date().toISOString(),
            validatorNodesCount: 5,
          };
        }
      }

      // 2. Verify Merkle root recalculation
      const txHashes = currentBlock.transactions.map(t => t.sha256Hash);
      const recalculatedMerkle = await computeMerkleRoot(txHashes);
      if (recalculatedMerkle !== currentBlock.merkleRoot) {
        return {
          isChainValid: false,
          totalBlocks: this.blocks.length,
          totalTransactions: totalTxs,
          corruptedBlockIndex: i,
          reason: `Merkle root corruption in Block #${currentBlock.blockNumber}. Transaction data altered.`,
          verifiedAt: new Date().toISOString(),
          validatorNodesCount: 5,
        };
      }
    }

    return {
      isChainValid: true,
      totalBlocks: this.blocks.length,
      totalTransactions: totalTxs,
      verifiedAt: new Date().toISOString(),
      validatorNodesCount: 5,
    };
  }

  // Method for tamper simulation testing
  public tamperWithBlock(blockIndex: number, fakeHash: string): void {
    if (this.blocks[blockIndex]) {
      if (this.blocks[blockIndex].transactions.length > 0) {
        this.blocks[blockIndex].transactions[0].sha256Hash = fakeHash;
      }
    }
  }

  public resetLedger(initialBlocks: BlockchainBlock[]): void {
    this.blocks = JSON.parse(JSON.stringify(initialBlocks));
  }
}
