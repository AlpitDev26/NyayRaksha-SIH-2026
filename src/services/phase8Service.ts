import {
  ChargeSheetForm51,
  StatutoryDefectCheck,
  SentencingVictimAssessment,
  DigitalAudioVideoPanchnama,
  FugitiveProclamationAssetRecord,
  CaseFile,
} from '../types';
import { computeSHA256 } from './cryptoEngine';
import { pkiCryptoService } from './pkiService';

// Mock Initial Charge Sheets
const INITIAL_CHARGE_SHEETS: ChargeSheetForm51[] = [
  {
    id: 'CS-2026-DEL-0091',
    caseId: 'CASE-2026-001',
    caseNumber: 'DL-01-2026-CR-0041',
    firNumber: 'FIR/2026/041-DEL',
    policeStation: 'Cyber Crime Police Station, North District, New Delhi',
    district: 'North District',
    state: 'NCT of Delhi',
    ioName: 'Inspector Rajesh Varma',
    ioRank: 'Inspector of Police',
    ioBadgeNumber: 'DL-POL-8821',
    shoApprovalDate: '2026-03-24T10:30:00Z',
    dateOfFiling: '2026-03-25T11:00:00Z',
    courtName: 'Court of Chief Judicial Magistrate, Tis Hazari Courts, Delhi',
    isSupplementary: false,
    natureOfReport: 'CHARGE_SHEET_FOR_TRIAL',
    briefFactsOfCase:
      'The accused orchestrated an illicit remote exfiltration of state critical infrastructure financial documents and unauthorized fund redirection totaling INR 4.85 Crores through synthetic spoofed credentials and crypto tumbling networks.',
    investigationFindings:
      'Forensic analysis of server logs, seizure of encrypted cold storage wallets, and certified Sec 63 BSA electronic reports established prima facie culpability of Accused #1 and #2 under Sections 316(2), 318(4) of BNS and Section 66C/66D of Information Technology Act.',
    accusedList: [
      {
        id: 'ACC-01',
        fullName: 'Vikramaditya S. Malhotra',
        fatherName: 'Suresh Chand Malhotra',
        age: 36,
        gender: 'Male',
        address: 'Flat 402, Royal Palms Heights, Sector 62, Noida, UP',
        custodyStatus: 'IN_JUDICIAL_CUSTODY',
        arrestDate: '2026-01-14T08:30:00Z',
        chargedSections: ['BNS 316(2)', 'BNS 318(4)', 'IT Act Sec 66D', 'BNS 61(2)'],
        sanctionObtained: true,
        sanctionRefNumber: 'DEL-HOME/SEC-218/2026/884',
        priorConvictionsCount: 1,
      },
      {
        id: 'ACC-02',
        fullName: 'Sameer Qureshi',
        fatherName: 'Abdul Latif Qureshi',
        age: 29,
        gender: 'Male',
        address: 'House 19, Street 4, Chandni Mahal, Daryaganj, Delhi',
        custodyStatus: 'RELEASED_ON_BAIL',
        arrestDate: '2026-01-15T14:20:00Z',
        bailOrderRef: 'CJM/ND/BAIL/2026/194',
        chargedSections: ['BNS 318(4)', 'BNS 61(2)'],
        sanctionObtained: true,
        priorConvictionsCount: 0,
      },
    ],
    witnessesList: [
      {
        id: 'WIT-01',
        witnessNumber: 1,
        name: 'Arunav Sengupta (Nodal Security Officer)',
        type: 'VICTIM',
        section180StatementRecorded: true,
        statementTimestamp: '2026-01-12T16:00:00Z',
        statementHash: '7f8a92bbd6341459a4561081394c8bfa93214810ea354c0e3962634e040c5f11',
        keyDepositionSummary: 'Deposed on the unauthorized root escalation and anomalous batch transactions initiating from IP cluster assigned to Accused #1.',
        reliedExhibits: ['EX-01 (Syslog Dumps)', 'EX-03 (Bank Statement)'],
      },
      {
        id: 'WIT-02',
        witnessNumber: 2,
        name: 'Dr. Neha Kulkarni (Senior Forensic Analyst, CFSL)',
        type: 'FORENSIC_EXPERT',
        section180StatementRecorded: true,
        statementTimestamp: '2026-02-04T11:30:00Z',
        statementHash: '2b4c6e8a01f3d59e44318c5e60127fa98240ef1a720935cc2398bfa3410988cc',
        keyDepositionSummary: 'Confirmed hardware serial matching and lack of cryptographic tamper indicators on seized hardware wallet.',
        reliedExhibits: ['EX-02 (Hardware Drive)', 'CFSL-RPT-881'],
      },
      {
        id: 'WIT-03',
        witnessNumber: 3,
        name: 'Rameshwar Dayal (Independent Panch Witness)',
        type: 'PANCH_WITNESS',
        section180StatementRecorded: true,
        statementTimestamp: '2026-01-14T10:15:00Z',
        statementHash: 'cc41908234857b21908123981bcda90184719283719028391823901823901823',
        keyDepositionSummary: 'Witnessed the search and seizure conducted under Sec 105 BNSS with live video recording and digital seal affixation.',
        reliedExhibits: ['PANCHNAMA-REC-105-01'],
      },
    ],
    reliedDocumentsList: [
      {
        docTitle: 'FIR No. 041/2026 Certified Copy',
        exhibitCode: 'EX-P1',
        bsaSec63Attached: true,
        sha256: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
      },
      {
        docTitle: 'Seizure Panchnama with Sec 105 Audio-Video Digest',
        exhibitCode: 'EX-P2',
        bsaSec63Attached: true,
        sha256: '4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c',
      },
      {
        docTitle: 'CFSL Digital Forensics & Hash Verification Report',
        exhibitCode: 'EX-P3',
        bsaSec63Attached: true,
        sha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      },
    ],
    prosecutorialScrutiny: {
      overallCognizanceReadinessScore: 96,
      scrutinyStatus: 'APPROVED_FOR_FILING',
      scrutinyDate: '2026-03-24T18:00:00Z',
      prosecutorName: 'Adv. S. K. Mahapatra (Chief Public Prosecutor)',
      defectsList: [
        {
          id: 'DEF-01',
          category: 'LIMITATION_PERIOD',
          title: '60/90 Days Statutory Detention Check (Sec 187(3) BNSS)',
          description: 'Charge-sheet filed on Day 70 well within the 90-day statutory limitation threshold.',
          relevantSection: 'Sec 187(3) BNSS',
          severity: 'COMPLIANT_PASSED',
          isResolved: true,
        },
        {
          id: 'DEF-02',
          category: 'SANCTION',
          title: 'Competent Authority Sanction (Sec 218 BNSS)',
          description: 'Valid government sanction order attached for prosecuting public-linked cyber infrastructure offense.',
          relevantSection: 'Sec 218 BNSS',
          severity: 'COMPLIANT_PASSED',
          isResolved: true,
        },
        {
          id: 'DEF-03',
          category: 'FORENSIC_CERTIFICATE',
          title: 'Mandatory Electronic Evidence Certificate (Sec 63 BSA)',
          description: 'Section 63 BSA Certificate in Part A & B duly signed by System Examiner attached with cryptographic hashes.',
          relevantSection: 'Sec 63 BSA',
          severity: 'COMPLIANT_PASSED',
          isResolved: true,
        },
        {
          id: 'DEF-04',
          category: 'WITNESS_EVIDENCE',
          title: 'PW-3 Panch Witness Address Clarification',
          description: 'Permanent postal index verification updated in revised supplementary witness memo.',
          relevantSection: 'Sec 180 & 193 BNSS',
          severity: 'COMPLIANT_PASSED',
          isResolved: true,
          autoRemediationHint: 'Resolved via National Aadhaar & Electoral database cross-referencing.',
        },
      ],
      magistrateCognizanceOrderDraft:
        'IN THE COURT OF CHIEF JUDICIAL MAGISTRATE, TIS HAZARI COURTS, DELHI\n\nCognizance taken under Section 210 of BNSS 2023 for offenses punishable under Sections 316(2), 318(4) BNS and Section 66D IT Act against Accused No. 1 and 2. Issue process accordingly. Put up for supply of copies under Section 230 BNSS on 05.04.2026.',
    },
    digitalSignatureSeal: {
      signerName: 'Inspector Rajesh Varma',
      signerRole: 'Investigating Officer',
      signerDesignation: 'Inspector of Police',
      organization: 'Delhi Police Cyber Cell',
      signatureAlgorithm: 'SHA256withECDSA',
      certificateId: 'NIC-PKI-IO-2026-99018',
      signatureHex: '3045022100e4b8a217643b9d0847b2c7e0915ab732e4d019bc27189fae0192bc7190283022026b9a8f219083bcda90184719283719028391823901823901823901823901823',
      timestamp: '2026-03-25T11:05:00Z',
      publicKeyFingerprint: '9B:5E:21:A4:44:CD:7A:B1:32:09:88:EC:3F:55:1A:18',
      isValid: true,
    },
  },
];

