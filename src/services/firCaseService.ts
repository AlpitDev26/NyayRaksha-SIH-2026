import {
  SupportedFIRLanguage,
  FIRLanguageMetadata,
  CaseDiaryEntry,
  InvestigationTask,
  WitnessStatementRecord,
  MultilingualFIRPayload,
} from '../types/firCase';
import { CaseFile, DocumentRecord } from '../types';
import { storageService } from './storageService';
import { authHierarchyService } from './authHierarchyService';
import { computeSHA256, generateDigitalSignature, generateStorageVaultURI } from './cryptoEngine';

export const FIR_LANGUAGES: Record<SupportedFIRLanguage, FIRLanguageMetadata> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    sampleComplainantStatement:
      'On 26th September at 18:30 hrs, two unidentified persons on a black motorbike intercepted the complainant near the metro station, brandished a country-made firearm, and forcibly snatched gold jewellery and ₹45,000 cash before fleeing towards the highway.',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    sampleComplainantStatement:
      'दिनांक 26 सितम्बर को सायं 18:30 बजे, मेट्रो स्टेशन के समीप दो अज्ञात व्यक्तियों ने काली मोटरसाइकिल पर आकर प्रार्थी को रोका, अवैध देशी कट्टा दिखाकर सोने के आभूषण एवं ₹45,000 नकद छीने और राष्ट्रीय राजमार्ग की ओर फरार हो गए।',
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    sampleComplainantStatement:
      'दिनांक २६ सप्टेंबर रोजी संध्याकाळी १८:३० वाजता मेट्रो स्टेशनजवळ काळ्या रंगाच्या मोटारसायकलवरून आलेल्या दोन अनोळखी इसमांनी फिर्यादीला अडवून, देशी पिस्तूल दाखवून सोन्याचे दागिने व रोख ₹४५,००० जबरदस्तीने हिसकावून महामार्गाच्या दिशेने पळ काढला.',
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    sampleComplainantStatement:
      'গত ২৬ সেপ্টেম্বর সন্ধ্যা ৬:৩০ মিনিটে মেট্রো স্টেশনের কাছে একটি কালো মোটরসাইকেলে দুই অজ্ঞাতপরিচয় ব্যক্তি অভিযোগকারীকে আটকায়, দেশি আগ্নেয়াস্ত্র দেখিয়ে সোনার গয়না এবং নগদ ৪৫,০০০ টাকা ছিনতাই করে হাইওয়ের দিকে পালিয়ে যায়।',
  },
  gu: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    sampleComplainantStatement:
      'તારીખ ૨૬ સપ્ટેમ્બરના રોજ સાંજે ૬:૩૦ વાગ્યે મેટ્રો સ્ટેશન નજીક કાળા રંગની બાઇક પર આવેલા બે અજાણ્યા શખ્સોએ ફરિયાદીને રોકી, દેશી પિસ્તોલ બતાવી સોનાના ઘરેણાં અને ₹૪૫,૦૦૦ રોકડા ઝૂંટવી હાઇવે તરફ નાસી છૂટ્યા હતા.',
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    sampleComplainantStatement:
      'செப்டம்பர் 26 அன்று மாலை 6:30 மணியளவில் மெட்ரோ ரயில் நிலையம் அருகே கருப்பு நிற இருசக்கர வாகனத்தில் வந்த அடையாளம் தெரியாத இருவர் புகார் தாரரை வழிமறித்து, நாட்டு துப்பாக்கியை காட்டி மிரட்டி தங்க நகைகள் மற்றும் ₹45,000 பணத்தை பறித்துக்கொண்டு நெடுஞ்சாலை நோக்கி தப்பிச் சென்றனர்.',
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    sampleComplainantStatement:
      'సెప్టెంబర్ 26వ తేదీ సాయంత్రం 6:30 గంటలకు మెట్రో స్టేషన్ సమీపంలో నల్లటి మోటార్ సైకిల్‌పై వచ్చిన ఇద్దరు గుర్తుతెలియని వ్యక్తులు ఫిర్యాదుదారుడిని అడ్డగించి, నాటు తుపాకీతో బెదిరించి బంగారు ఆభరణాలు మరియు ₹45,000 నగదును లాక్కొని హైవే వైపు పారిపోయారు.',
  },
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    sampleComplainantStatement:
      'ಸೆಪ್ಟೆಂಬರ್ 26 ರಂದು ಸಂಜೆ 6:30 ಕ್ಕೆ ಮೆಟ್ರೋ ನಿಲ್ದಾಣದ ಬಳಿ ಕಪ್ಪು ಮೋಟಾರ್ ಸೈಕಲ್ ನಲ್ಲಿ ಬಂದ ಇಬ್ಬರು ಅಪರಿಚಿತ ವ್ಯಕ್ತಿಗಳು ದೂರುದಾರರನ್ನು ತಡೆದು, ನಾಡ ಪಿಸ್ತೂಲ್ ತೋರಿಸಿ ಚಿನ್ನದ ಆಭರಣಗಳು ಮತ್ತು ₹45,000 ನಗದನ್ನು ಕಸಿದುಕೊಂಡು ಹೆದ್ದಾರಿಯತ್ತ ಪರಾರಿಯಾಗಿದ್ದಾರೆ.',
  },
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    sampleComplainantStatement:
      'സെപ്റ്റംബർ 26-ന് വൈകുന്നേരം 6:30-ന് മെട്രോ സ്റ്റേഷന് സമീപം കറുത്ത മോട്ടോർ സൈക്കിളിൽ എത്തിയ രണ്ട് അജ്ഞാതർ പരാതിക്കാരനെ തടഞ്ഞുനിർത്തി നാടൻ തോക്ക് കാണിച്ച് ഭീഷണിപ്പെടുത്തി സ്വർണ്ണാഭരണങ്ങളും ₹45,000 രൂപയും കവർന്ന് ഹൈവേയിലേക്ക് കടന്നുകളഞ്ഞു.',
  },
  pa: {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    sampleComplainantStatement:
      '26 ਸਤੰਬਰ ਨੂੰ ਸ਼ਾਮ 6:30 ਵਜੇ ਮੈਟਰੋ ਸਟੇਸ਼ਨ ਨੇੜੇ ਕਾਲੇ ਰੰਗ ਦੇ ਮੋਟਰਸਾਈਕਲ ਤੇ ਆਏ ਦੋ ਅਣਪਛਾਤੇ ਵਿਅਕਤੀਆਂ ਨੇ ਸ਼ਿਕਾਇਤਕਰਤਾ ਨੂੰ ਰੋਕਿਆ, ਦੇਸੀ ਪਿਸਤੌਲ ਦਿਖਾ ਕੇ ਸੋਨੇ ਦੇ ਗਹਿਣੇ ਅਤੇ ₹45,000 ਨਕਦ ਖੋਹ ਕੇ ਹਾਈਵੇ ਵੱਲ ਫਰਾਰ ਹੋ ਗਏ।',
  },
  or: {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    sampleComplainantStatement:
      '୨୬ ସେପ୍ଟେମ୍ବର ସନ୍ଧ୍ୟା ୬:୩୦ ସମୟରେ ମେଟ୍ରୋ ଷ୍ଟେସନ ନିକଟରେ କଳା ମୋଟରସାଇକେଲରେ ଆସିଥିବା ଦୁଇ ଅଜ୍ଞାତ ବ୍ୟକ୍ତି ଅଭିଯୋଗକାରୀଙ୍କୁ ଅଟକାଇ, ଦେଶୀ ବନ୍ଧୁକ ଦେଖାଇ ସୁନା ଅଳଙ୍କାର ଓ ₹୪୫,୦୦୦ ନଗଦ ଟଙ୍କା ଛଡ଼ାଇ ହାଇୱେ ଆଡ଼କୁ ଫେରାର ହୋଇଗଲେ।',
  },
  as: {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Bengali-Assamese',
    sampleComplainantStatement:
      '২৬ ছেপ্টেম্বৰত সন্ধিয়া ৬:৩০ বজাত মেট্ৰ’ ষ্টেচনৰ ওচৰত ক’লা মটৰচাইকেলত অহা দুজন অচিনাক্ত ব্যক্তিয়ে অভিযোগকাৰীক বাধা দি, দেশী বন্দুক দেখুৱাই সোণৰ আ-অলংকাৰ আৰু নগদ ৪৫,০০০ টকা কাঢ়ি লৈ হাইৱেৰ দিশে পলায়ন কৰে।',
  },
  ur: {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Perso-Arabic',
    sampleComplainantStatement:
      'مورخہ 26 ستمبر کو شام 6:30 بجے میٹرو اسٹیشن کے قریب کالی موٹر سائیکل پر سوار دو نامعلوم افراد نے مستغیث کو روکا، دیسی پستول دکھا کر سونے کے زیورات اور 45,000 روپے نقد چھین کر ہائی وے کی طرف فرار ہو گئے۔',
  },
};

