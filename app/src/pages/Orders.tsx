import { Link } from 'react-router-dom'
import { useStore, orderStatus } from '../store/store'
import { byId } from '../data/products'
import { Price } from '../components/bits'
import ProductImage from '../components/ProductImage'

export default function Orders() {
  const { orders } = useStore()

  if (orders.length === 0) {
    return (
      <div className="wrap" style={{ padding: '16px 0 40px' }}>
        <h1>Your Orders</h1>
        <div className="empty-state">
          <div style={{ fontSize: 60 }}>📦</div>
          <h2>No orders yet</h2>
          <p className="note">When you place an order, it will show up here.</p>
          <Link to="/s" className="btn btn-yellow pill mt8" style={{ display: 'inline-block' }}>
            Start shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="wrap" style={{ padding: '16px 0 40px' }}>
      <h1>Your Orders</h1>
      {orders.map((o) => (
        <div className="order-card" key={o.id}>
          <div className="order-head">
            <div>
              <div className="k">Order placed</div>
              <div className="v">
                {new Date(o.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            <div>
              <div className="k">Total</div>
              <div className="v">${o.total.toFixed(2)}</div>
            </div>
            <div>
              <div className="k">Ship to</div>
              <div className="v">{o.address.name}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <div className="k">Order #</div>
              <div className="v">{o.id}</div>
              <Link to={`/orders/${o.id}`} className="note">
                View order details ›
              </Link>
            </div>
          </div>
          <div className="order-body">
            <div className="flex between items-center" style={{ marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <span style={{ color: 'var(--success)', fontWeight: 700 }}>
                {orderStatus(o).delivered ? 'Delivered' : `Arriving ${o.deliveryEta}`}
              </span>
              <span className={`status-chip ${orderStatus(o).delivered ? 'delivered' : ''}`}>
                {orderStatus(o).label}
              </span>
            </div>
            {o.items.map((it) => {
              const p = byId(it.id)
              return (
              <div className="order-item" key={it.id + it.color}>
                <Link to={`/p/${it.id}`} className="oi-thumb" style={{ overflow: 'hidden', borderRadius: 6 }}>
                  {p ? <ProductImage p={p} size="sm" /> : <span>{it.emoji}</span>}
                </Link>
                <div>
                  <Link to={`/p/${it.id}`}>{it.title}</Link>
                  <div className="note">
                    {it.color} · Qty {it.qty}
                  </div>
                  <div className="flex gap8 mt8">
                    <Link to={`/p/${it.id}`} className="btn pill" style={{ display: 'inline-block' }}>
                      Buy it again
                    </Link>
                  </div>
                </div>
              </div>
              )
            })}
            <hr className="hr" />
            <div className="flex between">
              <span className="note">
                {o.items.reduce((n, i) => n + i.qty, 0)} item(s)
              </span>
              <span>
                Order total: <b><Price value={o.total} /></b>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