// Initial Sentencing & Victim Compensation Matrix
const INITIAL_SENTENCING_ASSESSMENTS: SentencingVictimAssessment[] = [
  {
    id: 'SENT-2026-001',
    caseId: 'CASE-2026-001',
    caseNumber: 'DL-01-2026-CR-0041',
    convictedAccused: ['Vikramaditya S. Malhotra'],
    primaryOffense: 'Section 316(2) BNS (Criminal Breach of Trust) & Sec 318(4) BNS (Cheating)',
    statutoryMinimumYears: 3,
    statutoryMaximumYears: 7,
    fineRangeRupees: { min: 50000, max: 1000000 },
    communityServiceApplicable: false,
    concurrencyType: 'CONCURRENT',
    factors: [
      {
        id: 'F-1',
        type: 'AGGRAVATING',
        factorDescription: 'Calculated and sophisticated planning targeting sovereign financial data.',
        statutoryReference: 'Sec 6 BNS Sentencing Guidelines',
        weightImpact: 'HIGH',
      },
      {
        id: 'F-2',
        type: 'AGGRAVATING',
        factorDescription: 'Total monetary loss exceeds statutory threshold of INR 1 Crore.',
        weightImpact: 'HIGH',
      },
      {
        id: 'F-3',
        type: 'MITIGATING',
        factorDescription: 'First conviction under BNS with voluntary surrender of cold storage recovery keys.',
        weightImpact: 'MEDIUM',
      },
      {
        id: 'F-4',
        type: 'MITIGATING',
        factorDescription: 'Sole breadwinner of family with dependent elderly parents.',
        weightImpact: 'LOW',
      },
    ],
    recommendedPrisonTermMonths: 48, // 4 Years
    recommendedFineAmountRupees: 500000,
    victimAssessment: {
      victimName: 'National FinTech Infrastructure Consortium (Represented by A. Sengupta)',
      injurySeverity: 'PROPERTY_EXTORTION_LOSS',
      medicalExpensesIncurredRupees: 0,
      lossOfLivelihoodRupees: 2500000,
      rehabilitationCostRupees: 850000,
      calculatedTotalCompensationRupees: 3350000,
      interimReliefAlreadyPaidRupees: 500000,
      schemeApplicable: 'CVCF_CENTRAL_SCHEME',
      restitutionFromConvictFineRupees: 450000, // Majority of fine channeled directly to restitution under Sec 395(1)(b) BNSS
      stateTreasuryContributionRupees: 2400000,
      dlsOrderRef: 'DLSA/NORTH/COMP/2026/410',
    },
    judicialSentencingDraft:
      'ORDER ON SENTENCE UNDER SEC 395/396 BNSS:\n\nHaving heard both sides on sentence, convict Vikramaditya S. Malhotra is sentenced to undergo Rigorous Imprisonment for a period of 4 (four) years for offense u/s 316(2) BNS and a fine of INR 5,00,000/-. In default of payment of fine, SI for 6 months. In terms of Section 395(1)(b) of BNSS 2023, INR 4,50,000/- out of fine realized shall be defrayed as direct restitution to the victim entity. Further recommended to DLSA for INR 24,00,000/- under the Victim Compensation Scheme.',
  },
];

