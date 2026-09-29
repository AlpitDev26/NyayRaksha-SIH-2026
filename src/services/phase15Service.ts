import {
  AcousticVoiceBiometricRecord,
  CounterTerrorDroneIncursionRecord,
  DigitalBailBondSuretyRecord,
  SupremeCourtFullCourtBenchRecord,
} from '../types';
import { computeSHA256 } from './cryptoEngine';

// Initial Voice & Acoustic Biometric Records
const INITIAL_VOICE_RECORDS: AcousticVoiceBiometricRecord[] = [
  {
    sampleId: 'VOICE-AC-2026-EXT-001',
    caseNumberRef: 'DL-01-2026-CR-0041',
    suspectNameOrAlias: 'Rameshwar @ Don Bhai (Extortion Threat Audio)',
    audioSourceType: 'WIRETAP_EXTORTION_RECORDING',
    durationSeconds: 48,
    acousticMetrics: {
      fundamentalFrequencyF0Hz: 124.5,
      formantF1Hz: 520,
      formantF2Hz: 1580,
      formantF3Hz: 2490,
      jitterPercent: 0.42,
      shimmerPercent: 1.15,
    },
    syntheticAiDetection: 'GENUINE_HUMAN_VOICE',
    likelihoodRatioMatchPercentage: 99.4,
    spectrogramMfccSha256: '889900aabbccddeeff0011223344556677889900aabbccddeeff001122334455',
    chiefAcousticForensicOfficer: 'Dr. Sandeep K. Malhotra (Director, Forensic Acoustics Lab, NFSU Delhi)',
    evidentiaryCertificateBSA63Sha256: '11223344556677889900aabbccddeeff0011223344556677889900aabbccddeeff',
  },
];

// Initial Counter-Terror Drone Incursion Records (UAV Rules 2021 / UAPA 1967)
const INITIAL_DRONE_RECORDS: CounterTerrorDroneIncursionRecord[] = [
  {
    droneIncidentId: 'DRONE-UAPA-2026-SECTOR-09',
    sectorName: 'Punjab International Border - Gurdaspur Forward Outpost',
    gpsCoordinates: { latitude: 32.0418, longitude: 75.4052 },
    interceptionTimestamp: '2026-01-27T03:40:00Z',
    droneType: 'HEXACOPTER_CUSTOM_HEAVY_LIFT',
    neutralizationMethod: 'SOFT_KILL_RF_JAMMING',
    payloadRecovered: '4 kg High-Grade Afghan Heroin, 2 Glock 9mm Automatic Pistols, 50 rounds, Magnetic Dropper Mechanism',
    payloadEstimatedValueRupees: 28000000, // ₹2.8 Crores
    firmwareTelemetryExtracted: {
      flightLogWaypointsCount: 34,
      launchOriginCoordinates: '31.9810° N, 74.8912° E (Cross-Border Launch Point)',
      targetDropZoneCoordinates: '32.0415° N, 75.4048° E (Agricultural Farm Depot)',
      flightControllerSerial: 'PIXHAWK-ARM-2026-HEXA-9941',
    },
    specialUAPACourtRef: 'NIA-UAPA-SPECIAL-MOHALI-2026-011',
    uapaEvidenceSha256: '44556677889900aabbccddeeff0011223344556677889900aabbccddeeff001122',
  },
];

