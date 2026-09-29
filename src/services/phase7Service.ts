import {
  CourtroomHearingSession,
  SyntheticMediaForensicAnalysis,
  BFTConsensusNode,
  ConsensusRoundEvent,
  DisasterRecoverySnapshot,
  BailReckonerProfile,
  DigitalSignature,
} from '../types';

function createDeterministicHex(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return (hex + '8f1b67cb992e564d23812239e24b7a692138cd916c8022100e47823901b8a94bf821e25d481239c0fa88921be554e21184a7781022100d81029e8401f').slice(0, 64);
}

const INITIAL_COURTROOM_SESSIONS: CourtroomHearingSession[] = [
  {
    id: 'SESS-2026-DL-001',
    caseId: 'CASE-2026-DL-001',
    caseNumber: 'FIR/2026/DL/00482',
    courtName: 'Court of Chief Metropolitan Magistrate, Patiala House, New Delhi',
    presidingJudge: 'Hon. Sh. Rajeshwar Nath (DHJS)',
    publicProsecutor: 'Adv. S. K. Mahapatra (Sr. Spl. PP, CBI/Cyber)',
    defenseCounsel: 'Adv. Meenakshi Sundaram (Bar Council of Delhi)',
    accusedName: 'Vikramaditya Roy alias Vicky Tech',
    accusedLocation: 'Tihar Central Jail #4 - High Security VC Room 2',
    witnessName: 'Dr. Anandita Sen (Chief Forensic Cyber Analyst, CFSL)',
    sessionStatus: 'IN_SESSION',
    startTime: '2026-09-27T10:30:00Z',
    witnessOathRecorded: true,
    activeOrderDraft:
      'The Court has perused the Forensic Extraction Certificate under Section 63 of Bharatiya Sakshya Adhiniyam, 2023. Learned PP has marked the Ledger Block Digest as Exhibit P-14. Defense objection regarding device seizure hash continuity is OVERRULED in light of cryptographic chain of custody. Matter listed for recording of defense evidence.',
    ePrisonsBiometricCheck: {
      accusedUid: 'PRIS-TIHAR-2026-8819',
      prisonName: 'Tihar Central Jail #4',
      biometricMatchScore: 99.4,
      verifiedAt: '2026-09-27T10:28:15Z',
      wardenSignature: 'DIG-PRIS-DEL-8821',
      status: 'VERIFIED',
    },
    presentedExhibits: [
      {
        id: 'EXH-001',
        evidenceCode: 'EVD-2026-DL-001',
        title: 'Seized NVMe SSD (Encrypted Cold Wallet Logs)',
        submittedBy: 'Public Prosecutor',
        admittedStatus: 'ADMITTED_FORMALLY',
        bsaCertificateVerified: true,
        courtExhibitNumber: 'Ex. P-14',
        judicialAnnotation: 'Admitted with CFSL digital signature. Hash integrity verified on sovereign ledger.',
        sha256Digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        endorsementSignature: {
          signerName: 'Hon. Rajeshwar Nath',
          signerRole: 'judicial_magistrate',
          signerDesignation: 'Chief Metropolitan Magistrate',
          organization: 'Patiala House District Courts, New Delhi',
          certificateId: 'JUD-DEL-CMM-2026-004',
          signatureAlgorithm: 'SHA256withECDSA',
          signatureHex: '30450221008f1b67cb992e564d23812239e24b7a692138cd916c8022100e47823901b8',
          timestamp: '2026-09-27T11:05:00Z',
          publicKeyFingerprint: 'A4:99:C2:55:18:FF:90:3A',
          isValid: true,
        },
      },
      {
        id: 'EXH-002',
        evidenceCode: 'EVD-2026-DL-004',
        title: 'Extortion Voice Memo (Suspected Deepfake Audio)',
        submittedBy: 'Defense Counsel',
        admittedStatus: 'UNDER_SECTION_63_VERIFICATION',
        bsaCertificateVerified: false,
        courtExhibitNumber: 'Ex. D-03 (Provisional)',
        judicialAnnotation: 'Referred to CFSL Deepfake & Audio Forensics Lab for spectral jitter validation under Sec 63 BSA.',
        sha256Digest: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      },
    ],
    stenographyLog: [
      {
        id: 'STENO-01',
        timestamp: '10:30:12',
        speaker: 'Presiding Judge',
        speakerRole: 'JUDGE',
        text: 'Court is in session. Matter of State (NCT of Delhi) vs Vikramaditya Roy. Case FIR No. 482/2026 under Sections 318(4), 316(2) BNS and Section 66D IT Act.',
        citations: ['BNS Sec 318(4)', 'BNS Sec 316(2)', 'IT Act Sec 66D'],
      },
      {
        id: 'STENO-02',
        timestamp: '10:31:05',
        speaker: 'Stenographer',
        speakerRole: 'STENOGRAPHER',
        text: 'Accused produced through encrypted e-Prisons WebRTC link from Tihar Jail #4. Biometric match score 99.4% confirmed by Jail Superintendent.',
      },
      {
        id: 'STENO-03',
        timestamp: '10:32:40',
        speaker: 'Public Prosecutor',
        speakerRole: 'PROSECUTOR',
        text: 'Your Honour, the prosecution tenders into evidence the cryptographic extraction logs from the seized hardware wallet. Section 63 BSA 2023 certificate has been digitally signed by Examiner Dr. Anandita Sen.',
        citations: ['BSA 2023 Sec 63', 'BNSS 2023 Sec 530'],
        isMarkedExhibit: true,
      },
      {
        id: 'STENO-04',
        timestamp: '10:34:15',
        speaker: 'Defense Counsel',
        speakerRole: 'DEFENSE',
        text: 'We object under Section 63(4) BSA! The hash continuity from the point of seizure at Connaught Place to the CFSL terminal was interrupted for 14 minutes during transit.',
        objectionType: 'SECTION_63_BSA_AUTHENTICITY',
        objectionRuling: 'OVERRULED',
        citations: ['BSA 2023 Sec 63(4)'],
      },
      {
        id: 'STENO-05',
        timestamp: '10:36:20',
        speaker: 'Presiding Judge',
        speakerRole: 'JUDGE',
        text: 'Objection Overruled. The Sovereign Ledger Blockchain Explorer verifies immutable tamper-proof handover at Block #14092 with GPS telemetry and dual PKI signatures. Exhibit P-14 formally admitted.',
      },
      {
        id: 'STENO-06',
        timestamp: '10:38:50',
        speaker: 'Witness (Dr. Sen)',
        speakerRole: 'WITNESS',
        text: 'I solemnly affirm under Section 4 Oaths Act that the spectral FFT frequency graph matches authentic voice biometrics, whereas Exhibit D-03 exhibits 88.7% synthetic neural voice cloning artifacts.',
        citations: ['Oaths Act Sec 4', 'BSA Sec 63'],
      },
    ],
  },
];

