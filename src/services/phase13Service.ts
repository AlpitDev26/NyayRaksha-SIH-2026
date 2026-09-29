import {
  EPrisonsCorrectionalRecord,
  NationalBiometricDNARecord,
  FIUFinancialIntelligenceRecord,
  ConstitutionalCollegiumRecord,
} from '../types';
import { computeSHA256 } from './cryptoEngine';

// Initial ePrisons & Correctional Records
const INITIAL_EPRISONS_RECORDS: EPrisonsCorrectionalRecord[] = [
  {
    inmateId: 'INM-TIHAR-2026-081',
    undertrialNumber: 'UT-2026/89412',
    prisonFacility: 'Central Jail No. 1, Tihar, New Delhi',
    inmateName: 'Vipin K. Saxena',
    age: 34,
    caseNumberRef: 'DL-01-2026-CR-0041',
    bookedSectionsBNS: ['Sec 303(2) BNS (Theft)', 'Sec 318(2) BNS (Cheating)'],
    isFirstTimeOffender: true,
    custodyType: 'JUDICIAL_CUSTODY',
    dateOfAdmission: '2025-09-10T10:00:00Z',
    totalDaysIncarcerated: 141,
    maxSentenceApplicableDays: 1095, // 3 Years
    sec479BNSSThresholdDays: 365, // 1/3rd = 365 days
    sec479BailEligible: false,
    sec53MedicalFitnessStatus: 'FIT',
    paroleOrFurloughEligibility: {
      eligible: true,
      conductScore: 92,
      lastParoleDate: '2025-11-20T00:00:00Z',
    },
    vcCourtProductionStatus: 'PRODUCED_TODAY',
    biometricCustodySlipSha256: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    superintendentDigitalSeal: 'DIGISEAL-TIHAR-SUPT-RAJESH-YADAV-2026',
  },
  {
    inmateId: 'INM-ARTHUR-2026-104',
    undertrialNumber: 'UT-2026/44109',
    prisonFacility: 'Arthur Road Central Prison, Mumbai',
    inmateName: 'Suresh R. Gaikwad',
    age: 48,
    caseNumberRef: 'MH-02-2026-CR-0089',
    bookedSectionsBNS: ['Sec 318(4) BNS (Aggravated Cheating)', 'Sec 336(3) BNS (Forgery)'],
    isFirstTimeOffender: false,
    custodyType: 'JUDICIAL_CUSTODY',
    dateOfAdmission: '2024-12-01T12:00:00Z',
    totalDaysIncarcerated: 424,
    maxSentenceApplicableDays: 2555, // 7 Years
    sec479BNSSThresholdDays: 1277, // 1/2 for recidivists
    sec479BailEligible: false,
    sec53MedicalFitnessStatus: 'CHRONIC_UNDER_TREATMENT',
    paroleOrFurloughEligibility: {
      eligible: false,
      conductScore: 68,
    },
    vcCourtProductionStatus: 'SCHEDULED_TOMORROW',
    biometricCustodySlipSha256: '9f8e7d6c5b4a3210fedcba0987654321fedcba0987654321fedcba0987654321',
    superintendentDigitalSeal: 'DIGISEAL-ARTHUR-SUPT-SUNIL-MANE-2026',
  },
];

// Initial National Biometric DNA & NAFIS Records (CPID Act 2022)
const INITIAL_BIOMETRIC_DNA_RECORDS: NationalBiometricDNARecord[] = [
  {
    cpidReferenceId: 'CPID-2026-NAFIS-99120',
    caseNumberRef: 'DL-01-2026-CR-0041',
    subjectNameMasked: 'V*** K*** S***',
    category: 'ACCUSED_UNDER_TRIAL',
    nafisFingerprintRecord: {
      tenPrintCardUploaded: true,
      nistMatchQualityScore: 99.2,
      nafisNationalId: 'NAFIS-IND-DEL-2026-8841',
    },
    dnaCodisProfile: {
      strLociCount: 24,
      sampleType: 'BUCCAL_SWAB',
      nfsuAccreditationRef: 'NFSU-GUJ-ISO17025-2026-DNA-991',
      alleleMatrix: [
        { locus: 'D3S1358', allele1: '15', allele2: '17' },
        { locus: 'vWA', allele1: '16', allele2: '18' },
        { locus: 'FGA', allele1: '21', allele2: '24' },
        { locus: 'D8S1179', allele1: '12', allele2: '13' },
        { locus: 'D21S11', allele1: '29', allele2: '31.2' },
        { locus: 'D18S51', allele1: '14', allele2: '16' },
        { locus: 'D5S818', allele1: '11', allele2: '12' },
        { locus: 'D13S317', allele1: '8', allele2: '11' },
        { locus: 'D7S820', allele1: '9', allele2: '10' },
        { locus: 'TH01', allele1: '7', allele2: '9.3' },
        { locus: 'TPOX', allele1: '8', allele2: '11' },
        { locus: 'CSF1PO', allele1: '10', allele2: '12' },
      ],
    },
    irisBiometricTemplateSha256: '44556677889900aabbccddeeff00112233445566778899aabbccddeeff001122',
    collectionOfficerName: 'SI Deepak Verma (Forensic Evidence Officer, Delhi Police)',
    dateOfBiometricCollection: '2026-01-15T14:30:00Z',
    expungementStatus: 'ACTIVE_PROFILE',
    statutoryProtectionSha256: 'a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890',
  },
];

