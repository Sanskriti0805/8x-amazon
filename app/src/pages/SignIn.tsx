import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/store'

export default function SignIn() {
  const { signIn } = useStore()
  const nav = useNavigate()
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')

  function submit() {
    if (mode === 'up' && !name.trim()) return setErr('Enter your name')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setErr('Enter a valid email')
    if (pw.length < 6) return setErr('Password must be at least 6 characters')
    setErr('')
    signIn({ name: mode === 'up' ? name.trim() : email.split('@')[0], email })
    nav('/')
  }

  return (
    <div className="auth-wrap">
      <div className="auth-logo">
        <Link to="/" className="logo" style={{ color: 'var(--nav)' }}>
          amazon<span className="smile">.</span>
        </Link>
      </div>
      <div className="auth-card">
        <h1>{mode === 'in' ? 'Sign in' : 'Create account'}</h1>
        {mode === 'up' && (
          <div className="field">
            <label>Your name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="First and last name" />
          </div>
        )}
        <div className="field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 6 characters" />
        </div>
        {err && <div className="error-text" style={{ marginBottom: 8 }}>{err}</div>}
        <button className="btn btn-yellow btn-block pill" onClick={submit}>
          {mode === 'in' ? 'Sign in' : 'Create your account'}
        </button>
        <p className="note mt16">
          Demo only — accounts are stored in your browser. Don't use a real password.
        </p>
      </div>
      <div style={{ textAlign: 'center', marginTop: 16 }} className="note">
        {mode === 'in' ? (
          <>
            New to Amazon?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setMode('up'); setErr('') }}>
              Create an account
            </a>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setMode('in'); setErr('') }}>
              Sign in
            </a>
          </>
        )}
      </div>
    </div>
  )
}
