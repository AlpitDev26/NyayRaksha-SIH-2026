import {
  MedicoLegalAutopsyRecord,
  OrganizedCrimeSyndicateRecord,
  RemandOrderSheetRecord,
  AirGapHSMCeremonyRecord,
  CaseFile,
} from '../types';
import { computeSHA256 } from './cryptoEngine';

// Initial Medico-Legal Autopsy Records (Sec 194-196 BNSS)
const INITIAL_AUTOPSY_RECORDS: MedicoLegalAutopsyRecord[] = [
  {
    id: 'AUT-2026-DEL-0091',
    caseId: 'CASE-2026-001',
    caseNumber: 'DL-01-2026-CR-0041',
    deceasedName: 'Late Sh. Rohit K. Verma',
    deceasedAge: 42,
    deceasedGender: 'MALE',
    inquestType: 'POLICE_INQUEST_SEC_194',
    inquestOfficerName: 'Inspector Rajesh Varma',
    inquestOfficerDesignation: 'SHO / Investigating Officer',
    hospitalOrMortuary: 'Department of Forensic Medicine, AIIMS, New Delhi',
    chiefMedicalExaminer: 'Dr. Sudhir K. Gupta (Prof. & Head of Forensic Medicine)',
    timeOfDeathEstimated: '2026-01-14T02:30:00Z',
    timeOfAutopsy: '2026-01-14T11:00:00Z',
    probableCauseOfDeath: 'Hemorrhagic Shock consequent to Ante-Mortem Penetrating Firearm Injury to Thorax',
    injuriesFound: [
      {
        injuryNumber: 1,
        anatomicalSite: 'Left 4th Intercostal Space, Mid-Clavicular Line',
        injuryType: 'FIREARM_ENTRY_WOUND',
        dimensionsCm: '0.8 x 0.8 cm with Inverted Abrasion Collar and Blackening',
        anteMortemStatus: 'ANTE_MORTEM',
        lethalContribution: 'DIRECTLY_FATAL',
      },
      {
        injuryNumber: 2,
        anatomicalSite: 'Right Infrascapular Region (Posterior Thorax)',
        injuryType: 'FIREARM_EXIT_WOUND',
        dimensionsCm: '1.4 x 1.1 cm with Everted Ragged Margins',
        anteMortemStatus: 'ANTE_MORTEM',
        lethalContribution: 'CONTRIBUTORY',
      },
      {
        injuryNumber: 3,
        anatomicalSite: 'Dorsal Aspect of Right Forearm',
        injuryType: 'BLUNT_FORCE_CONTUSION',
        dimensionsCm: '5.0 x 2.5 cm Dark Bluish-Red Contusion',
        anteMortemStatus: 'ANTE_MORTEM',
        lethalContribution: 'NON_FATAL',
      },
    ],
    toxicologyVisceraFindings: 'Viscera qualitative chemical screening negative for common agricultural poisons and organophosphates.',
    dnaSamplingPreserved: true,
    videoRecordingC2paHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    medicalCertPartB_Sha256: '9f81a203b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
    magistrateTransmissionStatus: 'TRANSMITTED_TO_CJM',
  },
];

// Initial Organized Crime Syndicates (Sec 111 BNS / FIU)
const INITIAL_SYNDICATES: OrganizedCrimeSyndicateRecord[] = [
  {
    id: 'SYND-2026-NCR-001',
    syndicateName: 'Apex Global Financial Hawala & Cyber Syndicate',
    kingpinName: 'Danish Farooqui @ Danny Bhai',
    syndicateCategory: 'SEC_111_BNS_ORGANIZED_CRIME',
    activeMembersCount: 18,
    totalProceedsEstimatedRupees: 450000000, // 45 Cr
    fiuAlertReference: 'FIU-IND/STR/2026/CYBER-4419',
    illicitFinancialNodes: [
      {
        nodeId: 'NODE-01',
        entityName: 'Apex Commodities DMCC (Dubai Proxy Shell)',
        nodeType: 'OFFSHORE_HAWALA_NODE',
        jurisdiction: 'United Arab Emirates',
        frozenAmountRupees: 185000000,
        freezeOrderDate: '2026-02-12T10:00:00Z',
        fiuFlagStatus: 'FROZEN_SEC_107',
      },
      {
        nodeId: 'NODE-02',
        entityName: 'Tornado Tumbler Cold Storage Pool #4',
        nodeType: 'CRYPTO_TUMBLER_WALLET',
        jurisdiction: 'Decentralized / Non-Custodial',
        frozenAmountRupees: 92000000,
        freezeOrderDate: '2026-02-14T14:30:00Z',
        fiuFlagStatus: 'FROZEN_SEC_107',
      },
      {
        nodeId: 'NODE-03',
        entityName: 'Prime Commercial Towers, 7th Floor, BKC Mumbai',
        nodeType: 'BENAMI_REAL_ESTATE',
        jurisdiction: 'Maharashtra, India',
        frozenAmountRupees: 120000000,
        freezeOrderDate: '2026-02-18T16:00:00Z',
        fiuFlagStatus: 'CONFISCATION_ORDERED',
      },
    ],
    uapaOrPmlaSections: ['Section 111 BNS (Organized Crime)', 'PMLA Sec 3/4', 'UAPA Sec 17 (Terror Funding)'],
    investigatingAgency: 'NATIONAL_INVESTIGATION_AGENCY_NIA',
    courtAttachmentOrderSha256: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
  },
];

