import { SovereignUser, SovereignRoleCode, SovereignJurisdiction, ActionPermissionCode, AuditLogEntry } from '../types/authHierarchy';
import { computeSHA256 } from './cryptoEngine';

export const INITIAL_JURISDICTIONS: SovereignJurisdiction[] = [
  {
    id: 'jur-nat-01',
    code: 'IN-NAT',
    name: 'National Justice Command (MHA / Ministry of Law & Justice)',
    level: 'NATIONAL',
    stateCode: 'IN',
    activeUnitsCount: 36,
  },
  {
    id: 'jur-del-01',
    code: 'DL-HQ',
    name: 'Delhi Police Headquarters & High Court of Delhi',
    level: 'STATE',
    parentJurisdictionId: 'jur-nat-01',
    stateCode: 'DL',
    activeUnitsCount: 15,
  },
  {
    id: 'jur-del-nd',
    code: 'DL-ND',
    name: 'New Delhi Police District & Patiala House District Courts',
    level: 'DISTRICT',
    parentJurisdictionId: 'jur-del-01',
    stateCode: 'DL',
    districtCode: 'NEW_DELHI',
    activeUnitsCount: 8,
  },
  {
    id: 'jur-del-ps-cyber',
    code: 'DL-PS-CYBER',
    name: 'Cyber Crime Police Station, Mandir Marg Special Cell',
    level: 'STATION',
    parentJurisdictionId: 'jur-del-nd',
    stateCode: 'DL',
    districtCode: 'NEW_DELHI',
    activeUnitsCount: 4,
  },
  {
    id: 'jur-del-cfsl',
    code: 'DL-CFSL-LODHI',
    name: 'Central Forensic Science Laboratory (CFSL), CBI Campus, Lodhi Road',
    level: 'FSL_LAB',
    parentJurisdictionId: 'jur-nat-01',
    stateCode: 'DL',
    activeUnitsCount: 6,
  },
  {
    id: 'jur-mh-01',
    code: 'MH-HQ',
    name: 'Maharashtra Police Headquarters & High Court of Bombay',
    level: 'STATE',
    parentJurisdictionId: 'jur-nat-01',
    stateCode: 'MH',
    activeUnitsCount: 36,
  },
  {
    id: 'jur-mh-mum',
    code: 'MH-MUM',
    name: 'Greater Mumbai Police Commissionerate & Sessions Court',
    level: 'DISTRICT',
    parentJurisdictionId: 'jur-mh-01',
    stateCode: 'MH',
    districtCode: 'MUMBAI',
    activeUnitsCount: 12,
  },
  {
    id: 'jur-mh-fsl-kalina',
    code: 'MH-FSL-KALINA',
    name: 'State Forensic Science Laboratory, Kalina, Santacruz (Mumbai)',
    level: 'FSL_LAB',
    parentJurisdictionId: 'jur-mh-01',
    stateCode: 'MH',
    activeUnitsCount: 8,
  },
  {
    id: 'jur-ka-01',
    code: 'KA-HQ',
    name: 'Karnataka State Police Headquarters & High Court of Karnataka',
    level: 'STATE',
    parentJurisdictionId: 'jur-nat-01',
    stateCode: 'KA',
    activeUnitsCount: 31,
  },
  {
    id: 'jur-ka-blr',
    code: 'KA-BLR',
    name: 'Bengaluru City Police & Principal City Civil & Sessions Court',
    level: 'DISTRICT',
    parentJurisdictionId: 'jur-ka-01',
    stateCode: 'KA',
    districtCode: 'BENGALURU',
    activeUnitsCount: 14,
  },
];

