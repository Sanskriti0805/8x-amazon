import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PRODUCTS, type Product } from '../data/products'
import ResultRow from '../components/ResultRow'

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'rating'

const PRICE_BUCKETS: { id: string; label: string; min: number; max: number }[] = [
  { id: '0-25', label: 'Under $25', min: 0, max: 25 },
  { id: '25-50', label: '$25 to $50', min: 25, max: 50 },
  { id: '50-100', label: '$50 to $100', min: 50, max: 100 },
  { id: '100-200', label: '$100 to $200', min: 100, max: 200 },
  { id: '200+', label: '$200 & above', min: 200, max: Infinity },
]

function matchesQuery(p: Product, q: string): boolean {
  if (!q) return true
  const hay = `${p.title} ${p.brand} ${p.category} ${p.description} ${p.specifications
    .map((s) => s.value)
    .join(' ')}`.toLowerCase()
  // every whitespace-separated term must appear somewhere
  return q.split(/\s+/).every((term) => hay.includes(term))
}

export default function Search() {
  const [params, setParams] = useSearchParams()

  const kRaw = params.get('k') ?? ''
  const k = kRaw.toLowerCase().trim()
  const cat = params.get('cat') ?? ''
  const sort = (params.get('sort') as Sort) || 'featured'
  const [showFilters, setShowFilters] = useState(false)
  const minRating = Number(params.get('rating') ?? 0)
  const brands = (params.get('brand') ?? '').split(',').filter(Boolean)
  const priceId = params.get('price') ?? ''
  const primeOnly = params.get('prime') === '1'

  // Update one param while preserving the rest; empty value removes it.
  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (!value) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const base = useMemo(
    () =>
      PRODUCTS.filter((p) => {
        if (cat && p.category !== cat) return false
        if (k === 'deals') return !!p.listPrice
        return matchesQuery(p, k)
      }),
    [k, cat],
  )

  const availableBrands = useMemo(() => [...new Set(base.map((p) => p.brand))].sort(), [base])

  const results = useMemo(() => {
    const bucket = PRICE_BUCKETS.find((b) => b.id === priceId)
    let r = base.filter((p) => {
      if (p.rating < minRating) return false
      if (brands.length && !brands.includes(p.brand)) return false
      if (primeOnly && !p.prime) return false
      if (bucket && !(p.price >= bucket.min && p.price < bucket.max)) return false
      return true
    })
    r = [...r]
    if (sort === 'price-asc') r.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') r.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') r.sort((a, b) => b.rating - a.rating)
    else r.sort((a, b) => b.reviews - a.reviews) // featured ≈ most popular
    return r
  }, [base, minRating, brands, primeOnly, priceId, sort])

  const toggleBrand = (b: string) => {
    const next = brands.includes(b) ? brands.filter((x) => x !== b) : [...brands, b]
    update('brand', next.join(','))
  }

  const hasFilters = minRating > 0 || brands.length > 0 || primeOnly || !!priceId
  const clearAll = () => {
    const next = new URLSearchParams()
    if (kRaw) next.set('k', kRaw)
    if (cat) next.set('cat', cat)
    setParams(next, { replace: true })
  }

  const heading = k === 'deals' ? "Today's Deals" : kRaw ? `"${kRaw}"` : cat || 'All products'

  return (
    <div className="wrap">
      <button className="filters-toggle" onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters}>
        ☰ Filters{hasFilters ? ' · active' : ''}
      </button>
      <div className="results-head">
        <span className="results-count">
          {results.length === 0 ? (
            'No results'
          ) : (
            <>
              1–{results.length} of <b>{results.length}</b> result{results.length !== 1 ? 's' : ''}
            </>
          )}{' '}
          for <b>{heading}</b>
          {cat && kRaw && <span className="note"> in {cat}</span>}
        </span>
        <label className="sort-wrap">
          <span className="note">Sort by:</span>
          <select className="sort-sel" value={sort} onChange={(e) => update('sort', e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
          </select>
        </label>
      </div>

      <div className="results-layout">
        <aside className={`filters ${showFilters ? 'open' : ''}`}>
          {cat && (
            <>
              <h4>Department</h4>
              <div className="frow dept-active">{cat}</div>
              <div className="frow" onClick={() => update('cat', null)}>
                ‹ All departments
              </div>
            </>
          )}

          <h4>Customer Reviews</h4>
          {[4, 3].map((r) => (
            <div key={r} className="frow" onClick={() => update('rating', minRating === r ? null : String(r))}>
              <input type="checkbox" readOnly checked={minRating === r} />
              <span className="stars">
                <span className="base">★★★★★</span>
                <span className="fill" style={{ width: `${(r / 5) * 100}%` }}>
                  ★★★★★
                </span>
              </span>
              <span>&amp; Up</span>
            </div>
          ))}

          <h4>Price</h4>
          {PRICE_BUCKETS.map((b) => (
            <div key={b.id} className="frow" onClick={() => update('price', priceId === b.id ? null : b.id)}>
              <input type="radio" readOnly checked={priceId === b.id} />
              <span>{b.label}</span>
            </div>
          ))}

          <h4>Brands</h4>
          {availableBrands.map((b) => (
            <div key={b} className="frow" onClick={() => toggleBrand(b)}>
              <input type="checkbox" readOnly checked={brands.includes(b)} />
              <span>{b}</span>
            </div>
          ))}

          <h4>Eligible for</h4>
          <div className="frow" onClick={() => update('prime', primeOnly ? null : '1')}>
            <input type="checkbox" readOnly checked={primeOnly} />
            <span className="prime-badge">prime</span>
          </div>

          {hasFilters && (
            <div className="clear">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  clearAll()
                }}
              >
                Clear all filters
              </a>
            </div>
          )}
        </aside>

        <main>
          {results.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 56 }}>🔍</div>
              <h2>No results{kRaw ? ` for "${kRaw}"` : ''}</h2>
              <p className="note">
                Try checking your spelling, using fewer or more general words, or removing filters.
              </p>
              {hasFilters && (
                <button className="btn pill mt16" onClick={clearAll}>
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            results.map((p) => <ResultRow key={p.id} p={p} />)
          )}
        </main>
      </div>
    </div>
  )
}
