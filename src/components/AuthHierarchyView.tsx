import React, { useState } from 'react';
import { SovereignUser, SovereignRoleCode, ActionPermissionCode, SovereignJurisdiction } from '../types/authHierarchy';
import { authHierarchyService, RBAC_ROLE_PERMISSIONS } from '../services/authHierarchyService';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import {
  Shield,
  UserCheck,
  Building2,
  Key,
  Lock,
  CheckCircle,
  XCircle,
  FileCheck,
  Search,
  Activity,
  Award,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  LogOut,
  Fingerprint,
} from 'lucide-react';

interface AuthHierarchyViewProps {
  language: SupportedLanguage;
  onUserChanged: (user: SovereignUser) => void;
}

type SubTab = 'users_sessions' | 'org_tree' | 'rbac_matrix' | 'audit_trail';

export const AuthHierarchyView: React.FC<AuthHierarchyViewProps> = ({
  language,
  onUserChanged,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('users_sessions');
  const [activeUser, setActiveUser] = useState<SovereignUser>(authHierarchyService.getActiveUser());
  const users = authHierarchyService.getAllUsers();
  const jurisdictions = authHierarchyService.getAllJurisdictions();
  const auditLogs = authHierarchyService.getAuditLogs();

  // RBAC tester state
  const [testAction, setTestAction] = useState<ActionPermissionCode>('FIR_CREATE');
  const [testResult, setTestResult] = useState<{ authorized: boolean; reason?: string } | null>(null);

  // Hierarchy search / filter
  const [searchQuery, setSearchQuery] = useState('');

  const handleSwitchUser = async (userId: string) => {
    const updated = await authHierarchyService.switchActiveUser(userId);
    setActiveUser(updated);
    onUserChanged(updated);
    setTestResult(null);
  };

  const handleTestPermission = async () => {
    const res = await authHierarchyService.verifyAndAuthorize(testAction);
    setTestResult(res);
  };

  const allActions: ActionPermissionCode[] = [
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
    'EVIDENCE_EXAMINE',
    'FSL_REPORT_SUBMIT',
    'FSL_REPORT_SIGN',
    'CHARGE_SHEET_DRAFT',
    'CHARGE_SHEET_VET',
    'CHARGE_SHEET_COGNIZANCE',
    'COURT_EFILING_SUBMIT',
    'JUDICIAL_ORDER_ISSUE',
    'FINAL_JUDGMENT_DECREE',
    'ASSET_ACQUIRE',
    'ASSET_ASSIGN',
    'AUDIT_LOG_READ',
    'AUDIT_LOG_EXPORT',
    'BLOCKCHAIN_AUDIT',
    'USER_MGMT',
    'JURISDICTION_CONFIG',
    'TAMPER_SIMULATION_TEST',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 p-5 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Shield className="w-3.5 h-3.5" />
            <span>PHASE 1: AUTHENTICATION, RBAC & NATIONAL HIERARCHY</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white font-serif tracking-tight mt-0.5">
            Sovereign Identity, Access Control & Organization Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Zero-Trust X.509 PKI session management, multi-tier jurisdiction hierarchies (National → State → District → Station), and fine-grained statutory RBAC enforcement.
          </p>
        </div>

        {/* Active Session Badge */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold font-mono">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Current Active Identity</div>
            <div className="font-bold text-white line-clamp-1">{activeUser.fullName}</div>
            <div className="text-[11px] font-mono text-amber-300">{activeUser.role} · {activeUser.badgeId}</div>
          </div>
        </div>
      </div>

      {/* SubTab Navigation Buttons */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
        {[
          { id: 'users_sessions', label: '1. Personnel Roster & Active Sessions', icon: <UserCheck className="w-3.5 h-3.5" /> },
          { id: 'org_tree', label: '2. National Jurisdiction Hierarchy', icon: <Building2 className="w-3.5 h-3.5" /> },
          { id: 'rbac_matrix', label: '3. RBAC Matrix & Permission Tester', icon: <Key className="w-3.5 h-3.5" /> },
          { id: 'audit_trail', label: `4. Security Audit Trail (${auditLogs.length})`, icon: <Activity className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as SubTab)}
            className={`px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === tab.id
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SUBTAB 1: USERS & ACTIVE SESSIONS */}
      {activeSubTab === 'users_sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Authorized Sovereign Personnel Directory & PKI Smart Card Profiles</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select any authorized officer or judicial user to simulate authenticated session switching with X.509 PKI certificate verification.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((u) => {
              const isActive = u.id === activeUser.id;
              return (
                <div
                  key={u.id}
                  className={`p-4 rounded-lg border transition-all space-y-3 flex flex-col justify-between ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500/50 text-white'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{u.fullName}</span>
                          {isActive && (
                            <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-amber-400 text-slate-950 rounded">
                              ACTIVE SESSION
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-300 mt-0.5">{u.designation}</div>
                        <div className="text-[11px] text-slate-400">{u.department}</div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-950 text-amber-300 border border-slate-800">
                          {u.role}
                        </span>
                        <div className="text-[10px] font-mono text-slate-500 mt-1">{u.badgeId}</div>
                      </div>
                    </div>

                    {/* Metadata & PKI credentials */}
                    <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-[11px] font-mono space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Clearance Level:</span>
                        <span className="text-amber-300">{u.securityClearance}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>PKI Certificate ID:</span>
                        <span className="text-purple-300 truncate max-w-[200px]">{u.pkiCertificateId}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>MFA Method:</span>
                        <span className="text-emerald-400">{u.mfaMethod} (Verified)</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
                        <span>Assigned Jurisdiction:</span>
                        <span className="text-slate-300 truncate max-w-[200px]">{u.jurisdictionName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-[10px] text-slate-500 font-mono">
                      Last Auth: {u.lastLoginAt.replace('T', ' ').slice(0, 19)}
                    </div>
                    {!isActive && (
                      <button
                        onClick={() => handleSwitchUser(u.id)}
                        className="px-3 py-1 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer"
                      >
                        Switch Active Session
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: JURISDICTION HIERARCHY */}
      {activeSubTab === 'org_tree' && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>National Justice & Police Jurisdiction Hierarchy</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Dynamic administrative hierarchy managing data isolation, case transfer boundaries, and inter-agency access.
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jurisdiction / unit..."
                className="pl-8 pr-3 py-1 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            {jurisdictions
              .filter((j) =>
                searchQuery.trim()
                  ? j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    j.code.toLowerCase().includes(searchQuery.toLowerCase())
                  : true
              )
              .map((jur) => (
                <div
                  key={jur.id}
                  className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="px-2 py-1 bg-slate-900 border border-slate-700 rounded font-mono text-amber-400 font-bold text-[10px]">
                      {jur.level}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{jur.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Code: {jur.code} · State: {jur.stateCode} {jur.districtCode ? `· District: ${jur.districtCode}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-slate-300 font-mono font-semibold">{jur.activeUnitsCount} Active Units</div>
                      <div className="text-[10px] text-emerald-400">Node Sync: Synchronized</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: RBAC MATRIX & TESTER */}
      {activeSubTab === 'rbac_matrix' && (
        <div className="space-y-6">
          {/* Interactive Permission Verifier Simulator */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Zero-Trust Permission Authorization Tester</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate runtime ABAC/RBAC authorization decisions for the currently active identity: <span className="text-amber-300 font-mono font-bold">{activeUser.fullName} ({activeUser.role})</span>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1">
                <label className="block text-slate-400 text-xs mb-1">Select Statutory Action to Test:</label>
                <select
                  value={testAction}
                  onChange={(e) => {
                    setTestAction(e.target.value as ActionPermissionCode);
                    setTestResult(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono cursor-pointer"
                >
                  {allActions.map((act) => (
                    <option key={act} value={act}>
                      {act}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleTestPermission}
                className="self-end px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Evaluate Authorization Policy</span>
              </button>
            </div>

            {testResult && (
              <div
                className={`p-4 rounded-lg border flex items-center justify-between gap-3 text-xs ${
                  testResult.authorized
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                    : 'bg-red-950/40 border-red-500/60 text-red-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {testResult.authorized ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold">
                      {testResult.authorized ? 'ACCESS AUTHORIZED' : 'ACCESS DENIED'}
                    </span>
                    <p className="text-[11px] opacity-90 mt-0.5">
                      {testResult.authorized
                        ? `Role [${activeUser.role}] is legally permitted to execute [${testAction}] within jurisdiction [${activeUser.jurisdictionName}].`
                        : testResult.reason}
                    </p>
                  </div>
                </div>
                <div className="font-mono text-[10px] opacity-80 shrink-0">
                  Audit Event Logged
                </div>
              </div>
            )}
          </div>

          {/* Master RBAC Matrix Table */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Statutory Role-Based Access Control (RBAC) Permissions Table
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[10px]">
                    <th className="p-2.5">Sovereign Role</th>
                    <th className="p-2.5">E-FIR Ops</th>
                    <th className="p-2.5">Evidence & Custody</th>
                    <th className="p-2.5">FSL Lab Reports</th>
                    <th className="p-2.5">Charge Sheet</th>
                    <th className="p-2.5">Judicial Orders</th>
                    <th className="p-2.5">Blockchain & Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px]">
                  {(Object.keys(RBAC_ROLE_PERMISSIONS) as SovereignRoleCode[]).map((role) => {
                    const perms = RBAC_ROLE_PERMISSIONS[role];
                    const isUserRole = activeUser.role === role;
                    return (
                      <tr key={role} className={isUserRole ? 'bg-amber-500/10 font-medium' : 'hover:bg-slate-850'}>
                        <td className="p-2.5 font-mono text-amber-300 font-bold">
                          {role} {isUserRole && '(Active)'}
                        </td>
                        <td className="p-2.5">{perms.includes('FIR_CREATE') ? 'Create / Edit' : perms.includes('FIR_READ') ? 'Read Only' : 'No Access'}</td>
                        <td className="p-2.5">{perms.includes('EVIDENCE_TRANSFER') ? 'Full Handover' : perms.includes('EVIDENCE_SEIZE') ? 'Seize Only' : 'Read'}</td>
                        <td className="p-2.5">{perms.includes('FSL_REPORT_SIGN') ? 'Examine & Sign' : perms.includes('FSL_REPORT_SUBMIT') ? 'Submit' : 'Read'}</td>
                        <td className="p-2.5">{perms.includes('CHARGE_SHEET_COGNIZANCE') ? 'Take Cognizance' : perms.includes('CHARGE_SHEET_VET') ? 'Vet & Scrutinize' : perms.includes('CHARGE_SHEET_DRAFT') ? 'Draft' : 'Read'}</td>
                        <td className="p-2.5">{perms.includes('FINAL_JUDGMENT_DECREE') ? 'Issue & Decree' : perms.includes('JUDICIAL_ORDER_ISSUE') ? 'Issue Orders' : 'None'}</td>
                        <td className="p-2.5 font-mono">{perms.includes('BLOCKCHAIN_AUDIT') ? 'Audit Node OK' : 'Verify Only'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: SECURITY AUDIT TRAIL */}
      {activeSubTab === 'audit_trail' && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Synchronous Security Audit Log & Non-Repudiation Trail</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every authentication event, role switch, access decision, and document operation is cryptographically signed and logged immutably.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">[{log.actionCode}]</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-300">{log.actorName} ({log.actorRole})</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{log.actorDepartment}</span>
                  </div>
                  <div className="text-slate-500">{log.timestamp.replace('T', ' ').slice(0, 19)} UTC</div>
                </div>

                <div className="text-slate-300">{log.details}</div>

                <div className="p-2 bg-slate-900 rounded border border-slate-800 font-mono text-[10px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span>IP/Terminal: {log.ipAddress}</span>
                  <span className="truncate max-w-sm">Signature Digest: {log.signatureDigest}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
