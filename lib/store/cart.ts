import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'
import { trackAddToCart, trackRemoveFromCart, trackUpdateCartQuantity, trackClearCart } from '@/lib/analytics'

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalAmount: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find((i) => i.id === item.id)
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          })
          // Track quantity update
          trackAddToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            type: item.type,
          })
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] })
          // Track new item added
          trackAddToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            type: item.type,
          })
        }
      },
      
      removeItem: (id) => {
        const item = get().items.find((i) => i.id === id)
        if (item) {
          trackRemoveFromCart({
            id: item.id,
            name: item.name,
            price: item.price,
          })
        }
        set({ items: get().items.filter((item) => item.id !== id) })
      },
      
      updateQuantity: (id, quantity) => {
        const item = get().items.find((i) => i.id === id)
        
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        if (item) {
          trackUpdateCartQuantity({
            id: item.id,
            name: item.name,
            oldQuantity: item.quantity,
            newQuantity: quantity,
          })
        }
        
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })
      },
      
      clearCart: () => {
        const itemCount = get().getTotalItems()
        const totalAmount = get().getTotalAmount()
        
        if (itemCount > 0) {
          trackClearCart(itemCount, totalAmount)
        }
        
        set({ items: [] })
      },
      
      getTotalAmount: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'restaurant-cart',
    }
  )
)