// Initial Digital Bail Bond & Surety Smart Records (Sec 479 & 480 BNSS)
const INITIAL_BAILBOND_RECORDS: DigitalBailBondSuretyRecord[] = [
  {
    bailBondId: 'EBAIL-BOND-2026-DEL-044',
    inmateIdRef: 'INM-TIHAR-2026-081',
    inmateName: 'Vipin K. Saxena',
    caseNumberRef: 'DL-01-2026-CR-0041',
    bailAmountRupees: 50000,
    suretyDetails: {
      suretyName: 'Harish Chandra Saxena (Father)',
      aadhaarMasked: 'XXXXXXXX8891',
      relationshipWithAccused: 'Father & Permanent Resident',
      solvencyVerificationType: 'LAND_REVENUE_RECORD_DIGILOCKER',
      solvencyVerifiedAmountRupees: 2500000,
    },
    sec491BNSSForfeitureLiabilityRisk: 'LOW_RISK_FIRST_TIME',
    icjsPrisonReleaseDispatchTimestamp: '2026-01-27T11:15:00Z',
    releaseDispatchStatus: 'INMATE_RELEASED_CUSTODY',
    digitalBailBondQrSealSha256: '990011223344556677889900aabbccddeeff0011223344556677889900aabbccdd',
  },
];

// Initial Supreme Court Full Court & Constitutional Bench Records (Art 141 / 142)
const INITIAL_SC_BENCH_RECORDS: SupremeCourtFullCourtBenchRecord[] = [
  {
    benchReferenceId: 'SC-CONST-BENCH-2026-001',
    benchStrength: '7_JUDGE_LARGER_BENCH',
    caseTitle: 'In Re: Inviolability of End-to-End Encrypted Digital Evidence & Sovereign Trial Safeguards',
    constitutionalArticlesInvolved: ['Article 14', 'Article 21', 'Article 141', 'Article 142', 'Article 32'],
    presidingChiefJustice: 'Hon. Chief Justice of India',
    coramJudges: [
      'Hon. Chief Justice of India',
      'Hon. Justice Senior Puisne Judge I',
      'Hon. Justice Senior Puisne Judge II',
      'Hon. Justice Senior Puisne Judge III',
      'Hon. Justice Senior Puisne Judge IV',
      'Hon. Justice Senior Puisne Judge V',
      'Hon. Justice Senior Puisne Judge VI',
    ],
    ratioDecidendiLawSummary:
      'The Larger Bench held that electronic records sealed with FIPS 140-3 HSM Root Keys and Section 63 BSA 2023 certificates carry an irrebuttable presumption of integrity under Section 63 BSA, binding upon all High Courts and subordinate tribunals pan-India under Article 141.',
    article142CompleteJusticeDirective:
      'In exercise of extraordinary powers under Article 142 to do complete justice, the Court directed all State Police forces and Central Agencies to mandate 100% video-recorded search and seizure (Sec 105 BNSS) and digital bail transmission via ICJS 2.0 within 60 minutes of judicial sanction.',
    unanimousOrMajorityDecision: 'UNANIMOUS_CONCURRENCE',
    bindingPrecedentStatus: 'LAW_OF_THE_LAND_ART_141',
    judgmentDate: '2026-01-25T14:00:00Z',
    pqcPostQuantumRootSealSha256: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  },
];

class Phase15Service {
  private voiceRecords: AcousticVoiceBiometricRecord[] = [...INITIAL_VOICE_RECORDS];
  private droneRecords: CounterTerrorDroneIncursionRecord[] = [...INITIAL_DRONE_RECORDS];
  private bailBondRecords: DigitalBailBondSuretyRecord[] = [...INITIAL_BAILBOND_RECORDS];
  private scBenchRecords: SupremeCourtFullCourtBenchRecord[] = [...INITIAL_SC_BENCH_RECORDS];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedV = localStorage.getItem('nsdj_phase15_voice');
      if (savedV) this.voiceRecords = JSON.parse(savedV);

      const savedD = localStorage.getItem('nsdj_phase15_drone');
      if (savedD) this.droneRecords = JSON.parse(savedD);

      const savedB = localStorage.getItem('nsdj_phase15_bailbond');
      if (savedB) this.bailBondRecords = JSON.parse(savedB);