// Initial Remand & Rojnamcha Order-Sheets (Sec 187 BNSS)
const INITIAL_REMAND_ORDERS: RemandOrderSheetRecord[] = [
  {
    id: 'REM-2026-0041-01',
    caseId: 'CASE-2026-001',
    caseNumber: 'DL-01-2026-CR-0041',
    accusedName: 'Vikramaditya S. Malhotra',
    hearingTimestamp: '2026-01-15T11:30:00Z',
    presidingMagistrate: 'Court of Chief Judicial Magistrate, Tis Hazari Courts, Delhi',
    custodyTypeRequested: 'POLICE_CUSTODY_REMAND',
    custodyDaysGranted: 5,
    daysInPoliceCustodyTotal: 5,
    daysInJudicialCustodyTotal: 0,
    remandGrounds:
      'Custodial interrogation necessary for on-spot recovery of hardware security keys, decryption of cold wallets, and confrontation with co-accused.',
    medicalFitnessVerifiedSec53: true,
    legalAidProvidedSec340: true,
    nextHearingDate: '2026-01-20T11:00:00Z',
    ePrisonsCustodySlipRef: 'EPRISONS-REM-2026-DEL-9941',
    orderSheetText:
      'ORDER UNDER SECTION 187 BNSS:\n\nAccused Vikramaditya S. Malhotra produced in custody. Investigating Officer moved application seeking 7 days Police Custody. Perused Case Diary and medical examination report under Sec 53 BNSS. Having heard both sides, Police Custody for a period of 5 days is granted. Accused to be re-produced on 20.01.2026 with fresh medical report.',
    magistrateSealSha256: '7c89f201b4e5a639018471928371902839182390182390182390182390182390',
  },
];

// Initial Air-Gap HSM Key Ceremonies (FIPS 140-3 Level 4)
const INITIAL_HSM_CEREMONIES: AirGapHSMCeremonyRecord[] = [
  {
    ceremonyId: 'HSM-CEREMONY-2026-Q1',
    ceremonyTimestamp: '2026-01-01T06:00:00Z',
    ceremonyType: 'MASTER_LEDGER_ROOT_ROTATION',
    fips140Level: 'FIPS_140_3_LEVEL_4',
    thresholdMofN: '3_OF_5_THRESHOLD',
    keyCustodiansPresent: [
      {
        name: 'Hon. Chief Justice of India Nominee',
        role: 'Supreme Court Judicial Custodian',
        department: 'Supreme Court e-Committee',
        smartCardInserted: true,
        pinEntropyPassed: true,
        partialKeyShareSha256: '9f81a203b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
      },
      {
        name: 'Union Law Secretary, GoI',
        role: 'Ministry of Law Custodian',
        department: 'Department of Justice',
        smartCardInserted: true,
        pinEntropyPassed: true,
        partialKeyShareSha256: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
      },
      {
        name: 'Director General, NIC',
        role: 'National Sovereign Root Infrastructure',
        department: 'National Informatics Centre',
        smartCardInserted: true,
        pinEntropyPassed: true,
        partialKeyShareSha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      },
    ],
    ceremonyStatus: 'CEREMONY_COMPLETED_SUCCESS',
    coldVaultBackupHash: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    sovereignLedgerStateHash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
    collegiumAuditCertificate: 'CCA-INDIA-ROOT-KEY-2026-CERT-001',
  },
];

