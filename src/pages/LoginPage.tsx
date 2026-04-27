import { useEffect, useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard', { replace: true })
    })
  }, [navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Invalid email or password.')
    else navigate('/dashboard', { replace: true })
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    height: 48,
    padding: '0 16px',
    background: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 15,
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    transition: 'border-color 200ms',
    width: '100%',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--color-text-muted)',
    marginBottom: 6,
    display: 'block',
    fontWeight: 500,
  }

  return (
    <div className="login-page" style={{ minHeight: '100vh', display: 'flex', background: '#faf7f4', fontFamily: 'var(--font-family)' }}>
      {/* LEFT — branding */}
      <aside
        className="login-branding"
        style={{
          width: '40%',
          background: 'var(--color-bg-dark)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 48,
          color: '#fff',
        }}
      >
        <div>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>MULT</span>
          <span style={{ fontSize: 24, fontWeight: 400, color: '#C47C3A' }}> FLOORING</span>
        </div>

        <div>
          <h1
            style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 500,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              color: '#ffffff',
              whiteSpace: 'pre-line',
              margin: 0,
            }}
          >
            {'Every great floor\nstarts here.'}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.40)', marginTop: 12 }}>
            Internal access only.
          </p>
        </div>

        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
          © {new Date().getFullYear()} Mult Flooring
        </div>
      </aside>

      {/* RIGHT — form */}
      <main
        style={{
          flex: 1,
          background: 'var(--color-bg-base)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 40px',
        }}
      >
        <div style={{ maxWidth: 380, width: '100%' }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            Welcome back.
          </h2>
          <p
            style={{
              fontSize: 14,
              color: 'var(--color-text-muted)',
              marginTop: 6,
              marginBottom: 32,
            }}
          >
            Sign in to your dashboard.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label htmlFor="email" style={labelStyle}>Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@multflooring.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>

            <div>
              <label htmlFor="password" style={labelStyle}>Password</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: 52,
                background: 'var(--color-accent)',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 500,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 8,
                transition: 'background 260ms',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: loading ? 0.85 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = 'var(--color-accent-hover)'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = 'var(--color-accent)'
              }}
            >
              {loading ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                'Sign In'
              )}
            </button>

            {error && (
              <div
                role="alert"
                style={{
                  padding: '12px 16px',
                  background: '#FCEBEB',
                  border: '1px solid #F09595',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 13,
                  color: '#A32D2D',
                  marginTop: 12,
                }}
              >
                {error}
              </div>
            )}
          </form>
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 767px) {
          .login-branding { display: none !important; }
        }
      `}</style>
    </div>
  )
}
