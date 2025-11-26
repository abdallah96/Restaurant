import { MenuItem } from '@/types';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
        <span className="text-6xl">🍽️</span>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-neutral-800">{item.name}</h3>
          <span className="text-lg font-bold text-primary-500">
            {item.price.toLocaleString()} FCFA
          </span>
        </div>
        {item.description && <p className="text-neutral-600 mb-4">{item.description}</p>}
        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              item.is_available
                ? 'bg-secondary-100 text-secondary-700'
                : 'bg-neutral-200 text-neutral-600'
            }`}
          >
            {item.is_available ? 'Disponible' : 'Indisponible'}
          </span>
          {item.is_available && onAddToCart && (
            <button
              onClick={() => onAddToCart(item)}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              Ajouter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
