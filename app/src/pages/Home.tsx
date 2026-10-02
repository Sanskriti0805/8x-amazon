import { Link } from 'react-router-dom'
import { CATEGORIES, PRODUCTS, type Product } from '../data/products'

function tileBg(p: Product) {
  return { background: `linear-gradient(135deg, ${p.tile.from}, ${p.tile.to})` }
}

function Card({ title, items, cta }: { title: string; items: Product[]; cta: string }) {
  return (
    <div className="home-card">
      <h3>{title}</h3>
      <div className="tiles">
        {items.slice(0, 4).map((p) => (
          <Link key={p.id} to={`/p/${p.id}`} className="mini-tile cap-tile" style={tileBg(p)} title={p.title}>
            <span className="emoji">{p.tile.emoji}</span>
          </Link>
        ))}
      </div>
      <Link to="/s" className="foot">
        {cta}
      </Link>
    </div>
  )
}

export default function Home() {
  const pick = (cat: string) => PRODUCTS.filter((p) => p.category === cat)
  return (
    <div className="home">
      <div className="hero-strip" />
      <div className="wrap">
        <div className="home-grid">
          <Card title="Shop kitchen must-haves" items={pick('Home & Kitchen')} cta="Explore all" />
          <Card title="Level up your tech" items={pick('Electronics')} cta="Shop electronics" />
          <Card title="Toys for little ones" items={pick('Toys & Games')} cta="See more" />
          <Card title="Get ready to run" items={pick('Sports')} cta="Shop sports & outdoors" />
          <Card title="Discover great reads" items={pick('Books')} cta="Shop books" />
          <Card title="All things beauty" items={pick('Beauty')} cta="Explore beauty" />
          <Card title="Start looking sharp" items={pick('Fashion')} cta="Shop fashion" />
          <Card title="Grocery favorites" items={pick('Grocery')} cta="Shop grocery" />
        </div>

        <h2 className="section-title">Shop by department</h2>
        <div className="home-grid" style={{ marginTop: 0 }}>
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/s?cat=${encodeURIComponent(c)}`} className="home-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40 }}>{PRODUCTS.find((p) => p.category === c)?.tile.emoji}</div>
              <div style={{ marginTop: 8, fontWeight: 700, color: 'var(--text)' }}>{c}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
