import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/** A titled section heading with an optional "see more" link on the right. */
export default function SectionHeader({
  title,
  linkText,
  to,
  children,
}: {
  title: string
  linkText?: string
  to?: string
  children?: ReactNode
}) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {children}
      {linkText && to && (
        <Link to={to} className="section-link">
          {linkText} ›
        </Link>
      )}
    </div>
  )
}
