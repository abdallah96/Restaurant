'use client'

import { MenuItem } from '@/types'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface SlidingMenuCarouselProps {
  items: MenuItem[]
}

export function SlidingMenuCarousel({ items }: SlidingMenuCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const itemsWithImages = items.filter((i) => i.image_url).slice(0, 8) // Show more items for carousel
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Duplicate items for infinite loop effect (3 copies for seamless looping)
  const duplicatedItems = itemsWithImages.length > 0 
    ? [...itemsWithImages, ...itemsWithImages, ...itemsWithImages]
    : []

  useEffect(() => {
    if (itemsWithImages.length <= 2 || isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1
        // When we reach the end of the second set, jump back to start of second set (seamlessly)
        if (nextIndex >= itemsWithImages.length * 2) {
          // Reset without animation by temporarily removing transition
          if (containerRef.current) {
            containerRef.current.style.transition = 'none'
            setTimeout(() => {
              if (containerRef.current) {
                containerRef.current.style.transition = ''
              }
            }, 50)
          }
          return itemsWithImages.length
        }
        return nextIndex
      })
    }, 3000) // Slide every 3 seconds

    return () => clearInterval(interval)
  }, [itemsWithImages.length, isPaused])

  // Start from middle section for seamless looping
  useEffect(() => {
    if (itemsWithImages.length > 0 && currentIndex === 0) {
      setCurrentIndex(itemsWithImages.length)
    }
  }, [itemsWithImages.length])

  if (itemsWithImages.length === 0) {
    return null
  }

  // Calculate transform: each card is 50% + gap
  const translatePercent = currentIndex * 50

  return (
    <Link href="/order#menu-fast-food" className="block">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-gray-900">Menu Fast Food</h2>
        <span className="text-sm text-orange-600 font-semibold animate-pulse">✨ Passez votre commande</span>
      </div>
      
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          ref={containerRef}
          className="flex transition-transform duration-500 ease-in-out gap-3"
          style={{ 
            transform: `translateX(calc(-${translatePercent}% - ${currentIndex * 0.75}rem))`
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="min-w-[calc(50%-0.375rem)] flex-shrink-0">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority={index >= itemsWithImages.length && index < itemsWithImages.length + 2}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                  <span className="text-6xl">🍽️</span>
                </div>
              )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                  <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    👆 Cliquez
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Dot indicators - show only for original items */}
        {itemsWithImages.length > 2 && (
          <div className="flex gap-1.5 justify-center mt-4">
            {itemsWithImages.map((_, idx) => {
              const displayIndex = currentIndex % itemsWithImages.length
              return (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === displayIndex ? 'bg-orange-500 w-6' : 'bg-gray-300 w-2'
                  }`}
                />
              )
            })}
          </div>
        )}
      </div>
    </Link>
  )
}

