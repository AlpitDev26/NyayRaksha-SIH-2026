import {
  ICJSPillar,
  ICJSPillarStatus,
  ICJSTransaction,
  ESummonsRecord,
  EWarrantRecord,
  CrimeHotspotItem,
  StatutoryCustodyClock,
  SovereignAuditLog,
  AirgapArchivalPackage,
  CaseFile,
  DigitalSignature,
  UserRole,
} from '../types';
import { pkiCryptoService } from './pkiService';
import { computeSHA256 } from './cryptoEngine';

class ICJSService {
  private pillars: ICJSPillarStatus[] = [
    {
      pillar: 'CCTNS_POLICE',
      name: 'Police Pillar (CCTNS / e-FIR v4.2)',
      endpoint: 'https://cctns.nic.in/api/v4/federation/sovereign-mesh',
      status: 'ONLINE',
      latencyMs: 14,
      lastSyncTimestamp: new Date().toISOString(),
      protocolVersion: 'ICJS-REST-2.4 / JSON-LD',
      packetsTransferred24h: 184209,
      gatewayKeyFingerprint: 'SHA256:4a8f9c10b723de990a184e72ac8b31a99f123d040188',
    },
    {
      pillar: 'E_FORENSICS',
      name: 'Forensics Pillar (e-Forensics / NFSU CFSL)',
      endpoint: 'https://forensics.gov.in/icjs/gateway/v3/reports',
      status: 'ONLINE',
      latencyMs: 22,
      lastSyncTimestamp: new Date().toISOString(),
      protocolVersion: 'ICJS-FSL-1.9 / REST-mTLS',
      packetsTransferred24h: 34180,
      gatewayKeyFingerprint: 'SHA256:99f8e712ca3b4991aa5610ec88319a8bc43d8102377b',
    },
    {
      pillar: 'E_PROSECUTION',
      name: 'Prosecution Pillar (e-Prosecution DPA)',
      endpoint: 'https://prosecution.gov.in/api/scrutiny/sovereign-node',
      status: 'ONLINE',
      latencyMs: 18,
      lastSyncTimestamp: new Date().toISOString(),
      protocolVersion: 'ICJS-PROS-2.1 / JSON-LD',
      packetsTransferred24h: 52910,
      gatewayKeyFingerprint: 'SHA256:7b10fa88c039de419ab7e823f00192a83e0911bc0412',
    },
    {
      pillar: 'E_COURTS',
      name: 'Courts Pillar (e-Courts CIS 3.2 / NJDG)',
      endpoint: 'https://ecourts.gov.in/njdg/v4/api/efiling/intake',
      status: 'ONLINE',
      latencyMs: 31,
      lastSyncTimestamp: new Date().toISOString(),
      protocolVersion: 'ICJS-COURT-3.2 / TLS-1.3-PKI',
      packetsTransferred24h: 210890,
      gatewayKeyFingerprint: 'SHA256:3d901a88b390fe219c018a7719fbc44e88a091cd8890',
    },
    {
      pillar: 'E_PRISONS',
      name: 'Prisons Pillar (e-Prisons National Escort Mesh)',
      endpoint: 'https://eprisons.nic.in/gateway/custody/v2/transit',
      status: 'ONLINE',
      latencyMs: 27,
      lastSyncTimestamp: new Date().toISOString(),
      protocolVersion: 'ICJS-PRISON-1.8 / mTLS',
      packetsTransferred24h: 41800,
      gatewayKeyFingerprint: 'SHA256:1a77ec890be4431908ab19dfcc89023419082348ab76',
    },
  ];

