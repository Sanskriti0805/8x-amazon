import type { Product } from '../data/products'

type Size = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Reusable "product photo" treatment. Renders each product as a studio-lit
 * scene built entirely from local SVG — a soft gradient backdrop, a top-left
 * key light, a pedestal shadow, and the product subject. No external URLs, so
 * nothing can 404 on the deployed site.
 */
export default function ProductImage({ p, size = 'md' }: { p: Product; size?: Size }) {
  const subjectSize = { sm: 42, md: 64, lg: 96, xl: 150 }[size]
  const gid = `g-${p.id}`
  const vid = `v-${p.id}`

  return (
    <div className={`pimg pimg-${size}`} aria-hidden>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="pimg-bg">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={p.tile.from} />
            <stop offset="1" stopColor={p.tile.to} />
          </linearGradient>
          <radialGradient id={vid} cx="0.3" cy="0.22" r="0.9">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.22" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${gid})`} />
        <rect width="100" height="100" fill={`url(#${vid})`} />
        <ellipse cx="50" cy="82" rx="26" ry="5" fill="#000000" opacity="0.22" />
      </svg>
      <span className="pimg-subject" style={{ fontSize: subjectSize }}>
        {p.tile.emoji}
      </span>
    </div>
  )
}