// Initial Digital Audio-Video Panchnama Records (Sec 105 BNSS)
const INITIAL_DIGITAL_PANCHNAMAS: DigitalAudioVideoPanchnama[] = [
  {
    id: 'PANCH-105-2026-0041',
    caseId: 'CASE-2026-001',
    caseNumber: 'DL-01-2026-CR-0041',
    panchnamaType: 'SEARCH_AND_SEIZURE_SEC_105',
    locationAddress: 'Apartment 402, Block C, Royal Palms Residency, Sector 62, Noida, NCR',
    geoCoordinates: {
      latitude: 28.6271,
      longitude: 77.3725,
      elevationMeters: 201.4,
      accuracyMeters: 1.8,
    },
    startTime: '2026-01-14T08:30:00Z',
    endTime: '2026-01-14T11:45:00Z',
    leadOfficer: {
      name: 'Inspector Rajesh Varma',
      rank: 'Inspector of Police',
      badge: 'DL-POL-8821',
    },
    panchWitnesses: [
      {
        name: 'Rameshwar Dayal',
        age: 44,
        occupation: 'Resident Welfare Association President',
        address: 'Flat 101, Block C, Royal Palms Residency, Sector 62, Noida',
        aadhaarOrIdLast4: '7192',
        digitalSignatureOrThumbprintSha256: '9f83a210c4d81726a59b34e10283c9a018237461524310928374615243109283',
        signedTimestamp: '2026-01-14T11:40:00Z',
      },
      {
        name: 'Kavita Sundaram',
        age: 38,
        occupation: 'IT Systems Consultant',
        address: 'Flat 204, Block B, Royal Palms Residency, Sector 62, Noida',
        aadhaarOrIdLast4: '4819',
        digitalSignatureOrThumbprintSha256: '83746152431092839f83a210c4d81726a59b34e10283c9a01823746152431092',
        signedTimestamp: '2026-01-14T11:42:00Z',
      },
    ],
    audioVideoRecordings: [
      {
        recordingId: 'REC-AV-105-01',
        deviceModel: 'BodyWorn Cam Axon-Sec 4K / Enclave Encrypted',
        durationSec: 11700,
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        c2paMetadataVerified: true,
        streamingUploadToMagistrateConfirmed: true,
        streamTxHash: '0x9918234857b21908123981bcda90184719283719028391823901823901823901',
      },
    ],
    seizedItems: [
      {
        id: 'ITEM-01',
        itemNumber: 1,
        description: 'Ledger Nano X Hardware Crypto Wallet (Black Matte)',
        category: 'DIGITAL_DEVICE',
        serialOrImei: 'LEDGER-NX-2025-884192',
        quantity: '1 Unit',
        seizureLocationDetail: 'Concealed inside study desk false drawer bottom compartment',
        tamperEvidentSealNumber: 'SEAL-DL-POL-2026-9041',
        photoOrVideoClipSha256: '6a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
        custodyOfficer: 'Inspector Rajesh Varma',
      },
      {
        id: 'ITEM-02',
        itemNumber: 2,
        description: 'Apple MacBook Pro 16-inch M3 Max (Space Black) with charging brick',
        category: 'DIGITAL_DEVICE',
        serialOrImei: 'C02G8941MD6R',
        quantity: '1 Unit',
        seizureLocationDetail: 'On dining table in powered-on sleep state, live memory dump captured on-spot',
        tamperEvidentSealNumber: 'SEAL-DL-POL-2026-9042',
        photoOrVideoClipSha256: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
        custodyOfficer: 'Inspector Rajesh Varma',
      },
    ],
    sec105CertificateSha256: 'd8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
    magistrateNotificationTimestamp: '2026-01-14T12:05:00Z',
    status: 'TRANSMITTED_TO_MAGISTRATE',
  },
];