      const savedSC = localStorage.getItem('nsdj_phase15_scbench');
      if (savedSC) this.scBenchRecords = JSON.parse(savedSC);
    } catch {
      // Storage fallback
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('nsdj_phase15_voice', JSON.stringify(this.voiceRecords));
      localStorage.setItem('nsdj_phase15_drone', JSON.stringify(this.droneRecords));
      localStorage.setItem('nsdj_phase15_bailbond', JSON.stringify(this.bailBondRecords));
      localStorage.setItem('nsdj_phase15_scbench', JSON.stringify(this.scBenchRecords));
    } catch {
      // Storage ignore
    }
  }

  // --- Voice Biometrics ---
  getVoiceRecords(): AcousticVoiceBiometricRecord[] {
    return [...this.voiceRecords];
  }

  async createVoiceRecord(
    data: Omit<AcousticVoiceBiometricRecord, 'sampleId' | 'spectrogramMfccSha256' | 'evidentiaryCertificateBSA63Sha256'>
  ): Promise<AcousticVoiceBiometricRecord> {
    const raw = `${data.suspectNameOrAlias}|${data.audioSourceType}|${Date.now()}`;
    const hash = await computeSHA256(raw);

    const newRecord: AcousticVoiceBiometricRecord = {
      ...data,
      sampleId: `VOICE-AC-2026-${Date.now().toString().slice(-4)}`,
      spectrogramMfccSha256: hash,
      evidentiaryCertificateBSA63Sha256: hash,
    };

    this.voiceRecords.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }

  // --- Drone Incursion ---
  getDroneRecords(): CounterTerrorDroneIncursionRecord[] {
    return [...this.droneRecords];
  }

  async createDroneRecord(
    data: Omit<CounterTerrorDroneIncursionRecord, 'droneIncidentId' | 'uapaEvidenceSha256'>
  ): Promise<CounterTerrorDroneIncursionRecord> {
    const raw = `${data.sectorName}|${data.payloadRecovered}|${Date.now()}`;
    const hash = await computeSHA256(raw);

    const newRecord: CounterTerrorDroneIncursionRecord = {
      ...data,
      droneIncidentId: `DRONE-UAPA-2026-${Date.now().toString().slice(-4)}`,
      uapaEvidenceSha256: hash,
    };

    this.droneRecords.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }

  // --- Digital Bail Bond ---
  getBailBondRecords(): DigitalBailBondSuretyRecord[] {
    return [...this.bailBondRecords];
  }

  async createBailBondRecord(
    data: Omit<DigitalBailBondSuretyRecord, 'bailBondId' | 'digitalBailBondQrSealSha256' | 'icjsPrisonReleaseDispatchTimestamp'>
  ): Promise<DigitalBailBondSuretyRecord> {
    const timestamp = new Date().toISOString();
    const raw = `${data.inmateName}|${data.bailAmountRupees}|${timestamp}`;
    const hash = await computeSHA256(raw);

    const newRecord: DigitalBailBondSuretyRecord = {
      ...data,
      bailBondId: `EBAIL-BOND-2026-${Date.now().toString().slice(-4)}`,
      icjsPrisonReleaseDispatchTimestamp: timestamp,
      digitalBailBondQrSealSha256: hash,
    };

    this.bailBondRecords.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }

  // --- Supreme Court Full Court ---
  getSCBenchRecords(): SupremeCourtFullCourtBenchRecord[] {
    return [...this.scBenchRecords];
  }

  async createSCBenchRecord(
    data: Omit<SupremeCourtFullCourtBenchRecord, 'benchReferenceId' | 'pqcPostQuantumRootSealSha256' | 'judgmentDate'>
  ): Promise<SupremeCourtFullCourtBenchRecord> {
    const judgmentDate = new Date().toISOString();
    const raw = `${data.caseTitle}|${data.benchStrength}|${judgmentDate}`;
    const hash = await computeSHA256(raw);

    const newRecord: SupremeCourtFullCourtBenchRecord = {
      ...data,
      benchReferenceId: `SC-CONST-BENCH-2026-${Date.now().toString().slice(-3)}`,
      judgmentDate,
      pqcPostQuantumRootSealSha256: hash,
    };

    this.scBenchRecords.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }
}

export const phase15Service = new Phase15Service();
