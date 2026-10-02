import { Link, useParams } from 'react-router-dom'
import { useStore, orderStatus, ORDER_STAGES } from '../store/store'
import { byId } from '../data/products'
import { Price } from '../components/bits'
import ProductImage from '../components/ProductImage'

export default function OrderDetails() {
  const { id } = useParams()
  const { orders } = useStore()
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="wrap empty-state" style={{ marginTop: 20 }}>
        <h2>Order not found</h2>
        <Link to="/orders">Back to your orders</Link>
      </div>
    )
  }

  const status = orderStatus(order)
  const placed = new Date(order.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="wrap" style={{ padding: '16px 0 40px' }}>
      <div className="breadcrumb">
        <Link to="/orders">Your Orders</Link> › {order.id}
      </div>

      <div className="flex between items-center" style={{ flexWrap: 'wrap', gap: 8 }}>
        <h1 style={{ margin: 0 }}>Order details</h1>
        <span className={`status-chip ${status.delivered ? 'delivered' : ''}`}>{status.label}</span>
      </div>
      <p className="note">
        Ordered on {placed} · Order <b>{order.id}</b>
      </p>

      {/* Status timeline */}
      <div className="panel">
        <div className="timeline">
          {ORDER_STAGES.map((stage, i) => (
            <div key={stage} className={`tl-step ${i <= status.step ? 'done' : ''} ${i === status.step ? 'current' : ''}`}>
              <div className="tl-dot">{i < status.step ? '✓' : i + 1}</div>
              <div className="tl-label">{stage}</div>
            </div>
          ))}
        </div>
        <div className="note mt8" style={{ textAlign: 'center' }}>
          {status.delivered ? 'Delivered' : `${order.deliveryLabel} · Arriving ${order.deliveryEta}`}
        </div>
      </div>

      <div className="cart-layout">
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>Items in this order</h2>
          {order.items.map((it) => (
            <div className="order-item" key={it.id + it.color}>
              <Link to={`/p/${it.id}`} className="oi-thumb" style={{ overflow: 'hidden', borderRadius: 6 }}>
                {byId(it.id) ? <ProductImage p={byId(it.id)!} size="sm" /> : <span>{it.emoji}</span>}
              </Link>
              <div>
                <Link to={`/p/${it.id}`}>{it.title}</Link>
                <div className="note">
                  {it.color} · Qty {it.qty}
                </div>
                <Price value={it.price * it.qty} />
                <div className="mt8">
                  <Link to={`/p/${it.id}`} className="btn pill" style={{ display: 'inline-block' }}>
                    Buy it again
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="panel">
          <h3 style={{ marginTop: 0 }}>Delivery address</h3>
          <div className="note">
            {order.address.name}
            <br />
            {order.address.line1}
            <br />
            {order.address.city}, {order.address.state} {order.address.zip}
            <br />
            {order.address.phone}
          </div>

          <hr className="hr" />
          <h3>Payment</h3>
          <div className="note">
            {order.payMethod}
            {order.payLast4 !== '—' ? ` ending ${order.payLast4}` : ''}
          </div>

          <hr className="hr" />
          <h3>Order summary</h3>
          <div className="flex between" style={{ padding: '3px 0' }}>
            <span>Items:</span>
            <Price value={order.subtotal} />
          </div>
          <div className="flex between" style={{ padding: '3px 0' }}>
            <span>Delivery:</span>
            {order.shipping === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : <Price value={order.shipping} />}
          </div>
          <div className="flex between" style={{ padding: '3px 0' }}>
            <span>Tax:</span>
            <Price value={order.tax} />
          </div>
          <hr className="hr" />
          <div className="flex between" style={{ fontWeight: 700, fontSize: 16 }}>
            <span>Grand total:</span>
            <Price value={order.total} />
          </div>
        </aside>
      </div>
    </div>
  )
}
