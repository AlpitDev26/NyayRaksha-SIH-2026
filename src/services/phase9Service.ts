import {
  NFSUCrimeSceneDispatchRecord,
  NFSUForensicSample,
  PreventivePeaceBondRecord,
  WitnessProtectionProfile,
  MLATExtraditionRecord,
  CaseFile,
} from '../types';
import { computeSHA256 } from './cryptoEngine';

// Initial Mock NFSU Crime Scene Dispatches (Sec 176(3) BNSS)
const INITIAL_NFSU_DISPATCHES: NFSUCrimeSceneDispatchRecord[] = [
  {
    id: 'NFSU-SCENE-2026-0041',
    caseId: 'CASE-2026-001',
    caseNumber: 'DL-01-2026-CR-0041',
    mandatorySec176Compliance: true,
    offenseSeverityYears: 10,
    mobileForensicVanId: 'NFSU-MOBILE-VAN-DELHI-07',
    leadForensicScientist: 'Dr. Vivek Sharma (Director, CFSL/NFSU Cyber Unit)',
    dispatchTimestamp: '2026-01-14T08:45:00Z',
    sceneArrivalTimestamp: '2026-01-14T09:12:00Z',
    gpsCoordinates: { lat: 28.6271, lng: 77.3725 },
    fslRefNumber: 'CFSL-DEL-2026-EVD-9941',
    laboratoryAssigned: 'National Forensic Sciences University (NFSU), Delhi Campus',
    sec176FormalReportSummary:
      'Pursuant to Section 176(3) of BNSS 2023, forensic team dispatched on-spot. Volatile RAM capture executed within 8 minutes of physical entry. Hardware wallets and network tap logs preserved with temperature-controlled cold-chain sealing.',
    reportCertificateHash: '7c89f201b4e5a639018471928371902839182390182390182390182390182390',
    samplesCollected: [
      {
        sampleId: 'SMPL-CYB-01',
        barcode: 'NFSU-BC-990141',
        discipline: 'CYBER_MOBILE_EXTRACTION',
        sampleType: 'Physical Flash Memory Chip-Off & RAM Dump',
        collectedAt: '2026-01-14T09:30:00Z',
        collectedLocation: 'Server Rack #2, Study Room',
        custodyOfficer: 'Dr. Vivek Sharma',
        sealBarcode: 'SEAL-NFSU-TAMPER-0091',
        analysisStatus: 'ANALYSIS_COMPLETED',
        scientificFindings:
          'Extracted 32GB RAM image revealed active Tor circuits, decrypted SSH sessions to overseas proxy nodes, and private key mnemonic phrases cached in browser process memory.',
        matchConfidenceScore: 99.4,
        keySpectralOrAlleleData: {
          'Tor Bridge IP': '185.220.101.5',
          'Cached Private Key Snippet': '0x7f48...99a1',
          'Entropy Score': 7.994,
        },
        cfslExaminerName: 'Dr. Vivek Sharma',
        examinerSignatureDigest: '3045022100a9f8219083bcda90184719283719028391823901823901823901823901823',
      },
      {
        sampleId: 'SMPL-DNA-02',
        barcode: 'NFSU-BC-990142',
        discipline: 'DNA_PROFILING',
        sampleType: 'Touch DNA Swab from Power Button & Keypad',
        collectedAt: '2026-01-14T09:45:00Z',
        collectedLocation: 'Laptop Power Button',
        custodyOfficer: 'Dr. Vivek Sharma',
        coldChainTempCelsius: -20.0,
        sealBarcode: 'SEAL-NFSU-TAMPER-0092',
        analysisStatus: 'ANALYSIS_COMPLETED',
        scientificFindings:
          'Single source male DNA STR profile generated across 24 loci (GlobalFiler Kit). Allelic frequencies match suspect Vikramaditya S. Malhotra with random match probability 1 in 4.2 Quintillion.',
        matchConfidenceScore: 99.99,
        keySpectralOrAlleleData: {
          'D3S1358': '15, 17',
          'vWA': '16, 18',
          'FGA': '21, 24',
          'D8S1179': '13, 14',
          'Amelogenin': 'X, Y',
        },
        cfslExaminerName: 'Dr. Ananya Ray (Senior DNA Analyst, NFSU)',
        examinerSignatureDigest: '30450221008819234857b21908123981bcda90184719283719028391823901823901823',
      },
      {
        sampleId: 'SMPL-BAL-03',
        barcode: 'NFSU-BC-990143',
        discipline: 'BALLISTICS_TOOLMARK',
        sampleType: 'Fired 7.65mm Brass Cartridge Case (Recovered at Escape Route)',
        collectedAt: '2026-01-14T10:15:00Z',
        collectedLocation: 'Ground Floor Emergency Fire Exit Stairs',
        custodyOfficer: 'Dr. Vivek Sharma',
        sealBarcode: 'SEAL-NFSU-TAMPER-0093',
        analysisStatus: 'ANALYSIS_COMPLETED',
        scientificFindings:
          'Microscopic 3D comparison revealed identical firing pin drag marks and breech-face striations matching seized 7.65mm pistol serial #IND-ORD-2024-8819.',
        matchConfidenceScore: 98.7,
        keySpectralOrAlleleData: {
          'Caliber': '7.65x17mm Browning',
          'Firing Pin Shape': 'Hemispherical with Right Drag',
          'Chamber Flute Count': 4,
        },
        cfslExaminerName: 'S. C. Ganguly (Assistant Director, Ballistics)',
        examinerSignatureDigest: '30450221001192837190283918239018239018239018819234857b21908123981bcda9',
      },
    ],
  },
];

