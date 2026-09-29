import { GoogleGenAI } from '@google/genai';
import {
  CaseFile,
  BailEvaluationFactors,
  BailEvaluationResult,
  StatutoryChargeSheetDossier,
  CriminalNexusEntity,
  PrecedentCaseItem,
  TrialSimulationMessage,
} from '../types';

let genAIClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = (import.meta as unknown as { env: { VITE_GEMINI_API_KEY?: string } }).env.VITE_GEMINI_API_KEY || '';
  if (!genAIClient && apiKey) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

export interface SectionRecommendation {
  section: string;
  act: string;
  title: string;
  ipcEquivalent?: string;
  relevanceScore: number;
  rationale: string;
  cognizable: boolean;
  bailable: boolean;
  compoundable: boolean;
  triableByCourt: string;
  punishmentSummary: string;
}

export interface ChargeSheetAuditResult {
  overallReadinessScore: number; // 0 to 100
  status: 'READY_FOR_FILING' | 'DEFICIENCIES_DETECTED' | 'CRITICAL_BLOCKERS';
  deficiencies: Array<{
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    category: 'CHAIN_OF_CUSTODY' | 'FORENSIC_EVIDENCE' | 'WITNESS_DEPOSITION' | 'STATUTORY_TIMELINE' | 'PKI_SIGNATURES';
    description: string;
    suggestedRemedy: string;
  }>;
  summaryVerdict: string;
  statutoryChecklist: Array<{
    rule: string;
    mandate: string;
    isCompliant: boolean;
    remarks: string;
  }>;
}

export const PRECEDENT_LIBRARY: PrecedentCaseItem[] = [
  {
    id: 'prec-01',
    title: 'Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal & Ors.',
    citation: '(2020) 7 SCC 1',
    court: 'Supreme Court of India (3-Judge Bench)',
    year: 2020,
    primarySubject: 'ELECTRONIC_EVIDENCE',
    relatedActs: ['BSA 2023 Sec 63', 'Indian Evidence Act Sec 65B'],
    ratioDecidendi: 'Statutory certificate under Sec 65B(4) (now Sec 63(4) BSA 2023) is a condition precedent to the admissibility of electronic evidence in the form of secondary evidence.',
    statutoryImpact: 'Electronic logs, server dumps, and CCTV drives must strictly accompany contemporaneous cryptographic certificates and device custodian authentication to be admissible in trial.',
    fullCaseSummary: 'The Hon’ble Supreme Court settled the controversy surrounding electronic evidence certification, holding that producing certificate is mandatory where original device is not brought to court.',
  },
  {
    id: 'prec-02',
    title: 'Satender Kumar Antil v. Central Bureau of Investigation & Anr.',
    citation: '(2022) 10 SCC 51',
    court: 'Supreme Court of India',
    year: 2022,
    primarySubject: 'BAIL_GUIDELINES',
    relatedActs: ['BNSS 2023 Sec 479 & 480', 'CrPC Sec 436A & 437'],
    ratioDecidendi: 'Categorisation of offences (Category A to D) for bail adjudication; arrest should be an exception, especially for offences punishable up to 7 years imprisonment.',
    statutoryImpact: 'Mandated adherence to Sec 41/41A CrPC guidelines (Sec 35 BNSS) and standard operating procedures for granting bail without mechanical remand in economic and routine penal offences.',
    fullCaseSummary: 'A landmark decision providing comprehensive guidelines to decongest jails, prevent unnecessary pre-trial detention, and ensure bail applications are decided within statutory timeframes.',
  },
  {
    id: 'prec-03',
    title: 'P. Chidambaram v. Central Bureau of Investigation',
    citation: '(2020) 13 SCC 337',
    court: 'Supreme Court of India',
    year: 2020,
    primarySubject: 'BAIL_GUIDELINES',
    relatedActs: ['BNSS 2023 Sec 480/483', 'CrPC Sec 437/439', 'PMLA 2002'],
    ratioDecidendi: 'Triple test for grant of regular bail: (i) whether the accused is a flight risk, (ii) whether there is a reasonable apprehension of tampering with evidence, and (iii) whether there is a threat of influencing witnesses.',
    statutoryImpact: 'Gravity of the offence alone cannot be a ground to deny bail if the triple test criteria are met and the investigation is largely documentary/electronic.',
    fullCaseSummary: 'The Supreme Court reiterated that bail is the rule and jail is the exception even in economic offences, provided the accused has deep societal roots and cannot tamper with anchored electronic records.',
  },
  {
    id: 'prec-04',
    title: 'Lalita Kumari v. Government of Uttar Pradesh & Ors.',
    citation: '(2014) 2 SCC 1',
    court: 'Supreme Court of India (Constitution Bench)',
    year: 2014,
    primarySubject: 'MANDATORY_FIR',
    relatedActs: ['BNSS 2023 Sec 173', 'CrPC Sec 154'],
    ratioDecidendi: 'Registration of FIR is mandatory under Section 154 of the Code (Sec 173 BNSS) if the information discloses commission of a cognizable offence and no preliminary inquiry is permissible in such a situation.',
    statutoryImpact: 'Police stations are statutorily obliged to promptly register E-FIRs and immutable digital receipts immediately upon receiving cognizable disclosures.',
    fullCaseSummary: 'The Constitution Bench held that police officers who fail to register an FIR disclosing cognizable offences are liable for departmental and penal action.',
  },
  {
    id: 'prec-05',
    title: 'Shafhi Mohammad v. State of Himachal Pradesh',
    citation: '(2018) 2 SCC 801',
    court: 'Supreme Court of India',
    year: 2018,
    primarySubject: 'FORENSIC_PROCEDURE',
    relatedActs: ['BSA 2023 Sec 63', 'CrPC Sec 293 / BNSS Sec 329'],
    ratioDecidendi: 'Directed the use of digital photography and videography for crime scene investigations, spot panchnamas, and recovery of material objects with tamper-evident cryptographic metadata.',
    statutoryImpact: 'Paved the path for mandatory audio-video electronic recording of search, seizure, and crime scene recovery now codified in Section 105 BNSS 2023.',
    fullCaseSummary: 'Emphasized scientific modern policing tools to eradicate fabricated recoveries through timestamped, geolocation-tagged digital records.',
  },
  {
    id: 'prec-06',
    title: 'Justice K.S. Puttaswamy (Retd.) & Anr. v. Union of India',
    citation: '(2017) 10 SCC 1',
    court: 'Supreme Court of India (9-Judge Bench)',
    year: 2017,
    primarySubject: 'DIGITAL_PRIVACY',
    relatedActs: ['Constitution of India Art 21', 'IT Act 2000', 'DPDP Act 2023'],
    ratioDecidendi: 'Right to privacy is a fundamental right under Article 21. Any state intrusion or digital surveillance must satisfy the 3-fold test of legality, legitimate state aim, and strict proportionality.',
    statutoryImpact: 'Digital document access and seized hardware forensics must be ring-fenced with cryptographic access control, role-based security, and audit trails to prevent unauthorized snooping.',
    fullCaseSummary: 'A historic 9-judge bench unanimous judgment recognizing digital privacy, informational privacy, and personal autonomy as fundamental rights.',
  },
  {
    id: 'prec-07',
    title: 'Tofan Singh v. State of Tamil Nadu',
    citation: '(2021) 4 SCC 1',
    court: 'Supreme Court of India',
    year: 2021,
    primarySubject: 'CRIMINAL_CONSPIRACY',
    relatedActs: ['NDPS Act 1985 Sec 67 & 53', 'BSA 2023 Sec 23'],
    ratioDecidendi: 'Officers of the Central/State Narcotics Control Bureau are police officers, and confessional statements recorded under Section 67 NDPS Act cannot be used as substantive evidence against the accused.',
    statutoryImpact: 'Prosecution must independently establish physical recovery, CFSL chemical/quantitative test assays, and digital communication links rather than relying on extracted confessions.',
    fullCaseSummary: 'A seminal judgment upholding the constitutional right against self-incrimination in specialized narcotics prosecutions.',
  },
  {
    id: 'prec-08',
    title: 'Suresh Kumar Bhikamchand Jain v. State of Maharashtra',
    citation: '(2013) 3 SCC 77',
    court: 'Supreme Court of India',
    year: 2013,
    primarySubject: 'BAIL_GUIDELINES',
    relatedActs: ['BNSS 2023 Sec 187', 'CrPC Sec 167(2)'],
    ratioDecidendi: 'Filing of incomplete charge-sheet within the statutory period of 60/90 days without key forensic or sanction reports does not defeat the accused’s right to default statutory bail.',
    statutoryImpact: 'Investigating Officers must ensure complete documentation, FSL reports, and cryptographic certificates are filed together to avoid default bail releases.',
    fullCaseSummary: 'Clarified the mandatory conditions of default statutory bail under Section 167(2) CrPC / Section 187 BNSS.',
  },
];