const INITIAL_SYNTHETIC_MEDIA_ANALYSES: SyntheticMediaForensicAnalysis[] = [
  {
    id: 'SMFA-2026-001',
    caseId: 'CASE-2026-DL-001',
    evidenceCode: 'EVD-2026-DL-004',
    mediaType: 'AUDIO',
    fileName: 'intercept_wiretap_extortion_call_04.wav',
    sha256Hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    manipulationVerdict: 'CONFIRMED_DEEPFAKE_SYNTHETIC',
    overallAuthenticityScore: 11.3,
    deepfakeProbability: 88.7,
    spectralAnomalyScore: 92.4,
    voiceBiometricJitterScore: 84.1,
    c2paProvenanceVerified: false,
    exifMetadataConsistency: 'SYNTHETIC_GENERATOR_TAG',
    detectedTooltags: ['ElevenLabs-v2-Synthesizer', 'RVC-Pitch-Shift-Engine', 'HiFi-GAN-Vocoder'],
    frequencySpectrumFftData: [12, 45, 88, 92, 95, 78, 89, 94, 91, 85, 76, 62, 44, 21],
    bsa63CertificateDigest: 'BSA63-CERT-CFSL-2026-SYNTH-882194',
    certifiedTimestamp: '2026-09-27T09:15:00Z',
    frameAnomalies: [
      {
        frameNumber: 142,
        timestampSec: 4.73,
        anomalyType: 'Unnatural formant phase continuity (phase discontinuity at 3400Hz)',
        confidence: 0.94,
      },
      {
        frameNumber: 288,
        timestampSec: 9.6,
        anomalyType: 'Lack of glottal pulse sub-harmonic jitter (robotic baseline)',
        confidence: 0.91,
      },
      {
        frameNumber: 412,
        timestampSec: 13.73,
        anomalyType: 'Generative vocoder background silent noise floor floor-clipping',
        confidence: 0.89,
      },
    ],
    examinerSignOff: {
      signerName: 'Dr. Anandita Sen',
      signerRole: 'forensic_examiner',
      signerDesignation: 'Senior Scientific Officer (Cyber/Audio)',
      organization: 'Central Forensic Science Laboratory (CFSL), New Delhi',
      certificateId: 'FSL-DL-2026-PKI-992',
      signatureAlgorithm: 'SHA256withECDSA',
      signatureHex: '3046022100a94bf821e25d481239c0fa88921be554e21184a7781022100d81029e8401f',
      timestamp: '2026-09-27T09:20:00Z',
      publicKeyFingerprint: 'F4:88:91:AC:33:EE:90:21',
      isValid: true,
    },
  },
  {
    id: 'SMFA-2026-002',
    caseId: 'CASE-2026-MH-002',
    evidenceCode: 'EVD-2026-MH-009',
    mediaType: 'VIDEO',
    fileName: 'cctv_bkc_atm_vault_feed_cam3.mp4',
    sha256Hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    manipulationVerdict: 'PROBABLE_MANIPULATION',
    overallAuthenticityScore: 42.0,
    deepfakeProbability: 68.5,
    spectralAnomalyScore: 71.2,
    frameArtifactsCount: 14,
    c2paProvenanceVerified: false,
    exifMetadataConsistency: 'TAMPERED',
    detectedTooltags: ['DeepFaceLab-2.0', 'Roop-FaceSwap-Plugin'],
    frequencySpectrumFftData: [30, 40, 65, 72, 68, 59, 81, 74, 60, 52, 45, 38, 25, 18],
    bsa63CertificateDigest: 'BSA63-CERT-CFSL-2026-VIDEO-440192',
    certifiedTimestamp: '2026-09-27T08:45:00Z',
    frameAnomalies: [
      {
        frameNumber: 74,
        timestampSec: 2.46,
        anomalyType: 'Face boundary boundary blending warp artifact',
        confidence: 0.88,
        visualBox: [120, 80, 240, 260],
      },
      {
        frameNumber: 105,
        timestampSec: 3.5,
        anomalyType: 'Eye blink corneal reflection lighting mismatch',
        confidence: 0.92,
        visualBox: [140, 110, 210, 170],
      },
    ],
    examinerSignOff: {
      signerName: 'K. V. Ramanathan',
      signerRole: 'forensic_examiner',
      signerDesignation: 'Director of Video Forensics',
      organization: 'Maharashtra State Forensic Science Laboratory, Kalina',
      certificateId: 'FSL-MH-2026-VID-104',
      signatureAlgorithm: 'SHA256withECDSA',
      signatureHex: '304402207b1401f8931a298cb339191e488102a01f010220671849102c91823049182',
      timestamp: '2026-09-27T08:50:00Z',
      publicKeyFingerprint: 'C1:33:99:A2:55:FF:01:88',
      isValid: true,
    },
  },
  {
    id: 'SMFA-2026-003',
    caseId: 'CASE-2026-KA-003',
    evidenceCode: 'EVD-2026-KA-007',
    mediaType: 'IMAGE',
    fileName: 'bodycam_arrest_instant_capture.png',
    sha256Hash: '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca7',
    manipulationVerdict: 'AUTHENTIC_PRISTINE',
    overallAuthenticityScore: 98.6,
    deepfakeProbability: 1.4,
    spectralAnomalyScore: 2.1,
    frameArtifactsCount: 0,
    c2paProvenanceVerified: true,
    exifMetadataConsistency: 'CONSISTENT',
    detectedTooltags: ['Axon-Body4-Hardware-Enclave', 'C2PA-Hardware-Signing'],
    frequencySpectrumFftData: [95, 96, 94, 98, 97, 95, 96, 99, 97, 98, 96, 95, 94, 93],
    bsa63CertificateDigest: 'BSA63-CERT-FSL-KA-2026-AUTH-001284',
    certifiedTimestamp: '2026-09-27T07:30:00Z',
    frameAnomalies: [],
    examinerSignOff: {
      signerName: 'Dr. Anandita Sen',
      signerRole: 'forensic_examiner',
      signerDesignation: 'Senior Scientific Officer',
      organization: 'Central Forensic Science Laboratory (CFSL)',
      certificateId: 'FSL-DL-2026-PKI-992',
      signatureAlgorithm: 'SHA256withECDSA',
      signatureHex: '30450221009182736452019283746501928374650192837465022019283746501928374',
      timestamp: '2026-09-27T07:35:00Z',
      publicKeyFingerprint: 'F4:88:91:AC:33:EE:90:21',
      isValid: true,
    },
  },
];

