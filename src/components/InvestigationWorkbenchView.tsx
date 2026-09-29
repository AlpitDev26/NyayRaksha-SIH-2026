import React, { useState } from 'react';
import { CaseFile, SupportedLanguage } from '../types';
import {
  CaseDiaryEntry,
  InvestigationTask,
  WitnessStatementRecord,
} from '../types/firCase';
import { firCaseService } from '../services/firCaseService';
import { TRANSLATIONS } from '../services/i18n';
import {
  FileSignature,
  CheckCircle,
  Clock,
  Plus,
  Lock,
  UserCheck,
  MapPin,
  Calendar,
  AlertTriangle,
  FolderOpen,
  Search,
  CheckSquare,
  ListOrdered,
  FileText,
} from 'lucide-react';

interface InvestigationWorkbenchViewProps {
  cases: CaseFile[];
  language: SupportedLanguage;
  onSelectCase: (caseItem: CaseFile) => void;
}

type WorkbenchTab = 'case_diaries' | 'tasks' | 'witness_statements';

export const InvestigationWorkbenchView: React.FC<InvestigationWorkbenchViewProps> = ({
  cases,
  language,
  onSelectCase,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<WorkbenchTab>('case_diaries');

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Case Diary Form State
  const [isAddingDiary, setIsAddingDiary] = useState(false);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [timeFrom, setTimeFrom] = useState('09:00');
  const [timeTo, setTimeTo] = useState('18:30');
  const [placesVisited, setPlacesVisited] = useState('Cyber Police Station, Data Center Okhla');
  const [witnessesExamined, setWitnessesExamined] = useState('Vivek Anand (System Administrator)');
  const [seizuresEffected, setSeizuresEffected] = useState('Hard disk image copy 01');
  const [diarySummary, setDiarySummary] = useState('');

  // Task Form State
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCategory, setTaskCategory] = useState<InvestigationTask['category']>('FORENSIC_REQUISITION');
  const [taskPriority, setTaskPriority] = useState<InvestigationTask['priority']>('HIGH');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().slice(0, 10));

  // Witness Statement Form State
  const [isAddingStatement, setIsAddingStatement] = useState(false);
  const [wName, setWName] = useState('');
  const [wAge, setWAge] = useState<number>(38);
  const [wAddress, setWAddress] = useState('');
  const [wContact, setWContact] = useState('');
  const [wStatement, setWStatement] = useState('');

  // Data
  const diaries = activeCase ? firCaseService.getCaseDiaries(activeCase.id) : [];
  const tasks = activeCase ? firCaseService.getTasks(activeCase.id) : [];
  const statements = activeCase ? firCaseService.getWitnessStatements(activeCase.id) : [];

  const handleCreateDiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase || !diarySummary.trim()) return;

    await firCaseService.addCaseDiaryEntry({
      caseId: activeCase.id,
      caseNumber: activeCase.caseNumber,
      entryDate,
      timeFrom,
      timeTo,
      investigationOfficer: activeCase.leadInvestigator.name,
      badgeId: activeCase.leadInvestigator.badgeId,
      placesVisited: placesVisited.split(',').map((p) => p.trim()),
      investigationSummary: diarySummary,
      witnessesExamined: witnessesExamined.split(',').map((w) => w.trim()),
      seizuresEffected: seizuresEffected ? seizuresEffected.split(',').map((s) => s.trim()) : [],
    });

    setIsAddingDiary(false);
    setDiarySummary('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase || !taskTitle.trim()) return;

    firCaseService.addTask({
      caseId: activeCase.id,
      caseNumber: activeCase.caseNumber,
      title: taskTitle,
      description: taskDesc,
      category: taskCategory,
      priority: taskPriority,
      assignedToOfficer: activeCase.leadInvestigator.name,
      assignedOfficerBadge: activeCase.leadInvestigator.badgeId,
      dueDate: taskDueDate,
      status: 'PENDING',
    });

    setIsAddingTask(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  const handleCreateStatement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase || !wName.trim() || !wStatement.trim()) return;

    await firCaseService.recordWitnessStatement({
      caseId: activeCase.id,
      caseNumber: activeCase.caseNumber,
      witnessName: wName,
      witnessAge: wAge,
      witnessAddress: wAddress,
      witnessContact: wContact,
      statementType: 'SEC_180_BNSS_POLICE',
      statementVerbatim: wStatement,
      recordedLanguage: 'en',
      recordingOfficer: activeCase.leadInvestigator.name,
      officerBadge: activeCase.leadInvestigator.badgeId,
    });

    setIsAddingStatement(false);
    setWName('');
    setWStatement('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 p-5 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <FileSignature className="w-3.5 h-3.5" />
            <span>INVESTIGATION OFFICER WORKBENCH · SEC 180 & 192 BNSS</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white font-serif tracking-tight mt-0.5">
            Case Diary & Investigation Field Workbench
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Maintain daily statutory case diaries (Section 192 BNSS), track pending forensic requisitions, and record witness examination statements with cryptographic signatures.
          </p>
        </div>

        {/* Case Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 shrink-0">
          <FolderOpen className="w-4 h-4 text-amber-400" />
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="bg-transparent text-xs font-mono font-bold text-amber-300 focus:outline-none cursor-pointer max-w-[220px]"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                {c.caseNumber} - {c.title.slice(0, 25)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeCase && (
        <div className="space-y-4">
          {/* SubTab Navigation */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              {[
                { id: 'case_diaries', label: `1. Case Diary Entries (${diaries.length})`, icon: <ListOrdered className="w-3.5 h-3.5" /> },
                { id: 'tasks', label: `2. Investigation Tasks (${tasks.length})`, icon: <CheckSquare className="w-3.5 h-3.5" /> },
                { id: 'witness_statements', label: `3. Witness Statements (${statements.length})`, icon: <UserCheck className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as WorkbenchTab)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeSubTab === tab.id
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => onSelectCase(activeCase)}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
            >
              Open Full Case Docket →
            </button>
          </div>

          {/* TAB 1: CASE DIARY ENTRIES */}
          {activeSubTab === 'case_diaries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Statutory Daily Case Diary (Section 192 BNSS / 172 CrPC)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Day-by-day record of investigation steps, movements, statements, and recoveries with immutable hash anchors.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingDiary(!isAddingDiary)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log New Day Diary</span>
                </button>
              </div>

              {/* Add Diary Form */}
              {isAddingDiary && (
                <form
                  onSubmit={handleCreateDiary}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-4 text-xs text-slate-300"
                >
                  <div className="font-semibold text-white text-xs">
                    New Case Diary Entry for {activeCase.caseNumber}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Date of Investigation *</label>
                      <input
                        type="date"
                        value={entryDate}
                        onChange={(e) => setEntryDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Time Started</label>
                      <input
                        type="time"
                        value={timeFrom}
                        onChange={(e) => setTimeFrom(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Time Concluded</label>
                      <input
                        type="time"
                        value={timeTo}
                        onChange={(e) => setTimeTo(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Places Visited & Crime Scenes (comma separated)</label>
                      <input
                        type="text"
                        value={placesVisited}
                        onChange={(e) => setPlacesVisited(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Witnesses Examined / Questioned</label>
                      <input
                        type="text"
                        value={witnessesExamined}
                        onChange={(e) => setWitnessesExamined(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Detailed Investigation Record & Sequence of Steps *</label>
                    <textarea
                      rows={4}
                      value={diarySummary}
                      onChange={(e) => setDiarySummary(e.target.value)}
                      placeholder="Enter detailed facts ascertained, leads verified, searches conducted, and statements recorded..."
                      className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-slate-100 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddingDiary(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded border border-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign & Anchor Diary Entry</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Diary Entries Feed */}
              {diaries.length === 0 ? (
                <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-lg text-slate-500 text-xs">
                  No case diary entries recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {diaries.map((cd) => (
                    <div
                      key={cd.id}
                      className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-mono font-bold rounded">
                            Case Diary #{cd.entryNumber}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="font-mono text-slate-300 font-bold">{cd.entryDate}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400 font-mono">
                            {cd.timeFrom} - {cd.timeTo} IST
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          IO: {cd.investigationOfficer} ({cd.badgeId})
                        </div>
                      </div>

                      <div className="text-slate-200 leading-relaxed pt-1">
                        {cd.investigationSummary}
                      </div>

                      {cd.placesVisited.length > 0 && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span>Places Visited: {cd.placesVisited.join('; ')}</span>
                        </div>
                      )}

                      {/* Blockchain signature */}
                      <div className="p-2 bg-slate-950 rounded font-mono text-[10px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span>SHA-256 Digest: {cd.sha256Hash.slice(0, 32)}...</span>
                        <span className="text-emerald-400">Blockchain Anchored (Sec 192 BNSS Verified)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INVESTIGATION TASKS */}
          {activeSubTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                    <span>Investigation Tasks & Pending Leads Board</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Track requisitions, cyber extraction jobs, witness summons, and search operations.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingTask(!isAddingTask)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Task</span>
                </button>
              </div>

              {/* Add Task Form */}
              {isAddingTask && (
                <form
                  onSubmit={handleCreateTask}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3 text-xs text-slate-300"
                >
                  <div className="font-semibold text-white">Create New Investigation Task</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 mb-1">Task Title *</label>
                      <input
                        type="text"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="e.g. Issue Section 94 BNSS Notice to Internet Service Provider"
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Category</label>
                      <select
                        value={taskCategory}
                        onChange={(e) => setTaskCategory(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="FORENSIC_REQUISITION">Forensic Requisition</option>
                        <option value="CYBER_IP_TRACE">Cyber IP Trace</option>
                        <option value="WITNESS_EXAMINATION">Witness Deposition</option>
                        <option value="SEARCH_SEIZURE">Search & Seizure</option>
                        <option value="ARREST_REMAND">Arrest & Remand</option>
                        <option value="CHARGE_SHEET_DRAFT">Charge Sheet Prep</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Task Description & Instructions</label>
                    <textarea
                      rows={2}
                      value={taskDesc}
                      onChange={(e) => setTaskDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingTask(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded border border-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow cursor-pointer"
                    >
                      Assign Task
                    </button>
                  </div>
                </form>
              )}

              {/* Tasks List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-white text-xs line-clamp-1">{task.title}</span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                            task.status === 'COMPLETED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs line-clamp-2">{task.description}</p>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Assigned to: {task.assignedToOfficer} · Due: {task.dueDate}
                      </div>
                      {task.findingsNotes && (
                        <div className="p-2 bg-slate-950 rounded text-emerald-300 text-[11px]">
                          ✓ Outcome: {task.findingsNotes}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-500">{task.category}</span>
                      {task.status !== 'COMPLETED' && (
                        <button
                          onClick={() => firCaseService.updateTaskStatus(task.id, 'COMPLETED', 'Investigation verified by IO.')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 rounded transition-colors cursor-pointer"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WITNESS STATEMENTS */}
          {activeSubTab === 'witness_statements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Witness Statements & Depositions (Sec 180 BNSS / 161 CrPC)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Record formal witness depositions with identity validation and instant digital vault commitment.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingStatement(!isAddingStatement)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record Witness Deposition</span>
                </button>
              </div>

              {/* Add Witness Statement Form */}
              {isAddingStatement && (
                <form
                  onSubmit={handleCreateStatement}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3 text-xs text-slate-300"
                >
                  <div className="font-semibold text-white">Record Witness Deposition (Sec 180 BNSS)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Witness Full Name *</label>
                      <input
                        type="text"
                        value={wName}
                        onChange={(e) => setWName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Age</label>
                      <input
                        type="number"
                        value={wAge}
                        onChange={(e) => setWAge(parseInt(e.target.value) || 30)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={wContact}
                        onChange={(e) => setWContact(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Residential Address</label>
                    <input
                      type="text"
                      value={wAddress}
                      onChange={(e) => setWAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Verbatim Statement Deposition *</label>
                    <textarea
                      rows={4}
                      value={wStatement}
                      onChange={(e) => setWStatement(e.target.value)}
                      placeholder="State what the witness stated verbatim during examination..."
                      className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-slate-100 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingStatement(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded border border-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow cursor-pointer flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign & Archive Deposition</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Statements Feed */}
              {statements.length === 0 ? (
                <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-lg text-slate-500 text-xs">
                  No witness statements recorded for this case yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {statements.map((ws) => (
                    <div
                      key={ws.id}
                      className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-2">
                        <div>
                          <span className="font-bold text-white text-sm">{ws.witnessName}</span>
                          <span className="text-slate-400 ml-2">(Age: {ws.witnessAge})</span>
                          <span className="text-slate-600 mx-2">·</span>
                          <span className="text-slate-400 font-mono text-[11px]">{ws.witnessContact}</span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-400">
                          {ws.statementType.replace(/_/g, ' ')}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950 rounded text-slate-200 italic leading-relaxed">
                        "{ws.statementVerbatim}"
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                        <span>Recorded by: {ws.recordingOfficer} ({ws.officerBadge})</span>
                        <span className="text-slate-500">{ws.recordedAt.slice(0, 10)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
