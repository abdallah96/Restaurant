import { MenuItem } from '@/types';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden card-hover border-2 border-gray-100 hover:border-orange-300 transition-all">
      <div className="relative h-56 bg-gradient-to-br from-orange-100 via-orange-50 to-orange-50 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 african-pattern opacity-20"></div>
        <span className="text-7xl relative z-10 group-hover:scale-110 transition-transform duration-300">🍽️</span>
        {!item.is_available && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">Indisponible</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{item.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              {item.price.toLocaleString()} <span className="text-base">FCFA</span>
            </span>
            {item.is_available && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100  flex items-center gap-1">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse text-orange-600"></span>
                Disponiblesss
              </span>
            )}
          </div>
        </div>
        {item.description && (
          <p className="text-gray-600 mb-5 text-sm leading-relaxed line-clamp-2">{item.description}</p>
        )}
        {item.is_available && onAddToCart && (
          <button
            onClick={() => onAddToCart(item)}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-lg">🛒</span>
            Ajouter au panier
          </button>
        )}
      </div>
    </div>
  );
}
