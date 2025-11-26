'use client'

import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/Button'

export function Cart() {
  const { items, removeItem, updateQuantity, getTotalAmount, getTotalItems } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Votre panier</h2>
        <p className="text-neutral-600 text-center py-8">Votre panier est vide</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-2xl font-bold text-neutral-800 mb-4">
        Votre panier ({getTotalItems()})
      </h2>
      
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="border-b border-neutral-200 pb-3">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-neutral-800 flex-1">{item.name}</h3>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 text-sm ml-2"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <span className="font-bold text-primary-500">
                {(item.price * item.quantity).toLocaleString()} FCFA
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-300 pt-4 mb-4">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span className="text-primary-500">{getTotalAmount().toLocaleString()} FCFA</span>
        </div>
      </div>

      <a href="#checkout">
        <Button fullWidth size="lg">
          Commander
        </Button>
      </a>
    </div>
  )
}