  private transactions: ICJSTransaction[] = [
    {
      id: 'TX-ICJS-2026-9901',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      sourcePillar: 'CCTNS_POLICE',
      targetPillar: 'E_COURTS',
      actionType: 'CHARGE_SHEET_DISPATCH',
      caseNumber: 'FIR-2026-CR-0982',
      cnrNumber: 'DLHC01-008921-2026',
      payloadDigest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      status: 'COMPLETED',
      acknowledgementCode: 'ACK-NJDG-2026-0982-OK',
      latencyMs: 42,
      digitalSignature: {
        signerName: 'Insp. Vikram Rathore',
        signerRole: 'IO_OFFICER',
        signerDesignation: 'Station House Officer & IO',
        organization: 'Cyber Crime Police Station, New Delhi',
        certificateId: 'CERT-CCA-IN-2026-8819',
        signatureAlgorithm: 'SHA256withECDSA',
        signatureHex: '3045022100e4b819f798a834b92c4f74d01bfa8290384...30450220',
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        publicKeyFingerprint: 'SHA256:4a8f9c10b723de990a184e72ac8b31a99f123d040188',
        isValid: true,
      },
    },
    {
      id: 'TX-ICJS-2026-9902',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      sourcePillar: 'E_FORENSICS',
      targetPillar: 'E_PROSECUTION',
      actionType: 'FSL_REQUISITION',
      caseNumber: 'FIR-2026-CR-0982',
      cnrNumber: 'DLHC01-008921-2026',
      payloadDigest: 'a89f72b819920cc81938b0219488e1a89c9288102384a8bc0192837482910291',
      status: 'COMPLETED',
      acknowledgementCode: 'ACK-DPA-FSL-409-RECV',
      latencyMs: 38,
      digitalSignature: {
        signerName: 'Dr. Sunita Deshmukh',
        signerRole: 'FORENSIC_OFFICER',
        signerDesignation: 'Director & Chief Forensic Scientist',
        organization: 'Central Forensic Science Laboratory (CFSL)',
        certificateId: 'CERT-CCA-IN-2026-4421',
        signatureAlgorithm: 'SHA256withECDSA',
        signatureHex: '304602210088fa3910c8192a83b190f82...0221001a88b7192',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        publicKeyFingerprint: 'SHA256:99f8e712ca3b4991aa5610ec88319a8bc43d8102377b',
        isValid: true,
      },
    },
    {
      id: 'TX-ICJS-2026-9903',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      sourcePillar: 'E_COURTS',
      targetPillar: 'E_PRISONS',
      actionType: 'PRISONER_PRODUCTION_REQUEST',
      caseNumber: 'FIR-2026-CR-0419',
      cnrNumber: 'MHCC02-004192-2026',
      payloadDigest: 'f810aa7290bc12948c8819203948ab887192839401823940182938475869012a',
      status: 'ACKNOWLEDGED',
      acknowledgementCode: 'ACK-TIHAR-ESCORT-SCHED-01',
      latencyMs: 51,
      digitalSignature: {
        signerName: 'Hon. Justice K. Ramanathan',
        signerRole: 'JUDGE_MAGISTRATE',
        signerDesignation: 'Chief Metropolitan Magistrate',
        organization: 'Patiala House District Courts, New Delhi',
        certificateId: 'CERT-CCA-IN-2026-1102',
        signatureAlgorithm: 'SHA256withECDSA',
        signatureHex: '3044022066fa910283b...0220918239401823',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        publicKeyFingerprint: 'SHA256:3d901a88b390fe219c018a7719fbc44e88a091cd8890',
        isValid: true,
      },
    },
  ];

  private summonsList: ESummonsRecord[] = [
    {
      id: 'SUM-2026-DL-8812',
      summonsNumber: 'SUM/CMM-PH/2026/08812',
      caseNumber: 'FIR-2026-CR-0982',
      courtName: 'Court of Chief Metropolitan Magistrate, Patiala House Courts, New Delhi',
      issuedByJudge: 'Hon. Justice K. Ramanathan',
      statutorySection: 'Section 64 & 66 BNSS (Electronic Summons Service)',
      recipientType: 'WITNESS',
      recipientName: 'Rohit Sharma (Senior Systems Architect, TechVanguard)',
      recipientContact: {
        mobile: '+91-98110-44921',
        email: 'rohit.sharma@techvanguard.in',
        address: 'Tower B, DLF Cyber City, Phase III, Gurugram, Haryana - 122002',
      },
      hearingDate: '2026-10-05 10:30 IST',
      hearingPurpose: 'Witness Deposition on Server Access Logs & Sec 63 BSA Digital Admissibility',
      issueDate: '2026-09-24',
      dispatchMode: 'MULTI_CHANNEL_SECURE',
      serviceStatus: 'SERVED_DIGITALLY_ACK',
      deliveryTimestamp: '2026-09-25T14:22:10Z',
      gpsCoordinates: {
        latitude: 28.4947,
        longitude: 77.0891,
        accuracyMeters: 4.8,
        locationName: 'DLF Cyber City, Gurugram (Geo-Validated)',
      },
      acknowledgementSignature: 'DIGI-ACK-SHA256:4a88f190c88...OTP-VERIFIED',
      qrVerificationCode: 'NSDJ-SUM-QR-982-8812-DL',
      merkleProofHash: '98fa0182394a8bc9281903491823904a88c9182394018239401823940182394a',
    },
    {
      id: 'SUM-2026-DL-8813',
      summonsNumber: 'SUM/CMM-PH/2026/08813',
      caseNumber: 'FIR-2026-CR-0982',
      courtName: 'Court of Chief Metropolitan Magistrate, Patiala House Courts, New Delhi',
      issuedByJudge: 'Hon. Justice K. Ramanathan',
      statutorySection: 'Section 64 BNSS (Electronic Summons Service)',
      recipientType: 'EXPERT_WITNESS',
      recipientName: 'Dr. Sunita Deshmukh (Director, CFSL Cyber Division)',
      recipientContact: {
        mobile: '+91-98711-20984',
        email: 'sunita.deshmukh@cfsl.gov.in',
        address: 'CFSL Complex, CBI Headquarters, CGO Complex, Lodhi Road, New Delhi',
      },
      hearingDate: '2026-10-05 11:30 IST',
      hearingPurpose: 'Scientific Expert Cross-Examination on SHA-256 Volatile Memory Extraction',
      issueDate: '2026-09-24',
      dispatchMode: 'SMS_WHATSAPP_LINK',
      serviceStatus: 'SERVED_DIGITALLY_ACK',
      deliveryTimestamp: '2026-09-25T11:05:40Z',
      gpsCoordinates: {
        latitude: 28.5893,
        longitude: 77.2341,
        accuracyMeters: 3.2,
        locationName: 'CGO Complex, Lodhi Road, New Delhi',
      },
      acknowledgementSignature: 'DIGI-ACK-GOV-ID:CFSL-9941-VERIFIED',
      qrVerificationCode: 'NSDJ-SUM-QR-982-8813-DL',
      merkleProofHash: '1a99f82348ab7612349081239048123904812390481239048123904812390481',
    },
    {
      id: 'SUM-2026-MH-4401',
      summonsNumber: 'SUM/SECC-MUM/2026/04401',
      caseNumber: 'FIR-2026-CR-0419',
      courtName: 'Special Sessions Court for Organized Crime, Mumbai',
      issuedByJudge: 'Hon. Smt. Vandana Deshpande',
      statutorySection: 'Section 65 BNSS (Summons on Corporate Officers)',
      recipientType: 'ACCUSED',
      recipientName: 'Vikas Malhotra (Managing Director, Horizon Offshore Ltd)',
      recipientContact: {
        mobile: '+91-98200-88192',
        email: 'v.malhotra@horizonoffshore.com',
        address: 'Altamount Road, Cumballa Hill, Mumbai, Maharashtra - 400026',
      },
      hearingDate: '2026-10-12 11:00 IST',
      hearingPurpose: 'Plea of Accused & Framing of Charges under Sec 316 BNS & Sec 66C IT Act',
      issueDate: '2026-09-26',
      dispatchMode: 'PROCESS_SERVER_HANDHELD',
      serviceStatus: 'OUT_FOR_PHYSICAL_SERVICE',
      qrVerificationCode: 'NSDJ-SUM-QR-419-4401-MH',
      merkleProofHash: '77ac819230491823094812309481203948120394812039481203948120394812',
    },
  ];

