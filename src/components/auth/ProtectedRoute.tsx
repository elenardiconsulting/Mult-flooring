import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session)
      setLoading(false)
    })

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setAuthenticated(!!session)
      })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#faf7f4',
      fontFamily: 'var(--font-family)',
      fontSize: '13px',
      color: 'var(--color-text-muted)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    }}>
      Loading...
    </div>
  )

  return authenticated
    ? <>{children}</>
    : <Navigate to="/login" replace />
}