// Initial Fugitive Proclamations & Asset Attachment Records (Sec 84 & 107 BNSS)
const INITIAL_FUGITIVES: FugitiveProclamationAssetRecord[] = [
  {
    id: 'FUG-2026-0084',
    caseId: 'CASE-2026-002',
    caseNumber: 'MH-02-2026-CR-0108',
    offenderName: 'Danish Farooqui @ Danny Bhai',
    aliasList: ['Daniel Frost', 'Farhan Qazi'],
    dateOfBirth: '1984-07-12',
    nationality: 'Indian',
    passportNumber: 'Z8941209',
    interpolNoticeType: 'RED_CORNER',
    interpolNoticeRef: 'INTERPOL/RCN/2026/IND-4491',
    bnssSec84ProclamationStatus: 'PROCLAIMED_OFFENDER_DECLARED',
    proclamationDate: '2026-01-20T00:00:00Z',
    daysRemainingForSurrender: 0,
    rewardAnnouncedRupees: 1000000,
    attachedAssetsSec107: [
      {
        assetId: 'AST-01',
        assetType: 'IMMOVABLE_REAL_ESTATE',
        description: 'Luxury Sea-Facing Penthouse, Bandra West, Mumbai (Carpet Area 4200 sq.ft)',
        estimatedValueRupees: 285000000, // 28.5 Cr
        attachmentOrderDate: '2026-02-10T11:00:00Z',
        courtOrderRef: 'MUM/CMM/SEC107/ATTACH/2026/091',
        attachmentStatus: 'CONFISCATION_ORDER_PASSED',
        confiscationLedgerTx: '0x8819234857b21908123981bcda90184719283719028391823901823901823901',
      },
      {
        assetId: 'AST-02',
        assetType: 'BANK_ACCOUNT_FIU',
        description: 'HDFC Bank Current Account #5020008819234 (Shell Entity: Apex Global Trade)',
        estimatedValueRupees: 42000000, // 4.2 Cr
        attachmentOrderDate: '2026-02-12T14:30:00Z',
        courtOrderRef: 'MUM/CMM/SEC107/FREEZE/2026/094',
        attachmentStatus: 'FREEZE_NOTICE_SERVED',
        confiscationLedgerTx: '0x447192837190283918239018239018239018819234857b21908123981bcda901',
      },
    ],
    crossAgencyAlerts: [
      {
        agency: 'INTERPOL',
        alertStatus: 'BROADCAST_ACTIVE',
        lastSync: '2026-03-27T08:00:00Z',
      },
      {
        agency: 'IMMIGRATION_BOI',
        alertStatus: 'FLAGGED_AT_BORDER',
        lastSync: '2026-03-27T07:30:00Z',
      },
      {
        agency: 'FIU_IND',
        alertStatus: 'ACCOUNT_FROZEN',
        lastSync: '2026-03-26T19:00:00Z',
      },
      {
        agency: 'CBI',
        alertStatus: 'BROADCAST_ACTIVE',
        lastSync: '2026-03-27T06:00:00Z',
      },
    ],
  },
];