const INITIAL_BFT_NODES: BFTConsensusNode[] = [
  {
    nodeId: 'NODE-01-DEL',
    nodeName: 'National Tier-IV Master SDC (Delhi)',
    stateCenter: 'DELHI_NATIONAL_SDC',
    ipAddress: '10.200.1.10',
    role: 'PROPOSER',
    status: 'SYNCED_HEALTHY',
    blockHeight: 14092,
    latencyMs: 4,
    lastHeartbeat: '2026-09-27T11:45:02Z',
    stakeOrWeight: 30,
    peerCount: 4,
    signatureCount: 4210,
  },
  {
    nodeId: 'NODE-02-MUM',
    nodeName: 'Western Sovereign SDC (Mumbai BKC)',
    stateCenter: 'MUMBAI_WEST_SDC',
    ipAddress: '10.200.2.10',
    role: 'VALIDATOR',
    status: 'SYNCED_HEALTHY',
    blockHeight: 14092,
    latencyMs: 12,
    lastHeartbeat: '2026-09-27T11:45:01Z',
    stakeOrWeight: 20,
    peerCount: 4,
    signatureCount: 3980,
  },
  {
    nodeId: 'NODE-03-BLR',
    nodeName: 'Southern High-Compute SDC (Bengaluru CID)',
    stateCenter: 'BENGALURU_SOUTH_SDC',
    ipAddress: '10.200.3.10',
    role: 'VALIDATOR',
    status: 'SYNCED_HEALTHY',
    blockHeight: 14092,
    latencyMs: 16,
    lastHeartbeat: '2026-09-27T11:45:00Z',
    stakeOrWeight: 20,
    peerCount: 4,
    signatureCount: 4102,
  },
  {
    nodeId: 'NODE-04-HYD',
    nodeName: 'Central High-Security SDC (Hyderabad Cyberabad)',
    stateCenter: 'HYDERABAD_CENTRAL_SDC',
    ipAddress: '10.200.4.10',
    role: 'VALIDATOR',
    status: 'SYNCED_HEALTHY',
    blockHeight: 14092,
    latencyMs: 14,
    lastHeartbeat: '2026-09-27T11:45:01Z',
    stakeOrWeight: 15,
    peerCount: 4,
    signatureCount: 3850,
  },
  {
    nodeId: 'NODE-05-KOL',
    nodeName: 'Eastern Disaster Recovery SDC (Kolkata Salt Lake)',
    stateCenter: 'KOLKATA_EAST_SDC',
    ipAddress: '10.200.5.10',
    role: 'BACKUP_WITNESS',
    status: 'SYNCED_HEALTHY',
    blockHeight: 14092,
    latencyMs: 22,
    lastHeartbeat: '2026-09-27T11:44:59Z',
    stakeOrWeight: 15,
    peerCount: 4,
    signatureCount: 3790,
  },
];