export const INITIAL_SOVEREIGN_USERS: SovereignUser[] = [
  {
    id: 'usr-io-01',
    badgeId: 'DP-CYB-8812',
    fullName: 'ACP Raghavendra Sharma',
    designation: 'Assistant Commissioner of Police (Cyber Crime)',
    email: 'raghavendra.sharma@delhipolice.gov.in',
    phone: '+91 98110 44219',
    role: 'IO_OFFICER',
    jurisdictionId: 'jur-del-ps-cyber',
    jurisdictionName: 'Cyber Crime PS, Mandir Marg, New Delhi',
    department: 'Special Cell, Delhi Police',
    securityClearance: 'SECRET',
    pkiCertificateId: 'NIC-DSC-2026-DEL-DP-CYB-8812',
    publicKeyFingerprint: 'SHA256:7B:3A:99:C1:F2:40:91:EE:A0:82:11:44:88:BB:90:1C',
    mfaEnabled: true,
    mfaMethod: 'SMART_CARD_DSC',
    lastLoginAt: '2026-09-27T07:45:00Z',
    sessionStatus: 'ACTIVE',
  },
  {
    id: 'usr-fsl-01',
    badgeId: 'CFSL-CYB-044',
    fullName: 'Dr. Sunita Deshmukh',
    designation: 'Senior Scientific Officer (Cyber Forensics)',
    email: 'sunita.deshmukh@cfsl.gov.in',
    phone: '+91 98220 11994',
    role: 'FORENSIC_OFFICER',
    jurisdictionId: 'jur-del-cfsl',
    jurisdictionName: 'Central Forensic Science Laboratory, Lodhi Road',
    department: 'CFSL Digital Forensics & Hardware Extraction Wing',
    securityClearance: 'TOP_SECRET',
    pkiCertificateId: 'NIC-DSC-2026-CFS-044',
    publicKeyFingerprint: 'SHA256:FF:99:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE',
    mfaEnabled: true,
    mfaMethod: 'SMART_CARD_DSC',
    lastLoginAt: '2026-09-27T06:30:00Z',
    sessionStatus: 'ACTIVE',
  },
  {
    id: 'usr-prosecutor-01',
    badgeId: 'DOP-SEN-019',
    fullName: 'Adv. Manavendra Sen',
    designation: 'Chief Public Prosecutor',
    email: 'manavendra.sen@dop.delhi.gov.in',
    phone: '+91 98118 77654',
    role: 'PROSECUTOR',
    jurisdictionId: 'jur-del-nd',
    jurisdictionName: 'Directorate of Prosecution, New Delhi District',
    department: 'Directorate of Prosecution, NCT of Delhi',
    securityClearance: 'CONFIDENTIAL',
    pkiCertificateId: 'NIC-DSC-2026-DOP-SEN-019',
    publicKeyFingerprint: 'SHA256:44:55:66:77:88:99:00:AA:BB:CC:DD:EE:FF:00:11:22',
    mfaEnabled: true,
    mfaMethod: 'HARDWARE_FIDO2',
    lastLoginAt: '2026-09-27T07:15:00Z',
    sessionStatus: 'ACTIVE',
  },
  {
    id: 'usr-judge-01',
    badgeId: 'JUD-PHC-014',
    fullName: 'Hon\'ble Justice Rajesh Khurana',
    designation: 'Special Judge, Sessions Court (Cyber & PMLA Bench)',
    email: 'judge.khurana@delhicourts.nic.in',
    phone: '+91 98100 00140',
    role: 'JUDGE_MAGISTRATE',
    jurisdictionId: 'jur-del-nd',
    jurisdictionName: 'Patiala House Courts Complex, New Delhi',
    department: 'Delhi Judicial Service / District & Sessions Judiciary',
    securityClearance: 'TOP_SECRET',
    pkiCertificateId: 'NIC-DSC-2026-JUD-DEL-014',
    publicKeyFingerprint: 'SHA256:88:77:66:55:44:33:22:11:00:AA:BB:CC:DD:EE:FF:00',
    mfaEnabled: true,
    mfaMethod: 'SMART_CARD_DSC',
    lastLoginAt: '2026-09-27T08:00:00Z',
    sessionStatus: 'ACTIVE',
  },
  {
    id: 'usr-clerk-01',
    badgeId: 'REG-PHC-881',
    fullName: 'Shri H. R. Venkatesh',
    designation: 'Court Master & E-Filing Registrar',
    email: 'registrar.phc@delhicourts.nic.in',
    phone: '+91 98450 33211',
    role: 'COURT_CLERK',
    jurisdictionId: 'jur-del-nd',
    jurisdictionName: 'Patiala House Courts Registry',
    department: 'Judicial Registry & Digital Cause List Division',
    securityClearance: 'RESTRICTED',
    pkiCertificateId: 'NIC-DSC-2026-REG-08',
    publicKeyFingerprint: 'SHA256:11:22:33:44:55:66:77:88:99:00:AA:BB:CC:DD:EE:FF',
    mfaEnabled: true,
    mfaMethod: 'GOV_OTP',
    lastLoginAt: '2026-09-27T07:50:00Z',
    sessionStatus: 'ACTIVE',
  },
  {
    id: 'usr-auditor-01',
    badgeId: 'AUD-NAT-007',
    fullName: 'Dr. Kaushik Banerjee',
    designation: 'National Sovereign Security & Blockchain Lead Auditor',
    email: 'kaushik.banerjee@nic.in',
    phone: '+91 98300 44321',
    role: 'AUDITOR',
    jurisdictionId: 'jur-nat-01',
    jurisdictionName: 'National Informatics Centre / MHA Audit Wing',
    department: 'National Cyber Forensic & Blockchain Audit Division',
    securityClearance: 'TOP_SECRET',
    pkiCertificateId: 'NIC-DSC-2026-AUD-007',
    publicKeyFingerprint: 'SHA256:99:88:77:66:55:44:33:22:11:00:FF:EE:DD:CC:BB:AA',
    mfaEnabled: true,
    mfaMethod: 'HARDWARE_FIDO2',
    lastLoginAt: '2026-09-27T08:01:00Z',
    sessionStatus: 'ACTIVE',
  },
  {
    id: 'usr-admin-nat',
    badgeId: 'NAT-ADM-001',
    fullName: 'Shri Vikramaditya Singhal (IAS)',
    designation: 'Joint Secretary (Judicial Infrastructure & Modernization)',
    email: 'js-justice@gov.in',
    phone: '+91 98110 00001',
    role: 'NAT_ADMIN',
    jurisdictionId: 'jur-nat-01',
    jurisdictionName: 'Ministry of Law & Justice, Shastri Bhawan',
    department: 'Department of Justice, Government of India',
    securityClearance: 'TOP_SECRET',
    pkiCertificateId: 'NIC-DSC-2026-NAT-ADM-001',
    publicKeyFingerprint: 'SHA256:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF',
    mfaEnabled: true,
    mfaMethod: 'SMART_CARD_DSC',
    lastLoginAt: '2026-09-27T06:00:00Z',
    sessionStatus: 'ACTIVE',
  },
  {
    id: 'usr-evidence-01',
    badgeId: 'EVD-DEL-901',
    fullName: 'Sub-Insp. R. K. Mishra',
    designation: 'Senior Evidence Malkhana Custodian',
    email: 'malkhana.mandirmarg@delhipolice.gov.in',
    phone: '+91 98101 23456',
    role: 'EVIDENCE_OFFICER',
    jurisdictionId: 'jur-del-ps-cyber',
    jurisdictionName: 'Cyber Crime PS, Mandir Marg',
    department: 'Delhi Police Central Evidence Storage Unit',
    securityClearance: 'CONFIDENTIAL',
    pkiCertificateId: 'NIC-DSC-2026-EVD-901',
    publicKeyFingerprint: 'SHA256:33:22:11:00:FF:EE:DD:CC:BB:AA:99:88:77:66:55:44',
    mfaEnabled: true,
    mfaMethod: 'BIO_METRIC',
    lastLoginAt: '2026-09-27T07:20:00Z',
    sessionStatus: 'ACTIVE',
  },
];

