import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { byId } from '../data/products'

export type CartLine = { id: string; color: string; qty: number }
export type User = { name: string; email: string }
export type Address = { name: string; line1: string; city: string; state: string; zip: string; phone: string }
export type OrderItem = { id: string; title: string; color: string; qty: number; price: number; emoji: string }
export type Order = {
  id: string
  date: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  address: Address
  payLast4: string
  payMethod: string
  deliveryLabel: string
  deliveryEta: string
}

export const ORDER_STAGES = ['Ordered', 'Shipped', 'Out for delivery', 'Delivered'] as const

/** Derive a plausible delivery status from how long ago the order was placed. */
export function orderStatus(o: Order): { label: string; step: number; delivered: boolean } {
  const hours = (Date.now() - new Date(o.date).getTime()) / 36e5
  let step = 0
  if (hours >= 72) step = 3
  else if (hours >= 24) step = 2
  else if (hours >= 2) step = 1
  return { label: ORDER_STAGES[step], step, delivered: step === 3 }
}

export type PlaceOrderInput = {
  last4: string
  addr: Address
  shipping: number
  payMethod: string
  deliveryLabel: string
  deliveryEta: string
}

type State = {
  cart: CartLine[]
  user: User | null
  orders: Order[]
  address: Address | null
}

type Store = State & {
  cartCount: number
  subtotal: number
  addToCart: (id: string, color: string, qty?: number) => void
  setQty: (id: string, color: string, qty: number) => void
  removeFromCart: (id: string, color: string) => void
  clearCart: () => void
  signIn: (u: User) => void
  signOut: () => void
  setAddress: (a: Address) => void
  placeOrder: (input: PlaceOrderInput) => Order
}

const KEY = 'amzn-rebuild-v1'
const Ctx = createContext<Store | null>(null)

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const s = JSON.parse(raw) as State
      // Backfill fields added after some orders were already persisted.
      const rawOrders = (s.orders ?? []) as Partial<Order>[]
      s.orders = rawOrders.map((o) => ({
        ...(o as Order),
        deliveryLabel: o.deliveryLabel ?? 'Standard delivery',
        deliveryEta: o.deliveryEta ?? 'soon',
        payMethod: o.payMethod ?? (o.payLast4 && o.payLast4 !== '—' ? 'Credit/Debit Card' : 'Card'),
        address: { ...(o.address as Address), phone: o.address?.phone ?? '' },
      }))
      return s
    }
  } catch {
    /* ignore */
  }
  return { cart: [], user: null, orders: [], address: null }
}

const SHIPPING_FREE_THRESHOLD = 35
const SHIPPING_FEE = 5.99
const TAX_RATE = 0.08

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const addToCart = useCallback((id: string, color: string, qty = 1) => {
    setState((s) => {
      const i = s.cart.findIndex((l) => l.id === id && l.color === color)
      const cart = [...s.cart]
      if (i >= 0) cart[i] = { ...cart[i], qty: cart[i].qty + qty }
      else cart.push({ id, color, qty })
      return { ...s, cart }
    })
  }, [])

  const setQty = useCallback((id: string, color: string, qty: number) => {
    setState((s) => ({
      ...s,
      cart: s.cart
        .map((l) => (l.id === id && l.color === color ? { ...l, qty } : l))
        .filter((l) => l.qty > 0),
    }))
  }, [])

  const removeFromCart = useCallback((id: string, color: string) => {
    setState((s) => ({ ...s, cart: s.cart.filter((l) => !(l.id === id && l.color === color)) }))
  }, [])

  const clearCart = useCallback(() => setState((s) => ({ ...s, cart: [] })), [])
  const signIn = useCallback((user: User) => setState((s) => ({ ...s, user })), [])
  const signOut = useCallback(() => setState((s) => ({ ...s, user: null })), [])
  const setAddress = useCallback((address: Address) => setState((s) => ({ ...s, address })), [])

  const subtotal = useMemo(
    () => state.cart.reduce((sum, l) => sum + (byId(l.id)?.price ?? 0) * l.qty, 0),
    [state.cart],
  )

  const cartCount = useMemo(() => state.cart.reduce((n, l) => n + l.qty, 0), [state.cart])

  const placeOrder = useCallback(
    (input: PlaceOrderInput): Order => {
      const items: OrderItem[] = state.cart.map((l) => {
        const p = byId(l.id)!
        return { id: l.id, title: p.title, color: l.color, qty: l.qty, price: p.price, emoji: p.tile.emoji }
      })
      const sub = items.reduce((s, it) => s + it.price * it.qty, 0)
      const shipping = input.shipping
      const tax = +(sub * TAX_RATE).toFixed(2)
      const order: Order = {
        id: 'AMZ-' + Date.now().toString().slice(-8),
        date: new Date().toISOString(),
        items,
        subtotal: +sub.toFixed(2),
        shipping,
        tax,
        total: +(sub + shipping + tax).toFixed(2),
        address: input.addr ?? state.address!,
        payLast4: input.last4,
        payMethod: input.payMethod,
        deliveryLabel: input.deliveryLabel,
        deliveryEta: input.deliveryEta,
      }
      setState((s) => ({ ...s, orders: [order, ...s.orders], cart: [] }))
      return order
    },
    [state.cart, state.address],
  )

  const value: Store = {
    ...state,
    cartCount,
    subtotal,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    signIn,
    signOut,
    setAddress,
    placeOrder,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export { SHIPPING_FREE_THRESHOLD, SHIPPING_FEE, TAX_RATE }