const STORAGE_CASE_DIARIES = 'nsdj_case_diaries_v1';
const STORAGE_INVESTIGATION_TASKS = 'nsdj_investigation_tasks_v1';
const STORAGE_WITNESS_STATEMENTS = 'nsdj_witness_statements_v1';

class FirCaseService {
  private caseDiaries: CaseDiaryEntry[] = [];
  private tasks: InvestigationTask[] = [];
  private witnessStatements: WitnessStatementRecord[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    const savedDiaries = localStorage.getItem(STORAGE_CASE_DIARIES);
    if (savedDiaries) {
      try {
        this.caseDiaries = JSON.parse(savedDiaries);
      } catch {
        this.seedCaseDiaries();
      }
    } else {
      this.seedCaseDiaries();
    }

    const savedTasks = localStorage.getItem(STORAGE_INVESTIGATION_TASKS);
    if (savedTasks) {
      try {
        this.tasks = JSON.parse(savedTasks);
      } catch {
        this.seedTasks();
      }
    } else {
      this.seedTasks();
    }

    const savedStatements = localStorage.getItem(STORAGE_WITNESS_STATEMENTS);
    if (savedStatements) {
      try {
        this.witnessStatements = JSON.parse(savedStatements);
      } catch {
        this.seedWitnessStatements();
      }
    } else {
      this.seedWitnessStatements();
    }
  }

