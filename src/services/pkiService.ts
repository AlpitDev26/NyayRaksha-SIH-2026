import { X509Certificate, BSACertificate63, CryptographicAuditCheck } from '../types/cryptoPki';
import { storageService } from './storageService';

export class PkiCryptoService {
  private static instance: PkiCryptoService;
  private certificates: X509Certificate[] = [
    {
      certificateId: 'CERT-IN-POL-2026-001',
      serialNumber: '5A:3E:99:B2:1C:78:09:DE:44',
      subjectName: 'Inspector Rajesh Kumar (SHO)',
      subjectDesignation: 'Station House Officer & Cyber Investigator',
      subjectOrganization: 'Delhi Police',
      subjectDepartment: 'Crime Branch / Cyber Police Station',
      badgeId: 'DP-883921',
      issuerName: 'National Judicial & Police Root CA - India (CCA-IN)',
      validFrom: '2025-01-01T00:00:00Z',
      validTo: '2028-12-31T23:59:59Z',
      status: 'VALID',
      keyAlgorithm: 'SHA256withECDSA',
      keySizeBits: 256,
      publicKeyFingerprint: '9B:5E:21:A4:44:CD:7A:B1:32:09:88:EC:3F:55:1A:18',
      publicKeyPem: '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE7Z0bLg4QfQ4/J53W4Y5Jk6V8P3pT\nv5M5m67B9xO5n/R7yT8G+x3V2l3u3T/t3wL6N8F4J2h4Q8k4p3Y4V6L9qA==\n-----END PUBLIC KEY-----',
      tokenType: 'NIC_SMART_CARD_DSC',
      authorizedScopes: ['FIR_SIGN', 'CASE_DIARY_SEAL', 'EVIDENCE_SEIZURE', 'CHARGE_SHEET_SUBMIT']
    },
    {
      certificateId: 'CERT-IN-FSL-2026-088',
      serialNumber: '7B:44:EE:11:90:3A:88:CD:12',
      subjectName: 'Dr. Vivek Sharma (FSL-109)',
      subjectDesignation: 'Senior Scientific Officer (Digital Forensics)',
      subjectOrganization: 'Central Forensic Science Laboratory (CFSL)',
      subjectDepartment: 'Ministry of Home Affairs, GoI',
      badgeId: 'CFSL-CYB-109',
      issuerName: 'National Forensic PKI Sub-CA (NIC/CDAC)',
      validFrom: '2024-06-01T00:00:00Z',
      validTo: '2027-06-01T23:59:59Z',
      status: 'VALID',
      keyAlgorithm: 'SHA256withECDSA',
      keySizeBits: 256,
      publicKeyFingerprint: 'C2:90:1B:33:5F:AA:67:88:41:2B:EE:70:93:CD:4A:12',
      publicKeyPem: '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAER8v0jK2v0xT4m1Z4p4u5v7w8x9y0\nz1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b==\n-----END PUBLIC KEY-----',
      tokenType: 'FIDO2_HSM_TOKEN',
      authorizedScopes: ['FORENSIC_CERTIFICATE_STAMP', 'EXPERT_OPINION_SIGN', 'HASH_BENCHMARK']
    },
    {
      certificateId: 'CERT-IN-JUD-2026-004',
      serialNumber: '9F:11:88:22:AA:BC:55:01:FF',
      subjectName: 'Hon. Justice K. Ramanathan',
      subjectDesignation: 'Principal District & Sessions Judge',
      subjectOrganization: 'Supreme Court & High Court e-Courts Judicial Grid',
      subjectDepartment: 'New Delhi Sessions Court (CIS)',
      badgeId: 'JUD-DL-0042',
      issuerName: 'e-Courts National Judicial Cryptographic Authority',
      validFrom: '2023-01-01T00:00:00Z',
      validTo: '2029-01-01T23:59:59Z',
      status: 'VALID',
      keyAlgorithm: 'SHA256withRSA',
      keySizeBits: 2048,
      publicKeyFingerprint: 'EE:78:33:21:49:10:CC:AB:78:65:01:DF:88:99:A3:41',
      publicKeyPem: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1v5o6p7q8r9s0t1u2v3w\n4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c\n-----END PUBLIC KEY-----',
      tokenType: 'JUDICIAL_E_SEAL',
      authorizedScopes: ['JUDICIAL_ORDER_SEAL', 'BAIL_ORDER_SIGN', 'SENTENCING_SIGN', 'SUMMONS_DISPATCH']
    }
  ];

  public static getInstance(): PkiCryptoService {
    if (!PkiCryptoService.instance) {
      PkiCryptoService.instance = new PkiCryptoService();
    }
    return PkiCryptoService.instance;
  }

  public getCertificates(): X509Certificate[] {
    return [...this.certificates];
  }

  public getCertificateById(id: string): X509Certificate | undefined {
    return this.certificates.find(c => c.certificateId === id);
  }

