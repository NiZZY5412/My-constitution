# Kenya Legal Oracle AI: Constitution of Kenya (2010) Legal Assistant

[![Status](https://img.shields.io/badge/Status-v1.0%20MVP-emerald.svg)]()
[![Law](https://img.shields.io/badge/Jurisdiction-Republic%20of%20Kenya-blue.svg)]()
[![Payments](https://img.shields.io/badge/Payments-Safaricom%20Daraja%20M--Pesa-green.svg)]()
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20pgvector-purple.svg)]()

**Kenya Legal Oracle AI** is a constitutional information prototype. Chat answers are retrieved from the article text included in the bundled dataset; this dataset is incomplete and should not be treated as a complete or authoritative legal source.

Users ask questions in natural language (English or Kiswahili) and receive immediate, accurate answers with **exact citations (Article, Clause, Chapter, and Schedule)**, verifiable quotes, and cross-references.

---

## 🎨 Color Palette & Design System
Organized with a modern, friendly UI combining:
- **Judicial Royal Blue (`#2563EB`)**: Trust, primary actions, and judiciary heraldry.
- **Electric Purple & Violet (`#7C3AED` / `#6D28D9`)**: AI Oracle intelligence and gradient headers.
- **Kenya Flag Scarlet & Coral (`#DC2626`)**: Statutory disclaimers and priority alert states.
- **Vibrant Rose / Pink (`#EC4899`)**: Interactive pills, active tags, and subtle badges.
- **Kenya Flag & Safaricom Green (`#059669`)**: M-Pesa STK Push, verified advocate badges, and active tiers.
- **Warm Gold & Amber (`#D97706`)**: Scales of justice heraldry, court seals, and Pro tier badges.

---

## 🌟 Key Product Capabilities

### 1. Client Web Application
- **Backend-grounded chat**: Retrieves available article and clause text from the bundled dataset. Unsupported provisions return no citation.
- **Article citations**: Responses cite the specific source clauses returned by retrieval.
- **Interactive Article Slide-over Drawer**: Click any citation badge to view the full statutory wording of clauses.
- **Legal Brief Export**: Pro and Firm tiers can export complete legal research memoranda to PDF or Word.
- **Starter Research Prompts**: Instant briefs for Article 47 (Fair Administrative Action), Article 27 (Non-discrimination & 2/3 Gender Rule), Article 160 (Judicial Independence), Article 174 (Objects of Devolution), and Article 49 (Arrested Persons & Bail).
- **Constitution Explorer**: Browse and search the constitutional content included in the bundled dataset.

### 2. Subscription & Safaricom Daraja M-Pesa Billing
- **Kenyan Pricing in KES**:
  - **Free**: KES 0 (5 messages per 8-hour window, starting with the first successful message)
  - **Pro Advocate**: KES 2,000 / month (200 questions/mo, brief exports, persistent history)
  - **Firm Starter**: KES 10,000 / month (1,000 questions; seat management is not yet enabled)
  - **Firm Business**: KES 25,000 / month (3,500 questions; seat management is not yet enabled)
- **M-Pesa STK Push**: Checkout is connected to Daraja credentials when configured. A plan is activated only after a matching payment callback is received. Receipts are payment confirmations, not KRA eTIMS invoices.

### 3. Server-Side Quota Enforcement (Rules 1–6)
- Enforces usage in the backend and persists successful message counts.
- Free allowance resets 8 hours after the first successful message in its current window.
- Suspended users can sign in, but protected chat and billing features are blocked.

### 4. Executive Governance & Admin Portal
- **User Management**: Search/filter accounts, view profile and payment records, grant plans and expiry dates, suspend/reactivate, reset usage, issue a temporary password that must be changed at next sign-in, and anonymize/delete an account.
- **Finance**: View recorded M-Pesa transactions, filter by status/method/date, export CSV, and inspect recorded revenue.
- **Audit Log**: Review administrator actions.
- **Payouts**: Requests can be recorded, but no funds are transferred. Live payouts require production provider setup, balance reconciliation, and a second-admin/2FA approval workflow.
- **Not yet connected**: Refunds, bank payouts, recurring-subscription churn/MRR and AI cost accounting, plan editing, firm seats, user ticket submission/email, content/prompt editing, staff RBAC, 2FA, IP allowlists, and announcements.

---

## Local Run

Run the backend from `backend` in one terminal. Set a unique super admin email and password before its first start:

```powershell
python -m pip install -r requirements.txt
$env:SUPER_ADMIN_EMAIL = "admin@example.com"
$env:SUPER_ADMIN_PASSWORD = "use-a-unique-password-of-at-least-12-characters"
python -m uvicorn app.main:app --reload --port 8000
```

Run the client from the project root in a second terminal:

```powershell
node server.js
```

- Client: [http://localhost:3000](http://localhost:3000)
- Super admin: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)
- Backend API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

Accounts are stored in `backend/data/klo.sqlite3`. Registration creates an account but does not sign it in. The configured super admin is created on the backend's first start; no demo role switcher or default admin password is provided.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Client Frontend** | HTML5, CSS3 (Tailwind + Custom Palette), Modern ES Modules | High speed, streaming UI, zero build step needed for preview |
| **Backend API** | Python (FastAPI), Pydantic v2, Uvicorn | High performance async API with automatic OpenAPI documentation |
| **Vector Database** | PostgreSQL 16 with `pgvector` | Unified relational store for user billing and 1536-dim embeddings |
| **Cache & Quotas** | Redis 7 | Atomic quota counters, rate limiting, and Daraja callback queuing |
| **Payments** | Safaricom Daraja API | Lipa na M-Pesa Online STK Push, C2B, and B2C Payouts |
| **DevOps & Containers** | Docker, Docker Compose, GitHub Actions | Multi-container deployment for AWS Cape Town (`af-south-1`) |

---

## 📁 Project Structure

```
├── index.html                    # Complete Client Web App + Admin Portal + Modals
├── server.js                     # Native Node.js static client server
├── admin.html                    # Super admin client
├── css/
│   └── styles.css                # 7-color Kenyan design system (Pink, Blue, Purple, Red, Violet, Emerald, Gold)
├── js/
│   ├── api.js                    # Frontend API client
│   ├── app.js                    # Tab coordinator, modals, toasts
│   ├── auth.js                   # Backend registration, login, and session management
│   ├── chat.js                   # Chat client and citation rendering
│   ├── constitution_data.js      # Client-side Constitution dataset
│   ├── constitution_browser.js   # Searchable reader for bundled Constitution data
│   ├── billing.js                # Plans, M-Pesa checkout, verified payment status, payment receipt
│   └── admin.js                  # Backend-connected admin user controls
├── backend/
│   ├── requirements.txt          # Python dependencies
│   └── app/
│       ├── main.py               # FastAPI entrypoint with CORS & routes
│       ├── config.py             # Settings (Daraja, DB, Redis, Anthropic/OpenAI)
│       ├── models/models.py      # SQLAlchemy 2.0 models with pgvector column
│       ├── services/
│       │   ├── daraja.py         # Safaricom Daraja STK Push & B2C client
│       │   ├── rag_engine.py     # Backend retrieval with clause-accurate citations
│       │   └── quota.py          # Server-side quota enforcement
│       ├── data/
│       │   └── constitution_knowledge.json # Article text used by backend retrieval
│       └── routers/
│           ├── auth.py           # Registration & login
│           ├── chat.py           # Authenticated chat retrieval and quota checks
│           ├── billing.py        # Plans & Daraja webhook callbacks
│           ├── admin.py          # User management, finance records, audit and safe payout requests
│           └── constitution.py   # Article & chapter endpoints
├── database/
│   └── schema.sql                # Full PostgreSQL schema with pgvector indexes
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml        # Orchestration for PostgreSQL + pgvector, Redis, FastAPI, Nginx
├── .github/
│   └── workflows/ci-cd.yml       # GitHub Actions CI/CD pipeline
└── scripts/
    ├── deploy.sh                 # Linux production deployment script
    └── reindex_constitution.sh   # Data ingestion & vector re-indexing script
```

---

## Legal and payment limitations
- The product provides information only, not legal advice. Verify legal text independently.
- No KRA eTIMS invoices or tax-compliance claims are made by this prototype.
- Production payment callbacks require deployment on the configured public HTTPS endpoint and provider verification before use.

---

© 2026 Kenya Legal Oracle AI. Built for the Legal Fraternity of the Republic of Kenya.
