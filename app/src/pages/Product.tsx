import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { byId } from '../data/products'
import { useStore } from '../store/store'
import { Price, Rating } from '../components/bits'

export default function Product() {
  const { id } = useParams()
  const p = id ? byId(id) : undefined
  const { addToCart, address } = useStore()
  const nav = useNavigate()
  const [color, setColor] = useState(p?.colors[0] ?? '')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!p) {
    return (
      <div className="wrap empty-state" style={{ marginTop: 20 }}>
        <h2>Product not found</h2>
        <Link to="/s">Back to shopping</Link>
      </div>
    )
  }

  const tileBg = { background: `linear-gradient(135deg, ${p.tile.from}, ${p.tile.to})` }
  const deliverCity = address?.city || 'New York 10001'
  const freeShip = p.price >= 35

  function add() {
    addToCart(p!.id, color, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }
  function buyNow() {
    addToCart(p!.id, color, qty)
    nav('/checkout')
  }

  return (
    <div className="wrap">
      <div className="breadcrumb">
        <Link to="/s">All</Link> › <Link to={`/s?cat=${encodeURIComponent(p.category)}`}>{p.category}</Link> ›{' '}
        {p.brand}
      </div>

      <div className="pdp">
        <div className="pdp-gallery">
          <div className="pdp-main-img" style={tileBg}>
            {p.tile.emoji}
          </div>
        </div>

        <div>
          {p.badge && <span className={`badge ${p.badge.includes('Choice') ? 'choice' : ''}`}>{p.badge}</span>}
          <h1 className="pdp-title">{p.title}</h1>
          <Link to={`/s?k=${encodeURIComponent(p.brand)}`} className="pdp-store">
            Visit the {p.brand} Store
          </Link>
          <div className="rating-row mt8">
            <Rating rating={p.rating} />
            <span className="cnt">{p.reviews.toLocaleString()} ratings</span>
          </div>

          <hr className="pdp-divider" />

          <div className="pdp-price flex items-center gap12">
            <Price value={p.price} />
            {p.listPrice && (
              <span className="list-price">
                List: <s>${p.listPrice.toFixed(2)}</s>{' '}
                <span className="text-red">
                  (-{Math.round((1 - p.price / p.listPrice) * 100)}%)
                </span>
              </span>
            )}
          </div>

          <hr className="pdp-divider" />

          <div>
            <b>Color:</b> {color}
            <div className="flex gap8 mt8" style={{ flexWrap: 'wrap' }}>
              {p.colors.map((c) => (
                <button
                  key={c}
                  className={`swatch-lg ${c === color ? 'sel' : ''}`}
                  onClick={() => setColor(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <hr className="pdp-divider" />

          <div className="about">
            <h3>About this item</h3>
            <ul>
              {p.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <p className="note">{p.about}</p>
          </div>
        </div>

        <aside className="buybox">
          <Price value={p.price} />
          {freeShip ? (
            <div className="free mt8">FREE delivery</div>
          ) : (
            <div className="note mt8">$5.99 delivery</div>
          )}
          <div className="deliver-to">
            Deliver to <b>{deliverCity}</b>
          </div>
          <div className="stock">In Stock</div>

          <select className="qty-sel" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                Qty: {n}
              </option>
            ))}
          </select>

          <button className="btn btn-yellow btn-block pill mt8" onClick={add}>
            {added ? '✓ Added to cart' : 'Add to Cart'}
          </button>
          <button className="btn btn-orange btn-block pill mt8" onClick={buyNow}>
            Buy Now
          </button>

          <p className="note mt16">
            Ships from and sold by Amazon Rebuild. Secure transaction. This is a demo — no real charge.
          </p>
        </aside>
      </div>
    </div>
  )
}