const INITIAL_BAIL_RECKONER_PROFILES: BailReckonerProfile[] = [
  {
    caseId: 'CASE-2026-DL-001',
    caseNumber: 'FIR/2026/DL/00482',
    accusedName: 'Vikramaditya Roy',
    accusedAge: 32,
    prisonId: 'PRIS-TIHAR-2026-8819',
    cellBlock: 'Ward 4B / Cell 12',
    isFirstTimeOffender: true, // Under Sec 479 BNSS, eligible for default release on completing 1/3rd of max penalty
    maximumImprisonmentMonths: 84, // 7 years under Sec 318(4) BNS
    statutoryLibertyThresholdMonths: 28, // 1/3rd of 84 months = 28 months
    currentDetentionDays: 142,
    currentDetentionMonths: 4.7,
    libertyEntitlementStatus: 'UNDER_SCRUTINY',
    offensesList: [
      { section: 'Sec 318(4) BNS', act: 'BNS', maxPenaltyYears: 7, isBailable: false },
      { section: 'Sec 316(2) BNS', act: 'BNS', maxPenaltyYears: 5, isBailable: false },
      { section: 'Sec 66D IT Act', act: 'BNS', maxPenaltyYears: 3, isBailable: true },
    ],
    suretyRequirement: {
      amountRupees: 100000,
      suretiesRequired: 2,
      suretiesVerified: 2,
      localSuretyVerified: true,
    },
    eBailReleaseBondGenerated: false,
    judicialApprovalStatus: 'PENDING_VERIFICATION',
  },
  {
    caseId: 'CASE-2026-PB-004',
    caseNumber: 'FIR/2026/PB/00109',
    accusedName: 'Gurpreet Singh alias Gopi',
    accusedAge: 26,
    prisonId: 'PRIS-AMR-2026-1022',
    cellBlock: 'High Security Cell 8',
    isFirstTimeOffender: true,
    maximumImprisonmentMonths: 36, // 3 years for transport accomplice
    statutoryLibertyThresholdMonths: 12, // 1/3rd of 36 months = 12 months (365 days)
    currentDetentionDays: 372, // Exceeded 12 months!
    currentDetentionMonths: 12.4,
    libertyEntitlementStatus: 'ENTITLED_IMMEDIATE_BAIL', // Statutory mandatory release under Sec 479(1) BNSS
    offensesList: [
      { section: 'Sec 111(2) BNS', act: 'BNS', maxPenaltyYears: 3, isBailable: false },
    ],
    suretyRequirement: {
      amountRupees: 50000,
      suretiesRequired: 1,
      suretiesVerified: 1,
      localSuretyVerified: true,
    },
    eBailReleaseBondGenerated: true,
    icjsDispatchTimestamp: '2026-09-27T08:30:00Z',
    judicialApprovalStatus: 'GRANTED_E_BAIL',
  },
  {
    caseId: 'CASE-2026-MH-002',
    caseNumber: 'FIR/2026/MH/01192',
    accusedName: 'Rajan Shinde',
    accusedAge: 44,
    prisonId: 'PRIS-ARTHUR-2026-4401',
    cellBlock: 'Barrack 10',
    isFirstTimeOffender: false, // Habitual offender (1/2nd max rule applies)
    maximumImprisonmentMonths: 120, // 10 years
    statutoryLibertyThresholdMonths: 60, // 1/2 of 10 years = 5 years (60 months)
    currentDetentionDays: 420,
    currentDetentionMonths: 14.0,
    libertyEntitlementStatus: 'UNDER_SCRUTINY',
    offensesList: [
      { section: 'Sec 318(4) BNS', act: 'BNS', maxPenaltyYears: 7, isBailable: false },
      { section: 'Sec 338 BNS (Forgery)', act: 'BNS', maxPenaltyYears: 10, isBailable: false },
    ],
    suretyRequirement: {
      amountRupees: 250000,
      suretiesRequired: 2,
      suretiesVerified: 1,
      localSuretyVerified: true,
    },
    eBailReleaseBondGenerated: false,
    judicialApprovalStatus: 'SURETY_AWAITING',
  },
];

