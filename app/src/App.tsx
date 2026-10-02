import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Search from './pages/Search'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import SignIn from './pages/SignIn'
import Account from './pages/Account'
import RequireAuth from './components/RequireAuth'
import Toast from './components/Toast'
import { byId } from './data/products'

const TITLES: Record<string, string> = {
  '/': 'Amazon — Spend less. Smile more.',
  '/s': 'Search results',
  '/cart': 'Shopping Cart',
  '/checkout': 'Checkout',
  '/confirmation': 'Order confirmation',
  '/orders': 'Your Orders',
  '/account': 'Your Account',
  '/signin': 'Sign in',
}

function RouteEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    if (pathname === '/') {
      document.title = 'Amazon — Spend less. Smile more.'
      return
    }
    let title = TITLES[pathname]
    if (!title && pathname.startsWith('/p/')) {
      title = byId(pathname.slice(3))?.title ?? 'Product'
    } else if (!title && pathname.startsWith('/orders/')) {
      title = 'Order details'
    }
    document.title = title ? `${title} · Amazon` : 'Amazon'
  }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const bare = pathname === '/signin'

  return (
    <>
      <RouteEffects />
      <Toast />
      {!bare && <Header />}
      <main style={{ minHeight: '60vh' }}>
        <div className="route-fade" key={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/s" element={<Search />} />
          <Route path="/p/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <Orders />
              </RequireAuth>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <RequireAuth>
                <OrderDetails />
              </RequireAuth>
            }
          />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <Account />
              </RequireAuth>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<Home />} />
        </Routes>
        </div>
      </main>
      {!bare && <Footer />}
    </>
  )
}
