'use client'

import { MenuItem } from '@/types'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface DesktopMenuShowcaseProps {
  items: MenuItem[]
}

export function DesktopMenuShowcase({ items }: DesktopMenuShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const itemsWithImages = items.filter((i) => i.image_url).slice(0, 10)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Duplicate items for infinite loop
  const duplicatedItems = itemsWithImages.length > 0 
    ? [...itemsWithImages, ...itemsWithImages, ...itemsWithImages]
    : []

  useEffect(() => {
    if (itemsWithImages.length <= 3 || isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1
        if (nextIndex >= itemsWithImages.length * 2) {
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
    }, 3500) // Slightly slower for desktop

    return () => clearInterval(interval)
  }, [itemsWithImages.length, isPaused])

  useEffect(() => {
    if (itemsWithImages.length > 0 && currentIndex === 0) {
      setCurrentIndex(itemsWithImages.length)
    }
  }, [itemsWithImages.length])

  if (itemsWithImages.length === 0) {
    return null
  }

  // Show 3-4 cards at once on desktop
  const cardsToShow = 4
  const gapRem = 1.5 // gap-6 = 1.5rem
  // With 4 cards and 3 gaps (1.5rem each), total gap space = 4.5rem
  // Each card width = (100% - 4.5rem) / 4 = 25% - 1.125rem
  // When moving one position left: move by exactly one card width + one gap
  // Card width: 25% - 1.125rem, Gap: 1.5rem, Total: 25% + 0.375rem
  const cardWidthPercent = 100 / cardsToShow // 25%
  const gapAdjustmentPerCard = (gapRem * (cardsToShow - 1)) / cardsToShow // 1.125rem
  const translatePercent = currentIndex * cardWidthPercent
  const gapOffset = currentIndex * (gapRem - gapAdjustmentPerCard) // 0.375rem per position
  // Move left: negative percentage and negative rem
  const translateWithGap = `calc(-${translatePercent}% - ${gapOffset}rem)`

  return (
    <div 
      className="relative py-12 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Découvrez nos <span className="text-orange-600">Délices</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Cliquez sur un plat pour commencer votre commande
          </p>
          
          {/* Single prominent CTA button */}
          <div className="mb-8">
            <Link href="/order#menu-fast-food">
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-4 mx-auto">
                <span className="text-3xl animate-bounce">🍽️</span>
                <span>Commander Maintenant</span>
                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>
          </div>
        </div>

        <div className="relative h-80">
          <div 
            ref={containerRef}
            className="flex transition-transform duration-700 ease-in-out gap-6 h-full"
            style={{ 
              transform: `translateX(${translateWithGap})`
            }}
          >
            {duplicatedItems.map((item, index) => {
              // Calculate position relative to center (3rd card in 4-card view - true middle)
              const centerOffset = 1.5 // Center is between card 1 and 2, favoring card 2 (index 2)
              const position = index - currentIndex
              const distanceFromCenter = Math.abs(position - centerOffset)
              
              // Scale: center card (card 2) is largest, others scale down
              // Reduced scale to prevent overlap
              const baseScale = distanceFromCenter <= 0.5 ? 1.05 : distanceFromCenter <= 1.5 ? 0.95 : 0.88
              const opacity = distanceFromCenter <= 0.5 ? 1 : distanceFromCenter <= 1.5 ? 0.85 : 0.7
              const zIndex = distanceFromCenter <= 0.5 ? 30 : distanceFromCenter <= 1.5 ? 20 : 10
              
              return (
                <div 
                  key={`${item.id}-${index}`} 
                  className="w-[calc(25%-1.125rem)] flex-shrink-0 h-full flex items-center justify-center"
                  style={{ zIndex }}
                >
                  <Link href="/order#menu-fast-food" className="block h-full w-full group">
                    <div 
                      className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-3xl"
                      style={{
                        transform: `scale(${baseScale})`,
                        opacity,
                        transformOrigin: 'center center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = `scale(${baseScale * 1.1})`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = `scale(${baseScale})`
                      }}
                    >
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 1280px) 25vw, 300px"
                          priority={index >= itemsWithImages.length && index < itemsWithImages.length + cardsToShow}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 flex items-center justify-center">
                          <span className="text-8xl">🍽️</span>
                        </div>
                      )}
                      
                      {/* Overlay with name - lighter, more visible */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
                        <div className="p-6 w-full">
                          <h3 className="text-white text-xl font-bold mb-2 drop-shadow-lg">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 text-white/95 text-sm">
                            <span className="font-semibold bg-orange-500/90 px-3 py-1 rounded-full">
                              {item.price.toLocaleString()} FCFA
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* Navigation dots */}
        {itemsWithImages.length > cardsToShow && (
          <div className="flex gap-2 justify-center mt-8">
            {itemsWithImages.map((_, idx) => {
              const displayIndex = currentIndex % itemsWithImages.length
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx + itemsWithImages.length)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    idx === displayIndex 
                      ? 'bg-orange-500 w-8 shadow-lg' 
                      : 'bg-gray-300 w-3 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

