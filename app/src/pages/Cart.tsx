import { Link, useNavigate } from 'react-router-dom'
import { byId } from '../data/products'
import { useStore, SHIPPING_FREE_THRESHOLD } from '../store/store'
import { Price } from '../components/bits'
import ProductImage from '../components/ProductImage'

export default function Cart() {
  const { cart, setQty, removeFromCart, subtotal, cartCount } = useStore()
  const nav = useNavigate()

  if (cart.length === 0) {
    return (
      <div className="wrap" style={{ padding: '16px 0 40px' }}>
        <div className="panel" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ fontSize: 80 }}>🛒</div>
          <div>
            <h1 style={{ margin: '0 0 8px' }}>Your Amazon Cart is empty</h1>
            <p className="note">Check your saved items or continue shopping.</p>
            <Link to="/s" className="btn btn-yellow pill mt8" style={{ display: 'inline-block' }}>
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const remaining = SHIPPING_FREE_THRESHOLD - subtotal

  return (
    <div className="wrap">
      <div className="cart-layout">
        <div className="panel">
          <h1 style={{ margin: '0 0 4px' }}>Shopping Cart</h1>
          <div className="note" style={{ textAlign: 'right', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
            Price
          </div>

          {cart.map((line) => {
            const p = byId(line.id)
            if (!p) return null
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
                  <div className="success" style={{ color: 'var(--success)', fontSize: 13 }}>
                    In Stock
                  </div>
                  <div className="line-controls">
                    <div className="qtybox">
                      <button onClick={() => setQty(line.id, line.color, line.qty - 1)} aria-label="Decrease">
                        {line.qty === 1 ? '🗑' : '−'}
                      </button>
                      <span className="n">{line.qty}</span>
                      <button onClick={() => setQty(line.id, line.color, line.qty + 1)} aria-label="Increase">
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
            <p style={{ color: 'var(--success)' }}>✓ Your order qualifies for FREE Shipping.</p>
          )}
          <div className="sub flex between items-center">
            <span>Subtotal ({cartCount} items):</span>
            <b>
              <Price value={subtotal} />
            </b>
          </div>
          <button className="btn btn-yellow btn-block pill mt16" onClick={() => nav('/checkout')}>
            Proceed to checkout
          </button>
        </aside>
      </div>
    </div>
  )
}
