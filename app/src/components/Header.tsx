import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/store'
import { CATEGORIES } from '../data/products'

export default function Header() {
  const { cartCount, user, signOut, address } = useStore()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const nav = useNavigate()

  function submit(e: FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('k', q.trim())
    if (cat !== 'All') params.set('cat', cat)
    nav(`/s?${params.toString()}`)
  }

  const deliverCity = address?.city || 'New York 10001'

  return (
    <header className="header">
      <div className="header-main">
        <Link to="/" className="logo">
          amazon<span className="smile">.</span>
        </Link>

        <Link to="/" className="deliver hbox" aria-label="Delivery location">
          <span className="pin">📍</span>
          <span>
            <span className="l1">Deliver to</span>
            <span className="l2">{deliverCity}</span>
          </span>
        </Link>

        <form className="search" onSubmit={submit} role="search">
          <select className="cat" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
            <option>All</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Amazon"
            aria-label="Search Amazon"
          />
          <button className="go" type="submit" aria-label="Search">
            🔍
          </button>
        </form>

        <div className="hbox" tabIndex={0}>
          <span className="l1">{user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}</span>
          <span className="l2">
            {user ? (
              <span onClick={signOut} style={{ cursor: 'pointer' }}>
                Sign out ▾
              </span>
            ) : (
              <Link to="/signin" style={{ color: '#fff' }}>
                Account & Lists ▾
              </Link>
            )}
          </span>
        </div>

        <Link to="/orders" className="hbox" style={{ color: '#fff' }}>
          <span className="l1">Returns</span>
          <span className="l2">& Orders</span>
        </Link>

        <Link to="/cart" className="cart-link">
          <span className="cart-count">{cartCount}</span>
          <span className="cart-icon">🛒</span>
          <span className="cart-word">Cart</span>
        </Link>
      </div>

      <nav className="header-sub">
        <Link to="/s" style={{ color: '#fff', fontWeight: 700 }}>
          ☰ All
        </Link>
        {CATEGORIES.map((c) => (
          <Link key={c} to={`/s?cat=${encodeURIComponent(c)}`} style={{ color: '#fff' }}>
            {c}
          </Link>
        ))}
      </nav>
    </header>
  )
}
