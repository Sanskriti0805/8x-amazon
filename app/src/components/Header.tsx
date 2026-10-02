import { Link } from 'react-router-dom'
import { useStore } from '../store/store'
import SearchBar from './SearchBar'
import Navigation from './Navigation'

export default function Header() {
  const { cartCount, user, address } = useStore()
  const deliverCity = address?.city || 'New York 10001'

  return (
    <header className="header">
      <div className="header-main">
        <Link to="/" className="logo">
          amazon<span className="smile">.</span>
        </Link>

        <Link to="/" className="deliver hbox" aria-label="Delivery location">
          <span className="pin">📍</span>
          <span className="deliver-text">
            <span className="l1">Deliver to</span>
            <span className="l2">{deliverCity}</span>
          </span>
        </Link>

        <SearchBar />

        <Link to={user ? '/account' : '/signin'} className="hbox account-box" style={{ color: '#fff' }}>
          <span className="l1">{user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}</span>
          <span className="l2">Account &amp; Lists ▾</span>
        </Link>

        <Link to="/orders" className="hbox orders-box" style={{ color: '#fff' }}>
          <span className="l1">Returns</span>
          <span className="l2">& Orders</span>
        </Link>

        <Link to="/cart" className="cart-link" aria-label={`Cart, ${cartCount} items`}>
          <span className="cart-count">{cartCount}</span>
          <span className="cart-icon">🛒</span>
          <span className="cart-word">Cart</span>
        </Link>
      </div>

      <Navigation />
    </header>
  )
}
