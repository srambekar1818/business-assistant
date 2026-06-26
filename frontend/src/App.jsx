import { useState, useRef, useEffect } from 'react'
import ChatMessage from './components/ChatMessage.jsx'
import TypingIndicator from './components/TypingIndicator.jsx'
import AuthPage from './components/AuthPage.jsx'

const SYSTEM_PROMPT = "You are a professional business assistant. You help with tasks like drafting emails, writing reports, summarizing documents, creating action plans, and analyzing business problems. Always respond in a clear, concise, and professional tone."

const QUICK_ACTIONS = [
  { label: '✉️ Draft Email', prompt: 'Help me draft a professional email' },
  { label: '📊 Write Report', prompt: 'Help me write a business report' },
  { label: '📋 Action Plan', prompt: 'Create an action plan for' },
  { label: '📝 Summarize', prompt: 'Summarize the following text:' },
]

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Good day! I\'m your Professional Business Assistant. How may I assist you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [sessions, setSessions] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])
  useEffect(() => { if (user) fetchSessions() }, [user])

  const authHeaders = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }

  const handleLogin = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', userToken)
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setMessages([{ role: 'assistant', content: 'Good day! How may I assist you today?' }])
    setSessionId(null)
    setSessions([])
  }

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions', { headers: authHeaders })
      if (res.ok) setSessions(await res.json())
    } catch {}
  }

  const loadSession = async (sid) => {
    try {
      const res = await fetch(`/api/sessions/${sid}/messages`, { headers: authHeaders })
      const data = await res.json()
      setMessages(data.map(m => ({ role: m.role, content: m.content })))
      setSessionId(sid)
    } catch {}
  }

  const deleteSession = async (sid, e) => {
    e.stopPropagation()
    await fetch(`/api/sessions/${sid}`, { method: 'DELETE', headers: authHeaders })
    if (sessionId === sid) newChat()
    fetchSessions()
  }

  const newChat = () => {
    setMessages([{ role: 'assistant', content: 'Good day! How may I assist you today?' }])
    setSessionId(null)
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return
    const userMessage = { role: 'user', content: text }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ messages: updatedMessages, system_prompt: SYSTEM_PROMPT, session_id: sessionId }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Request failed') }
      const data = await res.json()
      setMessages([...updatedMessages, { role: 'assistant', content: data.reply }])
      setSessionId(data.session_id)
      fetchSessions()
    } catch (err) {
      setMessages([...updatedMessages, { role: 'assistant', content: `⚠️ Error: ${err.message}` }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

  if (!user) return <AuthPage onLogin={handleLogin} />

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      {sidebarOpen && (
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <span style={styles.sidebarTitle}>💬 My Chats</span>
            <button style={styles.newChatBtn} onClick={newChat}>+ New</button>
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>{user.name?.[0]?.toUpperCase()}</div>
            <div>
              <div style={styles.userName}>{user.name}</div>
              <div style={styles.userEmail}>{user.email}</div>
            </div>
          </div>
          <div style={styles.sessionList}>
            {sessions.length === 0 && <div style={styles.emptyMsg}>No saved chats yet</div>}
            {sessions.map(s => (
              <div key={s.id}
                style={{ ...styles.sessionItem, background: sessionId === s.id ? '#eff6ff' : 'transparent', borderColor: sessionId === s.id ? '#bfdbfe' : 'transparent' }}
                onClick={() => loadSession(s.id)}>
                <div style={styles.sessionText}>
                  <div style={styles.sessionTitle}>{s.title}</div>
                  <div style={styles.sessionDate}>{formatDate(s.updated_at)}</div>
                </div>
                <button style={styles.deleteBtn} onClick={(e) => deleteSession(s.id, e)}>✕</button>
              </div>
            ))}
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>🚪 Logout</button>
        </aside>
      )}

      {/* Main */}
      <div style={styles.main}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <button style={styles.toggleBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <div style={styles.logoBox}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
            </div>
            <div>
              <div style={styles.headerTitle}>Business Assistant</div>
              <div style={styles.headerSub}>Powered by Sushil Ambekar</div>
            </div>
          </div>
          <div style={styles.statusBadge}><span style={styles.statusDot}/>Online</div>
        </header>

        <div style={styles.quickBar}>
          <span style={styles.quickLabel}>Quick:</span>
          {QUICK_ACTIONS.map(a => (
            <button key={a.label} style={styles.chip} onClick={() => { setInput(a.prompt); inputRef.current?.focus() }}>{a.label}</button>
          ))}
        </div>

        <main style={styles.messages}>
          {messages.map((msg, i) => <ChatMessage key={i} role={msg.role} content={msg.content} />)}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </main>

        <footer style={styles.footer}>
          <div style={styles.inputWrapper}>
            <textarea ref={inputRef} style={styles.textarea} value={input}
              onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send)" rows={1} disabled={loading} />
            <button style={{ ...styles.sendBtn, opacity: !input.trim() || loading ? 0.45 : 1 }}
              onClick={sendMessage} disabled={!input.trim() || loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p style={styles.footerHint}>Enter to send · Chats auto-saved</p>
        </footer>
      </div>
    </div>
  )
}

const styles = {
  page: { display: 'flex', height: '100vh', background: '#f1f5f9', overflow: 'hidden' },
  sidebar: { width: '260px', background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  sidebarHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #e2e8f0' },
  sidebarTitle: { fontWeight: '700', fontSize: '13px', color: '#0f172a' },
  newChatBtn: { padding: '5px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' },
  userAvatar: { width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', flexShrink: 0 },
  userName: { fontSize: '13px', fontWeight: '600', color: '#0f172a' },
  userEmail: { fontSize: '11px', color: '#94a3b8' },
  sessionList: { flex: 1, overflowY: 'auto', padding: '8px' },
  emptyMsg: { fontSize: '12px', color: '#94a3b8', textAlign: 'center', padding: '24px 0' },
  sessionItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', cursor: 'pointer', border: '1px solid transparent', marginBottom: '2px' },
  sessionText: { flex: 1, overflow: 'hidden' },
  sessionTitle: { fontSize: '13px', color: '#0f172a', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  sessionDate: { fontSize: '11px', color: '#94a3b8', marginTop: '2px' },
  deleteBtn: { background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '11px', padding: '2px 4px', flexShrink: 0 },
  logoutBtn: { margin: '12px', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'none', fontSize: '13px', color: '#64748b', cursor: 'pointer', textAlign: 'left' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #e2e8f0', background: '#fff' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  toggleBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b', padding: '2px 6px' },
  logoBox: { width: '34px', height: '34px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #bfdbfe' },
  headerTitle: { fontWeight: '700', fontSize: '14px', color: '#0f172a' },
  headerSub: { fontSize: '11px', color: '#94a3b8' },
  statusBadge: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#16a34a', fontWeight: '500', background: '#f0fdf4', padding: '4px 10px', borderRadius: '20px', border: '1px solid #bbf7d0' },
  statusDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block', marginRight: '2px' },
  quickBar: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' },
  quickLabel: { fontSize: '12px', color: '#94a3b8', fontWeight: '500' },
  chip: { padding: '4px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff', color: '#475569', fontSize: '12px', fontWeight: '500', cursor: 'pointer' },
  messages: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', background: '#f8fafc' },
  footer: { padding: '14px 20px 18px', borderTop: '1px solid #e2e8f0', background: '#fff' },
  inputWrapper: { display: 'flex', gap: '10px', alignItems: 'flex-end', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '8px 8px 8px 14px' },
  textarea: { flex: 1, border: 'none', background: 'transparent', fontSize: '14px', resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: '1.6', maxHeight: '120px', overflow: 'auto', color: '#0f172a' },
  sendBtn: { width: '34px', height: '34px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.2s' },
  footerHint: { fontSize: '11px', color: '#cbd5e1', textAlign: 'center', marginTop: '8px' },
}