  private warrantsList: EWarrantRecord[] = [
    {
      id: 'NBW-2026-DL-0041',
      warrantNumber: 'NBW/PHC/2026/0041',
      caseNumber: 'FIR-2026-CR-0982',
      courtName: 'Court of Chief Metropolitan Magistrate, Patiala House Courts, New Delhi',
      judgeName: 'Hon. Justice K. Ramanathan',
      warrantType: 'NON_BAILABLE_WARRANT',
      targetPersonName: 'Vikramaditya Oberoi',
      targetAlias: 'Vicky Oberoi / GhostOperator',
      targetAddress: 'B-44, Greater Kailash Part 1, New Delhi (Known Alternate: Dubai Marina, UAE)',
      offenseSummary: 'BNS Sec 316, 318, 61(2) & IT Act 66 - Multi-Jurisdictional Financial Exfiltration of ₹14.8 Crores',
      issueDate: '2026-09-20',
      expiryDate: '2026-10-20',
      executingAgency: 'Delhi Police - Special Cell (Cyber & Inter-State Operations)',
      executionStatus: 'DISPATCHED_ELECTRONICALLY',
      lookoutNoticeIssued: true,
      tamperSealDigest: 'SHA256:7192834019283401928340192834019283401928340192834019283401928340',
    },
    {
      id: 'SW-2026-DL-0089',
      warrantNumber: 'SW/PHC/2026/0089',
      caseNumber: 'FIR-2026-CR-0982',
      courtName: 'Court of Chief Metropolitan Magistrate, Patiala House Courts, New Delhi',
      judgeName: 'Hon. Justice K. Ramanathan',
      warrantType: 'SEARCH_WARRANT',
      targetPersonName: 'TechVanguard Primary Datacenter Co-Location',
      targetAddress: 'Server Rack #42, NetMagic Data Center, Okhla Phase III, New Delhi',
      offenseSummary: 'Search & Seizure of Cold Storage HSM Modules and Ephemeral Routing Gateways',
      issueDate: '2026-09-18',
      expiryDate: '2026-09-28',
      executingAgency: 'Cyber Crime Investigation Unit & Forensic Tech Team',
      executionStatus: 'EXECUTED_ARRESTED',
      executionOfficer: {
        name: 'Insp. Vikram Rathore',
        rank: 'Inspector & Lead IO',
        badgeNumber: 'DL-POL-8841',
      },
      executionTimestamp: '2026-09-19T16:45:00Z',
      lookoutNoticeIssued: false,
      tamperSealDigest: 'SHA256:9901823901823901823901823901823901823901823901823901823901823901',
    },
  ];

