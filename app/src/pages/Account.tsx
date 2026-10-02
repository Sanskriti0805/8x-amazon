import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/store'

export default function Account() {
  const { user, orders, address, signOut } = useStore()
  const nav = useNavigate()

  // RequireAuth guarantees a user, but guard for type-safety.
  if (!user) return null

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  function logout() {
    nav('/', { replace: true })
    signOut()
  }

  const cards = [
    { emoji: '📦', title: 'Your Orders', desc: 'Track, return, or buy things again', to: '/orders' },
    { emoji: '🛒', title: 'Your Cart', desc: 'See the items in your cart', to: '/cart' },
    { emoji: '🔍', title: 'Keep shopping', desc: 'Browse the latest deals', to: '/s?k=deals' },
  ]

  return (
    <div className="wrap" style={{ padding: '20px 0 40px' }}>
      <div className="account-head">
        <div className="account-avatar">{initials}</div>
        <div>
          <h1 style={{ margin: 0 }}>Hello, {user.name.split(' ')[0]}</h1>
          <div className="note">{user.email}</div>
        </div>
        <button className="btn pill" style={{ marginLeft: 'auto' }} onClick={logout}>
          Sign out
        </button>
      </div>

      <h2 className="section-title">Your account</h2>
      <div className="account-grid">
        {cards.map((c) => (
          <Link key={c.title} to={c.to} className="account-card">
            <div className="account-card-emoji">{c.emoji}</div>
            <div>
              <div className="account-card-title">{c.title}</div>
              <div className="note">{c.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="account-grid mt16" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="panel">
          <div className="flex between items-center">
            <h3 style={{ margin: 0 }}>Login &amp; security</h3>
          </div>
          <div className="note mt8">
            <b style={{ color: 'var(--text)' }}>{user.name}</b>
            <br />
            {user.email}
          </div>
        </div>
        <div className="panel">
          <div className="flex between items-center">
            <h3 style={{ margin: 0 }}>Default address</h3>
          </div>
          {address ? (
            <div className="note mt8">
              {address.name}
              <br />
              {address.line1}, {address.city}, {address.state} {address.zip}
            </div>
          ) : (
            <p className="note mt8">No saved address yet — it's set during checkout.</p>
          )}
        </div>
      </div>

      <div className="panel mt16">
        <div className="flex between items-center">
          <h3 style={{ margin: 0 }}>Recent orders</h3>
          <Link to="/orders">View all</Link>
        </div>
        {orders.length === 0 ? (
          <p className="note mt8">You haven't placed any orders yet.</p>
        ) : (
          <p className="note mt8">
            You have {orders.length} order{orders.length !== 1 ? 's' : ''}. Most recent:{' '}
            <Link to={`/orders/${orders[0].id}`}>{orders[0].id}</Link>.
          </p>
        )}
      </div>
    </div>
  )
}