class Phase11Service {
  private autopsyRecords: MedicoLegalAutopsyRecord[] = [...INITIAL_AUTOPSY_RECORDS];
  private syndicates: OrganizedCrimeSyndicateRecord[] = [...INITIAL_SYNDICATES];
  private remandOrders: RemandOrderSheetRecord[] = [...INITIAL_REMAND_ORDERS];
  private hsmCeremonies: AirGapHSMCeremonyRecord[] = [...INITIAL_HSM_CEREMONIES];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const aut = localStorage.getItem('nsdj_phase11_autopsy');
      if (aut) this.autopsyRecords = JSON.parse(aut);
      const syn = localStorage.getItem('nsdj_phase11_syndicates');
      if (syn) this.syndicates = JSON.parse(syn);
      const rem = localStorage.getItem('nsdj_phase11_remand');
      if (rem) this.remandOrders = JSON.parse(rem);
      const hsm = localStorage.getItem('nsdj_phase11_hsm');
      if (hsm) this.hsmCeremonies = JSON.parse(hsm);
    } catch {
      // fallback
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('nsdj_phase11_autopsy', JSON.stringify(this.autopsyRecords));
      localStorage.setItem('nsdj_phase11_syndicates', JSON.stringify(this.syndicates));
      localStorage.setItem('nsdj_phase11_remand', JSON.stringify(this.remandOrders));
      localStorage.setItem('nsdj_phase11_hsm', JSON.stringify(this.hsmCeremonies));
    } catch {
      // ignore
    }
  }

  // ==========================================
  // SECTION 194-196 BNSS: MEDICO-LEGAL AUTOPSY & INQUEST
  // ==========================================

  getAutopsyRecords(): MedicoLegalAutopsyRecord[] {
    return this.autopsyRecords;
  }

  async createAutopsyRecord(
    caseItem: CaseFile,
    deceasedName: string,
    age: number,
    gender: MedicoLegalAutopsyRecord['deceasedGender'],
    inquestType: MedicoLegalAutopsyRecord['inquestType'],
    causeOfDeath: string,
    injurySite: string,
    injuryType: any
  ): Promise<MedicoLegalAutopsyRecord> {
    const autId = `AUT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const certHash = await computeSHA256(autId + deceasedName + causeOfDeath);

    const newRecord: MedicoLegalAutopsyRecord = {
      id: autId,
      caseId: caseItem.id,
      caseNumber: caseItem.caseNumber,
      deceasedName,
      deceasedAge: age,
      deceasedGender: gender,
      inquestType,
      inquestOfficerName: caseItem.leadInvestigator.name,
      inquestOfficerDesignation: caseItem.leadInvestigator.rank,
      hospitalOrMortuary: 'Department of Forensic Medicine, AIIMS / Medical College Hospital',
      chiefMedicalExaminer: 'Dr. Senior Forensic Medical Specialist (MD Forensic Medicine)',
      timeOfDeathEstimated: new Date(Date.now() - 43200000).toISOString(),
      timeOfAutopsy: new Date().toISOString(),
      probableCauseOfDeath: causeOfDeath,
      injuriesFound: [
        {
          injuryNumber: 1,
          anatomicalSite: injurySite,
          injuryType,
          dimensionsCm: '3.5 x 1.8 x 2.2 cm',
          anteMortemStatus: 'ANTE_MORTEM',
          lethalContribution: 'DIRECTLY_FATAL',
        },
      ],
      toxicologyVisceraFindings: 'Viscera bottled and sealed for CFSL toxicological analysis.',
      dnaSamplingPreserved: true,
      videoRecordingC2paHash: certHash,
      medicalCertPartB_Sha256: certHash,
      magistrateTransmissionStatus: 'TRANSMITTED_TO_CJM',
    };

    this.autopsyRecords.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }

  // ==========================================
  // SECTION 111 BNS: ORGANIZED CRIME & TERROR FORFEITURE
  // ==========================================

  getSyndicates(): OrganizedCrimeSyndicateRecord[] {
    return this.syndicates;
  }

  async createSyndicateRecord(
    syndicateName: string,
    kingpinName: string,
    category: OrganizedCrimeSyndicateRecord['syndicateCategory'],
    membersCount: number,
    proceedsAmount: number,
    entityName: string,
    nodeType: any,
    frozenAmount: number
  ): Promise<OrganizedCrimeSyndicateRecord> {
    const synId = `SYND-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderHash = await computeSHA256(synId + syndicateName + kingpinName);

    const newSyndicate: OrganizedCrimeSyndicateRecord = {
      id: synId,
      syndicateName,
      kingpinName,
      syndicateCategory: category,
      activeMembersCount: membersCount,
      totalProceedsEstimatedRupees: proceedsAmount,
      fiuAlertReference: `FIU-IND/STR/${new Date().getFullYear()}/CARTEL-${Math.floor(1000 + Math.random() * 9000)}`,
      illicitFinancialNodes: [
        {
          nodeId: `NODE-${Math.floor(10 + Math.random() * 90)}`,
          entityName,
          nodeType,
          jurisdiction: 'National / Offshore Financial Network',
          frozenAmountRupees: frozenAmount,
          freezeOrderDate: new Date().toISOString(),
          fiuFlagStatus: 'FROZEN_SEC_107',
        },
      ],
      uapaOrPmlaSections: ['Section 111 BNS (Organized Crime)', 'PMLA Sec 3/4'],
      investigatingAgency: 'NATIONAL_INVESTIGATION_AGENCY_NIA',
      courtAttachmentOrderSha256: orderHash,
    };

    this.syndicates.unshift(newSyndicate);
    this.saveToStorage();
    return newSyndicate;
  }

  // ==========================================
  // SECTION 187 BNSS: REMAND & ORDER-SHEET ENGINE
  // ==========================================

  getRemandOrders(): RemandOrderSheetRecord[] {
    return this.remandOrders;
  }

  async grantRemandOrder(
    caseItem: CaseFile,
    accusedName: string,
    custodyType: RemandOrderSheetRecord['custodyTypeRequested'],
    daysGranted: number,
    grounds: string
  ): Promise<RemandOrderSheetRecord> {
    const remId = `REM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const sealHash = await computeSHA256(remId + accusedName + grounds);

    const newOrder: RemandOrderSheetRecord = {
      id: remId,
      caseId: caseItem.id,
      caseNumber: caseItem.caseNumber,
      accusedName,
      hearingTimestamp: new Date().toISOString(),
      presidingMagistrate: caseItem.courtName,
      custodyTypeRequested: custodyType,
      custodyDaysGranted: daysGranted,
      daysInPoliceCustodyTotal: custodyType === 'POLICE_CUSTODY_REMAND' ? daysGranted : 0,
      daysInJudicialCustodyTotal: custodyType === 'JUDICIAL_CUSTODY_REMAND' ? daysGranted : 0,
      remandGrounds: grounds,
      medicalFitnessVerifiedSec53: true,
      legalAidProvidedSec340: true,
      nextHearingDate: new Date(Date.now() + daysGranted * 86400000).toISOString(),
      ePrisonsCustodySlipRef: `EPRISONS-REM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      orderSheetText: `JUDICIAL REMAND ORDER (SEC 187 BNSS 2023):\n\nAccused ${accusedName} produced before the Bench. Investigating agency requested ${daysGranted} days ${custodyType.replace(
        /_/g,
        ' '
      )}. Medical fitness under Section 53 verified. Remand granted for ${daysGranted} days. Next production on ${new Date(
        Date.now() + daysGranted * 86400000
      ).toLocaleDateString()}.`,
      magistrateSealSha256: sealHash,
    };

    this.remandOrders.unshift(newOrder);
    this.saveToStorage();
    return newOrder;
  }

  // ==========================================
  // SOVEREIGN HSM KEY CEREMONY SIMULATOR
  // ==========================================

  getHSMCeremonies(): AirGapHSMCeremonyRecord[] {
    return this.hsmCeremonies;
  }

  async executeHSMCeremony(
    ceremonyType: AirGapHSMCeremonyRecord['ceremonyType']
  ): Promise<AirGapHSMCeremonyRecord> {
    const cerId = `HSM-CEREMONY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const backupHash = await computeSHA256(cerId + ceremonyType + new Date().toISOString());

    const newCeremony: AirGapHSMCeremonyRecord = {
      ceremonyId: cerId,
      ceremonyTimestamp: new Date().toISOString(),
      ceremonyType,
      fips140Level: 'FIPS_140_3_LEVEL_4',
      thresholdMofN: '3_OF_5_THRESHOLD',
      keyCustodiansPresent: [
        {
          name: 'Supreme Court Registrar General (Nominee of CJI)',
          role: 'Judicial Trustee Keyholder',
          department: 'Supreme Court of India',
          smartCardInserted: true,
          pinEntropyPassed: true,
          partialKeyShareSha256: await computeSHA256('CJI_PARTIAL_KEY_' + cerId),
        },
        {
          name: 'Union Home Secretary, GoI',
          role: 'National Sovereign Security Trustee',
          department: 'Ministry of Home Affairs',
          smartCardInserted: true,
          pinEntropyPassed: true,
          partialKeyShareSha256: await computeSHA256('MHA_PARTIAL_KEY_' + cerId),
        },
        {
          name: 'Director General, CDAC / NIC',
          role: 'National Cryptographic Root Trustee',
          department: 'MeitY / NIC',
          smartCardInserted: true,
          pinEntropyPassed: true,
          partialKeyShareSha256: await computeSHA256('NIC_PARTIAL_KEY_' + cerId),
        },
      ],
      ceremonyStatus: 'CEREMONY_COMPLETED_SUCCESS',
      coldVaultBackupHash: backupHash,
      sovereignLedgerStateHash: `0x${backupHash.slice(0, 40)}`,
      collegiumAuditCertificate: `CCA-INDIA-HSM-${new Date().getFullYear()}-ROOT-VERIFIED`,
    };

    this.hsmCeremonies.unshift(newCeremony);
    this.saveToStorage();
    return newCeremony;
  }
}

export const phase11Service = new Phase11Service();
