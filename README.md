# 💼 Business Assistant AI Chatbot

A full-stack professional AI business chatbot built with React + FastAPI, powered by Groq (Llama 3.3 70B). Features user authentication, chat history, and a clean corporate UI.

> **Developed by Sushil Ambekar**

---

## 🚀 Live Demo

- **Frontend:** Coming soon (Vercel)
- **Backend API:** Coming soon (Render)

---

## ✨ Features

- 🔐 **User Authentication** — Register & Login with Email/Password
- 💬 **AI Chat** — Powered by Groq (Llama 3.3 70B) — Free & Fast
- 💾 **Chat History** — All conversations saved to SQLite database
- 📂 **Sidebar** — Browse and restore past conversations
- ⚡ **Quick Actions** — Draft Email, Write Report, Action Plan, Summarize
- 🎨 **Clean Corporate UI** — Professional blue & white design
- 🔑 **JWT Tokens** — Secure session management
- 🚪 **Logout** — Each user sees only their own chats

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | FastAPI (Python) |
| Database | SQLite |
| AI Model | Llama 3.3 70B via Groq API |
| Auth | JWT + Bcrypt |
| Deployment | Vercel + Render |

---

## 📁 Project Structure

```
business-assistant/
├── backend/
│   ├── main.py          # FastAPI app & API routes
│   ├── auth.py          # JWT authentication & bcrypt
│   ├── database.py      # SQLite database helpers
│   ├── requirements.txt # Python dependencies
│   └── render.yaml      # Render deployment config
└── frontend/
    ├── src/
    │   ├── App.jsx                    # Main chat UI
    │   └── components/
    │       ├── AuthPage.jsx           # Login & Register page
    │       ├── ChatMessage.jsx        # Message bubble component
    │       └── TypingIndicator.jsx    # Animated typing dots
    ├── index.html
    ├── vite.config.js
    └── vercel.json      # Vercel deployment config
```

---

## ⚙️ Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API Key (free at https://console.groq.com)

### Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo GROQ_API_KEY=your_groq_key_here > .env

# Start server
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user |
| POST | `/chat` | Send message, get AI reply |
| GET | `/sessions` | Get all chat sessions |
| GET | `/sessions/{id}/messages` | Get messages in a session |
| DELETE | `/sessions/{id}` | Delete a session |

---

## 🌐 Deployment

### Backend → Render
1. Connect GitHub repo on [render.com](https://render.com)
2. Set Root Directory to `backend`
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add env variable: `GROQ_API_KEY`

### Frontend → Vercel
1. Connect GitHub repo on [vercel.com](https://vercel.com)
2. Set Root Directory to `frontend`
3. Update `vercel.json` with your Render URL
4. Deploy!

---

## 📸 Screenshots

> Login Page, Chat Interface, Chat History Sidebar

---

## 📄 License

MIT License — feel free to use and modify.

---

Made with ❤️ by **Sushil Ambekar**
