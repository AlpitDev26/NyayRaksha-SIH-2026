import { DocumentClassification } from './index';

export type SovereignRoleCode =
  | 'NAT_ADMIN'
  | 'STATE_ADMIN'
  | 'DIST_ADMIN'
  | 'POLICE_COMM'
  | 'STATION_OFFICER'
  | 'IO_OFFICER'
  | 'EVIDENCE_OFFICER'
  | 'FORENSIC_OFFICER'
  | 'PROSECUTOR'
  | 'JUDGE_MAGISTRATE'
  | 'COURT_CLERK'
  | 'AUDITOR'
  | 'SECURITY_OFFICER';

export type JurisdictionLevel = 'NATIONAL' | 'STATE' | 'DISTRICT' | 'STATION' | 'COURT' | 'FSL_LAB';

export interface SovereignJurisdiction {
  id: string;
  code: string;
  name: string;
  level: JurisdictionLevel;
  parentJurisdictionId?: string;
  stateCode: string;
  districtCode?: string;
  coordinates?: { lat: number; lng: number };
  activeUnitsCount: number;
}

export interface SovereignUser {
  id: string;
  badgeId: string;
  fullName: string;
  designation: string;
  email: string;
  phone: string;
  role: SovereignRoleCode;
  jurisdictionId: string;
  jurisdictionName: string;
  department: string;
  securityClearance: DocumentClassification;
  pkiCertificateId: string;
  publicKeyFingerprint: string;
  mfaEnabled: boolean;
  mfaMethod: 'SMART_CARD_DSC' | 'BIO_METRIC' | 'GOV_OTP' | 'HARDWARE_FIDO2';
  lastLoginAt: string;
  sessionStatus: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  avatarUrl?: string;
}

export type ActionPermissionCode =
  | 'FIR_CREATE'
  | 'FIR_APPROVE'
  | 'FIR_READ'
  | 'CASE_DIARY_WRITE'
  | 'CASE_DIARY_READ'
  | 'DOC_UPLOAD'
  | 'DOC_DECRYPT'
  | 'DOC_VERIFY_HASH'
  | 'EVIDENCE_SEIZE'
  | 'EVIDENCE_TRANSFER'
  | 'EVIDENCE_EXAMINE'
  | 'FSL_REPORT_SUBMIT'
  | 'FSL_REPORT_SIGN'
  | 'CHARGE_SHEET_DRAFT'
  | 'CHARGE_SHEET_VET'
  | 'CHARGE_SHEET_COGNIZANCE'
  | 'COURT_EFILING_SUBMIT'
  | 'JUDICIAL_ORDER_ISSUE'
  | 'FINAL_JUDGMENT_DECREE'
  | 'ASSET_ACQUIRE'
  | 'ASSET_ASSIGN'
  | 'AUDIT_LOG_READ'
  | 'AUDIT_LOG_EXPORT'
  | 'BLOCKCHAIN_AUDIT'
  | 'USER_MGMT'
  | 'JURISDICTION_CONFIG'
  | 'TAMPER_SIMULATION_TEST';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: SovereignRoleCode;
  actorDepartment: string;
  actionCode: ActionPermissionCode | 'LOGIN' | 'LOGOUT' | 'MFA_VERIFY' | 'ROLE_SWITCH' | 'ACCESS_DENIED';
  targetEntityType: 'CASE' | 'DOCUMENT' | 'EVIDENCE' | 'USER' | 'JURISDICTION' | 'SYSTEM' | 'BLOCKCHAIN';
  targetEntityId: string;
  jurisdictionScope: string;
  result: 'SUCCESS' | 'DENIED' | 'FAILED' | 'FLAGGED_ANOMALY';
  ipAddress: string;
  deviceFingerprint: string;
  signatureDigest: string;
  details: string;
}
