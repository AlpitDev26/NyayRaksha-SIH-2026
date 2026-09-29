export type SignatureAlgorithm = 'SHA256withECDSA' | 'SHA256withRSA' | 'ED25519';

export interface X509Certificate {
  certificateId: string;
  serialNumber: string;
  subjectName: string;
  subjectDesignation: string;
  subjectOrganization: string;
  subjectDepartment: string;
  badgeId: string;
  issuerName: string;
  validFrom: string;
  validTo: string;
  status: 'VALID' | 'EXPIRED' | 'REVOKED' | 'SUSPENDED';
  keyAlgorithm: SignatureAlgorithm;
  keySizeBits: number;
  publicKeyFingerprint: string;
  publicKeyPem: string;
  tokenType: 'NIC_SMART_CARD_DSC' | 'JUDICIAL_E_SEAL' | 'FIDO2_HSM_TOKEN' | 'AADHAAR_ESIGN_V3';
  authorizedScopes: string[];
}

export interface BSACertificate63 {
  certificateId: string;
  caseNumber: string;
  documentTitle: string;
  documentId: string;
  targetSha256: string;
  generationTimestamp: string;
  certifyingOfficer: {
    name: string;
    badgeId: string;
    designation: string;
    organization: string;
    pkiCertId: string;
  };
  computingDeviceDetails: {
    deviceType: string;
    operatingSystem: string;
    hashUtility: string;
    ipAddress: string;
    macAddressHash: string;
  };
  declarationText: string;
  digitalSignatureHex: string;
  blockchainTxId: string;
  admissibilityStatus: 'CERTIFIED_ADMISSIBLE' | 'PENDING_VERIFICATION' | 'REJECTED';
}

export interface CryptographicAuditCheck {
  id: string;
  timestamp: string;
  targetId: string;
  targetType: 'CASE_FILE' | 'DOCUMENT' | 'EVIDENCE' | 'FORENSIC_REPORT' | 'BLOCKCHAIN_BLOCK';
  computedHash: string;
  expectedBlockchainHash: string;
  signatureValid: boolean;
  certificateValid: boolean;
  status: 'CLEAN_VERIFIED' | 'TAMPER_DETECTED' | 'SIGNATURE_INVALID' | 'UNANCHORED';
  discrepancyDetails?: string;
}
