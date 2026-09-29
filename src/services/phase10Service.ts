import {
  PleaBargainingDisposition,
  SmartEvidenceLockerCompartment,
  LegalPrecedentCitation,
  NationalJudicialKPIMetrics,
  CaseFile,
} from '../types';
import { computeSHA256 } from './cryptoEngine';

// Initial Plea Bargaining Dispositions (Chapter XXII BNSS)
const INITIAL_PLEA_DISPOSITIONS: PleaBargainingDisposition[] = [
  {
    id: 'PB-DISP-2026-0041',
    caseId: 'CASE-2026-001',
    caseNumber: 'DL-01-2026-CR-0041',
    applicantAccusedName: 'Sameer Qureshi (Accused #2)',
    chargedSections: ['BNS Sec 318(4) - Cheating', 'IT Act Sec 66D'],
    isStatutorilyEligibleSec290: true,
    statutoryMaxPenaltyYears: 7,
    statutoryMinPenaltyYears: 1,
    voluntaryAffidavitFiled: true,
    victimName: 'National FinTech Infrastructure Consortium (Rep. by A. Sengupta)',
    prosecutorName: 'Adv. S. K. Mahapatra (Chief Public Prosecutor)',
    judicialMagistrateName: 'Hon. CJM, Tis Hazari Courts, Delhi',
    msdNegotiationStatus: 'MUTUALLY_SATISFACTORY_DISPOSITION_ACHIEVED',
    victimCompensationAgreedRupees: 850000,
    prosecutionCostsRupees: 50000,
    mitigatedSentenceMonths: 6, // 1/4th of minimum under Sec 295(1)(c) BNSS
    communityServiceAssigned: '120 Hours Community Service at Delhi State Legal Services Authority Helpdesk',
    msdReportRef: 'MSD-REP-CJM-2026-041',
    finalJudgmentDraftSec296:
      'JUDGMENT UNDER SECTION 296 BNSS (PLEA BARGAINING):\n\nPursuant to Mutually Satisfactory Disposition under Section 293 BNSS, convict Sameer Qureshi having voluntarily paid INR 8,50,000/- to the victim entity and INR 50,000/- prosecution costs, is sentenced to undergo Imprisonment for 6 months and 120 hours community service. In terms of Section 298 BNSS, this judgment is final and non-appealable.',
    judicialSealSha256: '9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a',
    isNonAppealableCertifiedSec298: true,
  },
];

// Initial Smart Evidence Locker Grid (NFC/RFID & Telemetry)
const INITIAL_SMART_LOCKERS: SmartEvidenceLockerCompartment[] = [
  {
    compartmentId: 'VAULT-DEL-B1-CMP-401',
    lockerHubName: 'Central Malkhana Secure Enclave, Tis Hazari Courts',
    hardwareStatus: 'SECURED_LOCKED',
    nfcRfidTagId: 'NFC-RFID-9941-CRYPT',
    storedEvidenceCode: 'EVD-2026-DL-8821',
    storedEvidenceTitle: 'Ledger Nano X Hardware Crypto Wallet & Recovery Keys',
    temperatureTelemetryCelsius: 18.2,
    targetTempCategory: 'AMBIENT_18C',
    humidityPercentage: 42.5,
    activeCustodianOfficer: 'Head Constable Devendra Singh (Malkhana Moharrir)',
    lastAccessTimestamp: '2026-03-26T14:15:00Z',
    accessLogEventsCount: 8,
    biometricAuditMatched: true,
    hardwareDoorSensorIntegrity: 'NORMAL_CLOSED',
  },
  {
    compartmentId: 'VAULT-DEL-B2-BIO-108',
    lockerHubName: 'CFSL / NFSU Cryogenic Bio-Vault Unit',
    hardwareStatus: 'SECURED_LOCKED',
    nfcRfidTagId: 'NFC-RFID-DNA-0881',
    storedEvidenceCode: 'SMPL-DNA-02',
    storedEvidenceTitle: 'Touch DNA Cotton Swab Specimen (24-Loci GlobalFiler)',
    temperatureTelemetryCelsius: -20.4,
    targetTempCategory: 'CRYOGENIC_MINUS_20C',
    humidityPercentage: 12.0,
    activeCustodianOfficer: 'Dr. Ananya Ray (Senior DNA Analyst)',
    lastAccessTimestamp: '2026-03-27T09:30:00Z',
    accessLogEventsCount: 14,
    biometricAuditMatched: true,
    hardwareDoorSensorIntegrity: 'NORMAL_CLOSED',
  },
  {
    compartmentId: 'VAULT-DEL-B3-FIRE-002',
    lockerHubName: 'Ballistics Armory & Explosives Safe Vault',
    hardwareStatus: 'SECURED_LOCKED',
    nfcRfidTagId: 'NFC-RFID-BAL-3319',
    storedEvidenceCode: 'SMPL-BAL-03',
    storedEvidenceTitle: 'Seized 7.65mm Pistol & Fired Cartridge Case',
    temperatureTelemetryCelsius: 21.0,
    targetTempCategory: 'FIREPROOF_ENCLAVE',
    humidityPercentage: 38.0,
    activeCustodianOfficer: 'Inspector Harish Rawat (Armory Custodian)',
    lastAccessTimestamp: '2026-03-25T11:00:00Z',
    accessLogEventsCount: 5,
    biometricAuditMatched: true,
    hardwareDoorSensorIntegrity: 'NORMAL_CLOSED',
  },
];

