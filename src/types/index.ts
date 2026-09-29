export type UserRole = 
  | 'investigating_officer'
  | 'forensic_examiner'
  | 'public_prosecutor'
  | 'judicial_magistrate'
  | 'court_registrar'
  | 'sovereign_auditor';

export type CaseStage =
  | 'fir_registered'
  | 'investigation'
  | 'evidence_collected'
  | 'forensic_analysis'
  | 'charge_sheet_draft'
  | 'prosecution_scrutiny'
  | 'court_efiling'
  | 'judicial_trial'
  | 'judgment_delivered'
  | 'archived';

export type DocumentClassification = 'UNCLASSIFIED' | 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';

export type DocumentType =
  | 'FIR'
  | 'CASE_DIARY'
  | 'WITNESS_STATEMENT'
  | 'SEIZURE_MEMO'
  | 'ARREST_MEMO'
  | 'FORENSIC_FSL_REPORT'
  | 'CYBER_EXTRACTION_LOG'
  | 'AUTOPSY_INQUEST'
  | 'CHARGE_SHEET'
  | 'PROSECUTION_OPINION'
  | 'BAIL_ORDER'
  | 'JUDICIAL_WARRANT'
  | 'COURT_ORDER_SHEET'
  | 'FINAL_JUDGMENT'
  | 'CERTIFIED_EXTRACT';

export type EvidenceCategory =
  | 'DIGITAL'
  | 'BALLISTICS'
  | 'BIOLOGICAL_DNA'
  | 'DOCUMENTARY'
  | 'NARCOTICS'
  | 'FINANCIAL_RECORDS'
  | 'WEAPON'
  | 'VEHICLE';

export interface DigitalSignature {
  signerName: string;
  signerRole: string;
  signerDesignation: string;
  organization: string;
  certificateId: string;
  signatureAlgorithm: 'SHA256withECDSA' | 'SHA256withRSA';
  signatureHex: string;
  timestamp: string;
  publicKeyFingerprint: string;
  isValid: boolean;
}

export interface DocumentRecord {
  id: string;
  caseId: string;
  caseNumber: string;
  title: string;
  documentType: DocumentType;
  classification: DocumentClassification;
  fileFormat: 'PDF' | 'IMAGE_PNG' | 'IMAGE_JPG' | 'JSON' | 'TEXT' | 'RAW_BINARY';
  fileSizeKb: number;
  sha256Hash: string;
  previousVersionHash?: string;
  storageUri: string;
  encryptionAlgorithm: 'AES-256-GCM';
  encryptionKeyId: string;
  uploadedBy: {
    name: string;
    badgeId: string;
    role: UserRole;
    department: string;
  };
  createdAt: string;
  digitalSignatures: DigitalSignature[];
  blockchainTxId?: string;
  blockNumber?: number;
  isAnchored: boolean;
  tamperState: 'VERIFIED' | 'TAMPERED' | 'UNANCHORED';
  summary?: string;
  metadata: Record<string, string | number | boolean>;
  fileContentPreview?: string;
}

export interface CustodyTransferRecord {
  id: string;
  timestamp: string;
  fromOfficer: string;
  fromDepartment: string;
  toOfficer: string;
  toDepartment: string;
  purpose: string;
  location: string;
  sealCondition: 'INTACT_SEALED' | 'BROKEN_FOR_LAB' | 'RE_SEALED_WITH_SEC_BARCODE';
  signature: DigitalSignature;
  txHash: string;
}

export interface EvidenceItem {
  id: string;
  caseId: string;
  evidenceCode: string; // e.g. EVD-2026-DL-8821
  title: string;
  category: EvidenceCategory;
  description: string;
  collectedAt: string;
  collectedLocation: string;
  collectingOfficer: string;
  seizureMemoDocId: string;
  currentCustodian: string;
  custodianDepartment: string;
  storageVaultLocation: string;
  sha256Checksum: string;
  barcodeQr: string;
  tamperSealNumber: string;
  sealStatus: 'INTACT_VERIFIED' | 'UNDER_EXAMINATION' | 'TAMPER_FLAGGED';
  chainOfCustody: CustodyTransferRecord[];
  forensicReportDocId?: string;
  blockchainAnchored: boolean;
  txHash: string;
}

export interface ForensicReport {
  id: string;
  caseId: string;
  fslRefNumber: string; // e.g. CFSL/DL/2026/CYBER-409
  examinerName: string;
  examinerBadge: string;
  laboratory: string;
  evidenceItemId: string;
  testType: string;
  methodology: string;
  findings: string;
  conclusion: string;
  confidenceScore: number;
  instrumentCalibrationRef: string;
  rawExtractionHash: string;
  reportHash: string;
  dateCompleted: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ADMITTED_IN_COURT';
  signature: DigitalSignature;
  blockchainTxId: string;
}

export interface CaseFile {
  id: string;
  caseNumber: string; // e.g. FIR-2026-CR-0982
  cnrNumber?: string; // e.g. DLHC01-008921-2026
  courtName: string;
  policeStation: string;
  jurisdictionState: string;
  title: string;
  legalActsAndSections: string[]; // e.g. ["BNS Sec 316 (Criminal Breach of Trust)", "BNS Sec 318 (Cheating)", "IT Act Sec 66C"]
  firDate: string;
  stage: CaseStage;
  priority: 'ROUTINE' | 'URGENT' | 'HIGH_SENSITIVITY' | 'NATIONAL_SECURITY';
  leadInvestigator: {
    name: string;
    rank: string;
    badgeId: string;
    phone: string;
  };
  complainant: {
    name: string;
    contact: string;
    address: string;
  };
  accused: Array<{
    name: string;
    alias?: string;
    status: 'ABSCONDING' | 'IN_JUDICIAL_CUSTODY' | 'ON_BAIL' | 'DETAINED' | 'UNKNOWN';
    custodyLocation?: string;
  }>;
  witnessCount: number;
  documents: DocumentRecord[];
  evidenceItems: EvidenceItem[];
  forensicReports: ForensicReport[];
  hearingDates: Array<{
    date: string;
    purpose: string;
    bench: string;
    outcome?: string;
  }>;
  chargeSheetDraft?: {
    datePrepared: string;
    sectionsCharged: string[];
    prosecutionCognizanceReview: 'PENDING' | 'APPROVED' | 'AMENDMENT_REQUIRED';
    prosecutorNotes?: string;
    summaryOfEvidence: string;
  };
  judicialJudgment?: {
    deliveryDate: string;
    presidingJudge: string;
    verdict: 'CONVICTED' | 'ACQUITTED' | 'PARTIALLY_CONVICTED' | 'DISMISSED';
    sentenceSummary?: string;
    certifiedCopyDocId?: string;
  };
  createdTimestamp: string;
  lastUpdatedTimestamp: string;
  merkleRoot: string;
  tamperStatus: 'CLEAN_VERIFIED' | 'TAMPER_ALERT';
}

export interface LedgerTransaction {
  txId: string;
  timestamp: string;
  docId: string;
  caseNumber: string;
  documentType: DocumentType | 'EVIDENCE_ANCHOR' | 'CUSTODY_HANDOVER' | 'JUDICIAL_ORDER';
  sha256Hash: string;
  docStorageUri: string;
  metadataDigest: string;
  signatureHex: string;
  signerOrg: string;
  signerRole: string;
  status: 'CONFIRMED' | 'PENDING';
}

