'use client'

import { MenuItem } from '@/types'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface AnimatedImageCardProps {
  item: MenuItem
  allItems: MenuItem[]
  index: number
}

export function AnimatedImageCard({ item, allItems, index }: AnimatedImageCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(index)
  const [fade, setFade] = useState(true)

  // Get items with images, excluding current item
  const itemsWithImages = allItems.filter((i) => i.image_url && i.id !== item.id)

  useEffect(() => {
    if (itemsWithImages.length === 0) return

    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrentImageIndex((prev) => {
          const nextIndex = (prev + 1) % itemsWithImages.length
          return nextIndex
        })
        setFade(true)
      }, 300)
    }, 3000)

    return () => clearInterval(interval)
  }, [itemsWithImages.length])

  const displayImage = itemsWithImages.length > 0 
    ? itemsWithImages[currentImageIndex]?.image_url || item.image_url
    : item.image_url

  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group">
      {displayImage ? (
        <div className="relative w-full h-full">
          <Image
            src={displayImage}
            alt={itemsWithImages.length > 0 ? (itemsWithImages[currentImageIndex]?.name || item.name) : item.name}
            fill
            className={`object-cover transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'} group-hover:scale-110 transition-transform duration-300`}
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
            <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              👆 Cliquez pour commander
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
          <span className="text-6xl">🍽️</span>
        </div>
      )}
    </div>
  )
}