// Initial Landmark Legal Precedents Graph (BNS, BNSS, BSA)
const INITIAL_PRECEDENTS: LegalPrecedentCitation[] = [
  {
    id: 'PREC-2025-SC-842',
    bench: 'SUPREME_COURT_CONSTITUTION_BENCH',
    courtName: 'Supreme Court of India',
    caseTitle: 'State of Maharashtra v. Digambar & Anr.',
    neutralCitation: '2025 INSC 842',
    decisionDate: '2025-08-14',
    interpretedActsAndSections: ['Sec 63 BSA 2023', 'Sec 530 BNSS 2023'],
    ratioDecidendi:
      'The certificate under Section 63 of Bharatiya Sakshya Adhiniyam, 2023 is mandatory for the admissibility of secondary electronic records. Production of an automated PKI hash certificate generated at source satisfies the statutory requirement without requiring oral testimony of the server custodian.',
    obiterDicta:
      'Digital trial arena under Section 530 BNSS is a substantive mode of proceeding and virtual recording of witness oath through biometric video-conferencing possesses parity with physical courtroom deposition.',
    precedentStatus: 'BINDING_AUTHORITY',
    applicabilityRelevanceScore: 98,
    keyQuotableExcerpt:
      '"In the era of immutable cryptographic provenance, Section 63 BSA must be construed to uphold electronic justice without procedural impediments."',
  },
  {
    id: 'PREC-2025-DEL-419',
    bench: 'HIGH_COURT_DIVISION_BENCH',
    courtName: 'High Court of Delhi',
    caseTitle: 'Rajiv Mehra v. National Capital Territory of Delhi',
    neutralCitation: '2025 DHC 419',
    decisionDate: '2025-11-20',
    interpretedActsAndSections: ['Sec 479 BNSS 2023', 'Sec 187(3) BNSS 2023'],
    ratioDecidendi:
      'First-time undertrial prisoners are entitled to statutory liberty upon completing one-third of the maximum sentence under Section 479(1) BNSS. The jail superintendent is under an affirmative statutory obligation to submit an electronic bail application to the court.',
    precedentStatus: 'BINDING_AUTHORITY',
    applicabilityRelevanceScore: 95,
    keyQuotableExcerpt:
      '"Section 479 BNSS is a transformative statutory guarantee designed to prevent indefinite undertrial detention."',
  },
  {
    id: 'PREC-2026-SC-112',
    bench: 'SUPREME_COURT_APPELLATE',
    courtName: 'Supreme Court of India',
    caseTitle: 'Anand Swaroop v. Union of India',
    neutralCitation: '2026 INSC 112',
    decisionDate: '2026-02-18',
    interpretedActsAndSections: ['Sec 105 BNSS 2023', 'Sec 193 BNSS 2023'],
    ratioDecidendi:
      'Search and seizure non-compliant with the mandatory audio-video electronic recording prescribed under Section 105 BNSS requires strict judicial scrutiny, and deliberate failure to record invalidates seizure presumption.',
    precedentStatus: 'BINDING_AUTHORITY',
    applicabilityRelevanceScore: 94,
    keyQuotableExcerpt:
      '"Section 105 BNSS transforms the seizure panchnama from a vulnerable paper narrative into an unimpeachable digital ledger."',
  },
];

