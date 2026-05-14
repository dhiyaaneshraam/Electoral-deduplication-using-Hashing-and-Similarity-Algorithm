# 🗳️ Electoral Deduplication System

> A full-stack voter registration and deduplication platform built with **React** (frontend) and **Spring Boot** (backend), using hashing and similarity algorithms to detect and block duplicate voter entries.

---

## 📌 Overview

Duplicate voter registrations are a major issue in large-scale electoral systems — they lead to fraud, incorrect headcounts, and administrative errors. This project solves that with a complete end-to-end solution:

- Citizens can register, track their application, and edit their details
- The system automatically detects duplicates using **SHA-256 hashing** and **similarity scoring**
- Admins can approve/reject flagged applications via a secure protected dashboard

---

## 🖥️ Features

### 👤 User Portal
- **OTP-based Login** — Phone number authentication with a 6-digit OTP
- **Voter Registration** — Submit name, Aadhaar, DOB, address, and photo
- **Application Status Tracker** — 4-stage visual progress timeline (Submitted → Deduplication → Admin Review → ID Issued)
- **Edit Profile** — Update address after Voter ID verification

### 🛡️ Admin Dashboard
- **Live Stats** — Total voters, pending verifications, duplicate count, detection rate
- **Voter Registry** — Full searchable table with block, remove, and view-details actions
- **Verification Queue** — Manually approve or reject near-duplicate flagged applications with confirmation modals
- **Duplicate Attempts Log** — Read-only audit log of all blocked entries with confidence scores and source IPs
- **System Health Monitor** — Hash collision rate, queue processing %, DB sync status

---

## 🛠️ Tech Stack

### Frontend
| Technology | Usage |
|---|---|
| React 18 | Component-based UI |
| React Router v6 | Client-side routing with admin route guards |
| Inline CSS + CSS Variables | Custom design system (no external UI lib) |
| DM Sans + Playfair Display | Typography |

### Backend
| Technology | Usage |
|---|---|
| Java + Spring Boot 3.5 | REST API server |
| Spring Data JPA | Database ORM |
| Spring Web | REST endpoints |
| Spring Validation | Input validation |
| Maven | Build & dependency management |

---

## 🧠 How Deduplication Works

```
New Registration Request
        │
        ▼
┌──────────────────────────┐
│  SHA-256 Field Hashing   │  ──► Exact match → Instantly rejected & logged
└──────────────────────────┘
        │ No exact match
        ▼
┌──────────────────────────┐
│  Similarity Scoring      │  ──► Score > threshold → Sent to Verification Queue
│  (Name, DOB, Phone...)   │
└──────────────────────────┘
        │ Score below threshold
        ▼
  ✅ Auto-approved → Voter ID issued
```

- Similarity checks catch **near-duplicates** (e.g. name typos, slight DOB differences)
- Applications above the similarity threshold go to the **Admin Verification Queue** for manual review
- Confirmed duplicates are permanently logged in the **Duplicate Attempts** audit trail with 100% confidence tagging

---

## 📁 Project Structure

```
electoral-deduplication/
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx               # OTP login + Admin credential login
│       │   ├── Registration.jsx        # New voter registration form
│       │   ├── ApplicationStatus.jsx   # 4-stage status tracker
│       │   ├── EditDetails.jsx         # Address update (with Voter ID verify)
│       │   ├── AdminDashboard.jsx      # Stats + recent registrations + alerts
│       │   ├── StoredVoters.jsx        # Full voter registry with search & actions
│       │   ├── VerificationQueue.jsx   # Approve / reject similar applications
│       │   └── DuplicateAttempts.jsx   # Read-only blocked attempts log
│       ├── App.jsx                     # Routes + RequireAdmin route guard
│       ├── main.jsx                    # React entry point
│       └── index.css                   # Global styles + CSS variables
│
├── backend/
│   ├── src/main/java/
│   │   └── (controllers, services, repositories, models)
│   ├── pom.xml
│   └── mvnw
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/user/login` | Send OTP to phone number |
| POST | `/auth/user/verify-otp` | Verify OTP and start session |
| POST | `/auth/admin/login` | Admin credential login |
| GET | `/user/status/:id` | Get voter registration status + timeline |
| PUT | `/user/update/:id` | Update voter address |
| GET | `/admin/stats` | Dashboard stats (total, pending, duplicates) |
| GET | `/admin/voters` | All registered voters |
| PATCH | `/admin/voters/:id/block` | Block a specific voter |
| DELETE | `/admin/voters/:id` | Permanently remove a voter |
| GET | `/admin/verifications` | Pending verification queue |
| POST | `/admin/verification/resolve/:id?approve=true/false` | Approve or reject application |
| GET | `/admin/duplicates` | All duplicate attempt logs |

---

## ▶️ How to Run

### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
# Server starts at http://localhost:8080
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
# App opens at http://localhost:5173
```

## 👨‍💻 Author

**[Your Name]**
- GitHub: [@dhiyaaneshraam](https://github.com/dhiyaaneshraam/Electoral-deduplication-using-Hashing-and-Similarity-Algorithm)
- gmail: [dhiyaaneshraam@gmail.com]
---

⭐ *If you found this useful, give it a star!*
