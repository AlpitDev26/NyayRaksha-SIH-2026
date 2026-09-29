import { CaseFile, DocumentRecord, EvidenceItem, ForensicReport, CustodyTransferRecord, UserRole } from '../types';
import { INITIAL_CASES, INITIAL_LEDGER_BLOCKS } from '../data/mockCases';
import { BlockchainLedgerService } from './blockchainLedger';
import { computeSHA256, generateDigitalSignature, generateStorageVaultURI, computeMerkleRoot } from './cryptoEngine';

const STORAGE_CASES_KEY = 'nsdj_dms_cases_v1';
const STORAGE_LEDGER_KEY = 'nsdj_dms_ledger_v1';

class StorageService {
  private cases: CaseFile[] = [];
  public ledger: BlockchainLedgerService;

  constructor() {
    const savedBlocks = localStorage.getItem(STORAGE_LEDGER_KEY);
    const initialBlocks = savedBlocks ? JSON.parse(savedBlocks) : INITIAL_LEDGER_BLOCKS;
    this.ledger = new BlockchainLedgerService(initialBlocks);

    const savedCases = localStorage.getItem(STORAGE_CASES_KEY);
    if (savedCases) {
      try {
        this.cases = JSON.parse(savedCases);
      } catch {
        this.cases = JSON.parse(JSON.stringify(INITIAL_CASES));
      }
    } else {
      this.cases = JSON.parse(JSON.stringify(INITIAL_CASES));
      this.saveCases();
    }
  }

  private saveCases(): void {
    localStorage.setItem(STORAGE_CASES_KEY, JSON.stringify(this.cases));
    localStorage.setItem(STORAGE_LEDGER_KEY, JSON.stringify(this.ledger.getBlocks()));
  }

  public getCases(): CaseFile[] {
    return this.cases;
  }

  public getCaseById(caseId: string): CaseFile | undefined {
    return this.cases.find(c => c.id === caseId || c.caseNumber === caseId);
  }