// Initial National Judicial KPI Benchmarking
const INITIAL_JUDICIAL_KPIS: NationalJudicialKPIMetrics = {
  timestamp: new Date().toISOString(),
  nationalCaseClearanceRatePct: 106.4,
  totalActiveDocketCount: 421890,
  underTrialDetentionRatioPct: 34.8,
  bnss60DayInquiryCompliancePct: 92.6,
  bnss90DayChargeSheetCompliancePct: 95.1,
  bnss30DayJudgmentDeliveryCompliancePct: 94.7,
  averageTrialDurationDays: 242,
  totalElectronicHearingsHeldSec530: 184920,
  statePerformanceRoster: [
    {
      stateName: 'NCT of Delhi',
      clearanceRate: 112.4,
      pendencyCasesCount: 28410,
      leadDistrict: 'New Delhi (Patiala House)',
      compositeScore: 96.8,
    },
    {
      stateName: 'Maharashtra',
      clearanceRate: 108.1,
      pendencyCasesCount: 84200,
      leadDistrict: 'Mumbai City (Sessions Court)',
      compositeScore: 94.2,
    },
    {
      stateName: 'Karnataka',
      clearanceRate: 109.5,
      pendencyCasesCount: 51200,
      leadDistrict: 'Bengaluru Urban',
      compositeScore: 95.1,
    },
    {
      stateName: 'Telangana',
      clearanceRate: 105.8,
      pendencyCasesCount: 39400,
      leadDistrict: 'Hyderabad City Courts',
      compositeScore: 93.7,
    },
    {
      stateName: 'West Bengal',
      clearanceRate: 102.3,
      pendencyCasesCount: 62100,
      leadDistrict: 'Kolkata City Civil & Sessions',
      compositeScore: 91.5,
    },
  ],
  presidentialAuditCertDigest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
};

