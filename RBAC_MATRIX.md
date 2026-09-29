# Role-Based Access Control (RBAC) & Permission Matrix

| Role Code | Role Title | FIR Ops | Case / IO Notes | Evidence & Custody | FSL Reports | Charge Sheet | Court e-Filing | Judicial Orders | Audit Logs | Blockchain Audit | Asset Lifecycle |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `NAT_ADMIN` | National Administrator | Read (All) | Read (All) | Read (All) | Read (All) | Read (All) | Read (All) | Read (All) | Full Read/Export | Full Read/Verify | Read (All) |
| `STATE_ADMIN` | State Administrator | Read (State) | Read (State) | Read (State) | Read (State) | Read (State) | Read (State) | Read (State) | Read (State) | Verify (State) | Manage (State) |
| `DIST_ADMIN` | District Administrator | Read (Dist) | Read (Dist) | Read (Dist) | Read (Dist) | Read (Dist) | Read (Dist) | Read (Dist) | Read (Dist) | Verify (Dist) | Manage (Dist) |
| `POLICE_COMM` | Police Commissioner / DGP | Read (Range) | Read (Range) | Read (Range) | Read (Range) | Review (Range)| Read (Range) | Read (Range) | Read (Range) | Verify (Range) | Manage (Range) |
| `STATION_OFFICER` | Station House Officer (SHO)| Approve/Sign | Assign/Review | Supervise | Read | Vetting | Forward | Read | Station Audit | Verify | Manage Station |
| `IO_OFFICER` | Investigating Officer (IO) | Lodge/Draft | Create/Update | Seize/Transfer | Request | Draft/Submit | Submit | Read Hearing | Case Audit | Verify Case | Read/Use |
| `EVIDENCE_OFFICER` | Malkhana / Evidence Officer| Read | Read Exhibit | Custody In/Out | Transport | Read | Read | Read | Custody Audit | Anchor/Verify | Asset Track |
| `FORENSIC_OFFICER`| Forensic Scientist (CFSL/FSL)| Read Request| Read Memo | Receive/Examine| Create/Sign | Read | Read | Testify Report | FSL Audit | Anchor/Verify | Lab Instrument |
| `PROSECUTOR` | Public Prosecutor (DoP) | Read | Read Docket | Inspect | Review | Scrutinize/Vet| File/Docket | Plead / Bail | Trial Audit | Verify | None |
| `JUDGE_MAGISTRATE`| Judicial Magistrate / Judge| Read Cognizance| Read Record | Admitted Only | Admitted Only | Take Cognizance| Admit/List | Issue/Sign/Decree| Judicial Audit | Verify Decree | None |
| `COURT_CLERK` | Court Registrar / Clerk | Read | Read | Mark Exhibit | Read | Register | List Cause | Seal / Issue | Registry Audit | Verify | None |
| `AUDITOR` | System & Compliance Auditor | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Full Read-Only | Full Verify | Read-Only |
| `SECURITY_OFFICER`| System Security Officer (CISO)| None (Meta) | None (Meta) | None (Meta) | None (Meta) | None (Meta) | None (Meta) | None (Meta) | Full Security | Node Integrity | Device Fleet |