// Initial Preventive Peace Bonds (Chapter VIII Sec 125-135 BNSS)
const INITIAL_PEACE_BONDS: PreventivePeaceBondRecord[] = [
  {
    id: 'PB-2026-DEL-0129',
    caseNumber: 'BNSS-129-DEL-2026-088',
    respondentName: 'Kallu @ Kuldeep Pehalwan',
    aliasList: ['Kallu Shooter', 'Kuldeep Gujjar'],
    age: 38,
    address: 'Village Mandawali, Near Primary School, East Delhi',
    policeStation: 'PS Cyber & Crime Special Cell, East District',
    jurisdictionDistrict: 'East District, New Delhi',
    bnssSection: 'SEC_129_HABITUAL_OFFENDERS',
    threatDescription:
      'Accused is a designated history-sheeter (Bad Character Roll-A) involved in repeated extortion and syndicate muscle protection. Intelligence input confirmed preparation to disrupt upcoming municipal trade tender.',
    showCauseNoticeRef: 'EM/ED/SEC130/2026/419',
    showCauseNoticeIssuedDate: '2026-02-10T10:00:00Z',
    inquiryStatus: 'BOND_ORDER_PASSED',
    bondAmountRupees: 250000,
    bondPeriodMonths: 36,
    suretiesRequiredCount: 2,
    suretiesVerifiedCount: 2,
    executiveMagistrateName: 'Sh. Arvind Nambiar, IAS (Sub-Divisional Magistrate / Executive Magistrate)',
    geoFencedRadiusKm: 5.0,
    mandatoryReportingSchedule: 'Every Sunday 10:00 AM at Police Station Mandawali',
    digitalOrderSha256: '9f81a203b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
  },
  {
    id: 'PB-2026-DEL-0126',
    caseNumber: 'BNSS-126-DEL-2026-092',
    respondentName: 'Rashid Khan @ Tiger',
    aliasList: ['Tiger Bhai'],
    age: 31,
    address: 'House 44, Gali 9, Jafrabad, North-East Delhi',
    policeStation: 'PS Jafrabad',
    jurisdictionDistrict: 'North-East District, Delhi',
    bnssSection: 'SEC_126_BREACH_OF_PEACE',
    threatDescription:
      'Imminent apprehension of communal disharmony and armed clash between rival transport unions over vehicle parking turf.',
    showCauseNoticeRef: 'EM/NED/SEC130/2026/502',
    showCauseNoticeIssuedDate: '2026-03-01T14:30:00Z',
    inquiryStatus: 'INQUIRY_IN_PROGRESS_SEC_135',
    bondAmountRupees: 100000,
    bondPeriodMonths: 12,
    suretiesRequiredCount: 1,
    suretiesVerifiedCount: 0,
    executiveMagistrateName: 'Ms. Priyamvada Sen, SDM / Executive Magistrate',
    geoFencedRadiusKm: 3.0,
    mandatoryReportingSchedule: 'Alternate Days at 18:00 hrs',
    digitalOrderSha256: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
  },
];

