from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from database import init_db, create_session, save_message, get_sessions, get_session_messages, delete_session
from auth import init_users_table, register_user, login_user, create_token, decode_token
import os
import httpx

load_dotenv()

app = FastAPI(title="AI Chatbot API")
security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://business-assistant-tau.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

@app.on_event("startup")
def startup():
    init_db()
    init_users_table()

# ── Auth helpers ──────────────────────────────────────────
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        return decode_token(credentials.credentials)
    except:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ── Auth models ───────────────────────────────────────────
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# ── Chat models ───────────────────────────────────────────
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    system_prompt: str = "You are a professional business assistant. Always respond in a clear, concise, and professional tone."
    session_id: Optional[int] = None

class ChatResponse(BaseModel):
    reply: str
    session_id: int

class SessionTitle(BaseModel):
    title: str

# ── Auth routes ───────────────────────────────────────────
@app.post("/auth/register")
def register(req: RegisterRequest):
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    user_id, error = register_user(req.name, req.email, req.password)
    if error:
        raise HTTPException(status_code=400, detail=error)
    token = create_token(user_id, req.email)
    return {"token": token, "name": req.name, "email": req.email}

@app.post("/auth/login")
def login(req: LoginRequest):
    user, error = login_user(req.email, req.password)
    if error:
        raise HTTPException(status_code=401, detail=error)
    token = create_token(user["id"], user["email"])
    return {"token": token, "name": user["name"], "email": user["email"]}

@app.get("/auth/me")
def me(user=Depends(get_current_user)):
    return user

# ── Chat routes ───────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "running"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, user=Depends(get_current_user)):
    try:
        session_id = request.session_id
        user_id = user["user_id"]

        if not session_id:
            first_msg = request.messages[0].content if request.messages else "New Chat"
            title = first_msg[:50] + ("..." if len(first_msg) > 50 else "")
            session_id = create_session(title, user_id)
            for m in request.messages:
                save_message(session_id, m.role, m.content)
        else:
            if request.messages:
                last = request.messages[-1]
                save_message(session_id, last.role, last.content)

        messages = [{"role": "system", "content": request.system_prompt}]
        for m in request.messages:
            messages.append({"role": m.role, "content": m.content})

        async with httpx.AsyncClient() as client:
            response = await client.post(
                GROQ_URL,
                json={"model": "llama-3.3-70b-versatile", "messages": messages, "max_tokens": 1024},
                headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
                timeout=30
            )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Groq API error: {response.text}")

        reply = response.json()["choices"][0]["message"]["content"]
        save_message(session_id, "assistant", reply)
        return ChatResponse(reply=reply, session_id=session_id)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sessions")
def list_sessions(user=Depends(get_current_user)):
    return get_sessions(user["user_id"])

@app.get("/sessions/{session_id}/messages")
def get_messages(session_id: int, user=Depends(get_current_user)):
    return get_session_messages(session_id)

@app.delete("/sessions/{session_id}")
def remove_session(session_id: int, user=Depends(get_current_user)):
    delete_session(session_id)
    return {"status": "deleted"}