  public async registerNewCase(newCaseData: Omit<CaseFile, 'id' | 'stage' | 'createdTimestamp' | 'lastUpdatedTimestamp' | 'merkleRoot' | 'tamperStatus' | 'documents' | 'evidenceItems' | 'forensicReports' | 'hearingDates'> & {
    firNarrative: string;
    filingOfficerName: string;
    filingOfficerBadge: string;
    filingOfficerDept: string;
  }): Promise<CaseFile> {
    const caseId = 'case-' + Date.now().toString(36);
    const createdTimestamp = new Date().toISOString();

    // 1. Generate E-FIR Document
    const firDocId = 'doc-fir-' + Date.now().toString(36);
    const firContent = `[GOVERNMENT OF INDIA - FIRST INFORMATION REPORT]
CASE REF: ${newCaseData.caseNumber}
POLICE STATION: ${newCaseData.policeStation}
STATE: ${newCaseData.jurisdictionState}
COMPLAINANT: ${newCaseData.complainant.name} (${newCaseData.complainant.contact})
ACCUSED: ${newCaseData.accused.map(a => a.name).join(', ')}
ACTS & SECTIONS: ${newCaseData.legalActsAndSections.join(', ')}
INCIDENT / OCCURRENCE NARRATIVE:
${newCaseData.firNarrative}
FILED BY: ${newCaseData.filingOfficerName} (Badge: ${newCaseData.filingOfficerBadge})
DATE & TIME OF REGISTRATION: ${createdTimestamp}
CERTIFIED DIGITAL ROOT RECORD ANCHORED ON NSDJ BLOCKCHAIN INFRASTRUCTURE`;

    const firHash = await computeSHA256(firContent);
    const storageUri = generateStorageVaultURI(newCaseData.caseNumber, 'FIR', firDocId);

    const signature = await generateDigitalSignature(
      firHash,
      newCaseData.filingOfficerName,
      'Investigating Officer',
      newCaseData.filingOfficerDept,
      newCaseData.filingOfficerBadge
    );

    // 2. Anchor on Blockchain
    const anchorResult = await this.ledger.anchorTransaction({
      timestamp: createdTimestamp,
      docId: firDocId,
      caseNumber: newCaseData.caseNumber,
      documentType: 'FIR',
      sha256Hash: firHash,
      docStorageUri: storageUri,
      metadataDigest: await computeSHA256(JSON.stringify(newCaseData.legalActsAndSections)),
      signatureHex: signature.signatureHex,
      signerOrg: newCaseData.filingOfficerDept,
      signerRole: 'Investigating Officer',
    });

    const firDocRecord: DocumentRecord = {
      id: firDocId,
      caseId,
      caseNumber: newCaseData.caseNumber,
      title: `E-FIR Registration Document (${newCaseData.caseNumber})`,
      documentType: 'FIR',
      classification: 'RESTRICTED',
      fileFormat: 'PDF',
      fileSizeKb: Math.max(180, Math.floor(firContent.length / 10)),
      sha256Hash: firHash,
      storageUri,
      encryptionAlgorithm: 'AES-256-GCM',
      encryptionKeyId: `KMS-${newCaseData.jurisdictionState.toUpperCase().slice(0, 3)}-2026-KEY`,
      uploadedBy: {
        name: newCaseData.filingOfficerName,
        badgeId: newCaseData.filingOfficerBadge,
        role: 'investigating_officer',
        department: newCaseData.filingOfficerDept,
      },
      createdAt: createdTimestamp,
      digitalSignatures: [
        {
          ...signature,
          signerName: newCaseData.filingOfficerName,
          signerRole: 'Investigating Officer',
          signerDesignation: newCaseData.leadInvestigator.rank,
          organization: newCaseData.filingOfficerDept,
          signatureAlgorithm: 'SHA256withECDSA',
          isValid: true,
        },
      ],
      blockchainTxId: anchorResult.transaction.txId,
      blockNumber: anchorResult.block.blockNumber,
      isAnchored: true,
      tamperState: 'VERIFIED',
      summary: newCaseData.firNarrative.slice(0, 180) + '...',
      metadata: {
        filingDate: createdTimestamp,
        policeStation: newCaseData.policeStation,
      },
      fileContentPreview: firContent,
    };

    const newCase: CaseFile = {
      id: caseId,
      caseNumber: newCaseData.caseNumber,
      cnrNumber: newCaseData.cnrNumber,
      courtName: newCaseData.courtName,
      policeStation: newCaseData.policeStation,
      jurisdictionState: newCaseData.jurisdictionState,
      title: newCaseData.title,
      legalActsAndSections: newCaseData.legalActsAndSections,
      firDate: newCaseData.firDate,
      stage: 'fir_registered',
      priority: newCaseData.priority,
      leadInvestigator: newCaseData.leadInvestigator,
      complainant: newCaseData.complainant,
      accused: newCaseData.accused,
      witnessCount: newCaseData.witnessCount || 0,
      documents: [firDocRecord],
      evidenceItems: [],
      forensicReports: [],
      hearingDates: [],
      createdTimestamp,
      lastUpdatedTimestamp: createdTimestamp,
      merkleRoot: firHash,
      tamperStatus: 'CLEAN_VERIFIED',
    };

    this.cases.unshift(newCase);
    this.saveCases();
    return newCase;
  }

