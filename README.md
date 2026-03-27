<div align="center">

<br/>

```
████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██╗███╗   ██╗
╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██║████╗  ██║
   ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██║██╔██╗ ██║
   ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██║██║╚██╗██║
   ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗██║     ██║██║ ╚████║
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═══╝
```

### AI-Powered Personal Finance & Wealth Management

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-trackfin--plum.vercel.app-6366f1?style=for-the-badge&logoColor=white)](https://trackfin-plum.vercel.app/)
[![Release](https://img.shields.io/badge/Release-V1.0.0-8b5cf6?style=for-the-badge)](https://github.com/your-username/finance-tracker)
[![Build](https://img.shields.io/badge/Build-Passing-10b981?style=for-the-badge)](https://github.com/your-username/finance-tracker)
[![Stack](https://img.shields.io/badge/Stack-MERN_+_Next.js-0ea5e9?style=for-the-badge)](https://github.com/your-username/finance-tracker)
[![AI](https://img.shields.io/badge/AI-Groq_LLaMA_3.3_70B-f59e0b?style=for-the-badge)](https://groq.com)

<br/>

> **TrackFin** is a full-stack personal finance application that goes far beyond basic expense tracking.  
> It combines secure authentication, real-time dashboards, household expense sharing,  
> and a **finance-only AI chatbot** — all wrapped in a SaaS-luxury UI.

<br/>

</div>

---

## 📸 Screenshots

> Add your actual screenshots by replacing the placeholders below.  
> Tip: Use [screely.com](https://screely.com) to make them look polished with a browser frame.

<br/>

| Dashboard | AI Chatbot | Transactions |
|:---------:|:----------:|:------------:|
| ![Dashboard](https://placehold.co/380x220/1e1b4b/a5b4fc?text=Dashboard+View&font=montserrat) | ![Chatbot](https://placehold.co/380x220/1e1b4b/a5b4fc?text=AI+Chatbot&font=montserrat) | ![Transactions](https://placehold.co/380x220/1e1b4b/a5b4fc?text=Transactions&font=montserrat) |

| Budgets & Goals | Household Sharing | Mobile View |
|:-----------:|:------------:|:----------:|
| ![Budgets](https://placehold.co/380x220/1e1b4b/a5b4fc?text=Budgets+%26+Goals&font=montserrat) | ![Household](https://placehold.co/380x220/1e1b4b/a5b4fc?text=Household+Sharing&font=montserrat) | ![Mobile](https://placehold.co/380x220/1e1b4b/a5b4fc?text=Mobile+View&font=montserrat) |

<br/>

---

## ✨ Feature Highlights

<br/>

### 🤖 AI Chatbot — Finance-Only Assistant (Groq API)

The standout feature of TrackFin. A floating, glassmorphic AI assistant powered by **LLaMA 3.3 70B via Groq**.

```
User: "how to make maggie"
Bot:  "I'm your Finance Assistant. I can only help with financial
       topics like budgets, expenses, income, savings, and goals."

User: "how much did I spend this month?"
Bot:  "You've spent ₹12,400 this month across Food (₹4,200),
       Travel (₹3,100), and Utilities (₹5,100)."
```

**What makes it production-grade:**
- ✅ **Profanity filter** — blocks abusive input before it reaches the API
- ✅ **Topic guard** — only responds to finance-related queries
- ✅ **User-scoped** — reads only the logged-in user's MongoDB data via JWT
- ✅ **Conversation memory** — full history sent on every request
- ✅ **Strong system prompt** — AI cannot be jailbroken into off-topic answers
- ✅ **Natural language transactions** — *"Spent ₹500 on coffee today"* → auto-extracted as expense

<br/>

### 🔐 Authentication & Security

| Feature | Implementation |
|---------|---------------|
| Login / Signup | JWT Access + Refresh Token pattern |
| Token Storage | Refresh token in `HttpOnly` cookie (XSS-safe) |
| Password Reset | OTP via Nodemailer (Gmail App Password) |
| Route Protection | `authMiddleware` on all private API routes |
| Password Hashing | BCrypt with salt rounds |
| API Key Safety | Groq key stays server-side, never exposed to frontend |

<br/>

### 💰 Financial Tracking

- **Transactions** — Add, edit, filter, delete income & expenses
- **Smart Categories** — Food, Travel, Healthcare, Shopping, Utilities, and more
- **Dashboards** — Total income, total expense, current balance, category pie charts
- **Budgets** — Set monthly limits per category, get alerts when nearing limit
- **Goals** — Long-term savings targets with progress tracking (e.g. ₹50,000 for vacation)
- **Recurring Transactions** — Auto-log fixed monthly expenses like rent or subscriptions

<br/>

### 👥 Household & Family Sharing

- Create a household and generate a unique **Invite Code**
- Family members join using the code and view shared expenses
- Separate personal vs. shared expense tracking

<br/>

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | React framework, file-based routing, SSR |
| **TailwindCSS** | Utility-first styling |
| **Framer Motion** | Page transitions, floating chatbot animations |
| **HeroIcons** | Icon library |
| **Axios** | HTTP client with request interceptors |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | Database + ODM schemas |
| **JWT** | Stateless auth (access + refresh tokens) |
| **BCrypt** | Password hashing |
| **Nodemailer** | OTP email delivery via Gmail |
| **Multer** | Avatar/file upload handling |

### AI & Integrations
| Technology | Purpose |
|-----------|---------|
| **Groq API** | LLM inference (ultra-fast, free tier available) |
| **LLaMA 3.3 70B** | The actual language model powering the chatbot |
| **Prompt Engineering** | System prompts for finance-scoped, user-safe responses |

### Deployment
| Service | What runs there |
|---------|----------------|
| **Vercel** | Next.js frontend |
| **Render** | Node.js/Express backend |
| **MongoDB Atlas** | Cloud database |

<br/>

---

## 📂 Project Structure

```
finance-tracker/
│
├── backend/                        # Node.js + Express API
│   └── src/
│       ├── controllers/
│       │   ├── aiController.js     # ← Groq chatbot, advisor, text extraction
│       │   ├── authController.js   # ← JWT, OTP, login/signup
│       │   ├── transactionController.js
│       │   ├── budgetController.js
│       │   ├── goalController.js
│       │   ├── categoryController.js
│       │   ├── householdController.js
│       │   ├── profileController.js
│       │   └── recurringController.js
│       ├── models/                 # Mongoose schemas
│       ├── routes/                 # Express route definitions
│       ├── middleware/
│       │   └── authMiddleware.js   # ← JWT verification on all private routes
│       └── utils/                  # Nodemailer, OTP generator, JWT helpers
│
└── frontend/                       # Next.js 14 App
    └── app/
        ├── auth/                   # Sign-in, Sign-up, OTP, Reset Password
        ├── dashboard/              # Main finance dashboards
        ├── components/
        │   ├── ChatbotBubble/      # ← Floating AI chat UI
        │   └── DashboardCharts/    # ← Income/expense visualizations
        └── lib/                    # Axios instance + API call helpers
```

<br/>

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Groq API key — get one free at [console.groq.com](https://console.groq.com)
- Gmail account with App Password enabled

<br/>

### Step 1 — Clone the repo

```bash
git clone https://github.com/your-username/finance-tracker.git
cd finance-tracker
```

### Step 2 — Backend environment

Create `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/trackfin

# JWT Secrets (use any long random strings)
JWT_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here

# Email (Gmail App Password — 16 chars, no spaces)
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop

# AI
GROQ_API_KEY=gsk_your_groq_api_key_here
```

### Step 3 — Frontend environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 4 — Install & run

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

```bash
# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

Visit `http://localhost:3000` — you're live. 🚀

<br/>

---

## 🧠 How the AI Chatbot Works (For Technical Readers)

The chatbot uses a **two-layer filtering system** before any Groq API call is made:

```
User message
     │
     ▼
┌─────────────────────────┐
│  Layer 1: Profanity     │──── blocked ──→  "Please keep it respectful."
│  (regex word boundary)  │
└────────────┬────────────┘
             │ clean
             ▼
┌─────────────────────────┐
│  Layer 2: Topic Guard   │──── off-topic ─→ "I only help with finance."
│  (finance keyword list) │
└────────────┬────────────┘
             │ finance ✓
             ▼
  Fetch user's MongoDB data
  (transactions + summary — scoped to JWT userId)
             │
             ▼
  Build messages array:
  [ system prompt, ...history, new message ]
             │
             ▼
     Groq API → LLaMA 3.3 70B
             │
             ▼
     Reply → Frontend
```

**The system prompt** enforces rules at the model level — even if a user crafts a clever message past the keyword filter, the LLM is instructed to refuse non-finance answers and never fabricate financial data.

**OpenAI-compatible format** — Groq uses the same `/v1/chat/completions` endpoint format as OpenAI, making it trivial to swap providers if needed.

<br/>

---

## 🔑 Key API Endpoints

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login + receive JWT
POST   /api/auth/verify-otp        Verify email OTP
POST   /api/auth/forgot-password   Trigger OTP for password reset

GET    /api/transactions           Get user's transactions (paginated)
POST   /api/transactions           Add new transaction
PUT    /api/transactions/:id       Edit transaction
DELETE /api/transactions/:id       Delete transaction

GET    /api/budgets                Get all budgets
POST   /api/goals                  Create a savings goal

POST   /api/ai/chatbot             Finance chatbot (auth required)
GET    /api/ai/advisor             Monthly AI tips (auth required)
POST   /api/ai/process-text        Natural language → transaction JSON
```

<br/>

---

## 🔒 Security Practices

- API keys live only in `.env` — never in frontend code
- JWT refresh tokens stored in `HttpOnly` cookies — not `localStorage`
- All `/api/ai/*` and `/api/transactions/*` routes require valid JWT
- Groq API called **server-side only** — the browser never touches it
- Profanity + topic filters run **before** the LLM — no wasted API calls
- Passwords hashed with BCrypt before storage — never stored in plain text

<br/>

---

## 🚀 Deployment Guide

### Frontend → Vercel
1. Push your repo to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Set `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
4. Deploy ✅

### Backend → Render
1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo, set root directory to `backend/`
3. Build command: `npm install` | Start command: `npm start`
4. Add all `.env` variables in Render's Environment tab
5. Deploy ✅

<br/>

---

## 🎯 Why This Project Stands Out

For a fresher/placement perspective, TrackFin combines things rarely seen together in student projects:

| What | Why it matters |
|------|---------------|
| **Groq AI with filters** | Shows prompt engineering + responsible AI — not just a raw API call |
| **JWT refresh token flow** | Industry-standard auth, not just `localStorage` tokens |
| **OTP via email** | Real-world flow used by every production app |
| **Household sharing** | Non-trivial data relationship — users sharing a resource |
| **PWA-ready** | App-like experience on mobile |
| **Deployed & live** | Shows you can ship, not just build locally |

<br/>

---

## 📝 One-Line Pitch

> *TrackFin is a full-stack AI-powered finance tracker built with Next.js, Node.js, and MongoDB, featuring a Groq-powered chatbot that is strictly scoped to personal finance data using prompt engineering and multi-layer input filtering.*

<br/>

---

<div align="center">

Made with ☕ and a lot of ₹ tracking

[![GitHub](https://img.shields.io/badge/Star_this_repo-⭐-yellow?style=for-the-badge)](https://github.com/your-username/finance-tracker)

</div>