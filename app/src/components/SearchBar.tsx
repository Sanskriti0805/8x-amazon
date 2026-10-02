import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CATEGORIES } from '../data/products'

/** The category-scoped search box used in the header. */
export default function SearchBar() {
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('k') ?? '')
  const [cat, setCat] = useState(params.get('cat') ?? 'All')
  const nav = useNavigate()

  function submit(e: FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (q.trim()) p.set('k', q.trim())
    if (cat !== 'All') p.set('cat', cat)
    nav(`/s?${p.toString()}`)
  }

  return (
    <form className="search" onSubmit={submit} role="search">
      <select className="cat" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Search category">
        <option>All</option>
        {CATEGORIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search Amazon"
        aria-label="Search Amazon"
      />
      <button className="go" type="submit" aria-label="Search">
        🔍
      </button>
    </form>
  )
}