  public async addDocument(
    caseId: string,
    docInput: {
      title: string;
      documentType: DocumentRecord['documentType'];
      classification: DocumentRecord['classification'];
      fileFormat: DocumentRecord['fileFormat'];
      fileSizeKb: number;
      fileContent: string;
      uploaderName: string;
      uploaderBadge: string;
      uploaderRole: UserRole;
      uploaderDept: string;
      metadata?: Record<string, string | number | boolean>;
    }
  ): Promise<DocumentRecord> {
    const targetCase = this.getCaseById(caseId);
    if (!targetCase) throw new Error('Case not found');

    const docId = 'doc-' + Date.now().toString(36);
    const createdTimestamp = new Date().toISOString();
    const sha256Hash = await computeSHA256(docInput.fileContent);
    const storageUri = generateStorageVaultURI(targetCase.caseNumber, docInput.documentType, docId);

    const sigData = await generateDigitalSignature(
      sha256Hash,
      docInput.uploaderName,
      docInput.uploaderRole,
      docInput.uploaderDept,
      docInput.uploaderBadge
    );

    const anchorResult = await this.ledger.anchorTransaction({
      timestamp: createdTimestamp,
      docId,
      caseNumber: targetCase.caseNumber,
      documentType: docInput.documentType,
      sha256Hash,
      docStorageUri: storageUri,
      metadataDigest: await computeSHA256(JSON.stringify(docInput.metadata || {})),
      signatureHex: sigData.signatureHex,
      signerOrg: docInput.uploaderDept,
      signerRole: docInput.uploaderRole,
    });

    const newDoc: DocumentRecord = {
      id: docId,
      caseId: targetCase.id,
      caseNumber: targetCase.caseNumber,
      title: docInput.title,
      documentType: docInput.documentType,
      classification: docInput.classification,
      fileFormat: docInput.fileFormat,
      fileSizeKb: docInput.fileSizeKb,
      sha256Hash,
      storageUri,
      encryptionAlgorithm: 'AES-256-GCM',
      encryptionKeyId: `KMS-${targetCase.jurisdictionState.slice(0, 3).toUpperCase()}-2026-KEY`,
      uploadedBy: {
        name: docInput.uploaderName,
        badgeId: docInput.uploaderBadge,
        role: docInput.uploaderRole,
        department: docInput.uploaderDept,
      },
      createdAt: createdTimestamp,
      digitalSignatures: [
        {
          ...sigData,
          signerName: docInput.uploaderName,
          signerRole: docInput.uploaderRole,
          signerDesignation: 'Authorized Officer',
          organization: docInput.uploaderDept,
          signatureAlgorithm: 'SHA256withECDSA',
          isValid: true,
        },
      ],
      blockchainTxId: anchorResult.transaction.txId,
      blockNumber: anchorResult.block.blockNumber,
      isAnchored: true,
      tamperState: 'VERIFIED',
      summary: docInput.title,
      metadata: docInput.metadata || {},
      fileContentPreview: docInput.fileContent,
    };

    targetCase.documents.unshift(newDoc);
    targetCase.lastUpdatedTimestamp = createdTimestamp;

    // Recalculate case Merkle root
    const allDocHashes = targetCase.documents.map(d => d.sha256Hash);
    targetCase.merkleRoot = await computeMerkleRoot(allDocHashes);

    this.saveCases();
    return newDoc;
  }

  public async registerEvidence(
    caseId: string,
    evidenceInput: {
      title: string;
      category: EvidenceItem['category'];
      description: string;
      collectedLocation: string;
      officerName: string;
      officerBadge: string;
      officerDept: string;
      tamperSealNumber: string;
      sampleRawContent: string;
    }
  ): Promise<EvidenceItem> {
    const targetCase = this.getCaseById(caseId);
    if (!targetCase) throw new Error('Case not found');

    const evidenceId = 'evd-' + Date.now().toString(36);
    const collectedAt = new Date().toISOString();
    const sha256Checksum = await computeSHA256(
      `${evidenceInput.title}:${evidenceInput.category}:${evidenceInput.tamperSealNumber}:${evidenceInput.sampleRawContent}`
    );

    const sigData = await generateDigitalSignature(
      sha256Checksum,
      evidenceInput.officerName,
      'Investigating Officer',
      evidenceInput.officerDept,
      evidenceInput.officerBadge
    );

    const anchorResult = await this.ledger.anchorTransaction({
      timestamp: collectedAt,
      docId: evidenceId,
      caseNumber: targetCase.caseNumber,
      documentType: 'EVIDENCE_ANCHOR',
      sha256Hash: sha256Checksum,
      docStorageUri: `nsdj-vault://evidence-malkhana/${targetCase.caseNumber}/${evidenceId}`,
      metadataDigest: await computeSHA256(evidenceInput.description),
      signatureHex: sigData.signatureHex,
      signerOrg: evidenceInput.officerDept,
      signerRole: 'Investigating Officer',
    });

    const newEvidence: EvidenceItem = {
      id: evidenceId,
      caseId: targetCase.id,
      evidenceCode: `EVD-2026-${targetCase.jurisdictionState.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: evidenceInput.title,
      category: evidenceInput.category,
      description: evidenceInput.description,
      collectedAt,
      collectedLocation: evidenceInput.collectedLocation,
      collectingOfficer: `${evidenceInput.officerName} (${evidenceInput.officerBadge})`,
      seizureMemoDocId: targetCase.documents[0]?.id || '',
      currentCustodian: `${evidenceInput.officerName}`,
      custodianDepartment: evidenceInput.officerDept,
      storageVaultLocation: `SEC-VAULT-BAY-${Math.floor(1 + Math.random() * 20)}`,
      sha256Checksum,
      barcodeQr: `NSDJ-EVD-${evidenceId.toUpperCase()}-VERIFIED`,
      tamperSealNumber: evidenceInput.tamperSealNumber,
      sealStatus: 'INTACT_VERIFIED',
      blockchainAnchored: true,
      txHash: anchorResult.transaction.txId,
      chainOfCustody: [
        {
          id: 'coc-init-' + Date.now().toString(36),
          timestamp: collectedAt,
          fromOfficer: 'Scene of Crime / Seizure Point',
          fromDepartment: 'Field Recovery Team',
          toOfficer: evidenceInput.officerName,
          toDepartment: evidenceInput.officerDept,
          purpose: 'Initial Seizure & Cryptographic Tamper-Evident Bagging',
          location: evidenceInput.collectedLocation,
          sealCondition: 'INTACT_SEALED',
          signature: {
            ...sigData,
            signerName: evidenceInput.officerName,
            signerRole: 'Investigating Officer',
            signerDesignation: 'Seizure Officer',
            organization: evidenceInput.officerDept,
            signatureAlgorithm: 'SHA256withECDSA',
            isValid: true,
          },
          txHash: anchorResult.transaction.txId,
        },
      ],
    };

    targetCase.evidenceItems.unshift(newEvidence);
    if (targetCase.stage === 'fir_registered') {
      targetCase.stage = 'evidence_collected';
    }
    targetCase.lastUpdatedTimestamp = collectedAt;
    this.saveCases();
    return newEvidence;
  }

  public async transferEvidenceCustody(
    caseId: string,
    evidenceId: string,
    transferData: {
      fromOfficer: string;
      fromDept: string;
      toOfficer: string;
      toDept: string;
      purpose: string;
      location: string;
      sealCondition: CustodyTransferRecord['sealCondition'];
      signerBadge: string;
    }
  ): Promise<CustodyTransferRecord> {
    const targetCase = this.getCaseById(caseId);
    if (!targetCase) throw new Error('Case not found');
    const evidence = targetCase.evidenceItems.find(e => e.id === evidenceId);
    if (!evidence) throw new Error('Evidence not found');

    const timestamp = new Date().toISOString();
    const handoverDigest = await computeSHA256(
      `${evidence.sha256Checksum}:${transferData.fromOfficer}:${transferData.toOfficer}:${timestamp}`
    );

    const signature = await generateDigitalSignature(
      handoverDigest,
      transferData.fromOfficer,
      'Custodian',
      transferData.fromDept,
      transferData.signerBadge
    );

    const anchorResult = await this.ledger.anchorTransaction({
      timestamp,
      docId: evidence.id,
      caseNumber: targetCase.caseNumber,
      documentType: 'CUSTODY_HANDOVER',
      sha256Hash: handoverDigest,
      docStorageUri: `nsdj-vault://evidence-malkhana/${targetCase.caseNumber}/${evidence.id}/handover`,
      metadataDigest: await computeSHA256(transferData.purpose),
      signatureHex: signature.signatureHex,
      signerOrg: transferData.fromDept,
      signerRole: 'Custodian Officer',
    });

