import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { Price, Rating, reviewCount } from './bits'

/** Vertical product card for grids and horizontal rails. */
export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link to={`/p/${p.id}`} className="product-card">
      <div className="pc-thumb" style={{ background: `linear-gradient(135deg, ${p.tile.from}, ${p.tile.to})` }}>
        <span className="pc-emoji">{p.tile.emoji}</span>
        {p.badge && <span className={`pc-badge ${p.badge.includes('Choice') ? 'choice' : ''}`}>{p.badge}</span>}
      </div>
      <div className="pc-body">
        <div className="pc-title">{p.title}</div>
        <div className="pc-rating">
          <Rating rating={p.rating} />
          <span className="pc-reviews">{reviewCount(p.reviews)}</span>
        </div>
        <div className="pc-price">
          <Price value={p.price} />
          {p.listPrice && <span className="pc-list">${p.listPrice.toFixed(2)}</span>}
        </div>
        {p.prime && (
          <div className="prime-badge">
            <span className="chk">✓</span> prime
          </div>
        )}
      </div>
    </Link>
  )
}