// RBAC Matrix: maps Role -> Array of Allowed Actions
export const RBAC_ROLE_PERMISSIONS: Record<SovereignRoleCode, ActionPermissionCode[]> = {
  NAT_ADMIN: [
    'FIR_READ',
    'CASE_DIARY_READ',
    'DOC_VERIFY_HASH',
    'AUDIT_LOG_READ',
    'AUDIT_LOG_EXPORT',
    'BLOCKCHAIN_AUDIT',
    'USER_MGMT',
    'JURISDICTION_CONFIG',
  ],
  STATE_ADMIN: [
    'FIR_READ',
    'CASE_DIARY_READ',
    'DOC_VERIFY_HASH',
    'AUDIT_LOG_READ',
    'AUDIT_LOG_EXPORT',
    'BLOCKCHAIN_AUDIT',
    'USER_MGMT',
    'JURISDICTION_CONFIG',
  ],
  DIST_ADMIN: [
    'FIR_READ',
    'CASE_DIARY_READ',
    'DOC_VERIFY_HASH',
    'AUDIT_LOG_READ',
    'USER_MGMT',
    'BLOCKCHAIN_AUDIT',
  ],
  POLICE_COMM: [
    'FIR_READ',
    'CASE_DIARY_READ',
    'DOC_VERIFY_HASH',
    'CHARGE_SHEET_VET',
    'AUDIT_LOG_READ',
    'BLOCKCHAIN_AUDIT',
    'ASSET_ASSIGN',
  ],
  STATION_OFFICER: [
    'FIR_CREATE',
    'FIR_APPROVE',
    'FIR_READ',
    'CASE_DIARY_WRITE',
    'CASE_DIARY_READ',
    'DOC_UPLOAD',
    'DOC_DECRYPT',
    'DOC_VERIFY_HASH',
    'EVIDENCE_SEIZE',
    'EVIDENCE_TRANSFER',
    'CHARGE_SHEET_DRAFT',
    'CHARGE_SHEET_VET',
    'COURT_EFILING_SUBMIT',
    'ASSET_ASSIGN',
  ],
  IO_OFFICER: [
    'FIR_CREATE',
    'FIR_READ',
    'CASE_DIARY_WRITE',
    'CASE_DIARY_READ',
    'DOC_UPLOAD',
    'DOC_DECRYPT',
    'DOC_VERIFY_HASH',
    'EVIDENCE_SEIZE',
    'EVIDENCE_TRANSFER',
    'CHARGE_SHEET_DRAFT',
    'COURT_EFILING_SUBMIT',
    'TAMPER_SIMULATION_TEST',
  ],
  EVIDENCE_OFFICER: [
    'FIR_READ',
    'DOC_VERIFY_HASH',
    'EVIDENCE_SEIZE',
    'EVIDENCE_TRANSFER',
    'EVIDENCE_EXAMINE',
    'ASSET_ACQUIRE',
    'ASSET_ASSIGN',
  ],
  FORENSIC_OFFICER: [
    'FIR_READ',
    'CASE_DIARY_READ',
    'DOC_UPLOAD',
    'DOC_VERIFY_HASH',
    'EVIDENCE_EXAMINE',
    'FSL_REPORT_SUBMIT',
    'FSL_REPORT_SIGN',
    'BLOCKCHAIN_AUDIT',
  ],
  PROSECUTOR: [
    'FIR_READ',
    'CASE_DIARY_READ',
    'DOC_DECRYPT',
    'DOC_VERIFY_HASH',
    'CHARGE_SHEET_VET',
    'COURT_EFILING_SUBMIT',
    'AUDIT_LOG_READ',
    'BLOCKCHAIN_AUDIT',
  ],
  JUDGE_MAGISTRATE: [
    'FIR_READ',
    'CASE_DIARY_READ',
    'DOC_DECRYPT',
    'DOC_VERIFY_HASH',
    'CHARGE_SHEET_COGNIZANCE',
    'JUDICIAL_ORDER_ISSUE',
    'FINAL_JUDGMENT_DECREE',
    'BLOCKCHAIN_AUDIT',
  ],
  COURT_CLERK: [
    'FIR_READ',
    'DOC_VERIFY_HASH',
    'COURT_EFILING_SUBMIT',
    'JUDICIAL_ORDER_ISSUE',
    'AUDIT_LOG_READ',
  ],
  AUDITOR: [
    'FIR_READ',
    'CASE_DIARY_READ',
    'DOC_VERIFY_HASH',
    'AUDIT_LOG_READ',
    'AUDIT_LOG_EXPORT',
    'BLOCKCHAIN_AUDIT',
    'TAMPER_SIMULATION_TEST',
  ],
  SECURITY_OFFICER: [
    'AUDIT_LOG_READ',
    'AUDIT_LOG_EXPORT',
    'BLOCKCHAIN_AUDIT',
    'USER_MGMT',
    'JURISDICTION_CONFIG',
    'TAMPER_SIMULATION_TEST',
  ],
};