    const newRecord: CustodyTransferRecord = {
      id: 'coc-' + Date.now().toString(36),
      timestamp,
      fromOfficer: transferData.fromOfficer,
      fromDepartment: transferData.fromDept,
      toOfficer: transferData.toOfficer,
      toDepartment: transferData.toDept,
      purpose: transferData.purpose,
      location: transferData.location,
      sealCondition: transferData.sealCondition,
      signature: {
        ...signature,
        signerName: transferData.fromOfficer,
        signerRole: 'Custodian Officer',
        signerDesignation: 'Authorized Handover Signatory',
        organization: transferData.fromDept,
        signatureAlgorithm: 'SHA256withECDSA',
        isValid: true,
      },
      txHash: anchorResult.transaction.txId,
    };

    evidence.chainOfCustody.unshift(newRecord);
    evidence.currentCustodian = transferData.toOfficer;
    evidence.custodianDepartment = transferData.toDept;
    targetCase.lastUpdatedTimestamp = timestamp;

    this.saveCases();
    return newRecord;
  }

  public async submitForensicReport(
    caseId: string,
    reportData: {
      fslRefNumber: string;
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
    }
  ): Promise<ForensicReport> {
    const targetCase = this.getCaseById(caseId);
    if (!targetCase) throw new Error('Case not found');

    const reportId = 'fsl-' + Date.now().toString(36);
    const dateCompleted = new Date().toISOString();
    const rawReportContent = `${reportData.fslRefNumber}:${reportData.testType}:${reportData.findings}:${reportData.conclusion}`;
    const reportHash = await computeSHA256(rawReportContent);
    const rawExtractionHash = await computeSHA256(reportData.findings + ':RAW_BITSTREAM');

    const signature = await generateDigitalSignature(
      reportHash,
      reportData.examinerName,
      'Forensic Scientist',
      reportData.laboratory,
      reportData.examinerBadge
    );

    const anchorResult = await this.ledger.anchorTransaction({
      timestamp: dateCompleted,
      docId: reportId,
      caseNumber: targetCase.caseNumber,
      documentType: 'FORENSIC_FSL_REPORT',
      sha256Hash: reportHash,
      docStorageUri: generateStorageVaultURI(targetCase.caseNumber, 'FORENSIC_FSL_REPORT', reportId),
      metadataDigest: await computeSHA256(reportData.fslRefNumber),
      signatureHex: signature.signatureHex,
      signerOrg: reportData.laboratory,
      signerRole: 'Forensic Examiner',
    });

    const newReport: ForensicReport = {
      id: reportId,
      caseId: targetCase.id,
      fslRefNumber: reportData.fslRefNumber,
      examinerName: reportData.examinerName,
      examinerBadge: reportData.examinerBadge,
      laboratory: reportData.laboratory,
      evidenceItemId: reportData.evidenceItemId,
      testType: reportData.testType,
      methodology: reportData.methodology,
      findings: reportData.findings,
      conclusion: reportData.conclusion,
      confidenceScore: reportData.confidenceScore,
      instrumentCalibrationRef: reportData.instrumentCalibrationRef,
      rawExtractionHash,
      reportHash,
      dateCompleted,
      status: 'SUBMITTED',
      signature: {
        ...signature,
        signerName: reportData.examinerName,
        signerRole: 'Forensic Scientist',
        signerDesignation: 'Senior Scientific Officer',
        organization: reportData.laboratory,
        signatureAlgorithm: 'SHA256withRSA',
        isValid: true,
      },
      blockchainTxId: anchorResult.transaction.txId,
    };

    targetCase.forensicReports.unshift(newReport);
    if (targetCase.stage === 'evidence_collected' || targetCase.stage === 'investigation') {
      targetCase.stage = 'forensic_analysis';
    }
    targetCase.lastUpdatedTimestamp = dateCompleted;

    this.saveCases();
    return newReport;
  }

  public async submitChargeSheet(
    caseId: string,
    chargeSheetData: {
      sectionsCharged: string[];
      summaryOfEvidence: string;
      prosecutionCognizanceReview: 'PENDING' | 'APPROVED' | 'AMENDMENT_REQUIRED';
      prosecutorNotes?: string;
    }
  ): Promise<void> {
    const targetCase = this.getCaseById(caseId);
    if (!targetCase) throw new Error('Case not found');

    const datePrepared = new Date().toISOString();
    targetCase.chargeSheetDraft = {
      datePrepared,
      sectionsCharged: chargeSheetData.sectionsCharged,
      prosecutionCognizanceReview: chargeSheetData.prosecutionCognizanceReview,
      prosecutorNotes: chargeSheetData.prosecutorNotes,
      summaryOfEvidence: chargeSheetData.summaryOfEvidence,
    };

    if (chargeSheetData.prosecutionCognizanceReview === 'APPROVED') {
      targetCase.stage = 'court_efiling';
    } else {
      targetCase.stage = 'charge_sheet_draft';
    }
    targetCase.lastUpdatedTimestamp = datePrepared;

    this.saveCases();
  }

  public async issueJudicialOrder(
    caseId: string,
    orderData: {
      orderTitle: string;
      orderType: 'BAIL_ORDER' | 'JUDICIAL_WARRANT' | 'COURT_ORDER_SHEET' | 'FINAL_JUDGMENT';
      judgeName: string;
      judgeDesignation: string;
      orderText: string;
      nextHearingDate?: string;
      nextHearingPurpose?: string;
      verdict?: 'CONVICTED' | 'ACQUITTED' | 'PARTIALLY_CONVICTED' | 'DISMISSED';
      sentenceSummary?: string;
    }
  ): Promise<DocumentRecord> {
    const targetCase = this.getCaseById(caseId);
    if (!targetCase) throw new Error('Case not found');

    const docId = 'doc-order-' + Date.now().toString(36);
    const createdTimestamp = new Date().toISOString();
    const sha256Hash = await computeSHA256(orderData.orderText);
    const storageUri = generateStorageVaultURI(targetCase.caseNumber, orderData.orderType, docId);

    const sigData = await generateDigitalSignature(
      sha256Hash,
      orderData.judgeName,
      'Judicial Magistrate',
      targetCase.courtName,
      'JUD-BENCH-01'
    );

    const anchorResult = await this.ledger.anchorTransaction({
      timestamp: createdTimestamp,
      docId,
      caseNumber: targetCase.caseNumber,
      documentType: orderData.orderType,
      sha256Hash,
      docStorageUri: storageUri,
      metadataDigest: await computeSHA256(orderData.orderTitle),
      signatureHex: sigData.signatureHex,
      signerOrg: targetCase.courtName,
      signerRole: 'Judicial Magistrate / Judge',
    });

    const newDoc: DocumentRecord = {
      id: docId,
      caseId: targetCase.id,
      caseNumber: targetCase.caseNumber,
      title: orderData.orderTitle,
      documentType: orderData.orderType,
      classification: 'UNCLASSIFIED',
      fileFormat: 'PDF',
      fileSizeKb: 320,
      sha256Hash,
      storageUri,
      encryptionAlgorithm: 'AES-256-GCM',
      encryptionKeyId: 'KMS-COURT-SEAL-2026',
      uploadedBy: {
        name: orderData.judgeName,
        badgeId: 'JUD-BENCH-01',
        role: 'judicial_magistrate',
        department: targetCase.courtName,
      },
      createdAt: createdTimestamp,
      digitalSignatures: [
        {
          ...sigData,
          signerName: orderData.judgeName,
          signerRole: 'Judicial Officer',
          signerDesignation: orderData.judgeDesignation,
          organization: targetCase.courtName,
          signatureAlgorithm: 'SHA256withRSA',
          isValid: true,
        },
      ],
      blockchainTxId: anchorResult.transaction.txId,
      blockNumber: anchorResult.block.blockNumber,
      isAnchored: true,
      tamperState: 'VERIFIED',
      summary: orderData.orderText.slice(0, 150) + '...',
      metadata: {
        courtName: targetCase.courtName,
        presidingJudge: orderData.judgeName,
      },
      fileContentPreview: orderData.orderText,
    };

    targetCase.documents.unshift(newDoc);

    if (orderData.nextHearingDate && orderData.nextHearingPurpose) {
      targetCase.hearingDates.push({
        date: orderData.nextHearingDate,
        purpose: orderData.nextHearingPurpose,
        bench: orderData.judgeName,
      });
      targetCase.stage = 'judicial_trial';
    }

    if (orderData.orderType === 'FINAL_JUDGMENT' && orderData.verdict) {
      targetCase.judicialJudgment = {
        deliveryDate: createdTimestamp.slice(0, 10),
        presidingJudge: orderData.judgeName,
        verdict: orderData.verdict,
        sentenceSummary: orderData.sentenceSummary,
        certifiedCopyDocId: docId,
      };
      targetCase.stage = 'judgment_delivered';
    }

    targetCase.lastUpdatedTimestamp = createdTimestamp;
    this.saveCases();
    return newDoc;
  }

  // Simulate document tampering for live security demonstration
  public simulateDocumentTampering(caseId: string, docId: string): boolean {
    const targetCase = this.getCaseById(caseId);
    if (!targetCase) return false;
    const doc = targetCase.documents.find(d => d.id === docId);
    if (!doc) return false;

    // Mutate the hash without updating the blockchain ledger
    doc.sha256Hash = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    doc.tamperState = 'TAMPERED';
    targetCase.tamperStatus = 'TAMPER_ALERT';
    this.saveCases();
    return true;
  }

  // Restore document from immutable blockchain ledger state
  public restoreDocumentFromLedger(caseId: string, docId: string): boolean {
    const targetCase = this.getCaseById(caseId);
    if (!targetCase) return false;
    const doc = targetCase.documents.find(d => d.id === docId);
    if (!doc) return false;

    const ledgerMatch = this.ledger.findTransactionByDocId(docId);
    if (ledgerMatch.found && ledgerMatch.tx) {
      doc.sha256Hash = ledgerMatch.tx.sha256Hash;
      doc.tamperState = 'VERIFIED';
      targetCase.tamperStatus = 'CLEAN_VERIFIED';
      this.saveCases();
      return true;
    }
    return false;
  }

  public resetAllData(): void {
    localStorage.removeItem(STORAGE_CASES_KEY);
    localStorage.removeItem(STORAGE_LEDGER_KEY);
    this.ledger.resetLedger(INITIAL_LEDGER_BLOCKS);
    this.cases = JSON.parse(JSON.stringify(INITIAL_CASES));
    this.saveCases();
  }
}

export const storageService = new StorageService();
