import { Link } from 'react-router-dom'
import { type Product, discount } from '../data/products'
import { Price, Rating, reviewCount } from './bits'
import ProductImage from './ProductImage'

/** Vertical product card for grids and horizontal rails. Reusable + clickable. */
export default function ProductCard({ p }: { p: Product }) {
  const off = discount(p)
  return (
    <Link to={`/p/${p.id}`} className="product-card">
      <div className="pc-thumb">
        <ProductImage p={p} size="md" />
        {p.badge && <span className={`pc-badge ${p.badge.includes('Choice') ? 'choice' : ''}`}>{p.badge}</span>}
        {off && <span className="pc-off">-{off}%</span>}
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
