# AI Handoff — Context Recovery Assistant
> **Full-Stack MERN Context Reconstruction & Project Intelligence Platform**  
> *Developed by M. Durga • SRS Compliant Full-Stack MVP*

[![Node.js](https://img.shields.io/badge/Node.js-v24+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2+-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-cyan.svg)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express-4.21+-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_Free_Tier-green.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 1. Project Overview & SRS Summary
**AI Handoff — Context Recovery Assistant** is an AI-powered full-stack SaaS platform that reconstructs the complete context of an ongoing project from scattered, unstructured documents (meeting notes, task backlogs, technical specs, client updates) so that a new team member or project manager can take over immediately and confidently without starting from zero.

Instead of acting as a generic document chatbot, AI Handoff reconstructs structured project intelligence:
- **Overview & Situation:** Current ground truth, progress velocity, and milestones.
- **Cross-Document Reasoning:** Establishes `Evidence → AI Interpretation → Current Context` chains.
- **Conflict Detection:** Detects discrepancies between old meeting blockers and newer client approvals.
- **Source Traceability:** Every task, decision, and blocker links to its exact source document, page, and excerpt.
- **Grounded AI Project Chat:** Answers questions strictly based on uploaded artifacts with citation chips and strict fallback.
- **Downloadable Handoff Report:** Comprehensive printable executive report with recommended next actions.

---

## 2. The 5 Core Features Mapped to SRS Requirements

| Feature Pillar | SRS Requirements | Core Capabilities & UI Highlights |
| :--- | :--- | :--- |
| **Feature 1: Project Overview & Health Command Center** | **FR2, FR5, FR12** | Project workspace creation, SmartClinic demo quick-loader, computed portfolio metrics (total projects, active projects, pending tasks, open issues), situation ground truth, progress milestones, health index breakdown (Tasks, Deadlines, Issues, Docs, Context), and Handoff Readiness score. |
| **Feature 2: Multi-Format Document Ingestion & Chunking** | **FR3, FR4, FR9** | Drag-and-drop ingestion for **PDF, DOCX, TXT, and CSV**. Metadata categorization (*Meeting Notes, Task List, Project Report, Client Communication, Technical Documentation*), text cleaning, chunking with page and line tracking, and extracted text inspector. |
| **Feature 3: Cross-Document Reasoning & Conflict Detection** | **FR8, FR9** | Multi-document synthesis connecting statements across sources into `Evidence → AI Interpretation → Current Context`. Conflict Detection Center identifying conflicting statuses (e.g. Sprint Notes Blocked vs Client Memo Approved), temporal precedence, and resolution reviews. |
| **Feature 4: Context Intelligence (Tasks, Decisions, Timeline)** | **FR6, FR7** | Tasks matrix (completed vs pending with priority, assignee, deadline, dependencies, and interactive manual status updates), Decisions log with **"Why was this decision made?"** rationale modal, Issues & Blockers radar with AI suggested actions, and a visual Chronological Timeline with document citations. |
| **Feature 5: Grounded AI Chat & Downloadable Handoff Report** | **FR10, FR11, FR13** | Project-specific chat strictly grounded in uploaded project documentation with clickable source chips and mandated fallback (*"I couldn’t find supporting information in the uploaded project documents"*). Generates full structured Handoff Report with Next Actions, printable view (`window.print()`), JSON download, and 9-step **Presentation Mode** stakeholder walkthrough. |

---

## 3. SRS Traceability Matrix (Final Year Project Proof)

| SRS Requirement ID | Requirement Name | Implemented As | API Endpoint | Frontend Page / Component |
| :--- | :--- | :--- | :--- | :--- |
| **FR1** | User Authentication | JWT Register, Login, Profile & Demo Session | `POST /api/auth/register`<br>`POST /api/auth/login`<br>`GET /api/auth/profile` | `/login`, `/register`, `AuthContext.jsx` |
| **FR2** | Project Management | Project CRUD, Dashboard Stats & SmartClinic Demo Seeder | `POST /api/projects`<br>`GET /api/projects`<br>`GET /api/projects/dashboard-stats`<br>`POST /api/projects/demo` | `/dashboard`, `Dashboard.jsx` |
| **FR3** | Document Upload & Management | Drag-and-Drop Ingestion, Categorization & Processing Pipeline | `POST /api/projects/:id/documents`<br>`GET /api/projects/:id/documents`<br>`POST /api/documents/:id/reprocess`<br>`DELETE /api/documents/:id` | `/projects/:id/documents`, `DocumentManager.jsx` |
| **FR4** | Text Extraction & AI Analysis | Text Cleaning, Chunking & Cross-Document Schema Synthesis | `POST /api/projects/:id/analyze` | `/projects/:id/overview`, `ProjectOverview.jsx` |
| **FR5** | Project Overview | Situation ground truth, health radar, progress bar & AI score basis | `GET /api/projects/:id` | `/projects/:id/overview`, `ProjectOverview.jsx` |
| **FR6** | Tasks, Decisions & Issues | Task status updates, "Why was this made?" rationale & Blocker radar | `GET /api/projects/:id/tasks`<br>`PATCH /api/tasks/:id/status`<br>`GET /api/projects/:id/decisions`<br>`GET /api/projects/:id/issues`<br>`PATCH /api/issues/:id/status` | `/projects/:id/context`, `ContextIntelligence.jsx` |
| **FR7** | Deadlines, Milestones & Timeline | Chronological event trace with source document & AI explanation | `GET /api/projects/:id/timeline` | `/projects/:id/context`, `ContextIntelligence.jsx` |
| **FR8** | Cross-Document Reasoning & Conflicts | Evidence → Interpretation → Context chains & Status divergence | `GET /api/projects/:id/insights` | `/projects/:id/reasoning`, `CrossDocReasoning.jsx` |
| **FR9** | Source References | Verified document, page, section & text excerpt inspector | `GET /api/documents/:id/source` | `SourceViewerModal.jsx` |
| **FR10** | Grounded AI Project Chat | Strict document Q&A, citation chips & missing info fallback | `POST /api/projects/:id/chat` | `/projects/:id/handoff`, `ChatAndReport.jsx` |
| **FR11** | Handoff Report & Next Actions | Full printable report, JSON export & prioritized actionable steps | `POST /api/projects/:id/generate-handoff` | `/projects/:id/handoff`, `ChatAndReport.jsx` |
| **FR12** | Handoff Readiness | Readiness score (Ready vs Needs Review) & Missing Context audit | `GET /api/projects/:id` | `/projects/:id/overview`, `ProjectOverview.jsx` |
| **FR13** | Presentation Mode | 9-step interactive slide walkthrough for team & stakeholder review | Client-side Stepper | `PresentationModeModal.jsx` |

---

## 4. Tech Stack (Strictly Free-Tier Only)

- **Frontend:**
  - React 19 + Vite 8
  - Tailwind CSS + Lucide React Icons
  - React Router DOM v7
  - Axios (with JWT interceptors)
  - Recharts (Health Index comparison bar charts & task distribution)
- **Backend:**
  - Node.js + Express.js
  - JWT Authentication + Bcryptjs password hashing
  - Multer (multi-part document uploads)
  - CORS + Dotenv
- **Database (Zero-Config Dual Engine):**
  - **MongoDB Atlas FREE Tier:** Automatically connects if `MONGO_URI` is provided in `server/.env`.
  - **In-Memory / Local JSON Fallback Store:** If `MONGO_URI` is empty or unreachable, `server/config/localStore.js` seamlessly stores data in-memory and persists to `server/data/local_db.json`. **The app runs with zero configuration out of the box!**
- **AI Processing (Deterministic & Context-Aware Engine):**
  - Client-side and server-side rule-based NLP extraction engine (`client/src/services/aiService.js` and `server/controllers/analysisController.js`).
  - Simulates realistic 800ms AI synthesis delay.
  - Zero paid API keys, zero OpenAI/Gemini charges, 100% free-tier compliant.

---

## 5. MERN Folder Structure

```
aih/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Card.jsx                  # Glassmorphism container
│   │   │   ├── Charts.jsx                # Recharts visualizations
│   │   │   ├── Layout.jsx                # Shell with top Navbar & Sidebar
│   │   │   ├── Loader.jsx                # Progressive animated feedback loader
│   │   │   ├── Modal.jsx                 # Accessible dialog component
│   │   │   ├── Navbar.jsx                # Brand topbar, demo loader, user badge
│   │   │   ├── PresentationModeModal.jsx # 9-step executive presentation walkthrough (FR13)
│   │   │   ├── ProtectedRoute.jsx        # JWT route guard
│   │   │   ├── Sidebar.jsx               # Navigation for the 5 core features
│   │   │   └── SourceViewerModal.jsx     # Source citation inspector with highlighted text (FR9)
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # JWT session state, login, register, demo mode
│   │   ├── pages/
│   │   │   ├── Landing.jsx               # Hero, problem vs solution, feature matrix
│   │   │   ├── Login.jsx                 # Sign in with instant demo fill
│   │   │   ├── Register.jsx              # Account creation
│   │   │   ├── Dashboard.jsx             # Portfolio stats, project cards, creation modal (FR2)
│   │   │   ├── ProjectOverview.jsx       # Feature 1: Command Center, health radar, readiness (FR2, FR5, FR12)
│   │   │   ├── DocumentManager.jsx       # Feature 2: Multi-format upload, chunks, extraction (FR3, FR4, FR9)
│   │   │   ├── CrossDocReasoning.jsx     # Feature 3: Evidence chains & conflict resolution (FR8, FR9)
│   │   │   ├── ContextIntelligence.jsx   # Feature 4: Tasks matrix, decisions, timeline (FR6, FR7)
│   │   │   └── ChatAndReport.jsx         # Feature 5: Grounded chat & printable report (FR10, FR11, FR13)
│   │   ├── services/
│   │   │   ├── api.js                    # Axios instance with auth interceptor
│   │   │   └── aiService.js              # Client-side deterministic AI engine (800ms delay)
│   │   ├── App.jsx                       # React Router configuration
│   │   ├── index.css                     # Tailwind design system & print styles
│   │   └── main.jsx                      # Vite React entry point
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js                    # Vite configuration with Tailwind & backend proxy
│
├── server/
│   ├── config/
│   │   ├── db.js                         # Dual DB connector (MongoDB Atlas + Fallback)
│   │   └── localStore.js                 # Local persistent JSON / memory database engine
│   ├── controllers/
│   │   ├── analysisController.js         # Cross-document analysis & context reconstruction
│   │   ├── authController.js             # User registration, login, profile
│   │   ├── chatController.js             # Grounded project chat with source citations
│   │   ├── decisionController.js         # Decision log and rationale excerpts
│   │   ├── documentController.js         # Uploads, chunking, source inspection, reprocess
│   │   ├── issueController.js            # Blocker radar & status updates
│   │   ├── projectController.js          # Project CRUD, dashboard metrics, demo launcher
│   │   ├── reportController.js           # Structured handoff report compilation
│   │   ├── seedDemoData.js               # SmartClinic Management Platform preloaded demo
│   │   ├── taskController.js             # Tasks matrix and manual status updates
│   │   └── timelineController.js         # Chronological event trace
│   ├── middleware/
│   │   ├── authMiddleware.js             # JWT verification and guest session handler
│   │   └── errorHandler.js               # Global JSON error handling
│   ├── models/
│   │   ├── AIInsight.js                  # Cross-document connections and conflicts
│   │   ├── Decision.js                   # Architectural decisions & reasons
│   │   ├── Document.js                   # Ingested documents, text, and chunks
│   │   ├── Issue.js                      # Blockers, severity, suggested actions
│   │   ├── Milestone.js                  # Project deadlines and milestones
│   │   ├── Project.js                    # Project workspaces, status, and readiness
│   │   ├── Task.js                       # Completed and pending deliverables
│   │   ├── TimelineEvent.js              # Chronological history with source citations
│   │   └── User.js                       # User authentication entity
│   ├── routes/
│   │   ├── auth.js                       # /api/auth routes
│   │   ├── documents.js                  # /api/documents routes
│   │   ├── issues.js                     # /api/issues routes
│   │   ├── projects.js                   # /api/projects routes
│   │   └── tasks.js                      # /api/tasks routes
│   ├── .env.example
│   ├── package.json
│   └── server.js                         # Express server entry point
│
├── .gitignore
├── package.json                          # Root package scripts
└── README.md                             # Comprehensive documentation
```

---

## 6. How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Quick Start (Both Client & Server)

1. **Clone or Navigate to the Directory:**
   ```bash
   cd aih
   ```

2. **Install All Dependencies:**
   ```bash
   # From root: installs root, server, and client dependencies
   npm run install:all
   ```

3. **Start the Backend API:**
   ```bash
   cd server
   npm start
   # Server starts on http://localhost:5000
   ```

4. **Start the Frontend Client (in a separate terminal):**
   ```bash
   cd client
   npm run dev
   # Vite development server starts on http://localhost:5173
   ```

5. **Open in Browser:**
   Visit **[http://localhost:5173](http://localhost:5173)**.  
   Click **"Try Demo Project"** to immediately explore the pre-loaded **SmartClinic Management Platform** with all 5 features active!

---

## 7. Automated API Verification Results

A complete automated API test suite was executed against the backend server verifying all functional routes:

```
Testing AI Handoff Backend APIs...
1. Health Check:                  PASS
2. Demo Project Seed:             PASS (SmartClinic Management Platform)
3. Dashboard Stats:               PASS (1 project, 0 pending tasks)
4. Documents Ingested:            PASS (4 documents: TXT, CSV, DOCX, PDF)
5. Source Inspector:              PASS (Sprint_24_Meeting_Notes.txt)
6. Tasks Matrix:                  PASS (5 tasks)
7. Manual Task Status Update:     PASS (PATCH /api/tasks/:id/status)
8. Decisions & Rationale:         PASS (2 decisions with source excerpts)
9. Issues & Blockers Radar:       PASS (2 issues with suggested actions)
10. Chronological Timeline:       PASS (6 events sorted chronologically)
11. Reasoning & Conflicts:        PASS (4 insights: Context Connections & Conflicts)
12. Grounded AI Chat:             PASS (2 sources cited with excerpts)
13. Chat Fallback Requirement:    PASS ("I couldn’t find supporting information...")
14. Handoff Report Generation:    PASS (Ready score: 88%)
```

---

## 8. Deployment Ready: Vercel & Render

### Frontend Deployment (Vercel)
1. Push project to GitHub.
2. In Vercel, import the repository and set the **Root Directory** to `client`.
3. Framework Preset: **Vite**.
4. Set Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://ai-handoff-api.onrender.com/api`).
5. Deploy.

### Backend Deployment (Render)
1. In Render, create a new **Web Service**.
2. Set **Root Directory** to `server`.
3. Build Command: `npm install`.
4. Start Command: `node server.js`.
5. Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `your_random_jwt_secret_key`
   - `CLIENT_URL`: Your Vercel frontend URL
   - `MONGO_URI`: (Optional) MongoDB Atlas connection string. If omitted, Render will seamlessly use the built-in persistent local fallback store.
6. Deploy.

---

## 9. Academic & Evaluation Highlights
- **Zero Paid Dependencies:** Runs completely within free-tier allowances.
- **Traceability Guarantee:** No facts or conclusions are fabricated; every derived task, decision, and conflict references an exact file and excerpt.
- **Resilient Fallback Design:** Server will never crash if an external database or LLM endpoint is unreachable.
- **Presentation Ready:** Includes a 9-step interactive Presentation Mode specifically designed for stakeholders and evaluation committees.