const STORAGE_AUTH_USER = 'nsdj_active_user_v1';
const STORAGE_AUDIT_LOGS = 'nsdj_audit_logs_v1';

class AuthHierarchyService {
  private users: SovereignUser[] = [...INITIAL_SOVEREIGN_USERS];
  private jurisdictions: SovereignJurisdiction[] = [...INITIAL_JURISDICTIONS];
  private activeUser: SovereignUser;
  private auditLogs: AuditLogEntry[] = [];

  constructor() {
    const savedUser = localStorage.getItem(STORAGE_AUTH_USER);
    if (savedUser) {
      try {
        this.activeUser = JSON.parse(savedUser);
      } catch {
        this.activeUser = this.users[0];
      }
    } else {
      this.activeUser = this.users[0];
    }

    const savedLogs = localStorage.getItem(STORAGE_AUDIT_LOGS);
    if (savedLogs) {
      try {
        this.auditLogs = JSON.parse(savedLogs);
      } catch {
        this.seedInitialAuditLogs();
      }
    } else {
      this.seedInitialAuditLogs();
    }
  }

  private seedInitialAuditLogs(): void {
    const now = new Date().toISOString();
    this.auditLogs = [
      {
        id: 'audit-evt-001',
        timestamp: '2026-09-27T07:45:02Z',
        actorId: 'usr-io-01',
        actorName: 'ACP Raghavendra Sharma',
        actorRole: 'IO_OFFICER',
        actorDepartment: 'Special Cell, Delhi Police',
        actionCode: 'LOGIN',
        targetEntityType: 'USER',
        targetEntityId: 'usr-io-01',
        jurisdictionScope: 'jur-del-ps-cyber',
        result: 'SUCCESS',
        ipAddress: '10.144.20.12 (NIC-GovNet Gateway)',
        deviceFingerprint: 'NIC-SMARTCARD-DSC-TOKEN-9182',
        signatureDigest: '3045022100e4b819f2014bca819e91823901ca9f10928a47812903fe8910283401022039a8bc',
        details: 'Successful PKI Smart Card Mutual TLS handshake and biometric verification.',
      },
      {
        id: 'audit-evt-002',
        timestamp: '2026-09-27T07:46:15Z',
        actorId: 'usr-io-01',
        actorName: 'ACP Raghavendra Sharma',
        actorRole: 'IO_OFFICER',
        actorDepartment: 'Special Cell, Delhi Police',
        actionCode: 'FIR_READ',
        targetEntityType: 'CASE',
        targetEntityId: 'case-cyber-8921',
        jurisdictionScope: 'jur-del-ps-cyber',
        result: 'SUCCESS',
        ipAddress: '10.144.20.12',
        deviceFingerprint: 'NIC-SMARTCARD-DSC-TOKEN-9182',
        signatureDigest: '304502210091823901ca9f10928a47812903fe8910283401022039a8bce4b819f2014bca819e',
        details: 'Decrypted and examined case dossier FIR-2026-CYBER-8921 under authorized jurisdiction.',
      },
    ];
    this.saveLogs();
  }

