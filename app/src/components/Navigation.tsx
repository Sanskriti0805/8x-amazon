import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/products'

/** Secondary category bar shown under the main header. */
export default function Navigation() {
  return (
    <nav className="header-sub" aria-label="Shop categories">
      <Link to="/s" className="nav-all">
        ☰ All
      </Link>
      {CATEGORIES.map((c) => (
        <Link key={c} to={`/s?cat=${encodeURIComponent(c)}`} className="nav-link">
          {c}
        </Link>
      ))}
      <Link to="/s?k=deals" className="nav-link nav-deal">
        Today's Deals
      </Link>
    </nav>
  )
}
