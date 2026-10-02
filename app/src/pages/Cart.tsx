import { Link, useNavigate } from 'react-router-dom'
import { byId } from '../data/products'
import { useStore, SHIPPING_FREE_THRESHOLD } from '../store/store'
import { Price } from '../components/bits'
import ProductImage from '../components/ProductImage'

function deliveryEstimate(): string {
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const from = new Date(Date.now() + 2 * 864e5)
  const to = new Date(Date.now() + 4 * 864e5)
  return `${fmt(from)} – ${fmt(to)}`
}

export default function Cart() {
  const { cart, setQty, removeFromCart, clearCart, subtotal, cartCount } = useStore()
  const nav = useNavigate()

  if (cart.length === 0) {
    return (
      <div className="wrap" style={{ padding: '16px 0 40px' }}>
        <div className="panel" style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 80 }}>🛒</div>
          <div>
            <h1 style={{ margin: '0 0 8px' }}>Your Amazon Cart is empty</h1>
            <p className="note">Your shopping cart lives to serve. Give it purpose — fill it with great finds.</p>
            <Link to="/s" className="btn btn-yellow pill mt8" style={{ display: 'inline-block' }}>
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const remaining = SHIPPING_FREE_THRESHOLD - subtotal
  const savings = cart.reduce((s, l) => {
    const p = byId(l.id)
    return p?.listPrice ? s + (p.listPrice - p.price) * l.qty : s
  }, 0)

  return (
    <div className="wrap">
      <div className="cart-layout">
        <div className="panel">
          <div className="flex between items-center">
            <h1 style={{ margin: 0 }}>Shopping Cart</h1>
            <a
              href="#"
              className="note"
              onClick={(e) => {
                e.preventDefault()
                clearCart()
              }}
            >
              Deselect all items
            </a>
          </div>
          <div
            className="note"
            style={{ textAlign: 'right', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}
          >
            Price
          </div>

          {cart.map((line) => {
            const p = byId(line.id)
            if (!p) return null
            const lineSave = p.listPrice ? (p.listPrice - p.price) * line.qty : 0
            return (
              <div className="cart-line" key={line.id + line.color}>
                <Link to={`/p/${p.id}`} className="cart-thumb">
                  <ProductImage p={p} size="md" />
                </Link>
                <div>
                  <Link to={`/p/${p.id}`}>
                    <h4>{p.title}</h4>
                  </Link>
                  <div className="note">Color: {line.color}</div>
                  <div style={{ color: p.availability.startsWith('Only') ? 'var(--price-red)' : 'var(--success)', fontSize: 13 }}>
                    {p.availability}
                  </div>
                  <div className="line-controls">
                    <div className="qtybox">
                      <button onClick={() => setQty(line.id, line.color, line.qty - 1)} aria-label={line.qty === 1 ? 'Remove item' : 'Decrease quantity'}>
                        {line.qty === 1 ? '🗑' : '−'}
                      </button>
                      <span className="n">{line.qty}</span>
                      <button onClick={() => setQty(line.id, line.color, line.qty + 1)} aria-label="Increase quantity">
                        +
                      </button>
                    </div>
                    <span className="sep">|</span>
                    <a href="#" onClick={(e) => { e.preventDefault(); removeFromCart(line.id, line.color) }}>
                      Delete
                    </a>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Price value={p.price * line.qty} />
                  {p.listPrice && (
                    <div className="note" style={{ marginTop: 2 }}>
                      <s>${(p.listPrice * line.qty).toFixed(2)}</s>
                    </div>
                  )}
                  {lineSave > 0 && (
                    <div style={{ color: 'var(--success)', fontSize: 12 }}>Save ${lineSave.toFixed(2)}</div>
                  )}
                </div>
              </div>
            )
          })}

          <div className="subtotal-line">
            Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''}):{' '}
            <b>
              <Price value={subtotal} />
            </b>
          </div>
        </div>

        <aside className="panel checkout-box">
          {remaining > 0 ? (
            <p className="note">
              Add <b>${remaining.toFixed(2)}</b> of eligible items to qualify for FREE Shipping.
            </p>
          ) : (
            <p style={{ color: 'var(--success)', fontWeight: 600 }}>✓ Your order qualifies for FREE Shipping.</p>
          )}
          <div className="ship-bar" aria-hidden>
            <div
              className={`ship-bar-fill ${remaining <= 0 ? 'full' : ''}`}
              style={{ width: `${Math.min(100, (subtotal / SHIPPING_FREE_THRESHOLD) * 100)}%` }}
            />
          </div>

          <div className="delivery-note">
            🚚 Estimated delivery: <b>{deliveryEstimate()}</b>
          </div>

          <div className="sub flex between items-center">
            <span>Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''}):</span>
            <b>
              <Price value={subtotal} />
            </b>
          </div>
          {savings > 0 && (
            <div className="flex between" style={{ color: 'var(--success)', fontSize: 14, marginTop: 4 }}>
              <span>Your savings:</span>
              <b>-${savings.toFixed(2)}</b>
            </div>
          )}

          <button className="btn btn-yellow btn-block pill mt16" onClick={() => nav('/checkout')}>
            Proceed to checkout
          </button>
          <p className="note mt8" style={{ textAlign: 'center' }}>
            Shipping &amp; tax calculated at checkout
          </p>
        </aside>
      </div>
    </div>
  )
}
