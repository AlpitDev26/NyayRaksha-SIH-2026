import {
  JuvenileJusticeRecord,
  CitizenJusticeELockerRecord,
  CyberCrimeTakedownRecord,
  QuantumResilientDRRecord,
} from '../types';
import { computeSHA256 } from './cryptoEngine';

// Initial Juvenile Justice Records (JJ Act 2015 / POCSO)
const INITIAL_JUVENILE_RECORDS: JuvenileJusticeRecord[] = [
  {
    id: 'JJB-2026-DL-001',
    caseId: 'CASE-2026-001',
    caseNumber: 'JJB/DEL/2026/041',
    anonymizedPseudonym: "Child in Conflict with Law 'CCL-Alpha-2026' (Sec 74 JJ Act Redacted)",
    ageAtOffense: 16.8,
    ageDeterminationBasis: 'MATRICULATION_CERTIFICATE',
    category: 'CHILD_IN_CONFLICT_WITH_LAW_CICL',
    allegedOffensesBNS: ['Sec 103(1) BNS (Murder)', 'Sec 111(2) BNS (Organized Crime syndicate complicity)'],
    isHeinousOffense: true,
    preliminaryAssessmentSec15JJB: {
      assessedByPsychologist: true,
      psychologistName: 'Dr. Ananya Ray (Senior Clinical Child Psychologist, NIMHANS / JJB Panel)',
      mentalPhysicalCapacityEvaluated: true,
      abilityToUnderstandConsequences: true,
      recommendation: 'REHABILITATION_UNDER_JJB',
      assessmentDate: '2026-01-18T10:30:00Z',
      assessmentReportSha256: 'b4a8e29d71c8901f42e399c08231efb7834190289ef32ab908123efb0981a2c3',
    },
    socialInvestigationReportForm6: {
      probationOfficerName: 'Sh. Manoj Kumar (District Child Protection Unit - South Delhi)',
      familySocioEconomicBackground: 'BPL family, father migrant worker, single parent household in Sangam Vihar',
      schoolAttendanceRecord: 'Dropped out after 9th standard due to financial distress; keen interest in automotive mechanics',
      peerGroupInfluenceScore: 'HIGH',
      substanceAbuseStatus: 'NONE',
    },
    individualCarePlanForm7: {
      counselingPlan: 'Cognitive Behavioral Therapy (16 sessions) & De-radicalization from local gang nexus',
      vocationalTrainingStream: 'Solar Panel Electrical & Micro-EV Powertrain Assembly (ITI Delhi)',
      repatriationFeasibility: true,
      fitFacilityAssigned: 'OBSERVATION_HOME_SPECIAL',
    },
    identityRedactionShieldSha256: '98a76bc4512e0394857dfbc81203498aef019283746501928374650192837465',
    jjbMagistratePresiding: 'Principal Magistrate Smt. Vandana Sharma (JJB-II, Ferozeshah Kotla)',
    nextJJBHearingDate: '2026-02-10T11:00:00Z',
    childFriendlyHearingCompliant: true,
  },
  {
    id: 'JJB-2026-MH-009',
    caseId: 'CASE-2026-004',
    caseNumber: 'JJB/MUM/2026/119',
    anonymizedPseudonym: "Child in Conflict with Law 'CCL-Beta-2026' (Sec 74 JJ Act Redacted)",
    ageAtOffense: 17.2,
    ageDeterminationBasis: 'OSSIFICATION_TEST_AIIMS',
    category: 'CHILD_IN_CONFLICT_WITH_LAW_CICL',
    allegedOffensesBNS: ['Sec 318(4) BNS (Cyber Financial Fraud)', 'Sec 66D IT Act (Impersonation)'],
    isHeinousOffense: false,
    preliminaryAssessmentSec15JJB: {
      assessedByPsychologist: true,
      psychologistName: 'Dr. Rajesh Deshmukh (JJB Psychological Board, Mumbai)',
      mentalPhysicalCapacityEvaluated: true,
      abilityToUnderstandConsequences: false,
      recommendation: 'REHABILITATION_UNDER_JJB',
      assessmentDate: '2026-01-20T14:00:00Z',
      assessmentReportSha256: 'c3d981249ef1023a9b8c7e6d5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b',
    },
    socialInvestigationReportForm6: {
      probationOfficerName: 'Smt. Kavita Patil (Probation Officer, Dongri Observation Home)',
      familySocioEconomicBackground: 'Middle income; parents bank accountants; unmonitored dark web exposure during lockdown',
      schoolAttendanceRecord: '12th standard student (Science Stream, 88% academic score)',
      peerGroupInfluenceScore: 'MODERATE',
      substanceAbuseStatus: 'NONE',
    },
    individualCarePlanForm7: {
      counselingPlan: 'Cyber Ethics & Digital Legal Responsibility Mentorship (CERT-In certified counselor)',
      vocationalTrainingStream: 'Cyber Defense & Ethical Vulnerability Disclosure program under NCIIPC guidance',
      repatriationFeasibility: true,
      fitFacilityAssigned: 'FOSTER_CARE_GUARDIAN',
    },
    identityRedactionShieldSha256: '71c8901f42e399c08231efb7834190289ef32ab908123efb0981a2c3b4a8e29d',
    jjbMagistratePresiding: 'Principal Magistrate Sh. Arun Sawant (JJB Mumbai Urban)',
    nextJJBHearingDate: '2026-02-14T10:00:00Z',
    childFriendlyHearingCompliant: true,
  },
];