// Initial Witness Protection Profiles (Sec 398 BNSS)
const INITIAL_WITNESS_PROFILES: WitnessProtectionProfile[] = [
  {
    id: 'WP-2026-001',
    caseId: 'CASE-2026-001',
    caseNumber: 'DL-01-2026-CR-0041',
    witnessOriginalName: 'Sunil Kumar Saxena (Senior Database Admin)',
    witnessAssignedPseudonym: 'Witness Alpha-9 (Protected)',
    threatCategory: 'CATEGORY_A_SEVERE_LIFE_THREAT',
    threatAssessmentScore: 92,
    assessingOfficer: 'DCP Crime (Head of Witness Protection Cell, Delhi)',
    threatSummary:
      'Key insider witness who provided root credentials and recorded encrypted communications of prime syndicate boss. Received anonymous death threats and intercepted surveillance vehicles outside residence.',
    protectionMeasuresSanctioned: [
      'IDENTITY_CONCEALMENT_REDACTION',
      'SAFE_HOUSE_RELOCATION',
      'ARMED_POLICE_PROTECTION_24X7',
      'IN_CAMERA_VIDEO_DEPOSITION',
      'DIGITAL_COMMS_INTERCEPTION_DEFENSE',
      'EMERGENCY_SOS_BEACON',
    ],
    assignedSafeHouseCode: 'SAFE-HOUSE-NCR-ENCLAVE-04',
    escortTeamLead: 'Inspector Harpreet Singh (Special Protection Unit)',
    threatIncidentsLogged: [
      {
        timestamp: '2026-01-18T22:30:00Z',
        incidentType: 'Physical Recce by Unregistered SUV',
        sourceOrChannel: 'CCTV Perimeter Alert',
        actionTaken: 'Escort team deployed counter-surveillance; vehicle flagged at regional ANPR grid.',
      },
      {
        timestamp: '2026-02-02T11:15:00Z',
        incidentType: 'VoIP Threat Call via Spoofed Number',
        sourceOrChannel: 'Encrypted Cellular Line',
        actionTaken: 'Number traced to overseas proxy; witness moved to Tier-1 Safehouse.',
      },
    ],
    witnessProtectionOrderRef: 'WPC/DEL/SEC398/2026/014',
    orderPassedByJudge: 'Hon. Special Judge (CBI/BNS), Tis Hazari Courts, Delhi',
    orderDate: '2026-01-20T16:00:00Z',
    encryptedIdentitySealHash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
  },
];

// Initial MLAT & Extradition Records (Sec 111-114 BNSS)
const INITIAL_MLAT_RECORDS: MLATExtraditionRecord[] = [
  {
    id: 'MLAT-2026-IND-UAE-008',
    caseId: 'CASE-2026-002',
    caseNumber: 'MH-02-2026-CR-0108',
    fugitiveOrSubjectName: 'Danish Farooqui @ Danny Bhai',
    subjectNationality: 'Indian',
    foreignCountryTarget: 'United Arab Emirates (Dubai)',
    foreignJudicialAuthority: 'Ministry of Justice & Dubai Public Prosecution, UAE',
    requestType: 'EXTRADITION_TREATY_REQUEST',
    treatyFramework: 'BILATERAL_MLAT',
    meaClearanceRef: 'MEA/EXTRAD/2026/UAE-9904',
    mhaNodalApprovalDate: '2026-02-15T12:00:00Z',
    offenseBriefDualCriminology:
      'Offenses correspond to Transnational Wire Fraud, Money Laundering, and Extortion under UAE Federal Penal Code and Sections 316(2), 111 (Organized Crime) BNS 2023.',
    transferredEvidenceHashes: [
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      '4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c',
    ],
    diplomaticStatus: 'MEA_DIPLOMATIC_POUCH_DISPATCHED',
    leadMEAOfficer: 'Joint Secretary (Gulf & Extradition Division), MEA',
    digitalDossierHash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
  },
];

