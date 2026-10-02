import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../store/store'

/**
 * Gate a route behind the mock session. Guests see an inline sign-in prompt
 * (rather than an auto-redirect) so that signing out from a protected page
 * doesn't race the guard against the outgoing navigation.
 */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useStore()
  const loc = useLocation()

  if (!user) {
    const redirect = encodeURIComponent(loc.pathname + loc.search)
    return (
      <div className="wrap" style={{ padding: '32px 0 60px' }}>
        <div className="auth-gate">
          <div className="auth-gate-icon">🔒</div>
          <h1>Sign in for the best experience</h1>
          <p className="note">You need to be signed in to view this page.</p>
          <Link to={`/signin?redirect=${redirect}`} className="btn btn-yellow pill btn-lg mt16" style={{ display: 'inline-block' }}>
            Sign in
          </Link>
          <div className="mt16">
            <Link to={`/signin?mode=register&redirect=${redirect}`}>Create an account</Link>
          </div>
        </div>
      </div>
    )
  }
  return <>{children}</>
}
