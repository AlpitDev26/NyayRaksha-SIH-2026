import { CaseFile, BlockchainBlock, LedgerTransaction } from '../types';

export const INITIAL_CASES: CaseFile[] = [
  {
    id: 'case-cyber-8921',
    caseNumber: 'FIR-2026-CYBER-8921',
    cnrNumber: 'DLHC01-008921-2026',
    courtName: 'Special Cyber & Financial Crimes Court, Patiala House Courts, New Delhi',
    policeStation: 'Cyber Crime Police Station, Special Cell, Delhi Police',
    jurisdictionState: 'National Capital Territory of Delhi',
    title: 'State vs. Vikramaditya Rao & Ors. (Multi-Bank Ransomware & Hawala Laundering Ring)',
    legalActsAndSections: [
      'BNS Sec 318(4) (Cheating and Dishonestly Inducing Delivery of Property)',
      'BNS Sec 336(3) (Forgery of Electronic Record)',
      'BNS Sec 61(2) (Criminal Conspiracy)',
      'IT Act 2000 Sec 43/66 (Computer System Hacking)',
      'IT Act 2000 Sec 66C & 66D (Identity Theft & Impersonation)',
      'PMLA 2002 Sec 3/4 (Offence of Money-Laundering)'
    ],
    firDate: '2026-03-12T09:30:00Z',
    stage: 'judicial_trial',
    priority: 'HIGH_SENSITIVITY',
    leadInvestigator: {
      name: 'ACP Raghavendra Sharma',
      rank: 'Assistant Commissioner of Police',
      badgeId: 'DP-CYB-8812',
      phone: '+91 98110 44219',
    },
    complainant: {
      name: 'Chief Information Security Officer, National Infrastructure Core Banking Ltd',
      contact: 'ciso@nicb-bank.gov.in',
      address: 'Barakhamba Road, Connaught Place, New Delhi - 110001',
    },
    accused: [
      { name: 'Vikramaditya Rao', alias: 'ShadowByte', status: 'IN_JUDICIAL_CUSTODY', custodyLocation: 'Tihar Central Jail No. 4' },
      { name: 'Sameer Qureshi', alias: 'CryptoSam', status: 'IN_JUDICIAL_CUSTODY', custodyLocation: 'Tihar Central Jail No. 4' },
      { name: 'Elena Rostova', alias: 'BlackHaze', status: 'ABSCONDING' }
    ],
    witnessCount: 7,
    createdTimestamp: '2026-03-12T10:15:00Z',
    lastUpdatedTimestamp: '2026-09-24T14:30:00Z',
    merkleRoot: '7e2b10a9c84e112d8a6b3344f129c551980072abdf11293a8cf82e90bb109a12',
    tamperStatus: 'CLEAN_VERIFIED',
    documents: [
      {
        id: 'doc-fir-8921',
        caseId: 'case-cyber-8921',
        caseNumber: 'FIR-2026-CYBER-8921',
        title: 'First Information Report (E-FIR Form No. 1) with Digital Seal',
        documentType: 'FIR',
        classification: 'RESTRICTED',
        fileFormat: 'PDF',
        fileSizeKb: 684,
        sha256Hash: 'a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9',
        storageUri: 'nsdj-vault://gov-secure-storage/cases/FIR_2026_CYBER_8921/fir/doc-fir-8921.enc',
        encryptionAlgorithm: 'AES-256-GCM',
        encryptionKeyId: 'KMS-DELHI-CYBER-2026-01',
        uploadedBy: {
          name: 'ACP Raghavendra Sharma',
          badgeId: 'DP-CYB-8812',
          role: 'investigating_officer',
          department: 'Cyber Crime Cell, Delhi Police'
        },
        createdAt: '2026-03-12T10:00:00Z',
        digitalSignatures: [
          {
            signerName: 'ACP Raghavendra Sharma',
            signerRole: 'Investigating Officer',
            signerDesignation: 'Assistant Commissioner of Police',
            organization: 'Delhi Police Special Cell',
            certificateId: 'NIC-DSC-2026-DEL-DP-CYB-8812',
            signatureAlgorithm: 'SHA256withECDSA',
            signatureHex: '3045022100e4b819f2014bca819e91823901ca9f10928a47812903fe8910283401022039a8bc',
            timestamp: '2026-03-12T10:05:00Z',
            publicKeyFingerprint: 'SHA256:7B:3A:99:C1:F2:40:91:EE:A0:82:11:44:88:BB:90:1C',
            isValid: true,
          }
        ],
        blockchainTxId: '0x99a1f4b82c3d11e0a81239bf019284102938a1bcde0109283471029384aabbcc',
        blockNumber: 1042,
        isAnchored: true,
        tamperState: 'VERIFIED',
        summary: 'Cognizable complaint regarding synchronized unauthorized Trojan deployment on server clusters, draining ₹42.8 Crore into obfuscated crypto mixers.',
        metadata: {
          informantType: 'CISO / Enterprise Legal Dept',
          incidentLocation: 'Data Center Core Grid, Okhla Phase III',
          financialLossINR: '42,80,00,000'
        },
        fileContentPreview: `[NATIONAL SECURE DIGITAL JUSTICE PLATFORM - FIRST INFORMATION REPORT]
FIR NO: FIR-2026-CYBER-8921 | DISTRICT: NEW DELHI SPECIAL CELL
ACTS APPLIED: BNS 318(4), BNS 336(3), BNS 61(2), IT ACT SEC 43, 66, 66C, 66D
INFORMANT: CISO, National Infrastructure Core Banking Ltd
INVESTIGATION OFFICER: ACP Raghavendra Sharma (Badge: DP-CYB-8812)
SUMMARY OF OCCURRENCE: On 11-03-2026 at 23:42 IST, sophisticated command-and-control beacons triggered automated API payload exfiltrations across 14 gateway routers.
STATUS: Cognizance Taken, Evidence Anchored.`
      },
      {
        id: 'doc-seizure-8921-1',
        caseId: 'case-cyber-8921',
        caseNumber: 'FIR-2026-CYBER-8921',
        title: 'Seizure Memo & Digital Hardware Extraction Log (Sec 100/105 BNSS)',
        documentType: 'SEIZURE_MEMO',
        classification: 'CONFIDENTIAL',
        fileFormat: 'PDF',
        fileSizeKb: 1420,
        sha256Hash: '4f3a8b29c1102938475610293847561029384756102938475610293847561029',
        storageUri: 'nsdj-vault://gov-secure-storage/cases/FIR_2026_CYBER_8921/seizure_memo/doc-seizure-8921-1.enc',
        encryptionAlgorithm: 'AES-256-GCM',
        encryptionKeyId: 'KMS-DELHI-CYBER-2026-01',
        uploadedBy: {
          name: 'Insp. Alok Vardhan',
          badgeId: 'DP-CYB-9102',
          role: 'investigating_officer',
          department: 'Delhi Police'
        },
        createdAt: '2026-03-15T16:30:00Z',
        digitalSignatures: [
          {
            signerName: 'Insp. Alok Vardhan',
            signerRole: 'Seizure Officer',
            signerDesignation: 'Inspector of Police',
            organization: 'Delhi Police',
            certificateId: 'NIC-DSC-2026-DEL-DP-CYB-9102',
            signatureAlgorithm: 'SHA256withECDSA',
            signatureHex: '304502210091823901ca9f10928a47812903fe8910283401022039a8bce4b819f2014bca819e',
            timestamp: '2026-03-15T16:35:00Z',
            publicKeyFingerprint: 'SHA256:11:44:88:BB:90:1C:7B:3A:99:C1:F2:40:91:EE:A0:82',
            isValid: true,
          }
        ],
        blockchainTxId: '0x33b1f928c001928471029384aabbcc019284102938a1bcde99a1f4b82c3d11e0',
        blockNumber: 1045,
        isAnchored: true,
        tamperState: 'VERIFIED',
        summary: 'Seizure of 3 custom Linux blade servers, 2 Ledger cold wallets, and 4 encrypted mobile devices from safe-house in Sector 62, Noida.',
        metadata: {
          seizureLocation: 'Flat 902, Tower B, Sector 62, Noida (UP)',
          witnessPanch1: 'Devendra Kumar (Govt Official)',
          witnessPanch2: 'Subhash Chandra (Independent Panch)'
        }
      },
      {
        id: 'doc-fsl-8921-1',
        caseId: 'case-cyber-8921',
        caseNumber: 'FIR-2026-CYBER-8921',
        title: 'Central Forensic Science Laboratory (CFSL) Cyber Forensics Report',
        documentType: 'FORENSIC_FSL_REPORT',
        classification: 'SECRET',
        fileFormat: 'PDF',
        fileSizeKb: 3890,
        sha256Hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
        storageUri: 'nsdj-vault://gov-secure-storage/cases/FIR_2026_CYBER_8921/forensics/doc-fsl-8921-1.enc',
        encryptionAlgorithm: 'AES-256-GCM',
        encryptionKeyId: 'KMS-CFSL-CYBER-2026',
        uploadedBy: {
          name: 'Dr. Sunita Deshmukh',
          badgeId: 'CFSL-CYB-044',
          role: 'forensic_examiner',
          department: 'Central Forensic Science Laboratory, CBI Campus'
        },
        createdAt: '2026-04-02T11:20:00Z',
        digitalSignatures: [
          {
            signerName: 'Dr. Sunita Deshmukh',
            signerRole: 'Senior Scientific Officer (Cyber Forensics)',
            signerDesignation: 'Forensic Scientist Grade-I',
            organization: 'CFSL New Delhi',
            certificateId: 'NIC-DSC-2026-CFS-044',
            signatureAlgorithm: 'SHA256withRSA',
            signatureHex: '3045022100fa102938475610293847561029384756102938475610293847561029384756100220',
            timestamp: '2026-04-02T11:25:00Z',
            publicKeyFingerprint: 'SHA256:FF:99:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE',
            isValid: true,
          }
        ],
        blockchainTxId: '0x77c109283471029384aabbcc99a1f4b82c3d11e0a81239bf019284102938a1bc',
        blockNumber: 1058,
        isAnchored: true,
        tamperState: 'VERIFIED',
        summary: 'Memory dump analysis revealed active reverse-SSH tunnels matching IP 185.220.101.44 with cryptographic keys linked to accused Vikramaditya Rao.',
        metadata: {
          labRef: 'CFSL/DL/2026/CYBER-409',
          toolUtilized: 'EnCase v23.4 / Volatility 3 Memory Carver',
          matchConfidencePercentage: 99.8
        }
      },
      {
        id: 'doc-chargesheet-8921',
        caseId: 'case-cyber-8921',
        caseNumber: 'FIR-2026-CYBER-8921',
        title: 'Final Police Report / Charge Sheet (Under Sec 193 BNSS / 173 CrPC)',
        documentType: 'CHARGE_SHEET',
        classification: 'CONFIDENTIAL',
        fileFormat: 'PDF',
        fileSizeKb: 4210,
        sha256Hash: '11223344556677889900aabbccddeeff0011223344556677889900aabbccddee',
        storageUri: 'nsdj-vault://gov-secure-storage/cases/FIR_2026_CYBER_8921/charge_sheet/doc-cs-8921.enc',
        encryptionAlgorithm: 'AES-256-GCM',
        encryptionKeyId: 'KMS-DELHI-CYBER-2026-01',
        uploadedBy: {
          name: 'ACP Raghavendra Sharma',
          badgeId: 'DP-CYB-8812',
          role: 'investigating_officer',
          department: 'Delhi Police'
        },
        createdAt: '2026-05-20T14:00:00Z',
        digitalSignatures: [
          {
            signerName: 'ACP Raghavendra Sharma',
            signerRole: 'Investigating Officer',
            signerDesignation: 'Assistant Commissioner of Police',
            organization: 'Delhi Police',
            certificateId: 'NIC-DSC-2026-DEL-DP-CYB-8812',
            signatureAlgorithm: 'SHA256withECDSA',
            signatureHex: '3045022100889911223344556677889900aabbccddee0011223344556677889900aabb0220',
            timestamp: '2026-05-20T14:10:00Z',
            publicKeyFingerprint: 'SHA256:7B:3A:99:C1:F2:40:91:EE:A0:82:11:44:88:BB:90:1C',
            isValid: true,
          },
          {
            signerName: 'Adv. Manavendra Sen',
            signerRole: 'Chief Public Prosecutor',
            signerDesignation: 'Directorate of Prosecution, NCT of Delhi',
            organization: 'Directorate of Prosecution',
            certificateId: 'NIC-DSC-2026-DOP-SEN-019',
            signatureAlgorithm: 'SHA256withRSA',
            signatureHex: '3045022100ccddeeff0011223344556677889900aabbccddeeff0011223344556677880220',
            timestamp: '2026-05-22T10:45:00Z',
            publicKeyFingerprint: 'SHA256:44:55:66:77:88:99:00:AA:BB:CC:DD:EE:FF:00:11:22',
            isValid: true,
          }
        ],
        blockchainTxId: '0x44d189283471029384aabbcc99a1f4b82c3d11e0a81239bf019284102938a1ff',
        blockNumber: 1082,
        isAnchored: true,
        tamperState: 'VERIFIED',
        summary: 'Detailed final charge sheet presenting 14 digital exhibits, 7 prosecution witnesses, and unassailable CFSL memory forensics linking accused to the offshore wallet clusters.',
        metadata: {
          totalWitnessesCited: 7,
          totalExhibitsRelied: 14,
          prosecutorApprovalDate: '2026-05-22'
        }
      }
    ],
    evidenceItems: [
      {
        id: 'evd-8921-1',
        caseId: 'case-cyber-8921',
        evidenceCode: 'EVD-2026-DL-8821-A',
        title: 'Dell PowerEdge R750 Rack Server (Extracted from Noida Safe-house)',
        category: 'DIGITAL',
        description: 'Server unit containing staging malware repositories and proxy routing logs.',
        collectedAt: '2026-03-15T15:00:00Z',
        collectedLocation: 'Flat 902, Tower B, Sector 62, Noida',
        collectingOfficer: 'Insp. Alok Vardhan (DP-CYB-9102)',
        seizureMemoDocId: 'doc-seizure-8921-1',
        currentCustodian: 'Central Forensic Science Laboratory (Malkhana Store)',
        custodianDepartment: 'CFSL Digital Forensics Wing',
        storageVaultLocation: 'CFSL-DL-VAULT-BAY-4',
        sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        barcodeQr: 'NSDJ-EVD-8821-A-SEC',
        tamperSealNumber: 'SEAL-DL-2026-990142',
        sealStatus: 'INTACT_VERIFIED',
        blockchainAnchored: true,
        txHash: '0x88f19283471029384aabbcc99a1f4b82c3d11e0a81239bf019284102938a1ee',
        chainOfCustody: [
          {
            id: 'coc-1',
            timestamp: '2026-03-15T15:30:00Z',
            fromOfficer: 'Insp. Alok Vardhan',
            fromDepartment: 'Delhi Police Cyber Cell',
            toOfficer: 'Sub-Insp. R. K. Mishra (Malkhana Incharge)',
            toDepartment: 'Delhi Police Central Evidence Malkhana',
            purpose: 'Initial Seizure Deposit in Secure Evidence Locker',
            location: 'Cyber PS Mandir Marg, New Delhi',
            sealCondition: 'INTACT_SEALED',
            signature: {
              signerName: 'Insp. Alok Vardhan',
              signerRole: 'Investigating Officer',
              signerDesignation: 'Inspector',
              organization: 'Delhi Police',
              certificateId: 'NIC-DSC-2026-DEL-DP-CYB-9102',
              signatureAlgorithm: 'SHA256withECDSA',
              signatureHex: '3045022100a1b2c3d4e5f6',
              timestamp: '2026-03-15T15:30:00Z',
              publicKeyFingerprint: 'SHA256:11:44:88:BB:90:1C',
              isValid: true
            },
            txHash: '0x11a1b2c3d4e5f6'
          },
          {
            id: 'coc-2',
            timestamp: '2026-03-18T10:00:00Z',
            fromOfficer: 'Sub-Insp. R. K. Mishra',
            fromDepartment: 'Delhi Police Evidence Malkhana',
            toOfficer: 'Dr. Sunita Deshmukh',
            toDepartment: 'CFSL New Delhi',
            purpose: 'Forwarded for Forensic Bitstream Imaging & Volatile Extraction (Sec 293 CrPC)',
            location: 'CFSL CBI Campus, Lodhi Road',
            sealCondition: 'INTACT_SEALED',
            signature: {
              signerName: 'Dr. Sunita Deshmukh',
              signerRole: 'Forensic Scientist',
              signerDesignation: 'SSO-I Cyber',
              organization: 'CFSL',
              certificateId: 'NIC-DSC-2026-CFS-044',
              signatureAlgorithm: 'SHA256withRSA',
              signatureHex: '3045022100c3d4e5f6a1b2',
              timestamp: '2026-03-18T10:00:00Z',
              publicKeyFingerprint: 'SHA256:FF:99:11:22:33',
              isValid: true
            },
            txHash: '0x22b2c3d4e5f6a1'
          }
        ]
      },
      {
        id: 'evd-8921-2',
        caseId: 'case-cyber-8921',
        evidenceCode: 'EVD-2026-DL-8821-B',
        title: 'Ledger Nano X Hardware Crypto Wallet (Encrypted PIN Lock)',
        category: 'DIGITAL',
        description: 'Cold storage wallet recovered from pocket of accused Vikramaditya Rao.',
        collectedAt: '2026-03-15T15:15:00Z',
        collectedLocation: 'Noida Safe-house',
        collectingOfficer: 'Insp. Alok Vardhan (DP-CYB-9102)',
        seizureMemoDocId: 'doc-seizure-8921-1',
        currentCustodian: 'Special Judge Court Evidence Locker, Patiala House',
        custodianDepartment: 'Judicial Evidence Custody',
        storageVaultLocation: 'COURT-SAFE-BOX-12B',
        sha256Checksum: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        barcodeQr: 'NSDJ-EVD-8821-B-SEC',
        tamperSealNumber: 'SEAL-DL-2026-990143',
        sealStatus: 'INTACT_VERIFIED',
        blockchainAnchored: true,
        txHash: '0x99f19283471029384aabbcc99a1f4b82c3d11e0a81239bf019284102938a1ff',
        chainOfCustody: [
          {
            id: 'coc-wallet-1',
            timestamp: '2026-03-15T15:45:00Z',
            fromOfficer: 'Insp. Alok Vardhan',
            fromDepartment: 'Delhi Police',
            toOfficer: 'Sub-Insp. R. K. Mishra',
            toDepartment: 'Evidence Malkhana',
            purpose: 'Secure Evidence Storage with Dual Seal Packaging',
            location: 'Mandir Marg Police Station',
            sealCondition: 'INTACT_SEALED',
            signature: {
              signerName: 'Insp. Alok Vardhan',
              signerRole: 'Investigating Officer',
              signerDesignation: 'Inspector',
              organization: 'Delhi Police',
              certificateId: 'NIC-DSC-2026-DEL-DP-CYB-9102',
              signatureAlgorithm: 'SHA256withECDSA',
              signatureHex: '3045022100bbccddee112233',
              timestamp: '2026-03-15T15:45:00Z',
              publicKeyFingerprint: 'SHA256:11:44:88:BB:90',
              isValid: true
            },
            txHash: '0x33c3d4e5f6a1b2'
          }
        ]
      }
    ],
    forensicReports: [
      {
        id: 'fsl-rep-8921-1',
        caseId: 'case-cyber-8921',
        fslRefNumber: 'CFSL/DL/2026/CYBER-409',
        examinerName: 'Dr. Sunita Deshmukh',
        examinerBadge: 'CFSL-CYB-044',
        laboratory: 'Central Forensic Science Laboratory, CBI Complex, New Delhi',
        evidenceItemId: 'evd-8921-1',
        testType: 'Bitstream Image Extraction & Memory Volatility Analysis',
        methodology: 'ISO/IEC 27037 Digital Evidence Handling Protocol with Write-Blocker Tableau T8u',
        findings: 'Identified 128-bit encryption keys stored in RAM cache matching the ransomware payload deployed against the banking API endpoints.',
        conclusion: 'The seized server was actively operating as the Master Command Gateway for unauthorized wire transfers totaling ₹42.8 Crore.',
        confidenceScore: 99.8,
        instrumentCalibrationRef: 'NIST-CFTT-CALIB-2026-09',
        rawExtractionHash: 'c2e8b9a109847120398410293847102938471029384710293847102938471029',
        reportHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
        dateCompleted: '2026-04-02T11:00:00Z',
        status: 'ADMITTED_IN_COURT',
        signature: {
          signerName: 'Dr. Sunita Deshmukh',
          signerRole: 'Senior Scientific Officer',
          signerDesignation: 'Grade-I Scientist',
          organization: 'CFSL',
          certificateId: 'NIC-DSC-2026-CFS-044',
          signatureAlgorithm: 'SHA256withRSA',
          signatureHex: '3045022100fa1029384756',
          timestamp: '2026-04-02T11:25:00Z',
          publicKeyFingerprint: 'SHA256:FF:99:11:22:33',
          isValid: true
        },
        blockchainTxId: '0x77c109283471029384aabbcc99a1f4b82c3d11e0a81239bf019284102938a1bc'
      }
    ],
    hearingDates: [
      { date: '2026-06-05', purpose: 'Cognizance & Supply of Copies (Sec 230 BNSS)', bench: 'Court 14, Special Judge Rajesh Khurana', outcome: 'Cognizance taken, copies supplied to defence counsel.' },
      { date: '2026-07-18', purpose: 'Hearing on Framing of Charges', bench: 'Court 14, Special Judge Rajesh Khurana', outcome: 'Charges framed under BNS 318(4), 336(3), IT Act 66. Accused pleaded not guilty.' },
      { date: '2026-09-30', purpose: 'Prosecution Evidence (PW-1 Dr. Sunita Deshmukh / CFSL Examination)', bench: 'Court 14, Special Judge Rajesh Khurana' }
    ],
    chargeSheetDraft: {
      datePrepared: '2026-05-20',
      sectionsCharged: ['BNS 318(4)', 'BNS 336(3)', 'BNS 61(2)', 'IT Act 43/66', 'IT Act 66C/66D'],
      prosecutionCognizanceReview: 'APPROVED',
      prosecutorNotes: 'All forensic reports anchored with SHA-256 hashes. Digital certificates verified under Sec 65B Indian Evidence Act / Sec 63 BSA 2023. Prima facie case established for trial.',
      summaryOfEvidence: 'Bank transaction logs, CFSL memory analysis, seized hardware matching IP records and witness accounts of bank engineers.'
    }
  },
  {
    id: 'case-ndps-4410',
    caseNumber: 'FIR-2026-NDPS-4410',
    cnrNumber: 'MHBB01-004410-2026',
    courtName: 'Special NDPS Court, Greater Mumbai Sessions Court',
    policeStation: 'Narcotics Control Bureau (NCB), Mumbai Zonal Unit',
    jurisdictionState: 'Maharashtra',
    title: 'Union of India (NCB) vs. Tariq Merchant & Anr. (Commercial Synthetic Methamphetamine Seizure)',
    legalActsAndSections: [
      'NDPS Act 1985 Sec 8(c) read with Sec 22(c) (Commercial Quantity Synthetic Drugs)',
      'NDPS Act 1985 Sec 27A (Financing Illicit Traffic & Harbouring Offenders)',
      'NDPS Act 1985 Sec 29 (Abetment and Criminal Conspiracy)'
    ],
    firDate: '2026-05-18T14:15:00Z',
    stage: 'prosecution_scrutiny',
    priority: 'HIGH_SENSITIVITY',
    leadInvestigator: {
      name: 'Superintendent K. S. Rathore',
      rank: 'Superintendent',
      badgeId: 'NCB-MUM-4401',
      phone: '+91 98200 91823',
    },
    complainant: {
      name: 'Intelligence Officer Rajiv Nambiar',
      contact: 'ncb-mum-ops@gov.in',
      address: 'NCB Zonal Office, Ballard Estate, Mumbai - 400001',
    },
    accused: [
      { name: 'Tariq Merchant', alias: 'Doctor', status: 'IN_JUDICIAL_CUSTODY', custodyLocation: 'Arthur Road Central Prison' },
      { name: 'Harpreet Singh Dhillon', status: 'IN_JUDICIAL_CUSTODY', custodyLocation: 'Arthur Road Central Prison' }
    ],
    witnessCount: 5,
    createdTimestamp: '2026-05-18T15:00:00Z',
    lastUpdatedTimestamp: '2026-09-22T11:10:00Z',
    merkleRoot: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    tamperStatus: 'CLEAN_VERIFIED',
    documents: [
      {
        id: 'doc-fir-4410',
        caseId: 'case-ndps-4410',
        caseNumber: 'FIR-2026-NDPS-4410',
        title: 'NCB Crime Registration Report & Secret Intelligence Panchnama',
        documentType: 'FIR',
        classification: 'SECRET',
        fileFormat: 'PDF',
        fileSizeKb: 910,
        sha256Hash: '556677889900aabbccddeeff0011223344556677889900aabbccddeeff001122',
        storageUri: 'nsdj-vault://gov-secure-storage/cases/FIR_2026_NDPS_4410/fir/doc-fir-4410.enc',
        encryptionAlgorithm: 'AES-256-GCM',
        encryptionKeyId: 'KMS-NCB-MUM-2026',
        uploadedBy: {
          name: 'Superintendent K. S. Rathore',
          badgeId: 'NCB-MUM-4401',
          role: 'investigating_officer',
          department: 'NCB Mumbai'
        },
        createdAt: '2026-05-18T15:30:00Z',
        digitalSignatures: [
          {
            signerName: 'Superintendent K. S. Rathore',
            signerRole: 'Investigating Officer',
            signerDesignation: 'Superintendent',
            organization: 'Narcotics Control Bureau',
            certificateId: 'NIC-DSC-2026-NCB-4401',
            signatureAlgorithm: 'SHA256withECDSA',
            signatureHex: '30450221003344556677889900aabbccddeeff0011223344556677889900aabbccddee0220',
            timestamp: '2026-05-18T15:35:00Z',
            publicKeyFingerprint: 'SHA256:33:44:55:66:77:88:99:00:11:22:33:44:55:66:77:88',
            isValid: true
          }
        ],
        blockchainTxId: '0x55a1f4b82c3d11e0a81239bf019284102938a1bcde0109283471029384aabb11',
        blockNumber: 1110,
        isAnchored: true,
        tamperState: 'VERIFIED',
        summary: 'Interception of refrigerated shipping container at JNPT Port carrying 14.5 kg of pharmaceutical-grade Methamphetamine concealed inside machine parts.',
        metadata: {
          seizureWeightKg: '14.50',
          drugType: 'Methamphetamine (Synthetic)',
          estimatedValueINR: '29,00,00,000'
        }
      }
    ],
    evidenceItems: [
      {
        id: 'evd-4410-1',
        caseId: 'case-ndps-4410',
        evidenceCode: 'EVD-2026-MUM-NDPS-14A',
        title: 'Sealed Representative Drug Samples Mark A1, A2, A3 (50g each)',
        category: 'NARCOTICS',
        description: 'Homogenized test samples drawn under supervision of Metropolitan Magistrate under Sec 52A NDPS Act.',
        collectedAt: '2026-05-19T10:00:00Z',
        collectedLocation: 'JNPT Customs Bonded Warehouse, Navi Mumbai',
        collectingOfficer: 'Superintendent K. S. Rathore',
        seizureMemoDocId: 'doc-fir-4410',
        currentCustodian: 'Chemical Examiner, Forensic Science Laboratory, Kalina',
        custodianDepartment: 'FSL Chemistry & Toxicology Division',
        storageVaultLocation: 'FSL-KALINA-NARCO-SAFE-03',
        sha256Checksum: '889900aabbccddeeff0011223344556677889900aabbccddeeff001122334455',
        barcodeQr: 'NSDJ-EVD-NDPS-14A-MAGISTRATE-SEAL',
        tamperSealNumber: 'SEAL-MAG-MH-2026-4402',
        sealStatus: 'INTACT_VERIFIED',
        blockchainAnchored: true,
        txHash: '0x12a1f4b82c3d11e0a81239bf019284102938a1bcde0109283471029384aabb22',
        chainOfCustody: [
          {
            id: 'coc-ndps-1',
            timestamp: '2026-05-19T11:30:00Z',
            fromOfficer: 'Superintendent K. S. Rathore',
            fromDepartment: 'NCB Mumbai',
            toOfficer: 'Magistrate Court Clerk',
            toDepartment: 'Metropolitan Magistrate Court 37, Mumbai',
            purpose: 'Sec 52A NDPS Inventory Certification & Sample Drawing',
            location: 'Esplanade Court, Mumbai',
            sealCondition: 'INTACT_SEALED',
            signature: {
              signerName: 'Superintendent K. S. Rathore',
              signerRole: 'Investigating Officer',
              signerDesignation: 'Superintendent',
              organization: 'NCB',
              certificateId: 'NIC-DSC-2026-NCB-4401',
              signatureAlgorithm: 'SHA256withECDSA',
              signatureHex: '3045022100112233',
              timestamp: '2026-05-19T11:30:00Z',
              publicKeyFingerprint: 'SHA256:33:44:55',
              isValid: true
            },
            txHash: '0x44d4e5f6a1b2c3'
          }
        ]
      }
    ],
    forensicReports: [
      {
        id: 'fsl-rep-4410-1',
        caseId: 'case-ndps-4410',
        fslRefNumber: 'FSL/MUM/CHEM/2026/1892',
        examinerName: 'Dr. Pravin Gokhale',
        examinerBadge: 'FSL-MH-CHEM-019',
        laboratory: 'Forensic Science Laboratory, Kalina, Santacruz, Mumbai',
        evidenceItemId: 'evd-4410-1',
        testType: 'GC-MS (Gas Chromatography-Mass Spectrometry) & FTIR Quantitative Assay',
        methodology: 'UNODC Recommended Guidelines for the Identification and Analysis of Amphetamine Type Stimulants',
        findings: 'Samples A1, A2, and A3 confirmed positive for (+)-Methamphetamine Hydrochloride with 94.2% purity index.',
        conclusion: 'Conclusively establishes commercial quantity narcotic substance under Table entry No. 159 of NDPS Act 1985.',
        confidenceScore: 99.9,
        instrumentCalibrationRef: 'AGILENT-GCMS-7890B-CAL-2026',
        rawExtractionHash: '9900aabbccddeeff0011223344556677889900aabbccddeeff00112233445566',
        reportHash: '1100aabbccddeeff0011223344556677889900aabbccddeeff00112233445577',
        dateCompleted: '2026-06-10T16:00:00Z',
        status: 'SUBMITTED',
        signature: {
          signerName: 'Dr. Pravin Gokhale',
          signerRole: 'Assistant Director (Chemistry)',
          signerDesignation: 'Senior Chemical Examiner',
          organization: 'FSL Kalina',
          certificateId: 'NIC-DSC-2026-FSL-MUM-019',
          signatureAlgorithm: 'SHA256withRSA',
          signatureHex: '3045022100998877',
          timestamp: '2026-06-10T16:15:00Z',
          publicKeyFingerprint: 'SHA256:AA:BB:CC',
          isValid: true
        },
        blockchainTxId: '0x99c109283471029384aabbcc99a1f4b82c3d11e0a81239bf019284102938a1bb'
      }
    ],
    hearingDates: [
      { date: '2026-10-04', purpose: 'Prosecution Scrutiny & Cognizance on Final Charge Sheet', bench: 'Court 8, Special NDPS Judge S. M. Patwardhan' }
    ]
  },
  {
    id: 'case-hom-1094',
    caseNumber: 'FIR-2026-HOM-1094',
    cnrNumber: 'KA01-001094-2026',
    courtName: 'Principal City Civil and Sessions Court, Bengaluru',
    policeStation: 'Indiranagar Police Station, Bengaluru City Police',
    jurisdictionState: 'Karnataka',
    title: 'State of Karnataka vs. Rajeshwar Gowda (Forensic Ballistics & Digital CCTV Homicide)',
    legalActsAndSections: [
      'BNS Sec 103(1) (Murder)',
      'BNS Sec 109(1) (Attempt to Murder)',
      'Arms Act 1959 Sec 25/27 (Illegal Possession & Use of Prohibited Firearm)'
    ],
    firDate: '2026-01-10T22:45:00Z',
    stage: 'judgment_delivered',
    priority: 'ROUTINE',
    leadInvestigator: {
      name: 'ACP Manjunath Swamy',
      rank: 'Assistant Commissioner of Police',
      badgeId: 'BCP-IND-1002',
      phone: '+91 94808 12345',
    },
    complainant: {
      name: 'Dr. Anita Krishnan',
      contact: '+91 98450 88990',
      address: '12th Main, HAL 2nd Stage, Indiranagar, Bengaluru - 560038',
    },
    accused: [
      { name: 'Rajeshwar Gowda', status: 'IN_JUDICIAL_CUSTODY', custodyLocation: 'Bengaluru Central Prison, Parappana Agrahara' }
    ],
    witnessCount: 12,
    createdTimestamp: '2026-01-10T23:30:00Z',
    lastUpdatedTimestamp: '2026-09-15T17:00:00Z',
    merkleRoot: '99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa',
    tamperStatus: 'CLEAN_VERIFIED',
    documents: [
      {
        id: 'doc-judg-1094',
        caseId: 'case-hom-1094',
        caseNumber: 'FIR-2026-HOM-1094',
        title: 'Certified Final Judgment & Conviction Order with Sovereign Digital Stamp',
        documentType: 'FINAL_JUDGMENT',
        classification: 'UNCLASSIFIED',
        fileFormat: 'PDF',
        fileSizeKb: 5200,
        sha256Hash: 'aabbccddeeff0011223344556677889900aabbccddeeff001122334455667788',
        storageUri: 'nsdj-vault://gov-secure-storage/cases/FIR_2026_HOM_1094/judgment/doc-judg-1094.enc',
        encryptionAlgorithm: 'AES-256-GCM',
        encryptionKeyId: 'KMS-KA-JUD-2026',
        uploadedBy: {
          name: 'Registrar H. R. Venkatesh',
          badgeId: 'KA-JUD-REG-08',
          role: 'court_registrar',
          department: 'City Civil Court Bengaluru'
        },
        createdAt: '2026-09-15T15:00:00Z',
        digitalSignatures: [
          {
            signerName: 'Hon\'ble Justice K. Ramesh Rao',
            signerRole: 'Principal Sessions Judge',
            signerDesignation: 'District & Sessions Judge',
            organization: 'Judiciary of Karnataka',
            certificateId: 'NIC-DSC-2026-JUD-KA-001',
            signatureAlgorithm: 'SHA256withRSA',
            signatureHex: '3045022100887766554433221100aabbccddeeff0011223344556677889900aabbccddee0220',
            timestamp: '2026-09-15T15:10:00Z',
            publicKeyFingerprint: 'SHA256:88:77:66:55:44:33:22:11:00:AA:BB:CC:DD:EE:FF:00',
            isValid: true
          }
        ],
        blockchainTxId: '0x99a1f4b82c3d11e0a81239bf019284102938a1bcde0109283471029384aabb99',
        blockNumber: 1140,
        isAnchored: true,
        tamperState: 'VERIFIED',
        summary: 'Accused Rajeshwar Gowda convicted under BNS Sec 103(1) and Arms Act Sec 27. Sentenced to Rigorous Imprisonment for Life and ₹2,00,000 fine.',
        metadata: {
          judgmentType: 'CONVICTION',
          sentenceAwarded: 'Life Imprisonment + ₹2,00,000 Fine',
          bench: 'Sessions Court Bench-1'
        }
      }
    ],
    evidenceItems: [
      {
        id: 'evd-1094-1',
        caseId: 'case-hom-1094',
        evidenceCode: 'EVD-2026-KA-BAL-01',
        title: '7.65mm Country-made Pistol & 2 Expended Cartridge Cases Mark EC-1, EC-2',
        category: 'BALLISTICS',
        description: 'Firearm recovered under voluntary disclosure statement (Sec 27 Indian Evidence Act / Sec 23 BSA 2023).',
        collectedAt: '2026-01-12T08:00:00Z',
        collectedLocation: 'Storm water drain near 100 Feet Road, Indiranagar',
        collectingOfficer: 'ACP Manjunath Swamy',
        seizureMemoDocId: 'doc-fir-1094',
        currentCustodian: 'Court Evidence Malkhana, Bengaluru',
        custodianDepartment: 'Judicial Registry',
        storageVaultLocation: 'BLR-COURT-VAULT-RACK-07',
        sha256Checksum: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        barcodeQr: 'NSDJ-EVD-BLR-BAL-01',
        tamperSealNumber: 'SEAL-KA-POL-2026-1094',
        sealStatus: 'INTACT_VERIFIED',
        blockchainAnchored: true,
        txHash: '0x88f19283471029384aabbcc99a1f4b82c3d11e0a81239bf019284102938a133',
        chainOfCustody: []
      }
    ],
    forensicReports: [],
    hearingDates: [],
    judicialJudgment: {
      deliveryDate: '2026-09-15',
      presidingJudge: 'Hon\'ble Principal Sessions Judge K. Ramesh Rao',
      verdict: 'CONVICTED',
      sentenceSummary: 'Rigorous Imprisonment for Life under BNS Sec 103(1) and 7 years Rigorous Imprisonment under Arms Act Sec 27, sentences to run concurrently.',
      certifiedCopyDocId: 'doc-judg-1094'
    }
  },
  {
    id: 'case-corp-3312',
    caseNumber: 'FIR-2026-CORP-3312',
    courtName: 'Chief Metropolitan Magistrate Court, Egmore, Chennai',
    policeStation: 'Cyber Crime Wing, Central Crime Branch (CCB), Greater Chennai Police',
    jurisdictionState: 'Tamil Nadu',
    title: 'AeroDynamics Defense Labs Ltd vs. Ex-VP Tech Operations (Defense IP Exfiltration)',
    legalActsAndSections: [
      'BNS Sec 316(5) (Criminal Breach of Trust by Public Servant or Banker/Agent)',
      'BNS Sec 338 (Forgery for purpose of cheating)',
      'IT Act Sec 43(a)/66 (Unauthorized download and extraction of confidential aerospace telemetry data)',
      'Official Secrets Act 1923 Sec 3/5'
    ],
    firDate: '2026-08-01T11:00:00Z',
    stage: 'investigation',
    priority: 'NATIONAL_SECURITY',
    leadInvestigator: {
      name: 'DSP Senthamizh Selvan',
      rank: 'Deputy Superintendent of Police',
      badgeId: 'TN-CCB-3310',
      phone: '+91 94440 55667',
    },
    complainant: {
      name: 'Director of Legal & Compliance, AeroDynamics Defense Labs',
      contact: 'legal@aerodynamics-def.in',
      address: 'Defense Corridor IT Park, Guindy, Chennai - 600032',
    },
    accused: [
      { name: 'Dr. Arvind Swaminathan', status: 'DETAINED', custodyLocation: 'CCB Cyber Interrogation Cell, Vepery' }
    ],
    witnessCount: 4,
    createdTimestamp: '2026-08-01T11:45:00Z',
    lastUpdatedTimestamp: '2026-09-26T09:15:00Z',
    merkleRoot: '4455667788990011223344556677889900112233445566778899001122334455',
    tamperStatus: 'CLEAN_VERIFIED',
    documents: [],
    evidenceItems: [],
    forensicReports: [],
    hearingDates: []
  }
];

