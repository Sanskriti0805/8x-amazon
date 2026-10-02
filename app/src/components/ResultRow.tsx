import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { Price, Rating, reviewCount, swatchColor } from './bits'
import ProductImage from './ProductImage'

export default function ResultRow({ p }: { p: Product }) {
  return (
    <div className="result-row">
      <Link to={`/p/${p.id}`} className="result-thumb">
        <ProductImage p={p} size="lg" />
      </Link>
      <div>
        {p.badge && <span className={`badge ${p.badge.includes('Choice') ? 'choice' : ''}`}>{p.badge}</span>}
        <Link to={`/p/${p.id}`}>
          <h2 className="result-title">{p.title}</h2>
        </Link>
        <div className="note">{p.brand}</div>
        <div className="rating-row">
          <Rating rating={p.rating} />
          <span className="cnt">{p.reviews.toLocaleString()}</span>
        </div>
        {p.boughtPastMonth && <div className="bought">{p.boughtPastMonth}</div>}
        <div className="flex items-center gap12 mt8">
          <Price value={p.price} />
          {p.listPrice && (
            <span className="list-price">
              List: <s>${p.listPrice.toFixed(2)}</s>
            </span>
          )}
        </div>
        {p.prime && (
          <div className="prime-badge mt8">
            <span className="chk">✓</span> prime <span className="note">FREE delivery</span>
          </div>
        )}
        <div className="color-opts">
          {p.colors.slice(0, 5).map((c) => (
            <span key={c} className="swatch" style={{ background: swatchColor(c) }} title={c} />
          ))}
          {p.colors.length > 1 && <span className="note">{p.colors.length} options</span>}
        </div>
        <Link to={`/p/${p.id}`} className="btn pill" style={{ display: 'inline-block' }}>
          See options
        </Link>
        <span className="note" style={{ marginLeft: 10 }}>
          {reviewCount(p.reviews)} ratings
        </span>
      </div>
    </div>
  )
}
