import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { byId } from '../data/products'
import { useStore, TAX_RATE, SHIPPING_FREE_THRESHOLD, SHIPPING_FEE } from '../store/store'
import { Price } from '../components/bits'
import ProductImage from '../components/ProductImage'

type Delivery = 'standard' | 'faster'
type PayMethod = 'card' | 'cod'

const STEPS = ['Address', 'Delivery', 'Payment', 'Review']

function dateInDays(n: number): string {
  return new Date(Date.now() + n * 864e5).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export default function Checkout() {
  const { cart, subtotal, user, address, setAddress, placeOrder } = useStore()
  const nav = useNavigate()

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: address?.name || user?.name || '',
    line1: address?.line1 || '',
    city: address?.city || '',
    state: address?.state || '',
    zip: address?.zip || '',
    phone: address?.phone || '',
  })
  const [delivery, setDelivery] = useState<Delivery>('standard')
  const [payMethod, setPayMethod] = useState<PayMethod>('card')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const standardFee = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FEE
  const FASTER_FEE = 9.99
  const shipping = delivery === 'faster' ? FASTER_FEE : standardFee
  const tax = +(subtotal * TAX_RATE).toFixed(2)
  const total = +(subtotal + shipping + tax).toFixed(2)
  const deliveryLabel = delivery === 'faster' ? 'Faster delivery' : 'Standard delivery'
  const deliveryEta = useMemo(
    () => (delivery === 'faster' ? `${dateInDays(1)} – ${dateInDays(2)}` : `${dateInDays(4)} – ${dateInDays(6)}`),
    [delivery],
  )

  if (cart.length === 0) {
    return (
      <div className="wrap empty-state" style={{ marginTop: 20 }}>
        <h2>Your cart is empty</h2>
        <Link to="/s">Continue shopping</Link>
      </div>
    )
  }

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))
  const setCardField = (k: string, v: string) => setCard((c) => ({ ...c, [k]: v }))

  function validateStep(s: number): Record<string, string> {
    const e: Record<string, string> = {}
    if (s === 1) {
      if (!form.name.trim()) e.name = 'Enter a full name.'
      if (!form.line1.trim()) e.line1 = 'Enter a street address.'
      if (!form.city.trim()) e.city = 'Enter a city.'
      if (!form.state.trim()) e.state = 'Enter a state.'
      if (!/^\d{5}$/.test(form.zip)) e.zip = 'Enter a 5-digit ZIP code.'
      if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) e.phone = 'Enter a 10-digit phone number.'
    }
    if (s === 3 && payMethod === 'card') {
      if (!/^\d{16}$/.test(card.number.replace(/\s/g, ''))) e.number = 'Enter a 16-digit test card number.'
      if (!card.name.trim()) e.cardName = 'Enter the name on the card.'
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) e.expiry = 'Use MM/YY.'
      if (!/^\d{3,4}$/.test(card.cvv)) e.cvv = 'Enter the 3-digit CVV.'
    }
    return e
  }

  function next() {
    const e = validateStep(step)
    setErrors(e)
    if (Object.keys(e).length) return
    if (step === 1) setAddress(form)
    setStep((s) => Math.min(4, s + 1))
    window.scrollTo(0, 0)
  }
  function back() {
    setErrors({})
    setStep((s) => Math.max(1, s - 1))
    window.scrollTo(0, 0)
  }

  function placeTheOrder() {
    const last4 = payMethod === 'card' ? card.number.replace(/\s/g, '').slice(-4) : '—'
    const order = placeOrder({
      last4,
      addr: form,
      shipping,
      payMethod: payMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery',
      deliveryLabel,
      deliveryEta,
    })
    nav('/confirmation', { state: { orderId: order.id } })
  }

  return (
    <div className="wrap">
      <h1 style={{ margin: '16px 0 4px' }}>Checkout</h1>

      {/* Step indicator */}
      <ol className="steps">
        {STEPS.map((label, i) => {
          const n = i + 1
          const state = n < step ? 'done' : n === step ? 'active' : 'todo'
          return (
            <li key={label} className={`step ${state}`}>
              <span className="step-dot">{n < step ? '✓' : n}</span>
              <span className="step-label">{label}</span>
            </li>
          )
        })}
      </ol>

      <div className="checkout-grid">
        <div>
          {step === 1 && (
            <section className="co-section">
              <h2>Delivery address</h2>
              <div className="field">
                <label>Full name</label>
                <input className={errors.name ? 'invalid' : ''} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Jane Doe" />
                {errors.name && <div className="error-text">⚠ {errors.name}</div>}
              </div>
              <div className="field">
                <label>Address</label>
                <input className={errors.line1 ? 'invalid' : ''} value={form.line1} onChange={(e) => set('line1', e.target.value)} placeholder="123 Main St" />
                {errors.line1 && <div className="error-text">⚠ {errors.line1}</div>}
              </div>
              <div className="form-row">
                <div className="field">
                  <label>City</label>
                  <input className={errors.city ? 'invalid' : ''} value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="New York" />
                  {errors.city && <div className="error-text">⚠ {errors.city}</div>}
                </div>
                <div className="field">
                  <label>State</label>
                  <input className={errors.state ? 'invalid' : ''} value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="NY" />
                  {errors.state && <div className="error-text">⚠ {errors.state}</div>}
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Postal code</label>
                  <input className={errors.zip ? 'invalid' : ''} value={form.zip} onChange={(e) => set('zip', e.target.value)} placeholder="10001" maxLength={5} />
                  {errors.zip && <div className="error-text">⚠ {errors.zip}</div>}
                </div>
                <div className="field">
                  <label>Phone number</label>
                  <input className={errors.phone ? 'invalid' : ''} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(555) 123-4567" />
                  {errors.phone && <div className="error-text">⚠ {errors.phone}</div>}
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="co-section">
              <h2>Choose a delivery option</h2>
              {([
                { id: 'standard', title: 'Standard delivery', fee: standardFee, eta: `${dateInDays(4)} – ${dateInDays(6)}`, note: '4–6 business days' },
                { id: 'faster', title: 'Faster delivery', fee: FASTER_FEE, eta: `${dateInDays(1)} – ${dateInDays(2)}`, note: '1–2 business days' },
              ] as const).map((o) => (
                <label key={o.id} className={`delivery-option ${delivery === o.id ? 'sel' : ''}`}>
                  <input type="radio" name="delivery" checked={delivery === o.id} onChange={() => setDelivery(o.id)} />
                  <div className="do-main">
                    <div className="do-title">{o.title}</div>
                    <div className="note">Arrives {o.eta} · {o.note}</div>
                  </div>
                  <div className="do-fee">{o.fee === 0 ? <span className="free">FREE</span> : `$${o.fee.toFixed(2)}`}</div>
                </label>
              ))}
            </section>
          )}

          {step === 3 && (
            <section className="co-section">
              <h2>Payment method</h2>
              <p className="note">Demo only — never enter a real card. Try 4111 1111 1111 1111.</p>

              <div className="pay-tabs">
                <button className={`pay-tab ${payMethod === 'card' ? 'sel' : ''}`} onClick={() => setPayMethod('card')}>
                  💳 Credit / Debit Card
                </button>
                <button className={`pay-tab ${payMethod === 'cod' ? 'sel' : ''}`} onClick={() => setPayMethod('cod')}>
                  💵 Cash on Delivery
                </button>
              </div>

              {payMethod === 'card' ? (
                <div className="card-ui">
                  <div className="card-face">
                    <div className="card-chip" />
                    <div className="card-number">{card.number || '•••• •••• •••• ••••'}</div>
                    <div className="card-row">
                      <span>{card.name || 'CARDHOLDER NAME'}</span>
                      <span>{card.expiry || 'MM/YY'}</span>
                    </div>
                  </div>
                  <div className="field">
                    <label>Card number</label>
                    <input
                      className={errors.number ? 'invalid' : ''}
                      value={card.number}
                      onChange={(e) => setCardField('number', e.target.value)}
                      placeholder="4111 1111 1111 1111"
                      inputMode="numeric"
                    />
                    {errors.number && <div className="error-text">⚠ {errors.number}</div>}
                  </div>
                  <div className="field">
                    <label>Name on card</label>
                    <input className={errors.cardName ? 'invalid' : ''} value={card.name} onChange={(e) => setCardField('name', e.target.value)} placeholder="Jane Doe" />
                    {errors.cardName && <div className="error-text">⚠ {errors.cardName}</div>}
                  </div>
                  <div className="form-row">
                    <div className="field">
                      <label>Expiry (MM/YY)</label>
                      <input className={errors.expiry ? 'invalid' : ''} value={card.expiry} onChange={(e) => setCardField('expiry', e.target.value)} placeholder="08/28" maxLength={5} />
                      {errors.expiry && <div className="error-text">⚠ {errors.expiry}</div>}
                    </div>
                    <div className="field">
                      <label>CVV</label>
                      <input className={errors.cvv ? 'invalid' : ''} value={card.cvv} onChange={(e) => setCardField('cvv', e.target.value)} placeholder="123" maxLength={4} inputMode="numeric" />
                      {errors.cvv && <div className="error-text">⚠ {errors.cvv}</div>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="cod-note">
                  Pay with cash when your order is delivered. A small handling note may apply in a real store — free in this demo.
                </div>
              )}
            </section>
          )}

          {step === 4 && (
            <section className="co-section">
              <h2>Review your order</h2>

              <div className="review-block">
                <div className="review-head">
                  <b>Delivery address</b>
                  <a href="#" onClick={(e) => { e.preventDefault(); setStep(1) }}>Edit</a>
                </div>
                <div className="note">
                  {form.name}, {form.line1}, {form.city}, {form.state} {form.zip} · {form.phone}
                </div>
              </div>

              <div className="review-block">
                <div className="review-head">
                  <b>Delivery option</b>
                  <a href="#" onClick={(e) => { e.preventDefault(); setStep(2) }}>Edit</a>
                </div>
                <div className="note">{deliveryLabel} · Arrives {deliveryEta} · {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</div>
              </div>

              <div className="review-block">
                <div className="review-head">
                  <b>Payment</b>
                  <a href="#" onClick={(e) => { e.preventDefault(); setStep(3) }}>Edit</a>
                </div>
                <div className="note">
                  {payMethod === 'card'
                    ? `Card ending ${card.number.replace(/\s/g, '').slice(-4) || '••••'}`
                    : 'Cash on Delivery'}
                </div>
              </div>

              <div className="review-block">
                <b>Items ({cart.reduce((n, l) => n + l.qty, 0)})</b>
                {cart.map((l) => {
                  const p = byId(l.id)!
                  return (
                    <div className="order-item" key={l.id + l.color}>
                      <div className="oi-thumb" style={{ overflow: 'hidden', borderRadius: 6 }}>
                        <ProductImage p={p} size="sm" />
                      </div>
                      <div>
                        <div>{p.title}</div>
                        <div className="note">{l.color} · Qty {l.qty}</div>
                        <Price value={p.price * l.qty} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          <div className="co-nav">
            {step > 1 ? (
              <button className="btn pill" onClick={back}>
                ‹ Back
              </button>
            ) : (
              <Link to="/cart" className="btn pill">
                ‹ Back to cart
              </Link>
            )}
            {step < 4 ? (
              <button className="btn btn-yellow pill btn-lg" onClick={next}>
                Continue
              </button>
            ) : (
              <button className="btn btn-yellow pill btn-lg" onClick={placeTheOrder}>
                Place your order
              </button>
            )}
          </div>
        </div>

        <aside className="panel co-summary">
          <h3 style={{ marginTop: 0 }}>Order Summary</h3>
          <Row label={`Items (${cart.reduce((n, l) => n + l.qty, 0)}):`} value={subtotal} />
          <Row label="Delivery:" value={shipping} free={shipping === 0} />
          <Row label="Estimated tax:" value={tax} />
          <hr className="hr" />
          <div className="flex between" style={{ fontSize: 18, color: 'var(--price-red)', fontWeight: 700 }}>
            <span>Order total:</span>
            <Price value={total} />
          </div>
          <div className="delivery-note mt16">🚚 {deliveryLabel}: arrives <b>{deliveryEta}</b></div>
          {step === 4 && (
            <button className="btn btn-yellow btn-block pill mt16" onClick={placeTheOrder}>
              Place your order
            </button>
          )}
          <p className="note mt8" style={{ textAlign: 'center' }}>
            Demo only — no real payment is taken.
          </p>
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