// Initial FIU-IND & AML Intelligence Records
const INITIAL_FIU_RECORDS: FIUFinancialIntelligenceRecord[] = [
  {
    alertId: 'FIU-FINNET-2026-STR-9941',
    syndicateOrEntityName: 'M/s Golden Crest Global Agro & Offshore FinCorp Syndicate',
    investigatingAgency: 'ENFORCEMENT_DIRECTORATE_ED',
    pmlaPredicateSections: ['Sec 3 & 4 PMLA 2002', 'Sec 111(2) BNS (Organized Hawala Syndicate)', 'Sec 318(4) BNS'],
    totalLaunderingVolumeRupees: 185000000, // ₹18.5 Crores
    attachmentStatus: 'CONFIRMATION_BY_ADJUDICATING_AUTHORITY',
    hawalaNodesTracked: [
      {
        nodeLocation: 'Chandni Chowk / Old Delhi Hawala Junction',
        operatorAlias: '"Chacha Dubai"',
        estimatedFlowRupees: 65000000,
      },
      {
        nodeLocation: 'Dubai Marina Financial Freezone Node',
        operatorAlias: '"Al-Miraj Trading FZE"',
        estimatedFlowRupees: 120000000,
      },
    ],
    cryptoMixerEntities: [
      {
        blockchain: 'TRON_TRC20',
        mixerContractOrAddress: 'TXYZ991823471029381029381029381029',
        launderedAmountCrypto: '1,450,000 USDT',
        fiatEquivalentRupees: 127600000,
      },
    ],
    benamiPropertiesAttached: [
      {
        propertyDescription: 'Luxury Commercial Penthouse (12,000 sq ft)',
        location: 'Golf Course Road, Sector 54, Gurugram',
        marketValueRupees: 85000000,
      },
      {
        propertyDescription: 'Industrial Agricultural Warehouse (4.5 Acres)',
        location: 'Alwar Bypass, Bhiwadi, Rajasthan',
        marketValueRupees: 35000000,
      },
    ],
    specialJudgeOrderSha256: '9f81a203b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
    issuedTimestamp: '2026-01-26T16:00:00Z',
  },
];

// Initial Constitutional Collegium Records (Article 124 / 217)
const INITIAL_COLLEGIUM_RECORDS: ConstitutionalCollegiumRecord[] = [
  {
    resolutionId: 'SC-COLLEGIUM-RES-2026-004',
    collegiumType: 'SUPREME_COURT_COLLEGIUM',
    resolutionTitle: 'Elevation of Senior High Court Judges to the Supreme Court of India',
    recommendationType: 'ELEVATION_TO_BENCH',
    judicialCandidateOrJudgeName: 'Hon. Justice Arvind Kumar Sen (Chief Justice, High Court of Bombay)',
    currentDesignationOrBarStatus: 'Chief Justice, High Court of Bombay (Seniority Rank #2 Pan-India)',
    proposedDesignation: 'Judge, Supreme Court of India',
    integrityIndexScore: 99.4,
    caseDisposalEfficiencyScore: 96.8,
    conflictOfInterestFlag: 'NONE_CLEARED',
    signatoryJudges: [
      {
        judgeName: 'Hon. Chief Justice of India',
        designation: 'Chief Justice of India & Chairman Collegium',
        signedTimestamp: '2026-01-27T10:00:00Z',
      },
      {
        judgeName: 'Hon. Justice Senior Puisne Judge I',
        designation: 'Judge, Supreme Court of India',
        signedTimestamp: '2026-01-27T10:05:00Z',
      },
      {
        judgeName: 'Hon. Justice Senior Puisne Judge II',
        designation: 'Judge, Supreme Court of India',
        signedTimestamp: '2026-01-27T10:08:00Z',
      },
    ],
    shamirQuorumAchieved: true,
    resolutionText:
      'The Supreme Court Collegium in its meeting resolved to recommend the appointment of Sh. Justice Arvind Kumar Sen as Judge of the Supreme Court of India, taking into consideration his unimpeachable integrity, high constitutional scholarship, and exceptional judgment disposal rate over 14 years on the Bench.',
    immutableCollegiumSealSha256: '556677889900aabbccddeeff0011223344556677889900aabbccddeeff001122',
  },
];

class Phase13Service {
  private eprisonsRecords: EPrisonsCorrectionalRecord[] = [...INITIAL_EPRISONS_RECORDS];
  private biometricDnaRecords: NationalBiometricDNARecord[] = [...INITIAL_BIOMETRIC_DNA_RECORDS];
  private fiuRecords: FIUFinancialIntelligenceRecord[] = [...INITIAL_FIU_RECORDS];
  private collegiumRecords: ConstitutionalCollegiumRecord[] = [...INITIAL_COLLEGIUM_RECORDS];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedEP = localStorage.getItem('nsdj_phase13_eprisons');
      if (savedEP) this.eprisonsRecords = JSON.parse(savedEP);

