# 📘 NextGen Finance Tracker — AI-Powered Wealth Management

![Release](https://img.shields.io/badge/Release-V1.0.0-indigo.svg)
![Build](https://img.shields.io/badge/Build-Passing-emerald.svg)
![Tech](https://img.shields.io/badge/Stack-MERN%20+%20Next.js-teal.svg)

A complete, full-stack personal finance and wealth management application built using **Next.js**, **Node.js**, **Express**, and **MongoDB**. Designed with a **"Modern SaaS Luxury"** aesthetic, it goes beyond basic CRUD operations by integrating advanced **AI Chatbots**, **Household Expense Sharing**, and **Secure OTP Authentication**.

---

## 🚀 Key Features

### 🔐 Ironclad Security & Authentication
* **JWT-Based Authentication** with secure `HttpOnly` refresh token cookies.
* **OTP Email Verification** using Nodemailer (Gmail App Passwords) for Sign Up and Forgot Password flows.
* Profile Management, Change Password functionality, and strict route protection.

### 💰 Robust Financial Tracking
* **Transactions Manager:** Add, edit, filter, and delete income and expenses.
* **Financial Dashboards:** View total income, expense, balance, and visual categorizations.
* **Budgets & Goals:** Track long-term financial goals and set dynamic category limits.
* **Smart Categorization:** Automatically categorize transactions (Food, Travel, Healthcare, etc.).

### ✨ Next-Gen AI Integrations (Powered by Groq)
* **Live AI Chatbot Advisor:** A fully responsive, glassmorphic floating AI assistant that remembers your conversation history.
* **Natural Language Extraction:** Add expenses just by writing a sentence (e.g., *"I spent ₹500 on coffee today"*).
* **Monthly AI Insights:** Proactive tips generated automatically by analyzing your recent transactions and goals.

### 👥 Household & Family Sharing
* **Household Management:** Create or join customized households via unique **Invite Codes**.
* Share and view expenses together as a team or family.

### 🎨 "SaaS Luxury" UI/UX
* Completely built with **TailwindCSS** and powered by **Framer Motion** for liquid, bouncy animations.
* Glassmorphism, subtle glowing drop shadows, dark mode gradients, and perfectly responsive mobile flows (e.g., full-screen mobile chat).

---

## 🛠 Tech Stack

**Frontend Framework:** Next.js, React  
**Styling & Animations:** TailwindCSS, Framer Motion, HeroIcons  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**Authentication & Security:** JWT (Access/Refresh), BCrypt Password Hashing  
**AI & LLMs:** Groq API (`llama-3.3-70b-versatile`)  
**Mailing Service:** Nodemailer (Gmail integration)  
**File Uploading:** Multer (for custom User Avatars)  
**Deployment:** Vercel (Frontend), Render (Backend)

---

## 📂 Project Structure

```text
finance-tracker/
├── backend/                  # Node.js API Server
│   ├── src/controllers/      # Auth, AI, Transactions, Households logic
│   ├── src/models/           # MongoDB schemas
│   ├── src/routes/           # Express endpoints
│   ├── src/middleware/       # JWT verifications & Upload handlers
│   └── src/utils/            # Nodemailer, OTP logic, JWT generators
│
└── frontend/                 # Next.js Application
    ├── app/auth/             # Sign-in, Sign-up, Reset Password, Verify-OTP flows
    ├── app/components/       # ChatbotBubble, DashboardCharts, Navigation
    ├── app/dashboard/        # Main User Dashboards
    └── lib/                  # Axios interceptions & API calls
```

---

## ⚙️ Installation & Local Setup

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/your-username/finance-tracker.git
cd finance-tracker
\`\`\`

### 2. Configure Environment Variables
You must create **two** environment files. Because this repository aggressively ignores secrets, you need to create them manually.

**In the `backend/` folder**, create a `.env` file:
\`\`\`env
# Server Config
PORT=5000
NODE_ENV=development

# Database Config
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/database

# Authentication Secrets (Generate any long random string for these)
JWT_SECRET=your_long_random_access_secret
JWT_REFRESH_SECRET=your_long_random_refresh_secret

# Email Config (Requires a 16-character Google App Password)
EMAIL_USER=your.actual.email@gmail.com
EMAIL_PASS=abcdefghijklmnop

# AI Integrations
GROQ_API_KEY=gsk_your_groq_api_key_here
\`\`\`

**In the `frontend/` folder**, create a `.env.local` file:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000
\`\`\`

### 3. Install Dependencies & Run
Open two separate terminals:

**Terminal 1 (Backend):**
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

**Terminal 2 (Frontend):**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Your app will now be live on `http://localhost:3000`!

---

## 🌐 Live Application
* **Frontend Application:** [https://personalfianance.vercel.app](https://personalfianance.vercel.app)
*(Note: Replace with standard production links when deploying!)*

---

## 🎯 Purpose
This application was engineered to demonstrate a mastery of full-stack MERN development, modern responsive UI concepts, secure background jobs (emailing/OTP), and prompt-engineering for seamless, rapid AI integrations.
