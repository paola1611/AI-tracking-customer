# 🧠 Stakeholder Request Analyzer

A lightweight AI-powered MVP that converts unstructured stakeholder requests into structured, actionable insights.

---

## 🚀 Live Demo

👉 [TU LINK AQUÍ]

---

## ✨ Features

- Accept free-text stakeholder requests  
- AI-powered classification (category)  
- Extraction of key issues  
- Generation of actionable next steps  
- Persistent storage (SQLite)  
- Dashboard with all past submissions  
- Color-coded categories for quick scanning  

---

## 🏗️ Tech Stack

**Frontend**
- React 19 (Vite)
- Tailwind CSS

**Backend**
- Node.js
- Express

**Database**
- SQLite (better-sqlite3)

**AI**
- Groq API (llama-3.3-70b-versatile)

---

## ⚙️ How It Works

User Input → Backend → LLM → JSON Parsing → Database → UI Dashboard

- The user submits a request  
- Backend sends a structured prompt to the LLM  
- The model returns JSON with:
  - category
  - key issues
  - suggested actions  
- Data is validated, stored, and displayed  

---

## 🤖 AI Design

- Single prompt → structured JSON output  
- Low temperature (0.3) for consistency  
- Fallback parsing for malformed responses  
- Schema validation before saving  

---

## 🧩 Architecture

- React frontend (port 5173)  
- Express backend (port 3001)  
- SQLite database (local file)  
- Manual CORS handling  

---

## ⚖️ Tradeoffs

- No authentication  
- No pagination  
- No tests  
- No streaming responses  
- Focus on speed and core functionality  

---

## 🛠️ Run Locally

```bash
# Install frontend
npm install

# Backend
cd server
npm install

# Configure env
cp .env.example .env
# Add your GROQ_API_KEY

# Run backend
node index.js

# Run frontend
cd ..
npm run dev
