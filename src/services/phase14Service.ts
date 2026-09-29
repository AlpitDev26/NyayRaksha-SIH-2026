import {
  HighSecurityTransitRecord,
  CBRNExplosivesLabRecord,
  MaritimeCoastalSurveillanceRecord,
  EmergencyConstitutionalBenchRecord,
} from '../types';
import { computeSHA256 } from './cryptoEngine';

// Initial Inter-State High-Security Transit Records (Sec 187(4) BNSS)
const INITIAL_TRANSIT_RECORDS: HighSecurityTransitRecord[] = [
  {
    transitPassId: 'TRANSIT-SEC-2026-DEL-MUM-091',
    prisonerName: 'Shahid @ Tiger Bhai (Extradited Underworld Operative)',
    prisonerCategory: 'CATEGORY_A_TERROR_SYNDICATE',
    originJailFacility: 'High-Security Ward 3, Tihar Central Jail, New Delhi',
    destinationCourtOrPrison: 'Special MCOCA Court / Arthur Road Prison, Mumbai',
    escortBattalionName: '3rd Battalion Special Armed Police (Delhi Police QRT)',
    escortCommanderOfficer: 'Assistant Commissioner of Police Sh. Vikrant Rawat',
    armedGuardsCount: 16,
    vehicleRegistrationNumber: 'DL-1C-AA-9901 (Armored Bullet-Resistant Carrier)',
    gpsTelemetryLiveStatus: 'IN_TRANSIT_ON_ROUTE',
    departureTimestamp: '2026-01-27T06:00:00Z',
    statutory24HrDeadlineTimestamp: '2026-01-28T06:00:00Z',
    borderHandoverPoliceStation: 'Rajasthan-MP Inter-State Border Police Post, Kota',
    transitRemandMagistrateOrderSha256: 'a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890',
    biometricHandoverPassHash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  },
];

// Initial CBRN & Explosive Lab Records (NFSU / DRDO CFEES)
const INITIAL_CBRN_RECORDS: CBRNExplosivesLabRecord[] = [
  {
    analysisId: 'CBRN-LAB-2026-EXP-0041',
    incidentReference: 'BLAST-INCIDENT-2026-NCR-091',
    threatType: 'HIGH_EXPLOSIVE_MILITARY',
    substanceIdentified: 'Military High-Grade RDX (Cyclotrimethylenetrinitramine) with PIB Plasticizer & PETN booster',
    spectroscopyGcMsSpectrumSha256: '9f8e7d6c5b4a3210fedcba0987654321fedcba0987654321fedcba0987654321',
    radiationOrToxicityScore: 'Detonation Velocity: 8,750 m/s; Brisance Factor: 1.48 (TNT Equiv: 1.60x)',
    accreditationAuthority: 'DRDO_CFEES_EXPLOSIVES_CENTRE',
    hermeticVaultStorageCell: 'HERMETIC-VAULT-CELL-B4 (Blast-Proof Containment)',
    chiefScientistExaminer: 'Dr. Rameshwar N. Swamy (Scientist-G, DRDO CFEES)',
    analysisCompletionTimestamp: '2026-01-26T18:30:00Z',
    courtEvidentiaryCertificateBSA63Sha256: '556677889900aabbccddeeff0011223344556677889900aabbccddeeff001122',
    chainOfCustodyVerified: true,
  },
];

// Initial Maritime Coastal Surveillance Records
const INITIAL_MARITIME_RECORDS: MaritimeCoastalSurveillanceRecord[] = [
  {
    incursionId: 'MARITIME-ICG-2026-INTERCEPT-009',
    vesselNameOrCallsign: 'Al-Madina (Unregistered High-Speed Dhow)',
    vesselType: 'UNREGISTERED_SPEED_DHOW',
    flagState: 'STATELESS_PIRACY_SUSPECT',
    gpsCoordinates: {
      latitude: 22.8412,
      longitude: 68.3901,
      nauticalMilesFromShore: 42.5,
      coastalSector: 'Gujarat Exclusive Economic Zone (Kori Creek / Jakhau Axis)',
    },
    interceptingUnit: 'INDIAN_COAST_GUARD_ICG',
    contrabandSeizedDescription: 'Methamphetamine (Crystal Meth) 350 kg & High-Grade Afghan Heroin 120 kg in waterproof heat-sealed sacks',
    seizedContrabandValueRupees: 2100000000, // ₹210 Crores
    crewMembersDetainedCount: 6,
    maritimeAudioVideoPanchnamaSha256: '44556677889900aabbccddeeff00112233445566778899aabbccddeeff001122',
    designatedCoastalPoliceStation: 'Jakhau Coastal Marine Police Station, Kutch, Gujarat',
    interceptionTimestamp: '2026-01-27T02:15:00Z',
    vesselConfiscationStatus: 'SEIZED_IN_COASTAL_CUSTODY',
  },
];

// Initial Emergency Constitutional Bench Records (Sec 163 BNSS / Habeas Corpus)
const INITIAL_EMERGENCY_RECORDS: EmergencyConstitutionalBenchRecord[] = [
  {
    emergencyOrderId: 'EMERG-ORDER-2026-DEL-001',
    orderType: 'SEC_163_BNSS_PROHIBITORY_ORDER',
    title: 'Magisterial Prohibitory Order under Section 163 BNSS (Erstwhile Sec 144 CrPC)',
    affectedGeographicalZone: {
      districtName: 'New Delhi Central & Diplomatic Enclave Zone',
      centerCoordinates: { latitude: 28.6139, longitude: 77.209 },
      containmentRadiusKm: 5.0,
    },
    presidingJudgeOrMagistrate: 'District Magistrate Sh. Praveen Kumar, IAS',
    curfewStatus: 'ESSENTIAL_SERVICES_EXEMPTED',
    teleHearingConducted: true,
    orderSummary:
      'Prohibition of unlawful assembly of 5 or more persons, carrying of firearms, sharp weapons, or incendiary substances within 5 km radius of Central Vista and India Gate to maintain sovereign law and order.',
    effectiveFrom: '2026-01-26T00:00:00Z',
    effectiveUntil: '2026-01-31T23:59:59Z',
    magisterialSealSha256: '77889900aabbccddeeff0011223344556677889900aabbccddeeff0011223344',
  },
];

