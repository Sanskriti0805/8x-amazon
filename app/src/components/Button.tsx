import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'default' | 'yellow' | 'orange'
type Size = 'md' | 'lg'

type Common = {
  variant?: Variant
  size?: Size
  block?: boolean
  children: ReactNode
  className?: string
}

const cls = (v: Variant, size: Size, block?: boolean, extra?: string) =>
  [
    'btn',
    'pill',
    v === 'yellow' && 'btn-yellow',
    v === 'orange' && 'btn-orange',
    size === 'lg' && 'btn-lg',
    block && 'btn-block',
    extra,
  ]
    .filter(Boolean)
    .join(' ')

type ButtonAsButton = Common & { to?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>
type ButtonAsLink = Common & { to: string }

/**
 * Shared button. Renders a <button> by default, or a router <Link> when `to` is set,
 * so calls to action keep one consistent style across the app.
 */
export default function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'default', size = 'md', block, children, className, ...rest } = props
  const classes = cls(variant, size, block, className)

  if ('to' in props && props.to !== undefined) {
    const { to } = props as ButtonAsLink
    return (
      <Link to={to} className={classes} style={{ display: block ? 'block' : 'inline-block' }}>
        {children}
      </Link>
    )
  }

  const { to: _ignore, ...btnRest } = rest as ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined }
  void _ignore
  return (
    <button className={classes} {...btnRest}>
      {children}
    </button>
  )
}