export interface BlockchainBlock {
  blockNumber: number;
  timestamp: string;
  previousHash: string;
  blockHash: string;
  merkleRoot: string;
  transactions: LedgerTransaction[];
  nonce: number;
  validatorNode: string;
  validatorSignature: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'mr' | 'gu';

// --- Phase 5: Sovereign Legal AI & Judicial Decision Support Types ---

export interface BailEvaluationFactors {
  accusedName: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  priorConvictionsCount: number;
  isFirstTimeOffender: boolean;
  custodyDaysSpent: number;
  maximumStatutoryTermMonths: number;
  flightRiskIndicators: {
    hasValidPassport: boolean;
    hasForeignBankAccounts: boolean;
    localPermanentResident: boolean;
    gainfullyEmployed: boolean;
    hasFamilyDependents: boolean;
  };
  tamperingRiskIndicators: {
    victimIsVulnerableOrMinor: boolean;
    hasCoercedWitnesses: boolean;
    possessesAdminAccessToDigitalEvidence: boolean;
    coAccusedAbsconding: boolean;
  };
  offenseClassification: {
    isHeinous: boolean; // Punishable with > 7 years
    isEconomicOffenseOver1Cr: boolean;
    isNarcoticsCommercialQuantity: boolean;
    isSexualOffenceOrPOCSO: boolean;
  };
}

export interface BailEvaluationResult {
  overallRiskScore: number; // 0 to 100 (Higher = higher risk)
  recommendation: 'GRANT_REGULAR_BAIL' | 'GRANT_CONDITIONAL_BAIL' | 'REJECT_BAIL_CUSTODIAL_REMAND' | 'GRANT_INTERIM_ANTICIPATORY_BAIL';
  recommendationTitle: string;
  statutoryBailability: 'NON_BAILABLE_DISCRETIONARY' | 'BAILABLE_AS_OF_RIGHT' | 'STATUTORY_BAIL_UNDER_BNSS_479';
  tripleTestAssessment: {
    flightRisk: { score: number; status: 'LOW' | 'MODERATE' | 'HIGH'; rationale: string };
    tamperingWithEvidence: { score: number; status: 'LOW' | 'MODERATE' | 'HIGH'; rationale: string };
    witnessIntimidation: { score: number; status: 'LOW' | 'MODERATE' | 'HIGH'; rationale: string };
  };
  statutoryGrounds: string[];
  mandatoryJudicialConditions: string[];
  relevantPrecedents: Array<{
    caseTitle: string;
    citation: string;
    bench: string;
    coreRatio: string;
    relevanceApplication: string;
  }>;
  draftedJudicialBailOrder: string;
}

export interface StatutoryChargeSheetDossier {
  chargeSheetNumber: string;
  courtName: string;
  policeStation: string;
  dateOfFiling: string;
  cognizanceActSections: string[];
  ioDetails: {
    name: string;
    rank: string;
    badgeId: string;
  };
  accusedParticulars: Array<{
    accusedNumber: number;
    fullName: string;
    alias?: string;
    arrestDate?: string;
    currentCustody: string;
    chargesPertaining: string[];
    primaFacieRole: string;
  }>;
  prosecutionWitnesses: Array<{
    witnessCode: string; // e.g. PW-1
    name: string;
    category: 'COMPLAINANT' | 'EYE_WITNESS' | 'PANCH_SEIZURE' | 'CFSL_EXPERT' | 'INVESTIGATING_OFFICER';
    keyDepositionPoint: string;
  }>;
  materialObjectsAndDocuments: Array<{
    exhibitCode: string; // e.g. MO-1 or Ext-P1
    description: string;
    sha256Digest: string;
    fslReportRef?: string;
    bsaSec63AdmissibilityCertificate: boolean;
  }>;
  briefFactsOfCase: string;
  investigationFindingsNarrative: string;
  prosecutionPrayer: string;
  isSignedByIO: boolean;
  ioSignatureHex: string;
  merkleDigest: string;
}

export interface CriminalNexusEntity {
  id: string;
  entityType: 'SUSPECT' | 'SHELL_COMPANY' | 'BANK_ACCOUNT' | 'CRYPTO_WALLET' | 'PHONE_IMEI' | 'VEHICLE' | 'IP_SUBNET';
  identifierValue: string;
  label: string;
  riskLevel: 'CRITICAL' | 'ELEVATED' | 'WATCHLIST';
  associatedCaseNumbers: string[];
  jurisdictionStates: string[];
  linkedSuspectNames: string[];
  modusOperandiTag: string;
}

export interface PrecedentCaseItem {
  id: string;
  title: string;
  citation: string;
  court: string;
  year: number;
  primarySubject: 'ELECTRONIC_EVIDENCE' | 'BAIL_GUIDELINES' | 'MANDATORY_FIR' | 'FORENSIC_PROCEDURE' | 'DIGITAL_PRIVACY' | 'CRIMINAL_CONSPIRACY';
  relatedActs: string[];
  ratioDecidendi: string;
  statutoryImpact: string;
  fullCaseSummary: string;
}

export interface TrialSimulationMessage {
  speaker: 'JUDGE' | 'PUBLIC_PROSECUTOR' | 'DEFENCE_COUNSEL' | 'INVESTIGATING_OFFICER' | 'CFSL_EXPERT';
  speakerName: string;
  content: string;
  timestamp: string;
  evidentiaryReference?: string;
  objectionRaised?: 'SUSTAINED' | 'OVERRULED' | 'NOTED';
}

// --- Phase 6: National Sovereign Inter-Agency Grid (ICJS 2.0), Summons/Warrants, Analytics & Audit Types ---

export type ICJSPillar = 'CCTNS_POLICE' | 'E_FORENSICS' | 'E_PROSECUTION' | 'E_COURTS' | 'E_PRISONS';

export interface ICJSPillarStatus {
  pillar: ICJSPillar;
  name: string;
  endpoint: string;
  status: 'ONLINE' | 'DEGRADED' | 'SYNCING';
  latencyMs: number;
  lastSyncTimestamp: string;
  protocolVersion: string;
  packetsTransferred24h: number;
  gatewayKeyFingerprint: string;
}

export interface ICJSTransaction {
  id: string;
  timestamp: string;
  sourcePillar: ICJSPillar;
  targetPillar: ICJSPillar;
  actionType: 'E_FIR_TRANSFER' | 'FSL_REQUISITION' | 'CHARGE_SHEET_DISPATCH' | 'BAIL_ORDER_SYNC' | 'PRISONER_PRODUCTION_REQUEST' | 'INTER_STATE_LOOKUP';
  caseNumber: string;
  cnrNumber?: string;
  payloadDigest: string;
  status: 'COMPLETED' | 'ACKNOWLEDGED' | 'IN_TRANSIT' | 'REJECTED';
  acknowledgementCode: string;
  digitalSignature: DigitalSignature;
  latencyMs: number;
}

export type ProcessServiceStatus = 
  | 'DRAFTED'
  | 'DISPATCHED_ELECTRONICALLY'
  | 'OUT_FOR_PHYSICAL_SERVICE'
  | 'SERVED_DIGITALLY_ACK'
  | 'SERVED_PHYSICALLY_GEO'
  | 'REFUSED_AFFIXED'
  | 'FAILED_UNTRACEABLE'
  | 'EXECUTED_ARRESTED';

export interface ESummonsRecord {
  id: string;
  summonsNumber: string; // e.g. SUM-2026-DL-8812
  caseNumber: string;
  courtName: string;
  issuedByJudge: string;
  statutorySection: string; // e.g. "Section 64 BNSS (Electronic Summons)"
  recipientType: 'ACCUSED' | 'WITNESS' | 'EXPERT_WITNESS' | 'DOCUMENT_CUSTODIAN';
  recipientName: string;
  recipientContact: {
    mobile: string;
    email: string;
    address: string;
  };
  hearingDate: string;
  hearingPurpose: string;
  issueDate: string;
  dispatchMode: 'MULTI_CHANNEL_SECURE' | 'SMS_WHATSAPP_LINK' | 'PROCESS_SERVER_HANDHELD' | 'REGISTERED_POST';
  serviceStatus: ProcessServiceStatus;
  deliveryTimestamp?: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
    accuracyMeters: number;
    locationName: string;
  };
  acknowledgementSignature?: string;
  qrVerificationCode: string;
  merkleProofHash: string;
}

export interface EWarrantRecord {
  id: string;
  warrantNumber: string; // e.g. NBW-2026-DL-0041
  caseNumber: string;
  courtName: string;
  judgeName: string;
  warrantType: 'BAILABLE_WARRANT' | 'NON_BAILABLE_WARRANT' | 'SEARCH_WARRANT' | 'PRODUCTION_WARRANT';
  targetPersonName: string;
  targetAlias?: string;
  targetAddress: string;
  offenseSummary: string;
  bailableAmount?: number;
  suretyCount?: number;
  issueDate: string;
  expiryDate: string;
  executingAgency: string; // e.g. "Delhi Police - Special Cell"
  executionStatus: ProcessServiceStatus;
  executionOfficer?: {
    name: string;
    rank: string;
    badgeNumber: string;
  };
  executionTimestamp?: string;
  lookoutNoticeIssued: boolean;
  tamperSealDigest: string;
}

export interface CrimeHotspotItem {
  id: string;
  state: string;
  district: string;
  policeStation: string;
  coordinates: [number, number]; // [lat, lng]
  crimeCategory: 'CYBER_FINANCIAL_FRAUD' | 'NARCOTICS_TRAFFICKING' | 'ORGANIZED_RACKET' | 'HEINOUS_VIOLENT' | 'WHITE_COLLAR_CORRUPTION';
  incidentCountPast90Days: number;
  riskSeverity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  topModusOperandi: string;
  activeSyndicates: string[];
  resolvedRatePercent: number;
}

export interface StatutoryCustodyClock {
  caseId: string;
  caseNumber: string;
  accusedName: string;
  arrestTimestamp: string;
  statutoryLimitDays: 60 | 90; // Sec 187 BNSS
  daysInCustody: number;
  remainingDays: number;
  isNearingDefaultBail: boolean; // < 7 days
  chargesheetFilingDeadline: string;
  chargesheetFiled: boolean;
  magistrateRemandExpiryDate: string;
  status: 'COMPLIANT' | 'WARNING_7_DAYS' | 'CRITICAL_48_HOURS' | 'DEFAULT_BAIL_ACCRUED';
}

