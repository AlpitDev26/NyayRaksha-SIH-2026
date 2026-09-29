# National Secure Digital Justice & Investigation Document Management Platform (NSDJ-DMS)
## System Architecture & Specification Document

### 1. High-Level System Architecture
```
+-----------------------------------------------------------------------------------------------+
|                                      PRESENTATION TIER                                        |
|  [State/District Command]  [IO Mobile/Field PWA]  [Forensic Bench]  [Prosecution & Court e-Bench]|
+-----------------------------------------------------------------------------------------------+
                                               | (TLS 1.3 / mTLS / PKI)
+-----------------------------------------------------------------------------------------------+
|                                API GATEWAY & ZERO-TRUST POLICY                                |
|  - Rate Limiting / WAF         - Token / PKI Authentication     - Fine-grained RBAC Authorizer|
|  - Request Signature Verifier  - Anomaly & IP Validator         - Immutable Audit Interceptor |
+-----------------------------------------------------------------------------------------------+
                                               |
+-----------------------------------------------------------------------------------------------+
|                                     APPLICATION SERVICES                                      |
|  +------------------+  +-------------------+  +------------------+  +----------------------+  |
|  | Auth & Org Tree  |  | Case & FIR Engine |  | Document Vault   |  | Evidence & Custody   |  |
|  +------------------+  +-------------------+  +------------------+  +----------------------+  |
|  +------------------+  +-------------------+  +------------------+  +----------------------+  |
|  | Court / Law Desk |  | Asset Lifecycle   |  | Offline Sync Hub |  | AI Legal & Forensics |  |
|  +------------------+  +-------------------+  +------------------+  +----------------------+  |
|  +------------------+  +-------------------+  +------------------+  +----------------------+  |
|  | Search & Query   |  | Audit Engine      |  | Notification Hub |  | CCTNS/ICJS Adapters  |  |
|  +------------------+  +-------------------+  +------------------+  +----------------------+  |
+-----------------------------------------------------------------------------------------------+
                                               |
+-----------------------------------------------------------------------------------------------+
|                           DATA PERSISTENCE & CRYPTOGRAPHIC LEDGER                             |
|  +-----------------------------+  +----------------------------+  +------------------------+  |
|  | Relational DB (PostgreSQL)  |  | Encrypted Storage (AES-256)|  | SHA-256 / Merkle Ledger|  |
|  | State, metadata, audit log  |  | Large PDFs, images, drives |  | Permissioned Blockchain|  |
|  +-----------------------------+  +----------------------------+  +------------------------+  |
+-----------------------------------------------------------------------------------------------+
```

### 2. Multi-Tiered Organization & Jurisdiction Hierarchy
```
National Level (MHA, Ministry of Law & Justice, Supreme Court Registry)
   └── State / UT Level (Directorate General of Police, High Court Registry, State FSL)
         └── District Level (District Magistrate, Sessions Court, SP / DCP Office)
               └── Police Commissionerate / Range / Sub-Division (ACP / DSP Circle)
                     └── Police Station / Special Cell (SHO, IO, Malkhana In-Charge)
                           └── Cases / FIRs / Investigation Dockets
                                 └── Documents / Evidence Exhibits / Custody Logs / Assets
```