// Initial Citizen Justice & E-Locker Records (DigiLocker & Sec 63 BSA Certified Copies)
const INITIAL_CITIZEN_ELOCKER_RECORDS: CitizenJusticeELockerRecord[] = [
  {
    requestId: 'ELOCKER-2026-IND-901',
    citizenAadhaarVaultToken: 'AV-TOKEN-9948-2026-SECURE-VAULT',
    citizenNameMasked: 'R*** S*** V***',
    mobileLinkedMasked: 'XXXXXX8821',
    requestType: 'CERTIFIED_COPY_BSA_63',
    caseNumberRef: 'DL-01-2026-CR-0041',
    courtJurisdiction: 'High Court of Delhi / Sessions Court Patiala House',
    certifiedDocumentTitle: 'Certified True Copy of Bail Order & Police Remand Sheet (Sec 187 BNSS)',
    issuingJudgeName: 'Hon. Justice Pradeep K. Nandrajog (Special Judge BNSS)',
    digitalSignatureBSA63Sha256: 'a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890',
    qrVerificationUrl: 'https://ecourts.gov.in/verify?hash=a1b2c3d4e5f67890&stamp=BSA-63-2026',
    status: 'ISSUED_AND_AVAILABLE',
    issuedTimestamp: '2026-01-22T09:15:00Z',
    downloadExpiryTimestamp: '2026-07-22T23:59:59Z',
  },
  {
    requestId: 'ELOCKER-2026-IND-902',
    citizenAadhaarVaultToken: 'AV-TOKEN-7712-2026-SECURE-VAULT',
    citizenNameMasked: 'P*** M*** K***',
    mobileLinkedMasked: 'XXXXXX3490',
    requestType: 'VICTIM_COMPENSATION_BNSS_396',
    caseNumberRef: 'MH-02-2026-CR-0089',
    courtJurisdiction: 'District Legal Services Authority (DLSA), Mumbai City',
    certifiedDocumentTitle: 'Victim Rehabilitation & Interim Compensation Sanction Order (NALSA Scheme)',
    issuingJudgeName: 'Smt. Shreya Kulkarni (Secretary, DLSA Mumbai)',
    digitalSignatureBSA63Sha256: '9f8e7d6c5b4a3210fedcba0987654321fedcba0987654321fedcba0987654321',
    qrVerificationUrl: 'https://nalsa.gov.in/dlsa-verify?ref=DLSA-MUM-2026-396',
    nalSACompensationAmountRupees: 500000,
    legalAidCounselAssigned: {
      advocateName: 'Adv. Meenakshi Sundaram',
      barCouncilEnrollment: 'MAH/4901/2012',
      proBonoPanelCategory: 'LEGAL_SERVICES_AUTHORITY_DLSA',
    },
    status: 'DISBURSED_DIRECT_BENEFIT',
    issuedTimestamp: '2026-01-24T11:45:00Z',
    downloadExpiryTimestamp: '2026-12-31T23:59:59Z',
  },
  {
    requestId: 'ELOCKER-2026-IND-903',
    citizenAadhaarVaultToken: 'AV-TOKEN-6631-2026-SECURE-VAULT',
    citizenNameMasked: 'S*** B*** J***',
    mobileLinkedMasked: 'XXXXXX1144',
    requestType: 'PRIVATE_COMPLAINT_BNSS_223',
    caseNumberRef: 'KA-04-2026-PC-0012',
    courtJurisdiction: 'Chief Metropolitan Magistrate Court, Bengaluru Urban',
    certifiedDocumentTitle: 'Private Criminal Complaint Petition under Sec 223 BNSS (Pre-Cognizance Scrutiny)',
    issuingJudgeName: 'Presiding Magistrate Sri R. Venkatesh',
    digitalSignatureBSA63Sha256: '44556677889900aabbccddeeff00112233445566778899aabbccddeeff001122',
    qrVerificationUrl: 'https://karnataka.ecourts.gov.in/efiling?complaintId=KA-04-2026-PC-0012',
    legalAidCounselAssigned: {
      advocateName: 'Adv. Harish K. Gowda',
      barCouncilEnrollment: 'KAR/3120/2018',
      proBonoPanelCategory: 'SENIOR_PANEL',
    },
    status: 'UNDER_SCRUTINY',
    issuedTimestamp: '2026-01-25T15:30:00Z',
    downloadExpiryTimestamp: '2026-06-30T23:59:59Z',
  },
];