export const INITIAL_LEDGER_BLOCKS: BlockchainBlock[] = [
  {
    blockNumber: 1040,
    timestamp: '2026-03-12T09:00:00Z',
    previousHash: '0000000000000000000109a8bc441298ef991200984712093847102938471029',
    blockHash: '00000000000000000002b819f2014bca819e91823901ca9f10928a47812903fe',
    merkleRoot: '7e2b10a9c84e112d8a6b3344f129c551980072abdf11293a8cf82e90bb109a12',
    nonce: 849201,
    validatorNode: 'NODE-01-SUPREME-COURT-NATIONAL-CA',
    validatorSignature: '3045022100e4b819f2014bca819e91823901ca9f10928a47812903fe8910283401022039a8bc',
    transactions: [
      {
        txId: '0x99a1f4b82c3d11e0a81239bf019284102938a1bcde0109283471029384aabbcc',
        timestamp: '2026-03-12T10:05:00Z',
        docId: 'doc-fir-8921',
        caseNumber: 'FIR-2026-CYBER-8921',
        documentType: 'FIR',
        sha256Hash: 'a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9',
        docStorageUri: 'nsdj-vault://gov-secure-storage/cases/FIR_2026_CYBER_8921/fir/doc-fir-8921.enc',
        metadataDigest: 'd41d8cd98f00b204e9800998ecf8427e',
        signatureHex: '3045022100e4b819f2014bca819e91823901ca9f10928a47812903fe8910283401022039a8bc',
        signerOrg: 'Delhi Police Special Cell',
        signerRole: 'Investigating Officer',
        status: 'CONFIRMED'
      }
    ]
  },
  {
    blockNumber: 1045,
    timestamp: '2026-03-15T17:00:00Z',
    previousHash: '00000000000000000002b819f2014bca819e91823901ca9f10928a47812903fe',
    blockHash: '00000000000000000003f928c001928471029384aabbcc019284102938a1bcde',
    merkleRoot: '4f3a8b29c1102938475610293847561029384756102938475610293847561029',
    nonce: 991204,
    validatorNode: 'NODE-02-MINISTRY-OF-HOME-AFFAIRS',
    validatorSignature: '304502210091823901ca9f10928a47812903fe8910283401022039a8bce4b819f2014bca819e',
    transactions: [
      {
        txId: '0x33b1f928c001928471029384aabbcc019284102938a1bcde99a1f4b82c3d11e0',
        timestamp: '2026-03-15T16:35:00Z',
        docId: 'doc-seizure-8921-1',
        caseNumber: 'FIR-2026-CYBER-8921',
        documentType: 'SEIZURE_MEMO',
        sha256Hash: '4f3a8b29c1102938475610293847561029384756102938475610293847561029',
        docStorageUri: 'nsdj-vault://gov-secure-storage/cases/FIR_2026_CYBER_8921/seizure_memo/doc-seizure-8921-1.enc',
        metadataDigest: 'c4ca4238a0b923820dcc509a6f75849b',
        signatureHex: '304502210091823901ca9f10928a47812903fe8910283401022039a8bce4b819f2014bca819e',
        signerOrg: 'Delhi Police',
        signerRole: 'Seizure Officer',
        status: 'CONFIRMED'
      }
    ]
  },
  {
    blockNumber: 1058,
    timestamp: '2026-04-02T12:00:00Z',
    previousHash: '00000000000000000003f928c001928471029384aabbcc019284102938a1bcde',
    blockHash: '00000000000000000004c109283471029384aabbcc99a1f4b82c3d11e0a81239',
    merkleRoot: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    nonce: 1048291,
    validatorNode: 'NODE-03-CENTRAL-FORENSIC-HUB',
    validatorSignature: '3045022100fa102938475610293847561029384756102938475610293847561029384756100220',
    transactions: [
      {
        txId: '0x77c109283471029384aabbcc99a1f4b82c3d11e0a81239bf019284102938a1bc',
        timestamp: '2026-04-02T11:25:00Z',
        docId: 'doc-fsl-8921-1',
        caseNumber: 'FIR-2026-CYBER-8921',
        documentType: 'FORENSIC_FSL_REPORT',
        sha256Hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
        docStorageUri: 'nsdj-vault://gov-secure-storage/cases/FIR_2026_CYBER_8921/forensics/doc-fsl-8921-1.enc',
        metadataDigest: 'c81e728d9d4c2f636f067f89cc14862c',
        signatureHex: '3045022100fa102938475610293847561029384756102938475610293847561029384756100220',
        signerOrg: 'CFSL New Delhi',
        signerRole: 'Forensic Scientist',
        status: 'CONFIRMED'
      }
    ]
  },
  {
    blockNumber: 1082,
    timestamp: '2026-05-22T11:00:00Z',
    previousHash: '00000000000000000004c109283471029384aabbcc99a1f4b82c3d11e0a81239',
    blockHash: '00000000000000000005d189283471029384aabbcc99a1f4b82c3d11e0a81239',
    merkleRoot: '11223344556677889900aabbccddeeff0011223344556677889900aabbccddee',
    nonce: 1394812,
    validatorNode: 'NODE-04-DIRECTORATE-OF-PROSECUTION',
    validatorSignature: '3045022100ccddeeff0011223344556677889900aabbccddeeff0011223344556677880220',
    transactions: [
      {
        txId: '0x44d189283471029384aabbcc99a1f4b82c3d11e0a81239bf019284102938a1ff',
        timestamp: '2026-05-22T10:45:00Z',
        docId: 'doc-chargesheet-8921',
        caseNumber: 'FIR-2026-CYBER-8921',
        documentType: 'CHARGE_SHEET',
        sha256Hash: '11223344556677889900aabbccddeeff0011223344556677889900aabbccddee',
        docStorageUri: 'nsdj-vault://gov-secure-storage/cases/FIR_2026_CYBER_8921/charge_sheet/doc-cs-8921.enc',
        metadataDigest: 'eccbc87e4b5ce2fe28308fd9f2a7baf3',
        signatureHex: '3045022100ccddeeff0011223344556677889900aabbccddeeff0011223344556677880220',
        signerOrg: 'Directorate of Prosecution',
        signerRole: 'Chief Public Prosecutor',
        status: 'CONFIRMED'
      }
    ]
  },
  {
    blockNumber: 1140,
    timestamp: '2026-09-15T16:00:00Z',
    previousHash: '00000000000000000005d189283471029384aabbcc99a1f4b82c3d11e0a81239',
    blockHash: '00000000000000000006a1f4b82c3d11e0a81239bf019284102938a1bcde0109',
    merkleRoot: 'aabbccddeeff0011223344556677889900aabbccddeeff001122334455667788',
    nonce: 1849203,
    validatorNode: 'NODE-01-SUPREME-COURT-NATIONAL-CA',
    validatorSignature: '3045022100887766554433221100aabbccddeeff0011223344556677889900aabbccddee0220',
    transactions: [
      {
        txId: '0x99a1f4b82c3d11e0a81239bf019284102938a1bcde0109283471029384aabb99',
        timestamp: '2026-09-15T15:10:00Z',
        docId: 'doc-judg-1094',
        caseNumber: 'FIR-2026-HOM-1094',
        documentType: 'FINAL_JUDGMENT',
        sha256Hash: 'aabbccddeeff0011223344556677889900aabbccddeeff001122334455667788',
        docStorageUri: 'nsdj-vault://gov-secure-storage/cases/FIR_2026_HOM_1094/judgment/doc-judg-1094.enc',
        metadataDigest: 'a87ff679a2f3e71d9181a67b7542122c',
        signatureHex: '3045022100887766554433221100aabbccddeeff0011223344556677889900aabbccddee0220',
        signerOrg: 'Judiciary of Karnataka',
        signerRole: 'Principal Sessions Judge',
        status: 'CONFIRMED'
      }
    ]
  }
];