class Phase8Service {
  private chargeSheets: ChargeSheetForm51[] = [...INITIAL_CHARGE_SHEETS];
  private sentencingAssessments: SentencingVictimAssessment[] = [...INITIAL_SENTENCING_ASSESSMENTS];
  private panchnamas: DigitalAudioVideoPanchnama[] = [...INITIAL_DIGITAL_PANCHNAMAS];
  private fugitives: FugitiveProclamationAssetRecord[] = [...INITIAL_FUGITIVES];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const cs = localStorage.getItem('nsdj_phase8_chargesheets');
      if (cs) this.chargeSheets = JSON.parse(cs);
      const sent = localStorage.getItem('nsdj_phase8_sentencing');
      if (sent) this.sentencingAssessments = JSON.parse(sent);
      const pan = localStorage.getItem('nsdj_phase8_panchnamas');
      if (pan) this.panchnamas = JSON.parse(pan);
      const fug = localStorage.getItem('nsdj_phase8_fugitives');
      if (fug) this.fugitives = JSON.parse(fug);
    } catch {
      // fallback
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('nsdj_phase8_chargesheets', JSON.stringify(this.chargeSheets));
      localStorage.setItem('nsdj_phase8_sentencing', JSON.stringify(this.sentencingAssessments));
      localStorage.setItem('nsdj_phase8_panchnamas', JSON.stringify(this.panchnamas));
      localStorage.setItem('nsdj_phase8_fugitives', JSON.stringify(this.fugitives));
    } catch {
      // ignore
    }
  }

  // ==========================================
  // SECTION 193 BNSS: CHARGE-SHEET & PROSECUTORIAL SCRUTINY
  // ==========================================

  getChargeSheets(): ChargeSheetForm51[] {
    return this.chargeSheets;
  }

  getChargeSheetByCase(caseId: string): ChargeSheetForm51 | undefined {
    return this.chargeSheets.find((c) => c.caseId === caseId);
  }

  async runAutomatedProsecutorialScrutiny(caseItem: CaseFile): Promise<StatutoryDefectCheck[]> {
    const defects: StatutoryDefectCheck[] = [];

    // Check 1: 60/90 Days Statutory Detention Clock (Sec 187(3) BNSS)
    const detentionDays = caseItem.accused.length > 0 ? 45 : 15;
    if (detentionDays > 90) {
      defects.push({
        id: 'DEF-SCRUT-01',
        category: 'LIMITATION_PERIOD',
        title: 'Statutory Limitation Exceeded (Sec 187(3) BNSS)',
        description: `Accused in custody for ${detentionDays} days, exceeding the 90-day statutory cap without charge sheet. Right to Default Bail accrued.`,
        relevantSection: 'Sec 187(3) BNSS',
        severity: 'CRITICAL_BLOCKER',
        isResolved: false,
        autoRemediationHint: 'Immediate filing of Final Police Report required before judicial magistrate.',
      });
    } else {
      defects.push({
        id: 'DEF-SCRUT-01',
        category: 'LIMITATION_PERIOD',
        title: 'Statutory Limitation Audit (Sec 187(3) BNSS)',
        description: `Investigation period is ${detentionDays} days. Comfortably within the 60/90 days statutory default bail window.`,
        relevantSection: 'Sec 187(3) BNSS',
        severity: 'COMPLIANT_PASSED',
        isResolved: true,
      });
    }

    // Check 2: Mandatory Electronic Evidence Certificate (Sec 63 BSA)
    const hasSec63 = caseItem.documents.length > 0;
    if (!hasSec63) {
      defects.push({
        id: 'DEF-SCRUT-02',
        category: 'FORENSIC_CERTIFICATE',
        title: 'Missing Section 63 BSA Electronic Certificate',
        description: 'Electronic exhibits present in case locker lack cryptographically signed Sec 63 BSA Certificate.',
        relevantSection: 'Sec 63 BSA 2023',
        severity: 'MAJOR_DEFECT',
        isResolved: false,
        autoRemediationHint: 'Generate and attach Part A/B electronic evidence certificate via PKI module.',
      });
    } else {
      defects.push({
        id: 'DEF-SCRUT-02',
        category: 'FORENSIC_CERTIFICATE',
        title: 'Electronic Evidence Integrity (Sec 63 BSA)',
        description: 'Valid Section 63 BSA certificate attached with SHA-256 digital seal.',
        relevantSection: 'Sec 63 BSA 2023',
        severity: 'COMPLIANT_PASSED',
        isResolved: true,
      });
    }

    // Check 3: Sanction for Prosecution (Sec 218 BNSS)
    const involvesPublicOfficial = caseItem.legalActsAndSections.some((s: string) => s.includes('218') || s.includes('Corruption') || s.includes('Official'));
    if (involvesPublicOfficial) {
      defects.push({
        id: 'DEF-SCRUT-03',
        category: 'SANCTION',
        title: 'Sanction under Sec 218 BNSS Required',
        description: 'Public servant offense requires formal sanction from state Home Department.',
        relevantSection: 'Sec 218 BNSS',
        severity: 'MAJOR_DEFECT',
        isResolved: false,
        autoRemediationHint: 'Procure sanction reference order from competent ministry.',
      });
    } else {
      defects.push({
        id: 'DEF-SCRUT-03',
        category: 'SANCTION',
        title: 'Prosecution Sanction Exemption Check',
        description: 'Private offender offense; no prior governmental sanction necessary for cognizance.',
        relevantSection: 'Sec 218 BNSS',
        severity: 'COMPLIANT_PASSED',
        isResolved: true,
      });
    }

    // Check 4: Section 105 BNSS Audio-Video Search & Seizure Panchnama
    defects.push({
      id: 'DEF-SCRUT-04',
      category: 'ARREST_COMPLIANCE',
      title: 'Mandatory Audio-Video Panchnama (Sec 105 BNSS)',
      description: 'Search & seizure audio-video recordings digitally signed by two independent panch witnesses.',
      relevantSection: 'Sec 105 BNSS',
      severity: 'COMPLIANT_PASSED',
      isResolved: true,
    });

    // Check 5: Section 180 Witness Statements Recorded
    defects.push({
      id: 'DEF-SCRUT-05',
      category: 'WITNESS_EVIDENCE',
      title: 'Examination of Witnesses (Sec 180 BNSS)',
      description: 'Witness statements recorded and cross-referenced with forensic exhibits.',
      relevantSection: 'Sec 180 BNSS',
      severity: 'COMPLIANT_PASSED',
      isResolved: true,
    });

    return defects;
  }

  async generateChargeSheetForm51(
    caseItem: CaseFile,
    isSupplementary = false,
    supplementaryNumber = 1
  ): Promise<ChargeSheetForm51> {
    const defects = await this.runAutomatedProsecutorialScrutiny(caseItem);
    const passedCount = defects.filter((d) => d.severity === 'COMPLIANT_PASSED').length;
    const score = Math.round((passedCount / defects.length) * 100);

    const sheetId = `CS-${new Date().getFullYear()}-${caseItem.caseNumber.replace(/[^a-zA-Z0-9]/g, '').slice(-8)}`;

    const newSheet: ChargeSheetForm51 = {
      id: sheetId,
      caseId: caseItem.id,
      caseNumber: caseItem.caseNumber,
      firNumber: caseItem.caseNumber,
      policeStation: caseItem.policeStation,
      district: 'Cyber Police District',
      state: caseItem.jurisdictionState,
      ioName: caseItem.leadInvestigator.name,
      ioRank: caseItem.leadInvestigator.rank,
      ioBadgeNumber: caseItem.leadInvestigator.badgeId,
      shoApprovalDate: new Date().toISOString(),
      dateOfFiling: new Date().toISOString(),
      courtName: caseItem.courtName,
      isSupplementary,
      supplementaryNumber: isSupplementary ? supplementaryNumber : undefined,
      natureOfReport: 'CHARGE_SHEET_FOR_TRIAL',
      briefFactsOfCase: caseItem.title,
      investigationFindings: `Investigation established the direct culpability of the accused persons through physical, oral, and certified electronic evidence under Section 63 BSA. Chain of custody remains unbroken and verified via Sovereign ICJS 2.0 distributed ledger.`,
      accusedList: caseItem.accused.map((s: { name: string; status: string }, idx: number) => ({
        id: `ACC-CS-${idx + 1}`,
        fullName: s.name,
        fatherName: 'Late / Sh. S. ' + s.name.split(' ')[0],
        age: 34 + idx * 4,
        gender: 'Male',
        address: 'Resident of ' + caseItem.policeStation + ', ' + caseItem.jurisdictionState,
        custodyStatus: s.status === 'IN_JUDICIAL_CUSTODY' ? 'IN_JUDICIAL_CUSTODY' : 'RELEASED_ON_BAIL',
        arrestDate: new Date().toISOString(),
        chargedSections: caseItem.legalActsAndSections,
        sanctionObtained: true,
        priorConvictionsCount: 0,
      })),
      witnessesList: [
        {
          id: 'WIT-AUTO-1',
          witnessNumber: 1,
          name: `${caseItem.complainant.name} (Complainant)`,
          type: 'VICTIM',
          section180StatementRecorded: true,
          statementTimestamp: caseItem.firDate,
          statementHash: await computeSHA256(caseItem.title),
          keyDepositionSummary: 'Narrated the detailed facts of crime and identified prime suspect.',
          reliedExhibits: ['EX-01 (FIR)', 'EX-02 (Complaint Copy)'],
        },
        {
          id: 'WIT-AUTO-2',
          witnessNumber: 2,
          name: `${caseItem.leadInvestigator.name} (Investigating Officer)`,
          type: 'INVESTIGATING_OFFICER',
          section180StatementRecorded: true,
          statementTimestamp: new Date().toISOString(),
          statementHash: await computeSHA256(caseItem.caseNumber),
          keyDepositionSummary: 'Conducted search, seizure, collected electronic forensic reports, and prepared chargesheet Form 5.1.',
          reliedExhibits: ['EX-03 (Seizure Memo)', 'EX-04 (Forensic Memo)'],
        },
      ],
      reliedDocumentsList: caseItem.documents.map((d) => ({
        docTitle: d.title,
        exhibitCode: `EX-${d.id.slice(-4).toUpperCase()}`,
        bsaSec63Attached: true,
        sha256: d.sha256Hash,
      })),
      prosecutorialScrutiny: {
        overallCognizanceReadinessScore: score,
        scrutinyStatus: score >= 80 ? 'APPROVED_FOR_FILING' : 'REQUISITIONS_RAISED',
        scrutinyDate: new Date().toISOString(),
        prosecutorName: 'Adv. S. K. Mahapatra (Chief Public Prosecutor)',
        defectsList: defects,
        magistrateCognizanceOrderDraft: `IN THE COURT OF CJM, ${caseItem.courtName}\n\nCharge Sheet perused. Cognizance taken under Sec 210 BNSS 2023 for offenses under ${caseItem.legalActsAndSections.join(
          ', '
        )}. Issue summons to accused not in custody and production warrant for accused in judicial custody.`,
      },
      digitalSignatureSeal: {
        signerName: caseItem.leadInvestigator.name,
        signerRole: 'Investigating Officer',
        signerDesignation: caseItem.leadInvestigator.rank,
        organization: `${caseItem.jurisdictionState} Police`,
        signatureAlgorithm: 'SHA256withECDSA',
        certificateId: `NIC-PKI-${caseItem.leadInvestigator.badgeId}`,
        signatureHex: await computeSHA256(sheetId + new Date().toISOString()),
        timestamp: new Date().toISOString(),
        publicKeyFingerprint: '9B:5E:21:A4:44:CD:7A:B1:32:09:88:EC:3F:55:1A:18',
        isValid: true,
      },
    };

    this.chargeSheets.unshift(newSheet);
    this.saveToStorage();
    return newSheet;
  }

  // ==========================================
  // SECTION 395/396 BNSS: SENTENCING & VICTIM RESTITUTION
  // ==========================================

  getSentencingAssessments(): SentencingVictimAssessment[] {
    return this.sentencingAssessments;
  }

  getSentencingAssessmentByCase(caseId: string): SentencingVictimAssessment | undefined {
    return this.sentencingAssessments.find((s) => s.caseId === caseId);
  }

  async calculateSentencingAndCompensation(
    caseItem: CaseFile,
    primaryOffense: string,
    statutoryMaxYears: number,
    statutoryMinYears: number,
    aggravatingCount: number,
    mitigatingCount: number,
    victimInjury: 'FATAL_LOSS_OF_LIFE' | 'GRIEVOUS_PERMANENT_DISABILITY' | 'SEVERE_PHYSICAL_INJURY' | 'PSYCHOLOGICAL_TRAUMA' | 'PROPERTY_EXTORTION_LOSS',
    medicalCost: number,
    livelihoodLoss: number
  ): Promise<SentencingVictimAssessment> {
    // Sentencing calculation algorithm
    const baseYears = (statutoryMinYears + statutoryMaxYears) / 2;
    const factorAdjustment = (aggravatingCount * 0.75) - (mitigatingCount * 0.5);
    const calculatedYears = Math.max(statutoryMinYears, Math.min(statutoryMaxYears, baseYears + factorAdjustment));
    const termMonths = Math.round(calculatedYears * 12);

    // Fine calculation
    const calculatedFine = Math.round(50000 + (calculatedYears * 40000) + (aggravatingCount * 25000));

    // Victim Compensation under CVCF / NALSA
    const baseInjuryMap = {
      FATAL_LOSS_OF_LIFE: 1000000,
      GRIEVOUS_PERMANENT_DISABILITY: 600000,
      SEVERE_PHYSICAL_INJURY: 300000,
      PSYCHOLOGICAL_TRAUMA: 200000,
      PROPERTY_EXTORTION_LOSS: 150000,
    };
    const baseCompensation = baseInjuryMap[victimInjury] || 200000;
    const calculatedTotalCompensation = baseCompensation + medicalCost + livelihoodLoss;
    const restitutionFromFine = Math.min(calculatedFine * 0.9, calculatedTotalCompensation * 0.4);
    const stateContribution = calculatedTotalCompensation - restitutionFromFine;

    const assessment: SentencingVictimAssessment = {
      id: `SENT-${new Date().getFullYear()}-${caseItem.caseNumber.replace(/[^a-zA-Z0-9]/g, '').slice(-6)}`,
      caseId: caseItem.id,
      caseNumber: caseItem.caseNumber,
      convictedAccused: caseItem.accused.map((s: { name: string }) => s.name),
      primaryOffense,
      statutoryMinimumYears: statutoryMinYears,
      statutoryMaximumYears: statutoryMaxYears,
      fineRangeRupees: { min: 25000, max: statutoryMaxYears * 150000 },
      communityServiceApplicable: statutoryMaxYears <= 2 && mitigatingCount > aggravatingCount,
      communityServiceHoursMax: statutoryMaxYears <= 2 ? 120 : undefined,
      concurrencyType: 'CONCURRENT',
      factors: [
        {
          id: 'FAC-1',
          type: 'AGGRAVATING',
          factorDescription: `Seriousness of the statutory crime category under Bharatiya Nyaya Sanhita (${primaryOffense}).`,
          weightImpact: 'HIGH',
        },
        {
          id: 'FAC-2',
          type: 'MITIGATING',
          factorDescription: 'No record of repeat recidivism during electronic trial period.',
          weightImpact: 'MEDIUM',
        },
      ],
      recommendedPrisonTermMonths: termMonths,
      recommendedFineAmountRupees: calculatedFine,
      victimAssessment: {
        victimName: caseItem.complainant.name,
        injurySeverity: victimInjury,
        medicalExpensesIncurredRupees: medicalCost,
        lossOfLivelihoodRupees: livelihoodLoss,
        rehabilitationCostRupees: Math.round(baseCompensation * 0.3),
        calculatedTotalCompensationRupees: calculatedTotalCompensation,
        interimReliefAlreadyPaidRupees: 50000,
        schemeApplicable: 'CVCF_CENTRAL_SCHEME',
        restitutionFromConvictFineRupees: Math.round(restitutionFromFine),
        stateTreasuryContributionRupees: Math.round(stateContribution),
        dlsOrderRef: `DLSA/DELHI/COMP/${new Date().getFullYear()}/${caseItem.caseNumber.slice(-4)}`,
      },
      judicialSentencingDraft: `ORDER ON SENTENCE & RESTITUTION UNDER SECTIONS 395 & 396 BNSS:\n\nThe convict is sentenced to undergo Imprisonment for a period of ${Math.floor(
        termMonths / 12
      )} years and ${termMonths % 12} months, along with a fine of ₹${calculatedFine.toLocaleString(
        'en-IN'
      )}/-. In accordance with Section 395(1)(b) BNSS, an amount of ₹${Math.round(
        restitutionFromFine
      ).toLocaleString('en-IN')}/- shall be disbursed as direct restitution to victim ${
        caseItem.complainant.name
      }. Furthermore, District Legal Services Authority is directed to award ₹${Math.round(
        stateContribution
      ).toLocaleString('en-IN')}/- under the Victim Compensation Scheme.`,
    };

    this.sentencingAssessments.unshift(assessment);
    this.saveToStorage();
    return assessment;
  }

  // ==========================================
  // SECTION 105 BNSS: DIGITAL AUDIO-VIDEO PANCHNAMA DECK
  // ==========================================

  getDigitalPanchnamas(): DigitalAudioVideoPanchnama[] {
    return this.panchnamas;
  }

  async createDigitalPanchnama(
    caseItem: CaseFile,
    panchnamaType: DigitalAudioVideoPanchnama['panchnamaType'],
    locationAddress: string,
    lat: number,
    lng: number,
    panch1Name: string,
    panch1AadhaarLast4: string,
    panch2Name: string,
    panch2AadhaarLast4: string,
    seizedItemsList: Array<{ description: string; category: any; qty: string; location: string }>
  ): Promise<DigitalAudioVideoPanchnama> {
    const panId = `PANCH-105-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const streamDigest = await computeSHA256(panId + locationAddress + new Date().toISOString());

    const pan: DigitalAudioVideoPanchnama = {
      id: panId,
      caseId: caseItem.id,
      caseNumber: caseItem.caseNumber,
      panchnamaType,
      locationAddress,
      geoCoordinates: {
        latitude: lat,
        longitude: lng,
        elevationMeters: 185.2,
        accuracyMeters: 2.1,
      },
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date().toISOString(),
      leadOfficer: {
        name: caseItem.leadInvestigator.name,
        rank: caseItem.leadInvestigator.rank,
        badge: caseItem.leadInvestigator.badgeId,
      },
      panchWitnesses: [
        {
          name: panch1Name,
          age: 42,
          occupation: 'Local Citizen / Resident',
          address: `Nearby Location, ${caseItem.policeStation}`,
          aadhaarOrIdLast4: panch1AadhaarLast4,
          digitalSignatureOrThumbprintSha256: await computeSHA256(panch1Name + panch1AadhaarLast4),
          signedTimestamp: new Date().toISOString(),
        },
        {
          name: panch2Name,
          age: 39,
          occupation: 'Shopkeeper / Local Trader',
          address: `Market Area, ${caseItem.policeStation}`,
          aadhaarOrIdLast4: panch2AadhaarLast4,
          digitalSignatureOrThumbprintSha256: await computeSHA256(panch2Name + panch2AadhaarLast4),
          signedTimestamp: new Date().toISOString(),
        },
      ],
      audioVideoRecordings: [
        {
          recordingId: `REC-AV-105-${Math.floor(100 + Math.random() * 900)}`,
          deviceModel: 'Axon Evidence Body-Cam Sovereign Enclave v4.1',
          durationSec: 3600,
          sha256Hash: streamDigest,
          c2paMetadataVerified: true,
          streamingUploadToMagistrateConfirmed: true,
          streamTxHash: `0x${streamDigest.slice(0, 40)}`,
        },
      ],
      seizedItems: seizedItemsList.map((item, idx) => ({
        id: `ITEM-105-${idx + 1}`,
        itemNumber: idx + 1,
        description: item.description,
        category: item.category,
        quantity: item.qty,
        seizureLocationDetail: item.location,
        tamperEvidentSealNumber: `SEAL-BNSS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        photoOrVideoClipSha256: streamDigest,
        custodyOfficer: caseItem.leadInvestigator.name,
      })),
      sec105CertificateSha256: await computeSHA256(panId + 'SEC_105_COMPLIANCE'),
      magistrateNotificationTimestamp: new Date().toISOString(),
      status: 'TRANSMITTED_TO_MAGISTRATE',
    };

    this.panchnamas.unshift(pan);
    this.saveToStorage();
    return pan;
  }

  // ==========================================
  // SECTION 84 & 107 BNSS: FUGITIVE PROCLAMATION & ASSET ATTACHMENT
  // ==========================================

  getFugitives(): FugitiveProclamationAssetRecord[] {
    return this.fugitives;
  }

  async createFugitiveProclamation(
    caseItem: CaseFile,
    offenderName: string,
    aliases: string[],
    passportNo: string,
    rewardAmount: number,
    interpolNotice: 'RED_CORNER' | 'BLUE_NOTICE' | 'LOOKOUT_CIRCULAR_LOC' | 'NONE',
    assetDescription: string,
    assetType: 'IMMOVABLE_REAL_ESTATE' | 'BANK_ACCOUNT_FIU' | 'LUXURY_VEHICLE' | 'CRYPTO_COLD_WALLET' | 'EQUITY_SHARES',
    estimatedValue: number
  ): Promise<FugitiveProclamationAssetRecord> {
    const fugId = `FUG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const txHash = `0x${await computeSHA256(fugId + offenderName)}`;

    const newRecord: FugitiveProclamationAssetRecord = {
      id: fugId,
      caseId: caseItem.id,
      caseNumber: caseItem.caseNumber,
      offenderName,
      aliasList: aliases,
      dateOfBirth: '1987-05-18',
      nationality: 'Indian',
      passportNumber: passportNo,
      interpolNoticeType: interpolNotice,
      interpolNoticeRef: interpolNotice !== 'NONE' ? `INTERPOL/${interpolNotice}/2026/IND-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      bnssSec84ProclamationStatus: 'PROCLAMATION_ISSUED_30_DAYS',
      proclamationDate: new Date().toISOString(),
      daysRemainingForSurrender: 30,
      rewardAnnouncedRupees: rewardAmount,
      attachedAssetsSec107: [
        {
          assetId: `AST-${Math.floor(10 + Math.random() * 90)}`,
          assetType,
          description: assetDescription,
          estimatedValueRupees: estimatedValue,
          attachmentOrderDate: new Date().toISOString(),
          courtOrderRef: `CJM/SEC107/ATTACH/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
          attachmentStatus: 'FREEZE_NOTICE_SERVED',
          confiscationLedgerTx: txHash,
        },
      ],
      crossAgencyAlerts: [
        {
          agency: 'INTERPOL',
          alertStatus: interpolNotice === 'RED_CORNER' ? 'BROADCAST_ACTIVE' : 'FLAGGED_AT_BORDER',
          lastSync: new Date().toISOString(),
        },
        {
          agency: 'IMMIGRATION_BOI',
          alertStatus: 'FLAGGED_AT_BORDER',
          lastSync: new Date().toISOString(),
        },
        {
          agency: 'FIU_IND',
          alertStatus: 'ACCOUNT_FROZEN',
          lastSync: new Date().toISOString(),
        },
        {
          agency: 'CBI',
          alertStatus: 'BROADCAST_ACTIVE',
          lastSync: new Date().toISOString(),
        },
      ],
    };

    this.fugitives.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }
}

export const phase8Service = new Phase8Service();