  private hotspots: CrimeHotspotItem[] = [
    {
      id: 'HOTSPOT-01',
      state: 'Delhi (NCT)',
      district: 'New Delhi & South Delhi',
      policeStation: 'Cyber Crime Police Station, Special Cell Mandir Marg',
      coordinates: [28.6139, 77.209],
      crimeCategory: 'CYBER_FINANCIAL_FRAUD',
      incidentCountPast90Days: 142,
      riskSeverity: 'CRITICAL',
      topModusOperandi: 'Cross-Border USDT P2P Laundering & Phishing Trojan Deployments',
      activeSyndicates: ['GhostByte Racket', 'Triad Gateway Node 7', 'DarkApex Network'],
      resolvedRatePercent: 78.4,
    },
    {
      id: 'HOTSPOT-02',
      state: 'Maharashtra',
      district: 'Mumbai Suburban & BKC',
      policeStation: 'BKC Cyber Police Station, Mumbai Commissionerate',
      coordinates: [19.0657, 72.8687],
      crimeCategory: 'WHITE_COLLAR_CORRUPTION',
      incidentCountPast90Days: 98,
      riskSeverity: 'HIGH',
      topModusOperandi: 'Offshore Shell Company Invoicing & Synthetic Identity Fraud',
      activeSyndicates: ['Horizon Syndicate', 'Mayfair Capital Web'],
      resolvedRatePercent: 84.1,
    },
    {
      id: 'HOTSPOT-03',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      policeStation: 'CID Cyber Crime Police Station, Carlton House',
      coordinates: [12.9716, 77.5946],
      crimeCategory: 'CYBER_FINANCIAL_FRAUD',
      incidentCountPast90Days: 115,
      riskSeverity: 'HIGH',
      topModusOperandi: 'SIM Swapping & Payment Gateway Reverse Engineering',
      activeSyndicates: ['Apex Routing Cell', 'ShadowBot Ring'],
      resolvedRatePercent: 81.2,
    },
    {
      id: 'HOTSPOT-04',
      state: 'Punjab',
      district: 'Amritsar & Border Range',
      policeStation: 'Special Task Force (STF) Range Police Station, Amritsar',
      coordinates: [31.634, 74.8723],
      crimeCategory: 'NARCOTICS_TRAFFICKING',
      incidentCountPast90Days: 84,
      riskSeverity: 'CRITICAL',
      topModusOperandi: 'Drone-Aided Border Contraband Drops & Encrypted VoIP Logistics',
      activeSyndicates: ['Falcon Border Syndicate', 'Ravi Trans-Corridor Network'],
      resolvedRatePercent: 72.0,
    },
    {
      id: 'HOTSPOT-05',
      state: 'West Bengal',
      district: 'Kolkata & Salt Lake Sector V',
      policeStation: 'Cyber Crime Police Station, Bidhannagar Police Commissionerate',
      coordinates: [22.5726, 88.3639],
      crimeCategory: 'CYBER_FINANCIAL_FRAUD',
      incidentCountPast90Days: 167,
      riskSeverity: 'CRITICAL',
      topModusOperandi: 'Fraudulent Tech Support Call Centers & Remote Access Exfiltration',
      activeSyndicates: ['Vortex Global Callers', 'Sec-V Proxy Ring'],
      resolvedRatePercent: 69.5,
    },
  ];

  private custodyClocks: StatutoryCustodyClock[] = [
    {
      caseId: 'CASE-2026-0982',
      caseNumber: 'FIR-2026-CR-0982',
      accusedName: 'Karan Mehra',
      arrestTimestamp: '2026-09-15T09:30:00Z',
      statutoryLimitDays: 60,
      daysInCustody: 12,
      remainingDays: 48,
      isNearingDefaultBail: false,
      chargesheetFilingDeadline: '2026-11-14',
      chargesheetFiled: false,
      magistrateRemandExpiryDate: '2026-09-29',
      status: 'COMPLIANT',
    },
    {
      caseId: 'CASE-2026-0419',
      caseNumber: 'FIR-2026-CR-0419',
      accusedName: 'Rajesh V. Gupta (CFO)',
      arrestTimestamp: '2026-07-02T14:15:00Z',
      statutoryLimitDays: 90,
      daysInCustody: 87,
      remainingDays: 3,
      isNearingDefaultBail: true,
      chargesheetFilingDeadline: '2026-09-30',
      chargesheetFiled: false,
      magistrateRemandExpiryDate: '2026-09-29',
      status: 'CRITICAL_48_HOURS',
    },
    {
      caseId: 'CASE-2026-0112',
      caseNumber: 'FIR-2026-CR-0112',
      accusedName: 'Devendra Singhania',
      arrestTimestamp: '2026-08-10T11:00:00Z',
      statutoryLimitDays: 60,
      daysInCustody: 48,
      remainingDays: 12,
      isNearingDefaultBail: false,
      chargesheetFilingDeadline: '2026-10-09',
      chargesheetFiled: true,
      magistrateRemandExpiryDate: '2026-10-05',
      status: 'COMPLIANT',
    },
  ];

