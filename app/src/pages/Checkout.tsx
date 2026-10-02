import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { byId } from '../data/products'
import { useStore, SHIPPING_FEE, SHIPPING_FREE_THRESHOLD, TAX_RATE } from '../store/store'
import { Price } from '../components/bits'

export default function Checkout() {
  const { cart, subtotal, user, address, setAddress, placeOrder } = useStore()
  const nav = useNavigate()

  const [form, setForm] = useState({
    name: address?.name || user?.name || '',
    line1: address?.line1 || '',
    city: address?.city || '',
    state: address?.state || '',
    zip: address?.zip || '',
  })
  const [card, setCard] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (cart.length === 0) {
    return (
      <div className="wrap empty-state" style={{ marginTop: 20 }}>
        <h2>Your cart is empty</h2>
        <Link to="/s">Continue shopping</Link>
      </div>
    )
  }

  const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FEE
  const tax = +(subtotal * TAX_RATE).toFixed(2)
  const total = +(subtotal + shipping + tax).toFixed(2)
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Enter a name'
    if (!form.line1.trim()) e.line1 = 'Enter an address'
    if (!form.city.trim()) e.city = 'Enter a city'
    if (!form.state.trim()) e.state = 'Enter a state'
    if (!/^\d{5}$/.test(form.zip)) e.zip = 'Enter a 5-digit ZIP'
    const digits = card.replace(/\s/g, '')
    if (!/^\d{16}$/.test(digits)) e.card = 'Enter a 16-digit test card number'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function submit() {
    if (!validate()) return
    setAddress(form)
    const order = placeOrder(card.replace(/\s/g, '').slice(-4), form)
    nav('/confirmation', { state: { orderId: order.id } })
  }

  return (
    <div className="wrap">
      <h1 style={{ margin: '16px 0' }}>Checkout</h1>
      <div className="checkout-grid">
        <div>
          <section className="co-section">
            <h2>
              <span className="step-num">1</span> Shipping address
            </h2>
            <div className="field">
              <label>Full name</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Jane Doe" />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>
            <div className="field">
              <label>Address</label>
              <input value={form.line1} onChange={(e) => set('line1', e.target.value)} placeholder="123 Main St" />
              {errors.line1 && <div className="error-text">{errors.line1}</div>}
            </div>
            <div className="form-row">
              <div className="field">
                <label>City</label>
                <input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="New York" />
                {errors.city && <div className="error-text">{errors.city}</div>}
              </div>
              <div className="field">
                <label>State</label>
                <input value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="NY" />
                {errors.state && <div className="error-text">{errors.state}</div>}
              </div>
            </div>
            <div className="field" style={{ maxWidth: 160 }}>
              <label>ZIP code</label>
              <input value={form.zip} onChange={(e) => set('zip', e.target.value)} placeholder="10001" maxLength={5} />
              {errors.zip && <div className="error-text">{errors.zip}</div>}
            </div>
          </section>

          <section className="co-section">
            <h2>
              <span className="step-num">2</span> Payment method
            </h2>
            <p className="note">Demo only — use a fake number like 4111 1111 1111 1111. No real card is charged.</p>
            <div className="field" style={{ maxWidth: 320, marginTop: 10 }}>
              <label>Card number</label>
              <input
                value={card}
                onChange={(e) => setCard(e.target.value)}
                placeholder="4111 1111 1111 1111"
                inputMode="numeric"
              />
              {errors.card && <div className="error-text">{errors.card}</div>}
            </div>
          </section>

          <section className="co-section">
            <h2>
              <span className="step-num">3</span> Review items
            </h2>
            {cart.map((l) => {
              const p = byId(l.id)!
              return (
                <div className="order-item" key={l.id + l.color}>
                  <div
                    className="oi-thumb"
                    style={{ background: `linear-gradient(135deg, ${p.tile.from}, ${p.tile.to})` }}
                  >
                    {p.tile.emoji}
                  </div>
                  <div>
                    <div>{p.title}</div>
                    <div className="note">
                      {l.color} · Qty {l.qty}
                    </div>
                    <Price value={p.price * l.qty} />
                  </div>
                </div>
              )
            })}
          </section>
        </div>

        <aside className="panel" style={{ position: 'sticky', top: 100 }}>
          <button className="btn btn-yellow btn-block pill" onClick={submit}>
            Place your order
          </button>
          <p className="note mt8">By placing your order (demo), no real payment is taken.</p>
          <hr className="hr" />
          <h3 style={{ margin: '0 0 10px' }}>Order Summary</h3>
          <Row label="Items:" value={subtotal} />
          <Row label="Shipping:" value={shipping} free={shipping === 0} />
          <Row label="Estimated tax:" value={tax} />
          <hr className="hr" />
          <div className="flex between" style={{ fontSize: 18, color: 'var(--price-red)', fontWeight: 700 }}>
            <span>Order total:</span>
            <Price value={total} />
          </div>
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value, free }: { label: string; value: number; free?: boolean }) {
  return (
    <div className="flex between" style={{ padding: '3px 0' }}>
      <span>{label}</span>
      {free ? <span style={{ color: 'var(--success)' }}>FREE</span> : <Price value={value} />}
    </div>
  )
}
