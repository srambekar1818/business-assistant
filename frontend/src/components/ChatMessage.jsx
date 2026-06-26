export default function ChatMessage({ role, content }) {
  const isUser = role === 'user'

  return (
    <div style={{ ...styles.wrapper, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && (
        <div style={styles.aiAvatar}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
          </svg>
        </div>
      )}
      <div style={{
        ...styles.bubble,
        background: isUser ? '#2563eb' : '#ffffff',
        color: isUser ? '#ffffff' : '#0f172a',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        border: isUser ? 'none' : '1px solid #e2e8f0',
        boxShadow: isUser ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
      }}>
        {content}
      </div>
      {isUser && (
        <div style={styles.userAvatar}>You</div>
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
  },
  aiAvatar: {
    width: '30px', height: '30px', borderRadius: '8px',
    background: '#eff6ff', border: '1px solid #bfdbfe',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  userAvatar: {
    width: '30px', height: '30px', borderRadius: '8px',
    background: '#1d4ed8', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '10px', fontWeight: '700', flexShrink: 0,
  },
  bubble: {
    maxWidth: '72%',
    padding: '11px 15px',
    fontSize: '14px',
    lineHeight: '1.65',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
}
