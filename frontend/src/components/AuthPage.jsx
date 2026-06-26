import { useState } from 'react'

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!form.email || !form.password) return setError('Please fill in all fields')
    if (mode === 'register' && !form.name) return setError('Please enter your name')
    if (mode === 'register' && form.password.length < 6) return setError('Password must be at least 6 characters')

    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Something went wrong')
      onLogin({ name: data.name, email: data.email }, data.token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoArea}>
          <div style={styles.logoBox}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
          </div>
          <h1 style={styles.title}>Business Assistant</h1>
          <p style={styles.subtitle}>Powered by Sushil Ambekar</p>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button style={{ ...styles.tab, ...(mode === 'login' ? styles.activeTab : {}) }} onClick={() => { setMode('login'); setError('') }}>Login</button>
          <button style={{ ...styles.tab, ...(mode === 'register' ? styles.activeTab : {}) }} onClick={() => { setMode('register'); setError('') }}>Register</button>
        </div>

        {/* Form */}
        <div style={styles.form}>
          {mode === 'register' && (
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input style={styles.input} type="text" placeholder="Sushil Ambekar"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} onKeyDown={handleKey} />
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input style={styles.input} type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onKeyDown={handleKey} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="••••••••"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onKeyDown={handleKey} />
          </div>

          {error && <div style={styles.error}>⚠️ {error}</div>}

          <button style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login →' : 'Create Account →'}
          </button>
        </div>

        <p style={styles.switchText}>
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <span style={styles.switchLink} onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
            {mode === 'login' ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  card: { background: '#fff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)' },
  logoArea: { textAlign: 'center', marginBottom: '28px' },
  logoBox: { width: '56px', height: '56px', background: '#eff6ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', border: '1px solid #bfdbfe' },
  title: { fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' },
  subtitle: { fontSize: '12px', color: '#94a3b8' },
  tabs: { display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px', marginBottom: '24px' },
  tab: { flex: 1, padding: '8px', border: 'none', background: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: '#64748b', cursor: 'pointer' },
  activeTab: { background: '#fff', color: '#0f172a', fontWeight: '600', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
  input: { padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', color: '#0f172a' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626' },
  submitBtn: { padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' },
  switchText: { textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '20px' },
  switchLink: { color: '#2563eb', fontWeight: '600', cursor: 'pointer' },
}
