import { Link } from 'react-router-dom'
import { useStore } from '../store/store'
import SearchBar from './SearchBar'
import Navigation from './Navigation'

export default function Header() {
  const { cartCount, user, signOut, address } = useStore()
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

        <div className="hbox account-box" tabIndex={0}>
          <span className="l1">{user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}</span>
          <span className="l2">
            {user ? (
              <span onClick={signOut} style={{ cursor: 'pointer' }}>
                Sign out ▾
              </span>
            ) : (
              <Link to="/signin" style={{ color: '#fff' }}>
                Account & Lists ▾
              </Link>
            )}
          </span>
        </div>

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