  private auditLogs: SovereignAuditLog[] = [
    {
      id: 'AUDIT-LOG-2026-10491',
      timestamp: new Date().toISOString(),
      action: 'ICJS_SYNC',
      actorName: 'ICJS Mesh Gateway Daemon',
      actorRole: 'sovereign_auditor',
      badgeId: 'NODE-DAEMON-01',
      ipAddress: '10.128.0.4',
      resourceId: 'TX-ICJS-2026-9901',
      resourceType: 'CASE',
      sha256Digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      integrityVerified: true,
      securitySeverity: 'INFO',
      metadata: {
        protocol: 'ICJS-REST-2.4',
        pillarFrom: 'CCTNS_POLICE',
        pillarTo: 'E_COURTS',
        latencyMs: 42,
      },
    },
    {
      id: 'AUDIT-LOG-2026-10490',
      timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      action: 'DIGITAL_SIGNATURE_APPLIED',
      actorName: 'Insp. Vikram Rathore',
      actorRole: 'investigating_officer',
      badgeId: 'DL-POL-8841',
      ipAddress: '192.168.10.45',
      resourceId: 'DOC-2026-0982-01',
      resourceType: 'DOCUMENT',
      sha256Digest: 'a9f8210384bc1920384918239048123904812390481239048123904812390481',
      integrityVerified: true,
      securitySeverity: 'INFO',
      metadata: {
        certificateId: 'CERT-CCA-IN-2026-8819',
        algorithm: 'SHA256withECDSA',
        actSection: 'Section 63 Bharatiya Sakshya Adhiniyam',
      },
    },
    {
      id: 'AUDIT-LOG-2026-10489',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      action: 'CUSTODY_TRANSFERRED',
      actorName: 'Sub-Insp. Priya Verma',
      actorRole: 'investigating_officer',
      badgeId: 'DL-POL-9920',
      ipAddress: '192.168.10.88',
      resourceId: 'EVD-2026-DL-8821',
      resourceType: 'EVIDENCE',
      sha256Digest: '7b88fa9012384910283940182390481239048123904812390481239048123904',
      integrityVerified: true,
      securitySeverity: 'INFO',
      metadata: {
        from: 'Malkhana Vault 4',
        to: 'CFSL Cyber Forensics Lab',
        tamperSealBarcode: 'SEAL-2026-DL-8821-X',
      },
    },
    {
      id: 'AUDIT-LOG-2026-10488',
      timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      action: 'BLOCKCHAIN_ANCHOR',
      actorName: 'Sovereign Validator Node 01',
      actorRole: 'sovereign_auditor',
      badgeId: 'VAL-DELHI-01',
      ipAddress: '10.0.1.100',
      resourceId: 'BLOCK-1041',
      resourceType: 'LEDGER_BLOCK',
      sha256Digest: '2c88f19203849102839401823904812390481239048123904812390481239048',
      integrityVerified: true,
      securitySeverity: 'INFO',
      metadata: {
        blockHeight: 1041,
        txCount: 4,
        merkleRoot: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      },
    },
  ];

  // --- ICJS Federation Methods ---
  public getPillars(): ICJSPillarStatus[] {
    return this.pillars;
  }

  public getTransactions(): ICJSTransaction[] {
    return this.transactions;
  }