class Phase7Service {
  private sessions: CourtroomHearingSession[] = INITIAL_COURTROOM_SESSIONS;
  private deepfakeAnalyses: SyntheticMediaForensicAnalysis[] = INITIAL_SYNTHETIC_MEDIA_ANALYSES;
  private bftNodes: BFTConsensusNode[] = INITIAL_BFT_NODES;
  private bailProfiles: BailReckonerProfile[] = INITIAL_BAIL_RECKONER_PROFILES;
  private roundCounter = 48201;

  // -------------------------------------------------------------
  // Virtual Courtroom
  // -------------------------------------------------------------
  getCourtroomSessions(): CourtroomHearingSession[] {
    return this.sessions;
  }

  addStenographyEntry(
    sessionId: string,
    entry: Omit<CourtroomHearingSession['stenographyLog'][0], 'id' | 'timestamp'>
  ): CourtroomHearingSession {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (!session) throw new Error('Session not found');

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEntry = {
      ...entry,
      id: `STENO-${Date.now()}`,
      timestamp: timeStr,
    };
    session.stenographyLog.push(newEntry);
    return { ...session };
  }

  admitExhibitWithJudgeEndorsement(
    sessionId: string,
    exhibitId: string,
    ruling: 'ADMITTED_FORMALLY' | 'REJECTED',
    annotation: string
  ): CourtroomHearingSession {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (!session) throw new Error('Session not found');

    const exh = session.presentedExhibits.find((e) => e.id === exhibitId);
    if (exh) {
      exh.admittedStatus = ruling;
      exh.judicialAnnotation = annotation;
      exh.endorsementSignature = {
        signerName: 'Hon. Rajeshwar Nath',
        signerRole: 'judicial_magistrate',
        signerDesignation: 'Chief Metropolitan Magistrate',
        organization: 'Patiala House District Courts, New Delhi',
        certificateId: 'JUD-DEL-CMM-2026-004',
        signatureAlgorithm: 'SHA256withECDSA',
        signatureHex: createDeterministicHex(
          `${exh.evidenceCode}:${ruling}:${annotation}`
        ),
        timestamp: new Date().toISOString(),
        publicKeyFingerprint: 'A4:99:C2:55:18:FF:90:3A',
        isValid: true,
      };
    }
    return { ...session };
  }

