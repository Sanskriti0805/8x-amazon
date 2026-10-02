import { Link } from 'react-router-dom'
import { CATEGORIES, PRODUCTS, type Product } from '../data/products'
import SectionHeader from '../components/SectionHeader'
import ProductCard from '../components/ProductCard'
import Button from '../components/Button'

function tileBg(p: Product) {
  return { background: `linear-gradient(135deg, ${p.tile.from}, ${p.tile.to})` }
}

const shortName = (p: Product) => p.title.split(/[,(]/)[0].split(' ').slice(0, 3).join(' ')

/** Pick 4 products for a card: the category's own, padded from the rest of the catalog. */
function fourFor(cat: string): Product[] {
  const own = PRODUCTS.filter((p) => p.category === cat)
  if (own.length >= 4) return own.slice(0, 4)
  const filler = PRODUCTS.filter((p) => p.category !== cat)
  return [...own, ...filler].slice(0, 4)
}

function Card({ title, cat, cta }: { title: string; cat: string; cta: string }) {
  const items = fourFor(cat)
  return (
    <div className="home-card">
      <h3>{title}</h3>
      <div className="tiles">
        {items.map((p, i) => (
          <Link key={p.id + i} to={`/p/${p.id}`} className="mini-tile" style={tileBg(p)} title={p.title}>
            <span className="emoji">{p.tile.emoji}</span>
            <span className="cap">{shortName(p)}</span>
          </Link>
        ))}
      </div>
      <Link to={`/s?cat=${encodeURIComponent(cat)}`} className="foot">
        {cta}
      </Link>
    </div>
  )
}

const SECTIONS: { title: string; cat: string; cta: string }[] = [
  { title: 'Shop kitchen must-haves', cat: 'Home & Kitchen', cta: 'Explore all' },
  { title: 'Level up your tech', cat: 'Electronics', cta: 'Shop electronics' },
  { title: 'Toys for little ones', cat: 'Toys & Games', cta: 'See more' },
  { title: 'Get ready to run', cat: 'Sports', cta: 'Shop sports & outdoors' },
  { title: 'Discover great reads', cat: 'Books', cta: 'Shop books' },
  { title: 'All things beauty', cat: 'Beauty', cta: 'Explore beauty' },
  { title: 'Start looking sharp', cat: 'Fashion', cta: 'Shop fashion' },
  { title: 'Grocery favorites', cat: 'Grocery', cta: 'Shop grocery' },
]

export default function Home() {
  const topPicks = [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).slice(0, 8)
  const deals = PRODUCTS.filter((p) => p.listPrice).slice(0, 8)

  return (
    <div className="home">
      <div className="hero-strip">
        <div className="wrap hero-inner">
          <div className="hero-copy">
            <span className="hero-kicker">Rebuilt for the 8x assignment</span>
            <h1>Everything you need, delivered fast</h1>
            <p>Browse thousands of products, add to cart, and check out — the full shopping flow.</p>
            <Button to="/s" variant="yellow" size="lg" className="hero-cta">
              Start shopping
            </Button>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="home-grid">
          {SECTIONS.map((s) => (
            <Card key={s.cat} {...s} />
          ))}
        </div>

        <section className="rail-section">
          <SectionHeader title="Top picks for you" linkText="See all" to="/s" />
          <div className="rail">
            {topPicks.map((p) => (
              <div className="rail-item" key={p.id}>
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </section>

        <section className="rail-section">
          <SectionHeader title="Today's deals" linkText="See all deals" to="/s" />
          <div className="rail">
            {deals.map((p) => (
              <div className="rail-item" key={p.id}>
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </section>

        <SectionHeader title="Shop by department" />
        <div className="dept-grid">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/s?cat=${encodeURIComponent(c)}`} className="dept-card">
              <div className="dept-emoji">{PRODUCTS.find((p) => p.category === c)?.tile.emoji}</div>
              <div className="dept-name">{c}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