      const savedDNA = localStorage.getItem('nsdj_phase13_dna');
      if (savedDNA) this.biometricDnaRecords = JSON.parse(savedDNA);

      const savedFIU = localStorage.getItem('nsdj_phase13_fiu');
      if (savedFIU) this.fiuRecords = JSON.parse(savedFIU);

      const savedCol = localStorage.getItem('nsdj_phase13_collegium');
      if (savedCol) this.collegiumRecords = JSON.parse(savedCol);
    } catch {
      // Fallback to initial defaults
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('nsdj_phase13_eprisons', JSON.stringify(this.eprisonsRecords));
      localStorage.setItem('nsdj_phase13_dna', JSON.stringify(this.biometricDnaRecords));
      localStorage.setItem('nsdj_phase13_fiu', JSON.stringify(this.fiuRecords));
      localStorage.setItem('nsdj_phase13_collegium', JSON.stringify(this.collegiumRecords));
    } catch {
      // Storage ignore
    }
  }

  // --- ePrisons ---
  getEPrisonsRecords(): EPrisonsCorrectionalRecord[] {
    return [...this.eprisonsRecords];
  }

  async createEPrisonsRecord(
    data: Omit<EPrisonsCorrectionalRecord, 'inmateId' | 'biometricCustodySlipSha256'>
  ): Promise<EPrisonsCorrectionalRecord> {
    const rawData = `${data.undertrialNumber}|${data.inmateName}|${data.prisonFacility}|${Date.now()}`;
    const hash = await computeSHA256(rawData);

    const newRecord: EPrisonsCorrectionalRecord = {
      ...data,
      inmateId: `INM-PRISON-2026-${Date.now().toString().slice(-4)}`,
      biometricCustodySlipSha256: hash,
    };

    this.eprisonsRecords.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }

  grantParoleApproval(inmateId: string, daysGranted: number) {
    const inmate = this.eprisonsRecords.find((i) => i.inmateId === inmateId);
    if (inmate) {
      inmate.paroleOrFurloughEligibility.lastParoleDate = new Date().toISOString();
      inmate.custodyType = 'INTERIM_BAIL_OUT';
      this.saveToStorage();
    }
  }

  // --- DNA & Biometrics ---
  getBiometricDNARecords(): NationalBiometricDNARecord[] {
    return [...this.biometricDnaRecords];
  }

  async createBiometricDNARecord(
    data: Omit<NationalBiometricDNARecord, 'cpidReferenceId' | 'statutoryProtectionSha256'>
  ): Promise<NationalBiometricDNARecord> {
    const raw = `${data.caseNumberRef}|${data.subjectNameMasked}|${Date.now()}`;
    const hash = await computeSHA256(raw);

    const newRecord: NationalBiometricDNARecord = {
      ...data,
      cpidReferenceId: `CPID-2026-NAFIS-${Math.floor(10000 + Math.random() * 90000)}`,
      statutoryProtectionSha256: hash,
    };

    this.biometricDnaRecords.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }

  // --- FIU AML ---
  getFIURecords(): FIUFinancialIntelligenceRecord[] {
    return [...this.fiuRecords];
  }

  async createFIURecord(
    data: Omit<FIUFinancialIntelligenceRecord, 'alertId' | 'specialJudgeOrderSha256' | 'issuedTimestamp'>
  ): Promise<FIUFinancialIntelligenceRecord> {
    const issuedTimestamp = new Date().toISOString();
    const raw = `${data.syndicateOrEntityName}|${data.totalLaunderingVolumeRupees}|${issuedTimestamp}`;
    const hash = await computeSHA256(raw);

    const newRecord: FIUFinancialIntelligenceRecord = {
      ...data,
      alertId: `FIU-FINNET-2026-STR-${Math.floor(1000 + Math.random() * 9000)}`,
      specialJudgeOrderSha256: hash,
      issuedTimestamp,
    };

    this.fiuRecords.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }

  // --- Constitutional Collegium ---
  getCollegiumRecords(): ConstitutionalCollegiumRecord[] {
    return [...this.collegiumRecords];
  }

  async createCollegiumResolution(
    data: Omit<ConstitutionalCollegiumRecord, 'resolutionId' | 'immutableCollegiumSealSha256'>
  ): Promise<ConstitutionalCollegiumRecord> {
    const raw = `${data.collegiumType}|${data.judicialCandidateOrJudgeName}|${Date.now()}`;
    const hash = await computeSHA256(raw);

    const newRecord: ConstitutionalCollegiumRecord = {
      ...data,
      resolutionId: `SC-COLLEGIUM-RES-2026-${Date.now().toString().slice(-3)}`,
      immutableCollegiumSealSha256: hash,
    };

    this.collegiumRecords.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }
}

export const phase13Service = new Phase13Service();