export interface SovereignAuditLog {
  id: string;
  timestamp: string;
  action: 'EVIDENCE_ACCESSED' | 'DIGITAL_SIGNATURE_APPLIED' | 'CUSTODY_TRANSFERRED' | 'BLOCKCHAIN_ANCHOR' | 'ICJS_SYNC' | 'REDACTION_GENERATED' | 'AIRGAP_ARCHIVE_EXPORT' | 'TAMPER_ALERT_TRIGGERED';
  actorName: string;
  actorRole: UserRole;
  badgeId: string;
  ipAddress: string;
  resourceId: string;
  resourceType: 'CASE' | 'DOCUMENT' | 'EVIDENCE' | 'SUMMONS' | 'WARRANT' | 'LEDGER_BLOCK';
  sha256Digest: string;
  integrityVerified: boolean;
  securitySeverity: 'INFO' | 'WARNING' | 'ALERT_CRITICAL';
  metadata: Record<string, string | number | boolean>;
}

export interface AirgapArchivalPackage {
  packageId: string;
  caseNumber: string;
  generatedAt: string;
  generatedBy: string;
  statutoryRetentionCategory: '30_YEAR_HEINOUS' | '10_YEAR_STANDARD' | 'PERMANENT_HISTORICAL' | 'SCHEDULED_FOR_ZEROING';
  totalDocumentsCount: number;
  totalEvidenceCount: number;
  totalSizeMb: number;
  rootMerkleHash: string;
  standaloneHtmlViewerSha256: string;
  digitalSealCert: DigitalSignature;
  isReadyForDownload: boolean;
}

// ==========================================
// PHASE 7: DIGITAL TRIAL & ADVANCED FORENSIC SUITE
// ==========================================

export interface CourtroomStenographyEntry {
  id: string;
  timestamp: string;
  speaker: string;
  speakerRole: 'JUDGE' | 'PROSECUTOR' | 'DEFENSE' | 'WITNESS' | 'STENOGRAPHER';
  text: string;
  objectionType?: 'RELEVANCY' | 'HEARSAY' | 'LEADING_QUESTION' | 'SECTION_63_BSA_AUTHENTICITY';
  objectionRuling?: 'SUSTAINED' | 'OVERRULED' | 'PENDING';
  citations?: string[];
  isMarkedExhibit?: boolean;
}

export interface CourtroomPresentedExhibit {
  id: string;
  evidenceCode: string;
  title: string;
  submittedBy: string;
  admittedStatus: 'MARKED_AS_EXHIBIT' | 'ADMITTED_FORMALLY' | 'REJECTED' | 'UNDER_SECTION_63_VERIFICATION';
  bsaCertificateVerified: boolean;
  judicialAnnotation?: string;
  courtExhibitNumber?: string;
  sha256Digest: string;
  endorsementSignature?: DigitalSignature;
}

export interface CourtroomHearingSession {
  id: string;
  caseId: string;
  caseNumber: string;
  courtName: string;
  presidingJudge: string;
  publicProsecutor: string;
  defenseCounsel: string;
  accusedName: string;
  accusedLocation: string; // e.g. Tihar Central Jail - Video Conference Room 4
  witnessName: string;
  sessionStatus: 'SCHEDULED' | 'IN_SESSION' | 'RECESS' | 'ADJOURNED' | 'CONCLUDED';
  startTime: string;
  endTime?: string;
  stenographyLog: CourtroomStenographyEntry[];
  presentedExhibits: CourtroomPresentedExhibit[];
  ePrisonsBiometricCheck: {
    accusedUid: string;
    prisonName: string;
    biometricMatchScore: number;
    verifiedAt: string;
    wardenSignature: string;
    status: 'VERIFIED' | 'MISMATCH' | 'OFFLINE';
  };
  witnessOathRecorded: boolean;
  activeOrderDraft: string;
}

export interface SyntheticMediaFrameAnomaly {
  frameNumber: number;
  timestampSec: number;
  anomalyType: string;
  confidence: number;
  visualBox?: [number, number, number, number];
}

export interface SyntheticMediaForensicAnalysis {
  id: string;
  caseId: string;
  evidenceCode: string;
  mediaType: 'AUDIO' | 'VIDEO' | 'IMAGE' | 'DOCUMENT_SCAN';
  fileName: string;
  sha256Hash: string;
  manipulationVerdict: 'AUTHENTIC_PRISTINE' | 'PROBABLE_MANIPULATION' | 'CONFIRMED_DEEPFAKE_SYNTHETIC' | 'SUSPECT_AI_GENERATED';
  overallAuthenticityScore: number; // 0 - 100
  deepfakeProbability: number; // 0 - 100
  spectralAnomalyScore: number;
  voiceBiometricJitterScore?: number;
  frameArtifactsCount?: number;
  c2paProvenanceVerified: boolean;
  exifMetadataConsistency: 'CONSISTENT' | 'STRIPPED' | 'TAMPERED' | 'SYNTHETIC_GENERATOR_TAG';
  detectedTooltags: string[];
  frameAnomalies: SyntheticMediaFrameAnomaly[];
  frequencySpectrumFftData: number[];
  bsa63CertificateDigest: string;
  examinerSignOff: DigitalSignature;
  certifiedTimestamp: string;
}

export interface BFTConsensusNode {
  nodeId: string;
  nodeName: string;
  stateCenter: 'DELHI_NATIONAL_SDC' | 'MUMBAI_WEST_SDC' | 'BENGALURU_SOUTH_SDC' | 'HYDERABAD_CENTRAL_SDC' | 'KOLKATA_EAST_SDC';
  ipAddress: string;
  role: 'PROPOSER' | 'VALIDATOR' | 'BACKUP_WITNESS';
  status: 'SYNCED_HEALTHY' | 'VOTING' | 'LAGGING_BLOCKS' | 'ISOLATED_RECOVERY';
  blockHeight: number;
  latencyMs: number;
  lastHeartbeat: string;
  stakeOrWeight: number;
  peerCount: number;
  signatureCount: number;
}

export interface ConsensusRoundEvent {
  roundId: number;
  blockNumber: number;
  proposedBy: string;
  txCount: number;
  stateRootHash: string;
  signaturesGathered: number;
  quorumRequired: number;
  consensusState: 'PRE_PREPARE' | 'PREPARE' | 'COMMIT' | 'COMMITTED';
  latencyMs: number;
  timestamp: string;
}

export interface DisasterRecoverySnapshot {
  snapshotId: string;
  timestamp: string;
  blockHeight: number;
  totalCasesCount: number;
  totalLedgerHash: string;
  airgapSignature: string;
  restoreStatus: 'ONLINE_ACTIVE' | 'ARCHIVED_STANDBY';
}

export interface BailReckonerProfile {
  caseId: string;
  caseNumber: string;
  accusedName: string;
  accusedAge: number;
  prisonId: string;
  cellBlock: string;
  isFirstTimeOffender: boolean; // 1/3rd threshold under Sec 479 BNSS
  maximumImprisonmentMonths: number;
  statutoryLibertyThresholdMonths: number;
  currentDetentionDays: number;
  currentDetentionMonths: number;
  libertyEntitlementStatus: 'ENTITLED_IMMEDIATE_BAIL' | 'NEARING_STATUTORY_CAP' | 'NOT_ELIGIBLE_CAPITAL_OFFENSE' | 'UNDER_SCRUTINY';
  offensesList: Array<{ section: string; act: 'BNS' | 'NDPS' | 'PMLA'; maxPenaltyYears: number; isBailable: boolean }>;
  suretyRequirement: {
    amountRupees: number;
    suretiesRequired: number;
    suretiesVerified: number;
    localSuretyVerified: boolean;
  };
  eBailReleaseBondGenerated: boolean;
  icjsDispatchTimestamp?: string;
  judicialApprovalStatus: 'GRANTED_E_BAIL' | 'REJECTED_ON_MERIT' | 'PENDING_VERIFICATION' | 'SURETY_AWAITING';
}

// ==========================================
// PHASE 8: FINAL POLICE REPORT (SEC 193 BNSS), SENTENCING & VICTIM RESTITUTION (SEC 395/396 BNSS), AUDIO-VIDEO DIGITAL PANCHNAMA (SEC 105 BNSS) & FUGITIVE ASSET ATTACHMENT HUB (SEC 84/107 BNSS)
// ==========================================

export interface StatutoryDefectCheck {
  id: string;
  category: 'LIMITATION_PERIOD' | 'SANCTION' | 'FORENSIC_CERTIFICATE' | 'ARREST_COMPLIANCE' | 'WITNESS_EVIDENCE' | 'EXHIBIT_INTEGRITY';
  title: string;
  description: string;
  relevantSection: string; // e.g. "Sec 187(3) BNSS", "Sec 218 BNSS", "Sec 63 BSA"
  severity: 'CRITICAL_BLOCKER' | 'MAJOR_DEFECT' | 'MINOR_WARNING' | 'COMPLIANT_PASSED';
  isResolved: boolean;
  autoRemediationHint?: string;
}