// Initial Cyber Crime Takedowns (I4C Grid & Sec 69A IT Act)
const INITIAL_CYBER_TAKEDOWNS: CyberCrimeTakedownRecord[] = [
  {
    noticeId: 'I4C-TAKEDOWN-2026-081',
    i4cIncidentRef: '1930-NCRP-2026-90412',
    incidentType: 'DEEPFAKE_MALICIOUS_MEDIA',
    targetPlatform: 'TELEGRAM_ENCRYPTED_CHANNEL',
    offendingUrlOrHandle: 'https://t.me/deepfake_ai_blackmail_syndicate_delhi',
    digitalEvidenceSha256: '6a5b4c3d2e1f0987654321fedcba9876543210fedcba9876543210fedcba9876',
    statutoryPowersInvoked: 'SEC_69A_IT_ACT',
    takedownStatus: 'EMERGENCY_BLOCKED_CERT_IN',
    muleBankAccountsFrozen: [
      {
        bankName: 'HDFC Bank Ltd.',
        accountNumberMasked: '5010099881XXXX',
        frozenAmountRupees: 1845000,
        fiuAlertId: 'FIU-CYBER-MULE-2026-091',
      },
      {
        bankName: 'State Bank of India',
        accountNumberMasked: '3049920192XXXX',
        frozenAmountRupees: 920000,
        fiuAlertId: 'FIU-CYBER-MULE-2026-092',
      },
    ],
    certInEscalationRef: 'CERT-IN-INCIDENT-2026-EMERG-4412',
    certInOfficerName: 'Deputy Director S. Ramachandran (CERT-In National Cyber Grid)',
    issuedTimestamp: '2026-01-26T04:15:00Z',
  },
  {
    noticeId: 'I4C-TAKEDOWN-2026-082',
    i4cIncidentRef: '1930-NCRP-2026-88194',
    incidentType: 'DARKNET_NARCOTICS_SYNDICATE',
    targetPlatform: 'DARKNET_TOR_ONION',
    offendingUrlOrHandle: 'http://bharatdurgscartel99xzv2819.onion/order-escrow',
    digitalEvidenceSha256: '99887766554433221100aabbccddeeff00112233445566778899aabbccddeeff',
    statutoryPowersInvoked: 'SEC_111_BNS_ORGANIZED_CYBER_CRIME',
    takedownStatus: 'FROZEN_FINANCIAL_MULE_ACCOUNTS',
    muleBankAccountsFrozen: [
      {
        bankName: 'ICICI Bank',
        accountNumberMasked: '0029019283XXXX',
        frozenAmountRupees: 4500000,
        fiuAlertId: 'FIU-NCB-CYBER-2026-104',
      },
    ],
    certInEscalationRef: 'CERT-IN-NCB-COORDINATION-901',
    certInOfficerName: 'Inspector Shailesh Pathak (NCB Cyber Operations Group)',
    issuedTimestamp: '2026-01-26T08:30:00Z',
  },
];

