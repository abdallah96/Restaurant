'use client'

import { MenuItem as MenuItemType } from '@/types'
import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface AnimatedMenuItemProps {
  item: MenuItemType
}

export function AnimatedMenuItem({ item }: AnimatedMenuItemProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [fade, setFade] = useState(true)

  // Get all menu items to cycle through their images
  const [allMenuItems, setAllMenuItems] = useState<MenuItemType[]>([])

  useEffect(() => {
    // Fetch all menu items to get images for animation
    let mounted = true
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        if (mounted && data.success && data.data) {
          const itemsWithImages = data.data.filter((i: MenuItemType) => i.image_url && i.id !== item.id)
          if (itemsWithImages.length > 0) {
            setAllMenuItems(itemsWithImages)
          }
        }
      })
      .catch(console.error)
    
    return () => {
      mounted = false
    }
  }, [item.id])

  useEffect(() => {
    if (allMenuItems.length === 0) return

    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allMenuItems.length)
        setFade(true)
      }, 300) // Half of transition duration
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [allMenuItems.length])

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      type: 'menu_item',
      image_url: item.image_url,
    })
    toast.success(`${item.name} ajouté au panier!`)
  }

  // Use current item's image if no other items available, otherwise cycle through other items
  const displayImage = allMenuItems.length > 0 
    ? allMenuItems[currentImageIndex]?.image_url || item.image_url
    : item.image_url

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer border-2 border-orange-100 hover:border-orange-400 relative group">
      {/* Animated Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {displayImage ? (
          <div className="relative w-full h-full">
            <Image
              src={displayImage}
              alt={allMenuItems.length > 0 ? (allMenuItems[currentImageIndex]?.name || item.name) : item.name}
              fill
              className={`object-cover transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Click indicator overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-orange-600 flex items-center gap-2 animate-bounce">
                <span>👆</span>
                <span>Cliquez pour commander</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
            <span className="text-6xl">🍽️</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-orange-500">
            {item.price.toLocaleString()} FCFA
          </span>
          <Button onClick={handleAddToCart} size="sm" className="bg-orange-500 hover:bg-orange-600">
            Ajouter
          </Button>
        </div>
        {item.stock_quantity <= 10 && item.stock_quantity > 0 && (
          <p className="text-xs text-orange-600 mt-2 font-semibold">
            ⚡ Plus que {item.stock_quantity} disponible(s)!
          </p>
        )}
        {item.stock_quantity === 0 && (
          <p className="text-xs text-red-600 mt-2 font-semibold">Rupture de stock</p>
        )}
      </div>
    </div>
  )
}

