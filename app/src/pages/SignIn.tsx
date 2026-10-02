import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../store/store'

type Errors = { name?: string; email?: string; pw?: string; confirm?: string }

export default function SignIn() {
  const { signIn } = useStore()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/'

  const [mode, setMode] = useState<'in' | 'up'>(params.get('mode') === 'register' ? 'up' : 'in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  function validate(): Errors {
    const e: Errors = {}
    if (mode === 'up' && !name.trim()) e.name = 'Enter your name.'
    if (!email.trim()) e.email = 'Enter your email.'
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Enter a valid email address, e.g. you@example.com.'
    if (!pw) e.pw = 'Enter your password.'
    else if (pw.length < 6) e.pw = 'Passwords must be at least 6 characters.'
    if (mode === 'up' && confirm !== pw) e.confirm = 'Passwords do not match.'
    return e
  }

  function submit() {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    signIn({ name: mode === 'up' ? name.trim() : email.split('@')[0], email: email.trim() })
    nav(redirect, { replace: true })
  }

  function switchMode(next: 'in' | 'up') {
    setMode(next)
    setErrors({})
  }

  const title = mode === 'in' ? 'Sign in' : 'Create account'

  return (
    <div className="auth-wrap">
      <div className="auth-logo">
        <Link to="/" className="logo" style={{ color: 'var(--nav)' }}>
          amazon<span className="smile">.</span>
        </Link>
      </div>

      <div className="auth-card">
        <h1>{title}</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
          noValidate
        >
          {mode === 'up' && (
            <div className="field">
              <label>Your name</label>
              <input
                className={errors.name ? 'invalid' : ''}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First and last name"
              />
              {errors.name && <div className="error-text">⚠ {errors.name}</div>}
            </div>
          )}

          <div className="field">
            <label>Email</label>
            <input
              className={errors.email ? 'invalid' : ''}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
            />
            {errors.email && <div className="error-text">⚠ {errors.email}</div>}
          </div>

          <div className="field">
            <label>Password</label>
            <input
              className={errors.pw ? 'invalid' : ''}
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="At least 6 characters"
            />
            {errors.pw && <div className="error-text">⚠ {errors.pw}</div>}
          </div>

          {mode === 'up' && (
            <div className="field">
              <label>Re-enter password</label>
              <input
                className={errors.confirm ? 'invalid' : ''}
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
              />
              {errors.confirm && <div className="error-text">⚠ {errors.confirm}</div>}
            </div>
          )}

          <button className="btn btn-yellow btn-block pill mt8" type="submit">
            {mode === 'in' ? 'Sign in' : 'Create your account'}
          </button>
        </form>

        <p className="note mt16">
          Demo only — accounts are stored in your browser. Don't use a real password.
        </p>
      </div>

      <div className="auth-switch note">
        {mode === 'in' ? (
          <>
            New to Amazon?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                switchMode('up')
              }}
            >
              Create your account
            </a>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                switchMode('in')
              }}
            >
              Sign in
            </a>
          </>
        )}
      </div>
    </div>
  )
}