export interface ChargeSheetAccusedDetail {
  id: string;
  fullName: string;
  fatherName: string;
  age: number;
  gender: string;
  address: string;
  custodyStatus: 'IN_JUDICIAL_CUSTODY' | 'IN_POLICE_CUSTODY' | 'RELEASED_ON_BAIL' | 'NOT_ARRESTED_SEC_35_BNSS' | 'PROCLAIMED_ABSCONDER';
  arrestDate?: string;
  bailOrderRef?: string;
  chargedSections: string[]; // e.g. ["BNS 103(1)", "BNS 316(2)"]
  sanctionObtained: boolean;
  sanctionRefNumber?: string;
  priorConvictionsCount: number;
}

export interface ChargeSheetWitnessDetail {
  id: string;
  witnessNumber: number; // PW-1, PW-2, CW-1, etc.
  name: string;
  type: 'EYEWITNESS' | 'PANCH_WITNESS' | 'FORENSIC_EXPERT' | 'INVESTIGATING_OFFICER' | 'VICTIM' | 'MEDICAL_OFFICER';
  section180StatementRecorded: boolean;
  statementTimestamp?: string;
  statementHash?: string;
  keyDepositionSummary: string;
  reliedExhibits: string[];
}

export interface ChargeSheetForm51 {
  id: string;
  caseId: string;
  caseNumber: string;
  firNumber: string;
  policeStation: string;
  district: string;
  state: string;
  ioName: string;
  ioRank: string;
  ioBadgeNumber: string;
  shoApprovalDate: string;
  dateOfFiling: string;
  courtName: string;
  isSupplementary: boolean;
  supplementaryNumber?: number; // e.g., Supplementary 1 under Sec 193(9) BNSS
  natureOfReport: 'CHARGE_SHEET_FOR_TRIAL' | 'CLOSURE_REPORT_UNTRACED' | 'CLOSURE_REPORT_FALSE' | 'CLOSURE_REPORT_INSUFFICIENT_EVIDENCE';
  briefFactsOfCase: string;
  investigationFindings: string;
  accusedList: ChargeSheetAccusedDetail[];
  witnessesList: ChargeSheetWitnessDetail[];
  reliedDocumentsList: Array<{ docTitle: string; exhibitCode: string; bsaSec63Attached: boolean; sha256: string }>;
  prosecutorialScrutiny: {
    overallCognizanceReadinessScore: number; // 0 - 100%
    scrutinyStatus: 'APPROVED_FOR_FILING' | 'REQUISITIONS_RAISED' | 'UNDER_PROSECUTOR_REVIEW';
    scrutinyDate: string;
    prosecutorName: string;
    defectsList: StatutoryDefectCheck[];
    magistrateCognizanceOrderDraft: string;
  };
  digitalSignatureSeal: DigitalSignature;
}