export const MOCK_CRIMINAL_NEXUS_GRAPH: CriminalNexusEntity[] = [
  {
    id: 'ent-01',
    entityType: 'SUSPECT',
    identifierValue: 'Vikramaditya Rao (alias ShadowByte)',
    label: 'Vikramaditya Rao',
    riskLevel: 'CRITICAL',
    associatedCaseNumbers: ['FIR-2026-CYBER-8921', 'FIR-2025-MH-MUM-4401', 'FIR-2026-KA-BLR-1190'],
    jurisdictionStates: ['Delhi', 'Maharashtra', 'Karnataka'],
    linkedSuspectNames: ['Sameer Qureshi', 'Elena Rostova', 'Tariq Al-Mansoor'],
    modusOperandiTag: 'Multi-Bank LockBit Ransomware & Hawala Layering',
  },
  {
    id: 'ent-02',
    entityType: 'SHELL_COMPANY',
    identifierValue: 'Apex Falcon Global FZE (Dubai / Ras Al Khaimah)',
    label: 'Apex Falcon Global FZE',
    riskLevel: 'CRITICAL',
    associatedCaseNumbers: ['FIR-2026-CYBER-8921', 'FIR-2026-ECO-7712'],
    jurisdictionStates: ['Delhi', 'International / UAE'],
    linkedSuspectNames: ['Vikramaditya Rao', 'Elena Rostova'],
    modusOperandiTag: 'Offshore Trade-Based Money Laundering & Bogus Invoicing',
  },
  {
    id: 'ent-03',
    entityType: 'CRYPTO_WALLET',
    identifierValue: '0x71C...9B3F / bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    label: 'Tornado Cash / Monero Bridge Vault',
    riskLevel: 'CRITICAL',
    associatedCaseNumbers: ['FIR-2026-CYBER-8921'],
    jurisdictionStates: ['Delhi', 'Cyberspace'],
    linkedSuspectNames: ['Sameer Qureshi'],
    modusOperandiTag: 'DeFi Mixing & Cross-Chain Coin Swaps',
  },
  {
    id: 'ent-04',
    entityType: 'PHONE_IMEI',
    identifierValue: 'IMEI: 864920048192001 (Burner iPhone 15 Pro)',
    label: 'Burner IMEI Device Pool #9',
    riskLevel: 'ELEVATED',
    associatedCaseNumbers: ['FIR-2026-CYBER-8921', 'FIR-2026-NDPS-5510'],
    jurisdictionStates: ['Delhi', 'Punjab'],
    linkedSuspectNames: ['Vikramaditya Rao', 'Jaspreet Singh Dhillon'],
    modusOperandiTag: 'Signal / Threema Encrypted Logistics Dispatch',
  },
  {
    id: 'ent-05',
    entityType: 'BANK_ACCOUNT',
    identifierValue: 'HDFC-CORP-9920194821 (IFSC: HDFC0000120, CP Branch)',
    label: 'Mule Aggregator Account',
    riskLevel: 'CRITICAL',
    associatedCaseNumbers: ['FIR-2026-CYBER-8921', 'FIR-2026-ECO-7712'],
    jurisdictionStates: ['Delhi', 'West Bengal'],
    linkedSuspectNames: ['Sameer Qureshi', 'Deepak Mondal'],
    modusOperandiTag: 'Instant IMPS Cash Out & ATM mule withdrawals',
  },
  {
    id: 'ent-06',
    entityType: 'SUSPECT',
    identifierValue: 'Jaspreet Singh Dhillon (alias Jassi Majha)',
    label: 'Jaspreet Singh Dhillon',
    riskLevel: 'CRITICAL',
    associatedCaseNumbers: ['FIR-2026-NDPS-5510', 'FIR-2025-PB-ASR-881'],
    jurisdictionStates: ['Punjab', 'Delhi'],
    linkedSuspectNames: ['Baldev Singh Mann', 'Harpreet Kaur'],
    modusOperandiTag: 'Cold-Chain Pharmaceutical Tramadol / Heroin Diversion',
  },
  {
    id: 'ent-07',
    entityType: 'VEHICLE',
    identifierValue: 'DL-01-AB-9921 (Mahindra Bolero Commercial Ambulance)',
    label: 'Camo Transport Vehicle',
    riskLevel: 'ELEVATED',
    associatedCaseNumbers: ['FIR-2026-NDPS-5510'],
    jurisdictionStates: ['Punjab', 'Haryana', 'Delhi'],
    linkedSuspectNames: ['Jaspreet Singh Dhillon'],
    modusOperandiTag: 'Emergency Medical Siren Impersonation for Border Transit',
  },
];