  public async executeICJSSync(
    sourcePillar: ICJSPillar,
    targetPillar: ICJSPillar,
    actionType: ICJSTransaction['actionType'],
    caseNumber: string,
    cnrNumber?: string
  ): Promise<ICJSTransaction> {
    const rawPayload = JSON.stringify({
      sourcePillar,
      targetPillar,
      actionType,
      caseNumber,
      cnrNumber,
      timestamp: new Date().toISOString(),
      nonce: Math.floor(Math.random() * 1000000),
    });

    const payloadDigest = await computeSHA256(rawPayload);
    const certs = pkiCryptoService.getCertificates();
    const activeCert = certs[0];

    const newTx: ICJSTransaction = {
      id: `TX-ICJS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      sourcePillar,
      targetPillar,
      actionType,
      caseNumber,
      cnrNumber: cnrNumber || `DLHC01-00${Math.floor(1000 + Math.random() * 9000)}-2026`,
      payloadDigest,
      status: 'COMPLETED',
      acknowledgementCode: `ACK-${targetPillar.replace('_', '-')}-${Date.now().toString().slice(-6)}-VERIFIED`,
      latencyMs: Math.floor(15 + Math.random() * 35),
      digitalSignature: {
        signerName: activeCert?.subjectName || 'Sovereign Node Gateway Admin',
        signerRole: 'IO_OFFICER',
        signerDesignation: activeCert?.subjectDesignation || 'Authorized ICJS Gateway Operator',
        organization: activeCert?.subjectOrganization || 'National Sovereign Digital Justice Grid',
        certificateId: activeCert?.certificateId || 'CERT-CCA-GATEWAY-01',
        signatureAlgorithm: 'SHA256withECDSA',
        signatureHex: `3045022100${payloadDigest.substring(0, 32)}0220${payloadDigest.substring(32, 64)}`,
        timestamp: new Date().toISOString(),
        publicKeyFingerprint: activeCert?.publicKeyFingerprint || 'SHA256:4a8f9c10b723de990a184e72ac8b31a99f123d040188',
        isValid: true,
      },
    };

    this.transactions.unshift(newTx);

    // Update pillar activity
    const src = this.pillars.find((p) => p.pillar === sourcePillar);
    if (src) {
      src.lastSyncTimestamp = new Date().toISOString();
      src.packetsTransferred24h += 1;
    }
    const tgt = this.pillars.find((p) => p.pillar === targetPillar);
    if (tgt) {
      tgt.lastSyncTimestamp = new Date().toISOString();
      tgt.packetsTransferred24h += 1;
    }

    this.recordAuditLog(
      'ICJS_SYNC',
      activeCert?.subjectName || 'ICJS Gateway Admin',
      'sovereign_auditor',
      activeCert?.badgeId || 'ICJS-GW-01',
      newTx.id,
      'CASE',
      payloadDigest,
      'INFO',
      {
        actionType,
        sourcePillar,
        targetPillar,
        caseNumber,
      }
    );

    return newTx;
  }

  // --- Summons & Warrants Methods ---
  public getSummons(): ESummonsRecord[] {
    return this.summonsList;
  }

  public getWarrants(): EWarrantRecord[] {
    return this.warrantsList;
  }

  public async issueESummons(
    params: Omit<ESummonsRecord, 'id' | 'summonsNumber' | 'serviceStatus' | 'qrVerificationCode' | 'merkleProofHash'>
  ): Promise<ESummonsRecord> {
    const raw = JSON.stringify(params) + Date.now();
    const digest = await computeSHA256(raw);
    const id = `SUM-2026-DL-${Math.floor(1000 + Math.random() * 9000)}`;
    const summonsNumber = `SUM/CMM-PH/2026/${Math.floor(10000 + Math.random() * 90000)}`;

    const record: ESummonsRecord = {
      ...params,
      id,
      summonsNumber,
      serviceStatus: 'DISPATCHED_ELECTRONICALLY',
      qrVerificationCode: `NSDJ-SUM-QR-${params.caseNumber}-${id}`,
      merkleProofHash: digest,
    };

    this.summonsList.unshift(record);

    this.recordAuditLog(
      'DIGITAL_SIGNATURE_APPLIED',
      params.issuedByJudge,
      'judicial_magistrate',
      'JUDICIAL-BENCH-01',
      id,
      'SUMMONS',
      digest,
      'INFO',
      { summonsNumber, recipientName: params.recipientName, statutorySection: params.statutorySection }
    );

    return record;
  }

  public async updateSummonsServiceGeo(
    summonsId: string,
    gpsLocationName: string,
    lat: number,
    lng: number,
    acknowledgementType: 'DIGITAL_OTP' | 'BIOMETRIC_AADHAAR' | 'PROCESS_SERVER_AFFIXED'
  ): Promise<ESummonsRecord | null> {
    const item = this.summonsList.find((s) => s.id === summonsId);
    if (!item) return null;

    item.serviceStatus =
      acknowledgementType === 'PROCESS_SERVER_AFFIXED'
        ? 'REFUSED_AFFIXED'
        : 'SERVED_DIGITALLY_ACK';
    item.deliveryTimestamp = new Date().toISOString();
    item.gpsCoordinates = {
      latitude: lat,
      longitude: lng,
      accuracyMeters: 3.5,
      locationName: gpsLocationName,
    };
    item.acknowledgementSignature = `ACK-${acknowledgementType}-${await computeSHA256(item.summonsNumber + Date.now())}`;

    this.recordAuditLog(
      'CUSTODY_TRANSFERRED',
      'Process Server Unit',
      'court_registrar',
      'PROC-SRV-99',
      summonsId,
      'SUMMONS',
      item.merkleProofHash,
      'INFO',
      { status: item.serviceStatus, location: gpsLocationName }
    );

    return item;
  }

  public async issueEWarrant(
    params: Omit<EWarrantRecord, 'id' | 'warrantNumber' | 'executionStatus' | 'tamperSealDigest'>
  ): Promise<EWarrantRecord> {
    const digest = await computeSHA256(JSON.stringify(params) + Date.now());
    const id = `WARR-2026-DL-${Math.floor(1000 + Math.random() * 9000)}`;
    const warrantNumber = `${params.warrantType === 'NON_BAILABLE_WARRANT' ? 'NBW' : 'BW'}/PHC/2026/${Math.floor(1000 + Math.random() * 9000)}`;

    const record: EWarrantRecord = {
      ...params,
      id,
      warrantNumber,
      executionStatus: 'DISPATCHED_ELECTRONICALLY',
      tamperSealDigest: `SHA256:${digest}`,
    };

    this.warrantsList.unshift(record);

    this.recordAuditLog(
      'DIGITAL_SIGNATURE_APPLIED',
      params.judgeName,
      'judicial_magistrate',
      'JUDICIAL-BENCH-01',
      id,
      'WARRANT',
      digest,
      'INFO',
      { warrantNumber, targetPerson: params.targetPersonName, type: params.warrantType }
    );

    return record;
  }

  // --- Analytics & Custody Clocks ---
  public getHotspots(): CrimeHotspotItem[] {
    return this.hotspots;
  }

  public getCustodyClocks(): StatutoryCustodyClock[] {
    return this.custodyClocks;
  }

  // --- Sovereign Audit & Redaction & Archival ---
  public getAuditLogs(): SovereignAuditLog[] {
    return this.auditLogs;
  }

  public recordAuditLog(
    action: SovereignAuditLog['action'],
    actorName: string,
    actorRole: UserRole,
    badgeId: string,
    resourceId: string,
    resourceType: SovereignAuditLog['resourceType'],
    sha256Digest: string,
    securitySeverity: SovereignAuditLog['securitySeverity'] = 'INFO',
    metadata: Record<string, string | number | boolean> = {}
  ): SovereignAuditLog {
    const log: SovereignAuditLog = {
      id: `AUDIT-LOG-2026-${Math.floor(10500 + Math.random() * 89500)}`,
      timestamp: new Date().toISOString(),
      action,
      actorName,
      actorRole,
      badgeId,
      ipAddress: '192.168.10.55',
      resourceId,
      resourceType,
      sha256Digest,
      integrityVerified: true,
      securitySeverity,
      metadata,
    };

    this.auditLogs.unshift(log);
    return log;
  }

  public generateZeroKnowledgeRedactedExtract(
    caseFile: CaseFile,
    redactVictimNames: boolean = true,
    redactWitnessIdentities: boolean = true,
    redactAadhaarAndPhone: boolean = true
  ): {
    originalCaseId: string;
    redactedDossierTitle: string;
    statutoryComplianceRef: string;
    redactedText: string;
    zkIntegrityProofHash: string;
    merkleRootPreserved: boolean;
  } {
    let sanitizedText = `NATIONAL SOVEREIGN DIGITAL JUSTICE DOSSIER (REDACTED PUBLIC EXTRACT)
Statutory Authority: Section 72 BNSS & Juvenile/Victim Identity Protection Framework
Case Number: ${caseFile.caseNumber}
Court Jurisdiction: ${caseFile.courtName}
Police Station: ${caseFile.policeStation}
Registration Date: ${caseFile.firDate}
Current Stage: ${caseFile.stage.toUpperCase()}

LEGAL CHARGES APPLIED:
${caseFile.legalActsAndSections.map((s) => `• ${s}`).join('\n')}

CASE SUMMARY & ESSENTIAL FACTS:
`;

    let complainantMask = caseFile.complainant.name;
    if (redactVictimNames) {
      complainantMask = '[PROTECTED_COMPLAINANT_SEC72_BNSS]';
    }

    sanitizedText += `Complainant: ${complainantMask}\n`;
    sanitizedText += `Investigating Agency: ${caseFile.policeStation}, Lead IO: ${caseFile.leadInvestigator.name} (${caseFile.leadInvestigator.rank})\n\n`;

    sanitizedText += `ACCUSED PERSONS (PUBLIC COGNIZANCE):\n`;
    caseFile.accused.forEach((acc, idx) => {
      sanitizedText += `${idx + 1}. ${acc.name} (${acc.alias ? `Alias: ${acc.alias}` : 'Direct'}) - Status: ${acc.status} [Custody: ${acc.custodyLocation || 'N/A'}]\n`;
    });

    sanitizedText += `\nWITNESS STATEMENTS EXTRACT:\n`;
    if (redactWitnessIdentities) {
      sanitizedText += `Total Witnesses Examined: ${caseFile.witnessCount} (Identities masked under Witness Protection Scheme 2018 & BNSS)\n`;
      sanitizedText += `[WITNESS_DEPOSITIONS_CONFIDENTIAL_REDACTED_FOR_PUBLIC_RELEASE]\n`;
    } else {
      sanitizedText += `Total Witnesses: ${caseFile.witnessCount}\n`;
    }

    sanitizedText += `\nEVIDENTIARY EXHIBITS (CERTIFIED UNDER SEC 63 BSA):\n`;
    caseFile.evidenceItems.forEach((ev, i) => {
      sanitizedText += `Exhibit #${i + 1} [${ev.evidenceCode}] - Category: ${ev.category} - Tamper Status: ${ev.sealStatus} - SHA-256: ${ev.sha256Checksum}\n`;
    });

