export function Rating({ rating }: { rating: number }) {
  const pct = (rating / 5) * 100
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      <span className="base">★★★★★</span>
      <span className="fill" style={{ width: `${pct}%` }}>
        ★★★★★
      </span>
    </span>
  )
}

export function Price({ value, size }: { value: number; size?: 'lg' }) {
  const [whole, frac] = value.toFixed(2).split('.')
  return (
    <span className="price" style={size === 'lg' ? { fontSize: 2 } : undefined}>
      <span className="cur">$</span>
      <span className="whole">{whole}</span>
      <span className="frac">{frac}</span>
    </span>
  )
}

const COLOR_MAP: Record<string, string> = {
  black: '#1a1a1a',
  white: '#f5f5f5',
  blue: '#2f5fa3',
  navy: '#1c2a4a',
  pink: '#e39ab5',
  red: '#b11e23',
  grey: '#777',
  gray: '#777',
  charcoal: '#36454f',
  green: '#3a7d3a',
  rose: '#c48a9a',
  cream: '#efe6d3',
  teal: '#2f8aa0',
}

export function swatchColor(name: string): string {
  const key = name.toLowerCase()
  for (const k of Object.keys(COLOR_MAP)) if (key.includes(k)) return COLOR_MAP[k]
  // deterministic fallback hue from the string
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360
  return `hsl(${h} 35% 55%)`
}

export function reviewCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'K'
  return String(n)
}