  updateRulingObjection(
    sessionId: string,
    stenoId: string,
    ruling: 'SUSTAINED' | 'OVERRULED'
  ): CourtroomHearingSession {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (!session) throw new Error('Session not found');
    const steno = session.stenographyLog.find((s) => s.id === stenoId);
    if (steno) {
      steno.objectionRuling = ruling;
    }
    return { ...session };
  }

  // -------------------------------------------------------------
  // Deepfake & Synthetic Media Forensics
  // -------------------------------------------------------------
  getDeepfakeAnalyses(): SyntheticMediaForensicAnalysis[] {
    return this.deepfakeAnalyses;
  }

  runNewSyntheticMediaDiagnostic(
    evidenceCode: string,
    mediaType: 'AUDIO' | 'VIDEO' | 'IMAGE' | 'DOCUMENT_SCAN',
    fileName: string,
    forceVerdict?: 'AUTHENTIC_PRISTINE' | 'CONFIRMED_DEEPFAKE_SYNTHETIC'
  ): SyntheticMediaForensicAnalysis {
    const isFake = forceVerdict ? forceVerdict === 'CONFIRMED_DEEPFAKE_SYNTHETIC' : Math.random() > 0.4;
    const authScore = isFake ? Math.floor(Math.random() * 25 + 5) : Math.floor(Math.random() * 15 + 85);
    const deepfakeProb = 100 - authScore;

    const analysis: SyntheticMediaForensicAnalysis = {
      id: `SMFA-2026-${Date.now().toString().slice(-4)}`,
      caseId: 'CASE-2026-DL-001',
      evidenceCode,
      mediaType,
      fileName,
      sha256Hash: createDeterministicHex(fileName).slice(0, 64),
      manipulationVerdict: isFake ? 'CONFIRMED_DEEPFAKE_SYNTHETIC' : 'AUTHENTIC_PRISTINE',
      overallAuthenticityScore: authScore,
      deepfakeProbability: deepfakeProb,
      spectralAnomalyScore: isFake ? 89.2 : 4.1,
      voiceBiometricJitterScore: mediaType === 'AUDIO' ? (isFake ? 91.0 : 6.2) : undefined,
      frameArtifactsCount: isFake ? (mediaType === 'VIDEO' ? 18 : 3) : 0,
      c2paProvenanceVerified: !isFake,
      exifMetadataConsistency: isFake ? 'SYNTHETIC_GENERATOR_TAG' : 'CONSISTENT',
      detectedTooltags: isFake ? ['Neural-Vocoder-Diffusion', 'DeepFace-Artifact-V2'] : ['Hardware-Secure-Enclave'],
      frequencySpectrumFftData: isFake
        ? [15, 30, 85, 92, 98, 87, 91, 95, 88, 82, 70, 55, 38, 20]
        : [95, 94, 96, 97, 95, 94, 98, 97, 96, 95, 96, 94, 95, 93],
      bsa63CertificateDigest: `BSA63-CERT-CFSL-2026-${Date.now().toString().slice(-6)}`,
      certifiedTimestamp: new Date().toISOString(),
      frameAnomalies: isFake
        ? [
            {
              frameNumber: 52,
              timestampSec: 1.73,
              anomalyType: 'Generative AI high-frequency spectral phase discontinuity',
              confidence: 0.93,
            },
            {
              frameNumber: 124,
              timestampSec: 4.13,
              anomalyType: 'Boundary edge blending artifact detected in facial region',
              confidence: 0.89,
            },
          ]
        : [],
      examinerSignOff: {
        signerName: 'Dr. Anandita Sen',
        signerRole: 'forensic_examiner',
        signerDesignation: 'Senior Scientific Officer (Cyber/Audio)',
        organization: 'Central Forensic Science Laboratory (CFSL), New Delhi',
        certificateId: 'FSL-DL-2026-PKI-992',
        signatureAlgorithm: 'SHA256withECDSA',
        signatureHex: createDeterministicHex(`${fileName}:${authScore}`),
        timestamp: new Date().toISOString(),
        publicKeyFingerprint: 'F4:88:91:AC:33:EE:90:21',
        isValid: true,
      },
    };

    this.deepfakeAnalyses.unshift(analysis);
    return analysis;
  }