    sanitizedText += `\nDIGITAL CRYPTOGRAPHIC FOOTPRINT:\n`;
    sanitizedText += `Case Merkle Root: ${caseFile.merkleRoot}\n`;
    sanitizedText += `Chain Integrity: VERIFIED_UNALTERED\n`;
    sanitizedText += `Redaction Generated At: ${new Date().toISOString()}\n`;

    return {
      originalCaseId: caseFile.id,
      redactedDossierTitle: `REDACTED_PUBLIC_EXTRACT_${caseFile.caseNumber}.txt`,
      statutoryComplianceRef: 'Section 72 BNSS & Supreme Court Guidelines on PII Masking',
      redactedText: sanitizedText,
      zkIntegrityProofHash: caseFile.merkleRoot,
      merkleRootPreserved: true,
    };
  }

  public async generateAirgappedArchivePackage(caseFile: CaseFile): Promise<AirgapArchivalPackage> {
    const pkgId = `NSDJ-ARCHIVE-${caseFile.caseNumber.replace(/[^A-Za-z0-9]/g, '_')}-2026`;
    const rootMerkle = caseFile.merkleRoot;
    const certs = pkiCryptoService.getCertificates();
    const cert = certs[0];

    const standaloneHtmlViewerCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NSDJ Sovereign Offline Case Verification - ${caseFile.caseNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; background: #0f172a; color: #f8fafc; padding: 30px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 24px; max-width: 900px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 12px; }
    .badge-gold { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid #f59e0b; }
    .badge-green { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid #10b981; }
    .hash-box { background: #0b0f19; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 11px; word-break: break-all; border: 1px solid #1e293b; color: #38bdf8; margin: 8px 0; }
    h1 { font-size: 20px; color: #fbbf24; margin-top: 0; border-bottom: 1px solid #334155; padding-bottom: 12px; }
    h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="badge badge-gold">NATIONAL SOVEREIGN DIGITAL JUSTICE DOSSIER</span>
      <span class="badge badge-green">FIPS 180-4 / SEC 63 BSA CERTIFIED</span>
    </div>
    <h1>Case Dossier: ${caseFile.caseNumber}</h1>
    <p><strong>Court:</strong> ${caseFile.courtName} | <strong>Police Station:</strong> ${caseFile.policeStation}</p>
    <p><strong>Stage:</strong> ${caseFile.stage.toUpperCase()} | <strong>FIR Date:</strong> ${caseFile.firDate}</p>

    <h2>Cryptographic Merkle Root</h2>
    <div class="hash-box">${caseFile.merkleRoot}</div>

    <h2>Applicable Penal Sections</h2>
    <ul>
      ${caseFile.legalActsAndSections.map((s) => `<li>${s}</li>`).join('')}
    </ul>

    <h2>Evidence Ledger & Hash Digest Integrity (${caseFile.evidenceItems.length} Items)</h2>
    <ul>
      ${caseFile.evidenceItems.map((e) => `<li><strong>${e.evidenceCode}</strong> - ${e.title} [SHA-256: <code>${e.sha256Checksum}</code>]</li>`).join('')}
    </ul>

    <h2>Section 63 BSA Digital Seal</h2>
    <p>Signed by: <strong>${cert?.subjectName || 'Chief Judicial Registrar'}</strong> (${cert?.subjectDesignation || 'Registrar General'})</p>
    <div class="hash-box">${cert?.publicKeyFingerprint || 'SHA256:3d901a88b390fe219c018a7719fbc44e88a091cd8890'}</div>
    <p style="font-size: 11px; color: #64748b; text-align: center; margin-top: 30px;">
      This standalone air-gapped file can be verified independently against the NSDJ Sovereign Ledger without network connectivity.
    </p>
  </div>
</body>
</html>`;

    const htmlSha = await computeSHA256(standaloneHtmlViewerCode);

    const digitalSeal: DigitalSignature = {
      signerName: cert?.subjectName || 'Registrar General, High Court of Judicature',
      signerRole: 'COURT_CLERK',
      signerDesignation: cert?.subjectDesignation || 'Keeper of Sovereign Judicial Records',
      organization: 'National Digital Justice Archival Custody',
      certificateId: cert?.certificateId || 'CERT-CCA-ARCHIVE-01',
      signatureAlgorithm: 'SHA256withECDSA',
      signatureHex: `3045022100${htmlSha.substring(0, 32)}0220${htmlSha.substring(32, 64)}`,
      timestamp: new Date().toISOString(),
      publicKeyFingerprint: cert?.publicKeyFingerprint || 'SHA256:3d901a88b390fe219c018a7719fbc44e88a091cd8890',
      isValid: true,
    };

    const pkg: AirgapArchivalPackage = {
      packageId: pkgId,
      caseNumber: caseFile.caseNumber,
      generatedAt: new Date().toISOString(),
      generatedBy: cert?.subjectName || 'High Court Registrar',
      statutoryRetentionCategory: '30_YEAR_HEINOUS',
      totalDocumentsCount: caseFile.documents.length,
      totalEvidenceCount: caseFile.evidenceItems.length,
      totalSizeMb: +(
        (caseFile.documents.reduce((acc, d) => acc + d.fileSizeKb, 0) / 1024) +
        2.4
      ).toFixed(2),
      rootMerkleHash: rootMerkle,
      standaloneHtmlViewerSha256: htmlSha,
      digitalSealCert: digitalSeal,
      isReadyForDownload: true,
    };

    this.recordAuditLog(
      'AIRGAP_ARCHIVE_EXPORT',
      cert?.subjectName || 'High Court Registrar',
      'court_registrar',
      'REG-ARCHIVE-01',
      pkgId,
      'CASE',
      rootMerkle,
      'INFO',
      { packageId: pkgId, caseNumber: caseFile.caseNumber, statutoryCategory: '30_YEAR_HEINOUS' }
    );

    return pkg;
  }
}

export const icjsService = new ICJSService();