class Phase9Service {
  private nfsuDispatches: NFSUCrimeSceneDispatchRecord[] = [...INITIAL_NFSU_DISPATCHES];
  private peaceBonds: PreventivePeaceBondRecord[] = [...INITIAL_PEACE_BONDS];
  private witnessProfiles: WitnessProtectionProfile[] = [...INITIAL_WITNESS_PROFILES];
  private mlatRecords: MLATExtraditionRecord[] = [...INITIAL_MLAT_RECORDS];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const nfsu = localStorage.getItem('nsdj_phase9_nfsu');
      if (nfsu) this.nfsuDispatches = JSON.parse(nfsu);
      const pb = localStorage.getItem('nsdj_phase9_peacebonds');
      if (pb) this.peaceBonds = JSON.parse(pb);
      const wp = localStorage.getItem('nsdj_phase9_witness');
      if (wp) this.witnessProfiles = JSON.parse(wp);
      const mlat = localStorage.getItem('nsdj_phase9_mlat');
      if (mlat) this.mlatRecords = JSON.parse(mlat);
    } catch {
      // fallback
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('nsdj_phase9_nfsu', JSON.stringify(this.nfsuDispatches));
      localStorage.setItem('nsdj_phase9_peacebonds', JSON.stringify(this.peaceBonds));
      localStorage.setItem('nsdj_phase9_witness', JSON.stringify(this.witnessProfiles));
      localStorage.setItem('nsdj_phase9_mlat', JSON.stringify(this.mlatRecords));
    } catch {
      // ignore
    }
  }

  // ==========================================
  // SECTION 176(3) BNSS: NFSU FORENSIC CRIME SCENE & LAB TRIAGE
  // ==========================================

  getNFSUDispatches(): NFSUCrimeSceneDispatchRecord[] {
    return this.nfsuDispatches;
  }

  async dispatchNFSUCrimeSceneTeam(
    caseItem: CaseFile,
    leadScientist: string,
    discipline: NFSUForensicSample['discipline'],
    sampleType: string,
    collectedLocation: string,
    tempCelsius: number
  ): Promise<NFSUCrimeSceneDispatchRecord> {
    const dispatchId = `NFSU-SCENE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const sampleBarcode = `NFSU-BC-${Math.floor(100000 + Math.random() * 900000)}`;
    const certHash = await computeSHA256(dispatchId + leadScientist + sampleBarcode);

    const newSample: NFSUForensicSample = {
      sampleId: `SMPL-${discipline.slice(0, 3)}-${Math.floor(10 + Math.random() * 90)}`,
      barcode: sampleBarcode,
      discipline,
      sampleType,
      collectedAt: new Date().toISOString(),
      collectedLocation,
      custodyOfficer: leadScientist,
      coldChainTempCelsius: tempCelsius,
      sealBarcode: `SEAL-NFSU-${Math.floor(1000 + Math.random() * 9000)}`,
      analysisStatus: 'ANALYSIS_COMPLETED',
      scientificFindings: `Multi-stage forensic instrument verification performed on ${sampleType}. Unbroken chain of custody verified and certified under Sec 39 BNSS & Sec 63 BSA.`,
      matchConfidenceScore: 99.2,
      keySpectralOrAlleleData: {
        'Quality Index (QI)': 0.994,
        'Instrument Calibration': 'FIPS 140-3 Validated',
        'LIMS Ledger Sync': 'OK',
      },
      cfslExaminerName: leadScientist,
      examinerSignatureDigest: certHash,
    };

    const newDispatch: NFSUCrimeSceneDispatchRecord = {
      id: dispatchId,
      caseId: caseItem.id,
      caseNumber: caseItem.caseNumber,
      mandatorySec176Compliance: true,
      offenseSeverityYears: 10,
      mobileForensicVanId: `NFSU-MOBILE-VAN-REGIONAL-0${Math.floor(1 + Math.random() * 9)}`,
      leadForensicScientist: leadScientist,
      dispatchTimestamp: new Date(Date.now() - 1800000).toISOString(),
      sceneArrivalTimestamp: new Date().toISOString(),
      gpsCoordinates: { lat: 28.6139, lng: 77.209 },
      samplesCollected: [newSample],
      fslRefNumber: `CFSL-REG-${new Date().getFullYear()}-EVD-${Math.floor(1000 + Math.random() * 9000)}`,
      laboratoryAssigned: 'National Forensic Sciences University (NFSU) / CFSL Hub',
      sec176FormalReportSummary: `Crime scene examined on-spot by certified forensic scientist in compliance with Section 176(3) BNSS 2023. Video documentation and physical samples sealed in presence of Panch witnesses.`,
      reportCertificateHash: certHash,
    };

    this.nfsuDispatches.unshift(newDispatch);
    this.saveToStorage();
    return newDispatch;
  }

  // ==========================================
  // CHAPTER VIII BNSS: PREVENTIVE PEACE BONDS (SEC 125-135)
  // ==========================================

  getPeaceBonds(): PreventivePeaceBondRecord[] {
    return this.peaceBonds;
  }

  async createPreventivePeaceBond(
    respondentName: string,
    aliases: string[],
    age: number,
    address: string,
    policeStation: string,
    district: string,
    bnssSection: PreventivePeaceBondRecord['bnssSection'],
    threatDescription: string,
    bondAmount: number,
    periodMonths: number,
    suretiesCount: number,
    magistrateName: string,
    geoFenceKm: number
  ): Promise<PreventivePeaceBondRecord> {
    const bondId = `PB-${new Date().getFullYear()}-${district.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderHash = await computeSHA256(bondId + respondentName + threatDescription);

    const newRecord: PreventivePeaceBondRecord = {
      id: bondId,
      caseNumber: `BNSS-${bnssSection.replace(/[^0-9]/g, '')}-${district.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      respondentName,
      aliasList: aliases,
      age,
      address,
      policeStation,
      jurisdictionDistrict: district,
      bnssSection,
      threatDescription,
      showCauseNoticeRef: `EM/${district.slice(0, 3).toUpperCase()}/SEC130/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      showCauseNoticeIssuedDate: new Date().toISOString(),
      inquiryStatus: 'SHOW_CAUSE_SERVED',
      bondAmountRupees: bondAmount,
      bondPeriodMonths: periodMonths,
      suretiesRequiredCount: suretiesCount,
      suretiesVerifiedCount: 0,
      executiveMagistrateName: magistrateName,
      geoFencedRadiusKm: geoFenceKm,
      mandatoryReportingSchedule: `Weekly Reporting at ${policeStation}`,
      digitalOrderSha256: orderHash,
    };

    this.peaceBonds.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }

  // ==========================================
  // SECTION 398 BNSS: WITNESS PROTECTION SCHEME
  // ==========================================

  getWitnessProfiles(): WitnessProtectionProfile[] {
    return this.witnessProfiles;
  }

  async enrollWitnessInProtectionScheme(
    caseItem: CaseFile,
    originalName: string,
    pseudonym: string,
    threatCategory: WitnessProtectionProfile['threatCategory'],
    threatScore: number,
    threatSummary: string,
    measures: WitnessProtectionProfile['protectionMeasuresSanctioned'],
    judgeName: string
  ): Promise<WitnessProtectionProfile> {
    const wpId = `WP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const sealHash = await computeSHA256(wpId + originalName + pseudonym);

    const newProfile: WitnessProtectionProfile = {
      id: wpId,
      caseId: caseItem.id,
      caseNumber: caseItem.caseNumber,
      witnessOriginalName: originalName,
      witnessAssignedPseudonym: pseudonym,
      threatCategory,
      threatAssessmentScore: threatScore,
      assessingOfficer: 'Superintendent of Police (Witness Protection Cell)',
      threatSummary,
      protectionMeasuresSanctioned: measures,
      assignedSafeHouseCode: measures.includes('SAFE_HOUSE_RELOCATION')
        ? `SAFE-HOUSE-SECRET-${Math.floor(10 + Math.random() * 90)}`
        : undefined,
      escortTeamLead: 'Inspector SPU Lead Officer',
      threatIncidentsLogged: [
        {
          timestamp: new Date().toISOString(),
          incidentType: 'Threat Assessment Enrollment Completed',
          sourceOrChannel: 'Official Witness Protection Board',
          actionTaken: 'Identity redacted across court dockets; electronic pseudonym active.',
        },
      ],
      witnessProtectionOrderRef: `WPC/SEC398/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      orderPassedByJudge: judgeName,
      orderDate: new Date().toISOString(),
      encryptedIdentitySealHash: sealHash,
    };

    this.witnessProfiles.unshift(newProfile);
    this.saveToStorage();
    return newProfile;
  }

  // ==========================================
  // SECTION 111-114 BNSS: MLAT & EXTRADITION DOSSIERS
  // ==========================================

  getMLATRecords(): MLATExtraditionRecord[] {
    return this.mlatRecords;
  }

  async generateMLATRequest(
    caseItem: CaseFile,
    fugitiveName: string,
    nationality: string,
    countryTarget: string,
    foreignCourt: string,
    requestType: MLATExtraditionRecord['requestType'],
    treaty: MLATExtraditionRecord['treatyFramework'],
    dualCriminology: string,
    leadOfficer: string
  ): Promise<MLATExtraditionRecord> {
    const mlatId = `MLAT-${new Date().getFullYear()}-IND-${countryTarget.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const dossierHash = await computeSHA256(mlatId + fugitiveName + countryTarget);

    const newRecord: MLATExtraditionRecord = {
      id: mlatId,
      caseId: caseItem.id,
      caseNumber: caseItem.caseNumber,
      fugitiveOrSubjectName: fugitiveName,
      subjectNationality: nationality,
      foreignCountryTarget: countryTarget,
      foreignJudicialAuthority: foreignCourt,
      requestType,
      treatyFramework: treaty,
      meaClearanceRef: `MEA/EXTRAD/${new Date().getFullYear()}/${countryTarget.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      mhaNodalApprovalDate: new Date().toISOString(),
      offenseBriefDualCriminology: dualCriminology,
      transferredEvidenceHashes: caseItem.documents.map((d) => d.sha256Hash),
      diplomaticStatus: 'DRAFT_FORMULATION',
      leadMEAOfficer: leadOfficer,
      digitalDossierHash: dossierHash,
    };

    this.mlatRecords.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }
}

export const phase9Service = new Phase9Service();