// Initial Quantum-Resilient Disaster Recovery & Geo-Redundancy Nodes
const INITIAL_QUANTUM_DR_NODES: QuantumResilientDRRecord[] = [
  {
    nodeId: 'NODE-NIC-DELHI-01',
    region: 'DELHI_PRIMARY_NIC_DC',
    role: 'PRIMARY_MASTER',
    pqcAlgorithmKem: 'NIST_FIPS_203_ML_KEM_1024',
    pqcAlgorithmDsa: 'NIST_FIPS_204_ML_DSA_87',
    hybridSignatureDualStatus: 'HYBRID_PQC_ACTIVE',
    syncLatencyMs: 0.8,
    byzantineConsensusQuorumWeight: 34.0,
    lastQuantumKeyRotationTimestamp: '2026-01-26T00:00:00Z',
    immutableSnapshotRootHash: '3f7a1b9c8d2e4f6a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a',
    splitBrainShieldActive: true,
    failoverHealthIndex: 99.999,
  },
  {
    nodeId: 'NODE-NIC-HYD-02',
    region: 'HYDERABAD_DISASTER_RECOVERY_DC',
    role: 'HOT_STANDBY_REPLICA',
    pqcAlgorithmKem: 'NIST_FIPS_203_ML_KEM_1024',
    pqcAlgorithmDsa: 'NIST_FIPS_204_ML_DSA_87',
    hybridSignatureDualStatus: 'HYBRID_PQC_ACTIVE',
    syncLatencyMs: 14.2,
    byzantineConsensusQuorumWeight: 33.0,
    lastQuantumKeyRotationTimestamp: '2026-01-26T00:00:00Z',
    immutableSnapshotRootHash: '3f7a1b9c8d2e4f6a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a',
    splitBrainShieldActive: true,
    failoverHealthIndex: 99.998,
  },
  {
    nodeId: 'NODE-NIC-BBSR-03',
    region: 'BHUBANESWAR_AIRGAP_COLD_VAULT',
    role: 'AIRGAP_SOVEREIGN_ARCHIVE',
    pqcAlgorithmKem: 'CRYSTALS_KYBER_1024',
    pqcAlgorithmDsa: 'CRYSTALS_DILITHIUM_5',
    hybridSignatureDualStatus: 'HYBRID_PQC_ACTIVE',
    syncLatencyMs: 38.5,
    byzantineConsensusQuorumWeight: 33.0,
    lastQuantumKeyRotationTimestamp: '2026-01-26T00:00:00Z',
    immutableSnapshotRootHash: '3f7a1b9c8d2e4f6a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a',
    splitBrainShieldActive: true,
    failoverHealthIndex: 100.0,
  },
];

class Phase12Service {
  private juvenileRecords: JuvenileJusticeRecord[] = [...INITIAL_JUVENILE_RECORDS];
  private citizenELockerRecords: CitizenJusticeELockerRecord[] = [...INITIAL_CITIZEN_ELOCKER_RECORDS];
  private cyberTakedowns: CyberCrimeTakedownRecord[] = [...INITIAL_CYBER_TAKEDOWNS];
  private quantumDRNodes: QuantumResilientDRRecord[] = [...INITIAL_QUANTUM_DR_NODES];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedJJ = localStorage.getItem('nsdj_phase12_juvenile_records');
      if (savedJJ) this.juvenileRecords = JSON.parse(savedJJ);

      const savedELocker = localStorage.getItem('nsdj_phase12_elocker_records');
      if (savedELocker) this.citizenELockerRecords = JSON.parse(savedELocker);

      const savedCyber = localStorage.getItem('nsdj_phase12_cyber_takedowns');
      if (savedCyber) this.cyberTakedowns = JSON.parse(savedCyber);

