import type { Product } from '../data/products'

type Size = 'sm' | 'md' | 'lg' | 'xl'

/** Lighting/background treatments so a product can show several distinct "views". */
const VARIANTS = [
  { light: { cx: 0.3, cy: 0.22 }, scale: 1, rotate: 0 },
  { light: { cx: 0.72, cy: 0.28 }, scale: 1.18, rotate: -8 },
  { light: { cx: 0.5, cy: 0.5 }, scale: 0.86, rotate: 6 },
  { light: { cx: 0.25, cy: 0.7 }, scale: 1.08, rotate: 12 },
]

/**
 * Reusable "product photo" treatment. Renders each product as a studio-lit
 * scene built entirely from local SVG — a soft gradient backdrop, a key light,
 * a pedestal shadow, and the product subject. No external URLs, so nothing 404s.
 * `variant` shifts the lighting and subject angle to give gallery thumbnails.
 */
export default function ProductImage({ p, size = 'md', variant = 0 }: { p: Product; size?: Size; variant?: number }) {
  const subjectSize = { sm: 42, md: 64, lg: 96, xl: 150 }[size]
  const v = VARIANTS[variant % VARIANTS.length]
  const gid = `g-${p.id}-${variant}`
  const vid = `v-${p.id}-${variant}`

  return (
    <div className={`pimg pimg-${size}`} aria-hidden>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="pimg-bg">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={p.tile.from} />
            <stop offset="1" stopColor={p.tile.to} />
          </linearGradient>
          <radialGradient id={vid} cx={v.light.cx} cy={v.light.cy} r="0.9">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.22" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${gid})`} />
        <rect width="100" height="100" fill={`url(#${vid})`} />
        <ellipse cx="50" cy="82" rx="26" ry="5" fill="#000000" opacity="0.22" />
      </svg>
      <span
        className="pimg-subject"
        style={
          variant === 0
            ? { fontSize: subjectSize }
            : { fontSize: subjectSize, transform: `translateY(-4%) rotate(${v.rotate}deg) scale(${v.scale})` }
        }
      >
        {p.tile.emoji}
      </span>
    </div>
  )
}