class Phase14Service {
  private transitRecords: HighSecurityTransitRecord[] = [...INITIAL_TRANSIT_RECORDS];
  private cbrnRecords: CBRNExplosivesLabRecord[] = [...INITIAL_CBRN_RECORDS];
  private maritimeRecords: MaritimeCoastalSurveillanceRecord[] = [...INITIAL_MARITIME_RECORDS];
  private emergencyRecords: EmergencyConstitutionalBenchRecord[] = [...INITIAL_EMERGENCY_RECORDS];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedTr = localStorage.getItem('nsdj_phase14_transit');
      if (savedTr) this.transitRecords = JSON.parse(savedTr);

      const savedCbrn = localStorage.getItem('nsdj_phase14_cbrn');
      if (savedCbrn) this.cbrnRecords = JSON.parse(savedCbrn);

      const savedMar = localStorage.getItem('nsdj_phase14_maritime');
      if (savedMar) this.maritimeRecords = JSON.parse(savedMar);

      const savedEmerg = localStorage.getItem('nsdj_phase14_emerg');
      if (savedEmerg) this.emergencyRecords = JSON.parse(savedEmerg);
    } catch {
      // Storage fallback
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('nsdj_phase14_transit', JSON.stringify(this.transitRecords));
      localStorage.setItem('nsdj_phase14_cbrn', JSON.stringify(this.cbrnRecords));
      localStorage.setItem('nsdj_phase14_maritime', JSON.stringify(this.maritimeRecords));
      localStorage.setItem('nsdj_phase14_emerg', JSON.stringify(this.emergencyRecords));
    } catch {
      // Storage ignore
    }
  }

  // --- High Security Transit ---
  getTransitRecords(): HighSecurityTransitRecord[] {
    return [...this.transitRecords];
  }

  async createTransitRecord(
    data: Omit<HighSecurityTransitRecord, 'transitPassId' | 'biometricHandoverPassHash'>
  ): Promise<HighSecurityTransitRecord> {
    const raw = `${data.prisonerName}|${data.originJailFacility}|${data.destinationCourtOrPrison}|${Date.now()}`;
    const hash = await computeSHA256(raw);

    const newRecord: HighSecurityTransitRecord = {
      ...data,
      transitPassId: `TRANSIT-SEC-2026-${Date.now().toString().slice(-4)}`,
      biometricHandoverPassHash: hash,
    };

    this.transitRecords.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }

  triggerTransitSOS(transitPassId: string) {
    const pass = this.transitRecords.find((t) => t.transitPassId === transitPassId);
    if (pass) {
      pass.gpsTelemetryLiveStatus = 'SOS_EMERGENCY_TRIGGERED';
      this.saveToStorage();
    }
  }

  // --- CBRN Lab ---
  getCBRNRecords(): CBRNExplosivesLabRecord[] {
    return [...this.cbrnRecords];
  }

  async createCBRNRecord(
    data: Omit<CBRNExplosivesLabRecord, 'analysisId' | 'courtEvidentiaryCertificateBSA63Sha256' | 'analysisCompletionTimestamp'>
  ): Promise<CBRNExplosivesLabRecord> {
    const timestamp = new Date().toISOString();
    const raw = `${data.substanceIdentified}|${data.threatType}|${timestamp}`;
    const hash = await computeSHA256(raw);

    const newRecord: CBRNExplosivesLabRecord = {
      ...data,
      analysisId: `CBRN-LAB-2026-${Date.now().toString().slice(-4)}`,
      analysisCompletionTimestamp: timestamp,
      courtEvidentiaryCertificateBSA63Sha256: hash,
    };

    this.cbrnRecords.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }

  // --- Maritime Surveillance ---
  getMaritimeRecords(): MaritimeCoastalSurveillanceRecord[] {
    return [...this.maritimeRecords];
  }

  async createMaritimeRecord(
    data: Omit<MaritimeCoastalSurveillanceRecord, 'incursionId' | 'interceptionTimestamp'>
  ): Promise<MaritimeCoastalSurveillanceRecord> {
    const timestamp = new Date().toISOString();
    const newRecord: MaritimeCoastalSurveillanceRecord = {
      ...data,
      incursionId: `MARITIME-ICG-2026-${Date.now().toString().slice(-4)}`,
      interceptionTimestamp: timestamp,
    };

    this.maritimeRecords.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }

  // --- Constitutional Emergency ---
  getEmergencyRecords(): EmergencyConstitutionalBenchRecord[] {
    return [...this.emergencyRecords];
  }

  async createEmergencyOrder(
    data: Omit<EmergencyConstitutionalBenchRecord, 'emergencyOrderId' | 'magisterialSealSha256'>
  ): Promise<EmergencyConstitutionalBenchRecord> {
    const raw = `${data.title}|${data.orderType}|${Date.now()}`;
    const hash = await computeSHA256(raw);

    const newRecord: EmergencyConstitutionalBenchRecord = {
      ...data,
      emergencyOrderId: `EMERG-ORDER-2026-${Date.now().toString().slice(-4)}`,
      magisterialSealSha256: hash,
    };

    this.emergencyRecords.unshift(newRecord);
    this.saveToStorage();
    return newRecord;
  }
}

export const phase14Service = new Phase14Service();
