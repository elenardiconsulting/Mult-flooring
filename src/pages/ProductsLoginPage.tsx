import { useEffect, useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'

export default function ProductsLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/products-admin', { replace: true })
    })
  }, [navigate])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Invalid email or password.')
    else navigate('/products-admin', { replace: true })
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    height: 48,
    border: '1px solid #e8e8e6',
    borderRadius: 8,
    padding: '0 16px',
    fontSize: 15,
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    background: '#fff',
    color: '#1a1a1a',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#9e9e9e',
    marginBottom: 6,
    display: 'block',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontWeight: 500,
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf7f4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: 'var(--font-family)',
    }}>
      <div style={{
        maxWidth: 380,
        width: '100%',
        background: '#fff',
        border: '1px solid #e8e8e6',
        borderRadius: 16,
        padding: '40px 32px',
      }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>MULT</span>
          <span style={{ fontSize: 20, fontWeight: 400, color: '#C47C3A' }}> FLOORING</span>
        </div>
        <p style={{ fontSize: 13, color: '#9e9e9e', marginBottom: 32, marginTop: 0 }}>
          Staff Access — Products Manager
        </p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#7a4f1e')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#e8e8e6')}
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#7a4f1e')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#e8e8e6')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: 52,
              background: '#7a4f1e',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: loading ? 0.85 : 1,
            }}
          >
            {loading ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : 'Sign In'}
          </button>

          {error && (
            <div role="alert" style={{
              background: '#FCEBEB',
              border: '1px solid #F09595',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              color: '#A32D2D',
              marginTop: 12,
            }}>
              {error}
            </div>
          )}
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
