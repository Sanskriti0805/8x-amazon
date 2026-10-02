import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../store/store'
import { Price } from '../components/bits'

export default function Confirmation() {
  const { state } = useLocation() as { state?: { orderId?: string } }
  const { orders } = useStore()
  const order = orders.find((o) => o.id === state?.orderId) ?? orders[0]

  if (!order) {
    return (
      <div className="wrap empty-state" style={{ marginTop: 20 }}>
        <h2>No recent order</h2>
        <Link to="/s">Continue shopping</Link>
      </div>
    )
  }

  return (
    <div className="wrap">
      <div className="confirm-hero">
        <div className="confirm-check">✓</div>
        <div>
          <h1 style={{ margin: '0 0 4px', color: 'var(--success)' }}>Order placed, thank you!</h1>
          <p className="note" style={{ margin: 0 }}>
            Confirmation will be sent to your email. Order <b>{order.id}</b>.
          </p>
          <p style={{ margin: '8px 0 0' }}>
            {order.deliveryLabel} · Arriving <b>{order.deliveryEta}</b> to {order.address.city}, {order.address.state}
          </p>
          <p className="note" style={{ margin: '4px 0 0' }}>
            Paid with {order.payMethod}
            {order.payLast4 !== '—' ? ` ending ${order.payLast4}` : ''}
          </p>
        </div>
      </div>

      <div className="cart-layout">
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>Items in this order</h2>
          {order.items.map((it) => (
            <div className="order-item" key={it.id + it.color}>
              <div className="oi-thumb" style={{ background: '#eee' }}>
                {it.emoji}
              </div>
              <div>
                <div>{it.title}</div>
                <div className="note">
                  {it.color} · Qty {it.qty}
                </div>
                <Price value={it.price * it.qty} />
              </div>
            </div>
          ))}
        </div>
        <aside className="panel">
          <h3 style={{ marginTop: 0 }}>Order Summary</h3>
          <div className="flex between" style={{ padding: '3px 0' }}>
            <span>Items:</span>
            <Price value={order.subtotal} />
          </div>
          <div className="flex between" style={{ padding: '3px 0' }}>
            <span>Shipping:</span>
            {order.shipping === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : <Price value={order.shipping} />}
          </div>
          <div className="flex between" style={{ padding: '3px 0' }}>
            <span>Tax:</span>
            <Price value={order.tax} />
          </div>
          <hr className="hr" />
          <div className="flex between" style={{ fontWeight: 700 }}>
            <span>Total:</span>
            <Price value={order.total} />
          </div>
          <Link to="/orders" className="btn btn-block pill mt16" style={{ display: 'block' }}>
            View your orders
          </Link>
          <Link to="/s" className="btn btn-yellow btn-block pill mt8" style={{ display: 'block' }}>
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
