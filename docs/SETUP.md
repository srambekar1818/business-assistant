# 🛠️ Setup Guide

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.11+ | https://python.org |
| Node.js | 18+ | https://nodejs.org |
| Git | Latest | https://git-scm.com |
| Groq API Key | Free | https://console.groq.com |

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/srambekar1818/business-assistant.git
cd business-assistant
```

---

## Step 2 — Backend Setup

```bash
cd backend
```

### Install dependencies
```bash
pip install -r requirements.txt
```

### Create environment file
```bash
cp env.example .env
```

Open `.env` and add your Groq API key:
```
GROQ_API_KEY=your_groq_api_key_here
```

Get a free key at: https://console.groq.com

### Start the backend server
```bash
uvicorn main:app --reload --port 8000
```

✅ Backend running at: http://localhost:8000  
✅ API docs at: http://localhost:8000/docs

---

## Step 3 — Frontend Setup

Open a new terminal:

```bash
cd frontend
```

### Install dependencies
```bash
npm install
```

### Start the frontend
```bash
npm run dev
```

✅ Frontend running at: http://localhost:5173

---

## Step 4 — Open the App

Go to **http://localhost:5173** in your browser.

1. Click **Register** to create an account
2. Login with your email & password
3. Start chatting with the AI!

---

## Common Issues

### `pip` not recognized
Use `python -m pip` instead:
```bash
python -m pip install -r requirements.txt
```

### `uvicorn` not recognized
Use `python -m uvicorn` instead:
```bash
python -m uvicorn main:app --reload --port 8000
```

### Port already in use
```bash
# Kill process on port 8000
npx kill-port 8000
```