  private seedCaseDiaries() {
    this.caseDiaries = [
      {
        id: 'cd-8921-1',
        caseId: 'case-cyber-8921',
        caseNumber: 'FIR-2026-CYBER-8921',
        entryNumber: 1,
        entryDate: '2026-03-12',
        timeFrom: '10:30',
        timeTo: '17:00',
        investigationOfficer: 'ACP Raghavendra Sharma',
        badgeId: 'DP-CYB-8812',
        placesVisited: ['Data Center Core Grid, Okhla Phase III', 'Cyber Cell Crime Lab, Mandir Marg'],
        investigationSummary:
          'Arrived at primary bank data center. Seized firewall packet capture logs for window 23:00 to 02:00 IST. Conducted technical debriefing of bank system administrators.',
        witnessesExamined: ['Sudarshan Roy (CISO)', 'Vivek Anand (Senior DBA)'],
        seizuresEffected: ['Sealed USB drive containing 48GB packet trace capture (Mark PCAP-1)'],
        digitalSignatureHex: '3045022100e4b819f2014bca819e91823901ca9f10928a47812903fe8910283401022039a8bc',
        sha256Hash: '91823901ca9f10928a47812903fe8910283401022039a8bce4b819f2014bca81',
        blockchainTxId: '0x99a1f4b82c3d11e0a81239bf019284102938a1bcde0109283471029384aabbcc',
        createdAt: '2026-03-12T17:15:00Z',
      },
      {
        id: 'cd-8921-2',
        caseId: 'case-cyber-8921',
        caseNumber: 'FIR-2026-CYBER-8921',
        entryNumber: 2,
        entryDate: '2026-03-15',
        timeFrom: '14:00',
        timeTo: '21:30',
        investigationOfficer: 'Insp. Alok Vardhan',
        badgeId: 'DP-CYB-9102',
        placesVisited: ['Flat 902, Tower B, Sector 62, Noida (UP)'],
        investigationSummary:
          'Executed search warrant issued by Special Magistrate. Raided safehouse location. Apprehended accused Vikramaditya Rao with active command gateway servers.',
        witnessesExamined: ['Devendra Kumar (Govt Official Panch)', 'Subhash Chandra (Independent Panch)'],
        seizuresEffected: ['Dell PowerEdge R750 Server', 'Ledger Nano X Cold Wallet', '4 Encrypted Smart Devices'],
        digitalSignatureHex: '304502210091823901ca9f10928a47812903fe8910283401022039a8bce4b819f2014bca819e',
        sha256Hash: '4f3a8b29c1102938475610293847561029384756102938475610293847561029',
        blockchainTxId: '0x33b1f928c001928471029384aabbcc019284102938a1bcde99a1f4b82c3d11e0',
        createdAt: '2026-03-15T22:00:00Z',
      },
    ];
    this.saveDiaries();
  }

