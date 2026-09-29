import { CaseStage, DocumentClassification } from './index';

export type SupportedFIRLanguage =
  | 'en'
  | 'hi'
  | 'mr'
  | 'bn'
  | 'gu'
  | 'ta'
  | 'te'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or'
  | 'as'
  | 'ur';

export interface FIRLanguageMetadata {
  code: SupportedFIRLanguage;
  name: string;
  nativeName: string;
  script: string;
  sampleComplainantStatement: string;
}

export interface CaseDiaryEntry {
  id: string;
  caseId: string;
  caseNumber: string;
  entryNumber: number;
  entryDate: string;
  timeFrom: string;
  timeTo: string;
  investigationOfficer: string;
  badgeId: string;
  placesVisited: string[];
  investigationSummary: string;
  witnessesExamined: string[];
  seizuresEffected: string[];
  digitalSignatureHex: string;
  sha256Hash: string;
  blockchainTxId?: string;
  createdAt: string;
}

export interface InvestigationTask {
  id: string;
  caseId: string;
  caseNumber: string;
  title: string;
  description: string;
  category: 'WITNESS_EXAMINATION' | 'FORENSIC_REQUISITION' | 'CYBER_IP_TRACE' | 'SEARCH_SEIZURE' | 'ARREST_REMAND' | 'CHARGE_SHEET_DRAFT';
  priority: 'ROUTINE' | 'URGENT' | 'HIGH';
  assignedToOfficer: string;
  assignedOfficerBadge: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ESCALATED';
  findingsNotes?: string;
  completedAt?: string;
}

export interface WitnessStatementRecord {
  id: string;
  caseId: string;
  caseNumber: string;
  witnessName: string;
  witnessAge: number;
  witnessAddress: string;
  witnessContact: string;
  statementType: 'SEC_180_BNSS_POLICE' | 'SEC_183_BNSS_MAGISTRATE_CONFESSION' | 'PANCH_WITNESS';
  statementVerbatim: string;
  recordedLanguage: SupportedFIRLanguage;
  recordingOfficer: string;
  officerBadge: string;
  sha256Digest: string;
  digitalSignatureHex: string;
  recordedAt: string;
  isSignedByWitness: boolean;
}

export interface MultilingualFIRPayload {
  caseNumber: string;
  policeStation: string;
  district: string;
  state: string;
  courtName: string;
  firLanguage: SupportedFIRLanguage;
  complainantName: string;
  complainantPhone: string;
  complainantAddress: string;
  accusedList: Array<{
    name: string;
    alias?: string;
    address?: string;
    status: 'UNKNOWN' | 'DETAINED' | 'IN_JUDICIAL_CUSTODY' | 'ABSCONDING' | 'ON_BAIL';
  }>;
  incidentDateTime: string;
  incidentPlace: string;
  actsAndSections: string[];
  verbatimStatementOriginal: string;
  translatedStatementEnglish?: string;
  isAiTranslated: boolean;
  officerName: string;
  officerBadge: string;
  officerDept: string;
}
