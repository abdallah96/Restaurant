'use client'

import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/Button'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function FloatingCart() {
  const { items, removeItem, updateQuantity, getTotalAmount, getTotalItems, deliveryZone, getDeliveryFee } = useCartStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasItems, setHasItems] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showAddAnimation, setShowAddAnimation] = useState(false)
  const previousItemCountRef = useRef(0)
  const cartRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (items.length > 0) {
      setHasItems(true)
      // Show animation when item count increases
      if (items.length > previousItemCountRef.current) {
        setShowAddAnimation(true)
        setTimeout(() => setShowAddAnimation(false), 2000)
        // Don't auto-open, just show animation
        setIsOpen(false)
        setIsMinimized(false)
      }
      previousItemCountRef.current = items.length
    } else {
      setHasItems(false)
      setIsOpen(false)
      setIsMinimized(false)
      previousItemCountRef.current = 0
    }
  }, [items.length])

  // Handle dragging with requestAnimationFrame for smoothness
  useEffect(() => {
    if (!isDragging || !cartRef.current) return

    let animationFrameId: number

    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }

      animationFrameId = requestAnimationFrame(() => {
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        
        // Constrain to viewport
        const maxX = window.innerWidth - (cartRef.current?.offsetWidth || 0)
        const maxY = window.innerHeight - (cartRef.current?.offsetHeight || 0)
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        })
      })
    }

    const handleMouseUp = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart])

  const handleDragStart = (e: React.MouseEvent) => {
    // Don't drag if clicking on buttons or interactive elements
    const target = e.target as HTMLElement
    if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
      return
    }
    
    if (!cartRef.current) return
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  // Don't show floating cart on order page where cart is already visible
  if (!hasItems || pathname === '/order') {
    return null
  }

  return (
    <>
      {/* Floating Cart Button - Always visible when items exist */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110 items-center gap-3 group ${
            showAddAnimation ? 'animate-bounce scale-125' : ''
          }`}
        >
          <div className="relative">
            <span className={`text-2xl transition-transform duration-300 ${showAddAnimation ? 'scale-150 rotate-12' : ''}`}>
              {showAddAnimation ? '✅' : '🛒'}
            </span>
            {getTotalItems() > 0 && (
              <span className={`absolute -top-2 -right-2 bg-white text-orange-500 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                showAddAnimation ? 'animate-ping scale-150' : ''
              }`}>
                {getTotalItems()}
              </span>
            )}
          </div>
          <div className="text-left opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <div className="text-sm font-semibold">{getTotalItems()} {getTotalItems() === 1 ? 'article' : 'articles'}</div>
            <div className="text-lg font-bold">{getTotalAmount().toLocaleString()} FCFA</div>
          </div>
        </button>
      )}

      {/* Floating Cart Sidebar - Draggable with Dynamic Height and Side Collapse */}
      {isOpen && (
        <div 
          ref={cartRef}
          className={`hidden lg:block fixed bg-white shadow-2xl z-50 rounded-tl-2xl rounded-bl-2xl transition-all duration-300 ${
            isMinimized ? 'w-16' : 'w-80'
          }`}
          style={{
            right: position.x || 0,
            top: position.y || 0,
            cursor: isDragging ? 'grabbing' : 'grab',
            maxHeight: '90vh'
          }}
        >
          <div 
            className="flex flex-col" 
            style={{ maxHeight: '90vh' }}
            onMouseDown={handleDragStart}
          >
            {/* Header - Draggable Handle */}
            <div 
              className="bg-orange-500 text-white p-4 flex items-center justify-between rounded-tl-2xl cursor-grab active:cursor-grabbing select-none"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                  <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                  <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                </div>
                {!isMinimized && (
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold">Panier</h2>
                    <p className="text-xs text-orange-100">{getTotalItems()} {getTotalItems() === 1 ? 'article' : 'articles'}</p>
                  </div>
                )}
                {isMinimized && (
                  <div className="text-center flex-1 relative">
                    <span className="text-2xl">🛒</span>
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-white text-orange-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMinimized(!isMinimized)
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="text-white hover:text-orange-200 transition-colors p-1 text-lg font-bold"
                  aria-label={isMinimized ? "Agrandir le panier" : "Réduire le panier"}
                >
                  {isMinimized ? '◀' : '▶'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(false)
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="text-white hover:text-orange-200 transition-colors p-1 text-xl font-bold"
                  aria-label="Fermer le panier"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Cart Items - More Compact - Dynamic Height - Hidden when minimized */}
            {!isMinimized && (
              <>
                <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                  {items.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 text-sm">Votre panier est vide</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="border-b border-gray-200 pb-3 last:border-0">
                          <div className="flex justify-between items-start mb-1.5">
                            <h3 className="font-semibold text-gray-900 flex-1 text-xs pr-2 line-clamp-2">{item.name}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeItem(item.id)
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="text-red-500 hover:text-red-600 text-xs ml-1 flex-shrink-0"
                          aria-label="Retirer du panier"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              updateQuantity(item.id, item.quantity - 1)
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="w-7 h-7 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 text-sm"
                            aria-label="Diminuer la quantité"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-semibold text-gray-900 text-sm">{item.quantity}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              updateQuantity(item.id, item.quantity + 1)
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="w-7 h-7 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 text-sm"
                            aria-label="Augmenter la quantité"
                          >
                            +
                          </button>
                        </div>
                            <span className="font-bold text-gray-900 text-sm">
                              {(item.price * item.quantity).toLocaleString()} FCFA
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer with Total and Checkout - More Compact */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>Sous-total:</span>
                      <span className="font-semibold">{(getTotalAmount() - getDeliveryFee()).toLocaleString()} FCFA</span>
                    </div>
                    {deliveryZone && (
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>Livraison:</span>
                        <span className="font-semibold">{getDeliveryFee().toLocaleString()} FCFA</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-base font-bold text-gray-900 pt-1.5 border-t border-gray-300">
                      <span>Total:</span>
                      <span className="text-lg text-orange-500">{getTotalAmount().toLocaleString()} FCFA</span>
                    </div>
                  </div>
                  <Link 
                    href="/order#checkout" 
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsOpen(false)
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Button fullWidth size="md" className="w-full text-sm py-2">
                      Commander
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