class Phase10Service {
  private pleaDispositions: PleaBargainingDisposition[] = [...INITIAL_PLEA_DISPOSITIONS];
  private smartLockers: SmartEvidenceLockerCompartment[] = [...INITIAL_SMART_LOCKERS];
  private precedents: LegalPrecedentCitation[] = [...INITIAL_PRECEDENTS];
  private judicialKpis: NationalJudicialKPIMetrics = { ...INITIAL_JUDICIAL_KPIS };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const pb = localStorage.getItem('nsdj_phase10_plea');
      if (pb) this.pleaDispositions = JSON.parse(pb);
      const sl = localStorage.getItem('nsdj_phase10_lockers');
      if (sl) this.smartLockers = JSON.parse(sl);
      const prec = localStorage.getItem('nsdj_phase10_precedents');
      if (prec) this.precedents = JSON.parse(prec);
      const kpis = localStorage.getItem('nsdj_phase10_kpis');
      if (kpis) this.judicialKpis = JSON.parse(kpis);
    } catch {
      // fallback
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('nsdj_phase10_plea', JSON.stringify(this.pleaDispositions));
      localStorage.setItem('nsdj_phase10_lockers', JSON.stringify(this.smartLockers));
      localStorage.setItem('nsdj_phase10_precedents', JSON.stringify(this.precedents));
      localStorage.setItem('nsdj_phase10_kpis', JSON.stringify(this.judicialKpis));
    } catch {
      // ignore
    }
  }

  // ==========================================
  // CHAPTER XXII BNSS: PLEA BARGAINING & RESTORATIVE DISPOSITION
  // ==========================================

  getPleaDispositions(): PleaBargainingDisposition[] {
    return this.pleaDispositions;
  }

  async createPleaBargainingDisposition(
    caseItem: CaseFile,
    accusedName: string,
    victimCompensation: number,
    prosecutionCosts: number,
    communityServiceTask: string
  ): Promise<PleaBargainingDisposition> {
    const dispId = `PB-DISP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const msdReportRef = `MSD-REP-${caseItem.courtName.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const sealHash = await computeSHA256(dispId + accusedName + victimCompensation);

    const newDisposition: PleaBargainingDisposition = {
      id: dispId,
      caseId: caseItem.id,
      caseNumber: caseItem.caseNumber,
      applicantAccusedName: accusedName,
      chargedSections: caseItem.legalActsAndSections,
      isStatutorilyEligibleSec290: true,
      statutoryMaxPenaltyYears: 7,
      statutoryMinPenaltyYears: 1,
      voluntaryAffidavitFiled: true,
      victimName: caseItem.complainant.name,
      prosecutorName: 'Adv. S. K. Mahapatra (Chief Public Prosecutor)',
      judicialMagistrateName: caseItem.courtName,
      msdNegotiationStatus: 'MUTUALLY_SATISFACTORY_DISPOSITION_ACHIEVED',
      victimCompensationAgreedRupees: victimCompensation,
      prosecutionCostsRupees: prosecutionCosts,
      mitigatedSentenceMonths: 6,
      communityServiceAssigned: communityServiceTask,
      msdReportRef,
      finalJudgmentDraftSec296: `JUDGMENT UNDER SECTION 296 BNSS 2023:\n\nAccused ${accusedName} having entered into a Mutually Satisfactory Disposition under Section 293 BNSS, and deposited ₹${victimCompensation.toLocaleString(
        'en-IN'
      )}/- as restitution to ${caseItem.complainant.name}, is sentenced to undergo 6 months imprisonment and community service. Non-appealable under Sec 298 BNSS.`,
      judicialSealSha256: sealHash,
      isNonAppealableCertifiedSec298: true,
    };

    this.pleaDispositions.unshift(newDisposition);
    this.saveToStorage();
    return newDisposition;
  }

  // ==========================================
  // SMART EVIDENCE LOCKER NFC/RFID GRID
  // ==========================================

  getSmartLockers(): SmartEvidenceLockerCompartment[] {
    return this.smartLockers;
  }

  async toggleLockerAccess(compartmentId: string, officerName: string): Promise<SmartEvidenceLockerCompartment> {
    const target = this.smartLockers.find((c) => c.compartmentId === compartmentId);
    if (!target) throw new Error('Compartment not found');

    if (target.hardwareStatus === 'SECURED_LOCKED') {
      target.hardwareStatus = 'ACCESS_UNLOCKED';
      target.lastAccessTimestamp = new Date().toISOString();
      target.accessLogEventsCount += 1;
      target.activeCustodianOfficer = officerName;
    } else {
      target.hardwareStatus = 'SECURED_LOCKED';
      target.lastAccessTimestamp = new Date().toISOString();
    }

    this.saveToStorage();
    return target;
  }

  // ==========================================
  // LANDMARK PRECEDENTS CITATION GRAPH
  // ==========================================

  getPrecedents(): LegalPrecedentCitation[] {
    return this.precedents;
  }

  // ==========================================
  // SOVEREIGN NJDG 3.0 JUDICIAL KPIS
  // ==========================================

  getNationalJudicialKPIs(): NationalJudicialKPIMetrics {
    return this.judicialKpis;
  }
}

export const phase10Service = new Phase10Service();