  private saveLogs(): void {
    localStorage.setItem(STORAGE_AUDIT_LOGS, JSON.stringify(this.auditLogs.slice(0, 100)));
  }

  public getActiveUser(): SovereignUser {
    return this.activeUser;
  }

  public getAllUsers(): SovereignUser[] {
    return [...this.users];
  }

  public getAllJurisdictions(): SovereignJurisdiction[] {
    return [...this.jurisdictions];
  }

  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }

  public async switchActiveUser(userId: string): Promise<SovereignUser> {
    const target = this.users.find((u) => u.id === userId);
    if (!target) throw new Error('User not found');

    const prevUser = this.activeUser;
    this.activeUser = target;
    localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(target));

    await this.logAuditEvent({
      actionCode: 'ROLE_SWITCH',
      targetEntityType: 'USER',
      targetEntityId: target.id,
      jurisdictionScope: target.jurisdictionId,
      result: 'SUCCESS',
      details: `Switched active session from ${prevUser.fullName} (${prevUser.role}) to ${target.fullName} (${target.role}).`,
    });

    return target;
  }

  public async verifyAndAuthorize(
    action: ActionPermissionCode,
    targetJurisdictionId?: string
  ): Promise<{ authorized: boolean; reason?: string }> {
    const allowedActions = RBAC_ROLE_PERMISSIONS[this.activeUser.role] || [];
    const hasRolePermission = allowedActions.includes(action);

    if (!hasRolePermission) {
      await this.logAuditEvent({
        actionCode: 'ACCESS_DENIED',
        targetEntityType: 'SYSTEM',
        targetEntityId: action,
        jurisdictionScope: this.activeUser.jurisdictionId,
        result: 'DENIED',
        details: `Access Denied: Role [${this.activeUser.role}] is not authorized for action [${action}].`,
      });

      return {
        authorized: false,
        reason: `Role [${this.activeUser.role}] does not possess the statutory permission for [${action}].`,
      };
    }

    return { authorized: true };
  }

  public async logAuditEvent(entry: {
    actionCode: AuditLogEntry['actionCode'];
    targetEntityType: AuditLogEntry['targetEntityType'];
    targetEntityId: string;
    jurisdictionScope: string;
    result: AuditLogEntry['result'];
    details: string;
  }): Promise<AuditLogEntry> {
    const timestamp = new Date().toISOString();
    const id = 'audit-evt-' + Date.now().toString(36);
    const signatureDigest = await computeSHA256(
      `${timestamp}:${this.activeUser.id}:${entry.actionCode}:${entry.targetEntityId}:${entry.result}`
    );

    const fullLog: AuditLogEntry = {
      id,
      timestamp,
      actorId: this.activeUser.id,
      actorName: this.activeUser.fullName,
      actorRole: this.activeUser.role,
      actorDepartment: this.activeUser.department,
      actionCode: entry.actionCode,
      targetEntityType: entry.targetEntityType,
      targetEntityId: entry.targetEntityId,
      jurisdictionScope: entry.jurisdictionScope,
      result: entry.result,
      ipAddress: '10.144.20.12 (NIC-GovNet)',
      deviceFingerprint: `DSC-${this.activeUser.pkiCertificateId}`,
      signatureDigest: `3045022100${signatureDigest.slice(0, 54)}`,
      details: entry.details,
    };

    this.auditLogs.unshift(fullLog);
    this.saveLogs();
    return fullLog;
  }
}

export const authHierarchyService = new AuthHierarchyService();
