'use client'

import { MenuItem as MenuItemType, DailySpecial } from '@/types'
import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface MenuItemProps {
  item: MenuItemType | DailySpecial
  type: 'menu_item' | 'daily_special'
}

export function MenuItem({ item, type }: MenuItemProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      type,
      image_url: item.image_url,
    })
    toast.success(`${item.name} ajouté au panier!`)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {item.image_url && (
        <div className="h-48 bg-neutral-200 overflow-hidden">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold text-neutral-800 mb-2">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-neutral-600 mb-3">{item.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-500">
            {item.price.toLocaleString()} FCFA
          </span>
          <Button onClick={handleAddToCart} size="sm">
            Ajouter
          </Button>
        </div>
        {'stock_quantity' in item && item.stock_quantity <= 10 && item.stock_quantity > 0 && (
          <p className="text-xs text-orange-600 mt-2">
            Plus que {item.stock_quantity} disponible(s)!
          </p>
        )}
        {'stock_quantity' in item && item.stock_quantity === 0 && (
          <p className="text-xs text-red-600 mt-2 font-semibold">Rupture de stock</p>
        )}
      </div>
    </div>
  )
}