export interface SentencingFactor {
  id: string;
  type: 'AGGRAVATING' | 'MITIGATING';
  factorDescription: string;
  statutoryReference?: string;
  weightImpact: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SentencingVictimAssessment {
  id: string;
  caseId: string;
  caseNumber: string;
  convictedAccused: string[];
  primaryOffense: string;
  statutoryMinimumYears?: number;
  statutoryMaximumYears: number;
  fineRangeRupees: { min: number; max: number };
  communityServiceApplicable: boolean;
  communityServiceHoursMax?: number;
  factors: SentencingFactor[];
  recommendedPrisonTermMonths: number;
  recommendedFineAmountRupees: number;
  recommendedCommunityServiceTask?: string;
  concurrencyType: 'CONCURRENT' | 'CONSECUTIVE';
  
  // Sec 395 & 396 BNSS Victim Compensation Assessment
  victimAssessment: {
    victimName: string;
    injurySeverity: 'FATAL_LOSS_OF_LIFE' | 'GRIEVOUS_PERMANENT_DISABILITY' | 'SEVERE_PHYSICAL_INJURY' | 'PSYCHOLOGICAL_TRAUMA' | 'PROPERTY_EXTORTION_LOSS';
    medicalExpensesIncurredRupees: number;
    lossOfLivelihoodRupees: number;
    rehabilitationCostRupees: number;
    calculatedTotalCompensationRupees: number;
    interimReliefAlreadyPaidRupees: number;
    schemeApplicable: 'CVCF_CENTRAL_SCHEME' | 'STATE_VICTIM_COMPENSATION_FUND' | 'NALSA_MANDATE';
    restitutionFromConvictFineRupees: number;
    stateTreasuryContributionRupees: number;
    dlsOrderRef: string;
  };
  judicialSentencingDraft: string;
}

export interface DigitalPanchnamaItem {
  id: string;
  itemNumber: number;
  description: string;
  category: 'WEAPON' | 'NARCOTIC_SUBSTANCE' | 'DIGITAL_DEVICE' | 'CURRENCY_JEWELRY' | 'DOCUMENT' | 'VEHICLE' | 'BIOLOGICAL_SAMPLE';
  serialOrImei?: string;
  quantity: string;
  seizureLocationDetail: string;
  tamperEvidentSealNumber: string;
  photoOrVideoClipSha256: string;
  custodyOfficer: string;
}

export interface DigitalAudioVideoPanchnama {
  id: string;
  caseId: string;
  caseNumber: string;
  panchnamaType: 'SEARCH_AND_SEIZURE_SEC_105' | 'CRIME_SCENE_INSPECTION' | 'INQUEST_PANCHNAMA' | 'RECOVERY_UNDER_SEC_23_BSA';
  locationAddress: string;
  geoCoordinates: { latitude: number; longitude: number; elevationMeters: number; accuracyMeters: number };
  startTime: string;
  endTime: string;
  leadOfficer: { name: string; rank: string; badge: string };
  panchWitnesses: Array<{
    name: string;
    age: number;
    occupation: string;
    address: string;
    aadhaarOrIdLast4: string;
    digitalSignatureOrThumbprintSha256: string;
    signedTimestamp: string;
  }>;
  audioVideoRecordings: Array<{
    recordingId: string;
    deviceModel: string;
    durationSec: number;
    sha256Hash: string;
    c2paMetadataVerified: boolean;
    streamingUploadToMagistrateConfirmed: boolean;
    streamTxHash: string;
  }>;
  seizedItems: DigitalPanchnamaItem[];
  sec105CertificateSha256: string;
  magistrateNotificationTimestamp?: string;
  status: 'COMPLETED_AUTHENTICATED' | 'TRANSMITTED_TO_MAGISTRATE' | 'UNDER_SEALING';
}

export interface FugitiveProclamationAssetRecord {
  id: string;
  caseId: string;
  caseNumber: string;
  offenderName: string;
  aliasList: string[];
  dateOfBirth: string;
  nationality: string;
  passportNumber?: string;
  interpolNoticeType?: 'RED_CORNER' | 'BLUE_NOTICE' | 'LOOKOUT_CIRCULAR_LOC' | 'NONE';
  interpolNoticeRef?: string;
  bnssSec84ProclamationStatus: 'WARRANT_RETURNED_UNEXECUTED' | 'PROCLAMATION_ISSUED_30_DAYS' | 'PROCLAIMED_OFFENDER_DECLARED';
  proclamationDate?: string;
  daysRemainingForSurrender?: number;
  rewardAnnouncedRupees: number;
  attachedAssetsSec107: Array<{
    assetId: string;
    assetType: 'IMMOVABLE_REAL_ESTATE' | 'BANK_ACCOUNT_FIU' | 'LUXURY_VEHICLE' | 'CRYPTO_COLD_WALLET' | 'EQUITY_SHARES';
    description: string;
    estimatedValueRupees: number;
    attachmentOrderDate: string;
    courtOrderRef: string;
    attachmentStatus: 'FREEZE_NOTICE_SERVED' | 'CONFISCATION_ORDER_PASSED' | 'AUCTION_RECOVERY_PENDING';
    confiscationLedgerTx: string;
  }>;
  crossAgencyAlerts: Array<{
    agency: 'INTERPOL' | 'CBI' | 'NIA' | 'NCB' | 'IMMIGRATION_BOI' | 'FIU_IND' | 'E_PRISONS';
    alertStatus: 'BROADCAST_ACTIVE' | 'FLAGGED_AT_BORDER' | 'ACCOUNT_FROZEN';
    lastSync: string;
  }>;
}

// ==========================================
// PHASE 9: NFSU FORENSIC TRIAGE MESH (SEC 176(3) BNSS), PREVENTIVE DETENTION & PEACE BONDS (SEC 125-135 BNSS), WITNESS PROTECTION SCHEME (SEC 398 BNSS) & MLAT EXTRADITION PORTAL (SEC 111-114 BNSS)
// ==========================================

export type ForensicDiscipline = 'DNA_PROFILING' | 'BALLISTICS_TOOLMARK' | 'TOXICOLOGY_GCMS' | 'CYBER_MOBILE_EXTRACTION' | 'FINGERPRINT_AFIS' | 'DOCUMENT_QUESTIONED';

export interface NFSUForensicSample {
  sampleId: string;
  barcode: string;
  discipline: ForensicDiscipline;
  sampleType: string; // e.g. "Blood Swab on Cotton", "7.65mm Fired Cartridge Case", "Gastric Lavage Aspirate", "OnePlus 11 Physical Dump"
  collectedAt: string;
  collectedLocation: string;
  custodyOfficer: string;
  coldChainTempCelsius?: number; // Telemetry e.g. -20.0 C
  sealBarcode: string;
  analysisStatus: 'ANALYSIS_COMPLETED' | 'IN_INSTRUMENT_RUN' | 'PENDING_EXTRACTION';
  scientificFindings: string;
  matchConfidenceScore: number; // 0 - 100%
  keySpectralOrAlleleData?: Record<string, string | number>;
  cfslExaminerName: string;
  examinerSignatureDigest: string;
}

export interface NFSUCrimeSceneDispatchRecord {
  id: string;
  caseId: string;
  caseNumber: string;
  mandatorySec176Compliance: boolean; // Triggered if offense penalty >= 7 years
  offenseSeverityYears: number;
  mobileForensicVanId: string;
  leadForensicScientist: string;
  dispatchTimestamp: string;
  sceneArrivalTimestamp: string;
  gpsCoordinates: { lat: number; lng: number };
  samplesCollected: NFSUForensicSample[];
  fslRefNumber: string;
  laboratoryAssigned: string;
  sec176FormalReportSummary: string;
  reportCertificateHash: string;
}

export interface PreventivePeaceBondRecord {
  id: string;
  caseNumber: string;
  respondentName: string;
  aliasList: string[];
  age: number;
  address: string;
  policeStation: string;
  jurisdictionDistrict: string;
  bnssSection: 'SEC_125_CONVICTION' | 'SEC_126_BREACH_OF_PEACE' | 'SEC_127_SEDITIOUS_MATTERS' | 'SEC_128_VAGRANTS_SUSPECTS' | 'SEC_129_HABITUAL_OFFENDERS';
  threatDescription: string;
  showCauseNoticeRef: string;
  showCauseNoticeIssuedDate: string;
  inquiryStatus: 'SHOW_CAUSE_SERVED' | 'INQUIRY_IN_PROGRESS_SEC_135' | 'BOND_ORDER_PASSED' | 'DETAINED_IN_DEFAULT_SEC_141';
  bondAmountRupees: number;
  bondPeriodMonths: number;
  suretiesRequiredCount: number;
  suretiesVerifiedCount: number;
  executiveMagistrateName: string;
  geoFencedRadiusKm?: number;
  mandatoryReportingSchedule?: string; // e.g. "Every Sunday 10:00 AM at PS Cyber Hub"
  digitalOrderSha256: string;
}

export interface WitnessProtectionProfile {
  id: string;
  caseId: string;
  caseNumber: string;
  witnessOriginalName: string;
  witnessAssignedPseudonym: string; // e.g. "Witness Alpha-4"
  threatCategory: 'CATEGORY_A_SEVERE_LIFE_THREAT' | 'CATEGORY_B_SAFETY_PROPERTY_THREAT' | 'CATEGORY_C_INTIMIDATION_MODERATE';
  threatAssessmentScore: number; // 0 - 100
  assessingOfficer: string;
  threatSummary: string;
  protectionMeasuresSanctioned: Array<
    | 'IDENTITY_CONCEALMENT_REDACTION'
    | 'IN_CAMERA_VIDEO_DEPOSITION'
    | 'ARMED_POLICE_PROTECTION_24X7'
    | 'SAFE_HOUSE_RELOCATION'
    | 'DIGITAL_COMMS_INTERCEPTION_DEFENSE'
    | 'EMERGENCY_SOS_BEACON'
  >;
  assignedSafeHouseCode?: string;
  escortTeamLead?: string;
  threatIncidentsLogged: Array<{
    timestamp: string;
    incidentType: string;
    sourceOrChannel: string;
    actionTaken: string;
  }>;
  witnessProtectionOrderRef: string;
  orderPassedByJudge: string;
  orderDate: string;
  encryptedIdentitySealHash: string;
}

export interface MLATExtraditionRecord {
  id: string;
  caseId: string;
  caseNumber: string;
  fugitiveOrSubjectName: string;
  subjectNationality: string;
  foreignCountryTarget: string; // e.g. "United Arab Emirates", "United Kingdom", "United States"
  foreignJudicialAuthority: string;
  requestType: 'LETTERS_ROGATORY_SEC_114' | 'EXTRADITION_TREATY_REQUEST' | 'SERVICE_OF_SUMMONS_SEC_111' | 'ATTACHMENT_OF_PROPERTY_SEC_113';
  treatyFramework: 'BILATERAL_MLAT' | 'HAGUE_EVIDENCE_CONVENTION' | 'UN_ODC_RECIPROCITY_ACCORD';
  meaClearanceRef: string;
  mhaNodalApprovalDate: string;
  offenseBriefDualCriminology: string;
  transferredEvidenceHashes: string[];
  diplomaticStatus: 'DRAFT_FORMULATION' | 'MEA_DIPLOMATIC_POUCH_DISPATCHED' | 'FOREIGN_COURT_HEARING_ACTIVE' | 'SURRENDER_WARRANT_GRANTED';
  leadMEAOfficer: string;
  digitalDossierHash: string;
}

// ==========================================
// PHASE 10: PLEA BARGAINING & RESTORATIVE DISPOSITION (CHAPTER XXII BNSS), SMART EVIDENCE NFC/RFID LOCKER GRID, SUPREME COURT / HC PRECEDENT GRAPH & SOVEREIGN NJDG 3.0 BENCHMARKING
// ==========================================

export interface PleaBargainingDisposition {
  id: string;
  caseId: string;
  caseNumber: string;
  applicantAccusedName: string;
  chargedSections: string[];
  isStatutorilyEligibleSec290: boolean; // Must not be death/life/7+ yrs, socio-economic offenses, or against women/child <14
  statutoryMaxPenaltyYears: number;
  statutoryMinPenaltyYears: number;
  ineligibilityReason?: string;
  voluntaryAffidavitFiled: boolean;
  victimName: string;
  prosecutorName: string;
  judicialMagistrateName: string;
  msdNegotiationStatus: 'APPLICATION_FILED' | 'IN_CAMERA_EXAMINATION_DONE' | 'MSD_MEETING_SCHEDULED' | 'MUTUALLY_SATISFACTORY_DISPOSITION_ACHIEVED' | 'REJECTED_ON_MERIT';
  victimCompensationAgreedRupees: number;
  prosecutionCostsRupees: number;
  mitigatedSentenceMonths: number; // 1/4th of min or 1/2 of max under Sec 295 BNSS
  communityServiceAssigned?: string;
  msdReportRef: string;
  finalJudgmentDraftSec296: string;
  judicialSealSha256: string;
  isNonAppealableCertifiedSec298: boolean;
}

export interface SmartEvidenceLockerCompartment {
  compartmentId: string; // e.g. "VAULT-DEL-B1-CMP-402"
  lockerHubName: string; // e.g. "Central Malkhana, Tis Hazari Courts Complex"
  hardwareStatus: 'SECURED_LOCKED' | 'ACCESS_UNLOCKED' | 'TAMPER_ALARM_TRIGGERED' | 'MAINTENANCE_OFFLINE';
  nfcRfidTagId: string;
  storedEvidenceCode: string;
  storedEvidenceTitle: string;
  temperatureTelemetryCelsius: number;
  targetTempCategory: 'AMBIENT_18C' | 'COLD_STORAGE_4C' | 'CRYOGENIC_MINUS_20C' | 'FIREPROOF_ENCLAVE';
  humidityPercentage: number;
  activeCustodianOfficer: string;
  lastAccessTimestamp: string;
  accessLogEventsCount: number;
  biometricAuditMatched: boolean;
  hardwareDoorSensorIntegrity: 'NORMAL_CLOSED' | 'UNAUTHORIZED_FORCED_OPEN' | 'FAILSAFE_LOCKED';
}

export interface LegalPrecedentCitation {
  id: string;
  bench: 'SUPREME_COURT_CONSTITUTION_BENCH' | 'SUPREME_COURT_APPELLATE' | 'HIGH_COURT_FULL_BENCH' | 'HIGH_COURT_DIVISION_BENCH';
  courtName: string;
  caseTitle: string; // e.g. "State (NCT of Delhi) v. Sunil & Ors (2025)"
  neutralCitation: string; // e.g. "2025 INSC 842"
  decisionDate: string;
  interpretedActsAndSections: string[]; // e.g. ["BNSS Sec 187", "BNS Sec 111", "BSA Sec 63"]
  ratioDecidendi: string;
  obiterDicta?: string;
  precedentStatus: 'BINDING_AUTHORITY' | 'PERSUASIVE' | 'DISTINGUISHED' | 'OVERRULED';
  applicabilityRelevanceScore: number; // 0 - 100%
  keyQuotableExcerpt: string;
}

export interface NationalJudicialKPIMetrics {
  timestamp: string;
  nationalCaseClearanceRatePct: number; // e.g. 104.2%
  totalActiveDocketCount: number;
  underTrialDetentionRatioPct: number; // e.g. 42.1% (aiming for reduction under Sec 479)
  bnss60DayInquiryCompliancePct: number; // Sec 173(3) BNSS
  bnss90DayChargeSheetCompliancePct: number; // Sec 187(3) BNSS
  bnss30DayJudgmentDeliveryCompliancePct: number; // Sec 392(1) BNSS
  averageTrialDurationDays: number;
  totalElectronicHearingsHeldSec530: number;
  statePerformanceRoster: Array<{
    stateName: string;
    clearanceRate: number;
    pendencyCasesCount: number;
    leadDistrict: string;
    compositeScore: number;
  }>;
  presidentialAuditCertDigest: string;
}

// ==========================================
// PHASE 11: MEDICO-LEGAL AUTOPSY & INQUEST (SEC 194-196 BNSS), ORGANIZED CRIME & TERROR FORFEITURE (SEC 111 BNS), REMAND & ORDER-SHEET ENGINE (SEC 187 BNSS), AND SOVEREIGN AIR-GAP HSM CEREMONY
// ==========================================

export interface MedicoLegalAutopsyRecord {
  id: string;
  caseId: string;
  caseNumber: string;
  deceasedName: string;
  deceasedAge: number;
  deceasedGender: 'MALE' | 'FEMALE' | 'OTHER';
  inquestType: 'POLICE_INQUEST_SEC_194' | 'MAGISTERIAL_INQUEST_SEC_196_CUSTODIAL' | 'DOWRY_DEATH_INQUEST_SEC_196';
  inquestOfficerName: string;
  inquestOfficerDesignation: string;
  hospitalOrMortuary: string;
  chiefMedicalExaminer: string;
  timeOfDeathEstimated: string;
  timeOfAutopsy: string;
  probableCauseOfDeath: string;
  injuriesFound: Array<{
    injuryNumber: number;
    anatomicalSite: string; // e.g. "Left Temporal Region", "Anterior Chest Wall"
    injuryType: 'FIREARM_ENTRY_WOUND' | 'FIREARM_EXIT_WOUND' | 'INCISED_STAB_WOUND' | 'BLUNT_FORCE_CONTUSION' | 'LIGATURE_STRANGULATION_MARK' | 'THERMAL_BURN';
    dimensionsCm: string; // e.g. "4.5 x 2.1 x 3.0 cm"
    anteMortemStatus: 'ANTE_MORTEM' | 'POST_MORTEM';
    lethalContribution: 'DIRECTLY_FATAL' | 'CONTRIBUTORY' | 'NON_FATAL';
  }>;
  toxicologyVisceraFindings: string;
  dnaSamplingPreserved: boolean;
  videoRecordingC2paHash: string;
  medicalCertPartB_Sha256: string;
  magistrateTransmissionStatus: 'TRANSMITTED_TO_CJM' | 'UNDER_ANALYSIS';
}

export interface OrganizedCrimeSyndicateRecord {
  id: string;
  syndicateName: string;
  kingpinName: string;
  syndicateCategory: 'SEC_111_BNS_ORGANIZED_CRIME' | 'SEC_112_BNS_PETTY_ORGANIZED' | 'TRANSNATIONAL_TERROR_FINANCING' | 'CYBER_CRIME_CARTEL';
  activeMembersCount: number;
  totalProceedsEstimatedRupees: number;
  fiuAlertReference: string;
  illicitFinancialNodes: Array<{
    nodeId: string;
    entityName: string;
    nodeType: 'SHELL_COMPANY' | 'CRYPTO_TUMBLER_WALLET' | 'BENAMI_REAL_ESTATE' | 'OFFSHORE_HAWALA_NODE' | 'BOGUS_TRADE_INVOICING';
    jurisdiction: string;
    frozenAmountRupees: number;
    freezeOrderDate: string;
    fiuFlagStatus: 'FROZEN_SEC_107' | 'UNDER_SCRUTINY' | 'CONFISCATION_ORDERED';
  }>;
  uapaOrPmlaSections: string[];
  investigatingAgency: 'NATIONAL_INVESTIGATION_AGENCY_NIA' | 'ENFORCEMENT_DIRECTORATE_ED' | 'STATE_ATS_SPECIAL_CELL';
  courtAttachmentOrderSha256: string;
}

export interface RemandOrderSheetRecord {
  id: string;
  caseId: string;
  caseNumber: string;
  accusedName: string;
  hearingTimestamp: string;
  presidingMagistrate: string;
  custodyTypeRequested: 'POLICE_CUSTODY_REMAND' | 'JUDICIAL_CUSTODY_REMAND' | 'TRANSIT_REMAND';
  custodyDaysGranted: number;
  daysInPoliceCustodyTotal: number; // Max 15 days limitation check under Sec 187(2) BNSS
  daysInJudicialCustodyTotal: number;
  remandGrounds: string;
  medicalFitnessVerifiedSec53: boolean;
  legalAidProvidedSec340: boolean;
  nextHearingDate: string;
  ePrisonsCustodySlipRef: string;
  orderSheetText: string;
  magistrateSealSha256: string;
}

export interface AirGapHSMCeremonyRecord {
  ceremonyId: string;
  ceremonyTimestamp: string;
  ceremonyType: 'MASTER_LEDGER_ROOT_ROTATION' | 'DISASTER_RECOVERY_FAILOVER_HYDERABAD' | 'SHAMIR_THRESHOLD_RECONSTRUCTION';
  fips140Level: 'FIPS_140_3_LEVEL_4';
  thresholdMofN: '3_OF_5_THRESHOLD';
  keyCustodiansPresent: Array<{
    name: string;
    role: string;
    department: string;
    smartCardInserted: boolean;
    pinEntropyPassed: boolean;
    partialKeyShareSha256: string;
  }>;
  ceremonyStatus: 'CEREMONY_COMPLETED_SUCCESS' | 'IN_PROGRESS' | 'QUORUM_AWAITING';
  coldVaultBackupHash: string;
  sovereignLedgerStateHash: string;
  collegiumAuditCertificate: string;
}

// ==========================================
// PHASE 12: JUVENILE JUSTICE, CITIZEN E-LOCKER, CYBER TAKEDOWN & QUANTUM DR
// ==========================================

export interface JuvenileJusticeRecord {
  id: string;
  caseId: string;
  caseNumber: string;
  anonymizedPseudonym: string; // e.g. "Child in Conflict with Law 'A-2026'" (Sec 74 JJ Act 2015)
  ageAtOffense: number;
  ageDeterminationBasis: 'MATRICULATION_CERTIFICATE' | 'MUNICIPAL_BIRTH_CERTIFICATE' | 'OSSIFICATION_TEST_AIIMS';
  category: 'CHILD_IN_CONFLICT_WITH_LAW_CICL' | 'CHILD_IN_NEED_OF_CARE_AND_PROTECTION_CNCP';
  allegedOffensesBNS: string[];
  isHeinousOffense: boolean; // Offense with min imprisonment >= 7 years
  preliminaryAssessmentSec15JJB: {
    assessedByPsychologist: boolean;
    psychologistName: string;
    mentalPhysicalCapacityEvaluated: boolean;
    abilityToUnderstandConsequences: boolean;
    recommendation: 'TRIAL_AS_ADULT_CHILDRENS_COURT' | 'REHABILITATION_UNDER_JJB';
    assessmentDate: string;
    assessmentReportSha256: string;
  };
  socialInvestigationReportForm6: {
    probationOfficerName: string;
    familySocioEconomicBackground: string;
    schoolAttendanceRecord: string;
    peerGroupInfluenceScore: 'LOW' | 'MODERATE' | 'HIGH';
    substanceAbuseStatus: 'NONE' | 'UNDER_REHABILITATION' | 'SUSPECTED';
  };
  individualCarePlanForm7: {
    counselingPlan: string;
    vocationalTrainingStream: string;
    repatriationFeasibility: boolean;
    fitFacilityAssigned: 'OBSERVATION_HOME_SPECIAL' | 'CHILDRENS_HOME_DISTRICT' | 'FOSTER_CARE_GUARDIAN';
  };
  identityRedactionShieldSha256: string;
  jjbMagistratePresiding: string;
  nextJJBHearingDate: string;
  childFriendlyHearingCompliant: boolean;
}

export interface CitizenJusticeELockerRecord {
  requestId: string;
  citizenAadhaarVaultToken: string;
  citizenNameMasked: string; // "V*** S***"
  mobileLinkedMasked: string; // "XXXXXX8910"
  requestType: 'CERTIFIED_COPY_BSA_63' | 'PRIVATE_COMPLAINT_BNSS_223' | 'VICTIM_COMPENSATION_BNSS_396' | 'LEGAL_AID_APPLICATION_BNSS_340';
  caseNumberRef: string;
  courtJurisdiction: string;
  certifiedDocumentTitle: string;
  issuingJudgeName: string;
  digitalSignatureBSA63Sha256: string;
  qrVerificationUrl: string;
  nalSACompensationAmountRupees?: number;
  legalAidCounselAssigned?: {
    advocateName: string;
    barCouncilEnrollment: string;
    proBonoPanelCategory: 'SENIOR_PANEL' | 'LEGAL_SERVICES_AUTHORITY_DLSA';
  };
  status: 'ISSUED_AND_AVAILABLE' | 'UNDER_SCRUTINY' | 'DISBURSED_DIRECT_BENEFIT';
  issuedTimestamp: string;
  downloadExpiryTimestamp: string;
}

export interface CyberCrimeTakedownRecord {
  noticeId: string;
  i4cIncidentRef: string; // 1930 National Cyber Helpline ID e.g. "I4C-2026-NCRP-88190"
  incidentType: 'DEEPFAKE_MALICIOUS_MEDIA' | 'FINANCIAL_PHISHING_MULE_GRID' | 'DARKNET_NARCOTICS_SYNDICATE' | 'RANSOMWARE_CRITICAL_INFRA' | 'TERROR_RECRUITMENT_CHANNEL';
  targetPlatform: 'TELEGRAM_ENCRYPTED_CHANNEL' | 'DARKNET_TOR_ONION' | 'X_PLATFORM_BOTNET' | 'OFFSHORE_CRYPTO_MIXER' | 'PHISHING_DOMAIN_REGISTRAR';
  offendingUrlOrHandle: string;
  digitalEvidenceSha256: string;
  statutoryPowersInvoked: 'SEC_69A_IT_ACT' | 'SEC_79_3_B_IT_ACT' | 'SEC_111_BNS_ORGANIZED_CYBER_CRIME';
  takedownStatus: 'EMERGENCY_BLOCKED_CERT_IN' | 'ISSUED_AWAITING_INTERMEDIARY' | 'FROZEN_FINANCIAL_MULE_ACCOUNTS';
  muleBankAccountsFrozen: Array<{
    bankName: string;
    accountNumberMasked: string;
    frozenAmountRupees: number;
    fiuAlertId: string;
  }>;
  certInEscalationRef: string;
  certInOfficerName: string;
  issuedTimestamp: string;
}

export interface QuantumResilientDRRecord {
  nodeId: string;
  region: 'DELHI_PRIMARY_NIC_DC' | 'HYDERABAD_DISASTER_RECOVERY_DC' | 'BHUBANESWAR_AIRGAP_COLD_VAULT';
  role: 'PRIMARY_MASTER' | 'HOT_STANDBY_REPLICA' | 'AIRGAP_SOVEREIGN_ARCHIVE';
  pqcAlgorithmKem: 'NIST_FIPS_203_ML_KEM_1024' | 'CRYSTALS_KYBER_1024';
  pqcAlgorithmDsa: 'NIST_FIPS_204_ML_DSA_87' | 'CRYSTALS_DILITHIUM_5';
  hybridSignatureDualStatus: 'HYBRID_PQC_ACTIVE' | 'CLASSIC_ECDSA_FALLBACK';
  syncLatencyMs: number;
  byzantineConsensusQuorumWeight: number; // e.g. 33.4%
  lastQuantumKeyRotationTimestamp: string;
  immutableSnapshotRootHash: string;
  splitBrainShieldActive: boolean;
  failoverHealthIndex: number; // 99.999%
}

// ==========================================
// PHASE 13: EPRISONS, BIOMETRIC DNA, FIU-AML & CONSTITUTIONAL COLLEGIUM
// ==========================================

export interface EPrisonsCorrectionalRecord {
  inmateId: string;
  undertrialNumber: string;
  prisonFacility: string; // e.g. "Central Jail No. 1, Tihar, New Delhi"
  inmateName: string;
  age: number;
  caseNumberRef: string;
  bookedSectionsBNS: string[];
  isFirstTimeOffender: boolean;
  custodyType: 'JUDICIAL_CUSTODY' | 'POLICE_CUSTODY_TRANSIT' | 'INTERIM_BAIL_OUT' | 'MEDICAL_WARD_CUSTODY';
  dateOfAdmission: string;
  totalDaysIncarcerated: number;
  maxSentenceApplicableDays: number;
  sec479BNSSThresholdDays: number; // 1/3rd for 1st-time, 1/2 for others
  sec479BailEligible: boolean;
  sec53MedicalFitnessStatus: 'FIT' | 'CHRONIC_UNDER_TREATMENT' | 'HOSPITALIZED';
  paroleOrFurloughEligibility: {
    eligible: boolean;
    conductScore: number; // 0 to 100
    lastParoleDate?: string;
  };
  vcCourtProductionStatus: 'PRODUCED_TODAY' | 'SCHEDULED_TOMORROW' | 'NOT_DUE';
  biometricCustodySlipSha256: string;
  superintendentDigitalSeal: string;
}

export interface NationalBiometricDNARecord {
  cpidReferenceId: string; // Criminal Procedure (Identification) Act 2022 ID
  caseNumberRef: string;
  subjectNameMasked: string;
  category: 'CONVICT_HEINOUS' | 'ACCUSED_UNDER_TRIAL' | 'HABITUAL_OFFENDER_PREVENTIVE';
  nafisFingerprintRecord: {
    tenPrintCardUploaded: boolean;
    nistMatchQualityScore: number; // e.g. 98.4%
    nafisNationalId: string;
  };
  dnaCodisProfile: {
    strLociCount: number; // 24 loci standard
    alleleMatrix: Array<{ locus: string; allele1: string; allele2: string }>;
    nfsuAccreditationRef: string;
    sampleType: 'BUCCAL_SWAB' | 'BLOOD_SAMPLE' | 'HAIR_ROOT_FOLLICLE';
  };
  irisBiometricTemplateSha256: string;
  collectionOfficerName: string;
  dateOfBiometricCollection: string;
  expungementStatus: 'ACTIVE_PROFILE' | 'EXPUNGEMENT_ORDERED_ACQUITTAL';
  statutoryProtectionSha256: string;
}

export interface FIUFinancialIntelligenceRecord {
  alertId: string;
  syndicateOrEntityName: string;
  investigatingAgency: 'ENFORCEMENT_DIRECTORATE_ED' | 'FIU_IND_FINNET' | 'INCOME_TAX_INVESTIGATION';
  pmlaPredicateSections: string[];
  totalLaunderingVolumeRupees: number;
  attachmentStatus: 'PROVISIONAL_ATTACHMENT_SEC_5' | 'CONFIRMATION_BY_ADJUDICATING_AUTHORITY' | 'CONFISCATED_TO_CENTRE';
  hawalaNodesTracked: Array<{
    nodeLocation: string;
    operatorAlias: string;
    estimatedFlowRupees: number;
  }>;
  cryptoMixerEntities: Array<{
    blockchain: 'BITCOIN' | 'ETHEREUM' | 'TRON_TRC20';
    mixerContractOrAddress: string;
    launderedAmountCrypto: string;
    fiatEquivalentRupees: number;
  }>;
  benamiPropertiesAttached: Array<{
    propertyDescription: string;
    location: string;
    marketValueRupees: number;
  }>;
  specialJudgeOrderSha256: string;
  issuedTimestamp: string;
}

export interface ConstitutionalCollegiumRecord {
  resolutionId: string;
  collegiumType: 'SUPREME_COURT_COLLEGIUM' | 'HIGH_COURT_COLLEGIUM';
  resolutionTitle: string;
  recommendationType: 'ELEVATION_TO_BENCH' | 'CHIEF_JUSTICE_APPOINTMENT' | 'INTER_STATE_TRANSFER' | 'RECUSAL_INTEGRITY_AUDIT';
  judicialCandidateOrJudgeName: string;
  currentDesignationOrBarStatus: string;
  proposedDesignation: string;
  integrityIndexScore: number; // 0-100%
  caseDisposalEfficiencyScore: number; // 0-100%
  conflictOfInterestFlag: 'NONE_CLEARED' | 'ADVOCATE_RELATION_SCRUTINIZED' | 'CORPORATE_HOLDING_FLAGGED';
  signatoryJudges: Array<{
    judgeName: string;
    designation: string;
    signedTimestamp: string;
  }>;
  shamirQuorumAchieved: boolean; // 3-of-5 SC Collegium / 3-of-3 HC Collegium
  resolutionText: string;
  immutableCollegiumSealSha256: string;
}

// ==========================================
// PHASE 14: INTER-STATE TRANSIT, CBRN LAB, MARITIME GRID & CONSTITUTIONAL EMERGENCY
// ==========================================

export interface HighSecurityTransitRecord {
  transitPassId: string;
  prisonerName: string;
  prisonerCategory: 'CATEGORY_A_TERROR_SYNDICATE' | 'CATEGORY_B_HEINOUS_CRIMINAL' | 'CATEGORY_C_STANDARD_UNDER_TRIAL';
  originJailFacility: string;
  destinationCourtOrPrison: string;
  escortBattalionName: string;
  escortCommanderOfficer: string;
  armedGuardsCount: number;
  vehicleRegistrationNumber: string;
  gpsTelemetryLiveStatus: 'IN_TRANSIT_ON_ROUTE' | 'BORDER_CHECKPOINT_CLEARED' | 'SAFELY_DELIVERED' | 'SOS_EMERGENCY_TRIGGERED';
  departureTimestamp: string;
  statutory24HrDeadlineTimestamp: string; // Sec 187(4) BNSS 24-hr transit limit
  borderHandoverPoliceStation: string;
  transitRemandMagistrateOrderSha256: string;
  biometricHandoverPassHash: string;
}

export interface CBRNExplosivesLabRecord {
  analysisId: string;
  incidentReference: string;
  threatType: 'HIGH_EXPLOSIVE_MILITARY' | 'RADIOLOGICAL_ISOTOPE' | 'CHEMICAL_TOXIN' | 'BIOLOGICAL_PATHOGEN';
  substanceIdentified: string; // e.g. "Military Grade RDX with Polyisobutylene binder"
  spectroscopyGcMsSpectrumSha256: string;
  radiationOrToxicityScore: string; // e.g. "High Velocity Detonation: 8,750 m/s"
  accreditationAuthority: 'NFSU_NATIONAL_FORENSIC_SCIENCES_UNIVERSITY' | 'DRDO_CFEES_EXPLOSIVES_CENTRE' | 'BARC_DAE_ATOMIC_BOARD';
  hermeticVaultStorageCell: string;
  chiefScientistExaminer: string;
  analysisCompletionTimestamp: string;
  courtEvidentiaryCertificateBSA63Sha256: string;
  chainOfCustodyVerified: boolean;
}

export interface MaritimeCoastalSurveillanceRecord {
  incursionId: string;
  vesselNameOrCallsign: string;
  vesselType: 'UNREGISTERED_SPEED_DHOW' | 'MERCHANT_CARGO_VESSEL' | 'TRAWLER_UNAUTHORIZED_EEZ';
  flagState: string;
  gpsCoordinates: {
    latitude: number;
    longitude: number;
    nauticalMilesFromShore: number;
    coastalSector: string; // e.g. "Gujarat Coastline Sector 4 (Kori Creek)"
  };
  interceptingUnit: 'INDIAN_COAST_GUARD_ICG' | 'STATE_MARINE_POLICE' | 'INDIAN_NAVY_PATROL';
  contrabandSeizedDescription: string;
  seizedContrabandValueRupees: number;
  crewMembersDetainedCount: number;
  maritimeAudioVideoPanchnamaSha256: string; // Sec 105 BNSS
  designatedCoastalPoliceStation: string;
  interceptionTimestamp: string;
  vesselConfiscationStatus: 'SEIZED_IN_COASTAL_CUSTODY' | 'FORFEITURE_UNDER_PROCESS' | 'RELEASED_CLEARED';
}

export interface EmergencyConstitutionalBenchRecord {
  emergencyOrderId: string;
  orderType: 'SEC_163_BNSS_PROHIBITORY_ORDER' | 'HABEAS_CORPUS_WRIT_ART_226' | 'DISASTER_SPECIAL_BENCH_DMA';
  title: string;
  affectedGeographicalZone: {
    districtName: string;
    centerCoordinates: { latitude: number; longitude: number };
    containmentRadiusKm: number;
  };
  presidingJudgeOrMagistrate: string;
  curfewStatus: 'STRICT_CURFEW_ENFORCED' | 'ESSENTIAL_SERVICES_EXEMPTED' | 'NORMALCY_RESTORED';
  teleHearingConducted: boolean;
  orderSummary: string;
  effectiveFrom: string;
  effectiveUntil: string;
  magisterialSealSha256: string;
}

// ==========================================
// PHASE 15: VOICE BIOMETRICS, DRONE INVASION, DIGITAL BAIL BOND & SC CONSTITUTIONAL BENCH
// ==========================================

export interface AcousticVoiceBiometricRecord {
  sampleId: string;
  caseNumberRef: string;
  suspectNameOrAlias: string;
  audioSourceType: 'INTERCEPTED_RANSOM_CALL' | 'WIRETAP_EXTORTION_RECORDING' | 'COURTROOM_TESTIMONY_DEPOSITION';
  durationSeconds: number;
  acousticMetrics: {
    fundamentalFrequencyF0Hz: number;
    formantF1Hz: number;
    formantF2Hz: number;
    formantF3Hz: number;
    jitterPercent: number;
    shimmerPercent: number;
  };
  syntheticAiDetection: 'GENUINE_HUMAN_VOICE' | 'SYNTHETIC_AI_VOICE_CLONE' | 'RE_SYNTHESIZED_DEEPFAKE';
  likelihoodRatioMatchPercentage: number; // e.g. 99.4%
  spectrogramMfccSha256: string;
  chiefAcousticForensicOfficer: string;
  evidentiaryCertificateBSA63Sha256: string;
}

export interface CounterTerrorDroneIncursionRecord {
  droneIncidentId: string;
  sectorName: string; // e.g. "Punjab Border - Gurdaspur Sector"
  gpsCoordinates: { latitude: number; longitude: number };
  interceptionTimestamp: string;
  droneType: 'HEXACOPTER_CUSTOM_HEAVY_LIFT' | 'QUADCOPTER_SURVEILLANCE' | 'FIXED_WING_LOITERING_UAV';
  neutralizationMethod: 'SOFT_KILL_RF_JAMMING' | 'HARD_KILL_KINETIC_DEFENSE' | 'GPS_SPOOF_AUTO_LAND';
  payloadRecovered: string; // e.g. "Military Grade Arms, 5 Glock Pistols, 4 kg Heroin, Timer Detonators"
  payloadEstimatedValueRupees: number;
  firmwareTelemetryExtracted: {
    flightLogWaypointsCount: number;
    launchOriginCoordinates: string;
    targetDropZoneCoordinates: string;
    flightControllerSerial: string;
  };
  specialUAPACourtRef: string;
  uapaEvidenceSha256: string;
}

export interface DigitalBailBondSuretyRecord {
  bailBondId: string;
  inmateIdRef: string;
  inmateName: string;
  caseNumberRef: string;
  bailAmountRupees: number;
  suretyDetails: {
    suretyName: string;
    aadhaarMasked: string;
    relationshipWithAccused: string;
    solvencyVerificationType: 'LAND_REVENUE_RECORD_DIGILOCKER' | 'BANK_FD_LIEN_HOLD' | 'SALARY_CERTIFICATE_VERIFIED';
    solvencyVerifiedAmountRupees: number;
  };
  sec491BNSSForfeitureLiabilityRisk: 'LOW_RISK_FIRST_TIME' | 'MEDIUM_RISK' | 'HIGH_RISK_MONITORED';
  icjsPrisonReleaseDispatchTimestamp: string; // direct release within 60 mins
  releaseDispatchStatus: 'TRANSMITTED_TO_PRISON_SUPERINTENDENT' | 'INMATE_RELEASED_CUSTODY' | 'PENDING_SURETY_SIGN';
  digitalBailBondQrSealSha256: string;
}

export interface SupremeCourtFullCourtBenchRecord {
  benchReferenceId: string;
  benchStrength: '5_JUDGE_CONSTITUTION_BENCH' | '7_JUDGE_LARGER_BENCH' | '9_JUDGE_FULL_COURT_CONSTITUTIONAL';
  caseTitle: string;
  constitutionalArticlesInvolved: string[]; // e.g. ["Article 14", "Article 21", "Article 142", "Article 370"]
  presidingChiefJustice: string;
  coramJudges: string[];
  ratioDecidendiLawSummary: string;
  article142CompleteJusticeDirective: string;
  unanimousOrMajorityDecision: 'UNANIMOUS_CONCURRENCE' | 'MAJORITY_OPINION_WITH_DISSENT';
  bindingPrecedentStatus: 'LAW_OF_THE_LAND_ART_141';
  judgmentDate: string;
  pqcPostQuantumRootSealSha256: string;
}