  // -------------------------------------------------------------
  // Sovereign BFT Consensus Mesh
  // -------------------------------------------------------------
  getBFTNodes(): BFTConsensusNode[] {
    return this.bftNodes;
  }

  toggleNodePartition(nodeId: string): BFTConsensusNode[] {
    const node = this.bftNodes.find((n) => n.nodeId === nodeId);
    if (node) {
      if (node.status === 'SYNCED_HEALTHY') {
        node.status = 'ISOLATED_RECOVERY';
        node.latencyMs = 999;
      } else {
        node.status = 'SYNCED_HEALTHY';
        node.latencyMs = 12;
      }
    }
    return [...this.bftNodes];
  }

  executeConsensusRound(): ConsensusRoundEvent {
    this.roundCounter += 1;
    const activeHealthyNodes = this.bftNodes.filter((n) => n.status !== 'ISOLATED_RECOVERY');
    const signaturesGathered = activeHealthyNodes.length;
    const quorumRequired = Math.ceil((this.bftNodes.length * 2) / 3);

    // increment block heights for healthy nodes
    this.bftNodes.forEach((n) => {
      if (n.status === 'SYNCED_HEALTHY') {
        n.blockHeight += 1;
        n.lastHeartbeat = new Date().toISOString();
        n.signatureCount += 1;
      }
    });

    return {
      roundId: this.roundCounter,
      blockNumber: this.bftNodes[0].blockHeight,
      proposedBy: 'NODE-01-DEL (Master SDC)',
      txCount: Math.floor(Math.random() * 24 + 8),
      stateRootHash: `0x${createDeterministicHex(String(this.roundCounter)).slice(0, 40)}`,
      signaturesGathered,
      quorumRequired,
      consensusState: signaturesGathered >= quorumRequired ? 'COMMITTED' : 'PREPARE',
      latencyMs: Math.floor(Math.random() * 15 + 8),
      timestamp: new Date().toISOString(),
    };
  }

  createAirgappedDisasterRecoverySnapshot(): DisasterRecoverySnapshot {
    return {
      snapshotId: `DR-SNAP-SOVEREIGN-2026-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      blockHeight: this.bftNodes[0].blockHeight,
      totalCasesCount: 148,
      totalLedgerHash: '0x8f2a99c4b12399ef01a88b77621e90acbd812491',
      airgapSignature: 'ECDSA-SECP256K1-NAT-ROOT-001',
      restoreStatus: 'ONLINE_ACTIVE',
    };
  }

  // -------------------------------------------------------------
  // Bail Reckoner (Sec 479 & 480 BNSS)
  // -------------------------------------------------------------
  getBailProfiles(): BailReckonerProfile[] {
    return this.bailProfiles;
  }

  dispatchEBailReleaseBond(caseId: string): BailReckonerProfile {
    const profile = this.bailProfiles.find((p) => p.caseId === caseId);
    if (!profile) throw new Error('Bail profile not found');

    profile.eBailReleaseBondGenerated = true;
    profile.judicialApprovalStatus = 'GRANTED_E_BAIL';
    profile.icjsDispatchTimestamp = new Date().toISOString();
    return { ...profile };
  }
}

export const phase7Service = new Phase7Service();