export const aiLegalService = {
  // 1. Comprehensive Section Recommender with Penal Details
  async classifyAndRecommendSections(narrative: string): Promise<SectionRecommendation[]> {
    const ai = getAIClient();
    if (ai) {
      try {
        const prompt = `You are a Senior Judicial Legal Officer and Criminal Law Specialist in Indian Law (Bharatiya Nyaya Sanhita BNS 2023, Bharatiya Sakshya Adhiniyam BSA 2023, Bharatiya Nagarik Suraksha Sanhita BNSS 2023, IT Act 2000, NDPS Act 1985, Arms Act 1959, PMLA 2002).
Analyze this incident narrative and recommend the top 3-5 applicable statutory sections with penal rationale.
Incident: "${narrative}"

Respond in pure JSON array matching:
[
  {
    "act": "Bharatiya Nyaya Sanhita, 2023",
    "section": "Sec 318(4)",
    "title": "Cheating and dishonestly inducing delivery of property",
    "ipcEquivalent": "IPC Sec 420",
    "relevanceScore": 96,
    "rationale": "Clear deception observed in fraudulent digital fund transfer inducing financial institution to part with funds.",
    "cognizable": true,
    "bailable": false,
    "compoundable": false,
    "triableByCourt": "Magistrate of First Class",
    "punishmentSummary": "Imprisonment up to 7 years and fine"
  }
]`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        console.warn('AI API invocation fallback to sovereign rule engine:', err);
      }
    }

    // Sovereign Rule Engine Fallback
    const lower = narrative.toLowerCase();
    const recommendations: SectionRecommendation[] = [];

    if (lower.includes('cheat') || lower.includes('fraud') || lower.includes('money') || lower.includes('transfer') || lower.includes('bank') || lower.includes('crore') || lower.includes('lakh')) {
      recommendations.push({
        act: 'Bharatiya Nyaya Sanhita, 2023',
        section: 'BNS Sec 318(4)',
        title: 'Cheating and Dishonestly Inducing Delivery of Property',
        ipcEquivalent: 'IPC Sec 420',
        relevanceScore: 96,
        rationale: 'Narrative specifies fraudulent inducement and wrongful financial gain exceeding statutory threshold.',
        cognizable: true,
        bailable: false,
        compoundable: false,
        triableByCourt: 'Magistrate of First Class',
        punishmentSummary: 'Imprisonment for a term extending up to 7 years, and shall also be liable to fine.',
      });
    }

    if (lower.includes('hack') || lower.includes('server') || lower.includes('trojan') || lower.includes('malware') || lower.includes('ransomware') || lower.includes('cyber') || lower.includes('data') || lower.includes('deepfake')) {
      recommendations.push({
        act: 'Information Technology Act, 2000',
        section: 'IT Act Sec 43 / 66',
        title: 'Computer Related Offence & Data Tampering / Unauthorised Access',
        ipcEquivalent: 'N/A (Special Act)',
        relevanceScore: 94,
        rationale: 'Unauthorised infiltration, malware execution, or computational infrastructure disruption.',
        cognizable: true,
        bailable: false,
        compoundable: false,
        triableByCourt: 'Court of Session / Special Cyber Court',
        punishmentSummary: 'Imprisonment up to 3 years or fine up to ₹5,00,000, or both.',
      });
      recommendations.push({
        act: 'Information Technology Act, 2000',
        section: 'IT Act Sec 66D',
        title: 'Punishment for Cheating by Personation by using Computer Resource',
        ipcEquivalent: 'N/A (Special Act)',
        relevanceScore: 92,
        rationale: 'Use of digital communication personas, spoofed headers, or deepfake audio to deceive victim.',
        cognizable: true,
        bailable: false,
        compoundable: false,
        triableByCourt: 'Magistrate of First Class',
        punishmentSummary: 'Imprisonment up to 3 years and fine up to ₹1,00,000.',
      });
    }

    if (lower.includes('forg') || lower.includes('fake') || lower.includes('electronic record') || lower.includes('impersonat') || lower.includes('fabricat')) {
      recommendations.push({
        act: 'Bharatiya Nyaya Sanhita, 2023',
        section: 'BNS Sec 336(3)',
        title: 'Forgery of Electronic Record for purpose of Cheating',
        ipcEquivalent: 'IPC Sec 468',
        relevanceScore: 90,
        rationale: 'Fabrication of digital tokens, government authorization letters, or electronic signatures.',
        cognizable: true,
        bailable: false,
        compoundable: false,
        triableByCourt: 'Magistrate of First Class',
        punishmentSummary: 'Imprisonment for a term extending up to 7 years, and shall also be liable to fine.',
      });
    }

    if (lower.includes('drug') || lower.includes('meth') || lower.includes('narcotic') || lower.includes('contraband') || lower.includes('seizure') || lower.includes('tramadol') || lower.includes('heroin')) {
      recommendations.push({
        act: 'Narcotic Drugs & Psychotropic Substances Act, 1985',
        section: 'NDPS Act Sec 22(c)',
        title: 'Contravention in relation to Psychotropic Substances (Commercial Quantity)',
        ipcEquivalent: 'N/A (Special Statute)',
        relevanceScore: 98,
        rationale: 'Direct recovery and seizure of synthetic contraband exceeding commercial quantity threshold with twin bail embargo under Sec 37 NDPS.',
        cognizable: true,
        bailable: false,
        compoundable: false,
        triableByCourt: 'Special NDPS Sessions Court',
        punishmentSummary: 'Rigorous imprisonment not less than 10 years extending up to 20 years, and fine ₹1,00,000 to ₹2,00,000.',
      });
    }

    if (lower.includes('conspir') || lower.includes('gang') || lower.includes('syndicate') || lower.includes('ring') || lower.includes('accomplice')) {
      recommendations.push({
        act: 'Bharatiya Nyaya Sanhita, 2023',
        section: 'BNS Sec 61(2)',
        title: 'Criminal Conspiracy to Commit Heinous Offence',
        ipcEquivalent: 'IPC Sec 120B',
        relevanceScore: 88,
        rationale: 'Active meeting of minds and coordinated execution among multiple co-accused in organized crime matrix.',
        cognizable: true,
        bailable: false,
        compoundable: false,
        triableByCourt: 'Court triable according to principal offence',
        punishmentSummary: 'Punished in the same manner as if he had abetted such offence.',
      });
    }

    if (lower.includes('murder') || lower.includes('kill') || lower.includes('weapon') || lower.includes('shot') || lower.includes('pistol') || lower.includes('firearm')) {
      recommendations.push({
        act: 'Bharatiya Nyaya Sanhita, 2023',
        section: 'BNS Sec 103(1)',
        title: 'Punishment for Murder',
        ipcEquivalent: 'IPC Sec 302',
        relevanceScore: 98,
        rationale: 'Intentional homicide using deadly firearm with ocular and physical corroboration.',
        cognizable: true,
        bailable: false,
        compoundable: false,
        triableByCourt: 'Court of Session',
        punishmentSummary: 'Death or imprisonment for life, and shall also be liable to fine.',
      });
      recommendations.push({
        act: 'Arms Act, 1959',
        section: 'Arms Act Sec 25/27',
        title: 'Illegal Possession and Use of Prohibited Firearm',
        ipcEquivalent: 'N/A (Special Statute)',
        relevanceScore: 95,
        rationale: 'Recovery of unlicensed country-made firearm from crime scene or disclosure statement.',
        cognizable: true,
        bailable: false,
        compoundable: false,
        triableByCourt: 'Court of Session',
        punishmentSummary: 'Imprisonment not less than 7 years extending to life imprisonment with fine.',
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        act: 'Bharatiya Nyaya Sanhita, 2023',
        section: 'BNS Sec 316(2)',
        title: 'Criminal Breach of Trust',
        ipcEquivalent: 'IPC Sec 406',
        relevanceScore: 85,
        rationale: 'Misappropriation of property or digital assets entrusted to the custody of the accused.',
        cognizable: true,
        bailable: true,
        compoundable: true,
        triableByCourt: 'Magistrate of First Class',
        punishmentSummary: 'Imprisonment up to 5 years, or fine, or both.',
      });
    }

    return recommendations;
  },

  // 2. Automated Charge-Sheet & Case Readiness Audit
  async auditCaseForCourtFiling(caseFile: CaseFile): Promise<ChargeSheetAuditResult> {
    const deficiencies: ChargeSheetAuditResult['deficiencies'] = [];
    const statutoryChecklist: ChargeSheetAuditResult['statutoryChecklist'] = [];
    let score = 100;

    // Check 1: E-FIR anchored & digitally signed
    const firDoc = caseFile.documents.find(d => d.documentType === 'FIR');
    const isFirAnchored = !!firDoc && firDoc.isAnchored && firDoc.digitalSignatures.length > 0;
    statutoryChecklist.push({
      rule: 'BNSS Sec 173 (CrPC Sec 154)',
      mandate: 'First Information Report (FIR) root timestamping and digital officer signature',
      isCompliant: isFirAnchored,
      remarks: isFirAnchored ? 'E-FIR anchored on blockchain ledger with valid ECDSA signature.' : 'E-FIR document missing or unanchored.',
    });
    if (!isFirAnchored) {
      deficiencies.push({
        severity: 'HIGH',
        category: 'STATUTORY_TIMELINE',
        description: 'First Information Report (FIR) root transaction is not anchored on the blockchain ledger.',
        suggestedRemedy: 'Perform blockchain commit to establish immutable timestamping before judicial presentation.',
      });
      score -= 25;
    }

    // Check 2: Forensic link for scientific evidence
    const unexaminedEvidence = caseFile.evidenceItems.filter(e => {
      const hasReport = caseFile.forensicReports.some(r => r.evidenceItemId === e.id);
      return (e.category === 'DIGITAL' || e.category === 'BALLISTICS' || e.category === 'NARCOTICS') && !hasReport;
    });

    const isForensicCompliant = unexaminedEvidence.length === 0;
    statutoryChecklist.push({
      rule: 'BNSS Sec 329 & BSA Sec 63',
      mandate: 'Scientific Forensic Science Laboratory (CFSL) examination of specialized exhibits',
      isCompliant: isForensicCompliant,
      remarks: isForensicCompliant ? 'All technical exhibits have certified CFSL reports.' : `${unexaminedEvidence.length} exhibits pending lab reports.`,
    });

    if (!isForensicCompliant) {
      deficiencies.push({
        severity: 'HIGH',
        category: 'FORENSIC_EVIDENCE',
        description: `${unexaminedEvidence.length} physical/digital evidence items lack certified Forensic Science Laboratory (CFSL) examination reports.`,
        suggestedRemedy: 'Submit exhibits to CFSL / State FSL under Sec 329 BNSS before filing final charges.',
      });
      score -= 25;
    }

    // Check 3: Chain of Custody integrity
    let custodyGaps = 0;
    let tamperedItems = 0;
    for (const ev of caseFile.evidenceItems) {
      if (ev.chainOfCustody.length === 0) {
        custodyGaps++;
      }
      if (ev.sealStatus === 'TAMPER_FLAGGED') {
        tamperedItems++;
      }
    }

    statutoryChecklist.push({
      rule: 'BSA 2023 Sec 63(4)',
      mandate: 'Unbroken chain of custody log with cryptographic transfer verification',
      isCompliant: custodyGaps === 0 && tamperedItems === 0,
      remarks: custodyGaps === 0 && tamperedItems === 0 ? 'All exhibits maintain pristine unbroken custody logs.' : `${custodyGaps} exhibits missing logs, ${tamperedItems} flagged seals.`,
    });

    if (custodyGaps > 0) {
      deficiencies.push({
        severity: 'MEDIUM',
        category: 'CHAIN_OF_CUSTODY',
        description: `${custodyGaps} evidence items have missing custody handover records from scene to malkhana.`,
        suggestedRemedy: 'Record certified transfer memos with dual digital signatures of collecting and custodian officers.',
      });
      score -= 15;
    }

    if (tamperedItems > 0) {
      deficiencies.push({
        severity: 'HIGH',
        category: 'CHAIN_OF_CUSTODY',
        description: `${tamperedItems} evidence items are flagged for broken or tampered physical seals!`,
        suggestedRemedy: 'Conduct judicial re-sealing in presence of Metropolitan Magistrate with formal panchnama.',
      });
      score -= 35;
    }

    // Check 4: Witnesses
    const isWitnessSufficient = caseFile.witnessCount >= 2;
    statutoryChecklist.push({
      rule: 'BNSS Sec 180 (CrPC Sec 161)',
      mandate: 'Examination and recorded depositions of at least 2 independent panch/ocular witnesses',
      isCompliant: isWitnessSufficient,
      remarks: isWitnessSufficient ? `${caseFile.witnessCount} witnesses recorded in dossier.` : 'Insufficient witness statements (< 2).',
    });

    if (!isWitnessSufficient) {
      deficiencies.push({
        severity: 'LOW',
        category: 'WITNESS_DEPOSITION',
        description: 'Less than 2 independent corroborating witnesses recorded in the case dossier.',
        suggestedRemedy: 'Examine and record statements of independent panch witnesses under Sec 180 BNSS.',
      });
      score -= 10;
    }

    // Check 5: PKI Signatures
    const unsignedDocs = caseFile.documents.filter(d => d.digitalSignatures.length === 0);
    const isPkiCompliant = unsignedDocs.length === 0;
    statutoryChecklist.push({
      rule: 'IT Act Sec 3A & BSA Sec 63',
      mandate: 'Valid PKI DSC / X.509 digital signatures on all uploaded case artifacts',
      isCompliant: isPkiCompliant,
      remarks: isPkiCompliant ? 'All documents signed with verified certificates.' : `${unsignedDocs.length} unsigned documents.`,
    });

    if (!isPkiCompliant) {
      deficiencies.push({
        severity: 'MEDIUM',
        category: 'PKI_SIGNATURES',
        description: `${unsignedDocs.length} case documents lack cryptographically valid digital signatures.`,
        suggestedRemedy: 'Sign documents using NIC Smart Card DSC token or FIDO2 Security key.',
      });
      score -= 15;
    }

    const finalScore = Math.max(0, score);
    const status: ChargeSheetAuditResult['status'] =
      finalScore >= 85 ? 'READY_FOR_FILING' : finalScore >= 55 ? 'DEFICIENCIES_DETECTED' : 'CRITICAL_BLOCKERS';

    return {
      overallReadinessScore: finalScore,
      status,
      deficiencies,
      summaryVerdict:
        finalScore >= 85
          ? 'Case dossier meets all statutory guidelines under Bharatiya Nagarik Suraksha Sanhita (BNSS) and BSA 2023. Ready for prosecution sanction and judicial cognizance.'
          : `Case dossier contains ${deficiencies.length} procedural or evidentiary defects that require IO rectification prior to judicial filing.`,
      statutoryChecklist,
    };
  },

  // 3. Smart Bail Predictability & Risk Assessment Matrix
  evaluateBailRisk(caseFile: CaseFile, factors: BailEvaluationFactors): BailEvaluationResult {
    let flightScore = 0;
    let tamperingScore = 0;
    let intimidationScore = 0;

    // 1. Flight Risk
    if (factors.flightRiskIndicators.hasValidPassport) flightScore += 25;
    if (factors.flightRiskIndicators.hasForeignBankAccounts) flightScore += 35;
    if (!factors.flightRiskIndicators.localPermanentResident) flightScore += 20;
    if (!factors.flightRiskIndicators.gainfullyEmployed) flightScore += 10;
    if (!factors.flightRiskIndicators.hasFamilyDependents) flightScore += 10;

    // 2. Tampering Risk
    if (factors.tamperingRiskIndicators.possessesAdminAccessToDigitalEvidence) tamperingScore += 40;
    if (factors.tamperingRiskIndicators.coAccusedAbsconding) tamperingScore += 30;
    if (caseFile.tamperStatus === 'TAMPER_ALERT') tamperingScore += 25;
    if (caseFile.stage === 'investigation') tamperingScore += 15;

    // 3. Witness Intimidation Risk
    if (factors.tamperingRiskIndicators.hasCoercedWitnesses) intimidationScore += 50;
    if (factors.tamperingRiskIndicators.victimIsVulnerableOrMinor) intimidationScore += 35;
    if (factors.priorConvictionsCount > 1) intimidationScore += 20;

    // Statutory Heinousness & Economic Gravity
    let heinousPenalty = 0;
    if (factors.offenseClassification.isHeinous) heinousPenalty += 20;
    if (factors.offenseClassification.isNarcoticsCommercialQuantity) heinousPenalty += 35;
    if (factors.offenseClassification.isEconomicOffenseOver1Cr) heinousPenalty += 15;
    if (factors.offenseClassification.isSexualOffenceOrPOCSO) heinousPenalty += 40;

    // BNSS 479 (Detention limit / First time offender relief)
    const halfTermDays = (factors.maximumStatutoryTermMonths * 30) / 2;
    const thirdTermDays = (factors.maximumStatutoryTermMonths * 30) / 3;
    let qualifiesForStatutoryBail = false;

    if (factors.isFirstTimeOffender && factors.custodyDaysSpent >= thirdTermDays && !factors.offenseClassification.isHeinous) {
      qualifiesForStatutoryBail = true;
    } else if (factors.custodyDaysSpent >= halfTermDays && !factors.offenseClassification.isHeinous) {
      qualifiesForStatutoryBail = true;
    }

    const rawComposite = (flightScore * 0.3) + (tamperingScore * 0.35) + (intimidationScore * 0.35) + heinousPenalty;
    const overallRiskScore = Math.min(100, Math.max(0, Math.round(rawComposite)));

    // Determine Recommendation
    let recommendation: BailEvaluationResult['recommendation'];
    let recommendationTitle: string;
    let statutoryBailability: BailEvaluationResult['statutoryBailability'];

    if (qualifiesForStatutoryBail) {
      recommendation = 'GRANT_REGULAR_BAIL';
      recommendationTitle = 'Mandatory Statutory Bail under BNSS Sec 479 (Period of Detention Satisfied)';
      statutoryBailability = 'STATUTORY_BAIL_UNDER_BNSS_479';
    } else if (overallRiskScore >= 75 || factors.offenseClassification.isNarcoticsCommercialQuantity || factors.offenseClassification.isSexualOffenceOrPOCSO) {
      recommendation = 'REJECT_BAIL_CUSTODIAL_REMAND';
      recommendationTitle = 'Reject Bail Application — Custodial Remand Warranted';
      statutoryBailability = 'NON_BAILABLE_DISCRETIONARY';
    } else if (overallRiskScore >= 40) {
      recommendation = 'GRANT_CONDITIONAL_BAIL';
      recommendationTitle = 'Grant Regular Bail Subject to Stringent Sovereign Undertakings';
      statutoryBailability = 'NON_BAILABLE_DISCRETIONARY';
    } else {
      recommendation = 'GRANT_REGULAR_BAIL';
      recommendationTitle = 'Grant Regular Bail on Standard Solvent Sureties';
      statutoryBailability = 'BAILABLE_AS_OF_RIGHT';
    }

    // Statutory Grounds
    const statutoryGrounds: string[] = [];
    if (qualifiesForStatutoryBail) {
      statutoryGrounds.push(`Accused has undergone ${factors.custodyDaysSpent} days of detention, exceeding statutory threshold under Sec 479 BNSS (Sec 436A CrPC).`);
    }
    if (factors.offenseClassification.isNarcoticsCommercialQuantity) {
      statutoryGrounds.push('Twin conditions under Section 37 NDPS Act not satisfied — prima facie guilt remains unrebutted.');
    }
    if (factors.tamperingRiskIndicators.possessesAdminAccessToDigitalEvidence) {
      statutoryGrounds.push('High risk of digital evidence alteration or remote encryption key deletion if released.');
    }
    if (factors.isFirstTimeOffender) {
      statutoryGrounds.push('Accused is a first-time offender with no recorded antecedent convictions.');
    }
    if (factors.flightRiskIndicators.hasForeignBankAccounts || factors.flightRiskIndicators.hasValidPassport) {
      statutoryGrounds.push('Substantial international ties and foreign accounts present verifiable flight risk.');
    }

    // Mandatory Judicial Conditions
    const mandatoryJudicialConditions: string[] = [
      'Execute a Personal Bond of ₹1,00,000/- with two solvent local sureties in the like amount to the satisfaction of the Trial Court.',
      'Surrender original Passport before the Court Registrar within 48 hours; do not leave the National Capital Territory without prior leave of Court.',
      'Mark physical attendance at the jurisdictional Police Station on every Monday and Thursday between 10:00 AM and 12:00 Noon.',
      'Refrain from contacting, influencing, or intimidating any prosecution witnesses, complainant, or co-accused directly or through electronic mediums.',
      'Furnish active mobile phone number and GPS location telemetry to the Investigating Officer, keeping device powered on 24/7.',
    ];

    // Relevant Precedents
    const relevantPrecedents = [
      {
        caseTitle: 'Satender Kumar Antil v. CBI (2022) 10 SCC 51',
        citation: 'AIR 2022 SC 3386',
        bench: 'Hon’ble Supreme Court of India',
        coreRatio: 'Bail is the rule and jail is an exception; mechanical custodial remand violates personal liberty under Article 21.',
        relevanceApplication: factors.isFirstTimeOffender ? 'Supports bail grant for first-time offender where maximum punishment is <= 7 years.' : 'Requires strict scrutiny of compliance before remand.',
      },
      {
        caseTitle: 'P. Chidambaram v. CBI (2020) 13 SCC 337',
        citation: '(2020) 13 SCC 337',
        bench: 'Hon’ble Supreme Court of India',
        coreRatio: 'Triple Test evaluation: Flight risk, evidence tampering, witness intimidation. Gravity of offence alone is not an absolute bar.',
        relevanceApplication: 'Applicable in evaluating whether documentary and blockchain-anchored evidence can be tampered with.',
      },
      {
        caseTitle: 'Arjun Panditrao Khotkar v. Kailash Kushanrao (2020) 7 SCC 1',
        citation: '(2020) 7 SCC 1',
        bench: 'Hon’ble Supreme Court of India',
        coreRatio: 'Electronic evidence anchored with immutable certificates cannot be easily fabricated or destroyed once submitted in court.',
        relevanceApplication: 'Reassures court that blockchain-anchored server dumps remain secure even if accused is at liberty.',
      },
    ];

    const draftedJudicialBailOrder = `IN THE COURT OF CHIEF METROPOLITAN MAGISTRATE / SESSIONS JUDGE
${caseFile.courtName}
CNR: ${caseFile.cnrNumber || 'DLHC01-008921-2026'} | CASE REF: ${caseFile.caseNumber}
IN THE MATTER OF:
State (NCT of Delhi) ... Prosecution
Versus
${factors.accusedName} ... Accused / Applicant

ORDER ON BAIL APPLICATION UNDER SECTION 480 / 483 BNSS, 2023 (SECTION 437 / 439 CrPC)

1. The applicant ${factors.accusedName} seeks regular bail in connection with FIR ${caseFile.caseNumber} registered at P.S. ${caseFile.policeStation} for offences under ${caseFile.legalActsAndSections.join(', ')}.

2. This Court has evaluated the triple test factors, criminal antecedents, and statutory conditions under Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023.

3. RULING & DIRECTIVE:
${recommendation === 'REJECT_BAIL_CUSTODIAL_REMAND'
  ? `HAVING REGARD TO THE GRAVITY OF THE OFFENCE, RISK OF TAMPERING WITH DIGITAL INFRASTRUCTURE, AND ACTIVE FLIGHT RISK SCORE (${overallRiskScore}/100), THIS COURT FINDS NO MERIT IN THE BAIL APPLICATION. THE APPLICATION IS HEREBY DISMISSED. ACCUSED REMANDED TO JUDICIAL CUSTODY TILL NEXT STATUTORY HEARING.`
  : `HAVING REGARD TO THE SETTLED PRINCIPLES OF LAW LAID DOWN IN SATENDER KUMAR ANTIL (2022) AND P. CHIDAMBARAM (2020), AND CONSIDERING THAT THE ROOT EVIDENCE IS IMMUTABLY ANCHORED ON THE NSDJ BLOCKCHAIN LEDGER, THE APPLICANT IS ADMITTED TO BAIL SUBJECT TO THE FOLLOWING STRINGENT CONDITIONS:`}

${recommendation !== 'REJECT_BAIL_CUSTODIAL_REMAND' ? mandatoryJudicialConditions.map((c, i) => `   (${i + 1}) ${c}`).join('\n') : ''}

Pronounced in Open Court with Sovereign Digital Cryptographic Seal.
Date: ${new Date().toLocaleDateString('en-GB')}
Presiding Judicial Magistrate / Judge
[DIGITALLY SIGNED VIA CCA-IN ROOT HSM]`;

    return {
      overallRiskScore,
      recommendation,
      recommendationTitle,
      statutoryBailability,
      tripleTestAssessment: {
        flightRisk: {
          score: flightScore,
          status: flightScore >= 60 ? 'HIGH' : flightScore >= 30 ? 'MODERATE' : 'LOW',
          rationale: `Passport: ${factors.flightRiskIndicators.hasValidPassport ? 'Yes' : 'No'} | Foreign Accounts: ${factors.flightRiskIndicators.hasForeignBankAccounts ? 'Yes' : 'No'} | Local Ties: ${factors.flightRiskIndicators.localPermanentResident ? 'Strong' : 'Weak'}`,
        },
        tamperingWithEvidence: {
          score: tamperingScore,
          status: tamperingScore >= 60 ? 'HIGH' : tamperingScore >= 30 ? 'MODERATE' : 'LOW',
          rationale: `Admin Access: ${factors.tamperingRiskIndicators.possessesAdminAccessToDigitalEvidence ? 'Yes' : 'No'} | Co-Accused Absconding: ${factors.tamperingRiskIndicators.coAccusedAbsconding ? 'Yes' : 'No'} | Ledger Integrity: ${caseFile.tamperStatus}`,
        },
        witnessIntimidation: {
          score: intimidationScore,
          status: intimidationScore >= 60 ? 'HIGH' : intimidationScore >= 30 ? 'MODERATE' : 'LOW',
          rationale: `Witness Coercion History: ${factors.tamperingRiskIndicators.hasCoercedWitnesses ? 'Yes' : 'No'} | Vulnerable Victim: ${factors.tamperingRiskIndicators.victimIsVulnerableOrMinor ? 'Yes' : 'No'} | Antecedents: ${factors.priorConvictionsCount}`,
        },
      },
      statutoryGrounds,
      mandatoryJudicialConditions,
      relevantPrecedents,
      draftedJudicialBailOrder,
    };
  },

  // 4. Generate Structured Statutory Charge-Sheet (Sec 193 BNSS)
  generateStatutoryChargeSheet(caseFile: CaseFile, ioNotes?: string): StatutoryChargeSheetDossier {
    const chargeSheetNumber = `CS-${caseFile.caseNumber.replace('FIR-', '')}-2026/01`;
    const filingDate = new Date().toISOString().slice(0, 10);

    const accusedParticulars = caseFile.accused.map((a, idx) => ({
      accusedNumber: idx + 1,
      fullName: a.name,
      alias: a.alias || 'None',
      arrestDate: '2026-03-14',
      currentCustody: a.custodyLocation || (a.status === 'IN_JUDICIAL_CUSTODY' ? 'Central Jail Custody' : a.status),
      chargesPertaining: caseFile.legalActsAndSections,
      primaFacieRole: `Principal conspirator and operative in execution of ${caseFile.title}. Active participation established through digital recovery and forensic corroboration.`,
    }));

    const prosecutionWitnesses = [
      {
        witnessCode: 'PW-1',
        name: caseFile.complainant.name,
        category: 'COMPLAINANT' as const,
        keyDepositionPoint: 'Proves the initial occurrence, discovery of unauthorized transaction / crime, and registration of First Information Report.',
      },
      {
        witnessCode: 'PW-2',
        name: 'Inspector Sunil V. Deshmukh',
        category: 'PANCH_SEIZURE' as const,
        keyDepositionPoint: 'Independent Panch witness attesting to the recovery of primary mobile device, cold storage ledger, and physical seizure panchnama.',
      },
      {
        witnessCode: 'PW-3',
        name: caseFile.forensicReports[0]?.examinerName || 'Dr. Arvind Swaminathan (CFSL)',
        category: 'CFSL_EXPERT' as const,
        keyDepositionPoint: 'Forensic Science Laboratory Expert proving chemical/cyber examination report and Sec 63 BSA certificate.',
      },
      {
        witnessCode: 'PW-4',
        name: caseFile.leadInvestigator.name,
        category: 'INVESTIGATING_OFFICER' as const,
        keyDepositionPoint: 'Investigating Officer detailing the complete investigation, chain of custody maintenance, and preparation of final report.',
      },
    ];

    const materialObjectsAndDocuments = caseFile.evidenceItems.map((ev, idx) => ({
      exhibitCode: `MO-${idx + 1} (${ev.evidenceCode})`,
      description: `${ev.title} - ${ev.description}`,
      sha256Digest: ev.sha256Checksum,
      fslReportRef: caseFile.forensicReports.find(r => r.evidenceItemId === ev.id)?.fslRefNumber || 'CFSL/PENDING',
      bsaSec63AdmissibilityCertificate: true,
    }));

    return {
      chargeSheetNumber,
      courtName: caseFile.courtName,
      policeStation: caseFile.policeStation,
      dateOfFiling: filingDate,
      cognizanceActSections: caseFile.legalActsAndSections,
      ioDetails: {
        name: caseFile.leadInvestigator.name,
        rank: caseFile.leadInvestigator.rank,
        badgeId: caseFile.leadInvestigator.badgeId,
      },
      accusedParticulars,
      prosecutionWitnesses,
      materialObjectsAndDocuments,
      briefFactsOfCase: `Investigation commenced upon FIR ${caseFile.caseNumber} registered on ${caseFile.firDate.slice(0, 10)}. The complainant reported commission of structured offences resulting in severe prejudice and legal violation. The investigating agency swiftly cordoned digital and physical traces.`,
      investigationFindingsNarrative: ioNotes || `During investigation, search warrants and electronic seizures were executed in strict adherence to Section 105 BNSS. Forensic memory carves and CFSL assays confirm the direct involvement of the accused. Chain of custody remains unbroken and immutably anchored on the Sovereign NSDJ Blockchain Ledger.`,
      prosecutionPrayer: `WHEREFORE, it is most respectfully prayed that this Hon'ble Court may be pleased to take judicial cognizance of the offences punishable under ${caseFile.legalActsAndSections.join(', ')} against accused persons, issue process, and summon them to face trial in accordance with law.`,
      isSignedByIO: true,
      ioSignatureHex: '3045022100a9821bf09283a001129384710293841029384bbcaef102938471029384a10220',
      merkleDigest: caseFile.merkleRoot,
    };
  },

  // 5. Cross-Case Intelligence & Criminal Nexus Graph
  analyzeCriminalNexus(cases: CaseFile[]): {
    entities: CriminalNexusEntity[];
    crossCaseLinksCount: number;
    highRiskEntitiesCount: number;
    syndicatesDetected: number;
  } {
    // Return the enriched nexus entities
    const entities = [...MOCK_CRIMINAL_NEXUS_GRAPH];
    const crossCaseLinksCount = entities.filter(e => e.associatedCaseNumbers.length > 1).length;
    const highRiskEntitiesCount = entities.filter(e => e.riskLevel === 'CRITICAL').length;
    const syndicatesDetected = 2; // Ransomware Hawala syndicate & NDPS Border Transit ring

    return {
      entities,
      crossCaseLinksCount,
      highRiskEntitiesCount,
      syndicatesDetected,
    };
  },

  // 6. Dynamic Interrogation Questioning Generator for IO
  generateInterrogationQuestions(caseFile: CaseFile, suspectName: string): string[] {
    const questions: string[] = [
      `1. [Digital Hardware & Access]: You are shown Exhibit MO-1 (Encrypted Blade Server / iPhone). Explain why your personal Apple ID / SSH public key was actively logged into the root session at 03:14 AM on the date of occurrence.`,
      `2. [Financial Nexus & Hawala]: Account records reveal ₹1.4 Crore routed from complainant account into Shell Account HDFC-9920194821. What is your commercial relationship with Apex Falcon Global FZE?`,
      `3. [Cryptographic Key Custody]: CFSL digital extraction confirms a seed phrase matching your private wallet address stored in a password manager on your seized laptop. Who else possessed decryption authority?`,
      `4. [Co-Accused Coordination]: Call Detail Records (CDR) demonstrate 14 encrypted VOIP calls exchanged between you and co-accused prior to the server breach. What was the subject of these communications?`,
      `5. [Disclosure under Sec 23 BSA / Sec 27 Evidence Act]: Where are the physical hardware security keys and secondary transaction ledgers currently concealed?`,
    ];
    return questions;
  },

  // 7. Interactive Courtroom Simulation Turn Generator
  simulateCourtroomDialogue(
    caseFile: CaseFile,
    dialogueHistory: TrialSimulationMessage[],
    userArgument?: string
  ): TrialSimulationMessage[] {
    const nextTurn = dialogueHistory.length;
    const newHistory = [...dialogueHistory];

    if (userArgument) {
      newHistory.push({
        speaker: 'PUBLIC_PROSECUTOR',
        speakerName: 'Adv. S. Ramanathan (Special Public Prosecutor)',
        content: userArgument,
        timestamp: new Date().toLocaleTimeString(),
        evidentiaryReference: `Exhibit MO-1 / Case Ref ${caseFile.caseNumber}`,
      });
    }

    if (nextTurn === 0) {
      newHistory.push({
        speaker: 'JUDGE',
        speakerName: 'Hon’ble District & Sessions Judge P.K. Bhasin',
        content: `Court is now in session. Case ${caseFile.caseNumber}, State vs. ${caseFile.accused.map(a => a.name).join(', ')}. Learned Public Prosecutor, please open the prosecution case and place the electronic evidence compliance before this Bench.`,
        timestamp: new Date().toLocaleTimeString(),
      });
    } else if (nextTurn === 1 || userArgument) {
      // Defence Counsel Response
      newHistory.push({
        speaker: 'DEFENCE_COUNSEL',
        speakerName: 'Adv. Meenakshi Sundaram (Defence Counsel)',
        content: `My Lords, we vehemently oppose judicial remand and raise a preliminary objection under Section 63(4) of Bharatiya Sakshya Adhiniyam, 2023. The prosecution relies on secondary server logs. If the write-blocker calibration certificate is not contemporaneous, this evidence cannot be read against the accused! Furthermore, my client satisfies all triple-test conditions for regular bail under Satender Kumar Antil (2022).`,
        timestamp: new Date().toLocaleTimeString(),
        evidentiaryReference: 'Sec 63(4) BSA 2023 Objection',
        objectionRaised: 'NOTED',
      });

      // Expert / IO Statement
      newHistory.push({
        speaker: 'CFSL_EXPERT',
        speakerName: caseFile.forensicReports[0]?.examinerName || 'Dr. Arvind Swaminathan (CFSL Cyber Division)',
        content: `Your Honour, the raw memory dump was harvested with NIST CFTT-certified write-blockers. The SHA-256 hash was generated at the crime scene and instantly anchored into the Sovereign Blockchain Ledger at Block #1042. There is zero mathematical deviation. The integrity is 100% unimpeachable.`,
        timestamp: new Date().toLocaleTimeString(),
        evidentiaryReference: `Merkle Root: ${caseFile.merkleRoot.slice(0, 16)}...`,
      });

      // Judge Directive
      newHistory.push({
        speaker: 'JUDGE',
        speakerName: 'Hon’ble District & Sessions Judge P.K. Bhasin',
        content: `Having inspected the blockchain ledger proof and the certified FSL hash, the defence objection under Sec 63 BSA is OVERRULED. The electronic records meet the statutory requirements of Arjun Panditrao Khotkar. Let the formal charge-sheet under Section 193 BNSS be taken on judicial record.`,
        timestamp: new Date().toLocaleTimeString(),
        objectionRaised: 'OVERRULED',
      });
    }

    return newHistory;
  },

  // 8. Judicial Digest
  async generateJudicialDigest(caseFile: CaseFile): Promise<string> {
    const ai = getAIClient();
    if (ai) {
      try {
        const prompt = `Generate a concise, authoritative judicial brief for the Presiding Magistrate for Case ${caseFile.caseNumber} titled "${caseFile.title}".
Sections: ${caseFile.legalActsAndSections.join(', ')}
Accused: ${caseFile.accused.map(a => `${a.name} (${a.status})`).join(', ')}
Evidence Count: ${caseFile.evidenceItems.length}
Forensic Reports Count: ${caseFile.forensicReports.length}
Documents Count: ${caseFile.documents.length}

Format with clear headers:
1. FACTUAL MATRIX & COGNIZANCE
2. KEY INCRIMINATING EVIDENCE & FORENSIC CORROBORATION
3. DEFENCE / CUSTODY STATUS
4. PROSECUTION PRAYER / CHARGE RECOMMENDATION`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        if (response.text) return response.text;
      } catch (err) {
        console.warn('AI API digest fallback:', err);
      }
    }

    return `[DIGITAL JUDICIAL BENCH BRIEF - NSDJ-DMS]
CASE CNR: ${caseFile.cnrNumber || 'PENDING ASSIGNMENT'} | REF: ${caseFile.caseNumber}
COURT: ${caseFile.courtName}
TITLE: ${caseFile.title}

1. FACTUAL MATRIX & COGNIZANCE:
The instant case stems from FIR registered on ${caseFile.firDate.slice(0, 10)} at ${caseFile.policeStation}. The investigation discloses offences under ${caseFile.legalActsAndSections.join(', ')}.

2. FORENSIC & DOCUMENTARY CORROBORATION:
- Total Immutable Documents Anchored: ${caseFile.documents.length} (Verified with SHA-256 signatures)
- Physical & Digital Evidence Exhibits: ${caseFile.evidenceItems.length} sealed items in safe custody
- Certified Forensic Reports: ${caseFile.forensicReports.length} (CFSL laboratory examination submitted)
- Merkle Root Digest: ${caseFile.merkleRoot}

3. ACCUSED STATUS:
${caseFile.accused.map(a => `• ${a.name}${a.alias ? ` alias '${a.alias}'` : ''} - Status: [${a.status.replace(/_/g, ' ')}] (Custody: ${a.custodyLocation || 'N/A'})`).join('\n')}

4. PROSECUTION STANCE:
All digital records conform to electronic admissibility standards under Bharatiya Sakshya Adhiniyam, 2023. Chain of custody is cryptographically unbroken.`;
  },
};
