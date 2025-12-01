'use client'

import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import Link from 'next/link'

export function MobileCartBar() {
  const { items, getTotalAmount, getTotalItems, deliveryZone, getDeliveryFee } = useCartStore()
  const [isExpanded, setIsExpanded] = useState(false)

  if (items.length === 0) {
    return null
  }

  return (
    <>
      {/* Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-orange-500 shadow-2xl z-50">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-2xl">🛒</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">
                  {getTotalItems()} {getTotalItems() === 1 ? 'article' : 'articles'}
                </div>
                <div className="text-lg font-bold text-orange-500">
                  {getTotalAmount().toLocaleString()} FCFA
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{isExpanded ? '▼' : '▲'}</span>
            </div>
          </button>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              <div className="max-h-48 overflow-y-auto space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900 flex-1">{item.name} x{item.quantity}</span>
                    <span className="font-semibold text-gray-700">
                      {(item.price * item.quantity).toLocaleString()} FCFA
                    </span>
                  </div>
                ))}
              </div>
              {deliveryZone && (
                <div className="flex justify-between items-center text-sm text-gray-600 pt-2 border-t border-gray-200">
                  <span>Livraison ({deliveryZone}):</span>
                  <span className="font-semibold">{getDeliveryFee().toLocaleString()} FCFA</span>
                </div>
              )}
              <Link href="/order#checkout" className="block">
                <Button fullWidth size="lg" className="w-full">
                  Commander
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Spacer to prevent content from being hidden behind the bar */}
      <div className="lg:hidden h-20"></div>
    </>
  )
}