  private seedTasks() {
    this.tasks = [
      {
        id: 'task-8921-1',
        caseId: 'case-cyber-8921',
        caseNumber: 'FIR-2026-CYBER-8921',
        title: 'Requisition CFSL Volatile Memory Carving',
        description: 'Forward seized blade server to CFSL Lodhi Road under Sec 293 CrPC / Sec 329 BNSS for reverse engineering.',
        category: 'FORENSIC_REQUISITION',
        priority: 'HIGH',
        assignedToOfficer: 'Dr. Sunita Deshmukh',
        assignedOfficerBadge: 'CFSL-CYB-044',
        dueDate: '2026-04-05',
        status: 'COMPLETED',
        findingsNotes: 'CFSL report ref CFSL/DL/2026/CYBER-409 completed and anchored to blockchain.',
        completedAt: '2026-04-02T11:00:00Z',
      },
      {
        id: 'task-8921-2',
        caseId: 'case-cyber-8921',
        caseNumber: 'FIR-2026-CYBER-8921',
        title: 'Serve Sec 91 CrPC / Sec 94 BNSS Notice to Offshore Crypto Mixer',
        description: 'Issue mutual legal assistance treaty (MLAT) request for transaction hashing details linked to wallet 0x7B99.',
        category: 'CYBER_IP_TRACE',
        priority: 'URGENT',
        assignedToOfficer: 'ACP Raghavendra Sharma',
        assignedOfficerBadge: 'DP-CYB-8812',
        dueDate: '2026-10-10',
        status: 'IN_PROGRESS',
      },
      {
        id: 'task-4410-1',
        caseId: 'case-ndps-4410',
        caseNumber: 'FIR-2026-NDPS-4410',
        title: 'Conduct Magistrate Inventory & Sec 52A Sampling',
        description: 'Produce 14.5 kg seized Methamphetamine before Metropolitan Magistrate for inventory certification.',
        category: 'SEARCH_SEIZURE',
        priority: 'HIGH',
        assignedToOfficer: 'Superintendent K. S. Rathore',
        assignedOfficerBadge: 'NCB-MUM-4401',
        dueDate: '2026-05-20',
        status: 'COMPLETED',
        findingsNotes: 'Inventory certificate issued by Magistrate Court 37, Esplanade.',
        completedAt: '2026-05-19T11:30:00Z',
      },
    ];
    this.saveTasks();
  }

