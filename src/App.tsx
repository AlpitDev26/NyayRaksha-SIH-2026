import React, { useState, useEffect, useCallback } from 'react';
import {
  UserRole,
  SupportedLanguage,
  CaseFile,
  DocumentRecord,
  EvidenceItem,
} from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CasesPipelineView } from './components/CasesPipelineView';
import { CaseDetailModal } from './components/CaseDetailModal';
import { NewFIRModal } from './components/NewFIRModal';
import { EvidenceLockerView } from './components/EvidenceLockerView';
import { CustodyTransferModal } from './components/CustodyTransferModal';
import { ForensicsLabView } from './components/ForensicsLabView';
import { ProsecutionView } from './components/ProsecutionView';
import { CourtroomView } from './components/CourtroomView';
import { DocumentVerifierView } from './components/DocumentVerifierView';
import { BlockchainExplorerView } from './components/BlockchainExplorerView';
import { AILegalAssistantView } from './components/AILegalAssistantView';
import { AuthHierarchyView } from './components/AuthHierarchyView';
import { MultilingualFIRView } from './components/MultilingualFIRView';
import { InvestigationWorkbenchView } from './components/InvestigationWorkbenchView';
import { CryptoPkiVaultView } from './components/CryptoPkiVaultView';
import { ICJSFederationView } from './components/ICJSFederationView';
import { SummonsWarrantsView } from './components/SummonsWarrantsView';
import { CrimeAnalyticsView } from './components/CrimeAnalyticsView';
import { SovereignAuditView } from './components/SovereignAuditView';
import { VirtualTrialCourtroomView } from './components/VirtualTrialCourtroomView';
import { DeepfakeForensicSuiteView } from './components/DeepfakeForensicSuiteView';
import { BFTConsensusMeshView } from './components/BFTConsensusMeshView';
import { BailReckonerMatrixView } from './components/BailReckonerMatrixView';
import { ChargeSheetGeneratorView } from './components/ChargeSheetGeneratorView';
import { SentencingReckonerView } from './components/SentencingReckonerView';
import { DigitalPanchnamaView } from './components/DigitalPanchnamaView';
import { FugitiveInterAgencyHubView } from './components/FugitiveInterAgencyHubView';
import { NFSUForensicsMeshView } from './components/NFSUForensicsMeshView';
import { PreventiveDetentionView } from './components/PreventiveDetentionView';
import { WitnessProtectionView } from './components/WitnessProtectionView';
import { MLATExtraditionView } from './components/MLATExtraditionView';
import { PleaBargainingView } from './components/PleaBargainingView';
import { SmartEvidenceLockerView } from './components/SmartEvidenceLockerView';
import { LegalPrecedentGraphView } from './components/LegalPrecedentGraphView';
import { NationalJudicialKPIView } from './components/NationalJudicialKPIView';
import { MedicoLegalAutopsyView } from './components/MedicoLegalAutopsyView';
import { OrganizedCrimeForfeitureView } from './components/OrganizedCrimeForfeitureView';
import { RemandOrderSheetView } from './components/RemandOrderSheetView';
import { AirGapHSMCeremonyView } from './components/AirGapHSMCeremonyView';
import { JuvenileJusticeArenaView } from './components/JuvenileJusticeArenaView';
import { CitizenJusticeELockerView } from './components/CitizenJusticeELockerView';
import { CyberCrimeTakedownTerminalView } from './components/CyberCrimeTakedownTerminalView';
import { QuantumResilientDRHubView } from './components/QuantumResilientDRHubView';
import { EPrisonsCorrectionalView } from './components/EPrisonsCorrectionalView';
import { NationalBiometricDNAView } from './components/NationalBiometricDNAView';
import { FIUFinancialAMLView } from './components/FIUFinancialAMLView';
import { ConstitutionalCollegiumView } from './components/ConstitutionalCollegiumView';
import { HighSecurityTransitView } from './components/HighSecurityTransitView';
import { CBRNExplosivesLabView } from './components/CBRNExplosivesLabView';
import { MaritimeCoastalSurveillanceView } from './components/MaritimeCoastalSurveillanceView';
import { EmergencyConstitutionalBenchView } from './components/EmergencyConstitutionalBenchView';
import { AcousticVoiceBiometricsView } from './components/AcousticVoiceBiometricsView';
import { CounterTerrorDroneRadarView } from './components/CounterTerrorDroneRadarView';
import { DigitalBailBondSuretyView } from './components/DigitalBailBondSuretyView';
import { SupremeCourtFullCourtBenchView } from './components/SupremeCourtFullCourtBenchView';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { TamperSimulationModal } from './components/TamperSimulationModal';
import { AddDocumentModal } from './components/AddDocumentModal';
import { AddEvidenceModal } from './components/AddEvidenceModal';
import { SubmitForensicModal } from './components/SubmitForensicModal';
import { JudicialOrderModal } from './components/JudicialOrderModal';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('investigating_officer');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const [cases, setCases] = useState<CaseFile[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseFile | null>(null);
  const [chainValid, setChainValid] = useState<boolean>(true);

  // Modals state
  const [isNewFIRModalOpen, setIsNewFIRModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);
  const [tamperModalCase, setTamperModalCase] = useState<CaseFile | null>(null);
  const [custodyTransferEvidence, setCustodyTransferEvidence] = useState<{
    caseFile: CaseFile;
    evidence: EvidenceItem;
  } | null>(null);
  const [submitForensicCase, setSubmitForensicCase] = useState<CaseFile | null>(null);
  const [addDocCase, setAddDocCase] = useState<CaseFile | null>(null);
  const [addEvidenceCase, setAddEvidenceCase] = useState<CaseFile | null>(null);
  const [judicialOrderCase, setJudicialOrderCase] = useState<CaseFile | null>(null);

  const refreshState = useCallback(async () => {
    const freshCases = storageService.getCases();
    setCases([...freshCases]);

    if (selectedCase) {
      const updated = freshCases.find((c) => c.id === selectedCase.id);
      if (updated) setSelectedCase(updated);
    }

    const audit = await storageService.ledger.verifyFullChain();
    setChainValid(audit.isChainValid);
  }, [selectedCase]);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  const blockHeight = storageService.ledger.getLatestBlock()?.blockNumber || 1040;
  const pendingHearingsCount = cases.reduce((acc, c) => acc + c.hearingDates.length, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Top Bar Contract (3 Zones) */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        language={language}
        onLanguageChange={setLanguage}
        onOpenVerifier={() => setActiveTab('verifier')}
        onOpenNewFir={() => setIsNewFIRModalOpen(true)}
        chainValid={chainValid}
        onRunAudit={async () => {
          const audit = await storageService.ledger.verifyFullChain();
          setChainValid(audit.isChainValid);
          setActiveTab('blockchain');
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim() && activeTab !== 'cases') {
            setActiveTab('cases');
          }
        }}
      />

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex flex-row">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          language={language}
          pendingHearingsCount={pendingHearingsCount}
          unanchoredCount={0}
        />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              cases={cases}
              language={language}
              currentRole={currentRole}
              blockHeight={blockHeight}
              onSelectCase={setSelectedCase}
              onNavigateTo={setActiveTab}
              onOpenNewFir={() => setIsNewFIRModalOpen(true)}
              onOpenVerifier={() => setActiveTab('verifier')}
              onRunAudit={async () => {
                const audit = await storageService.ledger.verifyFullChain();
                setChainValid(audit.isChainValid);
                setActiveTab('blockchain');
              }}
              chainValid={chainValid}
            />
          )}

          {activeTab === 'iam_hierarchy' && (
            <AuthHierarchyView
              language={language}
              onUserChanged={(user) => {
                // Map SovereignRoleCode to UserRole
                const roleMap: Record<string, UserRole> = {
                  IO_OFFICER: 'investigating_officer',
                  FORENSIC_OFFICER: 'forensic_examiner',
                  PROSECUTOR: 'public_prosecutor',
                  JUDGE_MAGISTRATE: 'judicial_magistrate',
                  COURT_CLERK: 'court_registrar',
                  AUDITOR: 'sovereign_auditor',
                  NAT_ADMIN: 'sovereign_auditor',
                  SECURITY_OFFICER: 'sovereign_auditor',
                  EVIDENCE_OFFICER: 'investigating_officer',
                  STATION_OFFICER: 'investigating_officer',
                  POLICE_COMM: 'investigating_officer',
                  DIST_ADMIN: 'investigating_officer',
                  STATE_ADMIN: 'investigating_officer',
                };
                setCurrentRole(roleMap[user.role] || 'investigating_officer');
              }}
            />
          )}

          {activeTab === 'crypto_pki' && <CryptoPkiVaultView />}

          {activeTab === 'hsm_ceremony' && (
            <AirGapHSMCeremonyView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'quantum_dr_hub' && <QuantumResilientDRHubView />}

          {activeTab === 'sc_full_court' && <SupremeCourtFullCourtBenchView />}

          {activeTab === 'constitutional_collegium' && <ConstitutionalCollegiumView />}

          {activeTab === 'emergency_bench' && <EmergencyConstitutionalBenchView />}

          {activeTab === 'cases' && (
            <CasesPipelineView
              cases={cases}
              language={language}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectCase={setSelectedCase}
              onOpenNewFir={() => setIsNewFIRModalOpen(true)}
            />
          )}

          {activeTab === 'fir_desk' && (
            <MultilingualFIRView
              language={language}
              onFIRSubmitted={() => {
                refreshState();
                setActiveTab('cases');
              }}
            />
          )}

          {activeTab === 'investigation' && (
            <InvestigationWorkbenchView
              cases={cases}
              language={language}
              onSelectCase={setSelectedCase}
            />
          )}

          {activeTab === 'remand_orders' && (
            <RemandOrderSheetView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'transit_convoy' && <HighSecurityTransitView />}

          {activeTab === 'eprisons_grid' && <EPrisonsCorrectionalView />}

          {activeTab === 'evidence' && (
            <EvidenceLockerView
              cases={cases}
              language={language}
              onOpenTransferModal={(caseItem, evidence) => {
                setCustodyTransferEvidence({ caseFile: caseItem, evidence });
              }}
              onSelectCase={setSelectedCase}
            />
          )}

          {activeTab === 'smart_lockers' && (
            <SmartEvidenceLockerView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'digital_panchnama' && (
            <DigitalPanchnamaView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'forensics' && (
            <ForensicsLabView
              cases={cases}
              language={language}
              onOpenSubmitReport={(c) => setSubmitForensicCase(c)}
              onSelectCase={setSelectedCase}
            />
          )}

          {activeTab === 'autopsy_inquest' && (
            <MedicoLegalAutopsyView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'nfsu_forensics' && (
            <NFSUForensicsMeshView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'cbrn_explosives' && <CBRNExplosivesLabView />}

          {activeTab === 'voice_biometrics' && <AcousticVoiceBiometricsView />}

          {activeTab === 'biometric_dna' && <NationalBiometricDNAView />}

          {activeTab === 'deepfake_forensics' && (
            <DeepfakeForensicSuiteView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'cyber_takedown' && <CyberCrimeTakedownTerminalView />}

          {activeTab === 'chargesheet_generator' && (
            <ChargeSheetGeneratorView
              language={language}
              currentRole={currentRole}
              onSelectCase={setSelectedCase}
            />
          )}

          {activeTab === 'organized_crime' && (
            <OrganizedCrimeForfeitureView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'fiu_aml' && <FIUFinancialAMLView />}

          {activeTab === 'drone_radar' && <CounterTerrorDroneRadarView />}

          {activeTab === 'maritime_surveillance' && <MaritimeCoastalSurveillanceView />}

          {activeTab === 'juvenile_justice' && <JuvenileJusticeArenaView />}

          {activeTab === 'plea_bargaining' && (
            <PleaBargainingView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'preventive_detention' && (
            <PreventiveDetentionView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'prosecution' && (
            <ProsecutionView
              cases={cases}
              language={language}
              onSelectCase={setSelectedCase}
              onRefresh={refreshState}
            />
          )}

          {activeTab === 'courtroom' && (
            <CourtroomView
              cases={cases}
              language={language}
              currentRole={currentRole}
              onSelectCase={setSelectedCase}
              onOpenJudicialOrderModal={(c) => setJudicialOrderCase(c)}
            />
          )}

          {activeTab === 'virtual_courtroom' && (
            <VirtualTrialCourtroomView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'bail_reckoner' && (
            <BailReckonerMatrixView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'digital_bail_bond' && <DigitalBailBondSuretyView />}

          {activeTab === 'sentencing_reckoner' && (
            <SentencingReckonerView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'witness_protection' && (
            <WitnessProtectionView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'fugitive_hub' && (
            <FugitiveInterAgencyHubView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'mlat_extradition' && (
            <MLATExtraditionView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'citizen_elocker' && <CitizenJusticeELockerView />}

          {activeTab === 'legal_precedents' && (
            <LegalPrecedentGraphView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'judicial_kpi' && (
            <NationalJudicialKPIView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'verifier' && <DocumentVerifierView language={language} />}

          {activeTab === 'blockchain' && (
            <BlockchainExplorerView language={language} onRefresh={refreshState} />
          )}

          {activeTab === 'bft_consensus_mesh' && (
            <BFTConsensusMeshView language={language} currentRole={currentRole} />
          )}

          {activeTab === 'ai_legal' && <AILegalAssistantView language={language} />}

          {activeTab === 'icjs_grid' && <ICJSFederationView language={language} />}

          {activeTab === 'summons_warrants' && <SummonsWarrantsView language={language} />}

          {activeTab === 'crime_analytics' && (
            <CrimeAnalyticsView
              language={language}
              onNavigateToCase={(caseNum) => {
                const target = cases.find((c) => c.caseNumber === caseNum);
                if (target) setSelectedCase(target);
              }}
            />
          )}

          {activeTab === 'sovereign_audit' && <SovereignAuditView language={language} />}
        </main>
      </div>

      {/* Global Modals */}
      {selectedCase && (
        <CaseDetailModal
          caseFile={selectedCase}
          onClose={() => setSelectedCase(null)}
          currentRole={currentRole}
          language={language}
          onRefreshCase={refreshState}
          onOpenCustodyTransfer={(ev) => {
            setCustodyTransferEvidence({ caseFile: selectedCase, evidence: ev });
          }}
          onOpenSubmitForensic={(c) => setSubmitForensicCase(c)}
          onOpenAddDoc={(c) => setAddDocCase(c)}
          onOpenAddEvidence={(c) => setAddEvidenceCase(c)}
          onOpenJudicialOrder={(c) => setJudicialOrderCase(c)}
          onPreviewDocument={(d) => setPreviewDoc(d)}
          onOpenTamperModal={(c) => setTamperModalCase(c)}
        />
      )}

      {isNewFIRModalOpen && (
        <NewFIRModal
          onClose={() => setIsNewFIRModalOpen(false)}
          onSuccess={() => {
            setIsNewFIRModalOpen(false);
            refreshState();
          }}
          language={language}
          currentRole={currentRole}
        />
      )}

      {custodyTransferEvidence && (
        <CustodyTransferModal
          caseFile={custodyTransferEvidence.caseFile}
          evidence={custodyTransferEvidence.evidence}
          onClose={() => setCustodyTransferEvidence(null)}
          onSuccess={() => {
            setCustodyTransferEvidence(null);
            refreshState();
          }}
          language={language}
        />
      )}

      {submitForensicCase && (
        <SubmitForensicModal
          caseFile={submitForensicCase}
          currentRole={currentRole}
          onClose={() => setSubmitForensicCase(null)}
          onSuccess={() => {
            setSubmitForensicCase(null);
            refreshState();
          }}
        />
      )}

      {addDocCase && (
        <AddDocumentModal
          caseFile={addDocCase}
          currentRole={currentRole}
          onClose={() => setAddDocCase(null)}
          onSuccess={() => {
            setAddDocCase(null);
            refreshState();
          }}
        />
      )}

      {addEvidenceCase && (
        <AddEvidenceModal
          caseFile={addEvidenceCase}
          currentRole={currentRole}
          onClose={() => setAddEvidenceCase(null)}
          onSuccess={() => {
            setAddEvidenceCase(null);
            refreshState();
          }}
        />
      )}

      {judicialOrderCase && (
        <JudicialOrderModal
          caseFile={judicialOrderCase}
          currentRole={currentRole}
          onClose={() => setJudicialOrderCase(null)}
          onSuccess={() => {
            setJudicialOrderCase(null);
            refreshState();
          }}
        />
      )}

      {previewDoc && (
        <DocumentPreviewModal
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      {tamperModalCase && (
        <TamperSimulationModal
          caseFile={tamperModalCase}
          onClose={() => setTamperModalCase(null)}
          onSuccess={() => {
            refreshState();
          }}
        />
      )}
    </div>
  );
}
