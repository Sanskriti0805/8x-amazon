import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/store'

/** Transient confirmation shown when an item is added to the cart. */
export default function Toast() {
  const { toast, dismissToast, cartCount } = useStore()

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(dismissToast, 3200)
    return () => clearTimeout(t)
  }, [toast, dismissToast])

  if (!toast) return null

  return (
    <div className="toast" key={toast.id} role="status" aria-live="polite">
      <span className="toast-check">✓</span>
      <span className="toast-msg">{toast.msg}</span>
      <Link to="/cart" className="toast-link" onClick={dismissToast}>
        View cart ({cartCount})
      </Link>
      <button className="toast-x" onClick={dismissToast} aria-label="Dismiss">
        ×
      </button>
    </div>
  )
}
