import { DocumentType, DocumentClassification, DigitalSignature, UserRole } from './index';

export interface DocumentVersion {
  versionId: string;
  versionNumber: number;
  documentId: string;
  caseId: string;
  caseNumber: string;
  title: string;
  fileFormat: 'PDF' | 'IMAGE_PNG' | 'IMAGE_JPG' | 'JSON' | 'TEXT' | 'RAW_BINARY';
  fileSizeKb: number;
  sha256Hash: string;
  previousVersionHash: string;
  storageUri: string;
  encryptionAlgorithm: 'AES-256-GCM';
  encryptionKeyId: string;
  modifiedBy: {
    name: string;
    badgeId: string;
    role: string;
    department: string;
  };
  timestamp: string;
  changeReason: string;
  changeCategory: 'INITIAL_CREATION' | 'SUPPLEMENTARY_EVIDENCE' | 'TYPOGRAPHICAL_CORRECTION' | 'PII_REDACTION' | 'FORENSIC_AMENDMENT' | 'COURT_ORDERED_UPDATE';
  digitalSignature: DigitalSignature;
  blockchainTxId: string;
  blockNumber: number;
  content: string;
  isCurrentVersion: boolean;
  redactionMasksCount?: number;
}

export interface VersionDiffResult {
  versionA: DocumentVersion;
  versionB: DocumentVersion;
  hasHashChanged: boolean;
  addedLinesCount: number;
  removedLinesCount: number;
  diffChunks: Array<{
    type: 'SAME' | 'ADDED' | 'REMOVED';
    text: string;
  }>;
}

export interface RedactionMask {
  id: string;
  targetTerm: string;
  maskReplacement: string;
  statutoryReason: 'VICTIM_IDENTITY_PROTECTION' | 'CONFIDENTIAL_INFORMANT' | 'NATIONAL_SECURITY' | 'JUVENILE_PROTECTION';
  occurrencesMasked: number;
}
