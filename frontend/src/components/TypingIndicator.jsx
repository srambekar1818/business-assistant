export default function TypingIndicator() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.avatar}>AI</div>
      <div style={styles.bubble}>
        <span style={styles.dot} />
        <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
        <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
      </div>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', alignItems: 'flex-end', gap: '8px' },
  avatar: {
    width: '28px', height: '28px', borderRadius: '50%',
    background: '#6c5ce7', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '10px', fontWeight: '600', flexShrink: 0,
  },
  bubble: {
    background: '#f0f0f0',
    borderRadius: '18px 18px 18px 4px',
    padding: '12px 16px',
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
  },
  dot: {
    width: '7px', height: '7px', borderRadius: '50%',
    background: '#aaa', display: 'inline-block',
    animation: 'bounce 1.2s infinite',
  },
}