  private seedWitnessStatements() {
    this.witnessStatements = [
      {
        id: 'ws-8921-1',
        caseId: 'case-cyber-8921',
        caseNumber: 'FIR-2026-CYBER-8921',
        witnessName: 'Dr. Sudarshan Roy',
        witnessAge: 46,
        witnessAddress: 'C-44, Institutional Area, Pragati Vihar, New Delhi',
        witnessContact: '+91 98110 55443',
        statementType: 'SEC_180_BNSS_POLICE',
        statementVerbatim:
          'I am currently serving as CISO at NICB Bank. On the night of 11th March at 23:42, our automated SIEM alert detected abnormal token authorization spikes bypassing two-factor authentication on server cluster 04.',
        recordedLanguage: 'en',
        recordingOfficer: 'ACP Raghavendra Sharma',
        officerBadge: 'DP-CYB-8812',
        sha256Digest: 'a1b2c3d4e5f607182930415263748596a1b2c3d4e5f607182930415263748596',
        digitalSignatureHex: '3045022100e4b819f2014bca819e91823901ca9f10928a47812903fe8910283401022039a8bc',
        recordedAt: '2026-03-13T11:00:00Z',
        isSignedByWitness: true,
      },
    ];
    this.saveStatements();
  }

  private saveDiaries() {
    localStorage.setItem(STORAGE_CASE_DIARIES, JSON.stringify(this.caseDiaries));
  }

  private saveTasks() {
    localStorage.setItem(STORAGE_INVESTIGATION_TASKS, JSON.stringify(this.tasks));
  }

  private saveStatements() {
    localStorage.setItem(STORAGE_WITNESS_STATEMENTS, JSON.stringify(this.witnessStatements));
  }

  public getCaseDiaries(caseId?: string): CaseDiaryEntry[] {
    return caseId ? this.caseDiaries.filter((cd) => cd.caseId === caseId) : [...this.caseDiaries];
  }

  public getTasks(caseId?: string): InvestigationTask[] {
    return caseId ? this.tasks.filter((t) => t.caseId === caseId) : [...this.tasks];
  }

  public getWitnessStatements(caseId?: string): WitnessStatementRecord[] {
    return caseId ? this.witnessStatements.filter((ws) => ws.caseId === caseId) : [...this.witnessStatements];
  }

  // Create & Anchor New Case Diary Entry (Sec 192 BNSS)
  public async addCaseDiaryEntry(entryInput: {
    caseId: string;
    caseNumber: string;
    entryDate: string;
    timeFrom: string;
    timeTo: string;
    investigationOfficer: string;
    badgeId: string;
    placesVisited: string[];
    investigationSummary: string;
    witnessesExamined: string[];
    seizuresEffected: string[];
  }): Promise<CaseDiaryEntry> {
    const existingForCase = this.getCaseDiaries(entryInput.caseId);
    const entryNumber = existingForCase.length + 1;
    const createdAt = new Date().toISOString();

    const rawPayload = `${entryInput.caseNumber}:DIARY_${entryNumber}:${entryInput.entryDate}:${entryInput.investigationSummary}`;
    const sha256Hash = await computeSHA256(rawPayload);

    const sigData = await generateDigitalSignature(
      sha256Hash,
      entryInput.investigationOfficer,
      'Investigating Officer',
      'Police Department',
      entryInput.badgeId
    );

    const anchorResult = await storageService.ledger.anchorTransaction({
      timestamp: createdAt,
      docId: `doc-cd-${Date.now().toString(36)}`,
      caseNumber: entryInput.caseNumber,
      documentType: 'CASE_DIARY',
      sha256Hash,
      docStorageUri: generateStorageVaultURI(entryInput.caseNumber, 'CASE_DIARY', `cd-${entryNumber}`),
      metadataDigest: await computeSHA256(entryInput.placesVisited.join(',')),
      signatureHex: sigData.signatureHex,
      signerOrg: 'Police Investigation Unit',
      signerRole: 'Investigating Officer',
    });

    const newDiary: CaseDiaryEntry = {
      id: 'cd-' + Date.now().toString(36),
      caseId: entryInput.caseId,
      caseNumber: entryInput.caseNumber,
      entryNumber,
      entryDate: entryInput.entryDate,
      timeFrom: entryInput.timeFrom,
      timeTo: entryInput.timeTo,
      investigationOfficer: entryInput.investigationOfficer,
      badgeId: entryInput.badgeId,
      placesVisited: entryInput.placesVisited,
      investigationSummary: entryInput.investigationSummary,
      witnessesExamined: entryInput.witnessesExamined,
      seizuresEffected: entryInput.seizuresEffected,
      digitalSignatureHex: sigData.signatureHex,
      sha256Hash,
      blockchainTxId: anchorResult.transaction.txId,
      createdAt,
    };

    this.caseDiaries.unshift(newDiary);
    this.saveDiaries();

    await authHierarchyService.logAuditEvent({
      actionCode: 'CASE_DIARY_WRITE',
      targetEntityType: 'CASE',
      targetEntityId: entryInput.caseId,
      jurisdictionScope: entryInput.caseNumber,
      result: 'SUCCESS',
      details: `Logged Case Diary Entry #${entryNumber} under Sec 192 BNSS with blockchain anchor.`,
    });

    return newDiary;
  }