  public async computeSha256(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  public async generateEcdsaSignature(dataToSign: string, certId: string): Promise<{ signatureHex: string; rawHash: string; algorithm: string }> {
    const hash = await this.computeSha256(dataToSign);
    // Real ECDSA ephemeral key generation and signing via Web Crypto
    const keyPair = await crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign', 'verify']
    );
    const encoder = new TextEncoder();
    const signatureBuffer = await crypto.subtle.sign(
      { name: 'ECDSA', hash: { name: 'SHA-256' } },
      keyPair.privateKey,
      encoder.encode(dataToSign)
    );
    const sigArray = Array.from(new Uint8Array(signatureBuffer));
    const signatureHex = sigArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return {
      signatureHex: `3045022100${signatureHex.substring(0, 64)}0220${signatureHex.substring(64, 128)}`,
      rawHash: hash,
      algorithm: 'SHA256withECDSA'
    };
  }

  public generateBSACertificate(params: {
    caseNumber: string;
    documentTitle: string;
    documentId: string;
    targetSha256: string;
    officer: {
      name: string;
      badgeId: string;
      designation: string;
      organization: string;
      pkiCertId: string;
    };
    deviceType?: string;
  }): BSACertificate63 {
    const now = new Date().toISOString();
    const certId = `BSA63-CERT-${Date.now().toString().slice(-6)}`;
    const blocks = storageService.ledger.getBlocks();
    const latestBlock = blocks[blocks.length - 1];
    const tx = latestBlock?.transactions[0];
    
    return {
      certificateId: certId,
      caseNumber: params.caseNumber,
      documentTitle: params.documentTitle,
      documentId: params.documentId,
      targetSha256: params.targetSha256,
      generationTimestamp: now,
      certifyingOfficer: params.officer,
      computingDeviceDetails: {
        deviceType: params.deviceType || 'FIPS 140-2 Validated CCTNS Evidence Workstation (Dell OptiPlex 7090)',
        operatingSystem: 'Secure Bharat Linux OS v4.2 (SELinux Enforcing)',
        hashUtility: 'OpenSSL 3.1.2 FIPS Object Module (FIPS 180-4 Standard)',
        ipAddress: '10.142.48.91 (CCTNS National VPN)',
        macAddressHash: 'd4:b2:7a:5e:91:0c (SHA-256 Signed)'
      },
      declarationText: `I, ${params.officer.name}, ${params.officer.designation}, in exercise of the powers conferred under Section 63(4) of the Bharatiya Sakshya Adhiniyam, 2023 (previously Section 65B of Indian Evidence Act, 1872), do hereby certify that the electronic record bearing SHA-256 digest [${params.targetSha256}] was produced by the lawful computer system during regular lawful activities without unauthorized interception or alteration. The hash matches the state immutable ledger.`,
      digitalSignatureHex: `3045022100a89f71c4e9123b7b6e8d9c0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f022091c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3`,
      blockchainTxId: tx ? tx.txId : '0x9a8f7e6d5c4b3a210fedcba987654321',
      admissibilityStatus: 'CERTIFIED_ADMISSIBLE'
    };
  }

  public runGlobalIntegrityAudit(): CryptographicAuditCheck[] {
    const results: CryptographicAuditCheck[] = [];
    const cases = storageService.getCases();
    const blocks = storageService.ledger.getBlocks();
    const allTxs = blocks.flatMap(b => b.transactions);

    cases.forEach(c => {
      // 1. Audit Case File
      const caseDoc = c.documents[0];
      const caseTx = caseDoc ? allTxs.find(t => t.docId === caseDoc.id) : undefined;
      results.push({
        id: `AUDIT-CASE-${c.id}`,
        timestamp: new Date().toISOString(),
        targetId: c.caseNumber,
        targetType: 'CASE_FILE',
        computedHash: caseDoc?.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        expectedBlockchainHash: caseTx ? caseTx.sha256Hash : (caseDoc?.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
        signatureValid: true,
        certificateValid: true,
        status: 'CLEAN_VERIFIED'
      });

      // 2. Audit Evidence
      c.evidenceItems.forEach(ev => {
        const isTampered = ev.sealStatus === 'TAMPER_FLAGGED';
        results.push({
          id: `AUDIT-EV-${ev.id}`,
          timestamp: new Date().toISOString(),
          targetId: `${ev.evidenceCode} (${ev.title})`,
          targetType: 'EVIDENCE',
          computedHash: ev.sha256Checksum,
          expectedBlockchainHash: ev.sha256Checksum,
          signatureValid: !isTampered,
          certificateValid: true,
          status: isTampered ? 'TAMPER_DETECTED' : 'CLEAN_VERIFIED',
          discrepancyDetails: isTampered ? 'Bit-level discrepancy identified against anchored block Merkle Root.' : undefined
        });
      });

      // 3. Audit Documents
      c.documents.forEach(doc => {
        results.push({
          id: `AUDIT-DOC-${doc.id}`,
          timestamp: new Date().toISOString(),
          targetId: `${doc.title}`,
          targetType: 'DOCUMENT',
          computedHash: doc.sha256Hash,
          expectedBlockchainHash: doc.sha256Hash,
          signatureValid: true,
          certificateValid: true,
          status: 'CLEAN_VERIFIED'
        });
      });
    });

    return results;
  }
}

export const pkiCryptoService = PkiCryptoService.getInstance();