      const savedDR = localStorage.getItem('nsdj_phase12_quantum_dr_nodes');
      if (savedDR) this.quantumDRNodes = JSON.parse(savedDR);
    } catch {
      // Use fallback defaults
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('nsdj_phase12_juvenile_records', JSON.stringify(this.juvenileRecords));
      localStorage.setItem('nsdj_phase12_elocker_records', JSON.stringify(this.citizenELockerRecords));
      localStorage.setItem('nsdj_phase12_cyber_takedowns', JSON.stringify(this.cyberTakedowns));
      localStorage.setItem('nsdj_phase12_quantum_dr_nodes', JSON.stringify(this.quantumDRNodes));
    } catch {
      // Storage failure ignore
    }
  }

  // --- Juvenile Justice Domain ---
  getJuvenileRecords(): JuvenileJusticeRecord[] {
    return [...this.juvenileRecords];
  }

  async createJuvenileRecord(
    data: Omit<JuvenileJusticeRecord, 'id' | 'identityRedactionShieldSha256'>
  ): Promise<JuvenileJusticeRecord> {
    const rawData = JSON.stringify(data);
    const hash = await computeSHA256(rawData);
    const newRecord: JuvenileJusticeRecord = {
      ...data,
      id: `JJB-2026-${Date.now().toString().slice(-4)}`,
      identityRedactionShieldSha256: hash,
    };
    this.juvenileRecords.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }

  updateJuvenileAssessment(
    id: string,
    recommendation: 'TRIAL_AS_ADULT_CHILDRENS_COURT' | 'REHABILITATION_UNDER_JJB',
    psychologistNotes: string
  ) {
    const rec = this.juvenileRecords.find((r) => r.id === id);
    if (rec) {
      rec.preliminaryAssessmentSec15JJB.recommendation = recommendation;
      rec.preliminaryAssessmentSec15JJB.psychologistName += ` (Updated: ${psychologistNotes})`;
      this.saveToStorage();
    }
  }

  // --- Citizen E-Locker Domain ---
  getCitizenELockerRecords(): CitizenJusticeELockerRecord[] {
    return [...this.citizenELockerRecords];
  }

  async issueCitizenELockerDocument(
    data: Omit<CitizenJusticeELockerRecord, 'requestId' | 'digitalSignatureBSA63Sha256' | 'qrVerificationUrl' | 'issuedTimestamp'>
  ): Promise<CitizenJusticeELockerRecord> {
    const issuedTimestamp = new Date().toISOString();
    const rawData = `${data.caseNumberRef}|${data.citizenAadhaarVaultToken}|${data.requestType}|${issuedTimestamp}`;
    const sigHash = await computeSHA256(rawData);

    const newRecord: CitizenJusticeELockerRecord = {
      ...data,
      requestId: `ELOCKER-2026-${Date.now().toString().slice(-4)}`,
      issuedTimestamp,
      digitalSignatureBSA63Sha256: sigHash,
      qrVerificationUrl: `https://ecourts.gov.in/verify?hash=${sigHash.slice(0, 16)}&stamp=BSA-63-2026`,
    };

    this.citizenELockerRecords.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }

  // --- Cyber Crime Takedown Domain ---
  getCyberTakedowns(): CyberCrimeTakedownRecord[] {
    return [...this.cyberTakedowns];
  }

  async issueCyberTakedownNotice(
    data: Omit<CyberCrimeTakedownRecord, 'noticeId' | 'digitalEvidenceSha256' | 'issuedTimestamp'>
  ): Promise<CyberCrimeTakedownRecord> {
    const issuedTimestamp = new Date().toISOString();
    const rawData = `${data.i4cIncidentRef}|${data.offendingUrlOrHandle}|${data.statutoryPowersInvoked}|${issuedTimestamp}`;
    const hash = await computeSHA256(rawData);

    const newNotice: CyberCrimeTakedownRecord = {
      ...data,
      noticeId: `I4C-TAKEDOWN-2026-${Date.now().toString().slice(-3)}`,
      digitalEvidenceSha256: hash,
      issuedTimestamp,
    };

    this.cyberTakedowns.unshift(newNotice);
    this.saveToStorage();
    return newNotice;
  }

  freezeAdditionalMuleAccount(
    noticeId: string,
    muleAccount: {
      bankName: string;
      accountNumberMasked: string;
      frozenAmountRupees: number;
      fiuAlertId: string;
    }
  ) {
    const notice = this.cyberTakedowns.find((n) => n.noticeId === noticeId);
    if (notice) {
      notice.muleBankAccountsFrozen.push(muleAccount);
      notice.takedownStatus = 'FROZEN_FINANCIAL_MULE_ACCOUNTS';
      this.saveToStorage();
    }
  }

  // --- Quantum DR Domain ---
  getQuantumDRNodes(): QuantumResilientDRRecord[] {
    return [...this.quantumDRNodes];
  }

  async triggerQuantumKeyRotation(): Promise<{ rotationHash: string; timestamp: string }> {
    const timestamp = new Date().toISOString();
    const newRootHash = await computeSHA256(`PQC-KYBER-DILITHIUM-ROTATION-${timestamp}-${Math.random()}`);

    this.quantumDRNodes.forEach((node) => {
      node.lastQuantumKeyRotationTimestamp = timestamp;
      node.immutableSnapshotRootHash = newRootHash;
    });

    this.saveToStorage();
    return { rotationHash: newRootHash, timestamp };
  }

  simulateRegionFailover(targetRegion: 'HYDERABAD_DISASTER_RECOVERY_DC' | 'DELHI_PRIMARY_NIC_DC') {
    this.quantumDRNodes.forEach((node) => {
      if (node.region === targetRegion) {
        node.role = 'PRIMARY_MASTER';
        node.syncLatencyMs = 1.1;
      } else if (node.region === 'DELHI_PRIMARY_NIC_DC' && targetRegion !== 'DELHI_PRIMARY_NIC_DC') {
        node.role = 'HOT_STANDBY_REPLICA';
        node.syncLatencyMs = 15.4;
      }
    });
    this.saveToStorage();
  }
}

export const phase12Service = new Phase12Service();