  // Create New Investigation Task
  public addTask(taskInput: Omit<InvestigationTask, 'id'>): InvestigationTask {
    const newTask: InvestigationTask = {
      ...taskInput,
      id: 'task-' + Date.now().toString(36),
    };
    this.tasks.unshift(newTask);
    this.saveTasks();
    return newTask;
  }

  public updateTaskStatus(taskId: string, status: InvestigationTask['status'], findingsNotes?: string): void {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      if (findingsNotes) task.findingsNotes = findingsNotes;
      if (status === 'COMPLETED') task.completedAt = new Date().toISOString();
      this.saveTasks();
    }
  }

  // Record Witness Statement under Section 180 BNSS / 161 CrPC
  public async recordWitnessStatement(statementInput: {
    caseId: string;
    caseNumber: string;
    witnessName: string;
    witnessAge: number;
    witnessAddress: string;
    witnessContact: string;
    statementType: WitnessStatementRecord['statementType'];
    statementVerbatim: string;
    recordedLanguage: SupportedFIRLanguage;
    recordingOfficer: string;
    officerBadge: string;
  }): Promise<WitnessStatementRecord> {
    const recordedAt = new Date().toISOString();
    const rawPayload = `${statementInput.caseNumber}:${statementInput.witnessName}:${statementInput.statementVerbatim}:${recordedAt}`;
    const sha256Digest = await computeSHA256(rawPayload);

    const sigData = await generateDigitalSignature(
      sha256Digest,
      statementInput.recordingOfficer,
      'Investigating Officer',
      'Police Department',
      statementInput.officerBadge
    );

    const newRecord: WitnessStatementRecord = {
      id: 'ws-' + Date.now().toString(36),
      caseId: statementInput.caseId,
      caseNumber: statementInput.caseNumber,
      witnessName: statementInput.witnessName,
      witnessAge: statementInput.witnessAge,
      witnessAddress: statementInput.witnessAddress,
      witnessContact: statementInput.witnessContact,
      statementType: statementInput.statementType,
      statementVerbatim: statementInput.statementVerbatim,
      recordedLanguage: statementInput.recordedLanguage,
      recordingOfficer: statementInput.recordingOfficer,
      officerBadge: statementInput.officerBadge,
      sha256Digest,
      digitalSignatureHex: sigData.signatureHex,
      recordedAt,
      isSignedByWitness: true,
    };

    this.witnessStatements.unshift(newRecord);
    this.saveStatements();

    // Also attach as official document in case vault
    await storageService.addDocument(statementInput.caseId, {
      title: `Witness Deposition: ${statementInput.witnessName} (${statementInput.statementType.replace(/_/g, ' ')})`,
      documentType: 'WITNESS_STATEMENT',
      classification: 'CONFIDENTIAL',
      fileFormat: 'TEXT',
      fileSizeKb: Math.max(80, Math.floor(statementInput.statementVerbatim.length / 8)),
      fileContent: `[SECTION 180 BNSS / 161 CRPC DEPOSITION OF WITNESS]
CASE NO: ${statementInput.caseNumber}
WITNESS: ${statementInput.witnessName}, Age: ${statementInput.witnessAge}
ADDRESS: ${statementInput.witnessAddress}
LANGUAGE RECORDED: ${statementInput.recordedLanguage.toUpperCase()}
STATEMENT VERBATIM:
${statementInput.statementVerbatim}
RECORDED BY: ${statementInput.recordingOfficer} (Badge: ${statementInput.officerBadge})`,
      uploaderName: statementInput.recordingOfficer,
      uploaderBadge: statementInput.officerBadge,
      uploaderRole: 'investigating_officer',
      uploaderDept: 'Investigation Unit',
    });

    return newRecord;
  }

  // Register Multilingual E-FIR with verbatim retention & optional translation
  public async registerMultilingualFIR(payload: MultilingualFIRPayload): Promise<CaseFile> {
    const createdTimestamp = new Date().toISOString();

    const title = `State vs. ${payload.accusedList[0]?.name || 'Unknown'} (${payload.actsAndSections[0] || 'Cognizable Offence'})`;

    const firNarrativeCombined = `[OFFICIAL E-FIR RECORD - LANGUAGE: ${payload.firLanguage.toUpperCase()} - SEC 173 BNSS]
ORIGINAL COMPLAINANT STATEMENT (VERBATIM RECORD):
${payload.verbatimStatementOriginal}

${
  payload.translatedStatementEnglish && payload.firLanguage !== 'en'
    ? `------------------------------------------------------------
[AI GENERATED TRANSLATION · NOT ORIGINAL LEGAL RECORD]
${payload.translatedStatementEnglish}
------------------------------------------------------------`
    : ''
}`;

    const newCase = await storageService.registerNewCase({
      caseNumber: payload.caseNumber,
      courtName: payload.courtName,
      policeStation: payload.policeStation,
      jurisdictionState: payload.state,
      title,
      legalActsAndSections: payload.actsAndSections,
      firDate: createdTimestamp,
      priority: 'HIGH_SENSITIVITY',
      leadInvestigator: {
        name: payload.officerName,
        rank: 'Inspector / Investigating Officer',
        badgeId: payload.officerBadge,
        phone: '+91 98110 12345',
      },
      complainant: {
        name: payload.complainantName,
        contact: payload.complainantPhone,
        address: payload.complainantAddress,
      },
      accused: payload.accusedList.map((a) => ({
        name: a.name || 'Unknown',
        alias: a.alias || undefined,
        status: a.status,
      })),
      witnessCount: 1,
      firNarrative: firNarrativeCombined,
      filingOfficerName: payload.officerName,
      filingOfficerBadge: payload.officerBadge,
      filingOfficerDept: payload.officerDept,
    });

    // Auto-create first Case Diary Entry for this FIR
    await this.addCaseDiaryEntry({
      caseId: newCase.id,
      caseNumber: newCase.caseNumber,
      entryDate: createdTimestamp.slice(0, 10),
      timeFrom: createdTimestamp.slice(11, 16),
      timeTo: '23:59',
      investigationOfficer: payload.officerName,
      badgeId: payload.officerBadge,
      placesVisited: [payload.policeStation, payload.incidentPlace],
      investigationSummary: `FIR registered under ${payload.actsAndSections.join(', ')}. Initial ocular inspection of occurrence place at ${payload.incidentPlace} initiated.`,
      witnessesExamined: [payload.complainantName],
      seizuresEffected: [],
    });

    return newCase;
  }
}

export const firCaseService = new FirCaseService();
