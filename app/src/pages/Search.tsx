import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import ResultRow from '../components/ResultRow'

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'reviews'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const k = params.get('k')?.toLowerCase() ?? ''
  const cat = params.get('cat') ?? ''
  const [sort, setSort] = useState<Sort>('featured')
  const [minRating, setMinRating] = useState(0)
  const [brands, setBrands] = useState<string[]>([])
  const [primeOnly, setPrimeOnly] = useState(false)

  const base = useMemo(
    () =>
      PRODUCTS.filter((p) => {
        if (cat && p.category !== cat) return false
        if (k && !(`${p.title} ${p.brand} ${p.category}`.toLowerCase().includes(k))) return false
        return true
      }),
    [k, cat],
  )

  const availableBrands = useMemo(
    () => [...new Set(base.map((p) => p.brand))].sort(),
    [base],
  )

  const results = useMemo(() => {
    let r = base.filter((p) => {
      if (p.rating < minRating) return false
      if (brands.length && !brands.includes(p.brand)) return false
      if (primeOnly && !p.prime) return false
      return true
    })
    r = [...r]
    if (sort === 'price-asc') r.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') r.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') r.sort((a, b) => b.rating - a.rating)
    else if (sort === 'reviews') r.sort((a, b) => b.reviews - a.reviews)
    return r
  }, [base, minRating, brands, primeOnly, sort])

  const toggleBrand = (b: string) =>
    setBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]))

  const heading = k ? `"${params.get('k')}"` : cat || 'All products'
  const clearAll = () => {
    setMinRating(0)
    setBrands([])
    setPrimeOnly(false)
  }

  return (
    <div className="wrap">
      <div className="results-head">
        <span className="results-count">
          1-{results.length} of over {(base.length * 1247).toLocaleString()} results for <b>{heading}</b>
        </span>
        <select className="sort-sel" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
          <option value="featured">Sort by: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Avg. Customer Review</option>
          <option value="reviews">Most Reviewed</option>
        </select>
      </div>

      <div className="results-layout">
        <aside className="filters">
          {cat && (
            <>
              <h4>Department</h4>
              <div className="frow" onClick={() => setParams({})} style={{ fontWeight: 700 }}>
                ‹ {cat}
              </div>
            </>
          )}

          <h4>Customer Reviews</h4>
          {[4, 3].map((r) => (
            <div key={r} className="frow" onClick={() => setMinRating(minRating === r ? 0 : r)}>
              <input type="checkbox" readOnly checked={minRating === r} />
              <span className="stars">
                <span className="base">★★★★★</span>
                <span className="fill" style={{ width: `${(r / 5) * 100}%` }}>
                  ★★★★★
                </span>
              </span>
              <span>& Up</span>
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
          <div className="frow" onClick={() => setPrimeOnly(!primeOnly)}>
            <input type="checkbox" readOnly checked={primeOnly} />
            <span className="prime-badge">prime</span>
          </div>

          {(minRating > 0 || brands.length > 0 || primeOnly) && (
            <div className="clear">
              <a href="#" onClick={(e) => { e.preventDefault(); clearAll() }}>
                Clear all filters
              </a>
            </div>
          )}
        </aside>

        <main>
          {results.length === 0 ? (
            <div className="empty-state">
              <h2>No results{k ? ` for "${params.get('k')}"` : ''}</h2>
              <p className="note">Try a different search or clear your filters.</p>
            </div>
          ) : (
            results.map((p) => <ResultRow key={p.id} p={p} />)
          )}
        </main>
      </div>
    </div>
  )
}
